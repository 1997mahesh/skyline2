import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart, loading } = useCart();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 px-4">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-stone-700" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black uppercase">Your cart is empty</h2>
          <p className="text-stone-500">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <Link to="/shop" className="btn-primary py-3 px-8 uppercase tracking-widest font-black text-xs">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Shopping Cart</h1>
        <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Review and manage your items</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="xl:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-900 shrink-0">
                  <img
                    src={JSON.parse(item.images as string)[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="font-bold text-lg truncate">{item.name}</h3>
                  <p className="text-stone-500 text-sm mb-2">Unit Price: ₹{item.price}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center space-x-1 mx-auto sm:mx-0"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-primary transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="text-xl font-black text-primary">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-between items-center pt-6">
            <Link to="/shop" className="text-stone-400 hover:text-white flex items-center space-x-2 font-bold text-sm">
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Continue Shopping</span>
            </Link>
            <button
              onClick={clearCart}
              className="text-stone-500 hover:text-red-400 text-sm font-bold"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="xl:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sticky top-32 space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 border-b border-white/5 pb-6">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">₹{total}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>GST (Included)</span>
                <span className="text-white font-bold">18%</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-stone-400 font-bold">Total Amount</span>
              <span className="text-3xl font-black text-primary glow-text">₹{total}</span>
            </div>

            <Link to="/checkout" className="btn-primary w-full py-4 uppercase tracking-widest font-black flex items-center justify-center space-x-3">
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-stone-500 font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Secure Checkout Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
