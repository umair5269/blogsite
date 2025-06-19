// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user || role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

export default AdminRoute;
