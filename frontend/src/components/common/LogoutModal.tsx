import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          maxWidth: '440px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          color: '#0f172a',
          fontFamily: "'Inter', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
        >
          <X size={18} />
        </button>

        {/* Icon & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={22} color="#dc2626" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Confirm Logout
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>OLIVER Session Security</span>
          </div>
        </div>

        {/* Body Message */}
        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55, margin: '0 0 1.5rem' }}>
          Are you sure you want to end your current session? Your cart items and AI assistant interactions are securely saved to your account.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#475569',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            style={{
              background: '#ef4444',
              border: 'none',
              color: '#ffffff',
              padding: '0.65rem 1.4rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)',
            }}
            disabled={loading}
          >
            <LogOut size={16} />
            {loading ? 'Logging out...' : 'Yes, Log Out'}
          </button>
        </div>
      </div>
    </div>
  );
};
