import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionText = "Continue Shopping", 
  actionLink = "/shop" 
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 py-16 bg-brand-beige/25 rounded-2xl border border-brand-beige/50 max-w-md mx-auto my-8">
      {Icon && (
        <div className="p-4 bg-brand-blush/30 text-brand-rose rounded-full mb-4">
          <Icon className="w-8 h-8 stroke-[1.5]" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-brand-charcoal mb-2">{title}</h3>
      <p className="text-brand-brown text-sm mb-6 leading-relaxed">{description}</p>
      {actionText && (
        <Link 
          to={actionLink} 
          className="inline-flex items-center justify-center px-6 py-2.5 bg-brand-rose hover:bg-brand-rose-dark text-white font-medium text-sm rounded-xl transition-smooth shadow-sm hover:shadow-md"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
