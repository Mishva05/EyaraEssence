import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { chatbotService } from '../../services/chatbotService';
import { MessageCircle, MessageSquareText } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const WELCOME_MESSAGE = {
    id: 'welcome',
    sender: 'assistant',
    text: "Hi! Welcome to Eyara Essence. 🧶 I can help you discover handmade products, find gifts, explore categories, or answer shopping questions. What are you looking for today?",
    quickActions: [
      'Shop Products',
      'Gifts Under ₹500',
      'Amigurumis',
      'Keychains',
      'Bestsellers',
      'Custom Orders',
      'Order Help',
      'Product Care'
    ]
  };

  // 1. Fetch products catalog on mount to keep chatbot searches fast
  useEffect(() => {
    async function loadCatalog() {
      try {
        const prods = await apiService.getProducts();
        setAllProducts(prods);
      } catch (err) {
        console.error("Chatbot failed to load catalog", err);
      }
    }
    loadCatalog();
  }, []);

  // 2. Load conversation history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('eyara_chat_history');
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse chat history", e);
        setMessages([WELCOME_MESSAGE]);
      }
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
  }, []);

  // 3. Helper to update and save history
  const updateChatHistory = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('eyara_chat_history', JSON.stringify(newMessages));
  };

  // 4. Send Message Handler
  const handleSendMessage = async (text) => {
    // Append User Message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text
    };
    const updatedWithUser = [...messages, userMsg];
    updateChatHistory(updatedWithUser);

    // Show Typing Indicator
    setIsTyping(true);

    // Simulate natural typing delay (600ms)
    setTimeout(() => {
      try {
        const response = chatbotService.generateResponse(
          text,
          allProducts,
          cartCount,
          isAuthenticated
        );

        const assistantMsg = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: response.text,
          products: response.products || [],
          actions: response.actions || [],
          quickActions: response.quickActions || []
        };

        updateChatHistory([...updatedWithUser, assistantMsg]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsTyping(false);
      }
    }, 600);
  };

  // 5. Clear Conversation History Handler
  const handleClearHistory = () => {
    const confirmClear = window.confirm("Are you sure you want to clear your conversation history with Eyara Assistant?");
    if (!confirmClear) return;

    localStorage.removeItem('eyara_chat_history');
    setMessages([WELCOME_MESSAGE]);
    setIsOpen(true);
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end gap-4 select-none">
      
      {/* 1. Floating Chat Window Box */}
      {isOpen && !isMinimized && (
        <div className="shadow-2xl rounded-2xl overflow-hidden max-sm:fixed max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:z-50 animate-slide-in">
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onClose={() => setIsOpen(false)}
            onClear={handleClearHistory}
            onMinimize={() => setIsMinimized(true)}
          />
        </div>
      )}

      {/* 2. Floating Toggle Button */}
      {(!isOpen || isMinimized) && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="w-14 h-14 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-rose/20 relative"
          aria-label="Open Eyara Assistant Shopping Chat"
          title="Chat with Eyara Assistant"
        >
          {isMinimized ? (
            <MessageSquareText className="w-6 h-6 animate-pulse" />
          ) : (
            <MessageCircle className="w-6.5 h-6.5" />
          )}
          
          {/* Subtle indicator dot to draw attention if chat was minimized */}
          {isMinimized && (
            <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-brand-sage rounded-full border-2 border-white" />
          )}
        </button>
      )}

      {/* 3. Mobile floating toggle button specifically to restore if minimized */}
      {isOpen && isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer focus:outline-none"
          aria-label="Restore Eyara Assistant chat"
          title="Restore Chat"
        >
          <MessageCircle className="w-5.5 h-5.5" />
        </button>
      )}

    </div>
  );
}
