import { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Refs to prevent duplicate toasts
  const toastIdsRef = useRef(new Set());
  const lastToastTimeRef = useRef({});

  useEffect(() => {
    loadWishlist();
  }, []);

  useEffect(() => {
    saveWishlist();
  }, [wishlistItems]);

  const loadWishlist = async () => {
    try {
      const savedWishlist = localStorage.getItem('furniqo_wishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
      
      // If authenticated, try to sync with backend
      if (isAuthenticated) {
        try {
          const items = await apiWrapper.getWishlistItems();
          if (Array.isArray(items)) {
            setWishlistItems(items);
          }
        } catch (error) {
          console.debug('Wishlist sync skipped (offline mode)');
        }
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlistItems([]);
    }
  };

  const saveWishlist = () => {
    try {
      localStorage.setItem('furniqo_wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  const showUniqueToast = (message, type = 'success', options = {}) => {
    const now = Date.now();
    const lastTime = lastToastTimeRef.current[message] || 0;
    
    // Prevent duplicate toasts within 1 second
    if (now - lastTime < 1000) {
      return;
    }
    
    lastToastTimeRef.current[message] = now;
    
    if (type === 'success') {
      toast.success(message, options);
    } else if (type === 'error') {
      toast.error(message, options);
    } else {
      toast(message, options);
    }
  };

  const addToWishlist = useCallback(async (product) => {
    setWishlistItems(prev => {
      if (prev.some(item => item._id === product._id)) {
        showUniqueToast('Already in your wishlist', 'default', { icon: '💝' });
        return prev;
      }
      showUniqueToast(`${product.name} added to wishlist`, 'success');
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId, skipToast = false) => {
    setWishlistItems(prev => {
      const item = prev.find(i => i._id === productId);
      const updated = prev.filter(item => item._id !== productId);
      if (item && !skipToast) {
        showUniqueToast(`${item.name} removed from wishlist`, 'success');
      }
      return updated;
    });
  }, []);

  const isWishlisted = useCallback((productId) => {
    return wishlistItems.some(item => item._id === productId);
  }, [wishlistItems]);

  const toggleWishlist = useCallback(async (product) => {
    if (isWishlisted(product._id)) {
      removeFromWishlist(product._id);
    } else {
      await addToWishlist(product);
    }
  }, [isWishlisted, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(() => {
    if (wishlistItems.length === 0) {
      showUniqueToast('Wishlist is already empty', 'default');
      return;
    }
    setWishlistItems([]);
    showUniqueToast('Wishlist cleared', 'success');
  }, [wishlistItems.length]);

  const moveAllToCart = useCallback((addToCartFn) => {
    if (!addToCartFn) {
      showUniqueToast('Cart function not available', 'error');
      return;
    }
    
    if (wishlistItems.length === 0) {
      showUniqueToast('Wishlist is empty', 'default');
      return;
    }
    
    const itemCount = wishlistItems.length;
    
    // Move items to cart without showing individual "removed from wishlist" messages
    wishlistItems.forEach(item => {
      // Add to cart with skipToast=true to avoid individual cart toasts
      addToCartFn(item, 1, null, true);
    });
    
    // Clear wishlist without showing toast for each removal
    setWishlistItems([]);
    
    // Show single combined success message
    showUniqueToast(`${itemCount} item${itemCount > 1 ? 's' : ''} moved to cart`, 'success');
  }, [wishlistItems]);

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    toggleWishlist,
    clearWishlist,
    moveAllToCart,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};