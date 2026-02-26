import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import AccountLayout from './pages/AccountLayout';
import LightingCalculator from './pages/LightingCalculator';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<div className="p-8"><h1 className="text-2xl font-bold">Product Management</h1></div>} />
                <Route path="orders" element={<div className="p-8"><h1 className="text-2xl font-bold">Order Management</h1></div>} />
                <Route path="customers" element={<div className="p-8"><h1 className="text-2xl font-bold">Customer Management</h1></div>} />
                <Route path="analytics" element={<div className="p-8"><h1 className="text-2xl font-bold">Analytics</h1></div>} />
                <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Admin Settings</h1></div>} />
              </Route>

              {/* Frontend Routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:slug" element={<ProductDetails />} />
                <Route path="/categories/:category" element={<CategoryPage />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/calculator" element={<LightingCalculator />} />
                
                <Route path="/my-account" element={
                  <ProtectedRoute allowedRoles={['customer', 'dealer']}>
                    <AccountLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<div className="space-y-6">
                    <h2 className="text-3xl font-black uppercase tracking-tight">Profile Information</h2>
                    <p className="text-stone-500">Manage your account details and preferences.</p>
                  </div>} />
                  <Route path="orders" element={<div className="space-y-6">
                    <h2 className="text-3xl font-black uppercase tracking-tight">My Orders</h2>
                    <p className="text-stone-500">You haven't placed any orders yet.</p>
                  </div>} />
                  <Route path="addresses" element={<div className="space-y-6">
                    <h2 className="text-3xl font-black uppercase tracking-tight">My Addresses</h2>
                    <p className="text-stone-500">Manage your shipping and billing addresses.</p>
                  </div>} />
                  <Route path="settings" element={<div className="space-y-6">
                    <h2 className="text-3xl font-black uppercase tracking-tight">Account Settings</h2>
                    <p className="text-stone-500">Security and notification preferences.</p>
                  </div>} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-center" theme="dark" richColors />
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
