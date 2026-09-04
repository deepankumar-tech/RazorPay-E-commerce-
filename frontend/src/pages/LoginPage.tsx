import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, LogIn, Key, UserCheck, ShieldCheck, Zap, Sparkles, ShoppingBag, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const role = storedUser?.role;
      if (role === 'MERCHANT') {
        navigate('/merchant/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: '#f8fafc',
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          minHeight: '620px',
          background: '#ffffff',
          borderRadius: '28px',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.12), 0 0 30px rgba(37, 99, 235, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* LEFT PANEL: CommerceAI Brand & Feature Highlights */}
        <div
          style={{
            background: 'linear-gradient(140deg, #02042b 0%, #0d1b40 45%, #0f172a 100%)',
            color: '#ffffff',
            padding: '3.5rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Ambient Background Glows */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              left: '-80px',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(0,0,0,0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              right: '-60px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(0,0,0,0) 70%)',
              pointerEvents: 'none',
            }}
          />

          <div>
            {/* Project Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  border: '2px solid #60a5fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(37,99,235,0.5)',
                  flexShrink: 0,
                }}
              >
                <Bot size={30} color="#ffffff" />
              </div>
              <div>
                <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  OLIVER<span style={{ color: '#38bdf8' }}>.AI</span>
                </h1>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Autonomous E-Commerce Engine
                </span>
              </div>
            </div>

            {/* Tagline */}
            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: 500 }}>
              Welcome to the next generation of conversational AI shopping, instant Razorpay settlement, and autonomous order fulfillment.
            </p>

            {/* Key Features List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.4)', borderRadius: '10px', padding: '0.5rem', color: '#38bdf8', flexShrink: 0 }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>Razorpay Secure Gateway</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.15rem' }}>Unified UPI, Cards & NetBanking with 4-Digit Security PIN</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.5)', borderRadius: '10px', padding: '0.5rem', color: '#60a5fa', flexShrink: 0 }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>Autonomous AI Shopping Copilot</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.15rem' }}>Conversational catalog evaluation, instant search & smart carting</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '10px', padding: '0.5rem', color: '#4ade80', flexShrink: 0 }}>
                  <Lock size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>Merchant Financial Guardrails</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.15rem' }}>Transaction caps, discount limits & explicit customer authorization</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer Pill */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.82rem', fontWeight: 800 }}>
              <CheckCircle2 size={16} /> 100% Encrypted & Safe
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>v2.4.0 Live</span>
          </div>
        </div>

        {/* RIGHT PANEL: Sign In Form */}
        <div style={{ padding: '3.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
              Sign In to Your Account
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
              Access your online store, AI shopping copilot, and order history
            </p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', color: '#b91c1c', padding: '0.85rem 1rem', borderRadius: '12px', fontSize: '0.86rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.45rem' }}>
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. customer@demo.com"
                required
                style={{ padding: '0.85rem 1rem', borderRadius: '12px', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155' }}>Password</label>
              </div>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ padding: '0.85rem 1rem', borderRadius: '12px', fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '1rem',
                fontWeight: 900,
                borderRadius: '12px',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
              }}
              disabled={loading}
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Sign-in Section */}
          <div style={{ marginTop: '2.25rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <UserCheck size={14} color="#2563eb" /> Quick Demo Accounts (Click to Fill):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => fillDemoAccount('customer@demo.com')}
                style={{
                  padding: '0.7rem 0.9rem',
                  borderRadius: '10px',
                  border: '1px solid #bfdbfe',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                👤 Customer Demo
                <div style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 600, marginTop: '0.1rem' }}>customer@demo.com</div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('merchant@demo.com')}
                style={{
                  padding: '0.7rem 0.9rem',
                  borderRadius: '10px',
                  border: '1px solid #bbf7d0',
                  background: '#f0fdf4',
                  color: '#15803d',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                🏪 Merchant Demo
                <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, marginTop: '0.1rem' }}>merchant@demo.com</div>
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 800, textDecoration: 'none' }}>
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
