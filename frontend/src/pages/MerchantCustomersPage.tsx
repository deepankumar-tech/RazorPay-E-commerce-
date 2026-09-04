import React from 'react';
import { Users, Search, Mail, Calendar, ShoppingBag } from 'lucide-react';

export const MerchantCustomersPage: React.FC = () => {
  const customers = [
    { name: 'Rahul Sharma', email: 'customer@demo.com', orders: 4, totalSpent: '₹12,450', lastOrder: '2026-08-22' },
    { name: 'Ananya Gupta', email: 'ananya@email.com', orders: 2, totalSpent: '₹4,890', lastOrder: '2026-08-18' },
    { name: 'Vikram Singh', email: 'vikram@email.com', orders: 1, totalSpent: '₹2,499', lastOrder: '2026-08-15' },
    { name: 'Neha Verma', email: 'neha@email.com', orders: 3, totalSpent: '₹8,990', lastOrder: '2026-08-10' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Merchant Customers</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>
          Registered customers purchasing from your store catalog.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.8rem' }}>Customer</th>
              <th style={{ padding: '0.8rem' }}>Email</th>
              <th style={{ padding: '0.8rem' }}>Orders</th>
              <th style={{ padding: '0.8rem' }}>Total Spent</th>
              <th style={{ padding: '0.8rem' }}>Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.8rem', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '0.8rem', color: 'var(--text-secondary)' }}>{c.email}</td>
                <td style={{ padding: '0.8rem' }}>{c.orders}</td>
                <td style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>{c.totalSpent}</td>
                <td style={{ padding: '0.8rem', color: 'var(--text-muted)' }}>{c.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
