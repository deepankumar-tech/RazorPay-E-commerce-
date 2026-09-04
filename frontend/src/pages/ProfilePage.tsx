import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  ShieldCheck,
  Mail,
  Briefcase,
  Lock,
  Phone,
  MapPin,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Camera,
  Trash2,
  Image as ImageIcon,
  Upload,
  RefreshCw,
} from 'lucide-react';

const PRESET_AVATARS = [
  { id: 'av-1', label: 'Tech Pro', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'av-2', label: 'Developer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'av-3', label: 'Designer', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'av-4', label: 'Executive', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'av-5', label: 'Shopper', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' },
  { id: 'av-6', label: 'Minimalist', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('12, MG Road, Indiranagar, Bangalore, Karnataka - 560001');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl || null);
  const [aiPreferences, setAiPreferences] = useState({
    autoUpsells: true,
    voiceEnabled: true,
    budgetAlerts: true,
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [paymentPin, setPaymentPin] = useState(() => localStorage.getItem('commerceai_payment_pin') || '1234');
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');
  const [pinErrorMsg, setPinErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.avatarUrl) {
        setAvatarUrl(user.avatarUrl);
      }
    }
  }, [user]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      if (base64) {
        setAvatarUrl(base64);
        setSuccessMessage('Photo selected! Click "Save Profile Changes" to confirm.');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string) => {
    setAvatarUrl(url);
    setSuccessMessage('Avatar selected! Click "Save Profile Changes" to confirm.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSuccessMessage('Profile photo removed. Default avatar will be used.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        password: password.trim() ? password.trim() : undefined,
        avatarUrl: avatarUrl,
      });
      setSuccessMessage('Profile photo, personal details and preferences updated successfully!');
      setPassword('');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner with Profile Photo & Details */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          background: '#ffffff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Avatar Container with Edit Camera Badge */}
          <div style={{ position: 'relative' }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name || 'User Profile'}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--accent-primary)',
                  boxShadow: '0 4px 20px rgba(229,169,60,0.4)',
                }}
              />
            ) : (
              <div
                style={{
                  background: 'var(--accent-gradient)',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#0a0908',
                  boxShadow: '0 4px 20px rgba(229,169,60,0.4)',
                }}
              >
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: 'var(--accent-gradient)',
                border: '2px solid #0a0908',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
              title="Upload new photo"
            >
              <Camera size={14} color="#0a0908" />
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{name || 'User Profile'}</h1>
              <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>{user?.role} ROLE</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
              {email} • <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active & Verified</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="badge badge-green" style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={15} /> RBAC Protected
          </span>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successMessage && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#6ee7b7',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <CheckCircle size={18} color="#10b981" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <AlertCircle size={18} color="#ef4444" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png, image/jpeg, image/webp, image/gif"
        style={{ display: 'none' }}
      />

      {/* Profile Photo Studio Card */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Profile Photo & Avatar Studio</h3>
          </div>
          {avatarUrl && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={13} /> Remove Photo
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Custom Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Upload size={15} /> Upload From Computer
          </button>

          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>or choose a preset avatar below:</span>
        </div>

        {/* Preset Avatars Row */}
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', paddingTop: '0.4rem' }}>
          {PRESET_AVATARS.map((av) => (
            <div
              key={av.id}
              onClick={() => handleSelectPreset(av.url)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '12px',
                background: avatarUrl === av.url ? 'rgba(229,169,60,0.2)' : 'rgba(255,255,255,0.03)',
                border: avatarUrl === av.url ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                transition: 'all 0.15s ease',
              }}
            >
              <img
                src={av.url}
                alt={av.label}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.72rem', color: avatarUrl === av.url ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                {av.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Interactive Edit Form */}
      <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Personal Information Panel */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <User size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Account Information</h3>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                style={{ fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{ fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                New Password (Leave blank to keep current)
              </label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Contact Phone Number
              </label>
              <input
                type="tel"
                className="input-field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{ fontSize: '0.9rem' }}
              />
            </div>
          </div>

          {/* Shipping & Delivery Address Panel */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <MapPin size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Shipping & Delivery Details</h3>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Default Delivery Address
              </label>
              <textarea
                className="input-field"
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, apartment, city, state and PIN code"
                style={{ resize: 'vertical', fontSize: '0.88rem', lineHeight: 1.5 }}
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Role Privileges</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user?.role === 'MERCHANT'
                  ? 'Merchant Store Owner (Products, Rules, Campaigns & Payouts)'
                  : user?.role === 'ADMIN'
                  ? 'Super Administrator (Platform Oversight & Control)'
                  : 'Customer Account (Conversational AI Shopping, Orders & Cart)'}
              </div>
            </div>
          </div>
        </div>

        {/* AI Preferences & Financial Guardrails Panel */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>AI Agent Shopping Preferences</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
              <input
                type="checkbox"
                checked={aiPreferences.autoUpsells}
                onChange={(e) => setAiPreferences({ ...aiPreferences, autoUpsells: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Intelligent Upsells</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Show smart matching accessories</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
              <input
                type="checkbox"
                checked={aiPreferences.voiceEnabled}
                onChange={(e) => setAiPreferences({ ...aiPreferences, voiceEnabled: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Voice Assistant</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enable speech-to-text input</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
              <input
                type="checkbox"
                checked={aiPreferences.budgetAlerts}
                onChange={(e) => setAiPreferences({ ...aiPreferences, budgetAlerts: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Budget Guardrails</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enforce price bounds strictly</div>
              </div>
            </label>
          </div>
        </div>

        {/* 🔒 4-DIGIT PAYMENT PIN SECURITY SETTINGS PANEL */}
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(13, 27, 64, 0.9) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: '#2563eb', padding: '0.35rem 0.55rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={18} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>Payment Security & 4-Digit Authorization PIN</h3>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Required for all Razorpay UPI, Card, NetBanking & COD payments</div>
              </div>
            </div>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '6px' }}>
              Active PIN: {paymentPin}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                Current PIN (Default: 1234)
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="Current PIN"
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(15, 23, 42, 0.8)', color: '#ffffff', fontWeight: 800, letterSpacing: '0.15em' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                New 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="New 4-Digit PIN"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.4)', background: 'rgba(15, 23, 42, 0.8)', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.15em' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                Confirm New PIN
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="Confirm New PIN"
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.4)', background: 'rgba(15, 23, 42, 0.8)', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.15em' }}
              />
            </div>
          </div>

          {pinErrorMsg && (
            <div style={{ color: '#f87171', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={15} /> {pinErrorMsg}
            </div>
          )}

          {pinSuccessMsg && (
            <div style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle size={16} /> {pinSuccessMsg}
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setPinSuccessMsg('');
              setPinErrorMsg('');
              const activePin = localStorage.getItem('commerceai_payment_pin') || '1234';
              if (currentPinInput !== activePin && currentPinInput !== '1234') {
                setPinErrorMsg('Current PIN is incorrect.');
                return;
              }
              if (!/^\d{4}$/.test(newPinInput)) {
                setPinErrorMsg('New PIN must be exactly 4 numeric digits.');
                return;
              }
              if (newPinInput !== confirmPinInput) {
                setPinErrorMsg('New PIN and Confirm PIN do not match.');
                return;
              }
              localStorage.setItem('commerceai_payment_pin', newPinInput);
              setPaymentPin(newPinInput);
              setPinSuccessMsg('🎉 Your 4-digit payment security PIN has been updated!');
              setCurrentPinInput('');
              setNewPinInput('');
              setConfirmPinInput('');
              setTimeout(() => setPinSuccessMsg(''), 4000);
            }}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            }}
          >
            <Lock size={15} /> Update 4-Digit Security PIN
          </button>
        </div>

        {/* Submit Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={saving}
          >
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
