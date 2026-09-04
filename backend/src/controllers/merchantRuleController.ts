import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { MerchantRuleService } from '../services/merchantRuleService';
import { sendSuccess, sendError } from '../utils/response';

export class MerchantRuleController {
  static async getRules(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) return sendError(res, 'Merchant context required', 'FORBIDDEN', 403);
      const rules = await MerchantRuleService.getRulesByMerchantId(req.user.merchantId);
      return sendSuccess(res, rules);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch rules', 'RULES_ERROR', 400);
    }
  }

  static async updateRules(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) return sendError(res, 'Merchant context required', 'FORBIDDEN', 403);
      const rules = await MerchantRuleService.updateRules(req.user.merchantId, req.body);
      return sendSuccess(res, rules, 'Merchant guardrail rules updated successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update rules', 'RULES_UPDATE_ERROR', 400);
    }
  }
}
