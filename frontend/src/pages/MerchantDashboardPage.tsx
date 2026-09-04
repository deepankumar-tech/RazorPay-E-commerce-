import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { aiService } from '../services/aiService';
import {
  TrendingUp,
  ShoppingBag,
  Zap,
  DollarSign,
  Users,
  Package,
  Layers,
  ArrowUpRight,
  AlertTriangle,
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export const MerchantDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // AI Assistant Chat inside Merchant Dashboard
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load merchant analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleAskAiGrowth = async (queryText: string) => {
    if (!queryText.trim() || aiLoading) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const res = await aiService.chat(queryText);
      setAiResponse(res.data.message);
    } catch (err) {
      setAiResponse('AI growth engine recommends bundling USB-C Hub with Laptop Sleeves to boost average order value by 18%.');
    } finally {
      setAiLoading(false);
    }
  };

  const chartData = analytics?.salesTrend || [
    { date: 'May 24', revenue: 24000, orders: 120 },
    { date: 'May 31', revenue: 38000, orders: 190 },
    { date: 'Jun 07', revenue: 52000, orders: 260 },
    { date: 'Jun 14', revenue: 61000, orders: 310 },
    { date: 'Jun 21', revenue: 70890, orders: 363 },
  ];

  const upsellData = [
    { day: 'Mon', revenue: 2400 },
    { day: 'Tue', revenue: 3100 },
    { day: 'Wed', revenue: 2800 },
    { day: 'Thu', revenue: 4200 },
    { day: 'Fri', revenue: 5900 },
  ];

  const topProducts = [
    { name: 'SonicBlast Headphones', revenue: '₹45,680', orders: '602 orders' },
    { name: 'AeroBuds Pro Earbuds', revenue: '₹32,450', orders: '410 orders' },
    { name: 'UrbanShield Backpack', revenue: '₹23,990', orders: '312 orders' },
    { name: 'USB-C Multiport Hub', revenue: '₹18,880', orders: '210 orders' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title & Date Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Overview</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>
            Store performance, AI growth metrics, and guardrail safeguards.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <span className="badge badge-green" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            May 24 - Jun 24, 2026
          </span>
        </div>
      </div>

      {/* 1. KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Total Revenue</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{analytics?.totalRevenue ? analytics.totalRevenue.toLocaleString('en-IN') : '2,45,890'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--success)', fontSize: '0.78rem', marginTop: '0.4rem', fontWeight: 600 }}>
            <ArrowUpRight size={14} /> +18.6% vs last month
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Orders</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {analytics?.totalOrders || '1,243'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--success)', fontSize: '0.78rem', marginTop: '0.4rem', fontWeight: 600 }}>
            <ArrowUpRight size={14} /> +14.2%
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>AI Assisted Orders</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {analytics?.aiAssistedOrders || '863'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--success)', fontSize: '0.78rem', marginTop: '0.4rem', fontWeight: 600 }}>
            <ArrowUpRight size={14} /> +26.4%
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Average Order Value</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{analytics?.averageOrderValue ? Math.round(analytics.averageOrderValue).toLocaleString('en-IN') : '1,842'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--success)', fontSize: '0.78rem', marginTop: '0.4rem', fontWeight: 600 }}>
            <ArrowUpRight size={14} /> +12.9%
          </div>
        </div>
      </div>

      {/* 2. Charts Section: Revenue Overview (AreaChart) + Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Revenue Overview</h3>
            <span className="badge badge-blue">Daily Trend</span>
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Top Products</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {topProducts.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.orders}</div>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{p.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. AI Insights, Campaign Performance & Upsell Revenue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
        {/* AI Insight Card */}
        <div className="glass-card" style={{ padding: '1.5rem', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <Zap size={20} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>AI GROWTH INSIGHT</span>
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.4rem 0', color: 'var(--text-primary)' }}>Cross-Sell Opportunity Detected</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Customers buying laptop bags frequently buy wireless mice. Potential monthly revenue increase: <strong>₹24,000 / month</strong>.
          </p>
          <button className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
            Create AI Campaign
          </button>
        </div>

        {/* Campaign Performance */}
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--text-primary)' }}>Campaign Performance</h3>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'conic-gradient(#16a34a 0% 73%, #f1f5f9 73% 100%)' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>73%</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--success)' }}>Successful</span>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>12 Active AI Campaigns running</p>
        </div>

        {/* Upsell Revenue Bar Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Upsell Revenue</h3>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.8rem' }}>₹18,450</div>
          <div style={{ height: '110px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={upsellData}>
                <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. AI Growth Assistant Prompt Box */}
      <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid #bfdbfe', background: '#ffffff' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
          <Bot size={22} color="var(--accent-primary)" /> AI Growth Assistant
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          I have analyzed your store performance. Ask me to generate campaign strategies, identify low inventory risks, or forecast revenue.
        </p>

        {aiResponse && (
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '1rem', borderLeft: '4px solid var(--accent-primary)' }}>
            {aiResponse}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Ask me anything about your store revenue or inventory..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAiGrowth(aiPrompt)}
            style={{ fontSize: '0.85rem' }}
          />
          <button onClick={() => handleAskAiGrowth(aiPrompt)} className="btn btn-primary" style={{ padding: '0 1.2rem' }}>
            {aiLoading ? 'Thinking...' : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
