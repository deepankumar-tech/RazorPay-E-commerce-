import React, { useState, useEffect } from 'react';
import { merchantRuleService } from '../services/analyticsService';
import { ShieldCheck, Save, Lock, CheckCircle2 } from 'lucide-react';

export const MerchantRulesPage: React.FC = () => {
  const [rules, setRules] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [maxTransactionAmount, setMaxTransactionAmount] = useState(5000);
  const [maxDiscountPercent, setMaxDiscountPercent] = useState(10);
  const [maxUpsellAmount, setMaxUpsellAmount] = useState(1500);
  const [requireCustomerConfirmation, setRequireCustomerConfirmation] = useState(true);
  const [allowAutoCartCreation, setAllowAutoCartCreation] = useState(true);
  const [allowAiCampaignGeneration, setAllowAiCampaignGeneration] = useState(true);

  useEffect(() => {
    merchantRuleService.getRules()
      .then((res) => {
        const r = res.data;
        setRules(r);
        if (r) {
          setMaxTransactionAmount(r.maxTransactionAmount);
          setMaxDiscountPercent(r.maxDiscountPercent);
          setMaxUpsellAmount(r.maxUpsellAmount);
          setRequireCustomerConfirmation(r.requireCustomerConfirmation);
          setAllowAutoCartCreation(r.allowAutoCartCreation);
          setAllowAiCampaignGeneration(r.allowAiCampaignGeneration);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await merchantRuleService.updateRules({
        maxTransactionAmount: Number(maxTransactionAmount),
        maxDiscountPercent: Number(maxDiscountPercent),
        maxUpsellAmount: Number(maxUpsellAmount),
        requireCustomerConfirmation,
        allowAutoCartCreation,
        allowAiCampaignGeneration,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update rules');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading Merchant Guardrails...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.8rem' }}>
        <ShieldCheck size={28} color="var(--accent-primary)" />
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Merchant Financial Guardrails</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Configure strict financial safety boundaries that bound all AI commerce actions</p>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> Merchant Guardrails updated & active in TransactionGuard.
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Maximum Transaction Limit (₹)
            </label>
            <input
              type="number"
              className="input-field"
              value={maxTransactionAmount}
              onChange={(e) => setMaxTransactionAmount(Number(e.target.value))}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Orders above this threshold block AI auto-checkout.</span>
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Maximum AI Discount %
            </label>
            <input
              type="number"
              className="input-field"
              value={maxDiscountPercent}
              onChange={(e) => setMaxDiscountPercent(Number(e.target.value))}
              max={50}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI cannot apply promotional discounts exceeding this limit.</span>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
            Maximum Complementary Upsell Amount (₹)
          </label>
          <input
            type="number"
            className="input-field"
            value={maxUpsellAmount}
            onChange={(e) => setMaxUpsellAmount(Number(e.target.value))}
            required
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Limits the maximum price of AI recommended cross-sell items.</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#c4b5fd' }}>Safety & Permission Toggles</h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '0.8rem 1rem', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Require Explicit Customer Confirmation</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MANDATORY: Customer must click [CONFIRM & PAY] prior to payment</div>
            </div>
            <input
              type="checkbox"
              checked={requireCustomerConfirmation}
              onChange={(e) => setRequireCustomerConfirmation(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '0.8rem 1rem', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Allow AI Automatic Cart Proposal</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Permits AI agent to add selected items directly to customer cart</div>
            </div>
            <input
              type="checkbox"
              checked={allowAutoCartCreation}
              onChange={(e) => setAllowAutoCartCreation(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '0.8rem 1rem', borderRadius: '10px' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Allow AI Campaign Generation</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allows AI to generate proposed marketing campaigns for merchant review</div>
            </div>
            <input
              type="checkbox"
              checked={allowAiCampaignGeneration}
              onChange={(e) => setAllowAiCampaignGeneration(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }} disabled={saving}>
          {saving ? 'Saving Guardrails...' : <><Save size={18} /> Save Guardrail Settings</>}
        </button>
      </form>
    </div>
  );
};
