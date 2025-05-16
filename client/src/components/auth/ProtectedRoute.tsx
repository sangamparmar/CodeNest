import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();

  useEffect(() => {
    if (!isAuth) {
      toast.error('Please login to access this page');
    }
  }, [isAuth]);

  if (!isAuth) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;