import React, { useState, useEffect } from 'react';
import { auditService } from '../services/analyticsService';
import { ShieldCheck, Filter, Clock, CheckCircle2, AlertTriangle, User, Bot, Lock } from 'lucide-react';

const DEFAULT_MOCK_AUDIT_LOGS = [
  {
    id: 'log-seed-1',
    actorType: 'AI_AGENT',
    action: 'AI_CONVERSATION_STARTED',
    actor: { name: 'OLIVER.AI Engine', email: 'ai@oliver.com' },
    reason: 'OLIVER.AI Shopping Assistant session initialized for customer Rahul Sharma.',
    status: 'SUCCESS',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'log-seed-2',
    actorType: 'CUSTOMER',
    action: 'PRODUCT_SEARCHED',
    actor: { name: 'Rahul Sharma', email: 'customer@demo.com' },
    reason: 'Customer searched catalog for "Noise Cancelling Wireless Headphones".',
    status: 'SUCCESS',
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'log-seed-3',
    actorType: 'AI_AGENT',
    action: 'UPSELL_RECOMMENDED',
    actor: { name: 'OLIVER.AI Engine', email: 'ai@oliver.com' },
    reason: 'AI Growth Engine recommended ToneMax Hi-Fi DAC Headphone Amp cross-sell (14% Off).',
    amount: 1899,
    status: 'SUCCESS',
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'log-seed-4',
    actorType: 'CUSTOMER',
    action: 'CUSTOMER_CONFIRMED',
    actor: { name: 'Rahul Sharma', email: 'customer@demo.com' },
    reason: 'Explicit customer authorization confirmed via 4-Digit Security PIN for ₹4,898.',
    amount: 4898,
    status: 'SUCCESS',
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'log-seed-5',
    actorType: 'SYSTEM',
    action: 'RAZORPAY_ORDER_CREATED',
    actor: { name: 'Razorpay Gateway', email: 'system@razorpay.com' },
    reason: 'Created Razorpay Test Gateway Order rzp_test_ord_1001 for ₹4,898 under AI Guardrails.',
    amount: 4898,
    status: 'SUCCESS',
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: 'log-seed-6',
    actorType: 'SYSTEM',
    action: 'PAYMENT_SUCCESS',
    actor: { name: 'Razorpay Gateway', email: 'system@razorpay.com' },
    reason: 'Razorpay signature pay_test_901 verified successfully. Order ORD-1001 status updated to PAID.',
    amount: 4898,
    status: 'SUCCESS',
    createdAt: new Date(Date.now() - 1500000).toISOString(),
  },
  {
    id: 'log-seed-7',
    actorType: 'SYSTEM',
    action: 'TRANSACTION_GUARD_REJECTED',
    actor: { name: 'AI Risk Engine', email: 'guard@oliver.com' },
    reason: 'Blocked high-risk ₹25,000 transaction attempt exceeding merchant max limit of ₹15,000.',
    amount: 25000,
    status: 'REJECTED',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'log-seed-8',
    actorType: 'SYSTEM',
    action: 'INVENTORY_UPDATED',
    actor: { name: 'Inventory Manager', email: 'system@oliver.com' },
    reason: 'Atomic stock deduction: StudioMaster Headphones inventory updated from 50 to 49.',
    status: 'SUCCESS',
    createdAt: new Date(Date.now() - 2100000).toISOString(),
  },
  {
    id: 'log-seed-9',
    actorType: 'MERCHANT',
    action: 'CAMPAIGN_LAUNCHED',
    actor: { name: 'Vikram Mehta', email: 'merchant@demo.com' },
    reason: 'Merchant Vikram Mehta activated 10% recovery campaign for 23 abandoned headphones carts.',
    amount: 12400,
    status: 'SUCCESS',
    createdAt: new Date(Date.now() - 2400000).toISOString(),
  },
];

export const AuditTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>(DEFAULT_MOCK_AUDIT_LOGS);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterAction, setFilterAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await auditService.getAuditLogs({
        action: filterAction || undefined,
        status: filterStatus || undefined,
      });
      const fetched = res.data?.logs || res.logs || res.data || [];
      if (Array.isArray(fetched) && fetched.length > 0) {
        setLogs(fetched);
      } else {
        setLogs(DEFAULT_MOCK_AUDIT_LOGS);
      }
    } catch (err) {
      console.error(err);
      setLogs(DEFAULT_MOCK_AUDIT_LOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterAction, filterStatus]);

  const getActionBadgeColor = (action: string) => {
    if (action.includes('PAYMENT_SUCCESS') || action.includes('CONFIRMED')) return 'badge-green';
    if (action.includes('FAILED') || action.includes('REJECTED')) return 'badge-red';
    return 'badge-violet';
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={28} color="var(--accent-primary)" />
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Immutable System Audit Trail</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Complete chronological audit verification of all AI agent searches, upsell proposals, financial guardrails, and Razorpay test payments
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <select
            className="input-field"
            style={{ width: '180px', padding: '0.5rem' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          <select
            className="input-field"
            style={{ width: '220px', padding: '0.5rem' }}
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="">All Actions</option>
            <option value="AI_CONVERSATION_STARTED">AI_CONVERSATION_STARTED</option>
            <option value="PRODUCT_SEARCHED">PRODUCT_SEARCHED</option>
            <option value="UPSELL_RECOMMENDED">UPSELL_RECOMMENDED</option>
            <option value="CUSTOMER_CONFIRMED">CUSTOMER_CONFIRMED</option>
            <option value="RAZORPAY_ORDER_CREATED">RAZORPAY_ORDER_CREATED</option>
            <option value="PAYMENT_SUCCESS">PAYMENT_SUCCESS</option>
            <option value="PAYMENT_FAILED">PAYMENT_FAILED</option>
            <option value="TRANSACTION_GUARD_REJECTED">TRANSACTION_GUARD_REJECTED</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading audit trail logs...</div>
      ) : logs.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>No audit log entries matched your filter.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {logs.map((log) => (
            <div key={log.id} className="glass-panel" style={{ padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
              <div style={{
                background: log.actorType === 'AI_AGENT' ? 'rgba(124,58,237,0.2)' : log.actorType === 'CUSTOMER' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.2)',
                padding: '0.6rem',
                borderRadius: '10px',
                color: log.actorType === 'AI_AGENT' ? '#c4b5fd' : '#6ee7b7'
              }}>
                {log.actorType === 'AI_AGENT' ? <Bot size={20} /> : <User size={20} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className={`badge ${getActionBadgeColor(log.action)}`}>{log.action}</span>
                    <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>{log.actorType}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.actor?.name || 'User'}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} />
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ({new Date(log.createdAt).toLocaleDateString()})
                  </div>
                </div>

                <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  {log.reason}
                </div>

                {log.amount && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 700 }}>
                    Transaction Amount: ₹{log.amount.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
