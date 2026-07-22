import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import ProductGrid from '../components/Product/ProductGrid';
import { SlidersHorizontal, RotateCcw, Search, ChevronDown } from 'lucide-react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Read filter values from URL params
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sortBy') || 'bestseller';
  const maxPriceParam = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice'), 10) : 1200;

  // Local state for interactive controls before applying
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  // Load categories list
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await apiService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadCategories();
  }, []);

  // Sync local inputs when URL search parameters change
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchQuery(searchParam);
    setSortBy(sortParam);
    setMaxPrice(maxPriceParam);
  }, [categoryParam, searchParam, sortParam, maxPriceParam]);

  // Fetch filtered products
  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const data = await apiService.getProducts({
          category: categoryParam,
          search: searchParam,
          sortBy: sortParam,
          maxPrice: maxPriceParam,
          minPrice: 0
        });
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilteredProducts();
  }, [categoryParam, searchParam, sortParam, maxPriceParam]);

  // Apply filters by writing back to URL params
  const applyFilters = (newFilters = {}) => {
    const params = {};
    
    const cat = newFilters.category !== undefined ? newFilters.category : selectedCategory;
    const q = newFilters.search !== undefined ? newFilters.search : searchQuery;
    const sort = newFilters.sortBy !== undefined ? newFilters.sortBy : sortBy;
    const price = newFilters.maxPrice !== undefined ? newFilters.maxPrice : maxPrice;

    if (cat && cat !== 'All') params.category = cat;
    if (q) params.search = q;
    if (sort) params.sortBy = sort;
    if (price !== 1200) params.maxPrice = price.toString();

    setSearchParams(params);
    setShowMobileFilters(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('bestseller');
    setMaxPrice(1200);
    setSearchParams({});
    setShowMobileFilters(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters({ search: searchQuery });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Page Header */}
      <div className="border-b border-brand-beige/50 pb-6 mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-brand-charcoal mb-2">Shop Our Creations</h1>
        <p className="text-brand-brown text-sm">Explore cozy, premium crochet pieces crafted thread-by-thread for you.</p>
      </div>

      {/* Top search & sorting bar (desktop) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-brand-beige/30 p-4 rounded-2xl shadow-xs mb-8">
        
        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="w-full sm:max-w-md relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-brand-cream/45 border border-brand-beige/70 rounded-xl py-2 pl-10 pr-20 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
          />
          <Search className="absolute left-3 w-4 h-4 text-brand-brown" />
          <button 
            type="submit" 
            className="absolute right-2 px-3 py-1 bg-brand-rose hover:bg-brand-rose-dark text-white text-xs font-semibold rounded-lg transition-smooth"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2 border border-brand-beige hover:border-brand-rose rounded-xl text-xs font-semibold text-brand-charcoal transition-smooth"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Sorting Dropdown */}
          <div className="relative flex items-center">
            <span className="text-xs text-brand-brown font-medium mr-2 max-sm:hidden">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                applyFilters({ sortBy: e.target.value });
              }}
              className="appearance-none bg-brand-cream/45 border border-brand-beige/70 rounded-xl py-2 pl-4 pr-10 text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 cursor-pointer"
            >
              <option value="bestseller">Popularity / Bestsellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-3.5 w-3.5 h-3.5 text-brand-brown pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-8">
          
          {/* Categories Filter */}
          <div className="bg-white border border-brand-beige/30 p-6 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-brand-beige/25 mb-4">
              <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider">Categories</h3>
              {(categoryParam !== 'All' || searchParam || maxPriceParam !== 1200) && (
                <button 
                  onClick={handleResetFilters} 
                  className="text-xs font-bold text-brand-rose hover:text-brand-rose-dark transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
            
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    applyFilters({ category: cat });
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-smooth flex items-center justify-between ${
                    selectedCategory === cat
                      ? "bg-brand-rose/10 text-brand-rose font-bold"
                      : "text-brand-brown hover:bg-brand-blush/10 hover:text-brand-rose"
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-rose" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bg-white border border-brand-beige/30 p-6 rounded-2xl shadow-xs">
            <h3 className="text-sm font-bold text-brand-charcoal uppercase tracking-wider pb-3 border-b border-brand-beige/25 mb-4">
              Filter by Price
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-brand-brown font-semibold">
                <span>₹0</span>
                <span>Max: ₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1200"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                onMouseUp={() => applyFilters({ maxPrice: maxPrice })}
                onTouchEnd={() => applyFilters({ maxPrice: maxPrice })}
                className="w-full accent-brand-rose cursor-pointer"
              />
              <p className="text-[10px] text-brand-brown italic">Drag slider to set the maximum budget.</p>
            </div>
          </div>

        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-3">
          {/* Active Filter Tags */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-brand-brown font-medium">
              Showing <span className="font-bold text-brand-charcoal">{products.length}</span> products
              {categoryParam !== 'All' && <span> in <span className="font-semibold text-brand-charcoal">"{categoryParam}"</span></span>}
              {searchParam && <span> for <span className="font-semibold text-brand-charcoal">"{searchParam}"</span></span>}
            </p>
          </div>

          {/* Grid display */}
          <ProductGrid 
            products={products} 
            loading={loading}
            emptyMessage={searchParam ? `We couldn't find anything matching "${searchParam}". Try checking spelling or use broader categories.` : "No items match your active price boundaries."}
          />
        </div>

      </div>

      {/* Mobile Drawer Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setShowMobileFilters(false)} 
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-xs" 
          />
          
          {/* Content panel */}
          <div className="relative w-full max-w-xs bg-brand-cream h-full ml-auto p-6 shadow-xl flex flex-col justify-between overflow-y-auto animate-slide-in">
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-3 border-b border-brand-beige/50">
                <h3 className="font-serif font-bold text-lg text-brand-charcoal">Filter Options</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-brand-brown hover:text-brand-rose font-bold text-xs p-1">Close</button>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Categories</h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg ${
                        selectedCategory === cat
                          ? "bg-brand-rose/10 text-brand-rose font-bold"
                          : "text-brand-brown hover:bg-brand-blush/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Max Price (₹{maxPrice})</h4>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-rose"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-brand-beige/50">
              <button
                onClick={handleResetFilters}
                className="py-2.5 bg-white hover:bg-gray-100 text-brand-charcoal border border-brand-beige rounded-xl text-xs font-bold transition-smooth"
              >
                Clear All
              </button>
              <button
                onClick={() => applyFilters()}
                className="py-2.5 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-xl text-xs font-bold transition-smooth"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
