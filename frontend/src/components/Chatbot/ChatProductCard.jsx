import React from 'react';
import { Link } from 'react-router-dom';

export default function ChatProductCard({ product, onCloseWindow }) {
  const primaryImage = product.images?.[0] || product.image || "/placeholder-image.svg";
  const isOutOfStock = product.stock === 0 || product.stockStatus === 'out-of-stock';

  return (
    <div className="flex items-center gap-3 bg-brand-cream/40 border border-brand-beige/50 p-2.5 rounded-xl text-xs hover:border-brand-rose/30 transition-colors">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg bg-white border border-brand-beige/40 overflow-hidden flex-shrink-0">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-image.svg";
          }}
        />
      </div>

      {/* Info details */}
      <div className="flex-grow min-w-0">
        <h4 className="font-semibold text-brand-charcoal truncate">{product.name}</h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="font-bold text-brand-rose">₹{product.price}</span>
          {isOutOfStock && (
            <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded bg-gray-200 text-gray-700 border border-gray-350/10">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Action CTA */}
      <Link
        to={`/product/${product.id}`}
        onClick={onCloseWindow}
        className="px-2.5 py-1.5 bg-brand-rose hover:bg-brand-rose-dark text-white text-[10px] font-bold rounded-lg transition-colors flex-shrink-0 text-center"
      >
        View
      </Link>
    </div>
  );
}
