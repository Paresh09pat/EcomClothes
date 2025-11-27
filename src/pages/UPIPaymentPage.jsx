import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { baseUrl } from '../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import { QrCodeIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const UPIPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  const { formData, cart, total } = location.state || {};

  // Redirect if no state data
  useEffect(() => {
    if (!location.state || !formData || !cart || !total) {
      navigate('/checkout');
    }
  }, [location.state, formData, cart, total, navigate]);

  // Fetch QR code from backend
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/v1/get-qr`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }

        });

        if (response.data.success) {
          console.log(response.data.qrImage.url);
          setQrCodeUrl(response?.data?.qrImage.url);
        } else {
          toast.error('Failed to generate QR code');
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
        if (error.response?.status === 401) {
          toast.error('Please login again to continue');
          navigate('/login');
        } else if (error.response?.status === 404) {
          // Backend endpoint not available, generate fallback QR code

          toast.info('Demo mode: Using placeholder QR code for testing');
        } else {
          toast.error('Failed to generate QR code. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && total > 0) {
      fetchQRCode();
    }
  }, [token, total, cart, navigate]);

  const handleConfirmOrder = async () => {
    if (!transactionId.trim()) {
      toast.error('Please enter the transaction ID');
      return;
    }



    if (transactionId.trim().length < 1) {
      toast.error('Please enter valid transaction ID.');
      return;
    }

    setLoading(true);
    try {
      // Create order with UPI payment method
      const orderData = {
        items: cart.map(item => ({
          productId: item.product._id || item._id,
          quantity: item.quantity || 1,
          size: item.selectedSize || item.size,
          price: item.product?.price || item.price
        })),
        txnId: transactionId.trim(),
        totalAmount: total,
        address: {
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.zipCode,
          country: 'India',
          type: formData.addressType || 'home'
        },
        selectedSize: cart.map(item => item.selectedSize || item.size).join(', '),
        paymentMethod: 'upi',
        transactionId: transactionId.trim(),
        paymentStatus: 'completed'
      };

      const orderResponse = await axios.post(`${baseUrl}/v1/orders/create`, orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (orderResponse?.data?.success) {
        setOrderId(orderResponse.data.order._id || `ORD-${Date.now()}`);
        setOrderConfirmed(true);
        toast.success('Order confirmed successfully!');

        // Redirect to order confirmation after 2 seconds
        setTimeout(() => {
          navigate('/order-confirmation', {
            state: {
              order: {
                id: orderResponse.data.order._id || `ORD-${Date.now()}`,
                items: cart,
                total,
                address: {
                  line1: formData.address,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.zipCode,
                  country: 'India',
                  type: formData.addressType || 'home'
                },
                date: new Date().toISOString(),
                orderNumber: orderResponse.data.order.orderNumber || `ORD-${Date.now()}`,
                paymentMethod: 'upi',
                transactionId: transactionId.trim()
              }
            }
          });
        }, 2000);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid order data');
      } else if (error.response?.status === 401) {
        toast.error('Please login again to continue');
        navigate('/login');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to confirm order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCheckout = () => {
    navigate('/checkout');
  };

  if (!location.state || !formData || !cart || !total) {
    return null;
  }

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">Your order has been successfully placed.</p>
          <p className="text-sm text-gray-500 mb-6">Redirecting to order confirmation...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <button
            onClick={handleBackToCheckout}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 cursor-pointer"
          >
            <ArrowLeftIcon className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
            Back to Checkout
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">UPI Payment</h1>
          <p className="text-gray-600 mt-2">Complete your payment using UPI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* QR Code Section */}
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <QrCodeIcon className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-blue-600" />
              Scan QR Code
            </h2>

            {loading ? (
              <div className="flex items-center justify-center h-48 lg:h-64">
                <div className="animate-spin rounded-full h-10 w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : qrCodeUrl ? (
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-3 lg:p-4 mb-4 inline-block">
                  <img
                    src={qrCodeUrl}
                    alt="UPI QR Code"
                    className="w-36 h-36 lg:w-48 lg:h-48 object-contain mx-auto"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9Ijk2IiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Amount: <span className="font-semibold">₹{total.toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Use any UPI app to scan this QR code
                </p>
                {qrCodeUrl.includes('data:image/svg+xml') && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-yellow-800">
                      After payment is done, please copy the transaction ID and paste it in the transaction ID field. After Successful order seller confirm your transaction ID and your order will be Processed within 1 hours.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center h-48 lg:h-64 flex items-center justify-center">
                <p className="text-gray-500">Failed to load QR code</p>
              </div>
            )}
          </div>

          {/* Transaction ID Section */}
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">
              Complete Payment
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID *
                </label>
                <input
                  type="text"
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter UPI transaction ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength="50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the transaction ID from your UPI app after successful payment
                </p>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={loading || !transactionId.trim() || transactionId.trim().length < 5}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? 'Confirming Order...' : 'Confirm Order'}
              </button>
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="text-gray-900">{cart.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-gray-900 font-semibold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-900">UPI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 lg:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-medium text-blue-900 mb-3">How to complete UPI payment:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
            <li>Scan the QR code above</li>
            <li>Enter the amount: ₹{total.toFixed(2)}</li>
            <li>Complete the payment</li>
            <li>Copy the transaction ID from the app</li>
            <li>Paste it in the field above and click "Confirm Order"</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentPage;
