import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Save } from 'lucide-react';
import Spinner from '../../components/Feedback/Spinner';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Amigurumis',
    price: '',
    originalPrice: '',
    description: '',
    stock: 10,
    colorsInput: '',
    featured: false,
    bestseller: false,
    imageURL: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const prod = await apiService.getProductById(id);
        setFormData({
          name: prod.name,
          category: prod.category,
          price: prod.price,
          originalPrice: prod.originalPrice || '',
          description: prod.description,
          stock: prod.stock !== undefined ? prod.stock : 8,
          colorsInput: prod.colors ? prod.colors.join(', ') : '',
          featured: !!prod.featured,
          bestseller: !!prod.bestseller,
          imageURL: prod.images ? prod.images.join(', ') : (prod.image || '')
        });
      } catch (err) {
        console.error(err);
        setError("Failed to locate product. The item ID may be invalid or deleted.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) {
      showToast("Please fill out all required fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const colors = formData.colorsInput
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      // Split images by comma
      const images = formData.imageURL
        .split(',')
        .map(img => img.trim())
        .filter(img => img.length > 0);

      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        description: formData.description,
        stock: parseInt(formData.stock, 10),
        colors,
        featured: formData.featured,
        bestseller: formData.bestseller,
        images: images.length > 0 ? images : ["/placeholder-image.svg"]
      };

      await apiService.updateAdminProduct(id, payload);
      showToast(`Product "${formData.name}" updated successfully!`, "success");
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      showToast("Failed to update product details.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const categoriesList = [
    "Amigurumis", "Keychains", "Bookmarks", "Earphone Cases",
    "Mini Card Holders", "Bracelets", "Headbands", "Bandanas",
    "Car Hangers", "Small Organizers"
  ];

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Spinner size="large" />
        <p className="text-brand-brown text-sm mt-3 font-semibold font-sans">Retrieving catalog records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-slide-in">
        <h2 className="text-xl font-bold font-serif text-brand-charcoal">{error}</h2>
        <Link to="/admin/products" className="inline-flex px-4 py-2 bg-brand-rose text-white text-xs font-bold rounded-lg transition-smooth">
          Back to Catalog list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Back link and Header */}
      <div className="space-y-4">
        <Link
          to="/admin/products"
          className="inline-flex items-center text-xs font-bold text-brand-rose hover:text-brand-rose-dark transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
          Back to Products
        </Link>
        
        <div className="border-b border-brand-beige/50 pb-5">
          <h1 className="text-2xl font-serif font-bold text-brand-charcoal">Edit Product: {id}</h1>
          <p className="text-brand-brown text-xs">Modify the specifications, pricing, or stock counts of this creation.</p>
        </div>
      </div>

      {submitting ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Spinner size="large" />
          <p className="text-brand-brown text-sm mt-3 font-semibold font-sans">Saving modifications back to catalog database...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Fields (Left Col) */}
          <div className="lg:col-span-8 bg-white border border-brand-beige/35 p-6 rounded-2xl shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-base text-brand-charcoal border-b border-brand-beige/25 pb-3">Product Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              
              {/* Product Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="name" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="E.g., Sweet Cherry Keychain"
                  className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="category" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose cursor-pointer font-sans"
                >
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div className="space-y-1.5">
                <label htmlFor="stock" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Starting Stock *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="10"
                  className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label htmlFor="price" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Selling Price (INR) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="1"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="₹ 299"
                  className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                />
              </div>

              {/* Original Price */}
              <div className="space-y-1.5">
                <label htmlFor="originalPrice" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Original Price (For discount displays)</label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  min="1"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="₹ 349 (Optional)"
                  className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                />
              </div>

              {/* Colors */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="colorsInput" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Available Colors (Comma separated)</label>
                <input
                  type="text"
                  id="colorsInput"
                  name="colorsInput"
                  value={formData.colorsInput}
                  onChange={handleInputChange}
                  placeholder="Cream, Blush Pink, Sage Green"
                  className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="description" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Product Description *</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your creation, sizing, and details..."
                  className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans resize-none"
                ></textarea>
              </div>

            </div>
          </div>

          {/* Sidebar Settings (Right Col) */}
          <div className="lg:col-span-4 bg-white border border-brand-beige/35 p-6 rounded-2xl shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-base text-brand-charcoal border-b border-brand-beige/25 pb-3">Media & Badges</h3>
            
            <div className="space-y-5 text-xs">
              {/* Image URL */}
              <div className="space-y-1.5">
                <label htmlFor="imageURL" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Image Links / Paths (Comma separated) *</label>
                <input
                  type="text"
                  id="imageURL"
                  name="imageURL"
                  required
                  value={formData.imageURL}
                  onChange={handleInputChange}
                  placeholder="E.g., /products/amigurumis/pink-bunny-1.jpg, /products/amigurumis/pink-bunny-2.jpg"
                  className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                />
              </div>

              {/* Image Preview */}
              {formData.imageURL && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-brand-brown uppercase">Live Preview (First Image):</span>
                  <div className="aspect-square rounded-xl border border-brand-beige overflow-hidden bg-brand-cream">
                    <img
                      src={formData.imageURL.split(',')[0]?.trim() || "/placeholder-image.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.svg";
                        showToast("Invalid preview image link/path. Loading brand fallback.", "error");
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Badges Toggles */}
              <div className="border-t border-brand-beige/20 pt-4 space-y-3.5 select-none">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-brand-charcoal">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-brand-beige accent-brand-rose cursor-pointer"
                  />
                  <span>Mark as New Arrival / Featured</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-brand-charcoal">
                  <input
                    type="checkbox"
                    name="bestseller"
                    checked={formData.bestseller}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-brand-beige accent-brand-rose cursor-pointer"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

            </div>

            {/* Action Row */}
            <div className="border-t border-brand-beige/20 pt-6">
              <button
                type="submit"
                className="w-full py-3 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-xl text-xs font-bold transition-smooth shadow-sm flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
              >
                <Save className="w-4 h-4" /> Update Product
              </button>
            </div>

          </div>

        </form>
      )}

    </div>
  );
}
