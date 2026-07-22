import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '../Chatbot/Chatbot';

export default function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream">
      {/* Customer Header */}
      <Navbar />

      {/* Product Catalog/Boutique Page content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Chatbot Floating Companion */}
      <Chatbot />

      {/* Customer Footer */}
      <Footer />
    </div>
  );
}
