import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { baseUrl } from '../../utils/constant';
import Loader from '../Loader';

const CartItem = ({ item }) => {

  console.log("item", item)

  const {
    token,
    isRemoved,
    setIsRemoved,
    setCartitems

  } = useAuth();


  const [quantity, setQuantity] = useState(item?.quantity);
  const [loading, setLoading] = useState(false);

  const product = item.product;

  const discountPercentage = 20;
  const originalPrice = product.price * 1.25;

  // Function to get product image with proper fallback
  const getProductImage = () => {
    // Check for images field first (Cloudinary objects with url property)
    if (product.images && product.images.length > 0) {
      return typeof product.images[0] === 'object' && product.images[0].url 
        ? product.images[0].url 
        : product.images[0];
    }
    // Check for imageUrls field as fallback
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }
    // Return a proper fallback image
    return '/cloth1.png';
  };

  const productImage = getProductImage();
  console.log("productImage", productImage)


  const handleQuantityChange = (newQuantity) => {
    updateCart(product._id, newQuantity);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
    handleQuantityChange(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      handleQuantityChange(quantity - 1);
    }
  };

  const removeFromCart = async (id) => {
    console.log("id", id);
    try {
      setLoading(true);
      const res = await axios.delete(`${baseUrl}/v1/cart/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsRemoved((prev) => !prev);
      setCartitems((prev=>!prev))
      
      console.log(res);
    }
    catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const updateCart = async (id, quantity) => {
    try {
      setLoading(true);
      const res = await axios.put(`${baseUrl}/v1/cart/update/`, { productId: id, quantity: quantity, size: item.selectedSize }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsRemoved((prev) => !prev);
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    updateCart(product._id, quantity);

  }, [quantity]);


  return (
    <>
      {loading && <Loader />}
      <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200 last:border-b-0">
        {/* Product Image */}
        <div className="flex-shrink-0 w-full sm:w-32 h-32 mb-4 sm:mb-0 relative group">
          <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-md"></div>
          <img
            src={productImage}
            alt={product.name}
            className="h-full w-full object-cover object-center rounded-md border border-gray-200"
            onError={(e) => {
              e.target.src = '/cloth1.png';
            }}
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
              <h3 className="text-base font-medium text-gray-900 hover:text-indigo-600 transition-colors">{product.name}</h3>
              <div className="mt-1 flex items-center">
                <p className="text-sm text-gray-500 capitalize">{product.category}</p>
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

              {/* Price */}
              <div className="mt-1 flex items-center">
                <p className="text-base font-medium text-gray-900">₹{product.price.toFixed(2)}</p>
                <p className="ml-2 text-sm text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
                <p className="ml-2 text-xs font-medium text-green-600">{discountPercentage}% off</p>
              </div>

              <p className="mt-1 text-xs text-gray-500">Delivery in 3-5 business days | 7 days returns</p>
            </div>

            <p className="text-base font-bold text-gray-900">
              ₹{(product.price * quantity)}
            </p>
          </div>

          <div className="mt-4 flex justify-between items-center">
            {/* Quantity Controls */}
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-3">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-3 py-1 text-gray-700 font-medium border-l border-r border-gray-300">
                  {quantity}
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

            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-3">Size:</span>
              <span className="text-sm text-gray-700">{item.selectedSize || item.size || 'N/A'}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">

              <button
                type="button"
                onClick={() => removeFromCart(product._id)}
                className="text-gray-500 hover:text-red-600 transition-colors"
                aria-label="Remove item"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default CartItem;
