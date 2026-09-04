import React from 'react';
import { Sparkles, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MerchantOpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();

  const opps = [
    {
      id: 'opp-1',
      type: 'HIGH OPPORTUNITY',
      title: 'Gaming Mice + Keyboards Cross-Sell',
      description: '67% of users who bought keyboards also viewed wireless gaming mice. Attach rate is only 12%.',
      potential: '₹18,500/mo',
      action: 'Create Cross-Sell Bundle',
      link: '/merchant/copilot?action=apply_bundle',
    },
    {
      id: 'opp-2',
      type: 'RECOVERY',
      title: 'Headphones Cart Abandonment Recovery',
      description: '23 customers viewed headphones in the last 7 days without buying. Launch a 10% recovery campaign.',
      potential: '₹12,400',
      action: 'Create Campaign',
      link: '/merchant/campaigns',
    },
    {
      id: 'opp-3',
      type: 'CHECKOUT ATTACH',
      title: 'Mouse Pad Attach at Checkout',
      description: 'Offer a complementary mouse pad during checkout for wireless mouse purchases.',
      potential: '₹7,200/mo',
      action: 'Enable Upsell',
      link: '/merchant/upsell',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Sparkles size={24} color="#f59e0b" /> AI REVENUE OPPORTUNITIES
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '-0.8rem 0 0 0' }}>OLIVER continuously evaluates store traffic, co-views, and basket sizes to find untapped revenue.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {opps.map((o) => (
          <div key={o.id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '6px' }}>{o.type}</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0.4rem 0 0.2rem 0' }}>{o.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, maxWidth: '600px' }}>{o.description}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>POTENTIAL REVENUE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#4ade80' }}>+{o.potential}</div>
              </div>
              <button onClick={() => navigate(o.link)} style={{ background: '#2563eb', border: 'none', color: '#ffffff', padding: '0.65rem 1.25rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {o.action} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
