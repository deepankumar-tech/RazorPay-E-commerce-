import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Zap,
  Package,
  ShoppingBag,
  BarChart3,
  Layers,
  Settings,
  ShieldCheck,
  History,
  Users,
  CreditCard,
  LogOut,
  Bot,
  ChevronRight,
  Download,
} from 'lucide-react';
import { LogoutModal } from '../common/LogoutModal';
import { PageTransition } from '../common/PageTransition';

export const MerchantLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      navigate('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { label: 'Overview', path: '/merchant/dashboard', icon: LayoutDashboard },
    { label: 'AI Growth Insights', path: '/merchant/ai-insights', icon: Zap },
    { label: 'Products', path: '/merchant/products', icon: Package },
    { label: 'Orders', path: '/merchant/orders', icon: ShoppingBag },
    { label: 'Analytics', path: '/merchant/analytics', icon: BarChart3 },
    { label: 'Campaigns', path: '/merchant/campaigns', icon: Layers },
    { label: 'Merchant Rules', path: '/merchant/rules', icon: Settings },
    { label: 'Transaction Guard', path: '/merchant/transaction-guard', icon: ShieldCheck },
    { label: 'AI Audit Trail', path: '/merchant/audit-trail', icon: History },
    { label: 'Customers', path: '/merchant/customers', icon: Users },
    { label: 'Payouts', path: '/merchant/payouts', icon: CreditCard },
    { label: 'Settings', path: '/merchant/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.2rem 1rem',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div>
          {/* Brand */}
          <Link to="/merchant/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.8rem', padding: '0 0.5rem', textDecoration: 'none' }}>
            <div style={{ background: 'var(--accent-gradient)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <Bot size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '-0.02em' }}>
                OLIVER
              </span>
              <span className="badge badge-blue" style={{ marginLeft: '0.4rem', fontSize: '0.6rem' }}>MERCHANT</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-gradient)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <Icon size={17} color={isActive ? '#ffffff' : 'var(--text-secondary)'} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Merchant Profile Footer */}
        <div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d', fontWeight: 700 }}>
                {user?.name ? user.name.charAt(0) : 'M'}
              </div>
              <div style={{ fontSize: '0.82rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0] || 'Merchant'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Merchant Partner</div>
              </div>
            </div>
            <button onClick={() => setShowLogoutModal(true)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', color: 'var(--danger)' }} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        {/* Top Header */}
        <header style={{ height: '64px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 90 }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Welcome back, </span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{user?.name}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-gold" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
              May 24 - Jun 24, 2026
            </span>
            <button className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}>
              <Download size={14} /> Export Report
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: '1.5rem 2rem' }}>
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        loading={loggingOut}
      />
    </div>
  );
};
