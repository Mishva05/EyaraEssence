import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
