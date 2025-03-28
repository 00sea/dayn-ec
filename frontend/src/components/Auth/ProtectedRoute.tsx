import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  redirectPath = '/login' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  // Add some debugging to help troubleshoot
  useEffect(() => {
    console.log('Protected Route State:', { 
      isAuthenticated, 
      isLoading,
      user,
      path: location.pathname
    });
  }, [isAuthenticated, isLoading, user, location]);
  
  // If still loading authentication status, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login with the return url
  if (!isAuthenticated) {
    // Save the current location for redirect after login
    return (
      <Navigate 
        to={redirectPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;