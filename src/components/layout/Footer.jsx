import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">FashionStore</h3>
            <p className="text-gray-400 text-sm">
              Your one-stop destination for trendy and affordable fashion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/categories/men" className="hover:text-white">Men</Link></li>
              <li><Link to="/categories/women" className="hover:text-white">Women</Link></li>
              <li><Link to="/categories/kids" className="hover:text-white">Kids</Link></li>
              <li><Link to="/categories/accessories" className="hover:text-white">Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="#" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-white">FAQ</Link></li>
              <li><Link to="#" className="hover:text-white">Shipping & Returns</Link></li>
              <li><Link to="#" className="hover:text-white">Size Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for updates on new arrivals and special offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 text-gray-900 bg-white rounded-l-md focus:outline-none flex-1"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} FashionStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 