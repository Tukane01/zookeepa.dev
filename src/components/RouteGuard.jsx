import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function RouteGuard({ children, allowedRoles = [], allowAnonymous = false }) {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const location = useLocation();

  const roleSet = new Set(allowedRoles);

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (allowAnonymous || roleSet.has('anonymous')) {
      return children;
    }
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // If role restrictions not set, any logged in user can access
  if (roleSet.size === 0) {
    return children;
  }

  const role = user?.role;
  if (roleSet.has(role)) {
    return children;
  }

  if (role === 'store_manager') return <Navigate to="/StoreManager" replace />;
  if (role === 'admin' || role === 'super_admin') return <Navigate to="/" replace />;
  return <Navigate to="/" replace />;
}
