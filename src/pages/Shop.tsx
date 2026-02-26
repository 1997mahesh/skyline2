import React from 'react';
import { motion } from 'motion/react';
import { Filter, Search, Grid, List, ShoppingCart, Eye, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch products in shop:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">SHOP ALL</h1>
          <p className="text-stone-500">Discover our full range of lighting solutions</p>
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input 
              type="text" 
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 focus:border-primary outline-none text-sm"
            />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden md:block space-y-8">
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-stone-500">Categories</h3>
            <div className="space-y-2">
              {['LED Bulbs', 'Panel Lights', 'COB Lights', 'Wall Lights', 'Hanging Lights'].map(cat => (
                <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary" />
                  <span className="text-sm text-stone-400 group-hover:text-white transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-stone-500">Price Range</h3>
            <input type="range" className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-stone-500 mt-2">
              <span>₹0</span>
              <span>₹50,000+</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass-card h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card group overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-900">
                    <img 
                      src={JSON.parse(product.images as any)[0] || 'https://picsum.photos/seed/light/400/400'} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
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
                        to={`/shop/${product.slug}`}
                        className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => toggleWishlist(product)}
                        className={`p-3 rounded-full hover:scale-110 transition-transform ${isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        title="Add to Wishlist"
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    {product.is_new && (
                      <span className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded">NEW</span>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{product.category_name}</p>
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black">₹{product.price}</span>
                      <span className="text-xs text-stone-500">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
