import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import EmptyState from '../components/Feedback/EmptyState';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, moveWishlistItemToCart } = useWishlist();

  const isWishlistEmpty = wishlistItems.length === 0;

  if (isWishlistEmpty) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif text-brand-charcoal">Your Wishlist</h1>
        </div>
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any handcrafted items to your wishlist yet. Tap the heart icons on our product cards to save your favorites!"
          actionText="Discover Products"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header */}
      <div className="border-b border-brand-beige/50 pb-6 mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold font-serif text-brand-charcoal mb-2">Your Wishlist</h1>
        <p className="text-brand-brown text-sm">Save your favorite cozy creations here to order or share later.</p>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => {
          const isOutOfStock = product.stockStatus === 'out-of-stock';
          return (
            <div 
              key={product.id} 
              className="bg-white border border-brand-beige/35 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-smooth flex flex-col justify-between"
            >
              {/* Product Image Link */}
              <div className="relative aspect-square overflow-hidden bg-brand-cream/35">
                <img 
                  src={product.images?.[0] || product.image || "/placeholder-image.svg"} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.svg";
                  }}
                />
                
                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg tracking-wider uppercase">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-xs hover:shadow-md hover:text-red-500 transition-colors text-brand-brown focus:outline-none"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-brown">
                    {product.category}
                  </span>
                  <Link 
                    to={`/product/${product.id}`} 
                    className="font-semibold text-sm text-brand-charcoal hover:text-brand-rose line-clamp-1 block"
                  >
                    {product.name}
                  </Link>
                  <span className="text-sm font-bold text-brand-charcoal block">
                    ₹{product.price}
                  </span>
                </div>

                {/* Move to Cart action */}
                <button
                  onClick={() => moveWishlistItemToCart(product)}
                  disabled={isOutOfStock}
                  className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-smooth focus:outline-none ${
                    isOutOfStock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                      : "bg-brand-rose hover:bg-brand-rose-dark text-white"
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Move to Cart
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Footer link */}
      <div className="mt-12 flex justify-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-rose hover:text-brand-rose-dark transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}
