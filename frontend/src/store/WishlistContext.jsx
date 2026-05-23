import { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();
  
  // Refs to prevent duplicate toasts
  const lastToastTimeRef = useRef({});

  // Fetch wishlist from backend when authenticated
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    
    setLoading(true);
    try {
      const response = await apiWrapper.getWishlist();
      const payload = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data || [];
      if (response?.success && Array.isArray(payload)) {
        setWishlistItems(payload);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      loadWishlistFromLocal();
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  // Load wishlist from localStorage
  const loadWishlistFromLocal = () => {
    try {
      const savedWishlist = localStorage.getItem('furniqo_wishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlistItems([]);
    }
  };

  // Save wishlist to localStorage (for guests)
  const saveWishlistToLocal = useCallback((items) => {
    try {
      localStorage.setItem('furniqo_wishlist', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }, []);

  // Load wishlist on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      loadWishlistFromLocal();
    }
  }, [isAuthenticated, fetchWishlist]);

  // Save to localStorage whenever wishlist changes (for guests)
  useEffect(() => {
    if (!isAuthenticated && wishlistItems.length >= 0) {
      saveWishlistToLocal(wishlistItems);
    }
  }, [wishlistItems, isAuthenticated, saveWishlistToLocal]);

  // Sync wishlist after login
  const syncWishlistAfterLogin = useCallback(async (guestWishlist) => {
    if (!isAuthenticated || !token) return;
    
    setLoading(true);
    try {
      // Sync each guest wishlist item to backend
      for (const item of guestWishlist) {
        await apiWrapper.addToWishlist(item._id);
      }
      // Fetch updated wishlist from backend
      await fetchWishlist();
      // Clear guest wishlist from localStorage
      localStorage.removeItem('furniqo_wishlist');
    } catch (error) {
      console.error('Error syncing wishlist after login:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, fetchWishlist]);

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
    if (isAuthenticated) {
      try {
        const response = await apiWrapper.addToWishlist(product._id);
        if (response?.success) {
          await fetchWishlist();
          showUniqueToast(`${product.name} added to wishlist`, 'success');
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        showUniqueToast('Failed to add to wishlist', 'error');
      }
    } else {
      setWishlistItems(prev => {
        if (prev.some(item => item._id === product._id)) {
          showUniqueToast('Already in your wishlist', 'default', { icon: '💝' });
          return prev;
        }
        showUniqueToast(`${product.name} added to wishlist`, 'success');
        return [...prev, { ...product, addedAt: new Date().toISOString() }];
      });
    }
  }, [isAuthenticated, fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId, skipToast = false) => {
    if (isAuthenticated) {
      try {
        const response = await apiWrapper.removeFromWishlist(productId);
        if (response?.success) {
          await fetchWishlist();
          if (!skipToast) {
            const item = wishlistItems.find(i => i._id === productId);
            if (item) showUniqueToast(`${item.name} removed from wishlist`, 'success');
          }
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        if (!skipToast) showUniqueToast('Failed to remove from wishlist', 'error');
      }
    } else {
      setWishlistItems(prev => {
        const item = prev.find(i => i._id === productId);
        const updated = prev.filter(item => item._id !== productId);
        if (item && !skipToast) {
          showUniqueToast(`${item.name} removed from wishlist`, 'success');
        }
        return updated;
      });
    }
  }, [isAuthenticated, fetchWishlist, wishlistItems]);

  const isWishlisted = useCallback((productId) => {
    return wishlistItems.some(item => item._id === productId);
  }, [wishlistItems]);

  const toggleWishlist = useCallback(async (product) => {
    if (isWishlisted(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product);
    }
  }, [isWishlisted, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(async () => {
    if (wishlistItems.length === 0) {
      showUniqueToast('Wishlist is already empty', 'default');
      return;
    }
    
    if (isAuthenticated) {
      try {
        for (const item of wishlistItems) {
          await apiWrapper.removeFromWishlist(item._id);
        }
        await fetchWishlist();
        showUniqueToast('Wishlist cleared', 'success');
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        showUniqueToast('Failed to clear wishlist', 'error');
      }
    } else {
      setWishlistItems([]);
      showUniqueToast('Wishlist cleared', 'success');
    }
  }, [isAuthenticated, fetchWishlist, wishlistItems]);

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
    
    // Move items to cart
    wishlistItems.forEach(item => {
      addToCartFn(item, 1, null, true);
    });
    
    // Clear wishlist
    if (isAuthenticated) {
      wishlistItems.forEach(async (item) => {
        await removeFromWishlist(item._id, true);
      });
    } else {
      setWishlistItems([]);
    }
    
    showUniqueToast(`${itemCount} item${itemCount > 1 ? 's' : ''} moved to cart`, 'success');
  }, [wishlistItems, isAuthenticated, removeFromWishlist]);

  const value = {
    wishlistItems,
    loading,
    fetchWishlist,
    syncWishlistAfterLogin,
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