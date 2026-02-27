import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const images = JSON.parse(product.images as any);
  const mainImage = images[0] || 'https://picsum.photos/seed/light/400/400';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card group overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-900">
        <img 
          src={mainImage} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
          <button 
            onClick={() => addToCart(product)}
            className="p-3 bg-primary text-black rounded-full hover:scale-110 transition-transform"
            title="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <Link 
            to={`/product/${product.slug}`}
            className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => toggleWishlist(product)}
            className={`p-3 rounded-full hover:scale-110 transition-transform ${isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
            title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
        {product.is_new === 1 && (
          <div className="absolute top-4 left-4 bg-primary text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            New
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold truncate flex-1 mr-2">{product.name}</h3>
          <div className="flex items-center text-stone-500 text-xs shrink-0">
            <Star className="w-3 h-3 text-primary fill-primary mr-1" />
            <span>{product.rating || '4.5'}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-black text-primary">₹{product.price}</span>
          <Link 
            to={`/product/${product.slug}`}
            className="text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-primary transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
