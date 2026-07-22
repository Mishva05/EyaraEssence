import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Lock, Mail, User, Phone, Sparkles } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      showToast("Please fill out all required fields.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match. Please verify your entries.", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await signup(name, email, password, phone);
      showToast(`Welcome to Eyara Essence, ${name}! Your account has been created.`, "success");
      navigate('/account');
    } catch (err) {
      console.error(err);
      showToast(err.message || "Registration failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 animate-slide-in">
      <div className="bg-white border border-brand-beige/40 rounded-3xl p-8 shadow-md space-y-6">
        
        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-rose/10 text-brand-rose rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-brand-rose uppercase block font-sans">
            EYARA ESSENCE
          </span>
          <h2 className="text-2xl font-serif font-bold text-brand-charcoal">
            Create Account
          </h2>
          <p className="text-brand-brown text-xs">
            Register to save wishlists, track purchases, and check out faster.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
              Full Name *
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Jane Doe"
                className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 pl-10 pr-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
              />
              <User className="absolute left-3.5 w-4 h-4 text-brand-brown" />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
              Email Address *
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jane@example.com"
                className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 pl-10 pr-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
              />
              <Mail className="absolute left-3.5 w-4 h-4 text-brand-brown" />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
              Phone Number (Optional)
            </label>
            <div className="relative flex items-center">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit number"
                className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 pl-10 pr-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
              />
              <Phone className="absolute left-3.5 w-4 h-4 text-brand-brown" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
              Password *
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 6 characters"
                className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 pl-10 pr-12 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
              />
              <Lock className="absolute left-3.5 w-4 h-4 text-brand-brown" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 rounded hover:bg-brand-cream/30 text-brand-brown hover:text-brand-rose transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
              Confirm Password *
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter password"
                className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 pl-10 pr-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
              />
              <Lock className="absolute left-3.5 w-4 h-4 text-brand-brown" />
            </div>
          </div>

          {/* Signup CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-brand-rose hover:bg-brand-rose-dark text-white font-bold rounded-xl text-sm transition-smooth shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Creating Account..." : "CREATE ACCOUNT"}
            </button>
          </div>

        </form>

        {/* Separator */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-brand-beige/35"></div>
          <span className="flex-shrink mx-4 text-[10px] text-brand-brown/70 font-bold uppercase tracking-widest">
            OR
          </span>
          <div className="flex-grow border-t border-brand-beige/35"></div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs space-y-1">
          <span className="text-brand-brown">Already have an account? </span>
          <Link
            to="/login?type=customer"
            className="font-bold text-brand-rose hover:underline"
          >
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
