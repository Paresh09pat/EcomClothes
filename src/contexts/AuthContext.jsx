import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  const login = (userData) => {
    // In a real app, you would validate credentials with an API
    setUser(userData);
    console.log("dataUser>>.", userData);
    localStorage.setItem('_token_ecommerce', userData.token);
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

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;