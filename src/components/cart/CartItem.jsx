import { useCart } from '../../contexts/CartContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item.id, newQuantity);
  };
  
  return (
    <div className="flex flex-col sm:flex-row">
      {/* Product Image */}
      <div className="flex-shrink-0 w-full sm:w-32 h-32 mb-4 sm:mb-0">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center rounded-md"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex flex-1 flex-col sm:ml-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
            <p className="mt-1 text-sm text-gray-500 capitalize">{item.category}</p>
          </div>
          <p className="text-base font-medium text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <label htmlFor={`quantity-${item.id}`} className="sr-only">
              Quantity
            </label>
            <select
              id={`quantity-${item.id}`}
              name="quantity"
              value={item.quantity}
              onChange={handleQuantityChange}
              className="rounded-md border border-gray-300 text-base font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span className="ml-2 text-sm text-gray-500">x ${item.price.toFixed(2)}</span>
          </div>
          
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 