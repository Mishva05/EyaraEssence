import React, { useState } from 'react';
import { Mail, Instagram, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Feedback/Spinner';

export default function Contact() {
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast("Please fill out all required fields.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.submitContact(formData);
      if (response.success) {
        showToast(response.message, "success");
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to submit your message. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    {
      icon: Mail,
      label: "Email Support",
      value: "hello@eyaraessence.placeholder",
      link: "mailto:hello@eyaraessence.placeholder"
    },
    {
      icon: Instagram,
      label: "Instagram Direct",
      value: "@eyara_essence.placeholder",
      link: "#instagram"
    },
    {
      icon: MessageSquare,
      label: "WhatsApp Chat",
      value: "+91 00000 00000 (Demo)",
      link: "#whatsapp"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      
      {/* Page Header */}
      <div className="border-b border-brand-beige/50 pb-6 mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold font-serif text-brand-charcoal mb-2">Get In Touch</h1>
        <p className="text-brand-brown text-sm">Have a question about our products, shipping, or custom requests? We'd love to hear from you.</p>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Side: Contact Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-beige/35 border border-brand-beige/50 p-6 rounded-2xl space-y-6">
            <h3 className="font-serif font-bold text-lg text-brand-charcoal">Studio Details</h3>
            <p className="text-brand-brown text-xs sm:text-sm leading-relaxed">
              We operate from our cozy workspace. Since all creations are handmade, we do not have a physical storefront, but you can always reach us digitally!
            </p>
            
            <div className="space-y-4 pt-2">
              {contactDetails.map((detail, idx) => {
                const IconComp = detail.icon;
                return (
                  <a
                    key={idx}
                    href={detail.link}
                    className="flex gap-4 p-4 bg-white border border-brand-beige/30 rounded-xl hover:border-brand-rose/40 hover:shadow-xs transition-smooth group"
                  >
                    <div className="p-2.5 bg-brand-blush/30 text-brand-rose rounded-lg group-hover:bg-brand-rose group-hover:text-white transition-colors">
                      <IconComp className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-brand-brown uppercase tracking-wider block">{detail.label}</span>
                      <span className="text-sm font-semibold text-brand-charcoal block group-hover:text-brand-rose transition-colors">{detail.value}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-8 bg-white border border-brand-beige/30 p-6 sm:p-8 rounded-2xl shadow-xs">
          {submitted ? (
            
            /* Form Success screen */
            <div className="text-center py-12 space-y-6 max-w-md mx-auto">
              <div className="w-14 h-14 bg-brand-sage/10 text-brand-sage rounded-full flex items-center justify-center mx-auto border border-brand-sage/20">
                <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-serif text-brand-charcoal">Message Sent!</h3>
                <p className="text-brand-brown text-sm leading-relaxed">
                  Thank you for writing to Eyara Essence. We have received your inquiry and will respond to your email within **24-48 hours**.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-brand-rose hover:bg-brand-rose-dark text-white text-xs font-semibold rounded-xl transition-smooth shadow-sm"
              >
                Send Another Message
              </button>
            </div>

          ) : (
            
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-serif font-bold text-lg text-brand-charcoal border-b border-brand-beige/20 pb-3">Send Us a Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label htmlFor="phone" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label htmlFor="subject" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="E.g., Custom amigurumi commission, bulk keychains, order delivery status"
                    className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label htmlFor="message" className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your inquiry in detail..."
                    className="w-full bg-brand-cream/15 border border-brand-beige rounded-xl py-2.5 px-4 text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 bg-brand-rose hover:bg-brand-rose-dark disabled:bg-brand-rose/60 text-white font-bold text-sm rounded-xl transition-smooth shadow-sm flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  {loading ? (
                    <Spinner size="small" className="p-0 border-white" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Inquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
