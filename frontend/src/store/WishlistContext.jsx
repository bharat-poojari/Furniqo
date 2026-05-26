import { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import apiWrapper from '../services/apiWrapper';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { isAuthenticated, token } = useAuth();
  
  const { showManagedToast } = useNotifications();

  // Fetch wishlist from backend when authenticated
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    
    setLoading(true);
    try {
      const response = await apiWrapper.getWishlist();
      let payload = [];
      if (Array.isArray(response?.data)) {
        payload = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        payload = response.data.data;
      } else if (Array.isArray(response?.data)) {
        payload = response.data;
      }
      setWishlistItems(Array.isArray(payload) ? payload : []);
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
      fetchWishlist().finally(() => setHydrated(true));
    } else {
      loadWishlistFromLocal();
      setHydrated(true);
    }
  }, [isAuthenticated, fetchWishlist]);

  // Save to localStorage whenever wishlist changes (for guests)
  useEffect(() => {
    // Only persist to localStorage after hydration to avoid overwriting
    // existing stored wishlist with an empty initial state.
    if (!isAuthenticated && hydrated) {
      saveWishlistToLocal(wishlistItems);
    }
  }, [wishlistItems, isAuthenticated, saveWishlistToLocal, hydrated]);

  // Sync wishlist after login
  const syncWishlistAfterLogin = useCallback(async (guestWishlist) => {
    if (!isAuthenticated || !token) return;
    
    setLoading(true);
    try {
      const productIds = (guestWishlist || []).map(item => item._id || item.productId || item.id).filter(Boolean);
      for (const productId of productIds) {
        await apiWrapper.addToWishlist(productId);
      }
      await fetchWishlist();
      localStorage.removeItem('furniqo_wishlist');
    } catch (error) {
      console.error('Error syncing wishlist after login:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, fetchWishlist]);

  // use showManagedToast(message, type, options) to display deduped toasts

  const addToWishlist = useCallback(async (product) => {
    if (isAuthenticated) {
      try {
        const response = await apiWrapper.addToWishlist(product._id);
        if (response?.success) {
          await fetchWishlist();
          showManagedToast(`${product.name} added to wishlist`, 'success');
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        showManagedToast('Failed to add to wishlist', 'error');
      }
    } else {
      setWishlistItems(prev => {
        if (prev.some(item => item._id === product._id)) {
          showManagedToast('Already in your wishlist', 'info', { icon: '💝' });
          return prev;
        }
        showManagedToast(`${product.name} added to wishlist`, 'success');
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
            if (item) showManagedToast(`${item.name} removed from wishlist`, 'success');
          }
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        if (!skipToast) showManagedToast('Failed to remove from wishlist', 'error');
      }
    } else {
      setWishlistItems(prev => {
        const item = prev.find(i => i._id === productId);
        const updated = prev.filter(item => item._id !== productId);
        if (item && !skipToast) {
          showManagedToast(`${item.name} removed from wishlist`, 'success');
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
      showManagedToast('Wishlist is already empty', 'info');
      return;
    }
    
    if (isAuthenticated) {
      try {
        for (const item of wishlistItems) {
          await apiWrapper.removeFromWishlist(item._id);
        }
        await fetchWishlist();
        showManagedToast('Wishlist cleared', 'success');
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        showManagedToast('Failed to clear wishlist', 'error');
      }
    } else {
      setWishlistItems([]);
      showManagedToast('Wishlist cleared', 'success');
    }
  }, [isAuthenticated, fetchWishlist, wishlistItems]);

  const moveAllToCart = useCallback(async (addToCartFn) => {
    if (!addToCartFn) {
      showManagedToast('Cart function not available', 'error');
      return;
    }
    
    if (wishlistItems.length === 0) {
      showManagedToast('Wishlist is empty', 'info');
      return;
    }
    
    const itemCount = wishlistItems.length;
    
    if (isAuthenticated) {
      try {
        const productIds = wishlistItems.map(item => item._id || item.productId || item.id).filter(Boolean);
        if (productIds.length > 0) {
          await apiWrapper.moveWishlistToCart(productIds);
        }
        await fetchWishlist();
        showManagedToast(`${itemCount} item${itemCount > 1 ? 's' : ''} moved to cart`, 'success');
      } catch (error) {
        console.error('Error moving wishlist to cart:', error);
        showManagedToast('Failed to move items to cart', 'error');
      }
    } else {
      wishlistItems.forEach(item => {
        addToCartFn(item, 1, null, true);
      });
      setWishlistItems([]);
      showManagedToast(`${itemCount} item${itemCount > 1 ? 's' : ''} moved to cart`, 'success');
    }
  }, [wishlistItems, isAuthenticated, fetchWishlist]);

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