import { Navigate, useLocation} from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

const AdminProtect = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    // Check if user is authenticated via context or token
    const isAuthenticated = user || localStorage.getItem('_token_ecommerce_admin');
    

    // {"success":false,"message":"Token expired"}


    if (!isAuthenticated) {
        return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminProtect;
