import React from 'react';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerWishlistPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Heart size={26} color="#ec4899" fill="#ec4899" />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>My Wishlist</h1>
      </div>

      <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
        <div style={{ background: 'rgba(236,72,153,0.15)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <Heart size={36} color="#ec4899" />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.5rem 0' }}>Your Wishlist is Empty</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Save products you like to your wishlist while shopping with our AI assistant.
        </p>
        <Link to="/customer/products" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.6rem 1.2rem' }}>
          Explore Products
        </Link>
      </div>
    </div>
  );
};
