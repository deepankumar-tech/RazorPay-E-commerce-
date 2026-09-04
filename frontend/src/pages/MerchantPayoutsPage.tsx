import React from 'react';
import { CreditCard, ArrowDownRight, CheckCircle2, Clock } from 'lucide-react';

export const MerchantPayoutsPage: React.FC = () => {
  const payouts = [
    { id: 'PAY-8921', date: '2026-08-20', amount: '₹1,85,400', bank: 'HDFC Bank (**** 4892)', status: 'COMPLETED' },
    { id: 'PAY-8750', date: '2026-08-13', amount: '₹60,490', bank: 'HDFC Bank (**** 4892)', status: 'COMPLETED' },
    { id: 'PAY-8610', date: '2026-08-06', amount: '₹94,200', bank: 'HDFC Bank (**** 4892)', status: 'COMPLETED' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Merchant Payouts</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>
          Razorpay test mode settlements and automated store payout history.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Settlement</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.4rem' }}>₹48,250</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Settled</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.4rem' }}>₹3,40,090</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Payout History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.8rem' }}>Payout ID</th>
              <th style={{ padding: '0.8rem' }}>Date</th>
              <th style={{ padding: '0.8rem' }}>Amount</th>
              <th style={{ padding: '0.8rem' }}>Destination Bank</th>
              <th style={{ padding: '0.8rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.8rem', fontWeight: 600 }}>{p.id}</td>
                <td style={{ padding: '0.8rem', color: 'var(--text-muted)' }}>{p.date}</td>
                <td style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>{p.amount}</td>
                <td style={{ padding: '0.8rem', color: 'var(--text-secondary)' }}>{p.bank}</td>
                <td style={{ padding: '0.8rem' }}>
                  <span className="badge badge-green">{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
