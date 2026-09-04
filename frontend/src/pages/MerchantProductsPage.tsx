import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Package, Plus, Trash2, Edit2, Check } from 'lucide-react';

export const MerchantProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState(1999);
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [inventory, setInventory] = useState(50);

  const fetchMerchantProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.searchProducts();
      setProducts(res.data?.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantProducts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productService.createProduct({
        name,
        category,
        price: Number(price),
        sku: sku || `SKU-${Date.now()}`,
        description,
        inventory: Number(inventory),
        tags: [category.toLowerCase(), 'new-arrival'],
      });
      setShowAddModal(false);
      setName('');
      setDescription('');
      fetchMerchantProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create product');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        fetchMerchantProducts();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Store Inventory</h1>
          <p style={{ color: 'var(--text-secondary)' }}>AI agents query this catalog to recommend products to customers</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.2rem' }}>Add New Store Product</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Product Name</label>
                <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category</label>
                  <input type="text" className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Price (₹)</label>
                  <input type="number" className="input-field" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>SKU Code</label>
                  <input type="text" className="input-field" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="TG-PROD-99" required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Stock Inventory</label>
                  <input type="number" className="input-field" value={inventory} onChange={(e) => setInventory(Number(e.target.value))} required />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
                <textarea className="input-field" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Product</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading inventory...</div>
      ) : (
        <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.8rem' }}>PRODUCT NAME</th>
                <th style={{ padding: '0.8rem' }}>SKU</th>
                <th style={{ padding: '0.8rem' }}>CATEGORY</th>
                <th style={{ padding: '0.8rem' }}>PRICE</th>
                <th style={{ padding: '0.8rem' }}>INVENTORY</th>
                <th style={{ padding: '0.8rem' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.8rem', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '0.8rem', color: 'var(--text-muted)' }}>{p.sku}</td>
                  <td style={{ padding: '0.8rem' }}><span className="badge badge-violet">{p.category}</span></td>
                  <td style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>₹{p.price.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span className={`badge ${p.inventory < 15 ? 'badge-red' : 'badge-green'}`}>
                      {p.inventory} units
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem' }}>
                    <button onClick={() => handleDelete(p.id)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', color: 'var(--danger)' }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
