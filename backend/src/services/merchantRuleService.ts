import prisma from '../config/database';

export class MerchantRuleService {
  static async getRulesByMerchantId(merchantId: string) {
    let rules = await prisma.merchantRule.findUnique({
      where: { merchantId },
    });

    if (!rules) {
      rules = await prisma.merchantRule.create({
        data: {
          merchantId,
          maxTransactionAmount: 5000,
          maxDiscountPercent: 10,
          maxUpsellAmount: 1500,
          requireCustomerConfirmation: true,
          allowAutoCartCreation: true,
          allowAiCampaignGeneration: true,
        },
      });
    }

    return rules;
  }

  static async updateRules(merchantId: string, data: any) {
    return prisma.merchantRule.upsert({
      where: { merchantId },
      update: data,
      create: {
        merchantId,
        ...data,
      },
    });
  }
}
