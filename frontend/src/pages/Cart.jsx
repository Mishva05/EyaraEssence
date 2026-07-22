import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import EmptyState from '../components/Feedback/EmptyState';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();

  const isCartEmpty = cartItems.length === 0;
  const shippingFee = subtotal >= 799 ? 0 : 60;
  const grandTotal = subtotal + shippingFee;

  if (isCartEmpty) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif text-brand-charcoal">Your Shopping Cart</h1>
        </div>
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="It looks like you haven't added any handcrafted goodies to your cart yet. Let's explore our collections and find something cozy!"
          actionText="Explore Boutique"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header */}
      <div className="border-b border-brand-beige/50 pb-6 mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold font-serif text-brand-charcoal mb-2">Your Shopping Cart</h1>
        <p className="text-brand-brown text-sm">Review your selected creations before proceeding to check out.</p>
      </div>

      {/* Cart Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Items List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Mobile view vs Desktop Table */}
          <div className="bg-white border border-brand-beige/30 rounded-2xl shadow-xs overflow-hidden">
            
            {/* Desktop Table Headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-brand-beige/20 text-xs font-bold text-brand-charcoal uppercase tracking-wider border-b border-brand-beige/35">
              <div className="col-span-6">Product details</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* List of Cart Items */}
            <div className="divide-y divide-brand-beige/25">
              {cartItems.map((item, index) => {
                const itemTotal = item.product.price * item.quantity;
                return (
                  <div 
                    key={`${item.product.id}-${item.selectedColor}-${index}`} 
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center"
                  >
                    
                    {/* Product details */}
                    <div className="col-span-6 flex gap-4">
                      <Link 
                        to={`/product/${item.product.id}`} 
                        className="w-20 h-20 rounded-xl overflow-hidden bg-brand-cream border border-brand-beige/40 flex-shrink-0"
                      >
                        <img 
                          src={item.product.images?.[0] || item.product.image || "/placeholder-image.svg"} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.svg";
                          }}
                        />
                      </Link>
                      <div className="space-y-1">
                        <Link 
                          to={`/product/${item.product.id}`} 
                          className="font-semibold text-sm text-brand-charcoal hover:text-brand-rose transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <span className="text-[11px] text-brand-brown block">{item.product.category}</span>
                        {item.selectedColor && (
                          <span className="inline-flex items-center text-[10px] font-semibold text-brand-rose bg-brand-rose/5 px-2 py-0.5 rounded-md border border-brand-rose/10">
                            Color: {item.selectedColor}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-left md:text-center flex md:flex-col justify-between items-center md:justify-center max-md:pt-2">
                      <span className="text-xs text-brand-brown font-bold uppercase tracking-wider md:hidden">Price:</span>
                      <span className="text-sm font-semibold text-brand-charcoal">₹{item.product.price}</span>
                    </div>

                    {/* Quantity controls */}
                    <div className="col-span-2 text-left md:text-center flex md:flex-col justify-between items-center md:justify-center max-md:pt-2">
                      <span className="text-xs text-brand-brown font-bold uppercase tracking-wider md:hidden">Quantity:</span>
                      <div className="flex items-center border border-brand-beige rounded-lg bg-brand-cream/30">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                          className="p-1.5 hover:text-brand-rose transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-brand-charcoal min-w-[24px] text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                          className="p-1.5 hover:text-brand-rose transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total & Remove CTA */}
                    <div className="col-span-2 text-right flex justify-between items-center md:justify-end gap-3 max-md:pt-2">
                      <span className="text-xs text-brand-brown font-bold uppercase tracking-wider md:hidden">Total:</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-brand-charcoal">₹{itemTotal}</span>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                          className="p-1.5 rounded-lg text-brand-brown hover:text-red-500 hover:bg-red-50 transition-all focus:outline-none"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center text-xs font-bold text-brand-rose hover:text-brand-rose-dark transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
              Continue Shopping
            </Link>
            
            <button
              onClick={clearCart}
              className="px-4 py-2 border border-brand-beige hover:border-red-200 text-brand-brown hover:text-red-500 rounded-xl text-xs font-bold bg-white transition-smooth"
            >
              Clear Cart
            </button>
          </div>

        </div>

        {/* Right Side: Order Summary Card */}
        <div className="lg:col-span-4 bg-white border border-brand-beige/30 p-6 rounded-2xl shadow-xs space-y-6 lg:sticky lg:top-24">
          <h3 className="font-serif font-bold text-lg text-brand-charcoal pb-3 border-b border-brand-beige/25">Order Summary</h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-brand-brown">
              <span>Subtotal ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} items)</span>
              <span className="font-semibold text-brand-charcoal">₹{subtotal}</span>
            </div>
            
            <div className="flex justify-between text-brand-brown items-start">
              <div className="flex flex-col">
                <span>Shipping Fee</span>
                <span className="text-[10px] text-brand-sage font-semibold">Free above ₹799</span>
              </div>
              <span className="font-semibold text-brand-charcoal">
                {shippingFee === 0 ? <span className="text-brand-sage">Free</span> : `₹${shippingFee}`}
              </span>
            </div>

            {shippingFee > 0 && (
              <div className="p-3 bg-brand-blush/20 rounded-xl text-xs text-brand-brown font-medium">
                💡 Add <span className="font-bold text-brand-rose">₹{799 - subtotal}</span> more to your cart to unlock **Free Shipping**!
              </div>
            )}
            
            <div className="border-t border-brand-beige/35 pt-4 flex justify-between text-base font-bold text-brand-charcoal">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/checkout"
              className="w-full py-3.5 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-smooth flex items-center justify-center gap-1.5"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[10px] text-brand-brown text-center leading-relaxed">By clicking proceed, you will enter the shipping details page. Real payment processing is currently in demo mode.</p>
          </div>

        </div>

      </div>

    </div>
  );
}
