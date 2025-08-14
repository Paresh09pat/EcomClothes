import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CheckoutForm from '../components/cart/CheckoutForm';
import { baseUrl } from '../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  
  // Fetch cart data from API
  const getCart = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
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
        item.product.name !== 'Product Name' &&
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
      toast.error('Failed to load cart data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getCart();
    }
  }, [token]);



  const handleCheckout = async (formData) => {
    setLoading(true);

    try {
      // Prepare order data with only valid items
      const validOrderItems = cart.filter(item => 
        item?.product?.name && 
        item?.product?.price && 
        item.product.price > 0
      );
      
      if (validOrderItems.length === 0) {
        toast.error('No valid items in cart to checkout');
        return;
      }
      
      const orderData = {
        items: validOrderItems.map(item => ({
          productId: item.product._id || item._id,
          quantity: item.quantity || 1,
          size: item.selectedSize || item.size,
          price: item.product?.price || item.price
        })),
        totalAmount: total,
        address: {
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.zipCode,
          country: 'India'
        },
        selectedSize: validOrderItems.map(item => item.selectedSize || item.size).join(', '),
        paymentMethod: formData.paymentMethod
      };



      // Create order via API
      const orderResponse = await axios.post(`${baseUrl}/v1/orders/create`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


      if (orderResponse?.data?.success) {
        const order = {
          id: orderResponse.data.order._id || `ORD-${Date.now()}`,
          items: validOrderItems, // Use only valid items
          total,
          address: {
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.zipCode,
            country: 'India'
          },
          date: new Date().toISOString(),
          orderNumber: orderResponse.data.order.orderNumber || `ORD-${Date.now()}`
        };




        toast.success('Order placed successfully!');
        navigate('/order-confirmation');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {

      // Handle specific error cases
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid order data');
      } else if (error.response?.status === 401) {
        toast.error('Please login again to continue');
        navigate('/login');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart message if no items
  if (!isLoading && cart.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-500 mb-6">Your cart is empty. Please add items to proceed with checkout.</p>
            <Link to="/" className="btn bg-indigo-600 hover:bg-indigo-700 text-white mr-4">
              Continue Shopping
            </Link>
            <Link to="/cart" className="btn border border-gray-300 text-gray-700 hover:bg-gray-50">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Warning for invalid items */}
      {cart.some(item => 
        !item?.product?.price || 
        item.product.price <= 0 || 
        !item?.product?.name || 
        item.product.name === 'Product Name'
      ) && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-orange-800 text-sm">
              ⚠️ Some items in your cart have incomplete information and cannot be checked out. 
              Please return to your cart to remove invalid items.
            </p>
            <Link 
              to="/cart" 
              className="ml-4 px-4 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm
            onSubmit={handleCheckout}
            loading={loading}
            cart={cart}
            total={total}
            initialValues={{
              firstName: user?.name?.split(' ')[0] || '',
              lastName: user?.name?.split(' ')[1] || '',
              email: user?.email || '',
            }}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

            <div className="flow-root mb-6">
              <ul className="divide-y divide-gray-200">
                {cart.length > 0 ? (
                  cart.map(item => {
                    // Get the correct size property
                    const selectedSize = item.selectedSize || item.size;
                    
                    // Safety check for item data
                    if (!item?.product?.name || !item?.product?.price || item.product.price <= 0) {
                      return null; // Skip invalid items
                    }

                    return (
                      <li key={`${item._id || item.product._id}-${selectedSize || 'no-size'}`} className="py-4 flex">
                        <div className="flex-shrink-0 w-16 h-16">
                          <img
                            src={item.product?.imageUrls?.[0] || item.product?.images?.[0] || item.image || '/cloth1.png'}
                            alt={item.product?.name || item.name}
                            className="w-full h-full object-cover object-center rounded"
                            onError={(e) => {
                              e.target.src = '/cloth1.png';
                            }}
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.product?.name || item.name}
                            </h3>
                            <p className="text-sm font-medium text-gray-900">
                              ₹{((item.product?.price || item.price) * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity || 1}
                            </p>
                            {selectedSize && (
                              <div className="flex items-center">
                                <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                  Size: {selectedSize}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  }).filter(Boolean) // Remove null items
                ) : (
                  <li className="py-4 text-center text-gray-500">
                    No valid items in cart
                  </li>
                )}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                <p>Subtotal</p>
                <p>₹{(total || 0).toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Total</p>
                <p>₹{(total || 0).toFixed(2)}</p>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                * Cash on Delivery is the only payment method available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;