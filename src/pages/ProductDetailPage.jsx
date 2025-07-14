import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { baseUrl } from '../utils/constant';
import axios from 'axios';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v1/products/${productId}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  let image;
  if (product?.images?.length > 0) {
    image = product.images;
  } else if (product?.imageUrls) {
    // Parse imageUrls if it's a string, otherwise use as-is
    if (typeof product.imageUrls === 'string') {
      try {
        image = JSON.parse(product.imageUrls);
      } catch (e) {
        console.error('Error parsing imageUrls:', e);
        image = [product.imageUrls]; // Fallback to single item array
      }
    } else {
      image = product.imageUrls;
    }
  } else {
    image = [];
  }


  useEffect(() => {
    fetchProduct();
  }, [productId]); // Make sure to refetch if productId changes

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }

  // If no product after loading
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
            src={image[0]}
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
          <p className="mt-2 text-2xl font-medium text-gray-900">₹{product.price.toFixed(2)}</p>

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
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
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
              Free shipping on all orders over ₹5,000. Standard delivery 3-5 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
