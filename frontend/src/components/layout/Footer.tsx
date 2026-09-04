import React from 'react';
import { Bot, ShieldCheck, Sparkles, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      marginTop: '4rem',
      borderTop: '1px solid var(--border-color)',
      padding: '2.5rem 0',
      background: 'var(--bg-secondary)',
      color: 'var(--text-secondary)'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Bot size={20} color="var(--accent-primary)" />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>OLIVER</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            AI-powered commerce agent platform driving merchant revenue growth with explainable money actions and Razorpay safety guardrails.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.8rem', fontSize: '0.95rem' }}>AI Features</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Conversational Shopping</li>
            <li>Web Speech Voice Assistant</li>
            <li>Contextual Upsell & Cross-Sell</li>
            <li>Campaign Orchestration</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.8rem', fontSize: '0.95rem' }}>Financial Safety</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={14} color="var(--success)" /> Merchant Guardrails
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} color="var(--accent-secondary)" /> Customer Confirmation Required
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={14} color="#f59e0b" /> Audit Trail Verification
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.8rem', fontSize: '0.95rem' }}>Payment Engine</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Integrated with Razorpay TEST MODE for secure, signature-verified transactions and safe failure recovery.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} OLIVER - Autonomous AI Commerce Engine. Production-ready Hackathon Build.
      </div>
    </footer>
  );
};
