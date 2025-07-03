import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  CalendarIcon, 
  ArrowPathIcon,
  ChevronRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch orders from an API
    // For now, we'll use localStorage as a simple example
    const fetchOrders = () => {
      setLoading(true);
      try {
        const savedOrder = localStorage.getItem('latestOrder');
        if (savedOrder) {
          // Create a few sample orders based on the latest order
          const latestOrder = JSON.parse(savedOrder);
          
          // Generate some sample past orders
          const sampleOrders = [
            latestOrder,
            {
              ...latestOrder,
              id: 'ORD-' + Math.floor(Math.random() * 10000),
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
              status: 'delivered'
            },
            {
              ...latestOrder,
              id: 'ORD-' + Math.floor(Math.random() * 10000),
              date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
              status: 'delivered'
            }
          ];
          
          setOrders(sampleOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
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
              const isReturnable = isWithinReturnPeriod(order.date);
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  {/* Order Header */}
                  <div className="bg-gray-50 p-4 border-b border-gray-100">
                    <div className="flex flex-wrap items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">ORDER PLACED</p>
                        <p className="font-medium">{formatDate(order.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">TOTAL</p>
                        <p className="font-medium">₹{order.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ORDER ID</p>
                        <p className="font-medium">{order.id}</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        {order.status === 'processing' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Processing
                          </span>
                        ) : order.status === 'shipped' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Shipped
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Delivered
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center py-2 border-b border-gray-100 last:border-0">
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 ml-0 sm:ml-4 mt-2 sm:mt-0">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                            {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                            {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
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
                        {order.status === 'delivered' ? 'Delivered on ' : 'Expected delivery by '}
                        <span className="font-medium">{formatDate(new Date(new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000))}</span>
                      </span>
                    </div>
                    <div className="mt-2 sm:mt-0 flex space-x-3">
                      <Link 
                        to={`#`} 
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                      >
                        View Details
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </Link>
                      
                      {isReturnable && order.status === 'delivered' && (
                        <button 
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                          onClick={() => alert('Return process initiated. Please check your email for return instructions.')}
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