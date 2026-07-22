import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const wishlistCount = wishlistItems.length;

  // Close menus on page navigation
  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-cream/90 backdrop-blur-md border-b border-brand-beige/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-brown hover:text-brand-rose hover:bg-brand-blush/20 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo - Wordmark */}
          <div className="flex-1 flex justify-center sm:justify-start items-center">
            <Link to="/" className="text-2xl sm:text-3xl font-bold font-serif tracking-widest text-brand-charcoal hover:text-brand-rose transition-colors">
              Eyara Essence
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex space-x-8 md:space-x-12">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wider uppercase transition-smooth hover:text-brand-rose ${
                    isActive ? "text-brand-rose" : "text-brand-brown"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions / Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-brand-brown hover:text-brand-rose transition-colors focus:outline-none"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <Link
              to={!isAuthenticated ? "/login" : role === 'admin' ? "/admin/dashboard" : "/account"}
              className="p-2 text-brand-brown hover:text-brand-rose transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-brand-brown hover:text-brand-rose transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-brand-rose rounded-full transform translate-x-1/3 -translate-y-1/3">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-brand-brown hover:text-brand-rose transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-brand-rose rounded-full transform translate-x-1/3 -translate-y-1/3">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Slide-out Search Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-brand-cream border-b border-brand-beige/60 py-4 shadow-md transition-all duration-300">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto px-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cozy amigurumis, bookmarks, bandanas..."
                className="w-full bg-white border border-brand-beige rounded-xl py-3 pl-12 pr-4 text-sm text-brand-charcoal placeholder-brand-brown/65 focus:outline-none focus:border-brand-rose/60 focus:ring-1 focus:ring-brand-rose/20 transition-all font-sans"
                autoFocus
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-brand-brown" />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-3 text-brand-brown hover:text-brand-rose font-medium text-xs py-1 px-2.5 rounded-lg border border-brand-beige/50 bg-brand-cream/50"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="sm:hidden border-t border-brand-beige/50 bg-brand-cream/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-6 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-4 py-3 text-base font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                    isActive
                      ? "text-brand-rose bg-brand-blush/20"
                      : "text-brand-brown hover:bg-brand-blush/10 hover:text-brand-rose"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
