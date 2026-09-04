import React, { useState } from 'react';
import { Megaphone, Plus, Sparkles, CheckCircle } from 'lucide-react';

export const MerchantCampaignsPage: React.FC = () => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {toastMsg && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', padding: '0.85rem', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 800 }}>
          {toastMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Megaphone size={24} color="#38bdf8" /> AI CAMPAIGN ORCHESTRATOR
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>AI-generated marketing campaigns. Drafts require explicit merchant approval before activation.</p>
        </div>
        <button onClick={() => showToast('✓ New AI campaign draft generated & ready for review.')} style={{ background: '#2563eb', border: 'none', borderRadius: '10px', padding: '0.65rem 1.25rem', color: '#ffffff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={18} /> Create AI Campaign
        </button>
      </div>

      <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem 0' }}>Campaign Pipeline</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Headphones Cart Recovery Flash Sale</div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.25rem' }}>Audience: 23 Abandoners | Offer: 10% Off | Duration: 7 Days</div>
              <div style={{ fontSize: '0.78rem', color: '#4ade80', marginTop: '0.3rem', fontWeight: 700 }}>Estimated Impact: +₹12,400</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => showToast('✓ Campaign "Headphones Cart Recovery Flash Sale" approved & launched! Audit event logged.')} style={{ background: '#2563eb', border: 'none', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Approve & Launch</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
