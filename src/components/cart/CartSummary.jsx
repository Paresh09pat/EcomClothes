import { Link } from 'react-router-dom';
import { ShieldCheckIcon, TruckIcon, ArrowPathIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const CartSummary = ({ cartItems }) => {
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0); 

  // Calculate shipping (free for now)
  const shipping = 0;

  // Calculate discount (sample calculation)
  const discount = subtotal * 0.05; // 5% discount

  // Calculate total
  const total = subtotal + shipping - discount;

  // Calculate savings
  const savings = discount;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 flex items-center">
        <span className="w-1.5 h-6 bg-blue-500 rounded-sm mr-2"></span>
        PRICE DETAILS
      </h2>
      
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Price ({cartItems.length} items)</p>
          <p className="text-sm font-medium text-gray-900">₹{subtotal.toFixed(2)}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Discount</p>
          <p className="text-sm font-medium text-green-600">- ₹{discount.toFixed(2)}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Delivery Charges</p>
          <p className="text-sm font-medium text-green-600">
            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
          </p>
        </div>
        
        <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4 mt-4">
          <p className="text-base font-bold text-gray-900">Total Amount</p>
          <p className="text-base font-bold text-gray-900">₹{total.toFixed(2)}</p>
        </div>
        
        <div className="flex items-center text-green-600 font-medium text-sm border-t border-dashed border-gray-200 pt-3">
          <p>You will save ₹{savings.toFixed(2)} on this order</p>
        </div>
      </div>
      
      <div className="mt-6">
        <Link
          to="/checkout"
          className={`w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 ${
            cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={cartItems.length === 0}
        >
          PROCEED TO CHECKOUT
        </Link>
      </div>
      
      <div className="mt-6">
        <Link
          to="/"
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center font-medium"
        >
          Continue Shopping
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="mt-8 space-y-3">
        <div className="flex items-start">
          <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">Safe and Secure Payments. 100% Authentic products.</p>
        </div>
        <div className="flex items-start">
          <TruckIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">Free delivery for orders above ₹499</p>
        </div>
        <div className="flex items-start">
          <ArrowPathIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">Easy 7 days returns and exchanges</p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;