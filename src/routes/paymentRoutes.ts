import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Webhook must be raw - separate router
export const webhookRouter = express.Router();
webhookRouter.use(express.raw({ type: 'application/json' }));

webhookRouter.post('/webhook', async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers['stripe-signature'] as string | undefined;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET is not set');
        res.status(500).json({ error: 'Webhook secret not configured' });
        return;
    }

    if (!sig) {
        console.error('No stripe signature header');
        res.status(400).json({ error: 'No signature header' });
        return;
    }

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

        console.log(`Event type: ${event.type}`);  // <-- PUT IT HERE, after constructEvent

        if (event.type === 'payment_intent.succeeded') {
            console.log('Processing payment_intent.succeeded');
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log(`Intent ID: ${paymentIntent.id}`);

            await pool.query(
                `UPDATE orders 
             SET stripe_payment_status = 'paid', update_time = NOW() 
             WHERE stripe_payment_intent_id = ?`,
                [paymentIntent.id]
            );
            console.log(`Updated order for intent: ${paymentIntent.id}`);
        }

        if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            await pool.query(
                `UPDATE orders 
             SET stripe_payment_status = 'failed', update_time = NOW() 
             WHERE stripe_payment_intent_id = ?`,
                [paymentIntent.id]
            );
            console.log(`Payment failed for intent: ${paymentIntent.id}`);
        }

        res.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});

// Regular JSON endpoints
router.post('/create-payment-intent', (req: Request, res: Response): void => {
    console.log('Handler reached');
    let body = req.body;
    if (Buffer.isBuffer(body)) {
        body = JSON.parse(body.toString());
    }

    console.log('Parsed body:', body);

    (async () => {
        try {
            const { items, patron_id } = body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                res.status(400).json({ error: 'No items in cart' });
                return;
            }

            let totalAmount = 0;
            for (const item of items) {
                const [rows] = await pool.query<RowDataPacket[]>(
                    'SELECT price FROM menu_items WHERE item_id = ?',
                    [item.item_id]
                );

                if (rows.length === 0) {
                    res.status(404).json({ error: `Item ${item.item_id} not found` });
                    return;
                }
                totalAmount += parseFloat(rows[0].price as string) * item.quantity;
            }

            const amountInCents = Math.round(totalAmount * 100);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: 'usd',
                metadata: {
                    patron_id: patron_id?.toString() || '1',
                    item_count: items.length.toString()
                }
            });

            const [result] = await pool.query(
                `UPDATE orders SET stripe_payment_status = 'paid', update_time = NOW() 
     WHERE stripe_payment_intent_id = ?`,
                [paymentIntent.id]
            );
            console.log(`Rows affected:`, result.affectedRows);
            const orderId = result.insertId;

            for (const item of items) {
                await pool.query(
                    `INSERT INTO order_items (order_id, item_id, quantity, price_at_time)
                     VALUES (?, ?, ?, (SELECT price FROM menu_items WHERE item_id = ?))`,
                    [orderId, item.item_id, item.quantity, item.item_id]
                );
            }

            res.json({
                clientSecret: paymentIntent.client_secret,
                orderId: orderId
            });

        } catch (error) {
            console.error('Payment intent error:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    })();
});

export default router;