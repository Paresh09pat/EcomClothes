import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { 
  ShoppingBagIcon, 
  HeartIcon, 
  XMarkIcon,
  ArrowLeftIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();
  
  // Function to handle moving item to cart
  const handleMoveToCart = (productId) => {
    moveToCart(productId, addToCart);
  };
  
  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-gray-600 mt-1">Items you've saved for later</p>
          </div>
          <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </div>
        
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <HeartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you like by clicking the heart icon on products</p>
            <Link to="/" className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md">
              Discover Products
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button 
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Clear Wishlist
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => {
                // Calculate discount percentage (for display purposes)
                const originalPrice = item.price * 1.2; // Simulating original price
                const discountPercentage = Math.round(((originalPrice - item.price) / originalPrice) * 100);
                
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 relative group">
                    {/* Discount tag */}
                    {discountPercentage > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discountPercentage}% OFF
                      </div>
                    )}
                    
                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      aria-label="Remove from wishlist"
                    >
                      <XMarkIcon className="h-4 w-4 text-gray-500" />
                    </button>
                    
                    {/* Product Image */}
                    <Link to={`/products/${item.id}`} className="block relative h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                    
                    {/* Product Details */}
                    <div className="p-4">
                      <Link to={`/products/${item.id}`} className="block">
                        <h3 className="text-lg font-medium text-gray-900 mb-1 hover:text-indigo-600 transition-colors">{item.name}</h3>
                      </Link>
                      
                      <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                      
                      <div className="flex items-center mb-3">
                        <p className="font-bold text-gray-900">₹{item.price.toFixed(2)}</p>
                        {discountPercentage > 0 && (
                          <p className="ml-2 text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMoveToCart(item.id)}
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
        )}
      </div>
    </div>
  );
};

export default WishlistPage;