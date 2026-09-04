import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AccessDeniedPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleReturn = () => {
    if (user?.role === 'MERCHANT') {
      navigate('/merchant/dashboard');
    } else if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '2rem' }}>
      <div className="glass-card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ background: 'rgba(239,68,68,0.15)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(239,68,68,0.3)' }}>
          <ShieldAlert size={42} color="var(--danger)" />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--danger)', margin: 0 }}>403</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0 1rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          You don't have permission to access this page. Please contact your system administrator or return to your authorized dashboard.
        </p>

        <button onClick={handleReturn} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}>
          <ArrowLeft size={18} /> Return to Dashboard
        </button>
      </div>
    </div>
  );
};
