import { HeartIcon, ShoppingBagIcon, StarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { baseUrl } from '../../utils/constant';
import SizeGuide from './SizeGuide';

const ProductCard = ({ product }) => {
  const {
    isAuthenticated,
    toggleWishlist,
    isProductInWishlist,
    wishlistLoading
  } = useAuth();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { token } = useAuth()

  // Simple image processing - get all available images
  const getProductImages = () => {
    let images = [];

    // Add Cloudinary images if they exist
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      const cloudinaryImages = product.images.map(img =>
        typeof img === 'object' && img.url ? img.url : img
      );
      images = [...images, ...cloudinaryImages];
    }

    // Add imageUrls if they exist
    if (product?.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
      images = [...images, ...product.imageUrls];
    }

    // If no images found, try to parse imageUrls as string
    if (images.length === 0 && product?.imageUrls) {
      if (typeof product.imageUrls === 'string') {
        try {
          const parsed = JSON.parse(product.imageUrls);
          images = Array.isArray(parsed) ? parsed : [product.imageUrls];
        } catch (e) {
          images = [product.imageUrls];
        }
      }
    }

    // Filter out invalid URLs and ensure we have an array
    images = images.filter(img => img && typeof img === 'string' && img.trim() !== '');

    return images;
  };

  const images = getProductImages();

  // Simple navigation functions
  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    }
  };

  const goToImage = (index) => {
    if (index >= 0 && index < images.length) {
      setCurrentImageIndex(index);
    }
  };

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

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    // Size is only required for non-accessory products
    if (product.category !== 'Accessories' && selectedSize === '') {
      toast.error('Please select a size');
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/v1/cart/add`,
        {
          productId: product._id,
          quantity: 1,
          size: product.category === 'Accessories' ? 'One Size' : selectedSize
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        //  if status code comes 401 then redirect to login page
        if (res.status === 401) {
          navigate('/login');
          return;
        }

      if (res.data.success) {
        toast.success(res.data.message);
        // Dispatch cart refresh event
        window.dispatchEvent(new CustomEvent('cart-refresh'));
        navigate('/cart');
      }
    } catch (err) {
      if (err.response.status === 401) {
        navigate('/login');
        return;
      }
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
      toast.error('Failed to update wishlist. Please try again.');
    }
  };

  // Calculate discount percentage (for display purposes)
  const originalPrice = product.price * 2; // Simulating original price for 50% discount
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  // Check if product is in wishlist
  const isInWishlist = isProductInWishlist(product._id);

  return (
    <div className="card group hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">

      <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
        <div className="relative">
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`absolute top-2 right-2 cursor-pointer z-10 bg-white p-1.5 rounded-full shadow-md transition-all duration-200 ${wishlistLoading
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

          <div className="h-48 sm:h-64 overflow-hidden rounded-t-lg bg-gray-100 relative group">
            {images && images.length > 0 ? (
              <>
                {/* Main Image */}
                <img
                  key={`${product._id}-${currentImageIndex}`}
                  src={images[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-105 cursor-pointer"
                  onClick={(e) => {
                    if (images.length > 1) {
                      e.preventDefault();
                      e.stopPropagation();
                      nextImage();
                    }
                  }}
                  onError={(e) => {
                    console.log(`Image failed to load: ${images[currentImageIndex]}`);
                    e.target.src = '/placeholder-image.jpg';
                  }}
                  title={images.length > 1 ? `Click to see next image (${currentImageIndex + 1}/${images.length})` : ''}
                />



                {/* Navigation Arrows - Always Visible */}
                {images.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all shadow-lg"
                      aria-label="Previous image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all shadow-lg"
                      aria-label="Next image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Bottom Image Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          goToImage(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex
                          ? 'bg-white scale-125'
                          : 'bg-white bg-opacity-60 hover:bg-opacity-80 hover:scale-110'
                          }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No Image</span>

                {/* Fallback: Try to show any available image */}
                {product?.imageUrls && typeof product.imageUrls === 'string' && (
                  <div className="absolute bottom-8 left-2 right-2 text-center">
                    <img
                      src={product.imageUrls}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded mx-auto"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
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
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-1">
          <div className="flex text-yellow-400">
            <StarIconSolid className="h-3 w-3 sm:h-4 sm:w-4" />
            <StarIconSolid className="h-3 w-3 sm:h-4 sm:w-4" />
            <StarIconSolid className="h-3 w-3 sm:h-4 sm:w-4" />
            <StarIconSolid className="h-3 w-3 sm:h-4 sm:w-4" />
            <StarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
        </div>

        <Link to={`/products/${product._id}`} className="block flex-1">
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-2 hover:text-indigo-600 transition-colors">{product.name}</h3>
          <p className="mt-1 text-xs text-gray-500 capitalize">{product.category}</p>

          <div className="mt-2 flex items-center flex-wrap">
            <span className="font-bold text-gray-900 text-sm sm:text-base">₹{product.price.toFixed(2)}</span>
            <span className="ml-2 text-xs sm:text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</span>
            <span className="ml-2 text-xs font-medium text-green-600">{discountPercentage}% off</span>
          </div>
        </Link>

        {/* Available Sizes - Only show for non-accessory products */}
        {product.category !== 'Accessories' && availableSizes.length > 0 && (
          <div className="mt-2 sm:mt-3">
            <label className="block text-xs font-medium text-gray-700 mb-1 sm:mb-2">
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
                    className={`inline-flex items-center justify-center min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 px-1 sm:px-2 text-xs font-medium border rounded transition-all ${selectedSize === size
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    {size}
                  </span>
                </label>
              ))}
            </div>
            {selectedSize && (
              <p className="text-xs text-indigo-600 mt-1">Selected: {selectedSize}</p>
            )}
            
            {/* Size Guide Button */}
            <div className="mt-2 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSizeGuide(true);
                }}
                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors px-2 py-1 rounded hover:bg-blue-50"
                title="View Size Guide"
              >
                <InformationCircleIcon className="h-3 w-3 mr-1" />
                Size Guide
              </button>
            </div>
          </div>
        )}

        {/* For accessories, show a simple message */}
        {product.category === 'Accessories' && (
          <div className="mt-2 sm:mt-3 text-center">
            <p className="text-xs text-gray-500 italic">One Size Fits All</p>
          </div>
        )}

        {/* Button - Always at bottom */}
        <button
          onClick={(e) => handleAddToCart(e, product)}
          className="mt-3 sm:mt-4 w-full py-2 cursor-pointer px-3 sm:px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium rounded-md flex items-center justify-center transition-colors"
        >
          <ShoppingBagIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          {product.category === 'Accessories' ? 'Add Accessory' : 'Add to Cart'}
        </button>
      </div>
      
      {/* Size Guide Modal - Only show for non-accessory products */}
      {product.category !== 'Accessories' && (
        <SizeGuide 
          isOpen={showSizeGuide} 
          product={product}
          onClose={() => setShowSizeGuide(false)} 
        />
      )}
    </div>
  );
};

export default ProductCard;