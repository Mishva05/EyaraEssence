import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const primaryImage = product.images?.[0] || product.image || "/placeholder-image.svg";
  const favorited = isInWishlist(product.id);
  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const isLowStock = product.stockStatus === 'low-stock';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative bg-white border border-brand-beige/40 rounded-2xl overflow-hidden transition-smooth hover:shadow-lg hover:shadow-brand-charcoal/[0.03] flex flex-col h-full">
      {/* Product Image Wrapper */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-brand-cream/40">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder-image.svg";
          }}
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestseller && (
            <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-brand-blush text-brand-charcoal rounded-md shadow-sm">
              Bestseller
            </span>
          )}
          {product.featured && !product.bestseller && (
            <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-brand-beige text-brand-charcoal rounded-md shadow-sm">
              New Arrival
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-gray-200 text-gray-700 rounded-md shadow-sm">
              Sold Out
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-amber-100 text-amber-800 rounded-md shadow-sm">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:shadow-md transition-smooth z-10 text-brand-brown hover:text-brand-rose focus:outline-none"
          aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${favorited ? "fill-brand-rose text-brand-rose" : ""}`} 
          />
        </button>

        {/* Overlay hover quick add (desktop only) */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-brand-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 max-sm:hidden">
            <button
              onClick={handleAddToCartClick}
              className="px-4 py-2 bg-brand-rose hover:bg-brand-rose-dark text-white text-xs font-semibold rounded-lg shadow-md transition-smooth flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 duration-300"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Quick Add
            </button>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-[11px] uppercase tracking-wider text-brand-brown font-medium mb-1">
          {product.category}
        </span>

        {/* Product Title */}
        <Link to={`/product/${product.id}`} className="block group-hover:text-brand-rose transition-colors duration-200">
          <h4 className="text-sm font-semibold text-brand-charcoal font-sans line-clamp-1 mb-1.5">
            {product.name}
          </h4>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold text-brand-charcoal">{product.rating}</span>
          <span className="text-[11px] text-brand-brown">({product.reviewsCount})</span>
        </div>

        {/* Price & Add to Cart (Mobile Friendly) */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-brand-beige/20">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-brand-brown line-through mb-0.5">
                ₹{product.originalPrice}
              </span>
            )}
            <span className="text-sm font-bold text-brand-charcoal">
              ₹{product.price}
            </span>
          </div>

          {/* Quick Add for Mobile / Fallback */}
          <button
            onClick={handleAddToCartClick}
            disabled={isOutOfStock}
            className={`sm:hidden p-2 rounded-xl transition-smooth focus:outline-none ${
              isOutOfStock 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-brand-rose hover:bg-brand-rose-dark text-white"
            }`}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
