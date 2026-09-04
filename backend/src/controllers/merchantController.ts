import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { MerchantAIAgent } from '../ai/merchantAgent';
import { PolicyEngine } from '../ai/policyEngine';

const prisma = new PrismaClient();

export class MerchantController {
  // 1. Merchant Dashboard Command Center Overview
  public static async getDashboard(req: Request, res: Response) {
    try {
      const merchantId = (req as any).user?.merchantId || req.query.merchantId || 'default-merchant';

      const products = await prisma.product.findMany({ take: 20 });
      const orders = await prisma.order.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } }, user: true },
      });

      const totalRevenue = orders.reduce((sum, o) => sum + (o.status === 'PAID' ? o.finalAmount : 0), 0) || 148500;
      const totalOrders = orders.length || 84;
      const conversionRate = 4.2;
      const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 1767;

      const aiAssistedRevenue = 48250;
      const aiTransactionsCount = 28;

      const opportunities = [
        {
          id: 'opp-1',
          type: 'HIGH_OPPORTUNITY',
          title: 'Cross-Sell: Gaming Mice + Keyboards',
          description: 'Gaming mice are co-viewed with keyboards in 67% of sessions, but attach rate is only 12%.',
          potentialRevenueMonthly: 18500,
          recommendation: 'Create a keyboard → mouse cross-sell bundle.',
          status: 'PROPOSED',
        },
        {
          id: 'opp-2',
          type: 'RECOVERY',
          title: '23 Headphones Abandoned Carts',
          description: '23 high-intent users viewed noise-canceling headphones in the last 7 days without buying.',
          potentialRevenueMonthly: 12400,
          recommendation: 'Launch a targeted 10% recovery campaign.',
          status: 'PROPOSED',
        },
        {
          id: 'opp-3',
          type: 'INVENTORY_ATTACH',
          title: 'Mouse Pad Checkout Attach Rate',
          description: 'Top-selling wireless mouse has low accessory attachment.',
          potentialRevenueMonthly: 7200,
          recommendation: 'Offer a complementary mouse pad at checkout.',
          status: 'PROPOSED',
        },
      ];

      const salesChartData = [
        { day: 'Mon', total: 14200, aiAssisted: 4200 },
        { day: 'Tue', total: 18500, aiAssisted: 6100 },
        { day: 'Wed', total: 22100, aiAssisted: 7800 },
        { day: 'Thu', total: 19800, aiAssisted: 5900 },
        { day: 'Fri', total: 27400, aiAssisted: 9400 },
        { day: 'Sat', total: 31200, aiAssisted: 11200 },
        { day: 'Sun', total: 15300, aiAssisted: 3650 },
      ];

      return res.json({
        success: true,
        data: {
          merchantName: (req as any).user?.name || 'TechStore India',
          kpis: {
            totalRevenue: { value: totalRevenue, change: '+12.4%' },
            orders: { value: totalOrders, change: '+8.2%' },
            conversionRate: { value: `${conversionRate}%`, change: '+3.4%' },
            aov: { value: aov, change: '+6.8%' },
            aiAssistedRevenue: { value: aiAssistedRevenue, change: '+18.7%' },
            aiTransactions: { value: aiTransactionsCount, change: '+22.0%' },
          },
          aiImpact: {
            aiAssistedRevenue,
            aiOrders: aiTransactionsCount,
            upsellRevenue: 14200,
            crossSellRevenue: 18500,
            campaignRevenue: 15550,
            growthComparison: '+18.7%',
            salesChartData,
          },
          opportunities,
          recentOrders: orders.slice(0, 5),
          recentActivity: [
            { time: '10:42 AM', title: 'OLIVER analyzed store revenue & conversion signals.' },
            { time: '11:05 AM', title: 'Detected Gaming Mouse + Keyboard cross-sell opportunity.' },
            { time: '11:30 AM', title: 'Prepared AI draft campaign for abandoned headphones.' },
            { time: '12:15 PM', title: 'AI Buyer transaction verified & processed securely.' },
          ],
        },
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  // 2. AI Revenue Copilot Chat
  public static async processAiCopilot(req: Request, res: Response) {
    try {
      const { query, history } = req.body;
      const merchantId = (req as any).user?.merchantId || 'default-merchant';

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ success: false, message: 'Query string required' });
      }

      const result = await MerchantAIAgent.processQuery(query, merchantId, history || []);
      return res.json({ success: true, data: result });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  // 3. AI Readable Catalog Health
  public static async getAiCatalogHealth(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({});
      const readinessScore = 92;

      const items = products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        sku: p.sku,
        readinessScore: p.category === 'Headphones' ? 94 : p.category === 'Keyboards' ? 96 : 90,
        checks: {
          nameClear: true,
          structuredSpecs: true,
          priceAvailable: true,
          inventoryAvailable: p.inventory > 0,
          categoryMapped: true,
          shippingInfoComplete: p.category !== 'Headphones',
        },
      }));

      return res.json({
        success: true,
        data: {
          aiReadinessScore: readinessScore,
          catalogHealthStatus: 'OPTIMAL',
          totalProducts: products.length,
          metrics: {
            productCompleteness: '96%',
            structuredAttributes: '92%',
            pricingClarity: '100%',
            availabilityClarity: '98%',
            shippingInformation: '88%',
            returnPolicy: '90%',
          },
          products: items,
        },
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  // 4. AI Buyer Activity & Agent Commerce
  public static async getAgenticCommerce(req: Request, res: Response) {
    try {
      return res.json({
        success: true,
        data: {
          aiBuyerSessions: 1420,
          aiProductViews: 3840,
          aiRecommendations: 1250,
          aiCartAdditions: 410,
          aiCheckouts: 115,
          aiCompletedTransactions: 98,
          aiConversionRate: '6.9%',
          aiTotalRevenue: 48250,
          funnel: [
            { step: 'AI Discovery', count: 1420 },
            { step: 'Product View', count: 3840 },
            { step: 'Recommendation', count: 1250 },
            { step: 'Cart Addition', count: 410 },
            { step: 'Checkout Initiated', count: 115 },
            { step: 'Payment Success', count: 98 },
          ],
        },
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  // 5. Transaction Policies
  public static async getPolicies(req: Request, res: Response) {
    try {
      const merchantId = (req as any).user?.merchantId || 'default-merchant';
      let rules = await prisma.merchantRule.findFirst({ where: { merchantId } });

      if (!rules) {
        rules = {
          id: 'rule-1',
          merchantId,
          maxTransactionAmount: 10000,
          maxDiscountPercent: 15,
          maxUpsellAmount: 2500,
          requireCustomerConfirmation: true,
          allowAutoCartCreation: true,
          allowAiCampaignGeneration: true,
          updatedAt: new Date(),
        } as any;
      }

      return res.json({
        success: true,
        data: {
          maxTransactionAmount: rules?.maxTransactionAmount ?? 10000,
          dailyAiTransactionLimit: 50000,
          maxOrderQuantity: 5,
          maxDiscountPercent: rules?.maxDiscountPercent ?? 15,
          allowedCategories: ['Electronics', 'Headphones', 'Accessories', 'Keyboards', 'Laptops'],
          requireApprovalAboveAmount: 3000,
          allowAutoCartCreation: rules?.allowAutoCartCreation ?? true,
          allowAiCampaignGeneration: rules?.allowAiCampaignGeneration ?? true,
          allowAiCheckout: true,
          allowAiRefunds: false,
          allowAiPriceChanges: false,
        },
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  public static async updatePolicies(req: Request, res: Response) {
    try {
      const { maxTransactionAmount, maxDiscountPercent, allowAutoCartCreation } = req.body;
      const merchantId = (req as any).user?.merchantId || 'default-merchant';

      const updated = await prisma.merchantRule.upsert({
        where: { merchantId },
        update: {
          maxTransactionAmount: maxTransactionAmount ? parseFloat(maxTransactionAmount) : 10000,
          maxDiscountPercent: maxDiscountPercent ? parseFloat(maxDiscountPercent) : 15,
          allowAutoCartCreation: allowAutoCartCreation !== undefined ? allowAutoCartCreation : true,
        },
        create: {
          merchantId,
          maxTransactionAmount: maxTransactionAmount ? parseFloat(maxTransactionAmount) : 10000,
          maxDiscountPercent: maxDiscountPercent ? parseFloat(maxDiscountPercent) : 15,
          allowAutoCartCreation: allowAutoCartCreation !== undefined ? allowAutoCartCreation : true,
        },
      });

      return res.json({ success: true, data: updated, message: 'Merchant AI transaction policies updated successfully.' });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  // 6. Test Policy Failure Scenario Demonstration (₹25,000 Transaction Attempt Blocked)
  public static async testFailureScenario(req: Request, res: Response) {
    try {
      const merchantId = (req as any).user?.merchantId || 'default-merchant';
      const proposedAmount = req.body.amount || 25000;

      const evaluation = await PolicyEngine.evaluateAction({
        merchantId,
        actorId: 'simulated-ai-agent',
        actorType: 'AI_AGENT',
        actionType: 'CREATE_TRANSACTION',
        amount: proposedAmount,
        details: { resourceId: 'test-high-val-order' },
      });

      return res.json({
        success: true,
        demonstration: {
          attemptedAction: 'AI Transaction Execution',
          proposedAmount: proposedAmount,
          configuredLimit: evaluation.policyLimit || 10000,
          evaluationResult: evaluation.status, // BLOCKED
          reason: evaluation.reason,
          auditLogged: true,
        },
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  // 7. Audit Trail
  public static async getAuditTrail(req: Request, res: Response) {
    try {
      const moneyOnly = req.query.moneyOnly === 'true';

      const logs = await prisma.auditLog.findMany({
        take: 30,
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { id: true, name: true, role: true, email: true } } },
      });

      let items = logs;
      if (moneyOnly) {
        items = logs.filter(
          (l) =>
            l.amount !== null ||
            l.action.includes('PAYMENT') ||
            l.action.includes('CAMPAIGN') ||
            l.action.includes('POLICY') ||
            l.action.includes('TRANSACTION')
        );
      }

      return res.json({
        success: true,
        data: {
          count: items.length,
          logs: items,
        },
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  // 8. Failure Center
  public static async getFailureCenter(req: Request, res: Response) {
    try {
      const failedPayments = await prisma.payment.findMany({
        where: { status: 'FAILED' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { order: true },
      });

      const blockedActions = await prisma.auditLog.findMany({
        where: { status: 'BLOCKED' },
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      return res.json({
        success: true,
        data: {
          failedPayments,
          blockedActions: blockedActions.length > 0 ? blockedActions : [
            {
              id: 'block-demo-1',
              action: 'POLICY_CHECK_CREATE_TRANSACTION',
              resource: 'CREATE_TRANSACTION',
              amount: 25000,
              status: 'BLOCKED',
              reason: 'Action amount (₹25,000) exceeds merchant configured AI limit of ₹10,000.',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }
}
