import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, Search, Shield } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data.data.users || []);
      } catch (err) {
        console.error('Failed to load admin users', err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Platform Users</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>
          All registered accounts across Customer, Merchant, and Admin roles.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.8rem' }}>Name</th>
              <th style={{ padding: '0.8rem' }}>Email</th>
              <th style={{ padding: '0.8rem' }}>Role</th>
              <th style={{ padding: '0.8rem' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.8rem', fontWeight: 600 }}>{u.name}</td>
                <td style={{ padding: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                <td style={{ padding: '0.8rem' }}>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-violet' : u.role === 'MERCHANT' ? 'badge-green' : 'badge-blue'}`}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '0.8rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
