import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ShoppingBagIcon, 
  HeartIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon,
  CheckIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

const ProductDetail = ({ product }) => {
  const { name, price, description, image } = product;
  
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

  // Parse colors if it's a string, otherwise use as-is  
  let availableColors = [];
  if (product?.colors) {
    if (typeof product.colors === 'string') {
      try {
        availableColors = JSON.parse(product.colors);
      } catch (e) {
        console.error('Error parsing colors:', e);
        availableColors = [product.colors]; // Fallback to single item array
      }
    } else {
      availableColors = product.colors;
    }
  }

  const [selectedSize, setSelectedSize] = useState(availableSizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(availableColors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart } = useCart();
  const { 
    isAuthenticated, 
    toggleWishlist, 
    isProductInWishlist, 
    wishlistLoading 
  } = useAuth();
  const navigate = useNavigate();
  
  const isProductInWishlistState = isProductInWishlist(product.id || product._id);
  
  // Sample data for product details
  const originalPrice = price * 1.25; // 25% higher than current price
  const discountPercentage = 20;
  const rating = 4.5;
  const reviewCount = 127;
  const inStock = true;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  
  // Format delivery date
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if size selection is required
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error('Please select a size before adding to cart');
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    }, quantity);
    toast.success('Product added to cart!');
  };
  
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const wasInWishlist = isProductInWishlistState;
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

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="hover:text-indigo-600">Home</a>
            </li>
            <li className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <a href="#" className="hover:text-indigo-600 capitalize">{product.category}</a>
            </li>
            <li className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              <span className="text-gray-700">{name}</span>
            </li>
          </ol>
        </nav>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Product Image */}
          <div className="lg:max-w-lg lg:self-start sticky top-24">
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 relative group">
              <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                {discountPercentage}% OFF
              </span>
              <button 
                onClick={handleWishlistToggle}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                {isProductInWishlistState ? (
                  <HeartIconSolid className="h-5 w-5 text-pink-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-500 hover:text-pink-500" />
                )}
              </button>
              <img
                src={image}
                alt={name}
                className="w-full h-[500px] object-center object-cover"
              />
            </div>
            
            <div className="mt-4 flex justify-between">
              <button 
                onClick={handleWishlistToggle}
                className={`flex-1 py-3 border font-medium rounded-md transition-colors mr-2 ${isProductInWishlistState ? 'border-pink-600 text-pink-600 hover:bg-pink-50' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'}`}
              >
                {isProductInWishlistState ? (
                  <>
                    <HeartIconSolid className="h-5 w-5 inline-block mr-2 text-pink-600" />
                    Added to Wishlist
                  </>
                ) : (
                  <>
                    <HeartIcon className="h-5 w-5 inline-block mr-2" />
                    Add to Wishlist
                  </>
                )}
              </button>
              <button
                type="button"
                className="flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-2"
                onClick={handleAddToCart}
              >
                <ShoppingBagIcon className="h-5 w-5 inline-block mr-2" />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{name}</h1>
            
            {/* Ratings */}
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIconSolid
                    key={rating}
                    className={`h-5 w-5 ${
                      rating < Math.floor(4.5) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-500">{rating} ({reviewCount} reviews)</p>
            </div>
            
            {/* Price */}
            <div className="mt-4 flex items-end">
              <p className="text-3xl font-bold text-gray-900">₹{price.toFixed(2)}</p>
              <p className="ml-2 text-lg text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
              <p className="ml-2 text-sm font-medium text-green-600">{discountPercentage}% off</p>
            </div>
            
            {/* Stock Status */}
            <div className="mt-4">
              {inStock ? (
                <div className="flex items-center text-green-600">
                  <CheckIcon className="h-5 w-5 mr-1" />
                  <span className="font-medium">In Stock</span>
                </div>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>
            
            {/* Delivery */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <TruckIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-gray-700">Free Delivery by <span className="font-medium">{formattedDeliveryDate}</span></p>
                  <p className="text-xs text-gray-500 mt-1">Order within 4 hrs 36 mins</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {availableSizes && availableSizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Select Size</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">Size Guide</button>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center flex-wrap gap-3">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`
                            relative flex items-center justify-center rounded-md border py-2 px-4 text-sm font-medium uppercase
                            ${
                              selectedSize === size
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                            }
                          `}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              {availableColors && availableColors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Select Color</h3>
                  <div className="mt-3">
                    <div className="flex items-center space-x-4">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`
                            group relative h-10 w-10 rounded-full border
                            ${selectedColor === color ? 'ring-2 ring-indigo-600 ring-offset-1' : 'border-gray-300 hover:ring-1 hover:ring-gray-400'}
                          `}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        >
                          {selectedColor === color && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <CheckIcon className="h-4 w-4 text-white" />
                            </span>
                          )}
                          <span className="sr-only">{color}</span>
                          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
                            {color}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-gray-900 mr-4">Quantity</h3>
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-700 font-medium border-l border-r border-gray-300">{quantity}</span>
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product Benefits */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">100% Original</p>
                  <p className="text-xs text-gray-500">Authentic products</p>
                </div>
              </div>
              <div className="flex items-start">
                  <ArrowPathIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Easy Returns</p>
                    <p className="text-xs text-gray-500">7 days return policy</p>
                  </div>
                </div>
            </div>
            
            {/* Product Details Tabs */}
            <div className="mt-10 border-t border-gray-200 pt-6">
              <div className="flex border-b border-gray-200">
                <button
                  className={`pb-4 px-1 ${activeTab === 'description' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'} font-medium text-sm mr-8`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`pb-4 px-1 ${activeTab === 'specifications' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'} font-medium text-sm mr-8`}
                  onClick={() => setActiveTab('specifications')}
                >
                  Specifications
                </button>
                <button
                  className={`pb-4 px-1 ${activeTab === 'reviews' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'} font-medium text-sm`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({reviewCount})
                </button>
              </div>
              
              <div className="py-6">
                {activeTab === 'description' && (
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <p>{description}</p>
                    <p className="mt-4">This premium product is designed to provide maximum comfort and style. Perfect for everyday wear and special occasions alike.</p>
                  </div>
                )}
                
                {activeTab === 'specifications' && (
                  <div className="text-sm text-gray-700">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div className="border-t border-gray-200 pt-4">
                        <dt className="font-medium text-gray-900">Material</dt>
                        <dd className="mt-1 text-gray-500">Premium cotton blend</dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <dt className="font-medium text-gray-900">Care Instructions</dt>
                        <dd className="mt-1 text-gray-500">Machine wash cold, tumble dry low</dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <dt className="font-medium text-gray-900">Origin</dt>
                        <dd className="mt-1 text-gray-500">Made in India</dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <dt className="font-medium text-gray-900">Style</dt>
                        <dd className="mt-1 text-gray-500">Casual</dd>
                      </div>
                    </dl>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="text-sm text-gray-700">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((star) => (
                          <StarIconSolid
                            key={star}
                            className={`h-5 w-5 ${star < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="ml-2 text-gray-700">{rating} out of 5 stars</p>
                    </div>
                    <p className="mt-2">Based on {reviewCount} reviews</p>
                    
                    <div className="mt-6 space-y-6">
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center mb-1">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((star) => (
                              <StarIconSolid
                                key={star}
                                className={`h-4 w-4 ${star < 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <p className="ml-2 font-medium">Amazing quality!</p>
                        </div>
                        <p className="text-gray-600 text-sm">The fabric quality is excellent and the fit is perfect. Highly recommend!</p>
                        <p className="mt-1 text-xs text-gray-500">By Rahul S. on August 12, 2023</p>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center mb-1">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((star) => (
                              <StarIconSolid
                                key={star}
                                className={`h-4 w-4 ${star < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <p className="ml-2 font-medium">Great value for money</p>
                        </div>
                        <p className="text-gray-600 text-sm">Very satisfied with my purchase. The color is exactly as shown in the pictures.</p>
                        <p className="mt-1 text-xs text-gray-500">By Priya M. on July 28, 2023</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;