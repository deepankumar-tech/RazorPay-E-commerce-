import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Store, Package, ShoppingBag, CheckCircle2 } from 'lucide-react';

export const AdminMerchantsPage: React.FC = () => {
  const [merchants, setMerchants] = useState<any[]>([]);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const res = await api.get('/admin/merchants');
        setMerchants(res.data.data.merchants || []);
      } catch (err) {
        console.error('Failed to load admin merchants', err);
      }
    };
    fetchMerchants();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Registered Merchants</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>
          Onboarded merchant stores using AI Growth Agent services.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.8rem' }}>Store Name</th>
              <th style={{ padding: '0.8rem' }}>Business Type</th>
              <th style={{ padding: '0.8rem' }}>Products Count</th>
              <th style={{ padding: '0.8rem' }}>Orders Count</th>
              <th style={{ padding: '0.8rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.8rem', fontWeight: 600 }}>{m.businessName}</td>
                <td style={{ padding: '0.8rem', color: 'var(--text-secondary)' }}>{m.businessType}</td>
                <td style={{ padding: '0.8rem' }}>{m._count?.products || 0}</td>
                <td style={{ padding: '0.8rem' }}>{m._count?.orders || 0}</td>
                <td style={{ padding: '0.8rem' }}>
                  <span className="badge badge-green">ACTIVE</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
