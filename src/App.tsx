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
import ProfileInfo from './pages/account/ProfileInfo';
import MyOrders from './pages/account/MyOrders';
import Addresses from './pages/account/Addresses';
import AccountSettings from './pages/account/AccountSettings';
import LightingCalculator from './pages/LightingCalculator';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminGallery from './pages/admin/AdminGallery';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Frontend Routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetails />} />
                <Route path="/categories/:category" element={<CategoryPage />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/calculator" element={<LightingCalculator />} />
                
                <Route path="/my-account" element={
                  <ProtectedRoute allowedRoles={['customer', 'dealer', 'admin']}>
                    <AccountLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<ProfileInfo />} />
                  <Route path="orders" element={<MyOrders />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="addresses" element={<Addresses />} />
                  <Route path="settings" element={<AccountSettings />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-center" theme="dark" richColors />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}
