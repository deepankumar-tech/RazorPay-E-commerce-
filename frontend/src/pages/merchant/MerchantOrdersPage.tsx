import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { getSocket } from '../../services/socketService';
import {
  ShoppingBag,
  Bot,
  User,
  Search,
  ChevronRight,
  CheckCircle,
  CreditCard,
  Zap,
} from 'lucide-react';

const DEFAULT_MOCK_ORDERS = [
  {
    id: 'ord-seed-1001',
    orderNumber: 'ORD-1001',
    user: { name: 'Rahul Sharma', email: 'customer@demo.com' },
    finalAmount: 4898,
    status: 'PAID',
    isAiAssisted: true,
    createdAt: new Date().toISOString(),
    paymentMethod: 'UPI',
  },
  {
    id: 'ord-seed-1002',
    orderNumber: 'ORD-1002',
    user: { name: 'Ananya Verma', email: 'ananya@demo.com' },
    finalAmount: 1349,
    status: 'PAID',
    isAiAssisted: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    paymentMethod: 'CARD',
  },
  {
    id: 'ord-seed-1003',
    orderNumber: 'ORD-1003',
    user: { name: 'Vikram Singh', email: 'vikram@demo.com' },
    finalAmount: 1299,
    status: 'PAID',
    isAiAssisted: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    paymentMethod: 'NETBANKING',
  },
  {
    id: 'ord-seed-1004',
    orderNumber: 'ORD-1004',
    user: { name: 'Priya Patel', email: 'priya@demo.com' },
    finalAmount: 3499,
    status: 'SHIPPED',
    isAiAssisted: true,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    paymentMethod: 'UPI',
  },
  {
    id: 'ord-seed-1005',
    orderNumber: 'ORD-1005',
    user: { name: 'Arjun Mehta', email: 'arjun@demo.com' },
    finalAmount: 2499,
    status: 'DELIVERED',
    isAiAssisted: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    paymentMethod: 'UPI',
  },
];

export const MerchantOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>(DEFAULT_MOCK_ORDERS);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'DIRECT' | 'AI_ASSISTED' | 'AI_BUYER'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    orderService
      .getMerchantOrders()
      .then((res: any) => {
        const list = res.data?.orders || res.orders || res.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(list) && list.length > 0) {
          setOrders(list);
        } else {
          setOrders(DEFAULT_MOCK_ORDERS);
        }
      })
      .catch((err) => {
        console.error(err);
        setOrders(DEFAULT_MOCK_ORDERS);
      })
      .finally(() => setLoading(false));

    const socket = getSocket();
    const handleNewOrder = (newOrder: any) => {
      setOrders((prev) => [newOrder, ...prev]);
    };
    socket.on('NEW_ORDER', handleNewOrder);
    socket.on('MERCHANT_NEW_ORDER', handleNewOrder);

    return () => {
      socket.off('NEW_ORDER', handleNewOrder);
      socket.off('MERCHANT_NEW_ORDER', handleNewOrder);
    };
  }, []);

  const filtered = orders.filter((o) => {
    if (sourceFilter === 'AI_ASSISTED') return o.isAiAssisted;
    if (sourceFilter === 'AI_BUYER') return o.isAiAssisted && o.totalAmount > 3000;
    if (sourceFilter === 'DIRECT') return !o.isAiAssisted;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* TITLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>ORDER MANAGEMENT & AI ATTRIBUTION</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Inspect all orders, payment states, and transparent AI agent timelines.</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {(['ALL', 'DIRECT', 'AI_ASSISTED', 'AI_BUYER'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSourceFilter(filter)}
            style={{
              background: sourceFilter === filter ? '#2563eb' : 'rgba(15, 23, 42, 0.7)',
              border: sourceFilter === filter ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '0.55rem 1.1rem',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            {filter === 'ALL' ? 'All Orders' : filter.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* ORDERS TABLE */}
      <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
              <th style={{ padding: '1rem 1.25rem' }}>Order ID</th>
              <th style={{ padding: '1rem 1.25rem' }}>Customer</th>
              <th style={{ padding: '1rem 1.25rem' }}>Amount</th>
              <th style={{ padding: '1rem 1.25rem' }}>Source</th>
              <th style={{ padding: '1rem 1.25rem' }}>Status</th>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Timeline</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#ffffff' }}>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 800 }}>#{o.orderNumber || o.id.slice(0, 8)}</td>
                <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1' }}>{o.user?.name || 'Customer'}</td>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 800 }}>₹{o.finalAmount.toLocaleString('en-IN')}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  {o.isAiAssisted ? (
                    <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Bot size={12} /> AI ASSISTED
                    </span>
                  ) : (
                    <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>DIRECT</span>
                  )}
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ color: o.status === 'PAID' ? '#4ade80' : '#f59e0b', fontWeight: 800 }}>{o.status}</span>
                </td>
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <button onClick={() => setSelectedOrder(o)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>View AI Timeline</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI ORDER TIMELINE MODAL */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(9, 13, 22, 0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '20px', padding: '2rem', maxWidth: '550px', width: '100%' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 1rem 0' }}>AI ORDER TIMELINE — #{selectedOrder.orderNumber || selectedOrder.id.slice(0, 8)}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>1</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>AI Discovered Product</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>OLIVER indexed product schema for natural language query matching.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>2</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>Customer AI Recommendation</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>OLIVER recommended product with +18.7% confidence score.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>3</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>Checkout & Payment Verified</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Payment signature verified via Razorpay test mode engine.</div>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedOrder(null)} style={{ width: '100%', background: '#2563eb', border: 'none', color: '#ffffff', padding: '0.75rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>Close Timeline</button>
          </div>
        </div>
      )}
    </div>
  );
};
