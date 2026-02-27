import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, Search, Grid, List, ShoppingCart, Eye, Heart, X } from 'lucide-react';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link, useSearchParams } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products';
        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }
        const res = await fetch(url);
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
  }, [selectedCategory]);

  const handleCategoryToggle = (slug: string) => {
    if (selectedCategory === slug) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const currentCategoryName = categories.find(c => c.slug === selectedCategory)?.name || 'ALL PRODUCTS';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase">{currentCategoryName}</h1>
          <p className="text-stone-500">Discover our premium range of lighting solutions</p>
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
          {selectedCategory && (
            <button 
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden md:block space-y-8">
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-stone-500">Categories</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => handleCategoryToggle(cat.slug)}
                  className={`flex items-center justify-between w-full text-left group transition-all ${selectedCategory === cat.slug ? 'text-primary' : 'text-stone-400 hover:text-white'}`}
                >
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-stone-500 group-hover:bg-white/10">{(cat as any).product_count}</span>
                </button>
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
