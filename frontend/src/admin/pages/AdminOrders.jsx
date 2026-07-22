import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Search, ShoppingCart, RotateCcw, AlertCircle } from 'lucide-react';
import Spinner from '../../components/Feedback/Spinner';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering and search states
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const statusFilters = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminOrders({
        search: searchQuery,
        status: activeStatus
      });
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleReset = () => {
    setActiveStatus('All');
    setSearchQuery('');
    // Direct trigger since state set is async
    const triggerReset = async () => {
      setLoading(true);
      const data = await apiService.getAdminOrders();
      setOrders(data);
      setLoading(false);
    };
    triggerReset();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200/50';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200/50';
      case 'Processing':
        return 'bg-purple-50 text-purple-800 border-purple-200/50';
      case 'Shipped':
        return 'bg-orange-50 text-orange-800 border-orange-200/50';
      case 'Delivered':
        return 'bg-brand-sage/10 text-brand-sage border-brand-sage/20';
      case 'Cancelled':
      default:
        return 'bg-red-50 text-red-700 border-red-200/50';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-beige/50 pb-5 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal">Manage Orders</h1>
          <p className="text-brand-brown text-xs">Verify invoices, check delivery addresses, and update processing statuses.</p>
        </div>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-brand-beige/35 p-4 rounded-2xl shadow-xs">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, or phone number..."
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

        {/* Reset button */}
        {(activeStatus !== 'All' || searchQuery) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 border border-brand-beige hover:border-brand-rose text-xs font-semibold text-brand-charcoal rounded-xl transition-smooth"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* Filter Tabs Menu */}
      <div className="flex overflow-x-auto pb-1 no-scrollbar border-b border-brand-beige/45 gap-1.5 sm:gap-2 text-xs">
        {statusFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveStatus(filter)}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 -mb-[2px] font-semibold uppercase tracking-wider ${
              activeStatus === filter
                ? 'border-brand-rose text-brand-rose font-bold bg-brand-rose/[0.02]'
                : 'border-transparent text-brand-brown hover:text-brand-rose hover:bg-brand-blush/10'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Orders Table Container */}
      <div className="bg-white border border-brand-beige/35 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20">
            <Spinner />
          </div>
        ) : orders.length === 0 ? (
          
          /* Empty Search Fallback */
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <AlertCircle className="w-12 h-12 text-brand-brown mx-auto stroke-[1.25]" />
            <div>
              <h3 className="font-semibold text-sm text-brand-charcoal">No Matching Orders</h3>
              <p className="text-xs text-brand-brown leading-relaxed">We couldn't find any orders in our records matching the specified status or search terms.</p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-brand-cream hover:bg-brand-blush/20 border border-brand-beige/50 text-brand-rose text-xs font-semibold rounded-lg transition-colors"
            >
              Clear Filter Tags
            </button>
          </div>

        ) : (
          
          /* Orders Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-brand-beige/30 bg-brand-beige/15 text-brand-brown font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Order Date</th>
                  <th className="py-3.5 px-4 text-center">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4 text-center">Payment</th>
                  <th className="py-3.5 px-4 text-center">Order Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige/10">
                {orders.map((o) => {
                  const itemsCount = o.items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr key={o.orderId} className="hover:bg-brand-cream/10">
                      <td className="py-4 px-6 font-bold text-brand-charcoal">{o.orderId}</td>
                      <td className="py-4 px-4 font-semibold text-brand-charcoal">{o.shippingDetails.name}</td>
                      <td className="py-4 px-4 text-brand-brown font-medium">{o.shippingDetails.phone}</td>
                      <td className="py-4 px-4 text-brand-brown font-medium">{new Date(o.date).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-center font-bold text-brand-charcoal">{itemsCount}</td>
                      <td className="py-4 px-4 font-bold text-brand-charcoal">₹{o.pricing.grandTotal}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                          o.paymentMethod === 'cod' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {o.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getStatusBadge(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/admin/orders/${o.orderId}`}
                          className="inline-flex px-3 py-1.5 bg-brand-cream hover:bg-brand-blush/25 text-brand-rose border border-brand-beige/55 rounded-lg text-xs font-bold transition-colors"
                        >
                          View Details
                        </Link>
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
