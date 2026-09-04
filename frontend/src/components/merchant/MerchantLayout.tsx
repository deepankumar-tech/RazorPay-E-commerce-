import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Bot,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Sparkles,
  Layers,
  Megaphone,
  ScanLine,
  Activity,
  Cpu,
  ShieldAlert,
  CreditCard,
  Boxes,
  Receipt,
  FileCheck,
  AlertTriangle,
  Settings,
  ShieldCheck,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const MerchantLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navSections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        { label: 'Overview', path: '/merchant/dashboard', icon: <LayoutDashboard size={18} /> },
        { label: 'AI Revenue Copilot', path: '/merchant/copilot', icon: <Bot size={18} />, badge: 'LIVE' },
        { label: 'Products', path: '/merchant/products', icon: <Package size={18} /> },
        { label: 'Orders', path: '/merchant/orders', icon: <ShoppingBag size={18} /> },
        { label: 'Customers', path: '/merchant/customers', icon: <Users size={18} /> },
        { label: 'Analytics', path: '/merchant/analytics', icon: <TrendingUp size={18} /> },
      ],
    },
    {
      title: 'GROWTH',
      items: [
        { label: 'AI Opportunities', path: '/merchant/opportunities', icon: <Sparkles size={18} />, badge: '3 NEW' },
        { label: 'Upsell & Cross-sell', path: '/merchant/upsell', icon: <Layers size={18} /> },
        { label: 'Campaigns', path: '/merchant/campaigns', icon: <Megaphone size={18} /> },
      ],
    },
    {
      title: 'AGENTIC COMMERCE',
      items: [
        { label: 'AI-Readable Catalog', path: '/merchant/ai-catalog', icon: <ScanLine size={18} />, badge: '92%' },
        { label: 'AI Buyer Activity', path: '/merchant/agentic-commerce', icon: <Activity size={18} /> },
        { label: 'Transaction Policies', path: '/merchant/policies', icon: <ShieldAlert size={18} /> },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Inventory', path: '/merchant/inventory', icon: <Boxes size={18} /> },
        { label: 'Payments & Transactions', path: '/merchant/payments', icon: <Receipt size={18} /> },
        { label: 'Audit Trail', path: '/merchant/audit', icon: <FileCheck size={18} /> },
        { label: 'Failure Center', path: '/merchant/failure-center', icon: <AlertTriangle size={18} />, badge: 'TEST' },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Store Settings', path: '/merchant/settings', icon: <Settings size={18} /> },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      {/* SIDEBAR - DESKTOP */}
      <aside
        style={{
          width: sidebarCollapsed ? '80px' : '260px',
          background: 'radial-gradient(circle at top left, #0f172a 0%, #090d16 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100,
          boxSizing: 'border-box',
        }}
      >
        {/* LOGO BRANDING */}
        <div style={{ padding: '1.25rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(37,99,235,0.4)', flexShrink: 0 }}>
              <Bot size={22} color="#ffffff" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                  OLIVER<span style={{ color: '#38bdf8' }}>.AI</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>REVENUE OS</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.3rem', display: 'flex', alignItems: 'center' }}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* NAVIGATION SECTIONS */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
          {navSections.map((sec) => (
            <div key={sec.title} style={{ marginBottom: '1.25rem' }}>
              {!sidebarCollapsed && (
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', padding: '0 0.65rem 0.4rem 0.65rem', letterSpacing: '0.08em' }}>
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={sidebarCollapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                      padding: '0.6rem 0.75rem',
                      marginBottom: '0.2rem',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      background: isActive ? 'linear-gradient(90deg, rgba(37,99,235,0.25) 0%, rgba(56,189,248,0.1) 100%)' : 'transparent',
                      borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.85rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ color: isActive ? '#38bdf8' : '#94a3b8' }}>{item.icon}</span>
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 900, background: item.badge === 'LIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(56,189,248,0.15)', color: item.badge === 'LIVE' ? '#4ade80' : '#38bdf8', padding: '0.15rem 0.45rem', borderRadius: '8px', border: item.badge === 'LIVE' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(56,189,248,0.3)' }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '0.65rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              padding: '0.6rem 0.75rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* TOP HEADER */}
        <header
          style={{
            height: '70px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 90,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={14} color="#f59e0b" />
              <span>TechStore India</span>
            </div>

            {/* Live AI Status Pill */}
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
              <span>OLIVER ONLINE</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/merchant/copilot')}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 15px rgba(37,99,235,0.4)',
              }}
            >
              <Bot size={16} />
              <span>AI Revenue Copilot</span>
            </button>

            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>
              {user?.name || 'Merchant Admin'}
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <main style={{ flex: 1, padding: '1.75rem', boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
