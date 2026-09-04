import React, { useState, useEffect } from 'react';
import { merchantService } from '../../services/merchantService';
import { ShieldAlert, Save, CheckCircle, Lock, Zap } from 'lucide-react';

export const MerchantPoliciesPage: React.FC = () => {
  const [maxTransactionAmount, setMaxTransactionAmount] = useState(10000);
  const [maxDiscountPercent, setMaxDiscountPercent] = useState(15);
  const [allowAutoCartCreation, setAllowAutoCartCreation] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    merchantService.getPolicies().then((res) => {
      if (res.data) {
        if (res.data.maxTransactionAmount) setMaxTransactionAmount(res.data.maxTransactionAmount);
        if (res.data.maxDiscountPercent) setMaxDiscountPercent(res.data.maxDiscountPercent);
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg('');
    try {
      await merchantService.updatePolicies({ maxTransactionAmount, maxDiscountPercent, allowAutoCartCreation });
      setSavedMsg('✓ Transaction policies updated & enforced in backend Financial Policy Engine.');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (e: any) {
      alert('Failed to update policies');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldAlert size={24} color="#f59e0b" /> TRANSACTION POLICIES & BOUNDED AUTONOMY
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Configure hard financial boundaries and merchant approval gates for AI agent actions.</p>
        </div>

        <button onClick={handleSave} disabled={saving} style={{ background: '#2563eb', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', color: '#ffffff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Policies'}
        </button>
      </div>

      {savedMsg && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '0.85rem', borderRadius: '12px', color: '#4ade80', fontSize: '0.88rem', fontWeight: 800 }}>
          {savedMsg}
        </div>
      )}

      {/* POLICY CONTROLS FORM */}
      <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', display: 'block', marginBottom: '0.4rem' }}>
            Single AI Transaction Hard Spending Limit (₹)
          </label>
          <input
            type="number"
            value={maxTransactionAmount}
            onChange={(e) => setMaxTransactionAmount(Number(e.target.value))}
            style={{ width: '100%', maxWidth: '400px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '0.75rem', color: '#ffffff', outline: 'none' }}
          />
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem' }}>Any AI transaction above this limit will be BLOCKED automatically.</div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', display: 'block', marginBottom: '0.4rem' }}>
            Maximum Allowed AI Campaign Discount (%)
          </label>
          <input
            type="number"
            value={maxDiscountPercent}
            onChange={(e) => setMaxDiscountPercent(Number(e.target.value))}
            style={{ width: '100%', maxWidth: '400px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '0.75rem', color: '#ffffff', outline: 'none' }}
          />
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>Financial Gate Permissions</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={allowAutoCartCreation} onChange={(e) => setAllowAutoCartCreation(e.target.checked)} />
            Allow AI Agent Cart Creation
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={true} readOnly />
            Require Explicit Merchant Approval for Campaign Activation & High-Value Discounts
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={true} readOnly />
            Require Explicit Merchant Approval for Product Price Changes & Refunds
          </label>
        </div>
      </div>
    </div>
  );
};
