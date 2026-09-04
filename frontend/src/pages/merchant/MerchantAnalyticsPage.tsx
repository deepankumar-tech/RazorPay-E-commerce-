import React from 'react';
import { TrendingUp, Sparkles, PieChart, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const MerchantAnalyticsPage: React.FC = () => {
  const analyticsData = [
    { name: 'Direct Storefront', revenue: 100250 },
    { name: 'AI Conversational', revenue: 22400 },
    { name: 'AI Upsell/Cross-sell', revenue: 14200 },
    { name: 'AI Buyer Agents', revenue: 11650 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>REVENUE ANALYTICS & AI ATTRIBUTION</h1>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '-0.8rem 0 0 0' }}>Comprehensive revenue performance, conversion rates, and AI attribution breakdowns.</p>

      <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem 0' }}>AI Revenue Attribution Breakdown (₹)</h3>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff' }} />
              <Bar dataKey="revenue" fill="#38bdf8" radius={[8, 8, 0, 0]} name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
