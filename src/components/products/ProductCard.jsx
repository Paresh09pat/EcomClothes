import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { ShoppingBagIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isProductInWishlist = isInWishlist(product.id);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };
  
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isProductInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Calculate discount percentage (for display purposes)
  const originalPrice = product.price * 1.2; // Simulating original price
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="card group hover:shadow-xl transition-shadow duration-300">
      {/* Product Image with fixed height */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden">
        <div className="relative">
          {/* Discount tag */}
          <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
          
          {/* Wishlist button */}
          <button 
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 z-10 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"
          >
            {isProductInWishlist ? (
              <HeartIconSolid className="h-5 w-5 text-pink-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-500 hover:text-pink-500" />
            )}
          </button>
          
          <div className="h-64 overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center transform transition-all duration-700 ease-in-out group-hover:scale-105"
              style={{ height: '256px' }} /* Fixed height for consistency */
            />
          </div>
        </div>
        
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium text-sm shadow-lg">Quick View</span>
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
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
        
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="text-sm font-medium text-gray-700 line-clamp-2 hover:text-indigo-600 transition-colors">{product.name}</h3>
          <p className="mt-1 text-xs text-gray-500 capitalize">{product.category}</p>
          
          <div className="mt-2 flex items-center">
            <span className="font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
            <span className="ml-2 text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</span>
            <span className="ml-2 text-xs font-medium text-green-600">{discountPercentage}% off</span>
          </div>
        </Link>
        
        <button
          onClick={handleAddToCart}
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