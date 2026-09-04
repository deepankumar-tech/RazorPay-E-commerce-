import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { merchantService } from '../../services/merchantService';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  ShoppingBag,
  Percent,
  CreditCard,
  Sparkles,
  Bot,
  ArrowUpRight,
  Zap,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { getSocket } from '../../services/socketService';

export const MerchantOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = () => {
    merchantService
      .getDashboard()
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();

    const socket = getSocket();
    const handleRefresh = () => fetchDashboard();
    socket.on('NEW_ORDER', handleRefresh);
    socket.on('MERCHANT_NEW_ORDER', handleRefresh);

    return () => {
      socket.off('NEW_ORDER', handleRefresh);
      socket.off('MERCHANT_NEW_ORDER', handleRefresh);
    };
  }, []);

  const kpis = data?.kpis || {
    totalRevenue: { value: 148500, change: '+12.4%' },
    orders: { value: 84, change: '+8.2%' },
    conversionRate: { value: '4.2%', change: '+3.4%' },
    aov: { value: 1767, change: '+6.8%' },
    aiAssistedRevenue: { value: 48250, change: '+18.7%' },
    aiTransactions: { value: 28, change: '+22.0%' },
  };

  const salesData = data?.aiImpact?.salesChartData || [
    { day: 'Mon', total: 14200, aiAssisted: 4200 },
    { day: 'Tue', total: 18500, aiAssisted: 6100 },
    { day: 'Wed', total: 22100, aiAssisted: 7800 },
    { day: 'Thu', total: 19800, aiAssisted: 5900 },
    { day: 'Fri', total: 27400, aiAssisted: 9400 },
    { day: 'Sat', total: 31200, aiAssisted: 11200 },
    { day: 'Sun', total: 15300, aiAssisted: 3650 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* HEADER TITLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
            Good morning, {user?.name || 'TechStore Merchant'} 👋
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.3rem 0 0 0' }}>
            Here's how OLIVER.AI is helping your store grow revenue today.
          </p>
        </div>

        <button
          onClick={() => navigate('/merchant/copilot')}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem 1.4rem',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 20px rgba(37,99,235,0.4)',
          }}
        >
          <Bot size={18} /> Ask AI Revenue Copilot
        </button>
      </div>

      {/* TOP KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {/* CARD 1: TOTAL REVENUE */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>TOTAL REVENUE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>₹{kpis.totalRevenue.value.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#22c55e', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <ArrowUpRight size={14} /> {kpis.totalRevenue.change} vs last period
          </div>
        </div>

        {/* CARD 2: ORDERS */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>ORDERS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>{kpis.orders.value}</div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#22c55e', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <ArrowUpRight size={14} /> {kpis.orders.change} vs last period
          </div>
        </div>

        {/* CARD 3: CONVERSION RATE */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>CONVERSION RATE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>{kpis.conversionRate.value}</div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#22c55e', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <ArrowUpRight size={14} /> {kpis.conversionRate.change} vs last period
          </div>
        </div>

        {/* CARD 4: AVERAGE ORDER VALUE */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>AVG ORDER VALUE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>₹{kpis.aov.value.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#22c55e', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <ArrowUpRight size={14} /> {kpis.aov.change} vs last period
          </div>
        </div>

        {/* CARD 5: AI-ASSISTED REVENUE */}
        <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(56,189,248,0.05) 100%)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={14} /> AI-ASSISTED REVENUE
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>₹{kpis.aiAssistedRevenue.value.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4ade80', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <ArrowUpRight size={14} /> {kpis.aiAssistedRevenue.change} growth
          </div>
        </div>
      </div>

      {/* MAJOR REVENUE IMPACT SECTION WITH RECHARTS */}
      <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '1.75rem', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={22} color="#38bdf8" />
              <span>OLIVER REVENUE IMPACT</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              ₹48,250 AI-assisted revenue (+18.7% compared with previous period)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>UPSELL REVENUE</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#4ade80' }}>₹14,200</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>CROSS-SELL</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#38bdf8' }}>₹18,500</div>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aiColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff' }} />
              <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#totalColor)" name="Total Revenue (₹)" />
              <Area type="monotone" dataKey="aiAssisted" stroke="#38bdf8" fillOpacity={1} fill="url(#aiColor)" name="AI Assisted Revenue (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OPPORTUNITIES DETECTED BY OLIVER */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={20} color="#f59e0b" /> OPPORTUNITIES DETECTED
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 800 }}>3 High Revenue Recommendations</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {/* OPP 1 */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '6px' }}>HIGH OPPORTUNITY</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#4ade80' }}>+₹18,500/mo</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.4rem 0' }}>Gaming Mice + Keyboard Cross-Sell</h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
              Gaming mice are frequently co-purchased with keyboards, but attachment is low. Bundle them with a 5% discount.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => navigate('/merchant/copilot?action=review_cross_sell')} style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: '8px', padding: '0.5rem', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Review</button>
              <button onClick={() => navigate('/merchant/copilot?action=apply_bundle')} style={{ flex: 1, background: '#2563eb', border: 'none', color: '#ffffff', borderRadius: '8px', padding: '0.5rem', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Apply Bundle</button>
            </div>
          </div>

          {/* OPP 2 */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.7rem', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '6px' }}>RECOVERY</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#4ade80' }}>+₹12,400</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.4rem 0' }}>23 Abandoned Headphones Carts</h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
              23 customers viewed headphones but did not purchase. Launch a targeted 10% recovery campaign draft.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => navigate('/merchant/campaigns')} style={{ flex: 1, background: '#2563eb', border: 'none', color: '#ffffff', borderRadius: '8px', padding: '0.5rem', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Create Campaign</button>
            </div>
          </div>

          {/* OPP 3 */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontSize: '0.7rem', fontWeight: 900, padding: '0.2rem 0.5rem', borderRadius: '6px' }}>CHECKOUT ATTACH</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#4ade80' }}>+₹7,200/mo</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.4rem 0' }}>Mouse Pad Attachment</h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
              Offer a complementary mouse pad during checkout for wireless mouse purchases.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => navigate('/merchant/upsell')} style={{ flex: 1, background: '#2563eb', border: 'none', color: '#ffffff', borderRadius: '8px', padding: '0.5rem', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Enable Upsell</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
