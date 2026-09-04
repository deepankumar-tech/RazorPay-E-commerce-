import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { TransactionGuard } from '../ai/guardrails/transactionGuard';
import { AuditService } from '../services/auditService';
import { sendSuccess, sendError } from '../utils/response';
import prisma from '../config/database';

export class TransactionController {
  static async validate(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const { cartId, customerConfirmed, expectedTotal, discountPercentApplied } = req.body;

      const result = await TransactionGuard.validateCheckoutProposal({
        userId: req.user.userId,
        cartId,
        customerConfirmed: customerConfirmed !== undefined ? customerConfirmed : true,
        expectedTotal,
        discountPercentApplied,
      });

      return sendSuccess(res, result, result.allowed ? 'Transaction passed guard checks' : 'Transaction failed guard checks');
    } catch (error: any) {
      return sendError(res, error.message || 'Validation failed', 'VALIDATION_ERROR', 400);
    }
  }

  static async approve(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const { id } = req.params;

      await AuditService.log({
        actorId: req.user.userId,
        actorType: req.user.role,
        action: 'TRANSACTION_APPROVED',
        resource: 'Transaction',
        resourceId: id as string,
        status: 'SUCCESS',
        reason: 'User or merchant approved transaction proposal via Transaction Guard.',
      });

      return sendSuccess(res, { id, status: 'APPROVED', approvedAt: new Date() }, 'Transaction approved');
    } catch (error: any) {
      return sendError(res, error.message || 'Approval failed', 'APPROVAL_ERROR', 400);
    }
  }

  static async reject(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'User context missing', 'UNAUTHORIZED', 401);
      const { id } = req.params;
      const { reason } = req.body;

      await AuditService.log({
        actorId: req.user.userId,
        actorType: req.user.role,
        action: 'TRANSACTION_REJECTED',
        resource: 'Transaction',
        resourceId: id as string,
        status: 'REJECTED',
        reason: reason || 'Transaction proposal rejected by user or merchant.',
      });

      return sendSuccess(res, { id, status: 'REJECTED', rejectedAt: new Date(), reason }, 'Transaction rejected');
    } catch (error: any) {
      return sendError(res, error.message || 'Rejection failed', 'REJECT_ERROR', 400);
    }
  }
}
