import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, MessageSquare, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast(`Thank you for subscribing! Cozy news is coming to ${email}.`, 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-brand-charcoal text-brand-beige border-t border-brand-charcoal/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif tracking-widest text-white">
              Eyara Essence
            </h3>
            <p className="text-brand-blush/80 text-sm leading-relaxed max-w-sm">
              Handcrafted crochet creations and lifestyle accessories lovingly made in small batches. We celebrate the beauty of slow craftsmanship and thoughtful gifting.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <a 
                href="#instagram" 
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-rose hover:text-white transition-all flex items-center justify-center text-brand-blush/90"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#whatsapp" 
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-rose hover:text-white transition-all flex items-center justify-center text-brand-blush/90"
                aria-label="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a 
                href="#email" 
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-rose hover:text-white transition-all flex items-center justify-center text-brand-blush/90"
                aria-label="Send us an email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-6">
              Our Boutique
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/" className="text-brand-blush/70 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="text-brand-blush/70 hover:text-white transition-colors">Shop All Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-brand-blush/70 hover:text-white transition-colors">Our Story</Link>
              </li>
              <li>
                <Link to="/contact" className="text-brand-blush/70 hover:text-white transition-colors">Get In Touch</Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-6">
              Shop Categories
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/shop?category=Amigurumis" className="text-brand-blush/70 hover:text-white transition-colors">Amigurumis</Link>
              </li>
              <li>
                <Link to="/shop?category=Keychains" className="text-brand-blush/70 hover:text-white transition-colors">Keychains</Link>
              </li>
              <li>
                <Link to="/shop?category=Bookmarks" className="text-brand-blush/70 hover:text-white transition-colors">Bookmarks</Link>
              </li>
              <li>
                <Link to="/shop?category=Bandanas" className="text-brand-blush/70 hover:text-white transition-colors">Bandanas & Headbands</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-6">
              Join the Cozy Club
            </h4>
            <p className="text-brand-blush/70 text-sm leading-relaxed">
              Subscribe to receive studio updates, new design drops, and exclusive discounts.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center mt-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-brand-blush/40 focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/30 transition-all font-sans"
              />
              <button
                type="submit"
                className="absolute right-2 p-2 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-lg transition-smooth focus:outline-none"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-blush/50 gap-4">
          <p>© {new Date().getFullYear()} Eyara Essence. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#shipping" className="hover:text-white transition-colors">Shipping Info</a>
            <a href="#returns" className="hover:text-white transition-colors">Returns & Exchanges</a>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <p className="text-[10px] text-brand-blush/30">Lovingly handcrafting small moments of joy.</p>
        </div>

      </div>
    </footer>
  );
}
