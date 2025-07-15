import { Navigate, useLocation} from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

const AdminProtect = ({ children }) => {
    const { user, isAdminAuthenticated, adminToken } = useAuth();
    const location = useLocation();

    // Check if admin is authenticated via context and sessionStorage token
    const isAuthenticated = isAdminAuthenticated && adminToken;
    
    if (!isAuthenticated) {
        return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminProtect;
