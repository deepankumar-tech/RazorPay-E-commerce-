import React, { useState, useEffect } from 'react';
import { Layers, Plus, Sparkles, CheckCircle, Tag, TrendingUp, ShoppingBag, ArrowRight, Eye } from 'lucide-react';
import { productService } from '../../services/productService';

export const MerchantUpsellPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    productService
      .searchProducts({ limit: 12 })
      .then((res) => {
        const list = res.data?.products || res.products || res.data || [];
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const upsellRules = [
    {
      id: 'rule-1',
      triggerCategory: 'Keyboards',
      recommendCategory: 'Mouse',
      discountPercent: 10,
      attachRate: '24.8%',
      monthlyRevenue: '₹18,500/mo',
      status: 'ACTIVE',
      sampleUpsell: products.find((p) => p.category === 'Mouse' || p.category === 'Laptop Accessories') || {
        name: 'ToneMax Portable Hi-Fi Type-C DAC Headphone Amplifier',
        price: 1899,
        category: 'Audio Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300',
      },
    },
    {
      id: 'rule-2',
      triggerCategory: 'Headphones',
      recommendCategory: 'Travel Accessories',
      discountPercent: 12,
      attachRate: '31.2%',
      monthlyRevenue: '₹14,200/mo',
      status: 'ACTIVE',
      sampleUpsell: products.find((p) => p.category === 'Headphones' || p.category === 'Travel Accessories') || {
        name: '🛡️ Protective Headphone Travel Case',
        price: 799,
        category: 'Travel Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
      },
    },
    {
      id: 'rule-3',
      triggerCategory: 'Laptop Accessories',
      recommendCategory: 'Bags',
      discountPercent: 15,
      attachRate: '19.5%',
      monthlyRevenue: '₹22,400/mo',
      status: 'ACTIVE',
      sampleUpsell: products.find((p) => p.category === 'Bags') || {
        name: '🎒 UrbanShield Waterproof Laptop Bag',
        price: 1299,
        category: 'Bags',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      {toastMsg && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', padding: '0.85rem 1.25rem', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 800 }}>
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={26} color="#38bdf8" /> UPSELL, CROSS-SELL & BUNDLE ENGINE
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
            AI Growth Engine configures autonomous product attachment & high-margin bundle recommendations.
          </p>
        </div>
        <button
          onClick={() => showToast('✓ New AI Upsell Rule & Product Strategy initialized.')}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '0.7rem 1.35rem',
            color: '#ffffff',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
          }}
        >
          <Plus size={18} /> Create AI Upsell Strategy
        </button>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Total Upsell Revenue</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.2rem' }}>₹55,100/mo</div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 800, marginTop: '0.35rem' }}>+22.4% vs last month</div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Avg Attach Rate</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#4ade80', marginTop: '0.2rem' }}>25.1%</div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 800, marginTop: '0.35rem' }}>1 in 4 checkouts attach upsell</div>
        </div>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Active Recommendation Rules</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#c084fc', marginTop: '0.2rem' }}>{upsellRules.length} Strategies</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>Enforced across cart & checkout</div>
        </div>
      </div>

      {/* Rich Upsell Products Spotlight Section */}
      <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Sparkles size={20} color="#38bdf8" /> AI-RECOMMENDED UPSELL PRODUCTS & STRATEGIES
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '0.25rem 0.65rem', borderRadius: '8px', fontWeight: 800 }}>
            LIVE CATALOG INTEGRATED
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {upsellRules.map((rule) => {
            const item = rule.sampleUpsell;
            return (
              <div
                key={rule.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1.5px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Rule Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                    {rule.triggerCategory} ➔ {rule.recommendCategory}
                  </span>
                  <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontSize: '0.72rem', fontWeight: 900, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                    {rule.status}
                  </span>
                </div>

                {/* Product Detail Card */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <img
                    src={item.imageUrl || item.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200'}
                    alt={item.name}
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '10px', background: '#ffffff', padding: '0.2rem' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{item.category || rule.recommendCategory}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.15rem' }}>
                      ₹{item.price?.toLocaleString('en-IN')} <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 800 }}>({rule.discountPercent}% OFF)</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.8rem', borderRadius: '8px' }}>
                  <div>Attach Rate: <strong style={{ color: '#ffffff' }}>{rule.attachRate}</strong></div>
                  <div>Monthly Est: <strong style={{ color: '#4ade80' }}>{rule.monthlyRevenue}</strong></div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => showToast(`✓ Activated "${item.name}" upsell strategy across checkout.`)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#2563eb',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <CheckCircle size={14} /> Apply Strategy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
