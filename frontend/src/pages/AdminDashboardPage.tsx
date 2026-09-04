import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Calendar,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  UserPlus,
  Shield,
  FileText,
  Settings,
  MoreVertical,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  // Platform Analytics Line Chart Data
  const analyticsData = [
    { date: 'May 24', value: 20 },
    { date: 'May 31', value: 38 },
    { date: 'Jun 7', value: 30 },
    { date: 'Jun 14', value: 52 },
    { date: 'Jun 21', value: 45 },
    { date: 'Jun 24', value: 65 },
    { date: 'Jun 28', value: 50 },
    { date: 'Jul 4', value: 72 },
  ];

  // Orders Overview Pie Chart Data
  const ordersOverviewData = [
    { name: 'Completed', value: 72, color: '#22c55e' },
    { name: 'Pending', value: 18, color: '#a855f7' },
    { name: 'Failed', value: 6, color: '#ef4444' },
    { name: 'Cancelled', value: 4, color: '#94a3b8' },
  ];

  // AI Activity Bar Chart Data
  const aiActivityData = [
    { day: 'M', count: 4200 },
    { day: 'T', count: 5400 },
    { day: 'W', count: 3200 },
    { day: 'T', count: 4100 },
    { day: 'F', count: 4800 },
    { day: 'S', count: 2600 },
    { day: 'S', count: 6800 },
    { day: 'M', count: 7400 },
  ];

  // Top Merchants List
  const topMerchants = [
    { name: 'StoreMart', avatar: 'SM', color: '#f97316' },
    { name: 'TechHub', avatar: 'TH', color: '#ef4444' },
    { name: 'GadgetZone', avatar: 'GZ', color: '#3b82f6' },
    { name: 'DailyNeeds', avatar: 'DN', color: '#8b5cf6' },
    { name: 'FashionHub', avatar: 'FH', color: '#ec4899' },
  ];

  // Recent System Alerts Data
  const systemAlerts = [
    {
      alert: 'High failed payment attempts',
      type: 'Security',
      time: '10:30 AM',
      status: 'Warning',
      badgeBg: '#fef3c7',
      badgeColor: '#d97706',
    },
    {
      alert: 'New merchant registration',
      type: 'System',
      time: '09:45 AM',
      status: 'Info',
      badgeBg: '#dbeafe',
      badgeColor: '#2563eb',
    },
    {
      alert: 'AI service rate limit reached',
      type: 'AI Service',
      time: '08:20 AM',
      status: 'Warning',
      badgeBg: '#fef3c7',
      badgeColor: '#d97706',
    },
    {
      alert: 'Database backup completed',
      type: 'System',
      time: '07:00 AM',
      status: 'Success',
      badgeBg: '#dcfce7',
      badgeColor: '#16a34a',
    },
    {
      alert: 'Large order detected #ORD12345',
      type: 'System',
      time: '06:15 AM',
      status: 'Info',
      badgeBg: '#dbeafe',
      badgeColor: '#2563eb',
    },
  ];

  // System Services Status
  const systemServices = [
    { name: 'API Server', status: 'Operational' },
    { name: 'Database', status: 'Operational' },
    { name: 'AI Service', status: 'Operational' },
    { name: 'Payment Gateway', status: 'Operational' },
    { name: 'Email Service', status: 'Operational' },
    { name: 'File Storage', status: 'Operational' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Title & Date Range Filter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
          Platform Overview
        </h1>

        {/* Date Filter Dropdown */}
        <button
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.5rem 0.9rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <Calendar size={15} color="#64748b" />
          <span>May 24 - Jun 24, 2024</span>
          <ChevronDown size={14} color="#64748b" />
        </button>
      </div>

      {/* 1. Platform KPI Metric Cards (4 White Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {/* Total Merchants */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>Total Merchants</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {stats?.totalMerchants || '128'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a', fontSize: '0.78rem', marginTop: '0.6rem', fontWeight: 600 }}>
            <span>↑ 12.8%</span>
          </div>
        </div>

        {/* Total Customers */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>Total Customers</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {stats?.totalCustomers ? stats.totalCustomers.toLocaleString('en-IN') : '12,540'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a', fontSize: '0.78rem', marginTop: '0.6rem', fontWeight: 600 }}>
            <span>↑ 18.6%</span>
          </div>
        </div>

        {/* Total GMV */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>Total GMV</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            ₹{stats?.totalGmv ? stats.totalGmv.toLocaleString('en-IN') : '48,65,230'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a', fontSize: '0.78rem', marginTop: '0.6rem', fontWeight: 600 }}>
            <span>↑ 22.4%</span>
          </div>
        </div>

        {/* AI Transactions */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>AI Transactions</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {stats?.aiTransactions || '4,821'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a', fontSize: '0.78rem', marginTop: '0.6rem', fontWeight: 600 }}>
            <span>↑ 25.7%</span>
          </div>
        </div>
      </div>

      {/* 2. Platform Analytics & Orders Overview (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        {/* Platform Analytics Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Platform Analytics</h3>
            <button
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: 'pointer',
              }}
            >
              <span>Daily</span>
              <ChevronDown size={13} />
            </button>
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#f1f5f9' }} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}L`}
                />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '6px', color: '#ffffff', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${val} Lakhs`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Overview Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Orders Overview</h3>

          <div style={{ display: 'flex', alignItems: 'center', height: '170px' }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersOverviewData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={66}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {ordersOverviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
              {ordersOverviewData.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  <span style={{ color: '#64748b' }}>{item.name}</span>
                  <span style={{ fontWeight: 700, color: '#0f172a', marginLeft: 'auto' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top Merchants, Payment Overview & AI Activity (3 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        {/* Card 1: Top Merchants */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>Top Merchants</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {topMerchants.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: m.color,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {m.avatar}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', marginTop: '1.25rem', padding: 0 }}>
            View All
          </button>
        </div>

        {/* Card 2: Payment Overview */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Payment Overview</h3>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.3rem' }}>Success Rate</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            {stats?.paymentSuccessRate || '96.8'}%
          </div>

          {/* Green Progress Bar */}
          <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ width: '96.8%', height: '100%', background: '#16a34a', borderRadius: '4px' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Successful Payments</span>
              <strong style={{ color: '#0f172a' }}>15,842</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Failed Payments</span>
              <strong style={{ color: '#0f172a' }}>{stats?.failedPayments || '512'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Refunds</span>
              <strong style={{ color: '#0f172a' }}>128</strong>
            </div>
          </div>
        </div>

        {/* Card 3: AI Activity */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>AI Activity</h3>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.2rem' }}>Total AI Interactions</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>28,450</span>
              <span style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: 600 }}>↑ 26.4%</span>
            </div>

            <div style={{ height: '90px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiActivityData}>
                  <Bar dataKey="count" fill="#2563eb" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', marginTop: '1rem', padding: 0 }}>
            View Details
          </button>
        </div>
      </div>

      {/* 4. Recent System Alerts & System Status (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        {/* Recent System Alerts Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>Recent System Alerts</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem 0', color: '#64748b', fontWeight: 600 }}>Alert</th>
                    <th style={{ padding: '0.5rem 0', color: '#64748b', fontWeight: 600 }}>Type</th>
                    <th style={{ padding: '0.5rem 0', color: '#64748b', fontWeight: 600 }}>Time</th>
                    <th style={{ padding: '0.5rem 0', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {systemAlerts.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '0.7rem 0', fontWeight: 500, color: '#1e293b' }}>{row.alert}</td>
                      <td style={{ padding: '0.7rem 0', color: '#64748b' }}>{row.type}</td>
                      <td style={{ padding: '0.7rem 0', color: '#64748b' }}>{row.time}</td>
                      <td style={{ padding: '0.7rem 0', textAlign: 'right' }}>
                        <span
                          style={{
                            background: row.badgeBg,
                            color: row.badgeColor,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', marginTop: '1rem', padding: 0 }}>
            View All Alerts
          </button>
        </div>

        {/* System Status Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>System Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {systemServices.map((srv, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#334155', fontWeight: 500 }}>{srv.name}</span>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>{srv.status}</span>
                </div>
              ))}
            </div>
          </div>

          <button style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', marginTop: '1rem', padding: 0 }}>
            View System Logs
          </button>
        </div>
      </div>

      {/* 5. Quick Actions Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <button
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#1e293b',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <UserPlus size={16} color="#2563eb" />
            <span>Add Merchant</span>
          </button>

          <button
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#1e293b',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Shield size={16} color="#2563eb" />
            <span>Add Admin</span>
          </button>

          <button
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#1e293b',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <FileText size={16} color="#2563eb" />
            <span>View Reports</span>
          </button>

          <button
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#1e293b',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Settings size={16} color="#2563eb" />
            <span>System Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
