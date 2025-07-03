import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderConfirmation from '../components/cart/OrderConfirmation';

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get order details from localStorage
    const savedOrder = localStorage.getItem('latestOrder');
    
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      // If no order found, redirect to home
      navigate('/');
    }
  }, [navigate]);
  
  if (!order) {
    return (
      <div className="container py-12 text-center">
        <p>Loading order details...</p>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <OrderConfirmation order={order} />
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 