import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderConfirmation from '../components/cart/OrderConfirmation';
import axios from 'axios';
import { baseUrl } from '../utils/constant';
import { useAuth } from "../contexts/AuthContext";

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/v1/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Changed from multipart/form-data to application/json
        }
      });
      
      
      // Get the most recent order (first in the array since they seem to be sorted by creation date desc)
      if (response.data.orders && response.data.orders.length > 0) {
        const latestOrder = response.data.orders[0];
        setOrder(latestOrder);
      } else {
        setError('No orders found');
        // Redirect to home if no orders found
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
        
      setError('Failed to load order details');
      // Redirect to home on error
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getOrders();
    } else {
      // Redirect to login if no token
      navigate('/login');
    }
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-gray-600">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-12 text-center">
        <p>No order details available.</p>
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