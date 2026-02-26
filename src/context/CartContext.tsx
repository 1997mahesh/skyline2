import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  total: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (authLoading) return;
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user, authLoading]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity })
      });
      if (res.ok) {
        toast.success('Added to cart');
        fetchCart();
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Removed from cart');
        fetchCart();
      }
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!user) return;
    try {
      const res = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: Math.max(1, quantity) })
      });
      if (res.ok) {
        fetchCart();
      }
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
