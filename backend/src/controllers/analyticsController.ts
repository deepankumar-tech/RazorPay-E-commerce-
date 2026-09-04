import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { AnalyticsService } from '../services/analyticsService';
import { sendSuccess, sendError } from '../utils/response';

export class AnalyticsController {
  static async getMerchantAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) return sendError(res, 'Merchant context required', 'FORBIDDEN', 403);
      const analytics = await AnalyticsService.getMerchantAnalytics(req.user.merchantId);
      return sendSuccess(res, analytics);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch analytics', 'ANALYTICS_ERROR', 400);
    }
  }
}
