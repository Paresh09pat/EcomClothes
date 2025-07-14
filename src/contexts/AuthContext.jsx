import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  const login = (userData) => {
    setUser(userData);
    console.log("dataUser>>.", userData);
    localStorage.setItem('_token_ecommerce', userData.token);
    return true;
  };

  const adminlogin = (userData) => {
    setUser(userData);
    console.log("dataUser>>.", userData);
    localStorage.setItem('_token_ecommerce_admin', userData.token);
    return true;
  };



  const logout = () => {
    // First remove from localStorage
    localStorage.removeItem('_token_ecommerce');
    // Add a small delay before updating state to prevent UI flickering
    setTimeout(() => {
      setUser(null);
    }, 300);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('_token_ecommerce_admin');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    setUser,
    adminlogin,
    logoutAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;