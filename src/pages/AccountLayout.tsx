import React from 'react';
import { Link, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Heart, MapPin, User, LogOut, ChevronRight, Settings, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

const AccountLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <User />, label: 'Profile Info', path: '/my-account' },
    { icon: <Package />, label: 'My Orders', path: '/my-account/orders' },
    { icon: <Heart />, label: 'My Wishlist', path: '/my-account/wishlist' },
    { icon: <ShoppingCart />, label: 'My Cart', path: '/my-account/cart' },
    { icon: <MapPin />, label: 'Addresses', path: '/my-account/addresses' },
    { icon: <Settings />, label: 'Settings', path: '/my-account/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-80 shrink-0 space-y-8">
          <div className="glass-card p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-black mx-auto">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">{user.name}</h2>
              <p className="text-stone-500 text-xs truncate">{user.email}</p>
            </div>
            <div className="inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
              {user.role} Account
            </div>
          </div>

          <nav className="glass-card overflow-hidden">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-6 py-4 transition-colors border-b border-white/5 last:border-0 ${location.pathname === item.path ? 'bg-primary text-black' : 'hover:bg-white/5 text-stone-400'}`}
              >
                <div className="flex items-center space-x-4">
                  <span className="w-5 h-5">{item.icon}</span>
                  <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 px-6 py-4 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 md:p-12 min-h-[600px]"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
