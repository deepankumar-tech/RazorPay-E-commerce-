import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PolicyCheckRequest {
  merchantId: string;
  actorId: string;
  actorType: 'AI_AGENT' | 'MERCHANT' | 'CUSTOMER' | 'SYSTEM';
  actionType:
    | 'APPLY_DISCOUNT'
    | 'CREATE_CAMPAIGN'
    | 'CREATE_TRANSACTION'
    | 'PROCESS_REFUND'
    | 'CHANGE_PRICE'
    | 'CREATE_CART'
    | 'INITIATE_CHECKOUT';
  amount?: number;
  quantity?: number;
  category?: string;
  details?: Record<string, any>;
}

export interface PolicyCheckResult {
  status: 'ALLOWED' | 'APPROVAL_REQUIRED' | 'BLOCKED';
  reason: string;
  policyLimit?: number;
  requiresApproval: boolean;
  moneyAction: boolean;
}

export class PolicyEngine {
  public static async evaluateAction(req: PolicyCheckRequest): Promise<PolicyCheckResult> {
    // 1. Fetch Merchant Policy Rules
    let rules = await prisma.merchantRule.findUnique({
      where: { merchantId: req.merchantId },
    });

    if (!rules) {
      rules = await prisma.merchantRule.create({
        data: {
          merchantId: req.merchantId,
          maxTransactionAmount: 10000,
          maxDiscountPercent: 15,
          maxUpsellAmount: 2500,
          requireCustomerConfirmation: true,
          allowAutoCartCreation: true,
          allowAiCampaignGeneration: true,
        },
      });
    }

    const amount = req.amount || 0;
    const isMoneyAction = ['APPLY_DISCOUNT', 'CREATE_CAMPAIGN', 'CREATE_TRANSACTION', 'PROCESS_REFUND', 'CHANGE_PRICE'].includes(
      req.actionType
    );

    let resultStatus: 'ALLOWED' | 'APPROVAL_REQUIRED' | 'BLOCKED' = 'ALLOWED';
    let reason = 'Action satisfies merchant agentic policies.';
    let policyLimit = rules.maxTransactionAmount;
    let requiresApproval = false;

    // 2. High-Risk Action Check: Price changes & Refunds
    if (req.actionType === 'CHANGE_PRICE' || req.actionType === 'PROCESS_REFUND') {
      resultStatus = 'APPROVAL_REQUIRED';
      requiresApproval = true;
      reason = `Sensitive action (${req.actionType}) requires explicit merchant approval gate.`;
    }

    // 3. Amount Bound Check
    if (amount > rules.maxTransactionAmount) {
      resultStatus = 'BLOCKED';
      policyLimit = rules.maxTransactionAmount;
      reason = `Action amount (₹${amount.toLocaleString('en-IN')}) exceeds merchant configured AI limit of ₹${rules.maxTransactionAmount.toLocaleString('en-IN')}.`;
    } else if (amount > 3000 || req.actionType === 'CREATE_CAMPAIGN') {
      if ((resultStatus as string) !== 'BLOCKED') {
        resultStatus = 'APPROVAL_REQUIRED';
        requiresApproval = true;
        reason = `Action amount (₹${amount.toLocaleString('en-IN')}) is above auto-execution threshold. Merchant approval required.`;
      }
    }

    // 4. Discount Percentage Check
    if (req.actionType === 'APPLY_DISCOUNT' && req.details?.discountPercent) {
      const discount = req.details.discountPercent;
      if (discount > rules.maxDiscountPercent) {
        resultStatus = 'BLOCKED';
        reason = `Proposed discount (${discount}%) exceeds merchant maximum limit of ${rules.maxDiscountPercent}%.`;
      }
    }

    // 5. Record Decision in AuditLog
    try {
      await prisma.auditLog.create({
        data: {
          actorId: req.actorId,
          actorType: req.actorType,
          action: `POLICY_CHECK_${req.actionType}`,
          resource: req.actionType,
          resourceId: req.details?.resourceId || req.merchantId,
          amount: amount,
          status: resultStatus,
          reason: reason,
          metadata: JSON.parse(
            JSON.stringify({
              request: req,
              policyLimit: policyLimit,
              requiresApproval: requiresApproval,
              isMoneyAction: isMoneyAction,
            })
          ),
        },
      });
    } catch (e) {
      console.error('AuditLog creation error in PolicyEngine:', e);
    }

    return {
      status: resultStatus,
      reason,
      policyLimit,
      requiresApproval,
      moneyAction: isMoneyAction,
    };
  }
}
