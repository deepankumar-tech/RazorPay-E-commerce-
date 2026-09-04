import React, { useState } from 'react';
import { Settings, Save, ScanLine, Bot } from 'lucide-react';

export const MerchantSettingsPage: React.FC = () => {
  const [storeName, setStoreName] = useState('TechStore India');
  const [supportEmail, setSupportEmail] = useState('support@techstore.in');
  const [category, setCategory] = useState('Electronics & Gear');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = () => {
    setToastMsg('✓ Merchant store settings updated successfully!');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {toastMsg && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', padding: '0.85rem', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 800 }}>
          {toastMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Settings size={24} color="#38bdf8" /> STORE SETTINGS & AI BUYER PROFILE
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Configure store metadata and preview how autonomous AI buyers see your catalog.</p>
        </div>

        <button onClick={handleSave} style={{ background: '#2563eb', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', color: '#ffffff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Save size={18} /> Save Settings
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* STORE FORM */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>Store Information</h3>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>Store Name</label>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '0.75rem', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>Support Email</label>
            <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '0.75rem', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>Business Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '0.75rem', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* AI BUYER PROFILE PREVIEW */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '20px', padding: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Bot size={16} /> HOW AI BUYERS SEE YOUR STORE
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.5rem' }}>AI Readiness Score: 94/100</div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            • Store Metadata: Complete (100%)<br />
            • Product Categorization: Fully Mapped<br />
            • Currency & Pricing: INR Verified<br />
            • Transaction Limits: Bound at ₹10,000 max single checkout
          </div>
        </div>
      </div>
    </div>
  );
};
