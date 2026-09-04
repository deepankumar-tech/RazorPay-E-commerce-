import React from 'react';
import { Users, Sparkles, TrendingUp, AlertCircle, ShoppingBag } from 'lucide-react';

export const MerchantCustomersPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>CUSTOMER INTELLIGENCE & SEGMENTATION</h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '-0.8rem 0 0 0' }}>OLIVER.AI analyzes customer intent, repeat purchase probability, and abandoned sessions.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>TOTAL CUSTOMERS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '0.3rem' }}>1,248</div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>HIGH INTENT USERS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.3rem' }}>34</div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>CART ABANDONERS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.3rem' }}>142</div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ade80' }}>VIP REPEAT BUYERS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#4ade80', marginTop: '0.3rem' }}>86</div>
        </div>
      </div>
    </div>
  );
};
