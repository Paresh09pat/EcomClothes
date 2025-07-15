import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/cart/CartItem';

const CartPage = () => {
  const { cart, total, clearCart, isLoading } = useCart();
  
  // Show loading state while cart is being loaded from localStorage
  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }
  
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-lg font-medium">Items in Cart</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="space-y-4">
                {cart.map(item => (
                  <CartItem key={`${item.id || item._id}-${item.selectedSize || 'no-size'}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md sticky top-6">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{(total * 0.18).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>₹{(total * 1.18).toFixed(2)}</span>
              </div>
              
              <Link
                to="/checkout"
                className="w-full btn bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md text-center block"
              >
                Proceed to Checkout
              </Link>
              
              <Link
                to="/"
                className="w-full mt-4 btn border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-md text-center block"
              >
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