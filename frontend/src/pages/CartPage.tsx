import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOliver } from '../context/OliverContext';
import { productService } from '../services/productService';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, Star, CheckCircle, Truck, Zap } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, itemCount, addToCart, fetchCart } = useCart();
  const { openCopilot } = useOliver();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFromAi = searchParams.get('fromAi') === 'true';

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    productService.searchProducts({ limit: 20 }).then(res => {
      const data = res.data?.data?.products || res.data?.products || res.data || [];
      setProducts(data);
    });
  }, []);

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div style={{ padding: '3rem 1.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '3rem 2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <ShoppingBag size={54} color="#94a3b8" style={{ margin: '0 auto 1.2rem' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Your Shopping Cart is Empty</h2>
          <p style={{ color: '#64748b', marginBottom: '1.75rem', fontSize: '0.92rem' }}>
            Check out today's top electronic deals or ask our AI Shopping Copilot to find the best matching gear!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/customer/products" className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}>
              Browse Deals
            </Link>
            <Link to="/customer/ai-assistant" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}>
              <Sparkles size={18} /> Shop with AI
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1020px', margin: '0 auto' }}>
      
      {/* AI GUIDED ORDER BANNER */}
      {isFromAi && (
        <div
          style={{
            background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)',
            border: '1.5px solid #7dd3fc',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0369a1' }}>
                Step 1 of 3: AI Selected Product Added to Cart
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                CommerceAI verified inventory, budget compliance, and applied prime 1-day delivery.
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/customer/checkout?fromAi=true')}
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.25rem', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#16a34a', borderColor: '#15803d' }}
          >
            <Zap size={15} fill="currentColor" /> Proceed to Checkout ➔
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>
        <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Truck size={15} /> All items eligible for FREE 1-Day Delivery
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        {/* Cart Item List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.items.map((item: any) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '110px 1fr auto',
                gap: '1.25rem',
                alignItems: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {/* Product Thumbnail */}
              <div style={{ height: '90px', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop'}
                  alt={item.product?.name}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{item.product?.name}</h3>
                  {item.upsellSourceId && (
                    <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      AI BUNDLE DISCOUNT
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>
                  Category: {item.product?.category} • Eligible for FREE 1-Day Prime Delivery
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                  ₹{item.price?.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Quantity Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Minus size={14} color="#334155" />
                </button>
                <span style={{ fontWeight: 800, minWidth: '24px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Plus size={14} color="#334155" />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444', marginLeft: '0.5rem' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          
          {/* 🤖 COMPLETE YOUR PURCHASE - CROSS-SELL & UPSELL ACCORDING TO USER SPECIFICATION */}
          {(() => {
            const hasHeadphones = cart?.items?.some((i: any) => i.product?.category === 'Headphones');
            const hasLaptop = cart?.items?.some((i: any) => i.product?.category === 'Laptop Accessories' || i.product?.category === 'Keyboards');

            let upsellItems = [
              { name: 'Universal Fast Charging Cable', category: 'Travel Accessories', price: 399, originalPrice: 699, badge: 'CABLE', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200' },
              { name: 'RFID Secure Travel Wallet', category: 'Travel Accessories', price: 799, originalPrice: 1299, badge: 'SECURE', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200' }
            ];

            let headerReason = 'complementary travel & data accessories';

            if (hasHeadphones) {
              upsellItems = [
                { name: 'UrbanShield travel gear case', category: 'Travel Accessories', price: 799, originalPrice: 1499, badge: 'PROTECTION', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200' },
                { name: 'Premium Replacement Ear Tips', category: 'Travel Accessories', price: 499, originalPrice: 999, badge: 'COMFORT', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' }
              ];
              headerReason = 'headphones';
            } else if (hasLaptop) {
              upsellItems = [
                { name: 'UrbanShield 30L Waterproof Backpack', category: 'Bags', price: 1299, originalPrice: 2499, badge: 'TRAVEL BAG', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200' },
                { name: 'Wireless Silent Mouse', category: 'Mouse', price: 899, originalPrice: 1799, badge: 'OFFICE', img: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=200' }
              ];
              headerReason = 'laptop workspace tools';
            }

            return (
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  marginTop: '1.5rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    color: '#2563eb',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Sparkles size={16} /> 🤖 COMPLETE YOUR PURCHASE
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', margin: '0.2rem 0 1rem 0' }}>
                  Because you're buying {headerReason}, add these highly recommended essentials to increase utility:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {upsellItems.map((item, idx) => {
                    // Check if already in cart
                    const alreadyInCart = cart?.items?.some((i: any) => i.product?.name?.toLowerCase().includes(item.name.toLowerCase().split(' ').slice(-1)[0]));
                    if (alreadyInCart) return null;

                    return (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <img
                            src={item.img}
                            alt={item.name}
                            style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', background: '#ffffff', border: '1px solid var(--border-color)' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.name}</div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb' }}>
                              ₹{item.price.toLocaleString('en-IN')}{' '}
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                ₹{item.originalPrice}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={async () => {
                            // Find matching real product from fetched list
                            const match = products.find((p: any) => p.category === item.category);
                            if (match) {
                              await addToCart(match.id, 1);
                              await fetchCart();
                              alert(`Added complementary item "${match.name}" to cart!`);
                            } else {
                              alert('Item details loading, please try again.');
                            }
                          }}
                          className="btn"
                          style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: '#2563eb',
                            border: 'none',
                            color: '#ffffff',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          + Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Price Summary Sidebar */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Items Total ({itemCount}):</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{cart.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
            {cart.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                <span>AI Discount Applied:</span>
                <span style={{ fontWeight: 800 }}>-₹{cart.discountAmount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Delivery Charges:</span>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
              <span>Total Amount:</span>
              <span>₹{cart.finalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/customer/checkout?fromAi=' + isFromAi)}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontWeight: 900, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#16a34a', borderColor: '#15803d' }}
          >
            Proceed to Checkout & Pay <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
