import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { PaymentService } from '../payment/paymentService';
import { sendSuccess, sendError } from '../utils/response';

export class PaymentController {
  static async createRazorpayOrder(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const { cartId, customerConfirmed, discountPercentApplied, paymentMethod } = req.body;

      if (!customerConfirmed) {
        return sendError(
          res,
          'Explicit customer confirmation is required before financial payment action.',
          'CUSTOMER_CONFIRMATION_REQUIRED',
          400
        );
      }

      const result = await PaymentService.createOrderAndRazorpayOrder({
        userId: req.user.userId,
        cartId,
        customerConfirmed,
        discountPercentApplied,
        paymentMethod,
      });

      return sendSuccess(res, result, 'Razorpay test mode order created successfully');
    } catch (error: any) {
      if (error.statusCode) return sendError(res, error.message, error.code, error.statusCode, error.violations);
      return sendError(res, error.message || 'Payment initialization failed', 'PAYMENT_INIT_ERROR', 400);
    }
  }

  static async verifyPayment(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      const result = await PaymentService.verifyPaymentSignature({
        userId: req.user.userId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      return sendSuccess(res, result, 'Razorpay payment verified and order marked as PAID');
    } catch (error: any) {
      if (error.statusCode) return sendError(res, error.message, error.code, error.statusCode);
      return sendError(res, error.message || 'Payment verification failed', 'VERIFICATION_ERROR', 400);
    }
  }

  static async handlePaymentFailure(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const { razorpayOrderId, failureReason } = req.body;

      const result = await PaymentService.handlePaymentFailure({
        userId: req.user.userId,
        razorpayOrderId,
        failureReason,
      });

      return sendSuccess(res, result, 'Payment failure handled gracefully without duplicate charging');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to record payment failure', 'FAILURE_HANDLING_ERROR', 400);
    }
  }
}
