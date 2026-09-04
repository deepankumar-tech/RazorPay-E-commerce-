import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Bot, ShieldCheck, TrendingUp, Zap, Mic, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', margin: '3rem 0 4rem 0' }}
      >
        <div className="badge badge-violet pulse-glow" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <Sparkles size={16} /> NEXT-GEN AGENTIC COMMERCE PLATFORM
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.2rem' }}>
          Transform Your Store with <br />
          <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Autonomous AI Growth Agents
          </span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
          Empower AI buyers to discover your catalog conversationally, automate contextual upselling, and execute Razorpay test-mode transactions with total financial safety & guardrails.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/ai-shopping" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            <Bot size={20} /> Shop with AI Voice & Text <ArrowRight size={18} />
          </Link>
          <Link to="/merchant/dashboard" className="btn btn-secondary" style={{ padding: '0.9rem 1.8rem', fontSize: '1.05rem' }}>
            <TrendingUp size={20} /> Merchant Revenue Hub
          </Link>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.8rem', marginBottom: '5rem' }}>
        <motion.div
          whileHover={{ y: -5 }}
          className="glass-panel"
          style={{ padding: '2rem' }}
        >
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', color: '#2563eb' }}>
            <Mic size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>Conversational & Voice Shopping</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Customers state natural requirements like "I need headphones under ₹3,000 for college" via speech or text. AI filters real inventory in seconds.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="glass-panel"
          style={{ padding: '2rem' }}
        >
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', color: '#16a34a' }}>
            <Zap size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>Contextual Upsell & Cross-Sell</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Automatically recommends complementary accessories (e.g. USB-C Hubs with Laptop Bags) based on category synergy and stock rules to boost Average Order Value.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="glass-panel"
          style={{ padding: '2rem' }}
        >
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', color: '#d97706' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>Explainable Financial Safety</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Every payment passes backend transaction guardrails (max transaction amount, max discount %, explicit customer confirmation). AI can NEVER directly charge users.
          </p>
        </motion.div>
      </div>

      {/* How it Works / Trust Section */}
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>End-to-End Agentic Commerce Journey</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
          <div style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem', color: 'var(--accent-primary)' }}>1. AI Discovery</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Agent parses machine-readable catalog API for exact intent matching.</p>
          </div>
          <div style={{ borderLeft: '3px solid var(--accent-secondary)', paddingLeft: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem', color: 'var(--accent-secondary)' }}>2. Smart Proposal</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Generates product recommendation & complementary upsell offer.</p>
          </div>
          <div style={{ borderLeft: '3px solid var(--warning)', paddingLeft: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem', color: 'var(--warning)' }}>3. Guardrail Check</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Backend TransactionGuard verifies stock, discount limits, and price match.</p>
          </div>
          <div style={{ borderLeft: '3px solid var(--success)', paddingLeft: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem', color: 'var(--success)' }}>4. Razorpay Test Payment</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Explicit customer confirmation unlocks Razorpay order with HMAC verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
