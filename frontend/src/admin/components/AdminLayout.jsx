import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-brand-cream/40">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Administrative Content Viewport */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
