import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { XMarkIcon, HeartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Calculate discount and original price for display
  const discountPercentage = 20; // Sample discount
  const originalPrice = item.price * 1.25; // 25% higher than current price
  
  const isItemInWishlist = isInWishlist(item.id);
  
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item.id, newQuantity);
  };
  
  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };
  
  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200 last:border-b-0">
      {/* Product Image */}
      <div className="flex-shrink-0 w-full sm:w-32 h-32 mb-4 sm:mb-0 relative group">
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-md"></div>
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center rounded-md border border-gray-200"
        />
        {discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </span>
        )}
      </div>
      
      {/* Product Details */}
      <div className="flex flex-1 flex-col sm:ml-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900 hover:text-indigo-600 transition-colors">{item.name}</h3>
            <div className="mt-1 flex items-center">
              <p className="text-sm text-gray-500 capitalize">{item.category}</p>
              {item.selectedSize && (
                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  Size: {item.selectedSize}
                </span>
              )}
              {item.selectedColor && (
                <span className="ml-2 flex items-center text-xs text-gray-500">
                  <span className="h-3 w-3 rounded-full mr-1" style={{ backgroundColor: item.selectedColor }}></span>
                  Color
                </span>
              )}
            </div>
            
            {/* Price information */}
            <div className="mt-1 flex items-center">
              <p className="text-base font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
              {originalPrice > item.price && (
                <>
                  <p className="ml-2 text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
                  <p className="ml-2 text-xs font-medium text-green-600">{discountPercentage}% off</p>
                </>
              )}
            </div>
            
            {/* Delivery estimate */}
            <p className="mt-1 text-xs text-gray-500">Delivery in 3-5 business days | 7 days returns</p>
          </div>
          
          <p className="text-base font-bold text-gray-900">
            ₹{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          {/* Quantity controls */}
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-3">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
              <button
                type="button"
                onClick={handleDecreaseQuantity}
                disabled={item.quantity <= 1}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                -
              </button>
              <span className="px-3 py-1 text-gray-700 font-medium border-l border-r border-gray-300">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={handleIncreaseQuantity}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => isItemInWishlist ? removeFromWishlist(item.id) : addToWishlist(item)}
              className={`${isItemInWishlist ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'} transition-colors`}
              aria-label={isItemInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isItemInWishlist ? <HeartIconSolid className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}
            </button>
            
            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              className="text-gray-500 hover:text-red-600 transition-colors"
              aria-label="Remove item"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;