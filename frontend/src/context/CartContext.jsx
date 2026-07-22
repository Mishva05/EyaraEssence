import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('eyara_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse cart items", e);
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('eyara_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, color = null) => {
    setCartItems((prevItems) => {
      // Find item with same ID and color
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );

      if (existingItemIndex > -1) {
        // Increment quantity
        const newItems = [...prevItems];
        const newQty = newItems[existingItemIndex].quantity + quantity;
        
        // Check stock (mock limit, e.g. 10 items)
        if (newQty > 10) {
          showToast(`Cannot add more. Limit of 10 items per product.`, 'error');
          return prevItems;
        }

        newItems[existingItemIndex].quantity = newQty;
        showToast(`Updated quantity of ${product.name} in your cart.`, 'success');
        return newItems;
      } else {
        // Add new item
        showToast(`${product.name} added to your cart.`, 'success');
        return [...prevItems, { product, quantity, selectedColor: color || (product.colors && product.colors[0]) || null }];
      }
    });
  };

  const removeFromCart = (productId, color) => {
    setCartItems((prevItems) => {
      const targetItem = prevItems.find(item => item.product.id === productId && item.selectedColor === color);
      if (targetItem) {
        showToast(`${targetItem.product.name} removed from cart.`, 'info');
      }
      return prevItems.filter(
        (item) => !(item.product.id === productId && item.selectedColor === color)
      );
    });
  };

  const updateQuantity = (productId, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    
    if (newQuantity > 10) {
      showToast("Maximum limit is 10 units per item.", "error");
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.selectedColor === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    showToast("Cart cleared.", "info");
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal: getSubtotal(),
        cartCount: getCartCount(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
