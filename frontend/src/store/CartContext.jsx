import { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import apiWrapper from '../services/apiWrapper';
import { useNotifications } from './NotificationContext';
import { TAX_RATE, FREE_SHIPPING_THRESHOLD } from '../utils/constants';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

const parseJson = (value, fallback = null) => {
  if (typeof value !== 'string') {
    return value ?? fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const normalizeCartItem = (item) => {
  const product = item.product || {};
  const images = parseJson(product.images, []);

  return {
    ...item,
    product: {
      ...product,
      images: Array.isArray(images) ? images : [],
    },
    variant: parseJson(item.variant, null),
  };
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [hydrated, setHydrated] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const { showManagedToast } = useNotifications();

  // Fetch cart from backend when authenticated
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    
    setLoading(true);
    try {
      const response = await apiWrapper.getCart();
      
      // Handle different response structures
      const payload = response?.data ?? response;
      let items = [];
      if (payload?.success && payload?.data?.items) {
        items = payload.data.items;
      } else if (payload?.items) {
        items = payload.items;
      } else if (payload?.data && Array.isArray(payload.data)) {
        items = payload.data;
      }
      
      setCartItems(Array.isArray(items) ? items.map(normalizeCartItem) : []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      loadCartFromLocal();
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  // Load cart from localStorage
  const loadCartFromLocal = () => {
    try {
      const savedCart = localStorage.getItem('furniqo_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsed) ? parsed.map(normalizeCartItem) : []);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCartItems([]);
    }
  };

  // Save cart to localStorage (for guests)
  const saveCartToLocal = useCallback((items) => {
    try {
      localStorage.setItem('furniqo_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().finally(() => setHydrated(true));
    } else {
      loadCartFromLocal();
      setHydrated(true);
    }
  }, [isAuthenticated, fetchCart]);

  // Save to localStorage whenever cart changes (for guests)
  useEffect(() => {
    // Only save to localStorage after initial hydration to avoid overwriting
    // previously stored data with initial empty state on mount.
    if (!isAuthenticated && hydrated) {
      saveCartToLocal(cartItems);
    }
  }, [cartItems, isAuthenticated, saveCartToLocal, hydrated]);

  const getItemPrice = useCallback((item) => {
    return item.variant?.price || item.product?.price || 0;
  }, []);

  const getSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + getItemPrice(item) * item.quantity;
    }, 0);
  }, [cartItems, getItemPrice]);

  const addToCart = useCallback(async (product, quantity = 1, variant = null, skipToast = false) => {
    if (!product || !product._id) {
      console.error('Invalid product:', product);
      showManagedToast('Invalid product', 'error');
      return false;
    }

    if (isAuthenticated) {
      try {
        const response = await apiWrapper.addToCart({
          productId: product._id,
          quantity,
          variantId: variant?.id || variant?._id || null,
        });
        
        // Check response status correctly
        const isSuccess = response?.data?.success || response?.success;
        
        if (isSuccess) {
          await fetchCart();
          if (!skipToast) showManagedToast(`${quantity} × ${product.name} added to cart!`, 'success', { icon: '🛒' });
          return true;
        } else {
          showManagedToast(response?.data?.message || response?.message || 'Failed to add to cart', 'error');
          return false;
        }
        } catch (error) {
        console.error('Error adding to cart:', error);
        showManagedToast(error?.response?.data?.message || 'Failed to add to cart', 'error');
        return false;
      }
    } else {
      // Guest mode - store in localStorage
      setCartItems(prev => {
        const existingIndex = prev.findIndex(item => {
          const sameProduct = item.product._id === product._id;
          const sameVariant = JSON.stringify(item.variant) === JSON.stringify(variant);
          return sameProduct && sameVariant;
        });

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          if (!skipToast) showManagedToast(`Updated ${product.name} quantity`, 'success');
          saveCartToLocal(updated);
          return updated;
        }

        const newItem = {
          _id: `cart_${Date.now()}_${Math.random()}`,
          product,
          quantity,
          variant,
          addedAt: new Date().toISOString(),
        };
        
        const newCart = [...prev, newItem];
        if (!skipToast) showManagedToast(`${product.name} added to cart!`, 'success', { icon: '🛒' });
        saveCartToLocal(newCart);
        return newCart;
      });
      return true;
    }
  }, [isAuthenticated, fetchCart, saveCartToLocal]);

  const removeFromCart = useCallback(async (itemId) => {
    if (isAuthenticated) {
      try {
        const response = await apiWrapper.removeFromCart(itemId);
        const isSuccess = response?.data?.success || response?.success;
        
        if (isSuccess) {
          await fetchCart();
          showManagedToast('Item removed from cart', 'success');
        } else {
          showManagedToast('Failed to remove item', 'error');
        }
        } catch (error) {
        console.error('Error removing from cart:', error);
        showManagedToast('Failed to remove item', 'error');
      }
    } else {
      setCartItems(prev => {
        const item = prev.find(i => i._id === itemId);
        const newCart = prev.filter(item => item._id !== itemId);
        if (item) {
          showManagedToast(`${item.product.name} removed from cart`, 'success');
          saveCartToLocal(newCart);
        }
        return newCart;
      });
    }
  }, [isAuthenticated, fetchCart, saveCartToLocal]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    if (isAuthenticated) {
      try {
        const response = await apiWrapper.updateCartItem(itemId, quantity);
        const isSuccess = response?.data?.success || response?.success;
        
        if (isSuccess) {
          await fetchCart();
        } else {
          showManagedToast('Failed to update quantity', 'error');
        }
        } catch (error) {
        console.error('Error updating quantity:', error);
        showManagedToast('Failed to update quantity', 'error');
      }
    } else {
      setCartItems(prev => {
        const newCart = prev.map(item =>
          item._id === itemId
            ? { ...item, quantity: Math.min(quantity, item.product.stock || 99) }
            : item
        );
        saveCartToLocal(newCart);
        return newCart;
      });
    }
  }, [isAuthenticated, fetchCart, removeFromCart, saveCartToLocal]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await apiWrapper.clearCart();
        const isSuccess = response?.data?.success || response?.success;
        
        if (isSuccess) {
          await fetchCart();
          showManagedToast('Cart cleared', 'success');
        } else {
          showManagedToast('Failed to clear cart', 'error');
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
        showManagedToast('Failed to clear cart', 'error');
      }
    } else {
      setCartItems([]);
      saveCartToLocal([]);
      showManagedToast('Cart cleared', 'success');
    }
  }, [isAuthenticated, fetchCart, saveCartToLocal]);

  // Sync cart after login
  const syncCartAfterLogin = useCallback(async (guestCart) => {
    if (!isAuthenticated || !token) return;
    
    setLoading(true);
    try {
      const normalizedItems = (guestCart || []).map((item) => ({
        productId: item.product?._id || item.productId || item.product,
        quantity: item.quantity || 1,
        variantId: item.variant?.id || item.variant?._id || null,
      }));

      if (normalizedItems.length > 0) {
        await apiWrapper.syncCart(normalizedItems);
      }

      await fetchCart();
      localStorage.removeItem('furniqo_cart');
      showManagedToast('Cart synced successfully', 'success');
    } catch (error) {
      console.error('Error syncing cart after login:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, fetchCart]);

  const applyCoupon = useCallback(async (code) => {
    const subtotal = getSubtotal();
    try {
      const response = await apiWrapper.validateCoupon(code, subtotal);
      
      if (response?.data?.success || response?.success) {
        const couponData = response?.data?.data || response?.data;
        setAppliedCoupon(couponData);
        showManagedToast(`Coupon ${code} applied!`, 'success');
        return true;
      } else {
        showManagedToast(response?.data?.message || response?.message || 'Invalid coupon code', 'error');
        return false;
      }
    } catch (error) {
      console.error('Failed to validate coupon:', error);
      showManagedToast('Failed to apply coupon', 'error');
      return false;
    }
  }, [getSubtotal]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showManagedToast('Coupon removed', 'success');
  }, []);

  const getDiscount = useCallback(() => {
    if (!appliedCoupon) return 0;

    const subtotal = getSubtotal();

    if (appliedCoupon.type === 'percentage') {
      return Math.min(
        (subtotal * appliedCoupon.discount) / 100,
        appliedCoupon.maxDiscount || Infinity
      );
    } else if (appliedCoupon.type === 'fixed') {
      return appliedCoupon.discount;
    } else if (appliedCoupon.type === 'freeShipping') {
      return 0;
    }

    return 0;
  }, [appliedCoupon, getSubtotal]);

  const getShippingCost = useCallback(() => {
    if (appliedCoupon?.type === 'freeShipping') return 0;

    const subtotal = getSubtotal() - getDiscount();
    if (subtotal >= FREE_SHIPPING_THRESHOLD && shippingMethod === 'standard') return 0;

    const methods = {
      standard: subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 29.99,
      express: 49.99,
      overnight: 79.99,
    };

    return methods[shippingMethod] || 0;
  }, [getSubtotal, getDiscount, shippingMethod, appliedCoupon]);

  const getTax = useCallback(() => {
    const subtotal = getSubtotal();
    const discount = getDiscount();
    return (subtotal - discount) * TAX_RATE;
  }, [getSubtotal, getDiscount]);

  const getTotal = useCallback(() => {
    const subtotal = getSubtotal();
    const discount = getDiscount();
    const shipping = getShippingCost();
    const tax = getTax();

    return Math.max(0, subtotal - discount + shipping + tax);
  }, [getSubtotal, getDiscount, getShippingCost, getTax]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const isEmpty = useMemo(() => cartItems.length === 0, [cartItems]);

  const value = {
    cartItems,
    loading,
    isEmpty,
    appliedCoupon,
    shippingMethod,
    fetchCart,
    syncCartAfterLogin,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    setShippingMethod,
    getItemPrice,
    getSubtotal,
    getDiscount,
    getShippingCost,
    getTax,
    getTotal,
    getCartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};