import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Lock, Mail, Sparkles, User, ShieldAlert, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';

export default function Login() {
  const { customerLogin, adminLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine active view: 'select' | 'customer' | 'admin'
  const typeParam = searchParams.get('type');
  const [view, setView] = useState('select');

  useEffect(() => {
    if (typeParam === 'admin') {
      setView('admin');
    } else if (typeParam === 'customer') {
      setView('customer');
    } else {
      setView('select');
    }
  }, [typeParam]);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Clear inputs when changing view
  const handleViewChange = (newView) => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    if (newView === 'select') {
      setSearchParams({});
    } else {
      setSearchParams({ type: newView });
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter both your email address and password.", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (view === 'admin') {
        await adminLogin(email, password);
        showToast("Welcome back, Administrator!", "success");
        navigate('/admin/dashboard');
      } else {
        await customerLogin(email, password);
        showToast("Signed in successfully!", "success");
        navigate('/account');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Sign-in failed. Please verify credentials.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== 1. ROLE SELECTION VIEW ====================
  if (view === 'select') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 animate-slide-in text-center space-y-8">
        
        {/* Header Block */}
        <div className="space-y-3">
          <div className="w-12 h-12 bg-brand-rose/10 text-brand-rose rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-brand-rose uppercase block font-sans">
            EYARA ESSENCE
          </span>
          <h1 className="text-3xl font-serif font-bold text-brand-charcoal">
            Welcome
          </h1>
          <p className="text-brand-brown text-sm max-w-sm mx-auto">
            How would you like to continue today? Choose your account role below.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
          
          {/* Customer Card */}
          <div
            onClick={() => handleViewChange('customer')}
            className="group cursor-pointer bg-white border border-brand-beige/40 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-brand-rose/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left space-y-8"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 bg-brand-blush/35 text-brand-rose rounded-xl flex items-center justify-center transition-colors group-hover:bg-brand-rose group-hover:text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-brand-charcoal">CUSTOMER</h3>
                <p className="text-brand-brown text-xs leading-relaxed mt-1">
                  Shop handmade crochet, manage your cart, and view order history.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-bold text-brand-rose group-hover:text-brand-rose-dark pt-2">
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Admin Card */}
          <div
            onClick={() => handleViewChange('admin')}
            className="group cursor-pointer bg-white border border-brand-beige/40 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-brand-rose/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left space-y-8"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 bg-brand-beige/55 text-brand-charcoal rounded-xl flex items-center justify-center transition-colors group-hover:bg-brand-charcoal group-hover:text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-brand-charcoal">ADMIN</h3>
                <p className="text-brand-brown text-xs leading-relaxed mt-1">
                  Manage products catalog, process customer orders, and view dashboard analytics.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-bold text-brand-rose group-hover:text-brand-rose-dark pt-2">
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

        </div>

        {/* Back Link */}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center text-xs font-bold text-brand-rose hover:text-brand-rose-dark transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
            Back to Store
          </Link>
        </div>

      </div>
    );
  }

  // ==================== 2. CUSTOMER & ADMIN FORMS VIEW ====================
  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 animate-slide-in">
      <div className="bg-white border border-brand-beige/40 rounded-3xl p-8 shadow-md space-y-6">
        
        {/* Back / Type selection switch link */}
        <button
          type="button"
          onClick={() => handleViewChange('select')}
          className="inline-flex items-center text-xs font-semibold text-brand-rose hover:text-brand-rose-dark transition-colors group cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1 transition-transform group-hover:-translate-x-0.5" />
          Change account type
        </button>

        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-rose/10 text-brand-rose rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-brand-rose uppercase block font-sans">
            EYARA ESSENCE
          </span>
          <h2 className="text-2xl font-serif font-bold text-brand-charcoal">
            {view === 'admin' ? "Admin Login" : "Customer Login"}
          </h2>
          <p className="text-brand-brown text-xs">
            {view === 'admin' 
              ? "Access the store management dashboard. Admin validation required." 
              : "Sign in to check orders, review wishlists, or view your history."}
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 pl-10 pr-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
              />
              <Mail className="absolute left-3.5 w-4 h-4 text-brand-brown" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                Password
              </label>
              {view === 'customer' && (
                <button
                  type="button"
                  onClick={() => showToast("Password recovery is not simulated. Use demo login details.", "info")}
                  className="text-[10px] font-semibold text-brand-rose hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 pl-10 pr-12 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
              />
              <Lock className="absolute left-3.5 w-4 h-4 text-brand-brown" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 rounded hover:bg-brand-cream/30 text-brand-brown hover:text-brand-rose transition-colors focus:outline-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-brand-rose hover:bg-brand-rose-dark text-white font-bold rounded-xl text-sm transition-smooth shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting 
                ? (view === 'admin' ? "Accessing Dashboard..." : "Signing In...") 
                : (view === 'admin' ? "ACCESS DASHBOARD" : "LOGIN")}
            </button>
          </div>

        </form>

        {/* Customer Only Signup Footer */}
        {view === 'customer' && (
          <>
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-brand-beige/35"></div>
              <span className="flex-shrink mx-4 text-[10px] text-brand-brown/70 font-bold uppercase tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-brand-beige/35"></div>
            </div>

            <div className="text-center text-xs space-y-1">
              <span className="text-brand-brown">Don't have an account? </span>
              <Link
                to="/signup"
                className="font-bold text-brand-rose hover:underline"
              >
                Create Account
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
