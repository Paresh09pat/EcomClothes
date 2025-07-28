import axios from 'axios';
import { createContext, useState, useContext, useEffect } from 'react';
import { baseUrl } from '../utils/constant';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isRemoved,setIsRemoved] = useState(false);
  const [cartItems,setCartitems] = useState(true)
  const [itemsCart,setItemsCart]=useState(0)
  console.log("cart>>>",itemsCart)

  const token = localStorage.getItem('_token_ecommerce');
  const adminToken = sessionStorage.getItem('_token_ecommerce_admin');

  const isAuthenticated = !!token
  const isAdminAuthenticated = !!adminToken

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('_token_ecommerce', userData.token);
    return true;
  };

  const adminlogin = (userData) => {
    setUser(userData);
    // Use sessionStorage for admin tokens so they logout when tab is closed
    sessionStorage.setItem('_token_ecommerce_admin', userData.token);
    return true;
  };

  const logout = () => {
    // First remove from localStorage
    localStorage.removeItem('_token_ecommerce');
    // Add a small delay before updating state to prevent UI flickering
    setTimeout(() => {
      setUser(null);
      setWishlist([]); // Clear wishlist on logout
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
      console.error('Wishlist toggle error:', err);
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
      setItemsCart(response?.data?.cartCount)
      return response.data.products;
    }
    catch (err) {
      console.error('Get wishlist error:', err);
      setWishlist([]);
      return [];
    }
  }

  // Check if product is in wishlist
  const isProductInWishlist = (productId) => {
    return wishlist.some(product => product._id === productId);
  }

  // Load wishlist on authentication change
  useEffect(() => {
    if (token && isAuthenticated) {
      getWishlist();
    } else {
      setWishlist([]);
    }
  }, [cartItems]);

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
    cartItems,
    getWishlist,
    addToWishlist: toggleWishlist,
    isRemoved,
    setIsRemoved,
    setCartitems,
    itemsCart
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;