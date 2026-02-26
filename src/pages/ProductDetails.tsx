import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Share2, Shield, Truck, Clock, Star, Plus, Minus, ArrowRight, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="animate-pulse flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 aspect-square bg-white/5 rounded-3xl" />
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-4 w-1/4 bg-white/5 rounded" />
            <div className="h-12 w-3/4 bg-white/5 rounded" />
            <div className="h-6 w-1/4 bg-white/5 rounded" />
            <div className="h-24 w-full bg-white/5 rounded" />
            <div className="h-12 w-full bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-black uppercase">Product not found</h2>
        <Link to="/shop" className="btn-primary py-3 px-8">Back to Shop</Link>
      </div>
    );
  }

  const images = JSON.parse(product.images as string);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-stone-500 mb-12">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Images */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-3xl overflow-hidden bg-stone-900 border border-white/5 relative"
          >
            <img 
              src={images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.stock === 0 && (
              <div className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                Out of Stock
              </div>
            )}
          </motion.div>
          
          <div className="grid grid-cols-4 gap-4">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-primary text-xs font-black uppercase tracking-[0.2em]">Premium Collection</span>
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'opacity-30'}`} />
                ))}
                <span className="text-xs font-bold ml-2 text-stone-500">(128 Reviews)</span>
              </div>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tight leading-none">{product.name}</h1>
            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-black text-primary glow-text">₹{product.price}</span>
              <span className="text-xl text-stone-600 line-through font-bold">₹{Math.round(product.price * 1.2)}</span>
              <span className="text-emerald-500 text-sm font-black uppercase tracking-widest">20% OFF</span>
            </div>
          </div>

          <p className="text-stone-400 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-primary transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-black text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:text-primary transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={() => toggleWishlist(product)}
                className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center transition-all ${isInWishlist(product.id) ? 'bg-red-500 border-red-500 text-white' : 'hover:bg-white/5 text-stone-400'}`}
              >
                <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={async () => {
                  await addToCart(product, quantity);
                  // Only navigate if user is logged in (addToCart handles the login redirect otherwise)
                }}
                className="flex-1 btn-primary py-5 uppercase tracking-widest font-black flex items-center justify-center space-x-3"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Warranty</p>
                <p className="text-xs font-bold">2 Years Replacement</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <Truck className="w-6 h-6 text-primary" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Shipping</p>
                <p className="text-xs font-bold">Fast Pune Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
