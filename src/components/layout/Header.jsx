import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { baseUrl } from '../../utils/constant';

import {
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';


const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, logout, wishlist, token, isAuthenticated } = useAuth();

  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Fetch cart count
  const fetchCartCount = async () => {
    if (!token || !isAuthenticated) {
      setCartCount(0);
      return;
    }

    try {
      const res = await axios.get(`${baseUrl}/v1/cart/get-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const cartItems = res?.data?.cart || [];
      const validCartItems = cartItems.filter(item => 
        item && 
        item.product && 
        item.product._id && 
        item.product.name && 
        item.product.price && 
        item.product.price > 0
      );
      
      const totalCount = validCartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalCount);
    } catch (err) {
      console.error('Error fetching cart count:', err);
      setCartCount(0);
    }
  };

  // Handle scroll effect
  // Fetch cart count on authentication change
  useEffect(() => {
    fetchCartCount();
  }, [token, isAuthenticated]);

  // Listen for cart refresh events
  useEffect(() => {
    const handleCartRefresh = () => {
      fetchCartCount();
    };

    window.addEventListener('cart-refresh', handleCartRefresh);
    return () => window.removeEventListener('cart-refresh', handleCartRefresh);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const categories = [
    { name: 'Top Selling', path: '/categories/topSelling' },
    { name: 'Women', path: '/categories/Women' },
    // { name: 'Kids', path: '/categories/Kids' },
    { name: 'Accessories', path: '/categories/Accessories' },
   
  ];

 

  return (
    <>
  
      {/* Main Header */}
      <header className={`bg-white sticky top-0 z-50 ${scrolled ? 'shadow-md' : ''} transition-shadow duration-300`}>
        <div className="container py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
              <img src="/logo.png" alt="logo" className="w-25 h-12" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {categories.map((category) => {
                const isActive = location.pathname === category.path;
                return (
                  <Link
                    key={category.name}
                    to={category.path}
                    className={`font-medium relative group py-2 transition-colors duration-200 ${
                      isActive 
                        ? 'text-indigo-600' 
                        : 'text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    {category.name}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </Link>
                );
              })}
            </nav>

            {/* User, Wishlist, Search and Cart */}
            <div className="flex items-center space-x-5">
              {/* Search */}
            

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors relative hidden md:block"
                aria-label="Wishlist"
              >
                <HeartIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{wishlist.length}</span>
              </Link>

              {/* Cart */}
              <div className="relative">
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingBagIcon className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* User Account */}
              {user ? (
                <div ref={profileMenuRef} className="relative">
                  <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">
                    <UserIcon className="h-6 w-6" />
                    <span className="ml-1 hidden sm:inline font-medium">{user?.name}</span>
                  </button>
                  <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20 ${profileMenuOpen ? 'block' : 'hidden'} border border-gray-100 transition-opacity duration-300 ease-in-out`}>
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                      My Orders
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                      My Wishlist
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center">
                  <UserIcon className="h-6 w-6" />
                  <span className="ml-1 hidden sm:inline font-medium">Login</span>
                </Link>
              )}

              {/* Mobile menu button - moved to the end */}
              <button
                className="lg:hidden text-gray-700 hover:text-indigo-600 focus:outline-none cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>


          {/* Mobile Navigation - Full Screen Overlay */}
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Mobile Menu */}
              <nav className="fixed inset-0 top-0 left-0 w-full h-full bg-white z-50 lg:hidden overflow-y-auto">
                <div className="flex flex-col h-full">
                  {/* Header with close button */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-indigo-600 focus:outline-none cursor-pointer"
                      aria-label="Close menu"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Menu Content */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between mb-6">
                      <Link 
                        to="/wishlist" 
                        className="text-gray-700 cursor-pointer hover:text-indigo-600 flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <HeartIcon className="h-5 w-5 mr-2" />
                        <span>Wishlist</span>
                      </Link>
                    </div>

                    {/* Categories */}
                    <div className="mb-8">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Categories</h3>
                      <ul className="space-y-3">
                        {categories.map((category) => {
                          const isActive = location.pathname === category.path;
                          return (
                            <li key={category.name}>
                              <Link
                                to={category.path}
                                className={`block font-medium py-2 text-lg transition-colors duration-200 ${
                                  isActive 
                                    ? 'text-indigo-600' 
                                    : 'text-gray-700 hover:text-indigo-600'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {category.name}
                                {isActive && (
                                  <span className="ml-2 inline-block w-2 h-2 bg-indigo-600 rounded-full"></span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* User Section */}
                    <div className="border-t border-gray-200 pt-6">
                      {user ? (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">My Account</h3>
                          <Link 
                            to="/profile" 
                            className="block text-gray-700 hover:text-indigo-600 py-2 text-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            My Profile
                          </Link>
                          <Link 
                            to="/orders" 
                            className="block text-gray-700 hover:text-indigo-600 py-2 text-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            My Orders
                          </Link>
                          <Link 
                            to="/wishlist" 
                            className="block text-gray-700 hover:text-indigo-600 py-2 text-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            My Wishlist
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left text-gray-700 hover:text-indigo-600 py-2 text-lg"
                          >
                            Logout
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Account</h3>
                          <Link 
                            to="/login" 
                            className="block text-gray-700 hover:text-indigo-600 py-2 text-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Login
                          </Link>
                          <Link 
                            to="/register" 
                            className="block text-gray-700 hover:text-indigo-600 py-2 text-lg"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Register
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Help Section */}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Support</h3>
                      <Link 
                        to="/help" 
                        className="block text-gray-700 hover:text-indigo-600 py-2 text-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Help Center
                      </Link>
                      <Link 
                        to="/contact" 
                        className="block text-gray-700 hover:text-indigo-600 py-2 text-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;