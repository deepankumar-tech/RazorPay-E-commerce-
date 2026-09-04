import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import {
  Package,
  Plus,
  Search,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  ScanLine,
} from 'lucide-react';

export const MerchantProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [optimizationModal, setOptimizationModal] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    productService
      .searchProducts()
      .then((res: any) => {
        const list = res.data?.products || res.products || (Array.isArray(res) ? res : []);
        if (Array.isArray(list)) setProducts(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {toastMessage && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', padding: '0.85rem', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 800 }}>
          {toastMessage}
        </div>
      )}

      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>PRODUCT CATALOG & AI OPTIMIZATION</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Manage store inventory and enhance product readability for AI buyers.</p>
        </div>

        <button
          onClick={() => showToast('✓ New product creation wizard initialized.')}
          style={{ background: '#2563eb', border: 'none', borderRadius: '10px', padding: '0.65rem 1.25rem', color: '#ffffff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* FILTER BAR */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search products by title, category, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '0.75rem 1rem 0.75rem 2.8rem', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '0 1rem', color: '#ffffff', outline: 'none' }}
        >
          <option value="All">All Categories</option>
          <option value="Headphones">Headphones</option>
          <option value="Keyboards">Keyboards</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {/* PRODUCTS TABLE */}
      <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
              <th style={{ padding: '1rem 1.25rem' }}>Product</th>
              <th style={{ padding: '1rem 1.25rem' }}>Category</th>
              <th style={{ padding: '1rem 1.25rem' }}>Price</th>
              <th style={{ padding: '1rem 1.25rem' }}>Stock</th>
              <th style={{ padding: '1rem 1.25rem' }}>AI Readability</th>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const aiScore = p.category === 'Headphones' ? 94 : 92;
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#ffffff' }}>
                  <td style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img src={p.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '8px', background: '#ffffff', padding: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 800 }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>SKU: {p.sku || p.id.slice(0, 8)}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1' }}>{p.category}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 800 }}>₹{p.price.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ color: p.inventory > 10 ? '#4ade80' : '#f87171', fontWeight: 800 }}>{p.inventory} units</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900 }}>{aiScore}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button onClick={() => setOptimizationModal(p)} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Sparkles size={14} /> AI Optimize
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* AI OPTIMIZATION SUGGESTION MODAL */}
      {optimizationModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(9, 13, 22, 0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '20px', padding: '2rem', maxWidth: '600px', width: '100%' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={16} /> OLIVER AI PRODUCT OPTIMIZATION
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 1rem 0' }}>{optimizationModal.name}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b' }}>⚠️ Title Optimization</div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.2rem' }}>"Add noise-cancellation and battery life specifications directly into the title for AI buyers."</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>💡 Structured Attribute Mapping</div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.2rem' }}>"Structured JSON fields for driver_diameter and impedance have been populated automatically."</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setOptimizationModal(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', padding: '0.75rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { showToast(`✓ Applied AI product optimization for "${optimizationModal.name}"!`); setOptimizationModal(null); }} style={{ flex: 1, background: '#2563eb', border: 'none', color: '#ffffff', padding: '0.75rem', borderRadius: '10px', fontWeight: 900, cursor: 'pointer' }}>Apply Suggestion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
