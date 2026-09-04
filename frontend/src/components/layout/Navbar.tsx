import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useOliver } from '../../context/OliverContext';
import { Bot, ShoppingBag, User, LogOut, ShieldCheck, Sparkles, LayoutDashboard, History, Layers, BarChart3, Settings } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { openCopilot } = useOliver();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{ position: 'sticky', top: '1rem', zIndex: 100, margin: '0.5rem 1rem 1.5rem 1rem' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1rem' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <Bot size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              OLIVER
            </span>
            <span className="badge badge-violet" style={{ marginLeft: '0.4rem', fontSize: '0.65rem' }}>AGENTIC</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
          {(!isAuthenticated || user?.role === 'CUSTOMER') ? (
            <>
              <Link to="/customer/dashboard" style={{ color: 'var(--text-secondary)' }}>Home</Link>
              <Link to="/customer/ai-assistant" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                <Sparkles size={18} />
                AI Shopping Assistant
              </Link>
              <Link to="/customer/products" style={{ color: 'var(--text-secondary)' }}>Products</Link>
              <Link to="/customer/cart" style={{ color: 'var(--text-secondary)' }}>Cart</Link>
              <Link to="/customer/checkout" style={{ color: 'var(--text-secondary)' }}>Checkout</Link>
              <Link to="/customer/orders" style={{ color: 'var(--text-secondary)' }}>Orders</Link>
              <Link to="/customer/profile" style={{ color: 'var(--text-secondary)' }}>Profile / Settings</Link>
            </>
          ) : null}

          {isAuthenticated && (user?.role === 'MERCHANT' || user?.role === 'ADMIN') && (
            <>
              <Link to="/merchant/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link to="/merchant/campaigns" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                <Layers size={16} />
                Campaigns
              </Link>
              <Link to="/merchant/analytics" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                <BarChart3 size={16} />
                Analytics
              </Link>
              <Link to="/merchant/rules" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                <Settings size={16} />
                Rules
              </Link>
            </>
          )}

          <Link to="/audit-trail" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} />
            Audit Trail
          </Link>
        </div>

        {/* Action Buttons & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/cart" className="btn btn-secondary" style={{ position: 'relative', padding: '0.5rem 0.9rem' }}>
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'var(--accent-primary)',
                color: '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                <User size={18} />
                <span>{user?.name.split(' ')[0]}</span>
                <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>{user?.role}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 0.8rem', color: 'var(--danger)' }} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
