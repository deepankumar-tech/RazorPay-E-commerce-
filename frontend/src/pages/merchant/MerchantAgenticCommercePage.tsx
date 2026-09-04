import React, { useState, useEffect } from 'react';
import { merchantService } from '../../services/merchantService';
import { Activity, Bot, ShoppingBag, ArrowDown, Zap } from 'lucide-react';

export const MerchantAgenticCommercePage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    merchantService.getAgenticCommerce().then((res) => { if (res.data) setData(res.data); });
  }, []);

  const funnel = data?.funnel || [
    { step: 'AI Discovery', count: 1420 },
    { step: 'Product View', count: 3840 },
    { step: 'Recommendation', count: 1250 },
    { step: 'Cart Addition', count: 410 },
    { step: 'Checkout Initiated', count: 115 },
    { step: 'Payment Success', count: 98 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Activity size={24} color="#38bdf8" /> AI BUYER ACTIVITY & AGENT COMMERCE FUNNEL
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '-0.8rem 0 0 0' }}>Track how autonomous AI buyers discover, query, recommendation-match, and complete purchases on your store.</p>

      {/* FUNNEL DISPLAY */}
      <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1.25rem 0' }}>Agentic Conversion Funnel</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {funnel.map((item: any, idx: number) => (
            <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '180px', fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>{item.step}</div>
              <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', height: '28px', overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    width: `${Math.max(8, (item.count / 3840) * 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
                    borderRadius: '8px',
                  }}
                />
              </div>
              <div style={{ width: '80px', textAlign: 'right', fontSize: '0.88rem', fontWeight: 900, color: '#38bdf8' }}>{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
