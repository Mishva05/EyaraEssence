import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, FolderHeart, Users, LogOut, ArrowLeftRight, Menu, X } from 'lucide-react';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load pending order counts to display as navigation badges
  const loadPendingCount = async () => {
    try {
      const ordersList = await apiService.getAdminOrders({ status: 'Pending' });
      setPendingCount(ordersList.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPendingCount();
    
    // Check every 10 seconds for new orders while the page remains open
    const interval = setInterval(loadPendingCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    showToast("Admin session terminated.", "info");
    navigate('/login');
  };

  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/orders", label: "Orders", icon: ShoppingCart, badge: pendingCount },
    { to: "/admin/products", label: "Products", icon: FolderHeart },
    { to: "/admin/customers", label: "Customers", icon: Users }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-charcoal text-brand-beige py-6 px-4">
      {/* Brand Logo Header */}
      <div className="border-b border-white/10 pb-6 mb-6">
        <Link to="/admin/dashboard" className="text-xl font-bold font-serif tracking-widest text-white block">
          Eyara Essence
        </Link>
        <span className="text-[10px] text-brand-blush/60 font-semibold uppercase tracking-wider block mt-1">Store Admin Panel</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-1">
        {navLinks.map((link) => {
          const IconComp = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-smooth ${
                  isActive
                    ? "bg-brand-rose text-white shadow-sm"
                    : "text-brand-blush/80 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <IconComp className="w-4.5 h-4.5" />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && link.badge > 0 ? (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-[9px] font-bold leading-none text-brand-rose bg-white rounded-full">
                  {link.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom control links */}
      <div className="border-t border-white/10 pt-4 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-brand-blush/80 hover:bg-white/5 hover:text-white rounded-xl transition-smooth"
        >
          <ArrowLeftRight className="w-4.5 h-4.5" />
          <span>View Boutique</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-smooth text-left focus:outline-none"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between bg-brand-charcoal text-white px-4 py-3 border-b border-white/5 sticky top-0 z-30">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-brand-blush hover:text-white transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/admin/dashboard" className="text-lg font-bold font-serif tracking-widest text-white">
          Eyara Admin
        </Link>
        <div className="w-10 h-10 rounded-full bg-brand-rose/25 text-brand-rose flex items-center justify-center font-bold text-sm">
          A
        </div>
      </div>

      {/* Mobile slide-out drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setMobileOpen(false)} 
            className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-xs" 
          />
          
          {/* Content panel */}
          <div className="relative w-full max-w-xs h-full bg-brand-charcoal animate-slide-in flex flex-col justify-between">
            {/* Close button inside sidebar */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-brand-blush hover:text-white focus:outline-none"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
