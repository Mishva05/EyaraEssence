import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 bg-brand-blush/35 text-brand-rose rounded-full flex items-center justify-center mx-auto border border-brand-beige">
        <HelpCircle className="w-8 h-8 stroke-[1.25]" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-brand-charcoal">Loose Thread! (404)</h1>
        <p className="text-brand-brown text-sm leading-relaxed max-w-md mx-auto">
          The page you are looking for has been misplaced, renamed, or is currently untangled. Let's get you back to our boutique!
        </p>
      </div>

      <div className="flex justify-center gap-4 pt-2">
        <Link
          to="/"
          className="px-6 py-2.5 bg-white text-brand-charcoal border border-brand-beige hover:bg-brand-beige/30 font-semibold text-xs rounded-xl transition-smooth"
        >
          Go to Home
        </Link>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-brand-rose text-white hover:bg-brand-rose-dark font-semibold text-xs rounded-xl transition-smooth flex items-center gap-1 shadow-xs"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Shop Boutique
        </Link>
      </div>
    </div>
  );
}
