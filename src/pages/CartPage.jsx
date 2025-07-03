import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/cart/CartItem';

const CartPage = () => {
  const { cart, total, clearCart } = useCart();
  
  if (cart.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <Link to="/" className="btn bg-indigo-600 hover:bg-indigo-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {cart.map(item => (
                    <li key={item.id} className="py-6">
                      <CartItem item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="flow-root">
              <dl className="text-sm">
                <div className="py-2 flex items-center justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">₹{total.toFixed(2)}</dd>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <dt className="text-gray-600">Shipping</dt>
                  <dd className="font-medium text-gray-900">Free</dd>
                </div>
                <div className="py-2 flex items-center justify-between border-t border-gray-200">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-gray-900">₹{total.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
            
            <div className="mt-6">
              <Link
                to="/checkout"
                className="w-full btn bg-indigo-600 hover:bg-indigo-700 text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-500">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;