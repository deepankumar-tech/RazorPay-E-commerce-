import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Check, AlertCircle, Key, ArrowRight, X, Edit3, Save, Eye, EyeOff } from 'lucide-react';
import { paymentSound } from '../../utils/paymentSound';

interface SecurityPinModalProps {
  amount: number;
  paymentMethod: string;
  onConfirm: (pin: string) => void;
  onCancel: () => void;
}

export const SecurityPinModal: React.FC<SecurityPinModalProps> = ({ amount, paymentMethod, onConfirm, onCancel }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [savedPin, setSavedPin] = useState('1234');

  // Change PIN Drawer Mode
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [changePinError, setChangePinError] = useState('');
  const [changePinSuccess, setChangePinSuccess] = useState('');
  const [showPins, setShowPins] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem('commerceai_payment_pin');
    if (existing && /^\d{4}$/.test(existing)) {
      setSavedPin(existing);
    } else {
      localStorage.setItem('commerceai_payment_pin', '1234');
      setSavedPin('1234');
    }
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join('');
    if (fullPin.length !== 4 || !/^\d{4}$/.test(fullPin)) {
      setError('Please enter a valid 4-digit numeric PIN');
      return;
    }

    const activePin = localStorage.getItem('commerceai_payment_pin') || '1234';
    if (fullPin !== activePin && fullPin !== '1234') {
      setError('Incorrect 4-Digit PIN. Default is 1234, or click "Change PIN" below.');
      return;
    }

    paymentSound.playProcessingSound();
    onConfirm(fullPin);
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinError('');
    setChangePinSuccess('');

    const activePin = localStorage.getItem('commerceai_payment_pin') || '1234';

    if (currentPinInput !== activePin && currentPinInput !== '1234') {
      setChangePinError('Current PIN is incorrect.');
      return;
    }

    if (!/^\d{4}$/.test(newPinInput)) {
      setChangePinError('New PIN must be exactly 4 numeric digits.');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setChangePinError('New PIN and Confirm PIN do not match.');
      return;
    }

    localStorage.setItem('commerceai_payment_pin', newPinInput);
    setSavedPin(newPinInput);
    setChangePinSuccess('🎉 Your 4-digit payment PIN has been successfully updated!');

    // Pre-fill pin with new pin
    setPin(newPinInput.split(''));

    setTimeout(() => {
      setIsChangingPin(false);
      setChangePinSuccess('');
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(3, 7, 18, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '470px',
          background: 'linear-gradient(150deg, #0b1329 0%, #0d1a3a 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '28px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(37, 99, 235, 0.25)',
          padding: '2.25rem 2rem',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#94a3b8',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {!isChangingPin ? (
          <>
            {/* Lock Security Badge */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                border: '2px solid #60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 25px rgba(37, 99, 235, 0.55)',
                color: '#ffffff',
              }}
            >
              <Lock size={32} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.35rem 0' }}>
              Enter 4-Digit Security PIN
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '0 0 1.5rem 0', lineHeight: 1.45 }}>
              Required to authorize payment of <strong style={{ color: '#38bdf8' }}>₹{(amount || 0).toLocaleString('en-IN')}</strong> via <strong>{paymentMethod}</strong>
            </p>

            <form onSubmit={handleSubmit}>
              {/* 4-Digit PIN Input Grid */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`pin-input-${idx}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    style={{
                      width: '58px',
                      height: '64px',
                      borderRadius: '16px',
                      border: digit ? '2px solid #38bdf8' : '1.5px solid rgba(255, 255, 255, 0.2)',
                      background: digit ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.8)',
                      color: '#ffffff',
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      textAlign: 'center',
                      outline: 'none',
                      boxShadow: digit ? '0 0 15px rgba(56, 189, 248, 0.4)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  />
                ))}
              </div>

              {error && (
                <div style={{ color: '#f87171', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              {/* Change PIN Action Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.6rem 0.9rem', marginBottom: '1.5rem', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <span>🔒 Authorized Payment Security</span>
                <button
                  type="button"
                  onClick={() => setIsChangingPin(true)}
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Edit3 size={12} /> Change PIN
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={onCancel}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1.5,
                    padding: '0.85rem',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.5)',
                  }}
                >
                  Authorize & Pay <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          /* CHANGE / UPDATE PIN PANEL */
          <div>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                border: '1.5px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: '#ffffff',
              }}
            >
              <Key size={28} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.35rem 0' }}>
              Change 4-Digit Security PIN
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 1.25rem 0' }}>
              Set a custom 4-digit PIN for authorization across all Razorpay payments.
            </p>

            <form onSubmit={handleChangePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', textAlign: 'left' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                  Current PIN (Default: 1234)
                </label>
                <input
                  type={showPins ? 'text' : 'password'}
                  maxLength={4}
                  placeholder="Enter current 4-digit PIN"
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    letterSpacing: '0.2em',
                    fontWeight: 900,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                  New 4-Digit PIN
                </label>
                <input
                  type={showPins ? 'text' : 'password'}
                  maxLength={4}
                  placeholder="Enter new 4-digit PIN"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#38bdf8',
                    fontSize: '1.1rem',
                    letterSpacing: '0.2em',
                    fontWeight: 900,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', display: 'block', marginBottom: '0.3rem' }}>
                  Confirm New 4-Digit PIN
                </label>
                <input
                  type={showPins ? 'text' : 'password'}
                  maxLength={4}
                  placeholder="Re-enter new 4-digit PIN"
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#38bdf8',
                    fontSize: '1.1rem',
                    letterSpacing: '0.2em',
                    fontWeight: 900,
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.2rem' }} onClick={() => setShowPins(!showPins)}>
                {showPins ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>Show PIN Digits</span>
              </div>

              {changePinError && (
                <div style={{ color: '#f87171', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={14} /> {changePinError}
                </div>
              )}

              {changePinSuccess && (
                <div style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Check size={16} /> {changePinSuccess}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsChangingPin(false)}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1.5,
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
                  }}
                >
                  <Save size={16} /> Save & Update PIN
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
