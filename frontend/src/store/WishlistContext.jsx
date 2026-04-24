import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

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

  const addToWishlist = useCallback(async (product) => {
    setWishlistItems(prev => {
      if (prev.some(item => item._id === product._id)) {
        toast('Already in your wishlist!', { icon: '💝' });
        return prev;
      }
      toast.success(`${product.name} added to wishlist!`, { icon: '❤️' });
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems(prev => {
      const item = prev.find(i => i._id === productId);
      const updated = prev.filter(item => item._id !== productId);
      if (item) {
        toast.success(`${item.name} removed from wishlist`);
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
    setWishlistItems([]);
    toast.success('Wishlist cleared');
  }, []);

  const moveAllToCart = useCallback((addToCartFn) => {
    if (!addToCartFn) {
      toast.error('Cart function not available');
      return;
    }
    
    wishlistItems.forEach(item => {
      addToCartFn(item, 1);
    });
    
    setWishlistItems([]);
    toast.success('All items moved to cart!');
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