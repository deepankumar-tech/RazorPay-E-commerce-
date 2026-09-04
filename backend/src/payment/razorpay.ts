import Razorpay from 'razorpay';
import { env } from '../config/env';

export const getRazorpayInstance = () => {
  const keyId = env.RAZORPAY_KEY_ID || 'rzp_test_fallback_key';
  const keySecret = env.RAZORPAY_KEY_SECRET || 'fallback_secret_key';

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};
