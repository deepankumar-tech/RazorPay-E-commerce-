import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Check,
  Star,
  Sparkles,
  ArrowUpDown,
  ShoppingBag,
  Package,
  X,
  Grid,
  List,
  Filter,
  ShieldCheck,
  Truck,
  Zap,
  Info,
  ChevronRight,
} from 'lucide-react';

export const ProductCatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlQuery = searchParams.get('q') || '';
  const urlCategory = searchParams.get('cat') || 'All';
  const urlBadge = searchParams.get('badge') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<'ALL' | 'UNDER_1000' | '1000_2500' | '2500_5000' | 'ABOVE_5000'>('ALL');
  const [selectedDiscount, setSelectedDiscount] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Quick View Modal
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const { addToCart } = useCart();

  const categories = [
    'All',
    'Headphones',
    'Laptop Accessories',
    'Bags',
    'Smart Watches',
    'Keyboards',
    'Mouse',
    'Mobile Accessories',
    'Travel Accessories',
  ];

  // Sync state with URL params and trigger search
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('cat') || 'All';
    const badge = searchParams.get('badge') || '';
    setSearchQuery(q);
    setSelectedCategory(cat);
    fetchProducts(q, cat, badge);
  }, [searchParams]);

  const fetchProducts = async (queryVal?: string, catVal?: string, badgeVal?: string) => {
    try {
      setLoading(true);
      const activeQ = queryVal !== undefined ? queryVal : searchQuery;
      const activeCat = catVal !== undefined ? catVal : selectedCategory;
      const activeBadge = badgeVal !== undefined ? badgeVal : (searchParams.get('badge') || undefined);

      let minPrice: number | undefined = undefined;
      let maxPrice: number | undefined = undefined;

      if (selectedPriceFilter === 'UNDER_1000') {
        maxPrice = 1000;
      } else if (selectedPriceFilter === '1000_2500') {
        minPrice = 1000;
        maxPrice = 2500;
      } else if (selectedPriceFilter === '2500_5000') {
        minPrice = 2500;
        maxPrice = 5000;
      } else if (selectedPriceFilter === 'ABOVE_5000') {
        minPrice = 5000;
      }

      const res = await productService.searchProducts({
        query: activeQ.trim() || undefined,
        category: activeCat !== 'All' ? activeCat : undefined,
        badge: activeBadge || undefined,
        minPrice,
        maxPrice,
      });

      const list = res.data?.products || res.products || res.data;
      const data = Array.isArray(list) ? list : [];
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedPriceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (selectedCategory !== 'All') params.cat = selectedCategory;
    setSearchParams(params);
    fetchProducts(searchQuery, selectedCategory);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedRating(0);
    setSelectedPriceFilter('ALL');
    setSelectedDiscount(0);
    setInStockOnly(false);
    setSearchParams({});
    fetchProducts();
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    await addToCart(productId, 1);
    setAddedIds((prev) => new Set(prev).add(productId));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }, 2000);
  };

  const handleBuyNow = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    await addToCart(productId, 1);
    navigate('/customer/checkout');
  };

  // Client-side filtering & sorting
  const filteredProducts = products.filter((p) => {
    if (selectedRating > 0 && (p.rating || 0) < selectedRating) return false;
    if (inStockOnly && (p.inventory || p.inventoryRecord?.quantity || 0) <= 0) return false;
    if (selectedDiscount > 0) {
      const discount = p.originalPrice ? ((p.originalPrice - p.price) / p.originalPrice) * 100 : 0;
      if (discount < selectedDiscount) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. TOP BREADCRUMB & SEARCH HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Products</span>
          {selectedCategory !== 'All' && (
            <>
              <ChevronRight size={14} />
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedCategory}</span>
            </>
          )}
          {searchQuery && (
            <>
              <ChevronRight size={14} />
              <span style={{ fontWeight: 700, color: '#2563eb' }}>"{searchQuery}"</span>
            </>
          )}
        </div>

        {/* View Switcher & Sorting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#eff6ff' : 'transparent',
                color: viewMode === 'grid' ? '#2563eb' : '#64748b',
                border: 'none',
                padding: '0.45rem 0.65rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? '#eff6ff' : 'transparent',
                color: viewMode === 'list' ? '#2563eb' : '#64748b',
                border: 'none',
                padding: '0.45rem 0.65rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="featured">Featured Deals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT (Left Sidebar Filters + Right Product Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* LEFT SIDEBAR FILTERS (Amazon/Flipkart Style) */}
        <aside
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.4rem',
            position: 'sticky',
            top: '120px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={16} color="#2563eb" /> Filter Results
            </div>
            <button
              onClick={handleClearFilters}
              style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', marginBottom: '0.6rem' }}>
              Category
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: selectedCategory === cat ? '#eff6ff' : 'transparent',
                    color: selectedCategory === cat ? '#2563eb' : '#475569',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.35rem 0.6rem',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Reviews Rating Filter */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', marginBottom: '0.6rem' }}>
              Customer Ratings
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[4, 3].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRating(selectedRating === r ? 0 : r)}
                  style={{
                    background: selectedRating === r ? '#fef3c7' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.35rem 0.5rem',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: selectedRating === r ? '#d97706' : '#334155',
                    fontWeight: selectedRating === r ? 700 : 500,
                  }}
                >
                  <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={13} fill={idx < r ? '#f59e0b' : 'none'} stroke="#f59e0b" />
                    ))}
                  </div>
                  <span>& Up</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Filters */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', marginBottom: '0.6rem' }}>
              Price Range
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                { label: 'All Prices', val: 'ALL' },
                { label: 'Under ₹1,000', val: 'UNDER_1000' },
                { label: '₹1,000 - ₹2,500', val: '1000_2500' },
                { label: '₹2,500 - ₹5,000', val: '2500_5000' },
                { label: 'Above ₹5,000', val: 'ABOVE_5000' },
              ].map((item) => (
                <label
                  key={item.val}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    color: selectedPriceFilter === item.val ? '#2563eb' : '#475569',
                    fontWeight: selectedPriceFilter === item.val ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="priceFilter"
                    checked={selectedPriceFilter === item.val}
                    onChange={() => setSelectedPriceFilter(item.val as any)}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Discount Filter */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', marginBottom: '0.6rem' }}>
              Discount
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                { label: '50% Off or More', val: 50 },
                { label: '30% Off or More', val: 30 },
                { label: '10% Off or More', val: 10 },
              ].map((d) => (
                <label
                  key={d.val}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    color: selectedDiscount === d.val ? '#16a34a' : '#475569',
                    fontWeight: selectedDiscount === d.val ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedDiscount === d.val}
                    onChange={() => setSelectedDiscount(selectedDiscount === d.val ? 0 : d.val)}
                  />
                  {d.label}
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              In Stock Items Only
            </label>
          </div>
        </aside>

        {/* RIGHT PRODUCT DISPLAY AREA */}
        <div>
          {/* Results Count Summary Banner */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.75rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#475569' }}>
              Showing <strong style={{ color: '#0f172a' }}>{sortedProducts.length}</strong> items in Storefront
            </div>
            {selectedCategory !== 'All' && (
              <span
                style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  border: '1px solid #bfdbfe',
                  borderRadius: '14px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                {selectedCategory}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('All')} />
              </span>
            )}
          </div>

          {/* Grid / List Results */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
              Loading products...
            </div>
          ) : sortedProducts.length === 0 ? (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'center', padding: '4rem 2rem' }}>
              <Package size={48} color="#2563eb" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>No products match your active filters</h3>
              <p style={{ color: '#64748b', marginTop: '0.4rem', fontSize: '0.88rem' }}>
                Try loosening your filters or chat with our AI shopping assistant.
              </p>
              <button onClick={handleClearFilters} className="btn btn-primary" style={{ marginTop: '1.2rem', padding: '0.6rem 1.4rem' }}>
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {sortedProducts.map((p) => {
                const discountPct = p.originalPrice
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 40;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                      e.currentTarget.style.borderColor = '#93c5fd';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    {/* Top Badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span
                        style={{
                          background: '#ef4444',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                        }}
                      >
                        {discountPct}% OFF
                      </span>
                      {p.badge && (
                        <span
                          style={{
                            background: '#fef3c7',
                            color: '#d97706',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                          }}
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Image */}
                    <div
                      style={{
                        height: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.75rem',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        background: '#f8fafc',
                      }}
                    >
                      <img
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'}
                        alt={p.name}
                        style={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>

                    {/* Rating & Review count */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      <div
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          padding: '0.12rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                        }}
                      >
                        <span>{p.rating || 4.8}</span>
                        <Star size={11} fill="#ffffff" />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        ({(p.reviewsCount || 1420).toLocaleString('en-IN')})
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700, marginLeft: 'auto' }}>
                        ✓ Assured
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '0.4rem',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '2.4em',
                      }}
                    >
                      {p.name}
                    </h3>

                    {/* Price & Free Delivery */}
                    <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        {p.originalPrice && (
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                            M.R.P: ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600, marginBottom: '0.75rem' }}>
                        FREE 1-Day Delivery by Tomorrow
                      </div>

                      {/* Dual CTAs: Add to Cart & Buy Now */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                        <button
                          onClick={(e) => handleAddToCart(e, p.id)}
                          style={{
                            padding: '0.55rem',
                            borderRadius: '8px',
                            border: '1px solid #2563eb',
                            background: addedIds.has(p.id) ? '#16a34a' : '#ffffff',
                            color: addedIds.has(p.id) ? '#ffffff' : '#2563eb',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          {addedIds.has(p.id) ? <Check size={14} /> : <Plus size={14} />}
                          {addedIds.has(p.id) ? 'Added' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={(e) => handleBuyNow(e, p.id)}
                          style={{
                            padding: '0.55rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#2563eb',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                          }}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sortedProducts.map((p) => {
                const discountPct = p.originalPrice
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 40;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'grid',
                      gridTemplateColumns: '200px 1fr 200px',
                      gap: '1.5rem',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ height: '150px', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={p.imageUrl || ''} alt={p.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          {p.category}
                        </span>
                        {p.badge && (
                          <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                            {p.badge}
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>{p.name}</h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <div style={{ background: '#16a34a', color: '#ffffff', padding: '0.12rem 0.35rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <span>{p.rating || 4.8}</span>
                          <Star size={11} fill="#ffffff" />
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>({(p.reviewsCount || 1420).toLocaleString('en-IN')} customer reviews)</span>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {p.description}
                      </p>
                    </div>

                    <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                      {p.originalPrice && (
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                          M.R.P: ₹{p.originalPrice.toLocaleString('en-IN')} ({discountPct}% off)
                        </div>
                      )}
                      <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                        FREE 1-Day Delivery
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, p.id)}
                        style={{
                          width: '100%',
                          padding: '0.55rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#2563eb',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. PRODUCT DETAIL QUICK VIEW MODAL (Amazon/Flipkart Style) */}
      {selectedProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '1.5rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} color="#0f172a" />
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'start' }}>
              {/* Product Image Showcase */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={selectedProduct.imageUrl || ''}
                  alt={selectedProduct.name}
                  style={{ maxHeight: '280px', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>

              {/* Product Info */}
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    {selectedProduct.category}
                  </span>
                  {selectedProduct.badge && (
                    <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                      {selectedProduct.badge}
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.6rem' }}>
                  {selectedProduct.name}
                </h2>

                {/* Rating Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ background: '#16a34a', color: '#ffffff', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <span>{selectedProduct.rating || 4.8}</span>
                    <Star size={12} fill="#ffffff" />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    ({(selectedProduct.reviewsCount || 1420).toLocaleString('en-IN')} Ratings)
                  </span>
                </div>

                {/* Price Display */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                      ₹{selectedProduct.price.toLocaleString('en-IN')}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        M.R.P: ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700, marginTop: '0.2rem' }}>
                    Inclusive of all taxes • FREE 1-Day Prime Delivery
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                  {selectedProduct.description}
                </p>

                {/* Features list */}
                {selectedProduct.features && Array.isArray(selectedProduct.features) && selectedProduct.features.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                      Key Features & Specifications:
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.82rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {selectedProduct.features.map((f: string, idx: number) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI RECOMMENDS CONTEXTUAL UPSELL */}
                {(() => {
                  const hasHeadphones = selectedProduct.category === 'Headphones';
                  const hasLaptop = selectedProduct.category === 'Laptop Accessories' || selectedProduct.category === 'Keyboards';

                  let upsellName = 'Universal Fast Charging Cable';
                  let upsellCategory = 'Travel Accessories';
                  let upsellReason = 'Complementary high-speed data cable is often bundled with workspace products.';

                  if (hasHeadphones) {
                    upsellName = 'UrbanShield waterproof travel gear case';
                    upsellCategory = 'Travel Accessories';
                    upsellReason = 'Customers buying these headphones often choose a protective travel case.';
                  } else if (hasLaptop) {
                    upsellName = 'UrbanShield 30L Waterproof Backpack';
                    upsellCategory = 'Bags';
                    upsellReason = 'Customers buying this desktop gear often purchase an anti-theft laptop bag.';
                  }

                  // Find real item from database list
                  const match = products.find(
                    (p: any) =>
                      p.id !== selectedProduct.id &&
                      (p.category === upsellCategory || p.name.toLowerCase().includes(upsellCategory.toLowerCase()))
                  );

                  if (!match) return null;

                  return (
                    <div
                      style={{
                        background: '#fffbeb',
                        border: '1.5px solid #fde68a',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1.25rem',
                        textAlign: 'left',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          color: '#b45309',
                          textTransform: 'uppercase',
                          marginBottom: '0.4rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <Sparkles size={13} /> AI RECOMMENDS
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#451a03', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
                        "{upsellReason}"
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <img
                            src={match.imageUrl || 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=200'}
                            alt={match.name}
                            style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', background: '#ffffff', border: '1px solid #fcd34d' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{match.name}</div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#b45309' }}>
                              ₹{match.price.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={async (e) => {
                            await handleAddToCart(e, match.id);
                            alert(`Added complementary item "${match.name}" to cart!`);
                          }}
                          className="btn"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: '#d97706',
                            borderColor: '#b45309',
                            color: '#ffffff',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          + Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Modal Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <button
                    onClick={(e) => {
                      handleAddToCart(e, selectedProduct.id);
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #2563eb',
                      background: '#ffffff',
                      color: '#2563eb',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Plus size={16} /> Add to Cart
                  </button>
                  <button
                    onClick={(e) => {
                      handleBuyNow(e, selectedProduct.id);
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#2563eb',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    Buy Now with Razorpay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
