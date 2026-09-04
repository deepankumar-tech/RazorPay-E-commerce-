import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Percent } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAnalytics()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categoryBreakdown = [
    { name: 'Headphones', value: 45000, color: '#2563eb' },
    { name: 'Bags', value: 38000, color: '#0284c7' },
    { name: 'Laptop Accessories', value: 29000, color: '#059669' },
    { name: 'Smart Watches', value: 24000, color: '#d97706' },
    { name: 'Keyboards & Mouse', value: 18500, color: '#6366f1' },
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Advanced Revenue Analytics</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Deep dive into category distribution, upsell conversion performance, and order metrics</p>
      </div>

      {/* Visual Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Category Breakdown Pie Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Category Revenue Distribution</h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#0f172a', boxShadow: 'var(--shadow-md)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
            {categoryBreakdown.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }}></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* AI vs Organic Order Comparison */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>AI Assisted vs Organic Order Volume</h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', organic: 3, aiAssisted: 7 },
                { name: 'Tue', organic: 4, aiAssisted: 11 },
                { name: 'Wed', organic: 2, aiAssisted: 9 },
                { name: 'Thu', organic: 5, aiAssisted: 14 },
                { name: 'Fri', organic: 4, aiAssisted: 16 },
                { name: 'Sat', organic: 6, aiAssisted: 21 },
                { name: 'Sun', organic: 5, aiAssisted: 18 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#0f172a', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="organic" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Organic Orders" />
                <Bar dataKey="aiAssisted" fill="#2563eb" radius={[4, 4, 0, 0]} name="AI Assisted Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
