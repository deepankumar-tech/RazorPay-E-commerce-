import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { History, Package, ShieldCheck, Clock, CheckCircle2, Truck, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNewOrder = searchParams.get('newOrder') === 'true';
  const newOrderId = searchParams.get('orderId');

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => setOrders(res.data?.orders || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ maxWidth: '900px', padding: '2rem 1.5rem', margin: '0 auto' }}>
      {/* Placed Order Success Celebration Banner if arriving from Checkout */}
      {isNewOrder && (
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.1)',
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#16a34a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
            }}
          >
            <CheckCircle2 size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#166534' }}>
              Your Order Has Been Placed Successfully! 🎉
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#15803d' }}>
              Your payment has been verified and confirmed. Your order is listed below and is being prepared for fast delivery.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: '10px', color: '#2563eb' }}>
            <History size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>My Orders</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Track, manage and view receipts of your purchases</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/customer/products')}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ShoppingBag size={16} /> Continue Shopping
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <Clock size={32} color="#2563eb" style={{ marginBottom: '0.6rem' }} />
          <div>Loading your orders...</div>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', padding: '3.5rem 2rem' }}>
          <Package size={44} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>No Orders Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/customer/products')} className="btn btn-primary" style={{ padding: '0.65rem 1.4rem', fontWeight: 700 }}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => {
            const isJustPlaced = newOrderId === order.id;
            return (
              <div
                key={order.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: isJustPlaced ? '2px solid #16a34a' : '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: isJustPlaced ? '0 6px 20px rgba(22, 163, 74, 0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Order Top Bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Order Number: </span>
                    <strong style={{ fontSize: '1rem', color: '#2563eb' }}>#{order.orderNumber}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '1rem' }}>
                      <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {order.isAiAssisted && (
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                        AI ASSISTED
                      </span>
                    )}
                    <span
                      style={{
                        background: order.status === 'PAID' ? '#dcfce7' : '#fee2e2',
                        color: order.status === 'PAID' ? '#15803d' : '#b91c1c',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                      }}
                    >
                      {order.status === 'PAID' ? '✓ PAID' : order.status}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.1rem' }}>
                  {order.items?.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.65rem 0.9rem', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{item.product?.name}</span>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>× {item.quantity}</span>
                        {item.isUpsell && (
                          <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                            UPSELL
                          </span>
                        )}
                      </div>
                      <strong style={{ color: '#0f172a', fontSize: '0.92rem' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', color: '#166534', padding: '0.6rem 0.9rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem' }}>
                  <Truck size={16} /> FREE 1-Day Prime Delivery • Estimated Delivery: <strong>Tomorrow by 8:00 PM</strong>
                </div>

                {/* Footer Total & Verification */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.8rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                    <ShieldCheck size={16} color="#16a34a" /> Verified via Razorpay Signature & Guardrails
                  </span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb' }}>
                    Total: ₹{order.finalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
