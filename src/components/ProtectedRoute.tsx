import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import AppLayout from '../layouts/AppLayout';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return isAuthenticated ? <AppLayout><Outlet /></AppLayout> : <Navigate to="/login" replace />;
}