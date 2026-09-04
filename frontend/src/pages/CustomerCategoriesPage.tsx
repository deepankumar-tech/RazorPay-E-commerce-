import React from 'react';
import { Grid, Headphones, Briefcase, Keyboard, Mouse, Watch, Smartphone, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerCategoriesPage: React.FC = () => {
  const categories = [
    { name: 'Headphones', icon: Headphones, count: '6 Products', desc: 'Over-ear & TWS wireless audio' },
    { name: 'Bags & Sleeves', icon: Briefcase, count: '5 Products', desc: 'Anti-theft backpacks & laptop sleeves' },
    { name: 'Keyboards', icon: Keyboard, count: '4 Products', desc: 'Mechanical RGB gaming keyboards' },
    { name: 'Mouse & Desk Mats', icon: Mouse, count: '4 Products', desc: 'Silent ergonomic wireless mice' },
    { name: 'Smart Watches', icon: Watch, count: '3 Products', desc: 'AMOLED health & fitness trackers' },
    { name: 'Mobile Accessories', icon: Smartphone, count: '5 Products', desc: 'Fast-charging power banks & cables' },
    { name: 'Electronics & Webcams', icon: Radio, count: '3 Products', desc: 'Full HD ring light webcams' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Product Categories</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>
          Browse our AI-indexed product catalog by category.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem' }}>
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <Link key={idx} to={`/customer/products?category=${encodeURIComponent(cat.name)}`} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'rgba(124,58,237,0.15)', width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} color="var(--accent-primary)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{cat.name}</h3>
                <span className="badge badge-violet" style={{ fontSize: '0.7rem', margin: '0.4rem 0' }}>{cat.count}</span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>{cat.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
