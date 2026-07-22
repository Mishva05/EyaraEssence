import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Users, Search, AlertCircle } from 'lucide-react';
import Spinner from '../../components/Feedback/Spinner';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value.toLowerCase().trim();
    setSearchQuery(e.target.value);
    
    if (q === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q)
      );
      setFilteredCustomers(filtered);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-beige/50 pb-5 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal">Manage Customers</h1>
          <p className="text-brand-brown text-xs">Analyze customer spending behaviors and track order histories derived from store sales.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-brand-beige/35 p-4 rounded-2xl shadow-xs flex items-center relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Filter customers by name or email address..."
          className="w-full bg-brand-cream/35 border border-brand-beige/70 rounded-xl py-2.5 pl-10 pr-4 text-xs text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
        />
        <Search className="absolute left-7 w-4.5 h-4.5 text-brand-brown" />
      </div>

      {/* Table grid */}
      <div className="bg-white border border-brand-beige/35 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20">
            <Spinner />
          </div>
        ) : filteredCustomers.length === 0 ? (
          
          /* Empty Search results Fallback */
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto animate-slide-in">
            <AlertCircle className="w-12 h-12 text-brand-brown mx-auto stroke-[1.25]" />
            <div>
              <h3 className="font-semibold text-sm text-brand-charcoal">No Customers Logged</h3>
              <p className="text-xs text-brand-brown leading-relaxed">No customers match the query. Customers will appear here automatically as they place orders on the storefront.</p>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilteredCustomers(customers);
                }}
                className="px-4 py-2 bg-brand-cream hover:bg-brand-blush/20 border border-brand-beige/50 text-brand-rose text-xs font-semibold rounded-lg transition-colors"
              >
                Clear Search Query
              </button>
            )}
          </div>

        ) : (
          
          /* Customer data Index Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-brand-beige/30 bg-brand-beige/15 text-brand-brown font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Customer Name</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4 text-center">Orders Placed</th>
                  <th className="py-3.5 px-4">Total Revenue Spent</th>
                  <th className="py-3.5 px-6 text-right">Last Purchase Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige/10">
                {filteredCustomers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-brand-cream/10">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-blush/35 text-brand-rose flex items-center justify-center font-bold">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-brand-charcoal">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-brand-brown font-medium">{c.email}</td>
                    <td className="py-4 px-4 text-brand-brown font-medium">{c.phone}</td>
                    <td className="py-4 px-4 text-center font-bold text-brand-charcoal">{c.ordersCount} orders</td>
                    <td className="py-4 px-4 font-bold text-brand-charcoal">₹{c.totalSpent.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right text-brand-brown font-medium">
                      {new Date(c.lastOrderDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        )}
      </div>

    </div>
  );
}
