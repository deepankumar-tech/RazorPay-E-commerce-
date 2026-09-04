import React from 'react';
import { CreditCard, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const payments = [
    { id: 'PAY-RZP-9021', orderNo: 'ORD17245601', amount: '₹3,598', method: 'Razorpay TEST MODE', status: 'SUCCESS', date: '2026-08-25 10:12' },
    { id: 'PAY-RZP-9018', orderNo: 'ORD17245590', amount: '₹1,299', method: 'Razorpay TEST MODE', status: 'SUCCESS', date: '2026-08-25 09:45' },
    { id: 'PAY-RZP-8995', orderNo: 'ORD17245412', amount: '₹2,499', method: 'Razorpay TEST MODE', status: 'FAILED', date: '2026-08-24 18:20' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Platform Payments</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>
          Razorpay test mode transactions and payment verification audit trail.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.8rem' }}>Payment ID</th>
              <th style={{ padding: '0.8rem' }}>Order No</th>
              <th style={{ padding: '0.8rem' }}>Amount</th>
              <th style={{ padding: '0.8rem' }}>Payment Gateway</th>
              <th style={{ padding: '0.8rem' }}>Status</th>
              <th style={{ padding: '0.8rem' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.8rem', fontWeight: 600 }}>{p.id}</td>
                <td style={{ padding: '0.8rem', color: 'var(--text-secondary)' }}>{p.orderNo}</td>
                <td style={{ padding: '0.8rem', fontWeight: 700 }}>{p.amount}</td>
                <td style={{ padding: '0.8rem' }}><span className="badge badge-violet">{p.method}</span></td>
                <td style={{ padding: '0.8rem' }}>
                  <span className={`badge ${p.status === 'SUCCESS' ? 'badge-green' : 'badge-red'}`}>{p.status}</span>
                </td>
                <td style={{ padding: '0.8rem', color: 'var(--text-muted)' }}>{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
