import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Ensure all items have proper ID structure
        const normalizedCart = parsedCart.map(item => ({
          ...item,
          id: item.id || item._id, // Ensure id exists
          _id: item._id || item.id  // Ensure _id exists for backend compatibility
        }));
        setCart(normalizedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Save cart to localStorage whenever it changes (but not on initial load)
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
    
    // Calculate totals
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    setItemCount(count);
    
    const cartTotal = cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
    setTotal(cartTotal);
  }, [cart, isLoading]);

  const addToCart = (product, quantity = 1) => {
    // Normalize product ID structure
    const normalizedProduct = {
      ...product,
      id: product.id || product._id,
      _id: product._id || product.id,
      quantity: quantity
    };

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => 
        (item.id === normalizedProduct.id || item._id === normalizedProduct._id) &&
        item.selectedSize === normalizedProduct.selectedSize
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity if item exists with same size
        return prevCart.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item
        return [...prevCart, normalizedProduct];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => 
      item.id !== productId && item._id !== productId
    ));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        (item.id === productId || item._id === productId) 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    total,
    itemCount,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 