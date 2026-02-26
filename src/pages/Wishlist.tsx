import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Wishlist = () => {
  const { items, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-center flex-col items-center justify-center space-y-6 px-4">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
          <Heart className="w-10 h-10 text-stone-700" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black uppercase">Your wishlist is empty</h2>
          <p className="text-stone-500">Save items you love to find them easily later.</p>
        </div>
        <Link to="/shop" className="btn-primary py-3 px-8 uppercase tracking-widest font-black text-xs">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">My Wishlist</h1>
          <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Items you've saved for later</p>
        </div>
        <span className="text-stone-500 font-bold">{items.length} Items</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-2xl group overflow-hidden flex flex-col"
          >
            <div className="aspect-square relative overflow-hidden bg-stone-900">
              <img
                src={JSON.parse(product.images as string)[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-2xl font-black text-primary">₹{product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center space-x-2 text-primary font-bold hover:underline"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">Add to Cart</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
