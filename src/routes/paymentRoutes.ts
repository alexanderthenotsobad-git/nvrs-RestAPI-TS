// /var/www/RestAPI-dev/src/routes/paymentRoutes.ts

import express from 'express';
import {
    createPaymentIntent,
    handleStripeWebhook,
    getPaymentDetails
} from '../controllers/paymentController';

const router = express.Router();

// Webhook must be raw body - separate router
export const webhookRouter = express.Router();
webhookRouter.use(express.raw({ type: 'application/json' }));

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Stripe payment intents and order settlement
 */

/**
 * @swagger
 * /api/create-payment-intent:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a Stripe PaymentIntent for a cart
 *     description: >
 *       Recalculates the total from the database, rejects the request if the
 *       client-supplied amount differs by more than one cent, creates the
 *       PaymentIntent, then writes the order and its line items.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, patron_id, amount]
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [item_id, quantity]
 *                   properties:
 *                     item_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *               patron_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *                 description: Client-calculated total in USD; must match the server total within $0.01
 *           example:
 *             items:
 *               - item_id: 55
 *                 quantity: 2
 *             patron_id: 12
 *             amount: 16.00
 *     responses:
 *       200:
 *         description: PaymentIntent created and order recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *                   description: Stripe client secret used by Stripe.js to confirm payment
 *                 orderId:
 *                   type: integer
 *       400:
 *         description: Missing items, patron_id, or a valid amount
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: A cart item does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       405:
 *         description: Client amount does not match the server-calculated total
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Amount mismatch
 *                 frontend_amount:
 *                   type: number
 *                 backend_amount:
 *                   type: number
 *       500:
 *         description: Stripe or database failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/create-payment-intent', createPaymentIntent);

/**
 * @swagger
 * /api/payment-details/{paymentIntentId}:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Get payment status for an order
 *     description: Looks up the PaymentIntent at Stripe and joins the local order row.
 *     parameters:
 *       - in: path
 *         name: paymentIntentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Stripe PaymentIntent ID, e.g. pi_3N...
 *     responses:
 *       200:
 *         description: Payment status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stripe_status:
 *                   type: string
 *                   example: succeeded
 *                 local_status:
 *                   type: string
 *                   nullable: true
 *                   example: paid
 *                 amount:
 *                   type: number
 *                   description: Amount in USD (Stripe cents divided by 100)
 *                 currency:
 *                   type: string
 *                   example: usd
 *                 order_id:
 *                   type: integer
 *                   nullable: true
 *       400:
 *         description: Payment intent ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Stripe lookup or database failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/payment-details/:paymentIntentId', getPaymentDetails);

/**
 * @swagger
 * /api/webhook:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Stripe webhook receiver
 *     description: >
 *       Mounted before express.json() so the raw body survives signature
 *       verification. Updates orders on payment_intent.succeeded,
 *       payment_intent.payment_failed, and similar events. Configure this URL in
 *       the Stripe dashboard; callers are Stripe, not clients.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Raw Stripe event object
 *     responses:
 *       200:
 *         description: Event received and processed (or ignored)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Signature verification or event handling failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
webhookRouter.post('/webhook', handleStripeWebhook);

export default router;
