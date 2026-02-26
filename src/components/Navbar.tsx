import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search as SearchIcon, Menu, X, Zap, Heart, ChevronDown, Phone, LogOut, Package, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '../types';
import Search from './Search';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to fetch categories in navbar:', err);
      }
    };
    
    fetchCategories();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowMegaMenu(false);
    setIsSearchOpen(false);
    setIsAccountOpen(false);
  }, [location]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-dark/95 backdrop-blur-xl border-b border-white/10 py-2 shadow-lg' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          
          {/* Search Overlay */}
          <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

          {/* Left: Logo */}
          <Link to="/" className={`flex items-center space-x-2 group transition-opacity ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <Zap className="w-8 h-8 text-primary fill-primary/20 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black tracking-tighter glow-text">SKYLINE</span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-stone-500">LIGHTS</span>
            </div>
          </Link>

          {/* Center: Desktop Nav */}
          <div className={`hidden lg:flex items-center space-x-8 transition-opacity ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <Link to="/" className={`nav-link text-xs font-bold uppercase tracking-widest ${location.pathname === '/' ? 'text-primary' : ''}`}>Home</Link>
            <Link to="/about" className={`nav-link text-xs font-bold uppercase tracking-widest ${location.pathname === '/about' ? 'text-primary' : ''}`}>About Us</Link>
            <Link to="/shop" className={`nav-link text-xs font-bold uppercase tracking-widest ${location.pathname === '/shop' ? 'text-primary' : ''}`}>Shop</Link>
            
            {/* Categories Mega Menu Trigger */}
            <div 
              className="relative group"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <button className="nav-link text-xs font-bold uppercase tracking-widest flex items-center space-x-1">
                <span>Categories</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showMegaMenu ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showMegaMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] bg-card-dark border border-white/10 rounded-2xl shadow-2xl p-8 mt-2"
                  >
                    <div className="grid grid-cols-3 gap-8">
                      {categories.map((cat) => (
                        <Link 
                          key={cat.id} 
                          to={`/categories/${cat.slug}`}
                          className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-colors group/item"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-900">
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-60 group-hover/item:opacity-100 transition-opacity" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold group-hover/item:text-primary transition-colors">{cat.name}</h4>
                            <p className="text-[10px] text-stone-500 uppercase tracking-wider">Explore Collection</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/gallery" className={`nav-link text-xs font-bold uppercase tracking-widest ${location.pathname === '/gallery' ? 'text-primary' : ''}`}>Gallery</Link>
            <Link to="/contact" className={`nav-link text-xs font-bold uppercase tracking-widest ${location.pathname === '/contact' ? 'text-primary' : ''}`}>Contact Us</Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-4 transition-opacity ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-stone-400 hover:text-white transition-colors"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
              
              <Link to="/wishlist" className="text-stone-400 hover:text-white transition-colors relative">
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative text-stone-400 hover:text-white transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>

            {user ? (
              <div className={`relative transition-opacity ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} ref={accountRef}>
                <button 
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold tracking-tight hidden sm:block">{user.name}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isAccountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-card-dark border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Signed in as</p>
                        <p className="text-sm font-bold truncate">{user.name}</p>
                      </div>
                      <Link to="/my-account/orders" className="flex items-center space-x-3 px-4 py-2 hover:bg-white/5 transition-colors text-sm">
                        <Package className="w-4 h-4 text-stone-500" />
                        <span>My Orders</span>
                      </Link>
                      <Link to="/my-account/wishlist" className="flex items-center space-x-3 px-4 py-2 hover:bg-white/5 transition-colors text-sm">
                        <Heart className="w-4 h-4 text-stone-500" />
                        <span>My Wishlist</span>
                      </Link>
                      <Link to="/my-account/cart" className="flex items-center space-x-3 px-4 py-2 hover:bg-white/5 transition-colors text-sm">
                        <ShoppingCart className="w-4 h-4 text-stone-500" />
                        <span>My Cart</span>
                      </Link>
                      <Link to="/my-account/addresses" className="flex items-center space-x-3 px-4 py-2 hover:bg-white/5 transition-colors text-sm">
                        <MapPin className="w-4 h-4 text-stone-500" />
                        <span>My Addresses</span>
                      </Link>
                      <div className="border-t border-white/5 mt-2 pt-2">
                        <button 
                          onClick={logout}
                          className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-500/10 text-red-400 transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className={`hidden md:block btn-primary py-1.5 px-6 text-xs uppercase tracking-widest font-black ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>Login</Link>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-stone-400">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-card-dark z-50 lg:hidden p-8 border-l border-white/10"
            >
              <div className="flex justify-between items-center mb-12">
                <Link to="/" className="flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-primary" />
                  <span className="font-black tracking-tighter">SKYLINE</span>
                </Link>
                <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6" /></button>
              </div>

              <div className="space-y-6">
                <Link to="/" className="block text-xl font-bold">Home</Link>
                <Link to="/about" className="block text-xl font-bold">About Us</Link>
                <Link to="/shop" className="block text-xl font-bold">Shop</Link>
                <Link to="/categories" className="block text-xl font-bold">Categories</Link>
                <Link to="/gallery" className="block text-xl font-bold">Gallery</Link>
                <Link to="/contact" className="block text-xl font-bold">Contact</Link>
                <Link to="/dealer" className="block text-xl font-bold text-primary">Dealer Portal</Link>
              </div>

              <div className="absolute bottom-12 left-8 right-8 space-y-4">
                <a href="tel:+919226645159" className="flex items-center space-x-3 text-stone-400">
                  <Phone className="w-5 h-5" />
                  <span>+91 9226645159</span>
                </a>
                {!user && (
                  <Link to="/login" className="block w-full btn-primary text-center py-3">Login / Register</Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
