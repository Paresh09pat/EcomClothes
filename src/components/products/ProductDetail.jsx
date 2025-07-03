import { useState } from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const ProductDetail = ({ product }) => {
  const { name, price, description, image, sizes, colors } = product;
  const [selectedSize, setSelectedSize] = useState(sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // This will be handled by cart context later
    console.log('Adding to cart:', {
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    });
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product Image */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="rounded-lg overflow-hidden">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{name}</h1>
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">₹{price}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <div className="mt-2 text-base text-gray-700 space-y-4">
                <p>{description}</p>
              </div>
            </div>

            <div className="mt-6">
              {sizes && sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <div className="mt-2">
                    <div className="flex items-center space-x-3">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`
                            relative flex items-center justify-center rounded-md border py-2 px-3 text-sm font-medium uppercase
                            ${
                              selectedSize === size
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-gray-300 text-gray-900 hover:bg-gray-50'
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
              {colors && colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <div className="mt-2">
                    <div className="flex items-center space-x-3">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`
                            relative h-8 w-8 rounded-full border border-gray-300
                            ${selectedColor === color ? 'ring-2 ring-indigo-600' : ''}
                          `}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        >
                          <span className="sr-only">{color}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-gray-900 mr-3">Quantity</h3>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    type="button"
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{quantity}</span>
                  <button
                    type="button"
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <button
                type="button"
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full"
                onClick={handleAddToCart}
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
            </div>

            <div className="mt-8">
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900">Shipping Information</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Free delivery on all orders within India.</p>
                  <p className="mt-1">Cash on Delivery available.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 