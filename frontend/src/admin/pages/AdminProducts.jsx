import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Plus, Trash2, Edit, AlertCircle } from 'lucide-react';
import Spinner from '../../components/Feedback/Spinner';

export default function AdminProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminProducts({
        search: searchQuery,
        category: selectedCategory
      });
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await apiService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently remove "${name}" from your catalog?`);
    if (!confirmDelete) return;

    try {
      await apiService.deleteAdminProduct(id);
      showToast(`Product "${name}" deleted.`, "info");
      // Reload products list
      fetchProducts();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete product.", "error");
    }
  };

  const getStockStatusBadge = (stock) => {
    if (stock === 0) {
      return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-red-100 text-red-700">Out of Stock</span>;
    }
    if (stock <= 5) {
      return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-100 text-amber-800">Low Stock</span>;
    }
    return <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-brand-sage/15 text-brand-sage">In Stock</span>;
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-beige/50 pb-5 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal">Manage Products</h1>
          <p className="text-brand-brown text-xs">Maintain your boutique catalog, monitor stock thresholds, and add new creations.</p>
        </div>
        <Link
          to="/admin/products/add"
          className="px-4 py-2.5 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-xl text-xs font-bold transition-smooth flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Search and Filters panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-brand-beige/35 p-4 rounded-2xl shadow-xs">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name or code ID..."
            className="w-full bg-brand-cream/35 border border-brand-beige/70 rounded-xl py-2 pl-10 pr-20 text-xs text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
          />
          <Search className="absolute left-3 w-4 h-4 text-brand-brown" />
          <button 
            type="submit" 
            className="absolute right-2 px-3 py-1 bg-brand-rose hover:bg-brand-rose-dark text-white text-[11px] font-semibold rounded-lg transition-smooth"
          >
            Search
          </button>
        </form>

        {/* Category filter dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-brand-brown font-semibold">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-brand-cream/45 border border-brand-beige/70 rounded-xl py-2 px-4 text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-rose cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white border border-brand-beige/35 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          
          /* Empty Catalog screen */
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <AlertCircle className="w-12 h-12 text-brand-brown mx-auto stroke-[1.25]" />
            <div>
              <h3 className="font-semibold text-sm text-brand-charcoal">No Products Found</h3>
              <p className="text-xs text-brand-brown leading-relaxed">No products match your current search queries or selected categories.</p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-brand-cream hover:bg-brand-blush/20 border border-brand-beige/50 text-brand-rose text-xs font-semibold rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>

        ) : (
          
          /* Table Index */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-brand-beige/30 bg-brand-beige/15 text-brand-brown font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Image</th>
                  <th className="py-3.5 px-4">Code ID</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4 text-center">Stock</th>
                  <th className="py-3.5 px-4 text-center">Stock Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige/10">
                {products.map((p) => {
                  const stockCount = p.stock !== undefined ? p.stock : 8;
                  return (
                    <tr key={p.id} className="hover:bg-brand-cream/10">
                      <td className="py-3 px-6">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-cream border border-brand-beige/40">
                          <img 
                            src={p.images?.[0] || p.image || "/placeholder-image.svg"} 
                            alt={p.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              e.target.src = "/placeholder-image.svg";
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-brand-brown">{p.id}</td>
                      <td className="py-3 px-4 font-semibold text-brand-charcoal max-w-[200px] truncate">{p.name}</td>
                      <td className="py-3 px-4 text-brand-brown font-medium">{p.category}</td>
                      <td className="py-3 px-4 font-bold text-brand-charcoal">₹{p.price}</td>
                      <td className={`py-3 px-4 text-center font-bold ${
                        stockCount === 0 ? 'text-red-600' : stockCount <= 5 ? 'text-amber-600' : 'text-brand-charcoal'
                      }`}>
                        {stockCount} units
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStockStatusBadge(stockCount)}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex justify-end gap-2.5">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="p-1.5 rounded-lg border border-brand-beige hover:border-brand-rose/40 hover:bg-brand-blush/10 text-brand-brown hover:text-brand-rose transition-all"
                            aria-label="Edit product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg border border-brand-beige hover:border-red-200 hover:bg-red-50 text-brand-brown hover:text-red-500 transition-all"
                            aria-label="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        )}
      </div>

    </div>
  );
}
