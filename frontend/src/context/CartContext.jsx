import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, customization = {}, quantity = 1) => {
    // Create unique ID based on product and customization
    const customId = product.customizable 
      ? `${product.id}-${customization.size || ''}-${customization.color || ''}-${customization.material || customization.pattern || ''}`
      : `${product.id}-${customization.size || product.size || ''}-${customization.color || product.color || ''}`;
    
    const cartItem = {
      id: customId,
      productId: product.id,
      name: product.name,
      price: product.price || product.basePrice || 0,
      image: product.image,
      quantity: quantity,
      category: product.category || 'general',
      customizable: product.customizable || false,
      // Store all customization details
      customization: {
        size: customization.size || product.size || 'Medium',
        color: customization.color || product.color || 'Default',
        material: customization.material || product.material || null,
        pattern: customization.pattern || null,
        threadCount: customization.threadCount || null,
        // For bags
        fabricType: customization.fabricType || null,
        customText: customization.customText || null,
        imageUpload: customization.imagePreview || null
      }
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === cartItem.id
      );

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, cartItem];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
