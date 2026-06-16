// /var/www/RestAPI-dev/src/controllers/paymentController.ts

import { Request, Response } from 'express';
import Stripe from 'stripe';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-04-30.basil',
});

// Calculate total from menu items in database
const calculateTotalFromItems = async (items: { item_id: number; quantity: number }[]): Promise<number> => {
    let total = 0;
    for (const item of items) {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT price FROM menu_items WHERE item_id = ?',
            [item.item_id]
        );
        if (rows.length === 0) {
            throw new Error(`Item ${item.item_id} not found`);
        }
        total += parseFloat(rows[0].price) * item.quantity;
    }
    return total;
};

// Create a payment intent
export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { items, patron_id, amount: frontendAmount } = req.body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ error: 'No items in cart' });
            return;
        }

        if (!patron_id) {
            res.status(400).json({ error: 'patron_id is required' });
            return;
        }

        if (frontendAmount === undefined || isNaN(Number(frontendAmount)) || Number(frontendAmount) <= 0) {
            res.status(400).json({ error: 'Valid amount is required' });
            return;
        }

        // Calculate backend total
        let backendTotal: number;
        try {
            backendTotal = await calculateTotalFromItems(items);
        } catch (error) {
            res.status(404).json({ error: error instanceof Error ? error.message : 'Item not found' });
            return;
        }

        // Validate amount matches
        const frontendAmountNum = Number(frontendAmount);
        if (Math.abs(frontendAmountNum - backendTotal) > 0.01) { // Allow 1 cent rounding difference
            console.error(`Amount mismatch - Frontend: $${frontendAmountNum}, Backend: $${backendTotal}`);
            res.status(405).json({
                error: 'Amount mismatch',
                frontend_amount: frontendAmountNum,
                backend_amount: backendTotal
            });
            return;
        }

        // Convert dollars to cents for Stripe
        const amountInCents = Math.round(backendTotal * 100);

        // Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            metadata: {
                patron_id: patron_id.toString(),
                item_count: items.length.toString()
            },
            payment_method_types: ['card'],
        });

        // Insert order into database
        const [orderResult] = await pool.query<ResultSetHeader>(
            `INSERT INTO orders (patron_id, total_amount, stripe_payment_intent_id, stripe_payment_status) 
             VALUES (?, ?, ?, 'pending')`,
            [patron_id, backendTotal, paymentIntent.id]
        );

        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of items) {
            // Get price at time of order
            const [priceRows] = await pool.query<RowDataPacket[]>(
                'SELECT price FROM menu_items WHERE item_id = ?',
                [item.item_id]
            );
            const priceAtTime = parseFloat(priceRows[0].price);

            await pool.query(
                `INSERT INTO order_items (order_id, item_id, quantity, price_at_time)
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.item_id, item.quantity, priceAtTime]
            );
        }

        res.json({
            clientSecret: paymentIntent.client_secret,
            orderId: orderId
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error creating payment intent'
        });
    }
};

// Webhook handler for Stripe events
export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
        res.status(400).json({ error: 'Missing Stripe signature' });
        return;
    }

    if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET is not set');
        res.status(500).json({ error: 'Webhook secret not configured' });
        return;
    }

    try {
        const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`Payment succeeded: ${paymentIntent.id}`);

                await pool.query(
                    `UPDATE orders 
                     SET stripe_payment_status = 'paid', update_time = NOW() 
                     WHERE stripe_payment_intent_id = ?`,
                    [paymentIntent.id]
                );
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object as Stripe.PaymentIntent;
                console.log(`Payment failed: ${failedPayment.id}`);

                await pool.query(
                    `UPDATE orders 
                     SET stripe_payment_status = 'failed', update_time = NOW() 
                     WHERE stripe_payment_intent_id = ?`,
                    [failedPayment.id]
                );
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });

    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Unknown error processing webhook'
        });
    }
};

// Retrieve payment details for an order
export const getPaymentDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { paymentIntentId } = req.params;

        if (!paymentIntentId) {
            res.status(400).json({ error: 'Payment intent ID is required' });
            return;
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Also check local database
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT order_id, stripe_payment_status FROM orders WHERE stripe_payment_intent_id = ?',
            [paymentIntentId]
        );

        res.json({
            stripe_status: paymentIntent.status,
            local_status: rows.length > 0 ? rows[0].stripe_payment_status : null,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            order_id: rows.length > 0 ? rows[0].order_id : null
        });

    } catch (error) {
        console.error('Error retrieving payment details:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error retrieving payment details'
        });
    }
};