import { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import apiWrapper from '../services/apiWrapper';
import { TAX_RATE, FREE_SHIPPING_THRESHOLD } from '../utils/constants';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const { isAuthenticated } = useAuth();

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    saveCart();
  }, [cartItems, appliedCoupon]);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('furniqo_cart');
      const savedCoupon = localStorage.getItem('furniqo_coupon');

      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      }
      if (savedCoupon) {
        try {
          const parsed = JSON.parse(savedCoupon);
          setAppliedCoupon(parsed && typeof parsed === 'object' ? parsed : null);
        } catch {
          setAppliedCoupon(null);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      setAppliedCoupon(null);
    }
  };

  const saveCart = () => {
    try {
      localStorage.setItem('furniqo_cart', JSON.stringify(cartItems));
      if (appliedCoupon) {
        localStorage.setItem('furniqo_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('furniqo_coupon');
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // Define getItemPrice first since it's used by other functions
  const getItemPrice = useCallback((item) => {
    return item.variant?.price || item.product.price;
  }, []);

  // Define getSubtotal before it's used in applyCoupon
  const getSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + getItemPrice(item) * item.quantity;
    }, 0);
  }, [cartItems, getItemPrice]);

  const addToCart = useCallback(async (product, quantity = 1, variant = null, skipToast = false) => {
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
        return updated;
      }

      return [...prev, {
        _id: `cart_${Date.now()}`,
        product,
        quantity,
        variant,
        addedAt: new Date().toISOString(),
      }];
    });

    apiWrapper.trackEvent({
      type: 'add_to_cart',
      productId: product._id,
      productName: product.name,
      quantity,
      variant,
    }).catch(() => {});
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item._id === itemId
          ? { ...item, quantity: Math.min(quantity, item.product.stock || 99) }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
  }, []);

  const applyCoupon = useCallback(async (code) => {
    const subtotal = getSubtotal();
    try {
      const response = await apiWrapper.validateCoupon(code, subtotal);
      
      if (response.data.success) {
        setAppliedCoupon(response.data.data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Failed to validate coupon:', error);
      return false;
    }
  }, [getSubtotal]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
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
    }

    return 0;
  }, [appliedCoupon, getSubtotal]);

  const getShippingCost = useCallback(() => {
    if (appliedCoupon?.type === 'freeShipping') return 0;

    const subtotal = getSubtotal();
    if (subtotal >= FREE_SHIPPING_THRESHOLD && shippingMethod === 'standard') return 0;

    const methods = {
      standard: subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 29.99,
      express: 49.99,
      overnight: 79.99,
    };

    return methods[shippingMethod] || 0;
  }, [getSubtotal, shippingMethod, appliedCoupon]);

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