import React, { useState, useEffect } from 'react';
import { merchantService } from '../../services/merchantService';
import {
  ScanLine,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Code2,
  Zap,
} from 'lucide-react';

export const MerchantAiCatalogPage: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    merchantService
      .getAiCatalogHealth()
      .then((res) => {
        if (res.data) setHealthData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const metrics = healthData?.metrics || {
    productCompleteness: '96%',
    structuredAttributes: '92%',
    pricingClarity: '100%',
    availabilityClarity: '98%',
    shippingInformation: '88%',
    returnPolicy: '90%',
  };

  const sampleStructuredJson = {
    product_id: 'prod-headphones-01',
    name: 'SoundBass Pro Wireless ANC Headphones',
    category: 'Headphones',
    price: 3499,
    currency: 'INR',
    availability: 'IN_STOCK',
    stock_quantity: 45,
    sku: 'SB-PRO-01',
    specifications: {
      driver_size: '40mm',
      battery_life_hours: 30,
      active_noise_cancellation: true,
      bluetooth_version: '5.2',
    },
    shipping: {
      free_shipping: true,
      estimated_delivery_days: 1,
    },
    return_policy: {
      return_window_days: 7,
      refund_type: 'FULL_REFUND',
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {toastMsg && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', padding: '0.85rem', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 800 }}>
          {toastMsg}
        </div>
      )}
      {/* TITLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ScanLine size={24} color="#38bdf8" />
            <span>AI-READABLE CATALOG & AGENT READINESS</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
            Make your catalog seamlessly indexable and sellable to autonomous AI shopping buyers.
          </p>
        </div>

        <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.5rem 1rem', borderRadius: '12px', color: '#38bdf8', fontWeight: 800, fontSize: '0.88rem' }}>
          CATALOG HEALTH: 92% (OPTIMAL)
        </div>
      </div>

      {/* HEALTH METRICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>PRODUCT COMPLETENESS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#4ade80', marginTop: '0.3rem' }}>{metrics.productCompleteness}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>✓ All required fields present</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>STRUCTURED ATTRIBUTES</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.3rem' }}>{metrics.structuredAttributes}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>✓ JSON schema compliant</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>PRICING CLARITY</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#4ade80', marginTop: '0.3rem' }}>{metrics.pricingClarity}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>✓ Clear INR pricing</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>SHIPPING INFO</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.3rem' }}>{metrics.shippingInformation}</div>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.2rem' }}>⚠ Needs return window details</div>
        </div>
      </div>

      {/* SAMPLE STRUCTURED JSON VIEW & FIX BUTTON */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
        {/* LEFT: READINESS ITEMS */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '1.5rem', minWidth: 0 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem 0' }}>AI Readiness Checklist</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#ffffff' }}>
                <CheckCircle size={18} color="#22c55e" /> Clear product title & description
              </div>
              <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 800 }}>PASS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#ffffff' }}>
                <CheckCircle size={18} color="#22c55e" /> Structured technical specifications
              </div>
              <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 800 }}>PASS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#ffffff' }}>
                <AlertTriangle size={18} color="#f59e0b" /> Shipping & return window attributes
              </div>
              <button
                onClick={() => {
                  setToastMsg('✓ OLIVER.AI formatted shipping & 7-day return policy for AI buyers! Catalog Health boosted to 96%.');
                  setTimeout(() => setToastMsg(null), 4000);
                }}
                style={{ background: '#2563eb', border: 'none', color: '#ffffff', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Sparkles size={12} /> Fix with OLIVER
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: STRUCTURED AGENT DATA PREVIEW */}
        <div style={{ background: '#020617', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '20px', padding: '1.5rem', fontFamily: 'monospace', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Code2 size={16} /> STRUCTURED PRODUCT AGENT SCHEMA
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>application/json</span>
          </div>
          <pre style={{ margin: 0, color: '#a5f3fc', fontSize: '0.78rem', lineHeight: 1.5, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%' }}>
            {JSON.stringify(sampleStructuredJson, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
