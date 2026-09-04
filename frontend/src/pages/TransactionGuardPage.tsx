import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Cpu,
  DollarSign,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Zap,
  Info,
  Check,
  X,
  FileText,
  Layers,
  ArrowRight,
  ShieldX,
  Clock,
  User,
  ShoppingBag,
} from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  badge: 'PASSED' | 'BLOCKED' | 'FAILED' | 'PENDING';
  badgeColor: string;
  customer: string;
  product: string;
  amount: number;
  authorizedLimit: number;
  merchantRule: string;
  inventoryStatus: string;
  priceStatus: string;
  duplicateStatus: string;
  customerConfirmation: string;
  overallStatus: string;
  overallStatusType: 'PASSED' | 'BLOCKED' | 'FAILED' | 'PENDING';
  reason: string;
  auditTrailEvents: string[];
}

export const TransactionGuardPage: React.FC = () => {
  const scenarios: Scenario[] = [
    {
      id: 'scenario-passed',
      name: 'Scenario 1: Standard AI Purchase (Under Limit)',
      badge: 'PASSED',
      badgeColor: '#16a34a',
      customer: 'Priya (Customer ID: cust_demo_priya_01)',
      product: 'SonicBlast Pro Wireless ANC Headphones',
      amount: 2799,
      authorizedLimit: 3000,
      merchantRule: 'Maximum AI single-transaction limit: ₹5,000',
      inventoryStatus: 'Verified In Stock (30 units available)',
      priceStatus: 'Verified against DB truth (₹2,799)',
      duplicateStatus: 'Passed (Unique Idempotency Key: idem_tx_78491)',
      customerConfirmation: 'Required (Pending user review)',
      overallStatus: 'WAITING FOR APPROVAL',
      overallStatusType: 'PENDING',
      reason: 'Transaction is within the customer authorized spending limit (₹2,799 < ₹3,000) and adheres to all merchant risk guardrails.',
      auditTrailEvents: [
        '09:41:03 - USER_REQUEST: "Find headphones under ₹3,000."',
        '09:41:04 - AI_SEARCH: Searched store catalog for "Headphones".',
        '09:41:06 - AI_RECOMMENDATION: Recommended SonicBlast Pro (₹2,799).',
        '09:41:17 - TRANSACTION_VALIDATION: Spending limit checked (₹2,799 <= ₹3,000) -> PASSED.',
        '09:41:20 - CUSTOMER_CONFIRMATION: Status set to PENDING_APPROVAL.',
      ],
    },
    {
      id: 'scenario-blocked',
      name: 'Scenario 2: Bounded Spending Breach (Over Limit)',
      badge: 'BLOCKED',
      badgeColor: '#dc2626',
      customer: 'Priya (Customer ID: cust_demo_priya_01)',
      product: 'Ultra HD OLED Studio Display',
      amount: 4500,
      authorizedLimit: 3000,
      merchantRule: 'Maximum AI single-transaction limit: ₹5,000',
      inventoryStatus: 'Verified In Stock (12 units available)',
      priceStatus: 'Verified against DB truth (₹4,500)',
      duplicateStatus: 'Passed',
      customerConfirmation: 'Blocked - Authorization Limit Exceeded',
      overallStatus: 'BLOCKED BY TRANSACTION GUARD',
      overallStatusType: 'BLOCKED',
      reason: 'Requested purchase amount (₹4,500) exceeds user authorized spending boundary of ₹3,000. Payment creation prevented.',
      auditTrailEvents: [
        '10:15:10 - USER_REQUEST: "Buy the pro OLED studio display."',
        '10:15:12 - AI_SEARCH: Product found at ₹4,500.',
        '10:15:13 - TRANSACTION_VALIDATION: Limit check (₹4,500 > ₹3,000 authorized limit).',
        '10:15:14 - SECURITY_BLOCK: Transaction blocked. Allowed: ₹3,000, Requested: ₹4,500.',
        '10:15:14 - RAZORPAY_ORDER: Order creation suppressed by backend guard.',
      ],
    },
    {
      id: 'scenario-duplicate',
      name: 'Scenario 3: Duplicate Submission Protection',
      badge: 'BLOCKED',
      badgeColor: '#d97706',
      customer: 'Rahul Sharma (Customer ID: cust_demo_rahul_02)',
      product: 'HiFi-Master Dual Driver Type-C Earphones',
      amount: 899,
      authorizedLimit: 2000,
      merchantRule: 'Idempotency Protection Active',
      inventoryStatus: 'Verified In Stock',
      priceStatus: 'Verified against DB truth (₹899)',
      duplicateStatus: 'DUPLICATE DETECTED (Idempotency Key: pay_idem_901452)',
      customerConfirmation: 'Previous order already placed',
      overallStatus: 'DUPLICATE TRANSACTION PREVENTED',
      overallStatusType: 'BLOCKED',
      reason: 'Identical idempotency key submitted within 60 seconds. Backend rejected duplicate order creation to protect customer account.',
      auditTrailEvents: [
        '11:02:40 - PAYMENT_REQUEST: Submitted with key pay_idem_901452.',
        '11:02:41 - PAYMENT_SUCCESS: Order ORD-9912 created.',
        '11:02:43 - DUPLICATE_SUBMISSION: Re-submission detected with identical payload.',
        '11:02:43 - DUPLICATE_PREVENTED: Suppressed second charge. No duplicate order created.',
      ],
    },
    {
      id: 'scenario-failure',
      name: 'Scenario 4: Gateway Failure & Graceful Recovery',
      badge: 'FAILED',
      badgeColor: '#dc2626',
      customer: 'Anita Desai (Customer ID: cust_demo_anita_03)',
      product: 'AeroShield Water-Resistant Laptop Backpack',
      amount: 1499,
      authorizedLimit: 2500,
      merchantRule: 'Maximum AI single-transaction limit: ₹5,000',
      inventoryStatus: 'Stock reserved temporarily',
      priceStatus: 'Verified (₹1,499)',
      duplicateStatus: 'Passed',
      customerConfirmation: 'Confirmed by user',
      overallStatus: 'PAYMENT FAILED (GRACEFUL RETRY AVAILABLE)',
      overallStatusType: 'FAILED',
      reason: 'Bank gateway declined transaction (insufficient funds / user dismissed). Order marked as FAILED with zero duplicate charge.',
      auditTrailEvents: [
        '11:20:00 - CUSTOMER_CONFIRMATION: User authorized ₹1,499 purchase.',
        '11:20:02 - RAZORPAY_ORDER_CREATED: rzp_test_order_88291.',
        '11:20:15 - PAYMENT_ATTEMPTED: Bank gateway interaction.',
        '11:20:18 - PAYMENT_FAILED: Gateway response: "Payment authorization declined by bank".',
        '11:20:19 - ORDER_NOT_CONFIRMED: Order remained unconfirmed. Inventory released.',
      ],
    },
  ];

  const [activeScenarioId, setActiveScenarioId] = useState<string>('scenario-passed');
  const currentScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const getStatusBadgeStyle = (type: string) => {
    switch (type) {
      case 'PASSED':
        return { background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac' };
      case 'BLOCKED':
        return { background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' };
      case 'FAILED':
        return { background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' };
      case 'PENDING':
      default:
        return { background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' };
    }
  };

  return (
    <div style={{ padding: '1.5rem 1rem', maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          borderRadius: '16px',
          border: '1.5px solid #bae6fd',
          padding: '1.5rem',
          boxShadow: '0 4px 16px rgba(14, 165, 233, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Transaction Guard & Agent Authorization Center
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>
              Multi-Layer Financial Risk Engine, Bounded Spending Enforcement & Autonomous Payment Validation
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '0.3rem 0.7rem', borderRadius: '20px', border: '1px solid #7dd3fc' }}>
              🔒 ZERO UNBOUNDED AI SPEND
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '0.3rem 0.7rem', borderRadius: '20px', border: '1px solid #86efac' }}>
              ✓ EXPLICIT USER CONSENT
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Switcher */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
          Live Hackathon Demonstration Scenarios:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {scenarios.map((sc) => {
            const isSelected = sc.id === activeScenarioId;
            return (
              <div
                key={sc.id}
                onClick={() => setActiveScenarioId(sc.id)}
                style={{
                  background: isSelected ? '#e0f2fe' : '#ffffff',
                  border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? '#0369a1' : '#64748b' }}>
                    {sc.name.split(':')[0]}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px', background: sc.badgeColor, color: '#ffffff' }}>
                    {sc.badge}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                  {sc.name.split(':')[1]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Guardrail Card Display */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        
        {/* Status Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Current Evaluation</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0' }}>
              {currentScenario.name}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Overall Guard Status:</span>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 900,
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                ...getStatusBadgeStyle(currentScenario.overallStatusType),
              }}
            >
              {currentScenario.overallStatus}
            </span>
          </div>
        </div>

        {/* 2-Column Inspection Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          
          {/* Left Column: Transaction Parameters & Checks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} color="#0284c7" /> Transaction Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Customer:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentScenario.customer}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Product:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentScenario.product}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Requested Amount:</span>
                  <span style={{ fontWeight: 900, fontSize: '1rem', color: '#0f172a' }}>₹{currentScenario.amount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Customer Spending Limit:</span>
                  <span style={{ fontWeight: 800, color: '#0284c7' }}>₹{currentScenario.authorizedLimit.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Merchant Rule:</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{currentScenario.merchantRule}</span>
                </div>
              </div>
            </div>

            {/* Validation Checklist */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="#16a34a" /> Automated Guardrail Verifications
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569' }}>1. Bounded Spending Limit Check:</span>
                  <span style={{ fontWeight: 800, color: currentScenario.amount <= currentScenario.authorizedLimit ? '#16a34a' : '#dc2626' }}>
                    {currentScenario.amount <= currentScenario.authorizedLimit ? '✓ PASSED' : '✕ BLOCKED (Exceeded)'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569' }}>2. Inventory Truth Validation:</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>✓ {currentScenario.inventoryStatus}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569' }}>3. Price Database Integrity Check:</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>✓ {currentScenario.priceStatus}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569' }}>4. Duplicate Payment / Idempotency:</span>
                  <span style={{ fontWeight: 700, color: currentScenario.duplicateStatus.includes('DUPLICATE') ? '#d97706' : '#16a34a' }}>
                    {currentScenario.duplicateStatus}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569' }}>5. Explicit User Confirmation:</span>
                  <span style={{ fontWeight: 700, color: '#0284c7' }}>{currentScenario.customerConfirmation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reasoning & Live Audit Events */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Reasoning Explanation Box */}
            <div
              style={{
                background: currentScenario.overallStatusType === 'BLOCKED' || currentScenario.overallStatusType === 'FAILED' ? '#fef2f2' : '#f0fdf4',
                border: currentScenario.overallStatusType === 'BLOCKED' || currentScenario.overallStatusType === 'FAILED' ? '1px solid #fecaca' : '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '1.2rem',
              }}
            >
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: currentScenario.overallStatusType === 'BLOCKED' || currentScenario.overallStatusType === 'FAILED' ? '#991b1b' : '#166534', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Info size={16} /> Explainable Decision Rationale
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.5 }}>
                {currentScenario.reason}
              </p>
            </div>

            {/* Micro-Audit Trail Timeline */}
            <div style={{ background: '#0f172a', borderRadius: '12px', padding: '1.2rem', color: '#f8fafc', flex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} /> Sequence Audit Log
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                {currentScenario.auditTrailEvents.map((evt, idx) => (
                  <div key={idx} style={{ padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', borderLeft: '2px solid #38bdf8', lineHeight: 1.4 }}>
                    {evt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Concept Mapping Section */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Layers size={20} color="#0284c7" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Conceptual Architecture & Protocol Mapping
          </h2>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 1.25rem' }}>
          OLIVER is an advanced demonstration showcasing how autonomous AI commerce agents interact with financial rails. (Not an official implementation of standard specifications).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0284c7', marginBottom: '0.35rem' }}>ACP Concept</div>
            <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.45 }}>
              • Agent-readable product catalog (<code>/api/catalog/agent</code>)<br />
              • AI-to-merchant discovery<br />
              • Automated cart composition
            </p>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#7c3aed', marginBottom: '0.35rem' }}>AP2 Concept</div>
            <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.45 }}>
              • User spending boundaries (₹3,000 max)<br />
              • Explicit mandate & intent approval<br />
              • Gated payment request trigger
            </p>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#059669', marginBottom: '0.35rem' }}>NPCI UAP Concept</div>
            <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.45 }}>
              • Agent identity verification<br />
              • Permission perimeter control<br />
              • UPI & QR transaction guardrails
            </p>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ea580c', marginBottom: '0.35rem' }}>x402 & Razorpay</div>
            <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.45 }}>
              • Programmatic payment challenge<br />
              • Razorpay Test Mode execution<br />
              • Server-side signature verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
