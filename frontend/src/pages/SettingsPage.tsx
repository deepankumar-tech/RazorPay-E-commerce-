import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Cpu,
  Shield,
  CreditCard,
  Bell,
  Moon,
  Volume2,
  Lock,
  Save,
  CheckCircle,
  Smartphone,
  Eye,
  Sliders,
  DollarSign,
  RefreshCw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  // Settings State
  const [themeMode, setThemeMode] = useState<'BUILDATHON_GOLD' | 'MIDNIGHT_DARK' | 'MINIMAL_SLATE'>('BUILDATHON_GOLD');
  const [aiAutonomy, setAiAutonomy] = useState<'AUTONOMOUS' | 'CONFIRM_CART' | 'ADVISORY_ONLY'>('AUTONOMOUS');
  const [maxUpsellBudget, setMaxUpsellBudget] = useState(1500);
  const [autoSpeakVoice, setAutoSpeakVoice] = useState(true);
  const [showToolTraces, setShowToolTraces] = useState(true);
  const [preferredPayment, setPreferredPayment] = useState<'RAZORPAY_UPI' | 'CARDS' | 'NETBANKING'>('RAZORPAY_UPI');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  const [orderPushNotifications, setOrderPushNotifications] = useState(true);

  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
    }, 600);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          background: '#ffffff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              background: '#2563eb',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(37,99,235,0.25)',
            }}
          >
            <Settings size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Account Settings</h1>
              <span className="badge badge-blue">Security & Preferences</span>
            </div>
            <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>
              Manage your credentials, active sessions, notification alerts, and guardrail limits
            </p>
          </div>
        </div>

        {savedToast && (
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#6ee7b7', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle size={16} /> Preferences Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* 1. AI Agent Intelligence & Autonomy Settings */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Cpu size={20} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>AI Agent Autonomy & Reasoning</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.1rem 0 0' }}>Configure how the Gemini AI agent acts during shopping sessions</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Agent Autonomy Level */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Agent Autonomy Mode
              </label>
              <select
                value={aiAutonomy}
                onChange={(e) => setAiAutonomy(e.target.value as any)}
                className="input-field"
                style={{ fontSize: '0.88rem' }}
              >
                <option value="AUTONOMOUS">⚡ Full Autonomous (Search + Cart + Upsell)</option>
                <option value="CONFIRM_CART">✋ Ask Before Cart Actions (Requires Confirmation)</option>
                <option value="ADVISORY_ONLY">📖 Advisory Only (Recommendations Without Cart Actions)</option>
              </select>
            </div>

            {/* Max Upsell Limit */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Max Upsell Recommendation Cap
                </label>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  ₹{maxUpsellBudget.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={5000}
                step={250}
                value={maxUpsellBudget}
                onChange={(e) => setMaxUpsellBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Limits automatic complementary product price proposals</span>
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', paddingTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
              <input
                type="checkbox"
                checked={autoSpeakVoice}
                onChange={(e) => setAutoSpeakVoice(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Auto-Speak AI Responses</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Read answers aloud via Web Speech</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
              <input
                type="checkbox"
                checked={showToolTraces}
                onChange={(e) => setShowToolTraces(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Show Tool Execution Badges</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Display real-time tool trace badges</div>
              </div>
            </label>
          </div>
        </div>

        {/* 2. Payment & Razorpay Test Mode Settings */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <CreditCard size={20} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Payment & Checkout Guardrails</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.1rem 0 0' }}>Razorpay Test Mode configuration & financial safeguards</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Preferred Checkout Gateway
              </label>
              <select
                value={preferredPayment}
                onChange={(e) => setPreferredPayment(e.target.value as any)}
                className="input-field"
                style={{ fontSize: '0.88rem' }}
              >
                <option value="RAZORPAY_UPI">Razorpay UPI (Fast Checkout & QR)</option>
                <option value="CARDS">Credit / Debit Cards (Razorpay Test Cards)</option>
                <option value="NETBANKING">Netbanking (HDFC, ICICI, SBI)</option>
              </select>
            </div>

            <div style={{ background: 'rgba(229,169,60,0.08)', border: '1px solid rgba(229,169,60,0.2)', padding: '0.85rem 1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.2rem' }}>
                🛡️ Financial Guardrail Status
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Customer explicit confirmation required before every payment capture. No duplicate charging on network failure.
              </div>
            </div>
          </div>
        </div>

        {/* 3. Security, Sessions & 2FA */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Shield size={20} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Security & Active Sessions</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.1rem 0 0' }}>Manage authentication tokens and browser access</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Two-Factor Authentication (2FA)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Require SMS / TOTP verification on new logins</div>
            </div>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Active Session Info */}
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Smartphone size={20} color="var(--accent-primary)" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Current Browser Session</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Windows • Google Chrome • localhost:5173</div>
              </div>
            </div>
            <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Active Now</span>
          </div>
        </div>

        {/* 4. Notifications & Alerts */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Bell size={20} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Notification Preferences</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.1rem 0 0' }}>Order status updates and AI market alerts</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
              <input
                type="checkbox"
                checked={orderPushNotifications}
                onChange={(e) => setOrderPushNotifications(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Order Tracking Alerts</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time payment and dispatch updates</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
              <input
                type="checkbox"
                checked={priceDropAlerts}
                onChange={(e) => setPriceDropAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>AI Price Drop Radar</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notify when saved items drop in price</div>
              </div>
            </label>
          </div>
        </div>

        {/* Save Changes Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={saving}
          >
            <Save size={18} /> {saving ? 'Applying Preferences...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
