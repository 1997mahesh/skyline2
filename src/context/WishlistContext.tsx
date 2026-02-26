import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface WishlistContextType {
  items: Product[];
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    if (authLoading) return;
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user, authLoading]);

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    const exists = items.some(item => item.id === product.id);

    try {
      if (exists) {
        const res = await fetch(`/api/wishlist/remove/${product.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          toast.success('Removed from wishlist');
          fetchWishlist();
        }
      } else {
        const res = await fetch('/api/wishlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: product.id })
        });
        if (res.ok) {
          toast.success('Added to wishlist');
          fetchWishlist();
        }
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const isInWishlist = (productId: number) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isInWishlist, clearWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
