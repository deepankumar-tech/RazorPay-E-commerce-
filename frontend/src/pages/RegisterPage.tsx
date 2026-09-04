import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, UserPlus, ShieldCheck, Sparkles, Lock, ArrowRight, CheckCircle2, Store, User } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'MERCHANT'>('CUSTOMER');
  const [merchantName, setMerchantName] = useState('');
  const [error, setError] = useState('');

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register({
        name,
        email,
        password,
        role,
        merchantName: role === 'MERCHANT' ? merchantName : undefined,
      });
      navigate(role === 'MERCHANT' ? '/merchant/dashboard' : '/customer/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
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
                  Join the E-Commerce Platform
                </span>
              </div>
            </div>

            {/* Tagline */}
            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: 500 }}>
              Create your account to unlock conversational AI shopping assistance, automated store management, and Razorpay instant payment settlements.
            </p>

            {/* Key Benefits List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.4)', borderRadius: '10px', padding: '0.5rem', color: '#38bdf8', flexShrink: 0 }}>
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>Customer Account Features</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.15rem' }}>Voice AI copilot, personalized product curation & fast Razorpay checkout</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.5)', borderRadius: '10px', padding: '0.5rem', color: '#60a5fa', flexShrink: 0 }}>
                  <Store size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>Merchant Store Owner Tools</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.15rem' }}>AI campaign generation, rule guardrails, products & live order analytics</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '10px', padding: '0.5rem', color: '#4ade80', flexShrink: 0 }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>Razorpay Payment Gateway</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.15rem' }}>Full support for UPI, Cards, NetBanking, Wallets & 4-Digit Security PIN</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer Pill */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.82rem', fontWeight: 800 }}>
              <CheckCircle2 size={16} /> Instant Account Activation
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Razorpay Certified</span>
          </div>
        </div>

        {/* RIGHT PANEL: Registration Form */}
        <div style={{ padding: '3.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
              Create Your Account
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
              Select your account type and fill in your details to get started
            </p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', color: '#b91c1c', padding: '0.85rem 1rem', borderRadius: '12px', fontSize: '0.86rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Account Type Selector */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.45rem' }}>
                Account Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('CUSTOMER')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: role === 'CUSTOMER' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: role === 'CUSTOMER' ? '#eff6ff' : '#ffffff',
                    color: role === 'CUSTOMER' ? '#1d4ed8' : '#64748b',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <User size={16} /> Customer Account
                </button>

                <button
                  type="button"
                  onClick={() => setRole('MERCHANT')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: role === 'MERCHANT' ? '2px solid #16a34a' : '1px solid #e2e8f0',
                    background: role === 'MERCHANT' ? '#f0fdf4' : '#ffffff',
                    color: role === 'MERCHANT' ? '#15803d' : '#64748b',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Store size={16} /> Merchant Store
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.45rem' }}>
                Full Name
              </label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                style={{ padding: '0.8rem 1rem', borderRadius: '12px', fontSize: '0.92rem' }}
              />
            </div>

            {role === 'MERCHANT' && (
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.45rem' }}>
                  Merchant Store Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="e.g. Apex Tech & Electronics Store"
                  required
                  style={{ padding: '0.8rem 1rem', borderRadius: '12px', fontSize: '0.92rem' }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.45rem' }}>
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                required
                style={{ padding: '0.8rem 1rem', borderRadius: '12px', fontSize: '0.92rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.45rem' }}>
                Password
              </label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ padding: '0.8rem 1rem', borderRadius: '12px', fontSize: '0.92rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '0.98rem',
                fontWeight: 900,
                borderRadius: '12px',
                marginTop: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
              }}
              disabled={loading}
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  Register Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 800, textDecoration: 'none' }}>
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
