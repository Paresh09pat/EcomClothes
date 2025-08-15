import axios from 'axios';
import { createContext, useState, useContext, useEffect } from 'react';
import { baseUrl } from '../utils/constant';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isRemoved,setIsRemoved] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('_token_ecommerce');
  const adminToken = sessionStorage.getItem('_token_ecommerce_admin');

  const isAuthenticated = !!token
  const isAdminAuthenticated = !!adminToken

  // Validate token once during first render
  const validateToken = async () => {
    if (!token || tokenValidated) {
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/v1/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        setTokenValidated(true);
      }
    } catch (error) {
      // Token is invalid or unauthorized, automatically logout
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout(true); // Pass true to indicate automatic logout
      }
      setTokenValidated(true);
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('_token_ecommerce', userData.token);
    setTokenValidated(false); // Reset validation flag on new login
    return true;
  };

  const adminlogin = (userData) => {
    setUser(userData);
    // Use sessionStorage for admin tokens so they logout when tab is closed
    sessionStorage.setItem('_token_ecommerce_admin', userData.token);
    return true;
  };

  const logout = (isAutomatic = false) => {
    // First remove from localStorage
    localStorage.removeItem('_token_ecommerce');
    
    // Show toast for automatic logout
    if (isAutomatic) {
      toast.info('Your session has expired. Please login again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/login');
    }
    
    // Add a small delay before updating state to prevent UI flickering
    setTimeout(() => {
      setUser(null);
      setWishlist([]); // Clear wishlist on logout
      setTokenValidated(false); // Reset validation flag
    }, 300);
  };

  const logoutAdmin = () => {
    // Remove admin token from sessionStorage
    sessionStorage.removeItem('_token_ecommerce_admin');
    setUser(null);
  };

  // Toggle wishlist function that handles both add and remove
  const toggleWishlist = async (product) => {
    if (!token) {
      throw new Error('User not authenticated');
    }

    setWishlistLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/v1/wishlist/add`, {
        productId: product._id,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Refresh wishlist after successful toggle
      await getWishlist();
      
      return response;
    }
    catch (err) {
      throw err;
    }
    finally {
      setWishlistLoading(false);
    }
  }

  
  // Get wishlist from server
  const getWishlist = async () => {
    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/v1/wishlist/get`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setWishlist(response.data.products || []);
      return response.data.products;
    }
    catch (err) {
      setWishlist([]);
      return [];
    }
  }

  // Check if product is in wishlist
  const isProductInWishlist = (productId) => {
    return wishlist.some(product => product._id === productId);
  }

  // Update user profile
  const updateUserProfile = async (updateData) => {
    if (!token) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await axios.put(`${baseUrl}/v1/user/update-profile`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local user state with new data
      if (response.data.success) {
        setUser(prevUser => ({
          ...prevUser,
          ...response.data.user
        }));
      }

      return response;
    } catch (err) { 
      throw err;
    }
  };

  // Load wishlist on authentication change
  useEffect(() => {
    if (token && isAuthenticated) {
      getWishlist();
    } else {
      setWishlist([]);
    }
  }, [token, isAuthenticated]); // Removed cartItems dependency

  // Set up global axios interceptor for automatic logout on 401/403
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Only logout if it's a user token (not admin token)
          if (localStorage.getItem('_token_ecommerce')) {
            logout(true); // Pass true to indicate automatic logout
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    user,
    loading,
    login,
    token,
    adminToken,
    logout,
    isAuthenticated,
    isAdminAuthenticated,
    setUser,
    adminlogin,
    logoutAdmin,
    wishlist,
    wishlistLoading,
    isProductInWishlist,
    toggleWishlist,
    getWishlist,
    addToWishlist: toggleWishlist,
    isRemoved,
    setIsRemoved,
    updateUserProfile,
    validateToken,
    tokenValidated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;