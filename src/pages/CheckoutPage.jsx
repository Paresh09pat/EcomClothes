import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CheckoutForm from '../components/cart/CheckoutForm';

const CheckoutPage = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Redirect to cart if cart is empty
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handleCheckout = (formData) => {
    setLoading(true);
    
    // In a real app, you would send this data to your API
    // For demo purposes, we'll simulate a successful checkout
    setTimeout(() => {
      // Save order details to localStorage for the confirmation page
      const order = {
        id: `ORD-${Date.now()}`,
        items: cart,
        total,
        shippingAddress: formData,
        date: new Date().toISOString(),
      };
      localStorage.setItem('latestOrder', JSON.stringify(order));
      
      // Clear cart and redirect to confirmation page
      clearCart();
      navigate('/order-confirmation');
    }, 1500);
  };
  
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm 
            onSubmit={handleCheckout} 
            loading={loading} 
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
                {cart.map(item => (
                  <li key={item.id} className="py-4 flex">
                    <div className="flex-shrink-0 w-16 h-16">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center rounded"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                <p>Subtotal</p>
                <p>${total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
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