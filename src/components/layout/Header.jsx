import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import {
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, wishlist } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  // Handle scroll effect
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

  const categories = [
    { name: 'Men', path: '/categories/Men' },
    { name: 'Women', path: '/categories/Women' },
    { name: 'Kids', path: '/categories/Kids' },
    { name: 'Accessories', path: '/categories/Accessories' },
    { name: 'New Arrivals', path: '#' },
    { name: 'Sale', path: '#' }
  ];


 

  return (
    <>
      {/* Top Bar */}
      <div className="bg-indigo-600 text-white py-2 text-sm hidden md:block">
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            <PhoneIcon className="h-4 w-4 mr-1" />
            <span>+1 (555) 123-4567</span>
            <span className="mx-3">|</span>
            <span>Free shipping on orders over ₹5,000</span>
          </div>
          <div className="flex space-x-4">
            <Link to="#" className="hover:text-indigo-200 transition-colors">Track Order</Link>
            <Link to="#" className="hover:text-indigo-200 transition-colors">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`bg-white sticky top-0 z-50 ${scrolled ? 'shadow-md' : ''} transition-shadow duration-300`}>
        <div className="container py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">FashionStore</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="text-gray-700 hover:text-indigo-600 font-medium relative group py-2"
                >
                  {category.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-700 hover:text-indigo-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* User, Wishlist, Search and Cart */}
            <div className="flex items-center space-x-5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-700 hover:text-indigo-600 transition-colors hidden md:block"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="text-gray-700 hover:text-indigo-600 transition-colors relative hidden md:block"
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
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* User Account */}
              {user ? (
                <div ref={profileMenuRef} className="relative">
                  <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
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
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
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
            </div>
          </div>

          {/* Search Bar - Conditional */}
          {searchOpen && (
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="mt-4 py-4 border-t border-gray-200 lg:hidden">
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-gray-700 hover:text-indigo-600 flex items-center"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
                  <span>Search</span>
                </button>
                <Link to="/wishlist" className="text-gray-700 hover:text-indigo-600 flex items-center">
                  <HeartIcon className="h-5 w-5 mr-1" />
                  <span>Wishlist</span>
                </Link>
              </div>

              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.name}>
                    <Link
                      to={category.path}
                      className="text-gray-700 hover:text-indigo-600 block font-medium py-1"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <Link to="/profile" className="block text-gray-700 hover:text-indigo-600">My Profile</Link>
                    <Link to="/orders" className="block text-gray-700 hover:text-indigo-600">My Orders</Link>
                    <Link to="/wishlist" className="block text-gray-700 hover:text-indigo-600">My Wishlist</Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left text-gray-700 hover:text-indigo-600 py-1"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" className="block text-gray-700 hover:text-indigo-600">Login</Link>
                    <Link to="/register" className="block text-gray-700 hover:text-indigo-600">Register</Link>
                  </div>
                )}
                <div className="mt-4">
                  <Link to="/help" className="block text-gray-700 hover:text-indigo-600 mb-3">
                    Help Center
                  </Link>
                  <Link to="/contact" className="block text-gray-700 hover:text-indigo-600">
                    Contact Us
                  </Link>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;