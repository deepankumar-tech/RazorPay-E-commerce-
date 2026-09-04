import crypto from 'crypto';
import { env } from '../config/env';

export class PaymentVerification {
  static verifySignature(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): boolean {
    const keySecret = env.RAZORPAY_KEY_SECRET || 'fallback_secret_key';

    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    return generatedSignature === razorpaySignature;
  }
}
