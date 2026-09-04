import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import {
  Sparkles,
  ShoppingBag,
  Star,
  Zap,
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  Laptop,
  Briefcase,
  Watch,
  Keyboard,
  Mouse,
  ChevronLeft,
  ChevronRight,
  Check,
  Flame,
  ShieldAlert,
  Award,
  CreditCard,
  Lock,
  Layers,
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await productService.searchProducts({ limit: 16 });
        const list = res.data?.products || res.products || res.data;
        const data = Array.isArray(list) ? list : [];
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // Products array for the One-by-One Animated Showcase
  const featuredProducts = products.length >= 4 ? products.slice(0, 6) : [
    {
      id: 'feat-1',
      name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
      price: 29990,
      originalPrice: 34990,
      category: 'Headphones',
      rating: 4.9,
      reviewsCount: 2450,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      badge: 'BESTSELLER',
      description: 'Industry-leading active noise cancellation with 8 precision microphones & Auto NC Optimizer.',
      highlights: ['30-hr Battery Life', 'Lightweight Ergonomic Design', 'Multipoint Connection']
    },
    {
      id: 'feat-2',
      name: 'Apple MacBook Pro 16-inch M3 Max Space Black',
      price: 249900,
      originalPrice: 269900,
      category: 'Laptops',
      rating: 5.0,
      reviewsCount: 1890,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      badge: 'FEATURED',
      description: 'Mind-blowing performance powered by M3 Max with up to 16-core CPU and 40-core GPU speed.',
      highlights: ['Liquid Retina XDR Display', 'Up to 22 Hours Battery', '36GB Unified Memory']
    },
    {
      id: 'feat-3',
      name: 'Keychron Q1 Max Custom Wireless Mechanical Keyboard',
      price: 18990,
      originalPrice: 21990,
      category: 'Keyboards',
      rating: 4.8,
      reviewsCount: 920,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      badge: 'HOT DEAL',
      description: 'Full CNC machined aluminum body with gasket design, wireless 2.4GHz & Bluetooth 5.1.',
      highlights: ['Hot-Swappable Switches', 'Double-Gasket Design', 'South-Facing RGB']
    },
    {
      id: 'feat-4',
      name: 'Logitech MX Master 3S Ergonomic Performance Mouse',
      price: 9995,
      originalPrice: 11995,
      category: 'Mouse',
      rating: 4.9,
      reviewsCount: 3120,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
      badge: 'TOP RATED',
      description: 'Quiet clicks with 8K DPI tracking on glass and MagSpeed ultra-fast electromagnetic scrolling.',
      highlights: ['Quiet Click Technology', '8000 DPI Optical Sensor', '70 Days Battery Life']
    }
  ];

  // Auto-slide effect to show products one by one with smooth animations
  useEffect(() => {
    if (isHovered || featuredProducts.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isHovered, featuredProducts.length]);

  const categories = [
    {
      name: 'Mobile Phones',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      color: '#3b82f6',
      link: '/customer/products?cat=Mobile',
    },
    {
      name: 'Laptops',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      color: '#6366f1',
      link: '/customer/products?cat=Laptops',
    },
    {
      name: 'Headphones & Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      color: '#06b6d4',
      link: '/customer/products?cat=Headphones',
    },
    {
      name: 'Smart Watches',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      color: '#f59e0b',
      link: '/customer/products?cat=Smart Watches',
    },
    {
      name: 'Keyboards & Peripherals',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
      color: '#8b5cf6',
      link: '/customer/products?cat=Keyboards',
    },
    {
      name: 'Gaming Mice',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
      color: '#ec4899',
      link: '/customer/products?cat=Mouse',
    },
    {
      name: 'Bags & Luggage',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      color: '#10b981',
      link: '/customer/products?cat=Bags',
    },
  ];

  const currentProduct = featuredProducts[activeSlide] || featuredProducts[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatPulse {
          0% { transform: translateY(0px) scale(1); filter: drop-shadow(0 15px 30px rgba(99, 102, 241, 0.25)); }
          50% { transform: translateY(-8px) scale(1.02); filter: drop-shadow(0 22px 40px rgba(59, 130, 246, 0.35)); }
          100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 15px 30px rgba(99, 102, 241, 0.25)); }
        }
        @keyframes ambientGlow {
          0% { opacity: 0.4; transform: rotate(0deg) scale(1); }
          50% { opacity: 0.65; transform: rotate(180deg) scale(1.08); }
          100% { opacity: 0.4; transform: rotate(360deg) scale(1); }
        }
        .animate-fade-in {
          animation: fadeInUp 0.45s ease-out forwards;
        }
        .float-product-img {
          animation: floatPulse 4.5s ease-in-out infinite;
        }
        .ambient-glow-layer {
          animation: ambientGlow 14s linear infinite;
        }
        .thumb-item-card {
          transition: all 0.25s ease;
        }
        .thumb-item-card:hover {
          transform: translateY(-2px);
        }
      `}</style>
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: 2-COLUMN SPLIT LAYOUT                                     */}
      {/* LEFT SIDE: Webpage & Store Description | RIGHT SIDE: Animated Product Showcase */}
      {/* ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0b0f19 0%, #111827 45%, #1e1b4b 100%)',
          borderRadius: '28px',
          border: '1.5px solid rgba(99, 102, 241, 0.25)',
          padding: '3rem 2.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Background Ambient Glow FX */}
        <div
          className="ambient-glow-layer"
          style={{
            position: 'absolute',
            top: '-20%',
            right: '5%',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="ambient-glow-layer"
          style={{
            position: 'absolute',
            bottom: '-25%',
            left: '-5%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(139, 92, 246, 0.06) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* ========================================================= */}
          {/* LEFT SIDE: ABOUT THE WEBPAGE & STORE DESCRIPTION          */}
          {/* ========================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
              <span
                style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  padding: '0.4rem 1rem',
                  borderRadius: '30px',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Sparkles size={14} color="#a5b4fc" /> PREMIUM E-COMMERCE STORE
              </span>
            </div>

            <h1
              style={{
                fontSize: '2.6rem',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              Discover Extraordinary Products. <br />
              <span style={{ background: 'linear-gradient(90deg, #60a5fa 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Engineered For Modern Living.
              </span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
              Welcome to CommerceStore — your curated destination for top-tier electronics, smart office gear, mechanical keyboards, and lifestyle accessories. We combine uncompromised quality, verified authenticity, and seamless express delivery.
            </p>

            {/* Feature Highlights List */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              {[
                { title: 'Express Delivery', desc: 'Free 1-Day shipping nationwide', icon: <Truck size={20} color="#38bdf8" /> },
                { title: '100% Genuine', desc: 'Verified manufacturer warranties', icon: <ShieldCheck size={20} color="#34d399" /> },
                { title: 'Secure Gateway', desc: 'Razorpay encrypted checkout', icon: <Lock size={20} color="#fbbf24" /> },
                { title: 'Premium Curation', desc: 'Top 1% rated tech items', icon: <Award size={20} color="#a78bfa" /> },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>{item.title}</h4>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Navigation Links */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <Link
                to="/customer/products"
                style={{
                  padding: '0.85rem 1.75rem',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
                }}
              >
                Explore Full Catalog <ArrowRight size={18} />
              </Link>
              <Link
                to="/customer/categories"
                style={{
                  padding: '0.85rem 1.5rem',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Browse Categories
              </Link>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: ANIMATED PRODUCT SHOWCASE (ONE BY ONE)         */}
          {/* ========================================================= */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1.5px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              position: 'relative',
            }}
          >
            {/* Top Carousel Navigation Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={18} color="#ef4444" />
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#f87171', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  FEATURED ANIMATED SHOWCASE
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  onClick={() => setActiveSlide((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1))}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', padding: '0 0.4rem' }}>
                  0{activeSlide + 1} / 0{featuredProducts.length}
                </span>
                <button
                  onClick={() => setActiveSlide((prev) => (prev + 1) % featuredProducts.length)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Single Animated Product Card (Showcase One By One) */}
            <div key={currentProduct.id || activeSlide} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Product Floating Image Container */}
              <div
                className="float-product-img"
                style={{
                  height: '240px',
                  borderRadius: '18px',
                  background: '#ffffff',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Floating Discount & Rating Pill */}
                <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', display: 'flex', gap: '0.4rem', zIndex: 3 }}>
                  <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.7rem', fontWeight: 900, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                    {currentProduct.originalPrice ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100) : 25}% OFF
                  </span>
                  {currentProduct.badge && (
                    <span style={{ background: '#fbbf24', color: '#0f172a', fontSize: '0.68rem', fontWeight: 900, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                      {currentProduct.badge}
                    </span>
                  )}
                </div>

                <img
                  src={currentProduct.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'}
                  alt={currentProduct.name}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />

                {/* Stock Status Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.85rem',
                    right: '0.85rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#059669',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> In Stock • Ready to Ship
                </div>
              </div>

              {/* Product Info & Specs */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <div style={{ background: '#16a34a', color: '#ffffff', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <span>{currentProduct.rating || 4.9}</span>
                    <Star size={10} fill="#ffffff" />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    ({(currentProduct.reviewsCount || 1420).toLocaleString('en-IN')} Customer Reviews)
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.4rem 0', lineHeight: 1.3 }}>
                  {currentProduct.name}
                </h3>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 0.85rem 0', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {currentProduct.description || 'Premium design with high performance and durability.'}
                </p>

                {/* Highlights Pills */}
                {currentProduct.highlights && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                    {currentProduct.highlights.map((hl: string, idx: number) => (
                      <span key={idx} style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Check size={11} color="#10b981" /> {hl}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price Display */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#60a5fa', letterSpacing: '-0.02em' }}>
                    ₹{currentProduct.price?.toLocaleString('en-IN')}
                  </span>
                  {currentProduct.originalPrice && (
                    <span style={{ fontSize: '0.95rem', color: '#64748b', textDecoration: 'line-through' }}>
                      ₹{currentProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {currentProduct.originalPrice && (
                    <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900 }}>
                      Save ₹{(currentProduct.originalPrice - currentProduct.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Slide Pagination Thumbnail Strip */}
            <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingTop: '0.5rem' }}>
              {featuredProducts.map((item: any, idx: number) => {
                const isActive = idx === activeSlide;
                return (
                  <div
                    key={item.id || idx}
                    className="thumb-item-card"
                    onClick={() => setActiveSlide(idx)}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '10px',
                      background: '#ffffff',
                      padding: '0.25rem',
                      border: isActive ? '2px solid #3b82f6' : '1.5px solid rgba(255, 255, 255, 0.15)',
                      opacity: isActive ? 1 : 0.6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <img src={item.imageUrl} alt={item.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HOT & TRENDING PRODUCTS SHOWCASE                                        */}
      {/* ========================================================================= */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <Flame size={22} color="#ef4444" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                HOT & TRENDING PRODUCTS
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Discover top-rated selections from our catalog
            </p>
          </div>
          <Link
            to="/customer/products"
            style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            View Full Catalog <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>Loading products...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {products.slice(0, 4).map((p) => (
              <ProductShowcard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 3. BROWSE BY CATEGORY                                                     */}
      {/* ========================================================================= */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <ShoppingBag size={22} color="#a855f7" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              EXPLORE BY CATEGORY
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Find targeted products across electronics, office, gaming & accessories
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {categories.map((cat, idx) => {
            return (
              <Link
                key={idx}
                to={cat.link}
                style={{
                  position: 'relative',
                  height: '180px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  border: '1.5px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.25rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = cat.color;
                  e.currentTarget.style.boxShadow = `0 14px 30px ${cat.color}45`;
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                {/* Actual Category Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    zIndex: 1,
                  }}
                />

                {/* Dark Glass Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.82) 65%, rgba(15, 23, 42, 0.96) 100%)',
                    zIndex: 2,
                  }}
                />

                {/* Category Content Overlay */}
                <div style={{ position: 'relative', zIndex: 3 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.01em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {cat.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. RECOMMENDED PRODUCTS GRID                                              */}
      {/* ========================================================================= */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <Sparkles size={22} color="#06b6d4" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                RECOMMENDED SELECTIONS
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Handpicked items recommended for your lifestyle
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>Loading products...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {products.slice(4, 8).map((p) => (
              <ProductShowcard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. WEBPAGE TRUST & GUARANTEE BADGES                                       */}
      {/* ========================================================================= */}
      <section
        style={{
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-color)',
          borderRadius: '22px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={38} color="#3b82f6" />
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>
            WHY SHOP WITH COMMERCESTORE?
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '620px', lineHeight: 1.55, margin: '0 0 1rem 0' }}>
            Every product in our store is handpicked for exceptional quality, backed by official brand warranty, and delivered via express shipping. Experience absolute shopping confidence.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Truck size={16} color="#3b82f6" /> Express Delivery</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Lock size={16} color="#10b981" /> Encrypted Razorpay Checkout</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Award size={16} color="#f59e0b" /> Official Manufacturer Warranty</span>
          </div>
        </div>
      </section>

    </div>
  );
};

// Pure Visual Product Display Card (No Buy/Cart Option)
const ProductShowcard: React.FC<{ product: any }> = ({ product }) => {
  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 25;

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: '1.5px solid var(--border-color)',
        borderRadius: '18px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = '#2563eb';
        e.currentTarget.style.boxShadow = '0 16px 30px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Discount & Category Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.7rem', fontWeight: 900, padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
          {discountPct}% OFF
        </span>
        <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
          {product.category || 'Featured'}
        </span>
      </div>

      {/* Product Image */}
      <div style={{ height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem', overflow: 'hidden', borderRadius: '12px', background: '#ffffff', padding: '0.6rem' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'}
          alt={product.name}
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }}
        />
      </div>

      {/* Rating & Assured Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
        <div style={{ background: '#16a34a', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span>{product.rating || 4.8}</span>
          <Star size={11} fill="#ffffff" />
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          ({(product.reviewsCount || 1240).toLocaleString('en-IN')})
        </span>
        <span style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 800, marginLeft: 'auto' }}>
          ✓ Verified
        </span>
      </div>

      {/* Product Title */}
      <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.7em' }}>
        {product.name}
      </h3>

      {/* Price Display */}
      <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              M.R.P: ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
          FREE 1-Day Delivery
        </div>
      </div>
    </div>
  );
};
