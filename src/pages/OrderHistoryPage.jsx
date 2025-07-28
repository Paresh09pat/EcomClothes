import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { baseUrl } from '../utils/constant';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  CalendarIcon, 
  ArrowPathIcon,
  ChevronRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const OrderHistoryPage = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${baseUrl}/v1/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log("Orders fetched:", response.data);
        
        if (response.data.orders && response.data.orders.length > 0) {
          setOrders(response.data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [token]);
  
  // Function to check if an order is within the return period (7 days)
  const isWithinReturnPeriod = (orderDate) => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const daysDifference = (currentTime - orderTime) / (1000 * 60 * 60 * 24);
    return daysDifference <= 7;
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to handle return order
  const handleReturnOrder = (orderId) => {
    alert(`Return process initiated for order #${orderId.slice(-8).toUpperCase()}. Please check your email for return instructions.`);
  };
  
  if (!user) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Order History</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-500 mb-6">Please log in to view your order history</p>
            <Link to="/login" className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-gray-600 mt-1">View and manage your order history</p>
          </div>
          <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </div>
        
        {/* Return Policy Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ArrowPathIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">7-Day Return Policy</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>All products can be returned within 7 days of delivery for a full refund. The product must be unused and in its original packaging.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-red-800 font-semibold mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
            <Link to="/" className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isReturnable = isWithinReturnPeriod(order.createdAt);
              const orderDate = new Date(order.createdAt);
              const estimatedDelivery = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);
              
              return (
                <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  {/* Order Header */}
                  <div className="bg-gray-50 p-4 border-b border-gray-100">
                    <div className="flex flex-wrap items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">ORDER PLACED</p>
                        <p className="font-medium">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">TOTAL</p>
                        <p className="font-medium">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ORDER ID</p>
                        <p className="font-medium">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">PAYMENT</p>
                        <p className="font-medium capitalize">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100 last:border-0">
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={item.product.images  && item.product.images.length > 0 
                                ? item.product.images[0]
                                : '/placeholder-image.jpg'
                              } 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-1 ml-0 sm:ml-4 mt-2 sm:mt-0">
                            <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-500">Category: {item.product.category}</p>
                            {item.product.description && (
                              <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                                {item.product.description.length > 40 
                                  ? `${item.product.description.substring(0, 40)}...` 
                                  : item.product.description
                                }
                              </p>
                            )}
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <p className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Order Actions */}
                  <div className="bg-gray-50 p-4 flex flex-wrap items-center justify-between border-t border-gray-100">
                    <div className="flex items-center">
                      <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm">
                        {order.status.toLowerCase() === 'delivered' ? 'Delivered on ' : 'Expected delivery by '}
                        <span className="font-medium">{formatDate(estimatedDelivery)}</span>
                      </span>
                    </div>
                    <div className="mt-2 sm:mt-0 flex space-x-3">
                      <Link 
                        to={`/order-confirmation`} 
                        state={{ orderId: order._id }}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                      >
                        View Details
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </Link>
                      
                      {isReturnable && order.status.toLowerCase() === 'delivered' && (
                        <button 
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                          onClick={() => handleReturnOrder(order._id)}
                        >
                          Return Order
                          <ArrowPathIcon className="h-4 w-4 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;