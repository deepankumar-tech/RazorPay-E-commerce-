import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useOliver } from '../../context/OliverContext';
import { OliverCopilot } from '../oliver/OliverCopilot';
import { OliverVoiceOverlay } from '../oliver/OliverVoiceOverlay';
import {
  Search,
  ShoppingCart,
  MapPin,
  Sparkles,
  Bot,
  User,
  Heart,
  Package,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Zap,
  TrendingUp,
  Headphones,
  Laptop,
  Briefcase,
  Watch,
  X,
  CreditCard,
  Mic,
} from 'lucide-react';
import { LogoutModal } from '../common/LogoutModal';
import { PageTransition } from '../common/PageTransition';
import { productService } from '../../services/productService';
import { Star } from 'lucide-react';

export const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { itemCount, cart } = useCart();
  const { openCopilot, openVoiceOverlay, toggleVoice } = useOliver();
  const location = useLocation();
  const navigate = useNavigate();

  const [topSearch, setTopSearch] = useState('');
  const [selectedSearchCat, setSelectedSearchCat] = useState('All');
  const [liveSuggestions, setLiveSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pincode, setPincode] = useState('560001');
  const [city, setCity] = useState('Bengaluru');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Debounced live search suggestions
  React.useEffect(() => {
    if (!topSearch.trim() || topSearch.trim().length < 1) {
      setLiveSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingLive(true);
        const res = await productService.searchProducts({
          query: topSearch.trim(),
          category: selectedSearchCat !== 'All' ? selectedSearchCat : undefined,
          limit: 6,
        });
        const prods = res.data?.data?.products || res.data?.products || res.data || [];
        setLiveSuggestions(prods);
        setShowSuggestions(true);
      } catch (err) {
        setLiveSuggestions([]);
      } finally {
        setIsSearchingLive(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [topSearch, selectedSearchCat]);

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      navigate('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    const query = customQuery !== undefined ? customQuery : topSearch;
    const queryParams = new URLSearchParams();
    if (query.trim()) queryParams.set('q', query.trim());
    if (selectedSearchCat !== 'All') queryParams.set('cat', selectedSearchCat);
    navigate(`/customer/products?${queryParams.toString()}`);
  };

  const subNavLinks = [
    { label: '🏠 Home', path: '/customer/dashboard' },
    { label: '🤖 AI Shopping Assistant', path: '/customer/ai-assistant', highlight: true },
    { label: '📦 Products', path: '/customer/products' },
    { label: '🛒 Cart', path: '/customer/cart' },
    { label: '💳 Checkout', path: '/customer/checkout' },
    { label: '📋 Orders', path: '/customer/orders' },
    { label: '👤 Profile & Settings', path: '/customer/profile' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
          color: '#e2e8f0',
          padding: '0.4rem 1.5rem',
          fontSize: '0.78rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#60a5fa', fontWeight: 600 }}>
            <Zap size={14} /> FREE 1-Day Prime Delivery Across India
          </span>
          <span style={{ color: '#64748b' }}>|</span>
          <span>⚡ Instant 10% Off via AI Checkout Bundles</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <span style={{ color: '#94a3b8' }}>Verified Razorpay Merchant Gateway</span>
          <Link to="/login" style={{ color: '#93c5fd', textDecoration: 'none', fontWeight: 600 }}>
            {user ? `Logged in as ${user.name}` : 'Sign In'}
          </Link>
        </div>
      </div>

      {/* 2. MAIN AMAZON / FLIPKART STYLE TOP NAV */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0.65rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/customer/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              minWidth: '170px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(37,99,235,0.25)',
              }}
            >
              <ShoppingCart size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                OLIVER<span style={{ color: '#2563eb' }}>.AI</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                AI-POWERED SHOPPING
              </div>
            </div>
          </Link>

          {/* Delivery Location Selector */}
          <div
            onClick={() => setShowLocationModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              padding: '0.35rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid transparent',
              transition: 'all 0.15s ease',
              minWidth: '150px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          >
            <MapPin size={18} color="#2563eb" />
            <div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.1 }}>Deliver to {user?.name?.split(' ')[0] || 'Guest'}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                {city} {pincode}
              </div>
            </div>
          </div>

          {/* Omni Search Bar with Live Instant Popover */}
          <div style={{ flex: 1, maxWidth: '680px', position: 'relative' }}>
            <form
              onSubmit={(e) => handleSearchSubmit(e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f8fafc',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onBlurCapture={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
            >
              {/* Category Select Dropdown */}
              <select
                value={selectedSearchCat}
                onChange={(e) => setSelectedSearchCat(e.target.value)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRight: '1px solid #cbd5e1',
                  padding: '0 0.75rem',
                  height: '42px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#334155',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="All">All Categories</option>
                <option value="Headphones">Headphones</option>
                <option value="Laptop Accessories">Laptops & Hubs</option>
                <option value="Bags">Bags & Luggage</option>
                <option value="Smart Watches">Smart Watches</option>
                <option value="Keyboards">Keyboards</option>
                <option value="Mouse">Mice</option>
                <option value="Travel Accessories">Travel Gear</option>
                <option value="Mobile Accessories">Mobile Gear</option>
              </select>

              {/* Main Search Input */}
              <input
                type="text"
                placeholder="Search your product, headphones, laptops, bags, watches..."
                value={topSearch}
                onFocus={() => { if (topSearch.trim().length >= 1) setShowSuggestions(true); }}
                onChange={(e) => setTopSearch(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  padding: '0 0.9rem',
                  height: '42px',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />

              {/* AI Voice Search Shortcut */}
              <button
                type="button"
                onClick={() => navigate('/customer/ai-assistant?listen=true')}
                title="Speak to AI Voice Assistant"
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: '20px',
                  padding: '0.25rem 0.65rem',
                  marginRight: '0.35rem',
                  color: '#6366f1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  transition: 'all 0.2s ease',
                }}
              >
                <Mic size={15} /> Voice
              </button>

              {/* AI Assistant Shortcut inside Search */}
              <button
                type="button"
                onClick={() => navigate('/customer/ai-assistant')}
                title="Search with AI Shopping Agent"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '0 0.6rem',
                  color: '#6366f1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Sparkles size={18} />
              </button>

              {/* Search Submit Button */}
              <button
                type="submit"
                style={{
                  background: '#2563eb',
                  border: 'none',
                  height: '42px',
                  padding: '0 1.25rem',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
              >
                <Search size={18} />
              </button>
            </form>

            {/* LIVE AUTOCOMPLETE DROPDOWN RESULTS */}
            {showSuggestions && topSearch.trim().length >= 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: '105%',
                  left: 0,
                  right: 0,
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  zIndex: 9999,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0.6rem 1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    {isSearchingLive ? 'Searching...' : `Matching Products (${liveSuggestions.length})`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.2rem' }}
                  >
                    <X size={14} />
                  </button>
                </div>

                {liveSuggestions.length > 0 ? (
                  <div>
                    {liveSuggestions.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setShowSuggestions(false);
                          setTopSearch(prod.name);
                          navigate(`/customer/products?q=${encodeURIComponent(prod.name)}`);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 1rem',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          transition: 'background 0.1s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: '#f8fafc', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                            <img
                              src={prod.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&auto=format&fit=crop'}
                              alt={prod.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{prod.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              In <span style={{ color: '#2563eb', fontWeight: 600 }}>{prod.category}</span> • ★ {prod.rating || 4.8}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb', whiteSpace: 'nowrap' }}>
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={() => handleSearchSubmit(undefined, topSearch)}
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'center',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#dbeafe')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#eff6ff')}
                    >
                      View all matching results for "{topSearch}" ➔
                    </div>
                  </div>
                ) : (
                  !isSearchingLive && (
                    <div style={{ padding: '1.2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                      No exact matches found for "{topSearch}".
                      <div style={{ marginTop: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit(undefined, topSearch)}
                          style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Search full catalog anyway ➔
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: AI Assistant Pill, Orders, Cart, Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* AI Assistant CTA */}
            <Link
              to="/customer/ai-assistant"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                border: '1px solid #bfdbfe',
                padding: '0.45rem 0.85rem',
                borderRadius: '20px',
                textDecoration: 'none',
                color: '#1d4ed8',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: '0 1px 3px rgba(37,99,235,0.1)',
              }}
            >
              <Bot size={18} color="#2563eb" />
              <span>AI Copilot</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }}></span>
            </Link>

            {/* Orders Link */}
            <Link
              to="/customer/orders"
              style={{
                textDecoration: 'none',
                color: '#0f172a',
                padding: '0.3rem 0.5rem',
                borderRadius: '6px',
                lineHeight: 1.1,
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Returns &</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Orders</div>
            </Link>

            {/* Cart Icon with Item Badge */}
            <Link
              to="/customer/cart"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                color: '#0f172a',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                background: itemCount > 0 ? '#eff6ff' : 'transparent',
                border: itemCount > 0 ? '1px solid #bfdbfe' : '1px solid transparent',
                position: 'relative',
              }}
            >
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={24} color="#2563eb" />
                {itemCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#ef4444',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(239,68,68,0.3)',
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <div style={{ display: 'none', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Cart</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563eb' }}>
                  ₹{(cart?.finalAmount || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </Link>

            {/* User Account / Profile dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.3rem 0.5rem',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    background: '#eff6ff',
                    color: '#2563eb',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '42px',
                    width: '220px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '0.5rem',
                    zIndex: 200,
                  }}
                >
                  <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.3rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{user?.name || 'Customer'}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{user?.email || 'customer@demo.com'}</div>
                  </div>
                  <Link
                    to="/customer/profile"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '6px',
                      color: '#334155',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    <User size={16} /> My Account
                  </Link>
                  <Link
                    to="/customer/orders"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '6px',
                      color: '#334155',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    <Package size={16} /> My Orders
                  </Link>
                  <Link
                    to="/customer/wishlist"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '6px',
                      color: '#334155',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                    }}
                  >
                    <Heart size={16} /> Wishlist
                  </Link>
                  <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.3rem 0' }} />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowLogoutModal(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      width: '100%',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. AMAZON SUB-NAVBAR CATEGORY STRIP */}
        <div
          style={{
            background: '#1e293b',
            color: '#ffffff',
            borderTop: '1px solid #334155',
          }}
        >
          <div
            style={{
              maxWidth: '1440px',
              margin: '0 auto',
              padding: '0 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {subNavLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: item.highlight ? '#fbbf24' : '#f8fafc',
                  textDecoration: 'none',
                  borderBottom: location.pathname + location.search === item.path ? '2px solid #38bdf8' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* 4. MAIN STOREFRONT CONTENT */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '1.5rem 1rem', boxSizing: 'border-box' }}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* 5. FLOATING AI SHOPPING COPILOT BUTTON */}
      {location.pathname !== '/customer/ai-assistant' && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 900,
          }}
        >
          <Link
            to="/customer/ai-assistant"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              padding: '0.85rem 1.4rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              boxShadow: '0 8px 25px rgba(37,99,235,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(37,99,235,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(37,99,235,0.4)';
            }}
          >
            <Bot size={22} color="#ffffff" />
            <span>Ask AI Shopping Copilot</span>
            <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '10px', fontWeight: 900 }}>
              LIVE
            </span>
          </Link>
        </div>
      )}

      {/* 6. AMAZON / FLIPKART STYLE FOOTER */}
      <footer style={{ background: '#0f172a', color: '#cbd5e1', marginTop: 'auto', borderTop: '1px solid #334155' }}>
        {/* Back to Top */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            background: '#1e293b',
            color: '#94a3b8',
            textAlign: 'center',
            padding: '0.75rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: '1px solid #334155',
          }}
        >
          ▲ Back to Top
        </div>

        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '3rem 1.5rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
          }}
        >
          <div>
            <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1rem', marginBottom: '1rem' }}>
              CommerceStore India
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Next-generation e-commerce shopping platform powered by autonomous AI agents, automated upsell engine, and instant Razorpay payment checkout.
            </p>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>
              Shop By Category
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <li><Link to="/customer/products?cat=Headphones" style={{ color: '#94a3b8', textDecoration: 'none' }}>Noise Cancelling Headphones</Link></li>
              <li><Link to="/customer/products?cat=Laptop Accessories" style={{ color: '#94a3b8', textDecoration: 'none' }}>USB-C Hubs & Laptop Stands</Link></li>
              <li><Link to="/customer/products?cat=Bags" style={{ color: '#94a3b8', textDecoration: 'none' }}>Anti-Theft Laptop Bags</Link></li>
              <li><Link to="/customer/products?cat=Smart Watches" style={{ color: '#94a3b8', textDecoration: 'none' }}>AMOLED Smart Watches</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>
              Merchant Partners
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <li><Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Merchant Portal Sign In</Link></li>
              <li><Link to="/customer/orders" style={{ color: '#94a3b8', textDecoration: 'none' }}>Track Customer Shipments</Link></li>
              <li><span style={{ color: '#94a3b8' }}>Razorpay Test Payments Enabled</span></li>
              <li><span style={{ color: '#94a3b8' }}>Autonomous Campaign Guardrails</span></li>
            </ul>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>
              Safe & Secure Payments
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ background: '#1e293b', border: '1px solid #334155', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', color: '#60a5fa', fontWeight: 700 }}>
                💳 Razorpay Verified
              </span>
              <span style={{ background: '#1e293b', border: '1px solid #334155', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                ⚡ UPI / QR Ready
              </span>
              <span style={{ background: '#1e293b', border: '1px solid #334155', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>
                🛡️ 256-Bit SSL Safe
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              100% Purchase Protection with Razorpay Safe Checkout & 7-Day Replacement Guarantee.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', padding: '1.25rem 1.5rem', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
          © {new Date().getFullYear()} CommerceStore. Built with React, TypeScript & Razorpay.
        </div>
      </footer>

      {/* Location Pincode Modal */}
      {showLocationModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '2rem', maxWidth: '400px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="#2563eb" /> Choose Delivery Location
              </h3>
              <button onClick={() => setShowLocationModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.2rem' }}>
              Delivery options and speeds may vary based on your postal location.
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                Enter Pincode
              </label>
              <input
                type="text"
                className="input-field"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 560001, 110001, 400001"
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                City
              </label>
              <input
                type="text"
                className="input-field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru, Mumbai, Delhi"
              />
            </div>
            <button
              onClick={() => setShowLocationModal(false)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
            >
              Apply Location
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        loading={loggingOut}
      />
    </div>
  );
};
