import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: any | null;
  itemCount: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, upsellSourceId?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.getCart();
      setCart(res.data);
    } catch (error) {
      console.warn('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity = 1, upsellSourceId?: string) => {
    const res = await cartService.addItem(productId, quantity, upsellSourceId);
    setCart(res.data);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const res = await cartService.updateQuantity(itemId, quantity);
    setCart(res.data);
  };

  const removeFromCart = async (itemId: string) => {
    const res = await cartService.removeItem(itemId);
    setCart(res.data);
  };

  const itemCount = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
