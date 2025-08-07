import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { 
  ShoppingBagIcon, 
  HeartIcon, 
  XMarkIcon,
  ArrowLeftIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../utils/constant';

const WishlistPage = () => {
  const { addToCart } = useCart();
  const { 
    wishlist, 
    getWishlist, 
    toggleWishlist, 
    wishlistLoading, 
    isAuthenticated,
    token,
    setCartitems
  } = useAuth();
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
    getWishlist();
    }
  }, [isAuthenticated]);

  // Function to handle removing item from wishlist
  const handleRemoveFromWishlist = async (product) => {
    try {
      const response = await toggleWishlist(product);
      if (response.status === 200) {
        toast.success('Product removed from wishlist!');
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      toast.error('Failed to remove from wishlist. Please try again.');
    }
  };

  // Function to handle size selection for a specific product
  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  // Function to handle moving item to cart
  const handleMoveToCart = async (product) => {
    // Parse available sizes
    let availableSizes = [];
    if (product?.size) {
      if (typeof product.size === 'string') {
        try {
          availableSizes = JSON.parse(product.size);
        } catch (e) {
          availableSizes = [product.size];
        }
      } else {
        availableSizes = product.size;
      }
    }

    // Check if size selection is required
    if (availableSizes.length > 0 && !selectedSizes[product._id]) {
      toast.error('Please select a size before adding to cart');
      return;
    }

    try {
      // Add to cart via API
      const res = await axios.post(`${baseUrl}/v1/cart/add`,
        {
          productId: product._id,
          quantity: 1,
          size: selectedSizes[product._id] || null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

      if (res.data.success) {
        toast.success(res.data.message || 'Product added to cart!');
        setCartitems((prev) => !prev); // Trigger cart refresh
        
        // Remove from wishlist after successfully adding to cart
        await handleRemoveFromWishlist(product);
      }
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Failed to add product to cart');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Please login to view your wishlist</h2>
            <p className="mt-1 text-sm text-gray-500">
              You need to be logged in to access your wishlist.
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Login to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Go back to home"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </Link>
          <div>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-sm text-gray-500">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
          
          <HeartIconSolid className="h-8 w-8 text-pink-500" />
        </div>
        
        {/* Wishlist Content */}
        {wishlistLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading your wishlist...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-12">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h2>
            <p className="mt-1 text-sm text-gray-500">
              Start browsing and add items you love to your wishlist.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((item) => {
                  // Handle images with proper fallback for both images and imageUrls arrays
                  let image;
                  if (item?.images?.length > 0) {
                    // Handle Cloudinary objects with url property
                    image = typeof item.images[0] === 'object' && item.images[0].url 
                      ? item.images[0].url 
                      : item.images[0];
                  } else if (item?.imageUrls) {
                    if (typeof item.imageUrls === 'string') {
                      try {
                        const parsedImages = JSON.parse(item.imageUrls);
                        image = Array.isArray(parsedImages) ? parsedImages[0] : parsedImages;
                      } catch (e) {
                        image = item.imageUrls;
                      }
                    } else {
                      image = Array.isArray(item.imageUrls) ? item.imageUrls[0] : item.imageUrls;
                    }
                  } else {
                    image = '';
                  }

                  // Parse available sizes
                  let availableSizes = [];
                  if (item?.size) {
                    if (typeof item.size === 'string') {
                      try {
                        availableSizes = JSON.parse(item.size);
                      } catch (e) {
                        availableSizes = [item.size];
                      }
                    } else {
                      availableSizes = item.size;
                    }
                  }

                  const originalPrice = item.price * 1.2;
                const discountPercentage = Math.round(((originalPrice - item.price) / originalPrice) * 100);
                
                return (
                    <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 relative group">
                    {/* Discount tag */}
                    {discountPercentage > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discountPercentage}% OFF
                      </div>
                    )}
                    
                    {/* Remove button */}
                    <button
                        onClick={() => handleRemoveFromWishlist(item)}
                        disabled={wishlistLoading}
                        className={`absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm transition-all z-10 ${
                          wishlistLoading 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'opacity-0 group-hover:opacity-100 hover:bg-red-50'
                        }`}
                      aria-label="Remove from wishlist"
                    >
                        <XMarkIcon className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </button>
                    
                    {/* Product Image */}
                      <Link to={`/products/${item._id}`} className="block relative h-48 overflow-hidden">
                        {image ? (
                      <img 
                            src={image}
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                    </Link>
                    
                    {/* Product Details */}
                    <div className="p-4">
                        <Link to={`/products/${item._id}`} className="block">
                          <h3 className="text-lg font-medium text-gray-900 mb-1 hover:text-indigo-600 transition-colors line-clamp-2">{item.name}</h3>
                      </Link>
                      
                        <p className="text-sm text-gray-500 mb-2 capitalize">{item.category}</p>
                      
                      <div className="flex items-center mb-3">
                        <p className="font-bold text-gray-900">₹{item.price.toFixed(2)}</p>
                        {discountPercentage > 0 && (
                          <p className="ml-2 text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
                        )}
                      </div>

                        {/* Available Sizes */}
                        {availableSizes.length > 0 && (
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              Select Size:
                            </label>
                            <div className="flex flex-wrap gap-1">
                              {availableSizes.map((size) => (
                                <label key={size} className="relative cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`size-${item._id}`}
                                    value={size}
                                    checked={selectedSizes[item._id] === size}
                                    onChange={() => handleSizeSelect(item._id, size)}
                                    className="sr-only"
                                  />
                                  <span
                                    className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-medium border rounded transition-all ${
                                      selectedSizes[item._id] === size
                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                    }`}
                                  >
                                    {size}
                                  </span>
                                </label>
                              ))}
                            </div>
                            {selectedSizes[item._id] && (
                              <p className="text-xs text-indigo-600 mt-1">Selected: {selectedSizes[item._id]}</p>
                            )}
                          </div>
                        )}
                      
                      <div className="flex space-x-2">
                        <button
                            onClick={() => handleMoveToCart(item)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center text-sm font-medium transition-colors"
                        >
                          <ShoppingBagIcon className="h-4 w-4 mr-1" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;