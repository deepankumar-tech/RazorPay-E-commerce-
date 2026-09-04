import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { CampaignService } from '../services/campaignService';
import { sendSuccess, sendError } from '../utils/response';

export class CampaignController {
  static async getMerchantCampaigns(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) return sendError(res, 'Merchant context required', 'FORBIDDEN', 403);
      const campaigns = await CampaignService.getCampaignsForMerchant(req.user.merchantId);
      return sendSuccess(res, { count: campaigns.length, campaigns });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch campaigns', 'CAMPAIGNS_ERROR', 400);
    }
  }

  static async generateCampaignProposal(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) return sendError(res, 'Merchant context required', 'FORBIDDEN', 403);
      const { title, description, targetAudience, discountPercent, durationDays, targetProductIds } = req.body;

      const campaign = await CampaignService.createCampaignProposal(req.user.merchantId, {
        title: title || 'Boost Sales & Cross-Sell',
        description: description || 'Target customers purchasing laptops with complementary USB hubs and bag accessories.',
        targetAudience: targetAudience || 'Recent product purchasers',
        discountPercent: discountPercent || 10,
        durationDays: durationDays || 7,
        targetProductIds,
        aiGenerated: true,
      });

      return sendSuccess(res, campaign, 'AI campaign proposal generated. Requires merchant review & approval.', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to generate campaign proposal', 'CAMPAIGN_GEN_ERROR', 400);
    }
  }

  static async reviewCampaign(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) return sendError(res, 'Merchant context required', 'FORBIDDEN', 403);
      const { campaignId } = req.params;
      const { action, comment } = req.body; // 'APPROVED' or 'REJECTED'

      if (!['APPROVED', 'REJECTED'].includes(action)) {
        return sendError(res, 'Action must be APPROVED or REJECTED', 'INVALID_ACTION', 400);
      }

      const updated = await CampaignService.reviewCampaign(campaignId as string, req.user.userId, action, comment);
      return sendSuccess(res, updated, `Campaign marked as ${action}`);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to review campaign', 'REVIEW_ERROR', 400);
    }
  }
}
