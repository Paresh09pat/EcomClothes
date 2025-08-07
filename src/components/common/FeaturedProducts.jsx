import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../utils/constant';
import ProductGrid from '../products/ProductGrid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if baseUrl is available
        if (!baseUrl) {
          throw new Error('API URL not configured. Please check your environment variables.');
        }
                
        let products = [];
        
        try {
          // First try: /v1/products/featured
          const response = await axios.get(`${baseUrl}/v1/products/featured`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }   
          });
          
          
          
          // Handle different possible response structures
          if (response.data.success) {
            // Structure 1: { success: true, products: [...] }
            products = response.data.products || [];
          } else if (response.data.products) {
            // Structure 2: { products: [...] }
            products = response.data.products;
          } else if (Array.isArray(response.data)) {
            // Structure 3: Direct array response
            products = response.data;
          } else {
            // Structure 4: { data: [...] } or other
            products = response.data.data || response.data || [];
          }
        } catch (featuredError) {
        }
        
        
        setFeaturedProducts(products);
      } catch (err) {

        let errorMessage = 'Failed to load featured products. Please try again later.';
        
        if (err.response) {
          // Server responded with error status
          if (err.response.status === 404) {
            errorMessage = 'Featured products endpoint not found. Please check your API configuration.';
          } else if (err.response.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
          }
        } else if (err.request) {
          // Request was made but no response received
          errorMessage = 'No response from server. Please check your internet connection and ensure the API server is running.';
        } else if (err.code === 'ECONNABORTED') {
          // Request timeout
          errorMessage = 'Request timeout. Please check your internet connection.';
        } else {
          // Something else happened
          errorMessage = err.message || errorMessage;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">{error}</p>
              <div className="mt-4 space-y-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-red-600 hover:text-red-800 font-medium mr-4"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => setError(null)} 
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-2 text-gray-600 max-w-2xl">Discover our handpicked collection of premium products</p>
          </div>
        </div>
        
        <ProductGrid products={featuredProducts} />
      </div>
    </section>
  );
};

export default FeaturedProducts; 