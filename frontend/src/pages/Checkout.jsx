import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ChevronRight, ClipboardCheck, Lock, ShoppingBag, Landmark, Truck, ArrowLeft, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import Spinner from '../components/Feedback/Spinner';

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Multi-step: 'details' | 'payment'
  const [checkoutStep, setCheckoutStep] = useState('details');

  // Shipping Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    paymentMethod: 'cod' // 'cod' | 'online'
  });

  // Online Payment Type: 'upi' | 'card' | 'netbanking'
  const [onlineMethod, setOnlineMethod] = useState('upi');

  // UPI State
  const [upiId, setUpiId] = useState('');
  const [upiProvider, setUpiProvider] = useState('gpay'); // gpay | phonepe | paytm | other

  // Card State (Strictly Component State - NEVER saved to localStorage or logged)
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('sbi'); // sbi | hdfc | icici | axis | kotak | other

  // Payment Processing Statuses
  const [paymentStatus, setPaymentStatus] = useState('selecting'); // selecting | processing | success
  const [paymentMessage, setPaymentMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  // Cart configuration
  const isCartEmpty = cartItems.length === 0 && !orderResult;
  const shippingFee = subtotal >= 799 ? 0 : 60;
  const grandTotal = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  // Step 1 Form Handler (Shipping Information validation)
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pinCode) {
      showToast("Please fill out all required shipping fields.", "error");
      return;
    }

    if (formData.paymentMethod === 'cod') {
      // COD proceeds immediately
      handlePlaceOrderCOD();
    } else {
      // Online payment redirects to payment selection step
      setCheckoutStep('payment');
      setPaymentStatus('selecting');
    }
  };

  // Place Order directly under Cash on Delivery
  const handlePlaceOrderCOD = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          color: item.selectedColor,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images?.[0] || item.product.image || "/placeholder-image.svg"
        })),
        shippingDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode
        },
        paymentMethod: "COD",
        paymentStatus: "Pending",
        transactionId: null,
        pricing: {
          subtotal,
          shippingFee,
          grandTotal
        }
      };

      const result = await apiService.placeOrder(orderPayload);
      setOrderResult(result);
      showToast("Order placed successfully via Cash on Delivery!", "success");
      clearCart();
    } catch (err) {
      console.error(err);
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Online payment processing simulation
  const handleOnlinePaymentSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (onlineMethod === 'upi') {
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiRegex.test(upiId.trim())) {
        showToast("Please enter a valid UPI ID (e.g. name@upi).", "error");
        return;
      }
    } else if (onlineMethod === 'card') {
      const cleanedCard = cardNumber.replace(/\s+/g, '');
      if (!/^\d{13,19}$/.test(cleanedCard)) {
        showToast("Please enter a valid credit or debit card number (13-19 digits).", "error");
        return;
      }
      if (!cardName.trim()) {
        showToast("Please enter the name on the card.", "error");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardExpiry)) {
        showToast("Please enter a valid expiry date in MM/YY format.", "error");
        return;
      }
      if (!/^\d{3,4}$/.test(cardCvv)) {
        showToast("Please enter a valid CVV (3 or 4 digits).", "error");
        return;
      }
    }

    // 2. Trigger Simulation states
    setPaymentStatus('processing');
    if (onlineMethod === 'netbanking') {
      setPaymentMessage("Redirecting securely to your bank portal...");
    } else {
      setPaymentMessage("Processing payment with Eyara Sandbox Gateway...");
    }

    // 1.5 seconds simulated banking response delay
    setTimeout(async () => {
      setPaymentStatus('success');
      showToast("Simulated Payment Successful!", "success");

      // Place order immediately after success
      setIsSubmitting(true);
      try {
        const orderPayload = {
          items: cartItems.map(item => ({
            id: item.product.id,
            name: item.product.name,
            color: item.selectedColor,
            quantity: item.quantity,
            price: item.product.price,
            image: item.product.images?.[0] || item.product.image || "/placeholder-image.svg"
          })),
          shippingDetails: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode
          },
          paymentMethod: onlineMethod === 'upi' ? 'UPI' : onlineMethod === 'card' ? 'Card' : 'Net Banking',
          paymentStatus: "Paid",
          transactionId: `DEMO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          pricing: {
            subtotal,
            shippingFee,
            grandTotal
          }
        };

        const result = await apiService.placeOrder(orderPayload);
        
        // SECURITY COMPLIANCE: Instantly wipe sensitive state from memory
        setCardNumber('');
        setCardName('');
        setCardExpiry('');
        setCardCvv('');
        setUpiId('');

        setOrderResult(result);
        clearCart();
      } catch (err) {
        console.error(err);
        showToast("Failed to record order. Please contact support.", "error");
      } finally {
        setIsSubmitting(false);
      }
    }, 1800);
  };

  if (isCartEmpty) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-brand-beige/50 text-brand-rose rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-brand-charcoal">Your Cart is Empty</h2>
        <p className="text-brand-brown text-sm">Please add some handcrafted items to your cart before checking out.</p>
        <Link
          to="/shop"
          className="inline-flex items-center px-6 py-3 bg-brand-rose hover:bg-brand-rose-dark text-white font-semibold text-sm rounded-xl transition-smooth"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-brand-brown font-medium mb-6">
        <Link to="/cart" className="hover:text-brand-rose transition-colors">Cart</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-charcoal font-semibold">Checkout</span>
      </div>

      {/* Progress Bar indicator */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-brand-brown/70 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-beige/35 -translate-y-1/2 -z-10" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-brand-rose -translate-y-1/2 -z-10 transition-all duration-500" 
            style={{ 
              width: orderResult 
                ? '100%' 
                : checkoutStep === 'payment' 
                  ? '66%' 
                  : '33%' 
            }} 
          />

          {/* Cart */}
          <div className="flex flex-col items-center gap-2 bg-brand-cream px-2">
            <div className="w-7 h-7 rounded-full bg-brand-rose text-white flex items-center justify-center border-2 border-brand-rose shadow-xs text-xs">
              ✓
            </div>
            <span>Cart</span>
          </div>

          {/* Details */}
          <div className="flex flex-col items-center gap-2 bg-brand-cream px-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs transition-all duration-350 ${
              checkoutStep === 'details' && !orderResult
                ? 'bg-white border-brand-rose text-brand-rose font-bold ring-4 ring-brand-rose/10'
                : checkoutStep === 'payment' || orderResult
                  ? 'bg-brand-rose border-brand-rose text-white'
                  : 'bg-white border-brand-beige text-brand-brown/40'
            }`}>
              {checkoutStep === 'payment' || orderResult ? '✓' : '2'}
            </div>
            <span className={checkoutStep === 'details' && !orderResult ? 'text-brand-rose font-bold' : ''}>Details</span>
          </div>

          {/* Payment */}
          <div className="flex flex-col items-center gap-2 bg-brand-cream px-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs transition-all duration-350 ${
              checkoutStep === 'payment' && !orderResult
                ? 'bg-white border-brand-rose text-brand-rose font-bold ring-4 ring-brand-rose/10'
                : orderResult
                  ? 'bg-brand-rose border-brand-rose text-white'
                  : 'bg-white border-brand-beige text-brand-brown/40'
            }`}>
              {orderResult ? '✓' : '3'}
            </div>
            <span className={checkoutStep === 'payment' && !orderResult ? 'text-brand-rose font-bold' : ''}>Payment</span>
          </div>

          {/* Confirmation */}
          <div className="flex flex-col items-center gap-2 bg-brand-cream px-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs transition-all duration-350 ${
              orderResult
                ? 'bg-white border-brand-rose text-brand-rose font-bold ring-4 ring-brand-rose/10'
                : 'bg-white border-brand-beige text-brand-brown/40'
            }`}>
              4
            </div>
            <span className={orderResult ? 'text-brand-rose font-bold' : ''}>Confirmation</span>
          </div>
        </div>
      </div>

      {isSubmitting ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Spinner size="large" />
          <p className="text-brand-brown text-sm mt-3 font-semibold">Creating your order & arranging delivery coordinates...</p>
        </div>
      ) : orderResult ? (
        
        /* ==================== SCREEN 3. ORDER SUCCESS / CONFIRMATION ==================== */
        <div className="max-w-2xl mx-auto bg-white border border-brand-beige/40 rounded-3xl p-8 sm:p-12 text-center shadow-lg space-y-8 animate-slide-in">
          <div className="w-16 h-16 bg-brand-sage/10 text-brand-sage rounded-full flex items-center justify-center mx-auto border border-brand-sage/20">
            <ClipboardCheck className="w-8 h-8 stroke-[1.5]" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-brand-charcoal">Thank You For Your Order!</h2>
            <p className="text-brand-brown text-sm">
              Your Eyara Essence order has been successfully placed.
            </p>
            <p className="text-xs text-brand-brown">
              Order ID: <span className="font-bold text-brand-charcoal bg-brand-beige/40 px-2 py-0.5 rounded-md">{orderResult.orderId}</span>
            </p>
          </div>

          <div className="border-t border-b border-brand-beige/40 py-6 text-left space-y-4">
            <h3 className="font-semibold text-sm text-brand-charcoal">Fulfillment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <span className="text-brand-brown block mb-0.5 font-bold uppercase tracking-wider text-[10px]">Shipping Address:</span>
                <span className="font-semibold text-brand-charcoal block leading-relaxed">
                  {orderResult.shippingDetails.name} <br />
                  {orderResult.shippingDetails.address}, <br />
                  {orderResult.shippingDetails.city}, {orderResult.shippingDetails.state} - {orderResult.shippingDetails.pinCode}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-brand-brown block mb-0.5 font-bold uppercase tracking-wider text-[10px]">Estimated Delivery:</span>
                  <span className="font-bold text-brand-sage flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> 5-8 Business Days
                  </span>
                </div>
                <div>
                  <span className="text-brand-brown block mb-0.5 font-bold uppercase tracking-wider text-[10px]">Payment Summary:</span>
                  <div className="space-y-0.5 font-semibold text-brand-charcoal">
                    <span className="block">Method: {orderResult.paymentMethod}</span>
                    <span className="block">Status: <span className="text-brand-sage">{orderResult.paymentStatus}</span></span>
                    {orderResult.transactionId && (
                      <span className="block text-[10px] font-mono text-brand-brown">Ref: {orderResult.transactionId}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/account')}
              className="w-full sm:w-auto px-8 py-3 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-semibold text-sm rounded-xl transition-smooth shadow-md"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="w-full sm:w-auto px-8 py-3 bg-brand-rose hover:bg-brand-rose-dark text-white font-semibold text-sm rounded-xl transition-smooth shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        </div>

      ) : checkoutStep === 'payment' ? (

        /* ==================== SCREEN 2. ONLINE PAYMENT GATEWAY STEP ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Columns: Payment Details Form */}
          <div className="lg:col-span-8 bg-white border border-brand-beige/30 p-6 sm:p-8 rounded-2xl shadow-xs space-y-6">
            
            {/* Back action */}
            <button
              type="button"
              onClick={() => setCheckoutStep('details')}
              className="inline-flex items-center text-xs font-semibold text-brand-rose hover:text-brand-rose-dark transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1 transition-transform group-hover:-translate-x-0.5" />
              Back to Shipping Details
            </button>

            <div>
              <h2 className="text-xl font-serif font-bold text-brand-charcoal">Choose Payment Method</h2>
              <p className="text-brand-brown text-xs mt-1">Select an online channel to complete your payment securely.</p>
            </div>

            {/* Sandbox Notice Banner */}
            <div className="bg-brand-cream/55 border border-brand-beige/40 p-4 rounded-xl space-y-1">
              <span className="font-bold text-[10px] text-brand-rose uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-rose" /> Sandbox Environment Notice
              </span>
              <p className="text-[10px] text-brand-brown leading-relaxed font-semibold">
                This is a simulated demo checkout. No real money or credentials will be processed. Card and banking inputs are validated locally and never persisted or logged.
              </p>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setOnlineMethod('upi')}
                className={`py-3.5 text-xs font-bold rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                  onlineMethod === 'upi'
                    ? 'border-brand-rose bg-brand-rose/[0.02] text-brand-rose'
                    : 'border-brand-beige hover:border-brand-rose/50 text-brand-brown'
                }`}
              >
                <span className="text-[10px]">UPI</span>
              </button>
              <button
                onClick={() => setOnlineMethod('card')}
                className={`py-3.5 text-xs font-bold rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                  onlineMethod === 'card'
                    ? 'border-brand-rose bg-brand-rose/[0.02] text-brand-rose'
                    : 'border-brand-beige hover:border-brand-rose/50 text-brand-brown'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px]">Card</span>
              </button>
              <button
                onClick={() => setOnlineMethod('netbanking')}
                className={`py-3.5 text-xs font-bold rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                  onlineMethod === 'netbanking'
                    ? 'border-brand-rose bg-brand-rose/[0.02] text-brand-rose'
                    : 'border-brand-beige hover:border-brand-rose/50 text-brand-brown'
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span className="text-[10px]">Net Banking</span>
              </button>
            </div>

            {/* Form details per channel */}
            {paymentStatus === 'processing' ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-brand-rose/25 border-t-brand-rose rounded-full animate-spin mx-auto" />
                <p className="text-brand-brown text-xs font-semibold animate-pulse">{paymentMessage}</p>
              </div>
            ) : paymentStatus === 'success' ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 bg-brand-sage/10 text-brand-sage border border-brand-sage/20 rounded-full flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-brand-charcoal">Payment Successful</h4>
                <p className="text-brand-brown text-xs">Completing transaction...</p>
              </div>
            ) : (
              <form onSubmit={handleOnlinePaymentSubmit} className="space-y-5 text-xs">
                
                {/* 2A. UPI FORM VIEW */}
                {onlineMethod === 'upi' && (
                  <div className="space-y-4">
                    {/* Visual Common App Chips */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-brand-charcoal uppercase tracking-wider">Common Apps</span>
                      <div className="flex flex-wrap gap-2">
                        {['gpay', 'phonepe', 'paytm', 'other'].map(app => (
                          <button
                            key={app}
                            type="button"
                            onClick={() => setUpiProvider(app)}
                            className={`px-3 py-2 border rounded-lg font-bold text-[10px] uppercase cursor-pointer ${
                              upiProvider === app
                                ? 'border-brand-rose text-brand-rose bg-brand-rose/[0.01]'
                                : 'border-brand-beige hover:border-brand-rose/50 text-brand-brown'
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="upiId" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
                        Enter UPI ID
                      </label>
                      <input
                        type="text"
                        id="upiId"
                        required
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@upi"
                        className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                      />
                    </div>
                  </div>
                )}

                {/* 2B. CREDIT & DEBIT CARD FORM VIEW */}
                {onlineMethod === 'card' && (
                  <div className="space-y-4">
                    {/* Card Number */}
                    <div className="space-y-1.5">
                      <label htmlFor="cardNumber" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        required
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, ''))}
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                      />
                    </div>

                    {/* Cardholder Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="cardName" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                        placeholder="Jane Doe"
                        className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="cardExpiry" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^\d]/g, '');
                            if (val.length > 2) {
                              val = val.substring(0, 2) + '/' + val.substring(2, 4);
                            }
                            setCardExpiry(val);
                          }}
                          placeholder="MM/YY"
                          className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="cardCvv" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
                          CVV
                        </label>
                        <input
                          type="password"
                          id="cardCvv"
                          required
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^\d]/g, ''))}
                          placeholder="123"
                          className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2C. NET BANKING BANK SELECTIONS */}
                {onlineMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="bankSelect" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
                        Select Your Bank
                      </label>
                      <select
                        id="bankSelect"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-3 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 cursor-pointer"
                      >
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                        <option value="other">Other Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Primary Payment Submission Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-brand-rose hover:bg-brand-rose-dark text-white font-bold text-sm rounded-xl transition-smooth shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    {onlineMethod === 'upi' 
                      ? `Verify & Pay ₹${grandTotal}` 
                      : onlineMethod === 'card' 
                        ? `Pay ₹${grandTotal}` 
                        : "Continue to Bank"}
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Right Columns: Checkout Sidebar summary */}
          <div className="lg:col-span-4 bg-white border border-brand-beige/30 p-6 rounded-2xl shadow-xs space-y-6 lg:sticky lg:top-24">
            <h3 className="font-serif font-bold text-lg text-brand-charcoal pb-3 border-b border-brand-beige/25">Order Invoice</h3>
            
            {/* Products List Summary */}
            <div className="max-h-48 overflow-y-auto space-y-3.5 pr-2 divide-y divide-brand-beige/10">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-xs pt-3 first:pt-0">
                  <div className="w-12 h-12 rounded-lg bg-brand-cream border border-brand-beige/40 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.images?.[0] || item.product.image || "/placeholder-image.svg"} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.svg";
                      }}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-semibold text-brand-charcoal truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-brand-brown block">{item.quantity} x ₹{item.product.price}</span>
                    {item.selectedColor && <span className="text-[9px] text-brand-rose block">Color: {item.selectedColor}</span>}
                  </div>
                  <span className="font-bold text-brand-charcoal flex-shrink-0">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="space-y-3 text-xs pt-4 border-t border-brand-beige/25">
              <div className="flex justify-between text-brand-brown">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-brand-brown">
                <span>Shipping Fee</span>
                <span>{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-brand-charcoal border-t border-brand-beige/20 pt-3">
                <span>Amount to Pay</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 text-[10px] text-brand-brown pt-2 border-t border-brand-beige/10">
              <Lock className="w-3.5 h-3.5 text-brand-sage" />
              <span>Demo Gateway Integration Active</span>
            </div>
          </div>

        </div>

      ) : (

        /* ==================== SCREEN 1. MAIN CHECKOUT FORM (DETAILS STEP) ==================== */
        <form onSubmit={handleDetailsSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Shipping & Billing Form */}
          <div className="lg:col-span-8 space-y-8 animate-slide-in">
            
            {/* Contact Information Card */}
            <div className="bg-white border border-brand-beige/30 p-6 rounded-2xl shadow-xs space-y-6">
              <h3 className="font-serif font-bold text-lg text-brand-charcoal border-b border-brand-beige/25 pb-3">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label htmlFor="name" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                    className="w-full bg-brand-cream/20 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jane@example.com"
                    className="w-full bg-brand-cream/20 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit number"
                    className="w-full bg-brand-cream/20 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white border border-brand-beige/30 p-6 rounded-2xl shadow-xs space-y-6">
              <h3 className="font-serif font-bold text-lg text-brand-charcoal border-b border-brand-beige/25 pb-3">Delivery Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-3">
                  <label htmlFor="address" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Flat/House No., Street, Locality details"
                    className="w-full bg-brand-cream/20 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="city" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full bg-brand-cream/20 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="state" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full bg-brand-cream/20 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="pinCode" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">PIN Code</label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    required
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="6-digit PIN"
                    className="w-full bg-brand-cream/20 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white border border-brand-beige/30 p-6 rounded-2xl shadow-xs space-y-6">
              <div className="border-b border-brand-beige/25 pb-3">
                <h3 className="font-serif font-bold text-lg text-brand-charcoal">Payment Selection</h3>
                <span className="text-[10px] text-brand-rose font-bold uppercase tracking-wide">Select how you want to settle the order</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Cash on Delivery */}
                <div
                  onClick={() => handleMethodChange('cod')}
                  className={`p-4 border rounded-xl cursor-pointer transition-smooth flex items-start gap-3 select-none ${
                    formData.paymentMethod === 'cod'
                      ? 'border-brand-rose bg-brand-rose/[0.02]'
                      : 'border-brand-beige hover:border-brand-rose/55'
                  }`}
                >
                  <input
                    type="radio"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => {}}
                    className="mt-1 accent-brand-rose"
                  />
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-brand-charcoal flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-brand-brown" /> Cash on Delivery
                    </span>
                    <p className="text-[10px] text-brand-brown leading-relaxed">Pay when your order is delivered.</p>
                  </div>
                </div>

                {/* Online Payment */}
                <div
                  onClick={() => handleMethodChange('online')}
                  className={`p-4 border rounded-xl cursor-pointer transition-smooth flex items-start gap-3 select-none ${
                    formData.paymentMethod === 'online'
                      ? 'border-brand-rose bg-brand-rose/[0.02]'
                      : 'border-brand-beige hover:border-brand-rose/55'
                  }`}
                >
                  <input
                    type="radio"
                    checked={formData.paymentMethod === 'online'}
                    onChange={() => {}}
                    className="mt-1 accent-brand-rose"
                  />
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-brand-charcoal flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-brand-brown" /> Online Payment
                    </span>
                    <p className="text-[10px] text-brand-brown leading-relaxed">Pay securely using UPI, Card or Net Banking.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Side: Order Summary Sidebar */}
          <div className="lg:col-span-4 bg-white border border-brand-beige/30 p-6 rounded-2xl shadow-xs space-y-6 lg:sticky lg:top-24">
            <h3 className="font-serif font-bold text-lg text-brand-charcoal pb-3 border-b border-brand-beige/25">Checkout Summary</h3>
            
            {/* Products List Summary */}
            <div className="max-h-48 overflow-y-auto space-y-3.5 pr-2 divide-y divide-brand-beige/10">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-xs pt-3 first:pt-0">
                  <div className="w-12 h-12 rounded-lg bg-brand-cream border border-brand-beige/40 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.images?.[0] || item.product.image || "/placeholder-image.svg"} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.svg";
                      }}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-semibold text-brand-charcoal truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-brand-brown block">{item.quantity} x ₹{item.product.price}</span>
                    {item.selectedColor && <span className="text-[9px] text-brand-rose block">Color: {item.selectedColor}</span>}
                  </div>
                  <span className="font-bold text-brand-charcoal flex-shrink-0">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div className="space-y-3 text-xs pt-4 border-t border-brand-beige/25">
              <div className="flex justify-between text-brand-brown">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-brand-brown">
                <span>Shipping Fee</span>
                <span>{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-brand-charcoal border-t border-brand-beige/20 pt-3">
                <span>Total Payment</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* Checkout CTAs */}
            <div className="space-y-4 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-brand-rose hover:bg-brand-rose-dark text-white font-bold text-sm rounded-xl transition-smooth shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                {formData.paymentMethod === 'cod' ? `Place Order (₹${grandTotal})` : `Continue to Payment`}
              </button>
              <div className="flex items-center justify-center gap-1 text-[10px] text-brand-brown">
                <Lock className="w-3.5 h-3.5 text-brand-sage" />
                <span>SSL Encrypted Checkout Portal</span>
              </div>
            </div>

          </div>

        </form>
      )}

    </div>
  );
}
