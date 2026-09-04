import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { ShoppingBag, ShieldCheck, Clock } from 'lucide-react';

export const MerchantOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMerchantOrders()
      .then((res) => setOrders(res.data?.orders || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Merchant Received Orders</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading merchant orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No Orders Recorded Yet</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="glass-panel" style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                <div>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>#{order.orderNumber}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                    Customer: {order.user?.name} ({order.user?.email})
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {order.isAiAssisted && <span className="badge badge-violet">AI ASSISTED</span>}
                  <span className={`badge ${order.status === 'PAID' ? 'badge-green' : 'badge-red'}`}>{order.status}</span>
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                {order.items?.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.product?.name} (x{item.quantity}) {item.isUpsell && <span className="badge badge-green" style={{ fontSize: '0.6rem' }}>UPSELL</span>}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Razorpay Order: {order.razorpayOrderId}</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--success)' }}>Total Paid: ₹{order.finalAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
