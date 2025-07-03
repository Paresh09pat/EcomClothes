import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

// Sample products data (same as in CategoryPage)
const allProducts = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'men',
    description: 'A comfortable and versatile white t-shirt made from 100% cotton. Perfect for everyday wear.',
  },
  {
    id: 2,
    name: 'Denim Jacket',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'women',
    description: 'A stylish denim jacket that adds a classic touch to any outfit. Features button closure and multiple pockets.',
  },
  {
    id: 3,
    name: 'Summer Dress',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'women',
    description: 'A light and breezy summer dress with a floral pattern. Perfect for warm days and special occasions.',
  },
  {
    id: 4,
    name: 'Leather Sneakers',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'accessories',
    description: 'Comfortable leather sneakers with a modern design. Suitable for both casual and semi-formal occasions.',
  },
  {
    id: 5,
    name: 'Slim Fit Jeans',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'men',
    description: 'Stylish slim fit jeans made from high-quality denim. Features a comfortable stretch fabric for all-day wear.',
  }
];

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  useEffect(() => {
    // In a real app, this would be an API call
    setLoading(true);
    
    // Find product by ID
    const foundProduct = allProducts.find(
      p => p.id === parseInt(productId)
    );
    
    // Simulate API delay
    setTimeout(() => {
      setProduct(foundProduct || null);
      setLoading(false);
    }, 500);
  }, [productId]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p>Loading product details...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn bg-indigo-600 hover:bg-indigo-700">
          Return to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Product Details */}
        <div>
          <Link 
            to={`/categories/${product.category}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 capitalize"
          >
            {product.category}
          </Link>
          
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-2xl font-medium text-gray-900">${product.price.toFixed(2)}</p>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center">
              <label htmlFor="quantity" className="mr-4 text-sm font-medium text-gray-700">
                Quantity
              </label>
              <select
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="rounded-md border border-gray-300 text-base font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-6 w-full btn bg-indigo-600 hover:bg-indigo-700"
            >
              Add to Cart
            </button>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900">Shipping Information</h3>
            <p className="mt-2 text-sm text-gray-500">
              Free shipping on all orders over $50. Standard delivery 3-5 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 