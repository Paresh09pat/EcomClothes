import { Link } from 'react-router-dom';
import { CheckCircleIcon, TruckIcon, CalendarIcon, ClockIcon, ShoppingBagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

const OrderConfirmation = ({ order }) => {
  if (!order) return null;
  
  // Calculate estimated delivery date (5 days from order date)
  const orderDate = new Date(order.date);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
      {/* Top success banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
        <div className="flex items-center justify-center">
          <CheckCircleIcon className="h-12 w-12 mr-4" />
          <div>
            <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
            <p className="text-white/80 mt-1">
              Thank you for your purchase. Your order has been received and is being processed.
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
                <p className="font-bold text-gray-900">{order.id}</p>
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
                  {deliveryDate.toLocaleDateString('en-US', { 
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
            
            <div className="relative flex items-start mb-6">
              <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center z-10">
                <CheckBadgeIcon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-900">Order Confirmed</h3>
                <p className="text-sm text-gray-500">{orderDate.toLocaleTimeString()} - {orderDate.toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="relative flex items-start mb-6">
              <div className="h-7 w-7 rounded-full bg-gray-300 flex items-center justify-center z-10">
                <ClockIcon className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-500">Processing</h3>
                <p className="text-sm text-gray-500">Your order is being processed</p>
              </div>
            </div>
            
            <div className="relative flex items-start">
              <div className="h-7 w-7 rounded-full bg-gray-300 flex items-center justify-center z-10">
                <TruckIcon className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-500">Out for Delivery</h3>
                <p className="text-sm text-gray-500">Estimated delivery by {deliveryDate.toLocaleDateString()}</p>
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
              <div key={item.id} className="flex items-center p-4 hover:bg-gray-50">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                  {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                  {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-xs text-green-600 mt-1">Delivery by {deliveryDate.toLocaleDateString()}</p>
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
              <span className="text-gray-600">Price ({order.items.length} items)</span>
              <span>₹{(order.total * 1.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">- ₹{(order.total * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Charges</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 mt-2">
              <span>Total Amount</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
            <div className="pt-2 text-green-600 text-sm font-medium">
              <p>You saved ₹{(order.total * 0.05).toFixed(2)} on this order</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="text-base font-bold mb-3">DELIVERY ADDRESS</h3>
          <div className="text-sm">
            <p className="font-medium">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
            <p className="text-gray-600 mt-1">{order.shippingAddress?.address}</p>
            <p className="text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
            <p className="text-gray-600 mt-1">Phone: {order.shippingAddress?.phone}</p>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-8">
          You will receive a confirmation email with your order details shortly at <span className="font-medium">{order.shippingAddress?.email}</span>.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link to="/" className="flex-1 flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300">
            Continue Shopping
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
          <Link to="/account/orders" className="flex-1 flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;