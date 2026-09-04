import prisma from '../config/database';
import { CampaignStatus } from '@prisma/client';

export class CampaignService {
  static async getCampaignsForMerchant(merchantId: string) {
    return prisma.campaign.findMany({
      where: { merchantId },
      include: {
        approvals: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createCampaignProposal(merchantId: string, data: {
    title: string;
    description: string;
    targetAudience: string;
    discountPercent: number;
    durationDays: number;
    targetProductIds?: string[];
    aiGenerated?: boolean;
  }) {
    return prisma.campaign.create({
      data: {
        merchantId,
        title: data.title,
        description: data.description,
        targetAudience: data.targetAudience,
        discountPercent: data.discountPercent,
        durationDays: data.durationDays,
        targetProductIds: data.targetProductIds || [],
        status: CampaignStatus.PROPOSED,
        aiGenerated: data.aiGenerated !== undefined ? data.aiGenerated : true,
      },
    });
  }

  static async reviewCampaign(campaignId: string, merchantUserId: string, action: 'APPROVED' | 'REJECTED', comment?: string) {
    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) {
      throw { statusCode: 404, message: 'Campaign not found', code: 'NOT_FOUND' };
    }

    const newStatus = action === 'APPROVED' ? CampaignStatus.APPROVED : CampaignStatus.REJECTED;

    await prisma.campaignApproval.create({
      data: {
        campaignId,
        merchantUserId,
        action,
        comment,
      },
    });

    const updated = await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: newStatus },
    });

    return updated;
  }
}
