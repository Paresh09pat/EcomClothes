import { Link } from 'react-router-dom';

const CartSummary = ({ cartItems }) => {
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate shipping (free for now)
  const shipping = 0;

  // Calculate total
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-sm font-medium text-gray-900">₹{subtotal.toFixed(2)}</p>
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">Shipping</p>
          <p className="text-sm font-medium text-gray-900">
            {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
          </p>
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-base font-medium text-gray-900">Order Total</p>
          <p className="text-base font-medium text-gray-900">₹{total.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <Link
          to="/checkout"
          className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={cartItems.length === 0}
        >
          Proceed to Checkout
        </Link>
      </div>
      
      <div className="mt-6">
        <Link
          to="/"
          className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center justify-center"
        >
          Continue Shopping
          <span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default CartSummary; 