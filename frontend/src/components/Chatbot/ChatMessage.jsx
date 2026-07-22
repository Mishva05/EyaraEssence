import React from 'react';
import { Link } from 'react-router-dom';
import ChatProductCard from './ChatProductCard';

export default function ChatMessage({ message, onCloseWindow }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex flex-col space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
      
      {/* Sender Label */}
      <span className="text-[9px] font-bold text-brand-brown/60 uppercase tracking-wider px-1">
        {isUser ? 'You' : 'Eyara Assistant'}
      </span>

      {/* Message Bubble Card */}
      <div
        className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-2xs leading-relaxed ${
          isUser
            ? 'bg-brand-rose text-white rounded-br-xs'
            : 'bg-brand-cream border border-brand-beige/55 text-brand-charcoal rounded-bl-xs'
        }`}
      >
        {/* Text body */}
        <p className="whitespace-pre-line font-medium">{message.text}</p>

        {/* Embedded product cards list */}
        {message.products && message.products.length > 0 && (
          <div className="mt-3.5 space-y-2">
            {message.products.map((prod) => (
              <ChatProductCard
                key={prod.id}
                product={prod}
                onCloseWindow={onCloseWindow}
              />
            ))}
          </div>
        )}

        {/* Action Link Buttons (e.g. Navigate to cart, account, contact) */}
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3.5 space-y-1.5">
            {message.actions.map((act, index) => (
              <Link
                key={index}
                to={act.path}
                onClick={onCloseWindow}
                className="block w-full py-2 bg-white/70 hover:bg-white border border-brand-beige/40 text-brand-rose text-center font-bold text-[10px] rounded-lg transition-colors shadow-2xs"
              >
                {act.label}
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
