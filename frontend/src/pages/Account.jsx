import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { LogOut, PackageOpen, Mail, Phone, FileText, CheckCircle2, ShoppingBag } from 'lucide-react';
import Spinner from '../components/Feedback/Spinner';

export default function Account() {
  const { user, logout, isAuthenticated, role } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Redirect to login if not authenticated, or to admin panel if administrator
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (role !== 'customer') {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  // Fetch orders matching the customer's email
  useEffect(() => {
    async function loadCustomerOrders() {
      if (!user?.email) return;
      setLoadingOrders(true);
      try {
        // Fetch all orders from localStorage database
        const allOrders = await apiService.getAdminOrders();
        // Filter by logged-in customer's email
        const customerOrders = allOrders.filter(
          o => o.shippingDetails.email.toLowerCase().trim() === user.email.toLowerCase().trim()
        );
        setOrders(customerOrders);
      } catch (err) {
        console.error("Failed to load customer orders", err);
      } finally {
        setLoadingOrders(false);
      }
    }
    
    if (isAuthenticated && user) {
      loadCustomerOrders();
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    showToast("Successfully logged out.", "info");
    navigate('/');
  };

  // If redirect is in progress or state is loading
  if (!isAuthenticated || !user) {
    return (
      <div className="py-32 flex flex-col items-center justify-center">
        <Spinner size="large" />
        <p className="text-brand-brown text-sm mt-3 font-medium">Redirecting to login portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-slide-in">
      
      {/* Page Header */}
      <div className="border-b border-brand-beige/50 pb-6 mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold font-serif text-brand-charcoal mb-2">My Customer Account</h1>
        <p className="text-brand-brown text-sm">Monitor your order deliveries, contact details, and craft history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Profile Summary Card */}
        <div className="lg:col-span-4 bg-white border border-brand-beige/35 p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center gap-4 border-b border-brand-beige/25 pb-4">
            <div className="w-14 h-14 bg-brand-blush/35 text-brand-rose rounded-full flex items-center justify-center font-bold text-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-brand-charcoal">{user.name}</h2>
              <span className="text-[10px] text-brand-sage font-bold uppercase tracking-wider">Verified Member</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between text-brand-brown">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address</span>
              <span className="font-semibold text-brand-charcoal">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center justify-between text-brand-brown">
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</span>
                <span className="font-semibold text-brand-charcoal">{user.phone}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-brand-cream hover:bg-red-50 hover:text-red-600 text-brand-brown border border-brand-beige hover:border-red-100 rounded-xl text-xs font-bold transition-smooth flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Right Side: Order History Panel */}
        <div className="lg:col-span-8 bg-white border border-brand-beige/35 p-6 sm:p-8 rounded-2xl shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-xl text-brand-charcoal pb-3 border-b border-brand-beige/20 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-rose" /> My Orders
          </h3>
          
          {loadingOrders ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Spinner />
              <p className="text-brand-brown text-xs mt-3 font-semibold">Retrieving purchase history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <PackageOpen className="w-12 h-12 text-brand-brown mx-auto stroke-[1.25]" />
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-brand-charcoal">No Orders Placed Yet</h4>
                <p className="text-brand-brown text-xs">Once you order items, your cozy parcel records will display here.</p>
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center px-5 py-2.5 bg-brand-rose hover:bg-brand-rose-dark text-white text-xs font-bold rounded-xl shadow-sm transition-smooth gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.orderId} 
                  className="p-5 border border-brand-beige rounded-xl space-y-4 text-xs bg-brand-cream/10 hover:border-brand-rose/30 transition-smooth"
                >
                  <div className="flex justify-between items-center border-b border-brand-beige/20 pb-3">
                    <div>
                      <span className="text-brand-brown font-medium">Order ID: </span>
                      <span className="font-bold text-brand-charcoal">{order.orderId}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-brand-sage bg-brand-sage/10 px-2.5 py-1 rounded-md border border-brand-sage/10">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{order.status}</span>
                    </div>
                  </div>
                  
                  {/* Item List */}
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs text-brand-brown">
                        <span>
                          {item.name} {item.color && `(${item.color})`}{" "}
                          <span className="font-bold text-brand-charcoal">x{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-brand-charcoal">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-brand-beige/25 text-xs">
                    <span className="text-brand-brown">Date: {new Date(order.date).toLocaleDateString()}</span>
                    <div>
                      <span className="text-brand-brown">Total Paid: </span>
                      <span className="font-bold text-sm text-brand-charcoal">₹{order.pricing.grandTotal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
