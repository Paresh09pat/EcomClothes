import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { baseUrl } from '../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v1/products/${productId}`);
      setProduct(response.data.product);
      
      // Auto-select first size if available
      const productData = response.data.product;
      if (productData?.size) {
        let availableSizes = [];
        if (typeof productData.size === 'string') {
          try {
            availableSizes = JSON.parse(productData.size);
          } catch (e) {
            availableSizes = [productData.size];
          }
        } else {
          availableSizes = productData.size;
        }
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  let image;
  if (product?.images?.length > 0) {
    // Handle Cloudinary objects with url property
    image = product.images.map(img => 
      typeof img === 'object' && img.url ? img.url : img
    );
  } else if (product?.imageUrls) {
    // Parse imageUrls if it's a string, otherwise use as-is
    if (typeof product.imageUrls === 'string') {
      try {
        image = JSON.parse(product.imageUrls);
      } catch (e) {
        image = [product.imageUrls]; // Fallback to single item array
      }
    } else {
      image = product.imageUrls;
    }
  } else {
    image = [];
  }

  // Parse sizes if it's a string, otherwise use as-is
  let availableSizes = [];
  if (product?.size) {
    if (typeof product.size === 'string') {
      try {
        availableSizes = JSON.parse(product.size);
      } catch (e) {
        availableSizes = [product.size]; // Fallback to single item array
      }
    } else {
      availableSizes = product.size;
    }
  }

  useEffect(() => {
    fetchProduct();
    }, [productId]); 

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product) {
      // Check if size selection is required
      if (availableSizes.length > 0 && !selectedSize) {
        toast.error('Please select a size before adding to cart');
        return;
      }

      try {
        // Add to cart via API
        const res = await axios.post(`${baseUrl}/v1/cart/add`,
          {
            productId: product._id,
            quantity: quantity,
            size: selectedSize || null
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          });

        if (res.data.success) {
          toast.success(res.data.message || 'Product added to cart!');
          // Dispatch cart refresh event
          window.dispatchEvent(new CustomEvent('cart-refresh'));
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to add product to cart');
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading product details...</p>
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

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Select Size</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800">Size Guide</button>
              </div>
              <div className="mt-3">
                <div className="flex items-center flex-wrap gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`
                        relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase transition-all
                        ${
                          selectedSize === size
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-2 ring-indigo-600'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }
                      `}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="mt-2 text-sm text-indigo-600">Selected size: <span className="font-medium">{selectedSize}</span></p>
                )}
              </div>
            </div>
          )}

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
              className="mt-6 w-full btn bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Add to Cart {availableSizes.length > 0 && selectedSize && `(Size: ${selectedSize})`}
            </button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900">Shipping Information</h3>
            <p className="mt-2 text-sm text-gray-500">
              Free shipping on all orders over ₹5,000. Standard delivery 3-5 business days.
            </p>
          </div>

          {/* Available Sizes Info */}
          {availableSizes.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900">Available Sizes</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
