import { Link } from 'react-router-dom';

const OrderConfirmation = ({ order }) => {
  if (!order) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-medium">{order.id}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium">
              {new Date(order.date).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <h2 className="text-lg font-medium mb-4">Order Summary</h2>
        <div className="space-y-4 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Total</p>
            <p>${order.total.toFixed(2)}</p>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            You will receive a confirmation email with your order details shortly.
          </p>
        </div>
        
        <div className="mt-8">
          <Link to="/" className="btn bg-indigo-600 hover:bg-indigo-700 w-full text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 