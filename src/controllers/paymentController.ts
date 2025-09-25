// /var/www/RestAPI/src/controllers/paymentController.ts
import { Request, Response } from 'express';
import Stripe from 'stripe';

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16', // Use the latest API version
});

/**
 * Create a payment intent
 * This is the first step in the payment process, where we tell Stripe
 * how much to charge and get back a client secret to use on the front end
 */
export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { amount, currency = 'usd', metadata = {} } = req.body;

        // Validate the amount
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            res.status(400).json({ message: 'Invalid amount provided' });
            return;
        }

        // Create the payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(amount) * 100), // Convert to cents
            currency,
            metadata: {
                ...metadata,
                integration_check: 'nvrs_payment'
            },
            payment_method_types: ['card'],
        });

        // Return the client secret to the frontend
        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error creating payment intent'
        });
    }
};

/**
 * Webhook handler for Stripe events
 * This allows us to receive notifications about payment events
 */
export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
        res.status(400).json({ message: 'Missing Stripe signature' });
        return;
    }

    try {
        // Verify the event is from Stripe
        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`Payment succeeded: ${paymentIntent.id}`);
                // Update order status in database
                // TODO: Implement order status update logic
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object as Stripe.PaymentIntent;
                console.log(`Payment failed: ${failedPayment.id}`);
                // Handle failed payment
                // TODO: Implement failure handling logic
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error processing webhook'
        });
    }
};

/**
 * Retrieve payment details for an order
 * This can be used to check the status of a payment
 */
export const getPaymentDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { paymentIntentId } = req.params;

        if (!paymentIntentId) {
            res.status(400).json({ message: 'Payment intent ID is required' });
            return;
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency,
            metadata: paymentIntent.metadata
        });
    } catch (error) {
        console.error('Error retrieving payment details:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Unknown error retrieving payment details'
        });
    }
};