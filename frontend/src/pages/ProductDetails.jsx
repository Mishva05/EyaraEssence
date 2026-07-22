import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, Heart, ShoppingBag, Truck, HeartHandshake, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import Spinner from '../components/Feedback/Spinner';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery and option selections
  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // description | care | shipping

  useEffect(() => {
    async function loadProductDetails() {
      setLoading(true);
      setError(null);
      try {
        const prod = await apiService.getProductById(id);
        const imagesList = prod.images && Array.isArray(prod.images) && prod.images.length > 0
          ? prod.images
          : (prod.image ? [prod.image] : ["/placeholder-image.svg"]);
        
        const normalizedProd = {
          ...prod,
          images: imagesList
        };

        setProduct(normalizedProd);
        setActiveImage(imagesList[0]);
        setSelectedColor(prod.colors && prod.colors.length > 0 ? prod.colors[0] : '');
        setQuantity(1);

        // Fetch related products
        const related = await apiService.getRelatedProducts(prod.id, prod.category);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Failed to load product details", err);
        setError("The product you are looking for does not exist or has been removed.");
      } finally {
        setLoading(false);
      }
    }
    loadProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center">
        <Spinner size="large" />
        <p className="text-brand-brown text-sm mt-3 font-medium">Loading handcrafted details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
          <ArrowLeft className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-brand-charcoal">Oops! Product Not Found</h2>
        <p className="text-brand-brown text-sm">{error || "We couldn't load the product details."}</p>
        <Link
          to="/shop"
          className="inline-flex items-center px-6 py-3 bg-brand-rose hover:bg-brand-rose-dark text-white font-semibold text-sm rounded-xl transition-smooth"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const isLowStock = product.stockStatus === 'low-stock';
  const favorited = isInWishlist(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity, selectedColor);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity, selectedColor);
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
      
      {/* Back button & Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-brand-brown font-medium">
        <Link to="/" className="hover:text-brand-rose transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-brand-rose transition-colors">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-rose transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-brand-charcoal font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-brand-beige/40 shadow-xs relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placeholder-image.svg";
              }}
            />
            {/* Badges Overlay */}
            {product.bestseller && (
              <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase bg-brand-blush text-brand-charcoal rounded-lg shadow-sm">
                Bestseller
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 bg-white transition-smooth ${
                    activeImage === img ? "border-brand-rose shadow-sm" : "border-brand-beige/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.src = "/placeholder-image.svg";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-brand-rose font-bold">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-charcoal leading-tight">
              {product.name}
            </h1>
            
            {/* Rating summary */}
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-sm font-semibold text-brand-charcoal">{product.rating}</span>
              <span className="text-xs text-brand-brown">|</span>
              <span className="text-xs text-brand-brown underline cursor-pointer">{product.reviewsCount} customer reviews</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-brand-beige/25 border border-brand-beige/40 rounded-2xl flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-brand-charcoal">₹{product.price}</span>
              {hasDiscount && (
                <span className="text-sm text-brand-brown line-through">₹{product.originalPrice}</span>
              )}
            </div>
            
            {/* Stock status indicator */}
            <div>
              {isOutOfStock ? (
                <span className="px-2.5 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded-md">Sold Out</span>
              ) : isLowStock ? (
                <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-md animate-pulse">Low Stock</span>
              ) : (
                <span className="px-2.5 py-1 text-xs font-semibold bg-brand-sage/15 text-brand-sage rounded-md">In Stock</span>
              )}
            </div>
          </div>

          {/* Colors Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                Selected Color: <span className="text-brand-rose">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-smooth focus:outline-none ${
                      selectedColor === color
                        ? "border-brand-rose bg-brand-rose/5 text-brand-rose font-bold"
                        : "border-brand-beige bg-white text-brand-brown hover:border-brand-rose/60"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Wishlist Link */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-brown block">Quantity</span>
                <div className="flex items-center border border-brand-beige rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2.5 hover:text-brand-rose transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-bold text-brand-charcoal select-none min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    className="p-2.5 hover:text-brand-rose transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-smooth flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-white border border-brand-rose text-brand-rose hover:bg-brand-rose/5"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-smooth flex items-center justify-center ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-brand-rose hover:bg-brand-rose-dark text-white shadow-md hover:shadow-lg"
              }`}
            >
              Buy It Now
            </button>
            
            {/* Wishlist Icon Toggle */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3.5 rounded-xl border border-brand-beige hover:border-brand-rose/50 bg-white transition-smooth ${
                favorited ? "text-brand-rose border-brand-rose/25 bg-brand-rose/[0.02]" : "text-brand-brown"
              }`}
              aria-label="Toggle Wishlist"
            >
              <Heart className={`w-5 h-5 ${favorited ? "fill-brand-rose" : ""}`} />
            </button>
          </div>

          {/* Accordion / Tabs Section */}
          <div className="border-t border-brand-beige/50 pt-6">
            <div className="flex border-b border-brand-beige/40 text-sm font-semibold mb-4 gap-6">
              {['description', 'details', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 capitalize transition-all border-b-2 -mb-[1px] ${
                    activeTab === tab
                      ? "border-brand-rose text-brand-rose font-bold"
                      : "border-transparent text-brand-brown hover:text-brand-rose"
                  }`}
                >
                  {tab === 'details' ? 'Handmade & Care' : tab === 'shipping' ? 'Shipping' : 'Description'}
                </button>
              ))}
            </div>

            <div className="text-brand-brown text-sm leading-relaxed min-h-[96px]">
              {activeTab === 'description' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <p className="text-xs italic text-brand-brown/85">Note: All Eyara Essence products are individually crafted by hand. Minor variations in stitches, sizes, or thread shades might occur, contributing to their unique charm.</p>
                </div>
              )}
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <ul className="list-disc pl-5 space-y-1.5 text-xs">
                    {product.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                  <h5 className="font-bold text-xs text-brand-charcoal pt-2">Care Instructions:</h5>
                  <p className="text-xs">{product.careInstructions}</p>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-2 text-xs">
                  <p>📦 **Handmade Lead Time**: Our creations are crafted in small batches or made-to-order. Orders are usually processed and ready to ship within **3-5 business days**.</p>
                  <p>🚚 **Standard Shipping**: Free shipping across India on orders above ₹799. Delivery typically takes **4-7 business days** post-dispatch.</p>
                  <p>🎁 **Gift Wrapping**: Every order is shipped in our signature Kraft gift boxes with hand-tied ribbon and a blank gift note. Mention gifting requests in contact details!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick trust flags */}
          <div className="grid grid-cols-3 gap-4 border-t border-brand-beige/40 pt-6 text-[10px] text-brand-brown font-semibold uppercase tracking-wider text-center">
            <div className="flex flex-col items-center gap-1.5">
              <HeartHandshake className="w-5 h-5 text-brand-rose stroke-[1.5]" />
              <span>Artisanal Crafted</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-5 h-5 text-brand-rose stroke-[1.5]" />
              <span>Safe Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-brand-rose stroke-[1.5]" />
              <span>Secure Checkout</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products Carousel */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="border-t border-brand-beige/50 pt-16 space-y-8">
          <div className="text-center max-w-sm mx-auto">
            <h2 className="text-2xl font-bold font-serif text-brand-charcoal mb-2">You May Also Like</h2>
            <p className="text-brand-brown text-xs sm:text-sm">Complete your set with these beautiful coordinating pieces.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
