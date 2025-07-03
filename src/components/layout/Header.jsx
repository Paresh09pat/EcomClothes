import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const categories = [
    { name: 'Men', path: '/categories/men' },
    { name: 'Women', path: '/categories/women' },
    { name: 'Kids', path: '/categories/kids' },
    { name: 'Accessories', path: '/categories/accessories' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            FashionStore
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {categories.map((category) => (
              <Link 
                key={category.name}
                to={category.path}
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          {/* User and Cart */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Link to="/cart" className="text-gray-600 hover:text-indigo-600">
                <ShoppingBagIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center text-gray-600 hover:text-indigo-600">
                  <UserIcon className="h-6 w-6" />
                  <span className="ml-1 hidden sm:inline">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 flex items-center">
                <UserIcon className="h-6 w-6" />
                <span className="ml-1 hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="mt-4 py-3 border-t border-gray-200 md:hidden">
            <ul className="flex flex-col space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.path}
                    className="text-gray-600 hover:text-indigo-600 block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 