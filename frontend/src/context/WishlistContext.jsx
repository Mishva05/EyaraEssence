import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem('eyara_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse wishlist items", e);
      return [];
    }
  });

  const { showToast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    localStorage.setItem('eyara_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((item) => item.id === product.id);
      if (exists) {
        showToast(`${product.name} removed from your wishlist.`, 'info');
        return prevItems.filter((item) => item.id !== product.id);
      } else {
        showToast(`${product.name} added to your wishlist!`, 'success');
        return [...prevItems, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => {
      const item = prevItems.find((i) => i.id === productId);
      if (item) {
        showToast(`${item.name} removed from your wishlist.`, 'info');
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  const moveWishlistItemToCart = (product, color = null) => {
    addToCart(product, 1, color || (product.colors && product.colors[0]) || null);
    removeFromWishlist(product.id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveWishlistItemToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
