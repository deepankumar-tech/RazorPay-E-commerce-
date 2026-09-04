import React, { useState, useEffect } from 'react';
import { merchantService } from '../../services/merchantService';
import { FileCheck, ShieldAlert, DollarSign, Filter, CheckCircle, AlertTriangle } from 'lucide-react';

export const MerchantAuditTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [moneyOnly, setMoneyOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    merchantService
      .getAuditTrail(moneyOnly)
      .then((res) => {
        if (res.data?.logs) setLogs(res.data.logs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [moneyOnly]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileCheck size={24} color="#38bdf8" /> IMMUTABLE AUDIT TRAIL
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Inspect every action, policy decision, approval, and money-related execution.</p>
        </div>

        {/* MONEY ACTIONS FILTER TOGGLE */}
        <button
          onClick={() => setMoneyOnly(!moneyOnly)}
          style={{
            background: moneyOnly ? '#2563eb' : 'rgba(15, 23, 42, 0.7)',
            border: moneyOnly ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <DollarSign size={16} /> {moneyOnly ? 'Showing Money Actions Only' : 'Filter Money Actions Only'}
        </button>
      </div>

      {/* AUDIT LOG TABLE */}
      <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
              <th style={{ padding: '1rem 1.25rem' }}>Timestamp</th>
              <th style={{ padding: '1rem 1.25rem' }}>Actor</th>
              <th style={{ padding: '1rem 1.25rem' }}>Action</th>
              <th style={{ padding: '1rem 1.25rem' }}>Resource</th>
              <th style={{ padding: '1rem 1.25rem' }}>Amount</th>
              <th style={{ padding: '1rem 1.25rem' }}>Status</th>
              <th style={{ padding: '1rem 1.25rem' }}>Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#ffffff' }}>
                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8' }}>{new Date(log.createdAt).toLocaleTimeString()}</td>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 800 }}>{log.actorType || 'AI_AGENT'}</td>
                <td style={{ padding: '1rem 1.25rem', color: '#38bdf8', fontWeight: 700 }}>{log.action}</td>
                <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1' }}>{log.resource}</td>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 800 }}>{log.amount ? `₹${log.amount.toLocaleString('en-IN')}` : '-'}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ color: log.status === 'BLOCKED' ? '#ef4444' : log.status === 'SUCCESS' || log.status === 'ALLOWED' ? '#4ade80' : '#f59e0b', fontWeight: 800 }}>
                    {log.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1', fontSize: '0.8rem', maxWidth: '300px' }}>{log.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
