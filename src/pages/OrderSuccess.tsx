import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { motion } from 'motion/react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-12 text-center relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>

          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Order Placed Successfully!</h1>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Thank you for shopping with Skyline Lights. Your order has been received and is being processed.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-stone-500">Order ID</span>
              <span className="text-sm font-bold text-primary">#{orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-stone-500">Status</span>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full uppercase tracking-widest">Confirmed</span>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Link to="/my-account/orders" className="btn-primary py-4 uppercase tracking-widest font-black text-xs flex items-center justify-center space-x-2">
              <Package className="w-4 h-4" />
              <span>View My Orders</span>
            </Link>
            <Link to="/shop" className="btn-outline py-4 uppercase tracking-widest font-black text-xs flex items-center justify-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
