import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import QuickActions from './QuickActions';
import { X, Minus, Trash2, Send } from 'lucide-react';

export default function ChatWindow({
  messages = [],
  isTyping = false,
  onSendMessage,
  onClose,
  onClear,
  onMinimize
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Get quick actions of the very last message if it's from the assistant
  const lastMessage = messages[messages.length - 1];
  const activeQuickActions = lastMessage && lastMessage.sender === 'assistant' ? lastMessage.quickActions : [];

  return (
    <div className="flex flex-col h-[500px] sm:h-[550px] w-full max-w-sm sm:w-[380px] bg-white border border-brand-beige/50 rounded-2xl shadow-xl overflow-hidden animate-slide-in">
      
      {/* Header Panel */}
      <div className="bg-brand-charcoal text-white px-4 py-3.5 flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-sm text-white">Eyara Assistant</h3>
          <p className="text-[10px] text-brand-blush/70 font-medium">Your handmade shopping companion</p>
        </div>
        
        {/* Header CTA Buttons */}
        <div className="flex items-center gap-1 text-brand-blush">
          
          {/* Clear History */}
          <button
            onClick={onClear}
            className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors cursor-pointer focus:outline-none"
            title="Clear conversation"
            aria-label="Clear conversation history"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Minimize */}
          <button
            onClick={onMinimize}
            className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors cursor-pointer focus:outline-none"
            title="Minimize"
            aria-label="Minimize chat window"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors cursor-pointer focus:outline-none"
            title="Close"
            aria-label="Close assistant window"
          >
            <X className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-brand-cream/10 no-scrollbar">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onCloseWindow={onClose}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-col space-y-1 items-start animate-pulse">
            <span className="text-[9px] font-bold text-brand-brown/60 uppercase tracking-wider px-1">
              Eyara Assistant
            </span>
            <div className="bg-brand-cream border border-brand-beige/55 text-brand-brown px-4 py-2.5 rounded-2xl rounded-bl-xs text-xs font-semibold">
              <span className="inline-flex gap-1">
                <span>•</span><span>•</span><span>•</span>
                <span className="text-[10px] italic ml-1">Assistant is thinking...</span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Quick Chips */}
      {activeQuickActions && activeQuickActions.length > 0 && (
        <div className="border-t border-brand-beige/20 bg-brand-cream/5 py-2 px-3">
          <QuickActions
            actions={activeQuickActions}
            onActionClick={onSendMessage}
          />
        </div>
      )}

      {/* Input Panel */}
      <form onSubmit={handleSend} className="p-3 border-t border-brand-beige/40 bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about products, care, gifts..."
          className="flex-grow bg-brand-cream/20 border border-brand-beige/80 rounded-xl py-2 px-4 text-xs text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose/10 font-sans"
          aria-label="Type message"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-brand-rose hover:bg-brand-rose-dark disabled:bg-brand-beige disabled:text-brand-brown/40 text-white rounded-xl transition-colors cursor-pointer focus:outline-none shadow-xs"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
