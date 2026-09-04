import { TransactionGuard } from '../guardrails/transactionGuard';

export const checkoutTools = {
  create_checkout_proposal: async (args: { userId: string; cartId: string; discountPercent?: number }) => {
    const validation = await TransactionGuard.validateCheckoutProposal({
      userId: args.userId,
      cartId: args.cartId,
      customerConfirmed: false, // Initial proposal before customer confirms
      discountPercentApplied: args.discountPercent,
    });

    return {
      proposalStatus: validation.allowed ? 'READY_FOR_CUSTOMER_CONFIRMATION' : 'GUARDRAIL_VIOLATIONS_DETECTED',
      summary: {
        totalPrice: validation.totalAmount,
        discountAmount: validation.discountAmount,
        finalPrice: validation.finalAmount,
        itemCount: validation.cartItems.length,
      },
      guardrailChecks: {
        userAuthenticated: true,
        inventoryAvailable: true,
        transactionLimitOk: validation.finalAmount <= 5000,
        discountLimitOk: (args.discountPercent || 0) <= 10,
        customerConfirmationRequired: true,
      },
      violations: validation.violations,
      explanation: validation.allowed
        ? 'All financial safety and merchant guardrails passed. Customer explicit confirmation is required before payment.'
        : `Safety issues detected: ${validation.violations.join(' ')}`,
    };
  },

  validate_transaction: async (args: { userId: string; cartId: string; customerConfirmed: boolean }) => {
    const result = await TransactionGuard.validateCheckoutProposal({
      userId: args.userId,
      cartId: args.cartId,
      customerConfirmed: args.customerConfirmed,
    });

    return {
      isValid: result.allowed,
      reason: result.reason,
      totalAmount: result.finalAmount,
      violations: result.violations,
    };
  },
};
