import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircleIcon,
  TruckIcon,
  CalendarIcon,
  ClockIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { baseUrl } from '../../utils/constant';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const OrderConfirmation = ({ order: initialOrder, onOrderUpdate, getOrders }) => {
  const [cancelling, setCancelling] = useState(false);
  const [localOrder, setLocalOrder] = useState(initialOrder);
  const { token } = useAuth();

  // Use localOrder if available, otherwise use initialOrder
  const order = localOrder || initialOrder;

  // Update localOrder when initialOrder changes
  useEffect(() => {
    if (initialOrder) {
      setLocalOrder(initialOrder);
    }
  }, [initialOrder]);

  if (!order) return null;

  // Calculate estimated delivery date (5 days from order date)
  const orderDate = new Date(order.createdAt);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  // Helper function to normalize status for comparison
  const normalizeStatus = (status) => {
    return status?.toLowerCase().replace(/\s+/g, ' ');
  };

  // Helper function to check if status matches any of the given statuses
  const isStatusIn = (currentStatus, statusArray) => {
    const normalized = normalizeStatus(currentStatus);
    return statusArray.some(status => normalizeStatus(status) === normalized);
  };

  // Function to get product image with proper fallback
  const getProductImage = (item) => {
    if (item.product) {
      // Check for images field first (Cloudinary objects with url property)
      if (item.product.images && item.product.images.length > 0) {
        return typeof item.product.images[0] === 'object' && item.product.images[0].url
          ? item.product.images[0].url
          : item.product.images[0];
      }
      // Check for imageUrls field as fallback
      if (item.product.imageUrls && item.product.imageUrls.length > 0) {
        return item.product.imageUrls[0];
      }
    }
    // Return a proper fallback image
    return '/cloth1.png'; // Using the existing image in public folder
  };

  // Function to get status color and icon
  const getStatusInfo = (status) => {
    const normalizedStatus = normalizeStatus(status);
    switch (normalizedStatus) {
      case 'pending':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-800',
          bgColor: 'bg-yellow-100',
          icon: ClockIcon,
          label: 'Pending',
          description: 'Your order is pending confirmation'
        };
      case 'processing':
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-800',
          bgColor: 'bg-blue-100',
          icon: ClockIcon,
          label: 'Processing',
          description: 'Your order is being processed'
        };
      case 'shipped':
        return {
          color: 'bg-indigo-500',
          textColor: 'text-indigo-800',
          bgColor: 'bg-indigo-100',
          icon: TruckIcon,
          label: 'Shipped',
          description: 'Your order has been shipped'
        };
      case 'out for delivery':
      case 'out of delivery':
        return {
          color: 'bg-purple-500',
          textColor: 'text-purple-800',
          bgColor: 'bg-purple-100',
          icon: TruckIcon,
          label: 'Out for Delivery',
          description: 'Your order is out for delivery'
        };
      case 'delivered':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-800',
          bgColor: 'bg-green-100',
          icon: CheckCircleIcon,
          label: 'Delivered',
          description: 'Your order has been delivered'
        };
      case 'cancelled':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-800',
          bgColor: 'bg-red-100',
          icon: XCircleIcon,
          label: 'Cancelled',
          description: 'Your order has been cancelled'
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-800',
          bgColor: 'bg-gray-100',
          icon: ClockIcon,
          label: status || 'Unknown',
          description: 'Order status unknown'
        };
    }
  };

  // Function to check if order can be cancelled
  const canCancelOrder = () => {
    const status = order.status?.toLowerCase();
    return (status === 'pending' || status === 'processing') && !cancelling;
  };

  // Function to cancel order
  const handleCancelOrder = async () => {
    if (!canCancelOrder()) {
      toast.error('This order cannot be cancelled at this stage.');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      setCancelling(true);
        const response = await axios.put(
        `${baseUrl}/v1/orders/${order._id}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (response.data.success) {
        const updatedOrder = { ...order, status: 'cancelled' };
        setLocalOrder(updatedOrder);

        if (onOrderUpdate) {
          onOrderUpdate(updatedOrder);
        }

        toast.success('Order cancelled successfully!');
        // Refresh the order data with the current order ID
        if (getOrders && order._id) {
          getOrders(order._id);
        }
      } else {
        toast.error(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      let errorMessage = 'Failed to cancel order. Please try again.';

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  // Get current status info
  const currentStatus = getStatusInfo(order.status);
  const StatusIcon = currentStatus.icon;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
      {/* Back button */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link 
            to="/orders" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
          <div className="text-sm text-gray-500">
            Order #{order._id.slice(-8).toUpperCase()}
          </div>
        </div>
      </div>
      
      {/* Top banner - different colors based on status */}
      <div className={`${order.status?.toLowerCase() === 'cancelled'
          ? 'bg-gradient-to-r from-red-500 to-red-600'
          : order.status?.toLowerCase() === 'delivered'
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
        } text-white p-6`}>
        <div className="flex items-center justify-center">
          {order.status?.toLowerCase() === 'cancelled' ? (
            <XCircleIcon className="h-12 w-12 mr-4" />
          ) : (
            <CheckCircleIcon className="h-12 w-12 mr-4" />
          )}
          <div>
            <h1 className="text-3xl font-bold">
              {order.status?.toLowerCase() === 'cancelled'
                ? 'Order Cancelled'
                : order.status?.toLowerCase() === 'delivered'
                  ? 'Order Delivered!'
                  : 'Order Placed Successfully!'}
            </h1>
            <p className="text-white/80 mt-1">
              {order.status?.toLowerCase() === 'cancelled'
                ? 'Your order has been cancelled successfully.'
                : order.status?.toLowerCase() === 'delivered'
                  ? 'Thank you for your purchase. Your order has been delivered.'
                  : 'Thank you for your purchase. Your order has been received and is being processed.'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Order details card */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-bold text-gray-900">
                  {orderDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <TruckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-bold text-gray-900">
                  {order.status?.toLowerCase() === 'delivered'
                    ? 'Delivered'
                    : order.status?.toLowerCase() === 'cancelled'
                      ? 'Cancelled'
                      : deliveryDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order status timeline */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <span className="w-1.5 h-6 bg-blue-500 rounded-sm mr-2"></span>
            ORDER STATUS
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-3.5 top-0 h-full w-0.5 bg-gray-200"></div>

            {/* Order Confirmed - Always completed */}
            <div className="relative flex items-start mb-6">
              <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center z-10">
                <CheckBadgeIcon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-900">Order Confirmed</h3>
                <p className="text-sm text-gray-500">{orderDate.toLocaleTimeString()} - {orderDate.toLocaleDateString()}</p>
              </div>
            </div>

            {/* Processing */}
            <div className="relative flex items-start mb-6">
              <div className={`h-7 w-7 rounded-full ${isStatusIn(order.status, ['processing', 'shipped', 'out for delivery', 'out of delivery', 'delivered'])
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
                } flex items-center justify-center z-10`}>
                <ClockIcon className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4">
                <h3 className={`text-base font-medium ${isStatusIn(order.status, ['processing', 'shipped', 'out for delivery', 'out of delivery', 'delivered'])
                    ? 'text-gray-900'
                    : 'text-gray-500'
                  }`}>
                  Processing
                </h3>
                <p className="text-sm text-gray-500">
                  {isStatusIn(order.status, ['processing', 'shipped', 'out for delivery', 'out of delivery', 'delivered'])
                    ? 'Your order is currently being processed'
                    : 'Your order will be processed soon'}
                </p>
              </div>
            </div>

            {/* Shipped */}
            <div className="relative flex items-start mb-6">
              <div className={`h-7 w-7 rounded-full ${isStatusIn(order.status, ['shipped', 'out for delivery', 'out of delivery', 'delivered'])
                  ? 'bg-indigo-500'
                  : 'bg-gray-300'
                } flex items-center justify-center z-10`}>
                <TruckIcon className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4">
                <h3 className={`text-base font-medium ${isStatusIn(order.status, ['shipped', 'out for delivery', 'out of delivery', 'delivered'])
                    ? 'text-gray-900'
                    : 'text-gray-500'
                  }`}>
                  Shipped
                </h3>
                <p className="text-sm text-gray-500">
                  {isStatusIn(order.status, ['shipped', 'out for delivery', 'out of delivery', 'delivered'])
                    ? 'Your order has been shipped'
                    : 'Your order will be shipped soon'}
                </p>
              </div>
            </div>

            {/* Out for Delivery */}
            <div className="relative flex items-start mb-6">
              <div className={`h-7 w-7 rounded-full ${isStatusIn(order.status, ['out for delivery', 'out of delivery', 'delivered'])
                  ? 'bg-purple-500'
                  : 'bg-gray-300'
                } flex items-center justify-center z-10`}>
                <TruckIcon className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4">
                <h3 className={`text-base font-medium ${isStatusIn(order.status, ['out for delivery', 'out of delivery', 'delivered'])
                    ? 'text-gray-900'
                    : 'text-gray-500'
                  }`}>
                  Out for Delivery
                </h3>
                <p className="text-sm text-gray-500">
                  {isStatusIn(order.status, ['out for delivery', 'out of delivery', 'delivered'])
                    ? 'Your order is out for delivery'
                    : 'Your order will be out for delivery soon'}
                </p>
              </div>
            </div>

            {/* Delivered */}
            <div className="relative flex items-start">
              <div className={`h-7 w-7 rounded-full ${order.status?.toLowerCase() === 'delivered'
                  ? 'bg-green-500'
                  : 'bg-gray-300'
                } flex items-center justify-center z-10`}>
                <CheckCircleIcon className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4">
                <h3 className={`text-base font-medium ${order.status?.toLowerCase() === 'delivered'
                    ? 'text-gray-900'
                    : 'text-gray-500'
                  }`}>
                  Delivered
                </h3>
                <p className="text-sm text-gray-500">
                  {order.status?.toLowerCase() === 'delivered'
                    ? 'Your order has been delivered successfully'
                    : 'Estimated delivery by ' + deliveryDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order items */}
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <span className="w-1.5 h-6 bg-blue-500 rounded-sm mr-2"></span>
          ORDER DETAILS
        </h2>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center p-4 hover:bg-gray-50">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={getProductImage(item)}
                    alt={item.product ? item.product.name : 'Product'}
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      e.target.src = '/cloth1.png';
                    }}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{item.product ? item.product.name : 'Product Name Not Available'}</h3>
                  <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Size: {order.selectedSize || 'N/A'}</p>
                  <p className="text-xs text-gray-500">Category: {item.product ? item.product.category : 'N/A'}</p>
                  {item.product && item.product.description && (
                    <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                      {item.product.description.length > 50
                        ? `${item.product.description.substring(0, 50)}...`
                        : item.product.description
                      }
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₹{((item.product ? item.product.price : 0) * item.quantity).toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {order.status?.toLowerCase() === 'delivered'
                      ? 'Delivered'
                      : order.status?.toLowerCase() === 'cancelled'
                        ? 'Cancelled'
                        : `Delivery by ${deliveryDate.toLocaleDateString()}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="text-base font-bold mb-3">PRICE DETAILS</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price ({order.items.length} item{order.items.length > 1 ? 's' : ''})</span>
              <span>₹{Math.round(order.totalAmount * 1.05).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">- ₹{Math.round(order.totalAmount * 0.05).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Charges</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 mt-2">
              <span>Total Amount</span>
              <span>₹{order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="pt-2 text-green-600 text-sm font-medium">
              <p>You saved ₹{Math.round(order.totalAmount * 0.05).toLocaleString()} on this order</p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="text-base font-bold mb-3">PAYMENT METHOD</h3>
          <div className="text-sm">
            <p className="font-medium capitalize">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod}
            </p>
            {order.paymentMethod === 'cod' && (
              <p className="text-gray-600 mt-1">Pay when your order is delivered</p>
            )}
          </div>
        </div>

        {/* Order Status */}
        <div className={`${currentStatus.bgColor} rounded-lg p-4 mb-6 border border-gray-200`}>
          <h3 className="text-base font-bold mb-2">CURRENT STATUS</h3>
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.bgColor} ${currentStatus.textColor}`}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {currentStatus.label}
            </div>
            {canCancelOrder() && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="inline-flex cursor-pointer items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {cancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Cancel Order
                  </>
                )}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">{currentStatus.description}</p>
        </div>

        <p className="text-gray-500 text-sm mb-8">
          You will receive updates about your order status via email and SMS.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link to="/" className="flex-1 flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300">
            Continue Shopping
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
          <Link to="/orders" className="flex-1 flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;