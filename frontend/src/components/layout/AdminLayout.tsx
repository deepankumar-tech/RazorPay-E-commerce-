import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  CreditCard,
  Cpu,
  BarChart3,
  History,
  FileSpreadsheet,
  Settings,
  LogOut,
  Bot,
  Bell,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';
import { LogoutModal } from '../common/LogoutModal';
import { PageTransition } from '../common/PageTransition';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Merchants', path: '/admin/merchants', icon: Store },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'AI Activity', path: '/admin/ai-activity', icon: Cpu },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: History },
    { label: 'Reports', path: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 1rem',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100,
        }}
      >
        <div>
          {/* Brand */}
          <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.75rem', padding: '0 0.5rem', textDecoration: 'none' }}>
            <div style={{ background: '#2563eb', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={20} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              OLIVER<span style={{ color: '#2563eb' }}>.AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                    gap: '0.75rem',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#ffffff' : '#64748b',
                    background: isActive ? '#2563eb' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={18} color={isActive ? '#ffffff' : '#64748b'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Status Pill at bottom of sidebar */}
        <div>
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ background: '#22c55e', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={13} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>System Status</div>
              <div style={{ fontSize: '0.7rem', color: '#16a34a' }}>All systems operational</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 90,
            gap: '1.5rem',
          }}
        >
          {/* Notifications Bell */}
          <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Bell size={20} color="#64748b" />
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              1
            </span>
          </div>

          {/* Super Admin Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.25rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              AU
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Admin User</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Super Admin</div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto' }}>
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
