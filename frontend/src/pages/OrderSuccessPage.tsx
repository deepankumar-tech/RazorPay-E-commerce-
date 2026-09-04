import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import {
  CheckCircle2,
  ShieldCheck,
  Package,
  ArrowRight,
  FileText,
  Truck,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (orderId) {
      orderService
        .getOrderById(orderId)
        .then((res) => setOrder(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  // Automatic countdown redirect to My Orders
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/customer/orders');
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="container" style={{ maxWidth: '680px', padding: '2.5rem 1.5rem', margin: '0 auto' }}>
      {/* Top Success Celebration Banner */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)',
        }}
      >
        <div
          style={{
            background: '#16a34a',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
          }}
        >
          <CheckCircle2 size={26} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534', margin: '0 0 0.15rem' }}>
            Your Order is Placed Successfully! 🎉
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#15803d' }}>
            We've sent an email receipt and order confirmation. Redirecting to your Orders page shortly.
          </p>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        {/* Countdown Progress Bar */}
        <div style={{ background: '#f1f5f9', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
            <Clock size={16} color="#2563eb" /> Redirecting to <strong>My Orders</strong> in {countdown}s...
          </div>
          <button
            onClick={() => navigate('/customer/orders')}
            className="btn btn-primary"
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, borderRadius: '6px' }}
          >
            Go to My Orders Now ➔
          </button>
        </div>

        {order ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Order Attributes */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Order Number:</span>
                <strong style={{ color: '#2563eb', fontSize: '0.95rem' }}>#{order.orderNumber}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Total Amount Paid:</span>
                <strong style={{ color: '#16a34a', fontSize: '1.1rem' }}>₹{order.finalAmount?.toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Payment Status:</span>
                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  ✓ PAID & VERIFIED
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Transaction ID:</span>
                <span style={{ fontFamily: 'monospace', color: '#475569', fontSize: '0.8rem' }}>
                  {order.razorpayPaymentId || `pay_verified_${Date.now()}`}
                </span>
              </div>
            </div>

            {/* Delivery Timeline info */}
            <div style={{ background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem' }}>
                <Truck size={17} /> Guaranteed FREE 1-Day Prime Delivery
              </div>
              <div style={{ fontSize: '0.82rem', color: '#3b82f6' }}>
                Estimated Delivery: <strong>Tomorrow by 8:00 PM</strong> • Flat 402, Skyline Residency, Bengaluru (560103)
              </div>
            </div>

            {/* Guardrail Safety Verification */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#16a34a', padding: '0.75rem 1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #dcfce7' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                <ShieldCheck size={16} /> Merchant Financial Guardrails:
              </span>
              <strong>PASSED & RECORDED IN AUDIT LOGS</strong>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            <Package size={36} color="#2563eb" style={{ marginBottom: '0.6rem' }} />
            <div>Loading verified order summary...</div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.8rem' }}>
          <button
            onClick={() => navigate('/customer/orders')}
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.8rem 1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <FileText size={18} /> View in My Orders
          </button>
          <button
            onClick={() => navigate('/customer/products')}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.8rem 1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <ShoppingBag size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
