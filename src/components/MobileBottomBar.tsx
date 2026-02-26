import React from 'react';
import { Heart, User, Home, LayoutGrid, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MobileBottomBar = () => {
  const location = useLocation();
  const { items } = useCart();

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/' },
    { icon: <LayoutGrid className="w-5 h-5" />, label: 'Categories', path: '/categories' },
    { icon: <ShoppingCart className="w-5 h-5" />, label: 'Cart', path: '/cart', badge: items.length },
    { icon: <Heart className="w-5 h-5" />, label: 'Wishlist', path: '/wishlist' },
    { icon: <User className="w-5 h-5" />, label: 'Account', path: '/account' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-dark/90 backdrop-blur-xl border-t border-white/5 px-4 py-3">
      <div className="flex justify-between items-center">
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            to={item.path}
            className={`flex flex-col items-center space-y-1 relative ${location.pathname === item.path ? 'text-primary' : 'text-stone-500'}`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.badge > 0 && (
              <span className="absolute -top-1 right-0 bg-primary text-black text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomBar;
