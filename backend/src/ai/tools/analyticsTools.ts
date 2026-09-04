import { AnalyticsService } from '../../services/analyticsService';
import { CampaignService } from '../../services/campaignService';

export const analyticsTools = {
  get_sales_insights: async (args: { merchantId: string }) => {
    const analytics = await AnalyticsService.getMerchantAnalytics(args.merchantId);
    return {
      metrics: analytics.metrics,
      aiInsights: analytics.aiInsights,
      topProducts: analytics.topProducts.map((tp) => ({
        name: tp.product.name,
        category: tp.product.category,
        unitsSold: tp.count,
        revenue: tp.revenue,
      })),
      lowStockAlertsCount: analytics.lowStockProducts.length,
    };
  },

  generate_campaign_proposal: async (args: {
    merchantId: string;
    title: string;
    description: string;
    targetAudience: string;
    discountPercent: number;
    durationDays: number;
  }) => {
    const campaign = await CampaignService.createCampaignProposal(args.merchantId, {
      title: args.title,
      description: args.description,
      targetAudience: args.targetAudience,
      discountPercent: args.discountPercent,
      durationDays: args.durationDays,
      aiGenerated: true,
    });

    return {
      campaignId: campaign.id,
      title: campaign.title,
      status: campaign.status, // PROPOSED
      message: 'Campaign proposal created successfully. Merchant review and explicit approval required before activation.',
    };
  },
};
