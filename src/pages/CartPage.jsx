import { Link } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import { baseUrl } from '../utils/constant';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useEffect, useState } from 'react';


const CartPage = () => {

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isRemoved, setIsRemoved, isAuthenticated } = useAuth()


  const getCart = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/cart/get-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Filter out invalid cart items and calculate total
      const cartItems = res?.data?.cart || [];
      
      const validCartItems = cartItems.filter(item => 
        item && 
        item.product && 
        item.product._id && 
        item.product.name && 
        item.product.price && 
        item.product.price > 0
      );
      
      // Calculate total from valid items
      const calculatedTotal = validCartItems.reduce((sum, item) => {
        const price = item.product?.price || 0;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
      }, 0);
      
      setCart(validCartItems);
      setTotal(calculatedTotal);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCart([]);
      setTotal(0);
    }
    finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    getCart();
  }, [token]); // Only depend on token, not isRemoved

  // Listen for cart refresh events
  useEffect(() => {
    const handleCartRefresh = () => {
      getCart();
    };

    window.addEventListener('cart-refresh', handleCartRefresh);
    return () => window.removeEventListener('cart-refresh', handleCartRefresh);
  }, []);






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

  if (!cart || cart.length === 0) {
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
      {cart && cart.length > 0 && (
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
        </div>
      )}

      {cart && cart.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h2 className="text-lg font-medium">Items in Cart</h2>
                </div>


                <div className="space-y-4">
                  {cart.map(item => (
                    <CartItem key={`${item._id || item.product._id}-${item.selectedSize || 'no-size'}`} item={item} />
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
                    <span>₹{total || 0}</span>
                  </div>

                </div>

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span>₹{(total || 0).toFixed(2)}</span>
                </div>

                {cart && cart.length > 0 && total > 0 && isAuthenticated ? (
                  <Link
                    to="/checkout"
                    className="w-full btn bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md text-center block transition-colors"

                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full btn bg-gray-400 cursor-not-allowed text-white py-3 px-4 rounded-md text-center block"
                  >
                    {!isAuthenticated ? 'Please Login' : cart.length === 0 ? 'Cart is Empty' : 'No Items to Checkout'}
                  </button>
                )}

                <Link
                  to="/"
                  className="w-full mt-4 btn border border-gray-300 text-black py-3 px-4 rounded-md text-center block bg-white"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;