import React, { createContext, useState, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-brand-sage" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-brand-rose" />;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-brand-sage/20 bg-brand-cream/95 text-brand-charcoal shadow-sm shadow-brand-sage/5';
      case 'error':
        return 'border-red-200 bg-red-50/95 text-red-900 shadow-sm';
      case 'info':
      default:
        return 'border-brand-rose/20 bg-brand-cream/95 text-brand-charcoal shadow-sm shadow-brand-rose/5';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in ${getTypeStyles(toast.type)}`}
            style={{
              animation: 'toast-slide-in 0.3s ease-out forwards'
            }}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(toast.type)}
            </div>
            <div className="flex-grow text-sm font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-brand-brown hover:text-brand-charcoal transition-colors focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Style for slide-in animation */}
      <style>{`
        @keyframes toast-slide-in {
          from {
            transform: translateY(1rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
