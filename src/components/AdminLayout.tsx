import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Package />, label: 'Products', path: '/admin/products' },
    { icon: <ShoppingCart />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users />, label: 'Customers', path: '/admin/customers' },
    { icon: <BarChart3 />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <Settings />, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-[#0f0f0f] shrink-0">
        <div className="p-8">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-black text-xl">S</div>
            <span className="text-xl font-black uppercase tracking-tighter">Skyline <span className="text-primary">Admin</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-primary text-black font-bold' : 'text-stone-400 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5">{item.icon}</span>
                <span className="text-sm uppercase tracking-widest font-bold">{item.label}</span>
              </div>
              {location.pathname === item.path && <ChevronRight className="w-4 h-4" />}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center space-x-4 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">
              {user?.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f0f0f] border-b border-white/5 z-50 flex items-center justify-between px-6">
        <Link to="/admin/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-black">S</div>
          <span className="font-black uppercase tracking-tighter">Skyline <span className="text-primary">Admin</span></span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-stone-400">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-80 bg-[#0f0f0f] z-[70] lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-black">S</div>
                  <span className="font-black uppercase tracking-tighter">Skyline</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 px-4 space-y-2 pt-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all ${location.pathname === item.path ? 'bg-primary text-black font-bold' : 'text-stone-400 hover:bg-white/5'}`}
                  >
                    <span className="w-5 h-5">{item.icon}</span>
                    <span className="text-sm uppercase tracking-widest font-bold">{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-widest font-bold">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col pt-16 lg:pt-0">
        <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
