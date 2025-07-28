import { HeartIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { baseUrl } from '../../utils/constant';

const ProductCard = ({ product }) => {
  const {
    isAuthenticated,
    toggleWishlist,
    isProductInWishlist,
    wishlistLoading,
    setCartitems
  } = useAuth();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('');
  const { token } = useAuth()
  // Handle imageUrls that might be a JSON string instead of array
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

  // Parse sizes if it's a string, otherwise use as-is
  let availableSizes = [];
  if (product?.size) {
    if (typeof product.size === 'string') {
      try {
        availableSizes = JSON.parse(product.size);
      } catch (e) {
        console.error('Error parsing sizes:', e);
        availableSizes = [product.size]; // Fallback to single item array
      }
    } else {
      availableSizes = product.size;
    }
  }

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedSize === '') {
      toast.error('Please select a size');
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/v1/cart/add`,
        {
          productId: product._id,
          quantity: 1,
          size: selectedSize
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });


      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/cart');
        setCartitems((prev)=>!prev)
      }
    } catch (err) {
      console.log(err.response.data.message);
      toast.error(err.response.data.message);
    }
  }


  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const wasInWishlist = isProductInWishlist(product._id);
      const response = await toggleWishlist(product);

      if (response.status === 200) {
        const message = wasInWishlist
          ? 'Product removed from wishlist!'
          : 'Product added to wishlist!';
        toast.success(response.data.message || message);
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      toast.error('Failed to update wishlist. Please try again.');
    }
  };

  // Calculate discount percentage (for display purposes)
  const originalPrice = product.price * 1.2; // Simulating original price
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  // Check if product is in wishlist
  const isInWishlist = isProductInWishlist(product._id);

  return (
    <div className="card group hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">

      <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
        <div className="relative">

          <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>


          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`absolute top-2 right-2 z-10 bg-white p-1.5 rounded-full shadow-md transition-all duration-200 ${wishlistLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-100 hover:scale-110'
              }`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isInWishlist ? (
              <HeartIconSolid className="h-5 w-5 text-pink-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-500 hover:text-pink-500" />
            )}
          </button>

          <div className="h-64 overflow-hidden rounded-t-lg bg-gray-100">
            {image && image.length > 0 ? (
              <img
                src={image[0]} // Show only the first image
                alt={product.name}
                className="h-full w-full object-cover object-center transform transition-all duration-700 ease-in-out group-hover:scale-105"
                style={{ height: '256px' }} /* Fixed height for consistency */
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium text-sm shadow-lg">Quick View</span>
        </div>
      </Link>

      {/* Product Info - Flexible content area */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-1">
          <div className="flex text-yellow-400">
            <StarIconSolid className="h-4 w-4" />
            <StarIconSolid className="h-4 w-4" />
            <StarIconSolid className="h-4 w-4" />
            <StarIconSolid className="h-4 w-4" />
            <StarIcon className="h-4 w-4" />
          </div>
          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
        </div>

        <Link to={`/products/${product._id}`} className="block flex-1">
          <h3 className="text-sm font-medium text-gray-700 line-clamp-2 hover:text-indigo-600 transition-colors">{product.name}</h3>
          <p className="mt-1 text-xs text-gray-500 capitalize">{product.category}</p>

          <div className="mt-2 flex items-center">
            <span className="font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
            <span className="ml-2 text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</span>
            <span className="ml-2 text-xs font-medium text-green-600">{discountPercentage}% off</span>
          </div>
        </Link>

        {/* Available Sizes - Fixed height section */}
        <div className="mt-3" style={{ minHeight: availableSizes.length > 0 ? '80px' : '20px' }}>
          {availableSizes.length > 0 && (
            <>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Available Sizes:
              </label>
              <div className="flex flex-wrap gap-1">
                {availableSizes.map((size) => (
                  <label key={size} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name={`size-${product._id}`}
                      value={size}
                      checked={selectedSize === size}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size);
                      }}
                      className="sr-only"
                    />
                    <span
                      className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-medium border rounded transition-all ${selectedSize === size
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      {size}
                    </span>
                  </label>
                ))}
              </div>
              {availableSizes.length > 0 && selectedSize && (
                <p className="text-xs text-indigo-600 mt-1">Selected: {selectedSize}</p>
              )}
            </>
          )}
        </div>

        {/* Button - Always at bottom */}
        <button
          onClick={(e) => handleAddToCart(e, product)}
          className="mt-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md flex items-center justify-center transition-colors"
        >
          <ShoppingBagIcon className="h-4 w-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;