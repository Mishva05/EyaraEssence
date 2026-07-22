import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { ShoppingBag, ArrowUpRight, TrendingUp, AlertTriangle, Users, Package } from 'lucide-react';
import Spinner from '../../components/Feedback/Spinner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboardData = await apiService.getAdminDashboardData();
        setData(dashboardData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Spinner size="large" />
        <p className="text-brand-brown text-sm mt-3 font-semibold">Gathering business analytics...</p>
      </div>
    );
  }

  const { metrics, recentOrders, salesHistory } = data;

  const cardList = [
    {
      title: "Total Revenue",
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      desc: "Cumulative store sales",
      icon: TrendingUp,
      iconBg: "bg-brand-sage/10 text-brand-sage"
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders,
      desc: "Processed transactions",
      icon: ShoppingBag,
      iconBg: "bg-brand-rose/10 text-brand-rose"
    },
    {
      title: "Pending Orders",
      value: metrics.pendingOrders,
      desc: "Awaiting confirmation",
      icon: AlertTriangle,
      iconBg: metrics.pendingOrders > 0 ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-gray-100 text-gray-500"
    },
    {
      title: "Active Products",
      value: metrics.totalProducts,
      desc: "Catalog listing count",
      icon: Package,
      iconBg: "bg-brand-blush/35 text-brand-rose"
    },
    {
      title: "Low Stock Items",
      value: metrics.lowStockProducts,
      desc: "5 or fewer units left",
      icon: AlertTriangle,
      iconBg: metrics.lowStockProducts > 0 ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-500"
    },
    {
      title: "Customers",
      value: metrics.totalCustomers,
      desc: "Unique email signups",
      icon: Users,
      iconBg: "bg-brand-beige/40 text-brand-charcoal"
    }
  ];

  // Prepare custom CSS graph details
  const maxSale = salesHistory.length > 0 ? Math.max(...salesHistory.map(s => s.amount)) : 1000;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-beige/50 pb-5 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-charcoal">Dashboard</h1>
          <p className="text-brand-brown text-xs">Overview of your shop metrics, inventory status, and sales logs.</p>
        </div>
        <div className="text-xs font-semibold text-brand-rose bg-brand-rose/10 px-3 py-1.5 rounded-lg">
          Logged in as Store Owner
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardList.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div key={idx} className="bg-white border border-brand-beige/35 p-6 rounded-2xl shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-brand-brown font-medium">{card.title}</span>
                <div className="text-2xl font-bold text-brand-charcoal font-sans">{card.value}</div>
                <span className="text-[10px] text-brand-brown/75 block">{card.desc}</span>
              </div>
              <div className={`p-3.5 rounded-xl ${card.iconBg} flex-shrink-0`}>
                <IconComp className="w-5.5 h-5.5 stroke-[1.75]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Graph and Recent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sales visual (Left column - Custom Bar Chart) */}
        <div className="lg:col-span-5 bg-white border border-brand-beige/35 p-6 rounded-2xl shadow-xs space-y-6">
          <div className="border-b border-brand-beige/25 pb-3">
            <h3 className="font-serif font-bold text-base text-brand-charcoal">Revenue Logs</h3>
            <span className="text-[10px] text-brand-brown">Recent transaction aggregates</span>
          </div>

          {salesHistory.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-brand-brown italic">
              No revenue records registered yet.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Custom CSS Bar Graph */}
              <div className="flex items-end justify-between h-48 pt-6 border-b border-brand-beige/30 px-2 gap-4">
                {salesHistory.map((s, idx) => {
                  const percentHeight = Math.max(15, (s.amount / maxSale) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-help">
                      {/* Tooltip on hover */}
                      <span className="absolute -top-7 scale-0 group-hover:scale-100 bg-brand-charcoal text-white text-[10px] py-1 px-1.5 rounded-md transition-all z-10 whitespace-nowrap shadow-md font-sans">
                        ₹{s.amount}
                      </span>
                      {/* Visual Bar */}
                      <div
                        className="w-full bg-brand-rose/25 hover:bg-brand-rose rounded-t-md transition-smooth duration-300 shadow-sm"
                        style={{ height: `${percentHeight}px` }}
                      />
                      {/* X Label */}
                      <span className="text-[9px] text-brand-brown font-bold mt-2 truncate max-w-full text-center">
                        {s.date}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-[10px] text-brand-brown">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-brand-rose rounded-full" /> Completed Sales</span>
                <span>Max Order: ₹{maxSale}</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Orders Table (Right column) */}
        <div className="lg:col-span-7 bg-white border border-brand-beige/35 p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-brand-beige/25 pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-brand-charcoal">Recent Orders</h3>
              <span className="text-[10px] text-brand-brown">Latest 5 sales entries</span>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-brand-rose hover:text-brand-rose-dark flex items-center gap-0.5 group"
            >
              Manage Orders <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-beige/25 text-brand-brown font-semibold uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige/10">
                {recentOrders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-brand-cream/10">
                    <td className="py-3.5 font-bold text-brand-charcoal">{o.orderId}</td>
                    <td className="py-3.5 text-brand-brown font-medium max-w-[120px] truncate">{o.shippingDetails.name}</td>
                    <td className="py-3.5 font-bold text-brand-charcoal">₹{o.pricing.grandTotal}</td>
                    <td className="py-3.5 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        o.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        o.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-brand-sage/10 text-brand-sage'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to={`/admin/orders/${o.orderId}`}
                        className="px-2.5 py-1 bg-brand-cream hover:bg-brand-blush/20 text-brand-rose font-bold rounded-lg border border-brand-beige/40 transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 italic text-brand-brown">No orders recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
