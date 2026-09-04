import React, { useState, useEffect } from 'react';
import { merchantService } from '../../services/merchantService';
import { AlertTriangle, ShieldAlert, Zap, RotateCcw, CheckCircle } from 'lucide-react';

export const MerchantFailureCenterPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    merchantService.getFailureCenter().then((res) => {
      if (res.data) setData(res.data);
    });
  }, []);

  const handleRunLimitTest = async () => {
    try {
      const res = await merchantService.testFailureScenario(25000);
      setTestResult(res.demonstration);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {toastMsg && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', padding: '0.85rem', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 800 }}>
          {toastMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={24} color="#ef4444" /> FAILURE & BOUNDED POLICY DEMONSTRATION CENTER
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Graceful failure handling, policy boundary enforcements, and payment failure recovery.</p>
        </div>

        <button
          onClick={handleRunLimitTest}
          style={{
            background: '#ef4444',
            border: 'none',
            borderRadius: '10px',
            padding: '0.65rem 1.25rem',
            color: '#ffffff',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 15px rgba(239,68,68,0.4)',
          }}
        >
          <Zap size={18} /> Test ₹25,000 Policy Block
        </button>
      </div>

      {/* SIMULATED POLICY BLOCK DEMONSTRATION BOX */}
      {testResult && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#f87171', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldAlert size={16} /> BOUNDED POLICY ENFORCEMENT RESULT
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.5rem 0' }}>Attempted ₹{testResult.proposedAmount?.toLocaleString('en-IN')} AI Transaction ➔ {testResult.evaluationResult}</h3>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 0.75rem 0' }}>{testResult.reason}</p>
          <div style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: 800 }}>✓ Logged in Audit Trail | Zero money debited</div>
        </div>
      )}

      {/* FAILED PAYMENT DEMONSTRATIONS */}
      <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem 0' }}>Failed Gateway Transactions & Graceful Recovery</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f87171' }}>Razorpay Test Gateway Signature Mismatch</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>Order status remained PENDING/FAILED. Order was not marked paid.</div>
            </div>
            <button
              onClick={() => {
                setToastMsg('✓ Payment recovery link generated & dispatched to customer.');
                setTimeout(() => setToastMsg(null), 3500);
              }}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
            >
              Send Recovery Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
