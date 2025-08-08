import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    try {
      const res = await axios.get(`${baseUrl}/v1/cart/get-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCart(res?.data?.cart || []);
      setTotal(res?.data?.totalAmount || 0);
      setIsLoading(false);
    } catch (err) {
      toast.error('Failed to load cart data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getCart();
    }
  }, [token]);

  useEffect(() => {
    if (!isLoading && cart.length === 0) {
      toast.info('Cart is empty');
      navigate('/');
      return null;
    }
  }, [cart, navigate, isLoading]);

  const handleCheckout = async (formData) => {
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: cart.map(item => {

          return ({
            productId: item.product._id || item._id,
            quantity: item.quantity,
            size: item.selectedSize || item.size,
            price: item.product?.price || item.price
          })
        }),
        totalAmount: total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          addressType: formData.addressType,
        },
        selectedSize: cart.map(item => item.selectedSize || item.size).join(', '),
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
          items: cart,
          total,
          shippingAddress: formData,
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

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

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
                {cart.map(item => {
                  // Get the correct size property
                  const selectedSize = item.selectedSize || item.size;


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
                            ₹{((item.product?.price || item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
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
                })}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                <p>Subtotal</p>
                <p>₹{total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Total</p>
                <p>₹{total.toFixed(2)}</p>
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