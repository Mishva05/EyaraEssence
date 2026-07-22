import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/Common/ScrollToTop';

// Layout Wrappers
import CustomerLayout from './components/Common/CustomerLayout';
import AdminLayout from './admin/components/AdminLayout';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';

// Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminOrders from './admin/pages/AdminOrders';
import AdminOrderDetails from './admin/pages/AdminOrderDetails';
import AdminProducts from './admin/pages/AdminProducts';
import AddProduct from './admin/pages/AddProduct';
import EditProduct from './admin/pages/EditProduct';
import AdminCustomers from './admin/pages/AdminCustomers';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                
                {/* 1. Customer Storefront & Login Routes (Navbar & Footer visible) */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/checkout" element={<Checkout />} />
                </Route>

                {/* 2. Legacy Admin Login Redirect (Redirects to unified login page with Admin preselected) */}
                <Route path="/admin/login" element={<Navigate to="/login?type=admin" replace />} />

                {/* 3. Protected Store Admin Panel Routes (Sidebar Layout, No Customer Navbar/Footer) */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedAdminRoute>
                      <AdminLayout />
                    </ProtectedAdminRoute>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<AdminOrderDetails />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/add" element={<AddProduct />} />
                  <Route path="products/:id/edit" element={<EditProduct />} />
                  <Route path="customers" element={<AdminCustomers />} />
                </Route>

                {/* 4. Fallback 404 Route */}
                <Route path="*" element={<NotFound />} />
                
              </Routes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
