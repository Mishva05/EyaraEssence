import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, User, MapPin, CreditCard, ClipboardList, CheckCircle2 } from 'lucide-react';
import Spinner from '../../components/Feedback/Spinner';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusVal, setStatusVal] = useState('');

  const loadOrderDetails = async () => {
    setLoading(true);
    try {
      const details = await apiService.getAdminOrderById(id);
      setOrder(details);
      setStatusVal(details.status);
    } catch (e) {
      console.error(e);
      showToast("Failed to load order info.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusVal(newStatus);
    setUpdating(true);
    try {
      const updated = await apiService.updateAdminOrderStatus(id, newStatus);
      setOrder(updated);
      showToast(`Order status updated to ${newStatus}.`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status.", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Spinner size="large" />
        <p className="text-brand-brown text-sm mt-3 font-semibold">Opening invoice dossier...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-xl font-bold font-serif text-brand-charcoal">Order Dossier Not Found</h2>
        <p className="text-brand-brown text-xs">The order reference ID does not match any items in our records.</p>
        <Link to="/admin/orders" className="inline-flex px-4 py-2 bg-brand-rose text-white text-xs font-bold rounded-lg transition-smooth">
          Back to Orders List
        </Link>
      </div>
    );
  }

  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-8 pb-10">
      
      {/* Back to list and header */}
      <div className="space-y-4">
        <Link
          to="/admin/orders"
          className="inline-flex items-center text-xs font-bold text-brand-rose hover:text-brand-rose-dark transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
          Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-beige/50 pb-5 gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-charcoal">
              Order {order.orderId}
            </h1>
            <p className="text-brand-brown text-xs">
              Placed on {new Date(order.date).toLocaleString()} • {itemsCount} items
            </p>
          </div>

          {/* Quick status mutator */}
          <div className="flex items-center bg-white border border-brand-beige/50 p-2.5 rounded-xl gap-2 shadow-xs">
            <span className="text-xs text-brand-brown font-semibold">Change Status:</span>
            <div className="relative flex items-center">
              <select
                value={statusVal}
                onChange={handleStatusChange}
                disabled={updating}
                className="appearance-none bg-brand-cream/45 border border-brand-beige/70 rounded-lg py-1.5 pl-3 pr-8 text-xs font-bold text-brand-charcoal focus:outline-none cursor-pointer focus:border-brand-rose disabled:opacity-50"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            {updating && <div className="w-3.5 h-3.5 border-2 border-brand-rose/25 border-t-brand-rose rounded-full animate-spin" />}
          </div>
        </div>
      </div>

      {/* Grid segments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns (Details and Items) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Customer coordinates Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Customer profile details */}
            <div className="bg-white border border-brand-beige/35 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-sm text-brand-charcoal border-b border-brand-beige/20 pb-2.5 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-rose" /> Customer Details
              </h3>
              <div className="space-y-2 text-xs text-brand-brown">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="font-semibold text-brand-charcoal">{order.shippingDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-semibold text-brand-charcoal">{order.shippingDetails.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="font-semibold text-brand-charcoal">{order.shippingDetails.phone}</span>
                </div>
              </div>
            </div>

            {/* Delivery address details */}
            <div className="bg-white border border-brand-beige/35 p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-sm text-brand-charcoal border-b border-brand-beige/20 pb-2.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-rose" /> Shipping Address
              </h3>
              <div className="text-xs text-brand-brown space-y-1 leading-relaxed font-medium">
                <span className="font-semibold text-brand-charcoal block">{order.shippingDetails.name}</span>
                <span>{order.shippingDetails.address}</span>
                <span className="block">{order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pinCode}</span>
              </div>
            </div>

          </div>

          {/* Purchased Items List */}
          <div className="bg-white border border-brand-beige/35 rounded-2xl shadow-xs overflow-hidden">
            <h3 className="font-serif font-bold text-sm text-brand-charcoal bg-brand-beige/10 p-5 border-b border-brand-beige/25 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-brand-rose" /> Items Ordered
            </h3>
            
            <div className="divide-y divide-brand-beige/15">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-5 flex items-center justify-between text-xs gap-4">
                  {/* Item Image and Name info */}
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-lg bg-brand-cream border border-brand-beige/35 overflow-hidden flex-shrink-0">
                      {/* Check if product image exists locally or fallback */}
                      <img
                        src={item.image || "/placeholder-image.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.svg";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-brand-charcoal line-clamp-1">{item.name}</h4>
                      {item.color && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-brand-rose bg-brand-rose/5 px-2 py-0.5 rounded border border-brand-rose/10">
                          Color: {item.color}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price breakdowns */}
                  <div className="flex gap-8 items-center text-right font-medium text-brand-brown">
                    <div>
                      <span className="block text-[10px] text-brand-brown">Price</span>
                      <span className="font-semibold text-brand-charcoal">₹{item.price}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-brand-brown">Qty</span>
                      <span className="font-bold text-brand-charcoal">x{item.quantity}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-brand-brown">Subtotal</span>
                      <span className="font-bold text-brand-charcoal">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Billing and Summary */}
        <div className="lg:col-span-4 bg-white border border-brand-beige/35 p-6 rounded-2xl shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-sm text-brand-charcoal pb-3 border-b border-brand-beige/20 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-rose" /> Billing & Invoicing
          </h3>

          {/* Payment Method Details */}
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between text-brand-brown">
              <span>Payment Mode:</span>
              <span className="font-bold text-brand-charcoal uppercase">{order.paymentMethod}</span>
            </div>
            
            <div className="flex justify-between text-brand-brown">
              <span>Payment Status:</span>
              <span className={`font-bold uppercase ${
                order.paymentStatus === 'Paid' || order.status === 'Delivered'
                  ? 'text-brand-sage' 
                  : 'text-amber-800'
              }`}>
                {order.paymentStatus || (order.status === 'Delivered' ? 'Paid' : 'Unpaid')}
              </span>
            </div>

            <div className="flex justify-between text-brand-brown">
              <span>Transaction Ref:</span>
              <span className="font-mono text-brand-charcoal font-semibold">
                {order.transactionId || (order.paymentMethod === 'cod' ? 'COD - Pending' : 'TXN-' + id.split('-')[1])}
              </span>
            </div>
          </div>

          {/* Invoice math summary */}
          <div className="border-t border-brand-beige/25 pt-4 space-y-3.5 text-xs">
            <div className="flex justify-between text-brand-brown">
              <span>Subtotal</span>
              <span className="font-medium text-brand-charcoal">₹{order.pricing.subtotal}</span>
            </div>
            
            <div className="flex justify-between text-brand-brown">
              <span>Shipping Fee</span>
              <span className="font-medium text-brand-charcoal">
                {order.pricing.shippingFee === 0 ? <span className="text-brand-sage font-bold">Free</span> : `₹${order.pricing.shippingFee}`}
              </span>
            </div>

            <div className="border-t border-brand-beige/20 pt-3 flex justify-between text-sm font-bold text-brand-charcoal">
              <span>Invoice Total</span>
              <span className="text-brand-rose">₹{order.pricing.grandTotal}</span>
            </div>
          </div>

          {/* Fulfillment indicators */}
          <div className="bg-brand-cream/35 border border-brand-beige/40 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-sage flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs text-brand-brown leading-relaxed font-medium">
              <span className="font-semibold text-brand-charcoal">Order Verified</span>
              <p>Items checked for stock levels. Packing checklist generated for fulfillment.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
