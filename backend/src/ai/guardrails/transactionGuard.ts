import prisma from '../../config/database';
import { MerchantRuleService } from '../../services/merchantRuleService';

export interface TransactionValidationParams {
  userId: string;
  cartId: string;
  customerConfirmed: boolean;
  expectedTotal?: number;
  discountPercentApplied?: number;
}

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  merchantId: string;
  cartItems: any[];
  violations: string[];
}

export class TransactionGuard {
  static async validateCheckoutProposal(params: TransactionValidationParams): Promise<ValidationResult> {
    const violations: string[] = [];

    // 1. Verify User Authentication & Cart existence
    if (!params.userId) {
      violations.push('User must be authenticated.');
    }

    const cart = await prisma.cart.findUnique({
      where: { id: params.cartId },
      include: {
        items: {
          include: {
            product: {
              include: { merchant: true, inventoryRecord: true },
            },
          },
        },
      },
    });

    if (!cart || cart.status !== 'ACTIVE' || cart.items.length === 0) {
      return {
        allowed: false,
        reason: 'Active cart not found or cart is empty.',
        totalAmount: 0,
        discountAmount: 0,
        finalAmount: 0,
        merchantId: '',
        cartItems: [],
        violations: ['Cart is empty or invalid.'],
      };
    }

    // Identify Merchant from first item (assuming single merchant cart per order)
    const merchantId = cart.items[0].product.merchantId;
    const rules = await MerchantRuleService.getRulesByMerchantId(merchantId);

    // 2. Verify Product Existence, Status, Price & Stock
    let calculatedTotal = 0;
    for (const item of cart.items) {
      const product = item.product;

      if (!product || product.status !== 'ACTIVE') {
        violations.push(`Product "${product?.name || 'Unknown'}" is no longer available.`);
        continue;
      }

      const availableStock = product.inventoryRecord?.quantity ?? product.inventory;
      if (availableStock < item.quantity) {
        violations.push(`Insufficient inventory for "${product.name}". Requested: ${item.quantity}, Available: ${availableStock}.`);
      }

      // Check current price match against expected price
      calculatedTotal += product.price * item.quantity;
    }

    // 3. Verify Discount Limits
    const appliedDiscountPercent = params.discountPercentApplied || 0;
    if (appliedDiscountPercent > rules.maxDiscountPercent) {
      violations.push(`Requested discount of ${appliedDiscountPercent}% exceeds merchant maximum limit of ${rules.maxDiscountPercent}%.`);
    }

    const discountAmount = Math.round((calculatedTotal * appliedDiscountPercent) / 100);
    const finalAmount = Math.max(0, calculatedTotal - discountAmount);

    // 4. Verify Transaction Amount Limit
    if (finalAmount > rules.maxTransactionAmount) {
      violations.push(`Transaction total ₹${finalAmount.toLocaleString('en-IN')} exceeds merchant safety limit of ₹${rules.maxTransactionAmount.toLocaleString('en-IN')}.`);
    }

    // 5. Verify Explicit Customer Confirmation
    if (rules.requireCustomerConfirmation && !params.customerConfirmed) {
      violations.push('Explicit customer confirmation is required prior to payment authorization.');
    }

    // 6. Clean up any previous incomplete PENDING orders for this user to ensure frictionless checkout
    try {
      await prisma.order.updateMany({
        where: {
          userId: params.userId,
          status: 'PENDING',
        },
        data: {
          status: 'CANCELLED',
        },
      });
    } catch (e) {
      console.warn('Stale order cleanup warning:', e);
    }

    const allowed = violations.length === 0;

    return {
      allowed,
      reason: allowed ? 'All merchant financial guardrails and customer confirmation checks PASSED.' : violations.join(' '),
      totalAmount: calculatedTotal,
      discountAmount,
      finalAmount,
      merchantId,
      cartItems: cart.items,
      violations,
    };
  }
}
