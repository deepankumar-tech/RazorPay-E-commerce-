import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/create-razorpay-order', PaymentController.createRazorpayOrder);
router.post('/verify-payment', PaymentController.verifyPayment);
router.post('/handle-failure', PaymentController.handlePaymentFailure);

export default router;
