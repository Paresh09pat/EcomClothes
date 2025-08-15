import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, validateToken } = useAuth();
  const location = useLocation();

  // Validate token when component mounts to ensure it's still valid
  useEffect(() => {
    if (isAuthenticated) {
      validateToken();
    }
  }, [isAuthenticated, validateToken]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
