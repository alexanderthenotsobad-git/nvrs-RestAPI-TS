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
webhookRouter.post('/webhook', handleStripeWebhook);

// Regular JSON endpoints
router.post('/create-payment-intent', createPaymentIntent);
router.get('/payment-details/:paymentIntentId', getPaymentDetails);

export default router;