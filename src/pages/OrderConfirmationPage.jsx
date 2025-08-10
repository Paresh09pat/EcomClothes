import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const orderId = location.state?.orderId;

  const getOrder = async (id) => {
    try {
      setLoading(true);
      
      // First try to get the specific order
      try {
        const response = await axios.get(`${baseUrl}/v1/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success && response.data.order) {
          setOrder(response.data.order);
          return;
        }
      } catch (specificOrderError) {
        console.log('Specific order endpoint not available, falling back to all orders');
      }
      
      // Fallback: fetch all orders and find the specific one
      const response = await axios.get(`${baseUrl}/v1/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.orders && response.data.orders.length > 0) {
        const foundOrder = response.data.orders.find(o => o._id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Order not found');
          setTimeout(() => navigate('/orders'), 2000);
        }
      } else {
        setError('No orders found');
        setTimeout(() => navigate('/orders'), 2000);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
      setTimeout(() => navigate('/orders'), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle order updates (e.g., when order is cancelled)
  const handleOrderUpdate = (updatedOrder) => {
    setOrder(updatedOrder);
    // Refresh the order data
    if (orderId) {
      getOrder(orderId);
    }
  };

  useEffect(() => {
    if (token) {
      if (orderId) {
        // Fetch specific order by ID
        getOrder(orderId);
      } else {
        // Fallback: fetch latest order if no orderId provided
        getLatestOrder();
      }
    } else {
      navigate('/login');
    }
  }, [token, navigate, orderId]);

  // Fallback function to get latest order
  const getLatestOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/v1/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.orders && response.data.orders.length > 0) {
        const latestOrder = response.data.orders[0];
        setOrder(latestOrder);
      } else {
        setError('No orders found');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load order details');
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

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
        <OrderConfirmation order={order} onOrderUpdate={handleOrderUpdate} getOrders={getOrder} />
      </div>
    </div>
  );
};

export default OrderConfirmationPage;