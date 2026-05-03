// src/pages/Cart.jsx
import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, FiArrowLeft, FiTrash2, FiMinus, FiPlus,
  FiHeart, FiTag, FiLoader, FiTruck, FiShield, FiClock,
  FiDollarSign, FiPercent, FiChevronRight, FiGift, FiLock,
  FiRefreshCw, FiAlertCircle, FiCalendar, FiStar, FiChevronDown, FiCheckCircle,
  FiAward, FiX, FiEye, FiShare2, FiBell, FiCopy, FiGrid, FiList,
  FiPackage, FiCheck, FiChevronUp
} from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal, FaGooglePay, FaApplePay } from 'react-icons/fa';
import { useCart } from '../store/CartContext';
import { useWishlist } from '../store/WishlistContext';
import { useAuth } from '../store/AuthContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { CartSkeleton } from '../components/common/Skeleton';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';
import confetti from 'canvas-confetti';
import apiWrapper from '../services/apiWrapper';
import { coupons } from '../data/data.js';

// Static animation variants - no spring physics for better performance
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

// Static modal variants - no spring physics
const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.1 } },
};

// Memoized Quantity Selector - no motion, pure DOM
const QuantitySelector = memo(({ quantity, onIncrease, onDecrease, maxQuantity, isDisabled }) => {
  return (
    <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden">
      <button
        onClick={onDecrease}
        className="p-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
        style={{ width: '28px', height: '28px' }}
        disabled={quantity <= 1 || isDisabled}
      >
        <FiMinus className="h-3 w-3" />
      </button>
      <span className="w-8 text-center font-medium text-xs">{quantity}</span>
      <button
        onClick={onIncrease}
        className="p-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
        style={{ width: '28px', height: '28px' }}
        disabled={quantity >= maxQuantity || isDisabled}
      >
        <FiPlus className="h-3 w-3" />
      </button>
    </div>
  );
});

QuantitySelector.displayName = 'QuantitySelector';

// Pure component for share function (no hooks)
const shareProduct = async (product) => {
  const shareUrl = `${window.location.origin}/products/${product.slug}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Furniqo!`,
        url: shareUrl,
      });
      toast.success('Shared successfully!');
    } catch (error) {
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!');
        } catch {
          toast.error('Failed to share');
        }
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  }
};

// Memoized Product Row for List View - no motion animations on hover
const CartProductRow = memo(({ 
  item, getItemPrice, updateQuantity, removeFromCart, moveToWishlist, 
  isWishlisted, isUpdating, onQuickView, onShare, setShowRemoveConfirm, setItemToRemove 
}) => {
  const price = getItemPrice(item);
  const originalPrice = item.product.originalPrice || item.product.price;
  const inWishlist = isWishlisted(item.product._id);
  const maxQuantity = Math.min(item.product.stock || 99, 10);
  const discount = calculateDiscount(price, originalPrice);
  const savings = originalPrice - price;

  const handleRemoveClick = useCallback(() => {
    setItemToRemove({ id: item._id, name: item.product.name });
    setShowRemoveConfirm(true);
  }, [item._id, item.product.name, setItemToRemove, setShowRemoveConfirm]);

  const handleMoveToWishlist = useCallback(() => {
    if (!isUpdating && !inWishlist) {
      moveToWishlist(item);
    }
  }, [isUpdating, inWishlist, moveToWishlist, item]);

  const handleIncrease = useCallback(() => {
    if (item.quantity < maxQuantity && !isUpdating) {
      updateQuantity(item._id, item.quantity + 1);
    }
  }, [item.quantity, maxQuantity, isUpdating, updateQuantity, item._id]);

  const handleDecrease = useCallback(() => {
    if (item.quantity > 1 && !isUpdating) {
      updateQuantity(item._id, item.quantity - 1);
    }
  }, [item.quantity, isUpdating, updateQuantity, item._id]);

  const handleQuickView = useCallback(() => onQuickView(item.product), [onQuickView, item.product]);
  const handleShare = useCallback(() => onShare(item.product), [onShare, item.product]);

  return (
    <div className="group bg-white dark:bg-neutral-800 rounded-xl hover:shadow-lg transition-all overflow-hidden border border-neutral-200 dark:border-neutral-700">
      <div className="flex gap-3 p-3">
        <Link to={`/products/${item.product.slug}`} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-neutral-100">
          <img 
            src={item.product.images?.[0] || 'https://placehold.co/400x400/eee/999?text=No+Image'} 
            alt={item.product.name} 
            className="w-full h-full object-cover" 
            loading="lazy" 
          />
          {discount > 0 && (
            <div className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              -{discount}%
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link to={`/products/${item.product.slug}`}>
                <h3 className="font-semibold text-sm hover:text-primary-600 truncate">
                  {item.product.name}
                </h3>
              </Link>
              {item.variant?.color && (
                <span className="text-[10px] text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                  {item.variant.color}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={handleQuickView} className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 transition-colors inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }} title="Quick View">
                <FiEye className="h-3.5 w-3.5" />
              </button>
              <button onClick={handleShare} className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 transition-colors inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }} title="Share">
                <FiShare2 className="h-3.5 w-3.5" />
              </button>
              <button onClick={handleRemoveClick} className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-red-100 transition-colors inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }} title="Remove">
                <FiTrash2 className="h-3.5 w-3.5 text-red-500" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1.5 overflow-hidden flex-nowrap">
              <span className="text-sm font-bold text-primary-600 whitespace-nowrap flex-shrink-0">{formatPrice(price)}</span>
              {originalPrice > price && (
                <span className="text-[9px] text-neutral-400 line-through whitespace-nowrap flex-shrink-0">{formatPrice(originalPrice)}</span>
              )}
              {savings > 0 && (
                <span className="text-[9px] text-green-600 font-medium whitespace-nowrap flex-shrink-0">Save {formatPrice(savings)}</span>
              )}
            </div>

            <div className="flex gap-1.5">
              <QuantitySelector
                quantity={item.quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                maxQuantity={maxQuantity}
                isDisabled={isUpdating}
              />
              {!inWishlist && (
                <button
                  onClick={handleMoveToWishlist}
                  disabled={isUpdating}
                  className="p-1.5 rounded-lg border border-neutral-200 bg-white dark:bg-neutral-800 hover:border-red-300 hover:bg-red-50 transition-all inline-flex items-center justify-center"
                  style={{ width: '32px', height: '32px' }}
                  title="Move to Wishlist"
                >
                  <FiHeart className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CartProductRow.displayName = 'CartProductRow';

// Memoized Product Card for Grid View - simplified hover without motion
const CartProductCard = memo(({ 
  item, getItemPrice, updateQuantity, removeFromCart, moveToWishlist, 
  isWishlisted, isUpdating, onQuickView, onShare, setShowRemoveConfirm, setItemToRemove 
}) => {
  const price = getItemPrice(item);
  const originalPrice = item.product.originalPrice || item.product.price;
  const inWishlist = isWishlisted(item.product._id);
  const maxQuantity = Math.min(item.product.stock || 99, 10);
  const discount = calculateDiscount(price, originalPrice);
  const savings = originalPrice - price;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRemoveClick = useCallback(() => {
    setItemToRemove({ id: item._id, name: item.product.name });
    setShowRemoveConfirm(true);
  }, [item._id, item.product.name, setItemToRemove, setShowRemoveConfirm]);

  const handleMoveToWishlist = useCallback(() => {
    if (!isUpdating && !inWishlist) {
      moveToWishlist(item);
    }
  }, [isUpdating, inWishlist, moveToWishlist, item]);

  const handleIncrease = useCallback(() => {
    if (item.quantity < maxQuantity && !isUpdating) {
      updateQuantity(item._id, item.quantity + 1);
    }
  }, [item.quantity, maxQuantity, isUpdating, updateQuantity, item._id]);

  const handleDecrease = useCallback(() => {
    if (item.quantity > 1 && !isUpdating) {
      updateQuantity(item._id, item.quantity - 1);
    }
  }, [item.quantity, isUpdating, updateQuantity, item._id]);

  const handleQuickView = useCallback(() => onQuickView(item.product), [onQuickView, item.product]);
  const handleShare = useCallback(() => onShare(item.product), [onShare, item.product]);

  const handleHoverStart = useCallback(() => setIsHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHovered(false), []);

  return (
    <div
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      className="group relative bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 h-full flex flex-col border border-neutral-200 dark:border-neutral-700"
    >
      <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-700 aspect-square">
        {!imageLoaded && <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 animate-pulse" />}
        <Link to={`/products/${item.product.slug}`}>
          <img
            src={item.product.images?.[0] || 'https://placehold.co/400x400/eee/999?text=No+Image'}
            alt={item.product.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </Link>
        
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-lg z-10">
            -{discount}%
          </div>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button onClick={handleQuickView} className="p-1.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow-md hover:scale-105 transition-all inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }} title="Quick View">
            <FiEye className="h-3.5 w-3.5" />
          </button>
          <button onClick={handleShare} className="p-1.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow-md hover:scale-105 transition-all inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }} title="Share">
            <FiShare2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="p-2.5 flex flex-col flex-grow">
        <Link to={`/products/${item.product.slug}`} className="block mb-1">
          <h3 className="font-semibold text-xs text-neutral-900 dark:text-white hover:text-primary-600 transition-colors truncate">
            {item.product.name}
          </h3>
        </Link>
        
        {item.product.rating && (
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`h-2 w-2 ${i < Math.floor(item.product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-300'}`} />
              ))}
            </div>
            <span className="text-[8px] text-neutral-500 truncate">({item.product.numReviews || 0})</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 overflow-hidden flex-nowrap mb-1">
          <span className="text-sm font-bold text-primary-600 whitespace-nowrap flex-shrink-0">{formatPrice(price)}</span>
          {originalPrice > price && (
            <span className="text-[9px] text-neutral-400 line-through whitespace-nowrap flex-shrink-0">{formatPrice(originalPrice)}</span>
          )}
          {savings > 0 && (
            <span className="text-[9px] text-green-600 font-medium whitespace-nowrap flex-shrink-0">Save {formatPrice(savings)}</span>
          )}
        </div>

        <div className="flex gap-1.5 mt-auto pt-1.5 border-t border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-1.5">
            <QuantitySelector
              quantity={item.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              maxQuantity={maxQuantity}
              isDisabled={isUpdating}
            />
          </div>
          <button onClick={handleMoveToWishlist} disabled={isUpdating} className="p-1.5 rounded-lg border border-neutral-200 bg-white dark:bg-neutral-800 hover:border-red-300 hover:bg-red-50 transition-all inline-flex items-center justify-center" style={{ width: '32px', height: '32px' }} title="Move to Wishlist">
            <FiHeart className={`h-3.5 w-3.5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button onClick={handleRemoveClick} className="p-1.5 rounded-lg border border-neutral-200 bg-white dark:bg-neutral-800 hover:border-red-300 hover:bg-red-50 transition-all inline-flex items-center justify-center" style={{ width: '32px', height: '32px' }} title="Remove">
            <FiTrash2 className="h-3.5 w-3.5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
});

CartProductCard.displayName = 'CartProductCard';

// Memoized Category Product Card
const CategoryProductCard = memo(({ product, onAddToCart, onQuickView, onWishlistToggle, isWishlisted, isAddingToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;
  const inWishlist = isWishlisted(product._id);

  const handleAddClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  }, [onAddToCart, product]);

  const handleQuickViewClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  }, [onQuickView, product]);

  const handleWishlistClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle(product);
  }, [onWishlistToggle, product]);

  return (
    <div className="w-[130px] sm:w-[150px] flex-shrink-0">
      <div className="group relative bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-150 border border-neutral-200 dark:border-neutral-700">
        <Link to={`/products/${product.slug}`} className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-700 aspect-square block">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 animate-pulse" />
          )}
          <img
            src={product.images?.[0] || 'https://placehold.co/400x400/eee/999?text=No+Image'}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          {discount > 0 && (
            <div className="absolute top-1 left-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-sm shadow-lg z-10">
              -{discount}%
            </div>
          )}
        </Link>

        <div className="p-2 flex flex-col flex-grow">
          <Link to={`/products/${product.slug}`} className="block mb-0.5">
            <h3 className="font-medium text-[10px] sm:text-[11px] text-neutral-900 dark:text-white hover:text-primary-600 transition-colors truncate">
              {product.name}
            </h3>
          </Link>
          
          {product.rating && (
            <div className="flex items-center gap-0.5 mb-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`h-1.5 w-1.5 ${i < Math.floor(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-300'}`} />
                ))}
              </div>
              <span className="text-[6px] text-neutral-500 truncate">({product.numReviews || 0})</span>
            </div>
          )}

          <div className="flex items-center gap-1 overflow-hidden flex-nowrap mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-primary-600 whitespace-nowrap flex-shrink-0">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-[7px] text-neutral-400 line-through whitespace-nowrap flex-shrink-0">{formatPrice(product.originalPrice)}</span>
            )}
            {savings > 0 && (
              <span className="text-[6px] text-green-600 font-medium whitespace-nowrap flex-shrink-0 hidden sm:inline-block">Save {formatPrice(savings)}</span>
            )}
          </div>

          <div className="flex gap-1 mt-auto pt-1">
            <button
              onClick={handleAddClick}
              disabled={isAddingToCart}
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-1 rounded-md text-[8px] sm:text-[9px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-0.5"
            >
              {isAddingToCart ? (
                <>
                  <div className="h-2 w-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding
                </>
              ) : (
                <>
                  <FiShoppingCart className="h-2 w-2" />
                  Add
                </>
              )}
            </button>
            <button
              onClick={handleQuickViewClick}
              className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 transition-colors inline-flex items-center justify-center"
              style={{ width: '22px', height: '22px' }}
              title="Quick View"
            >
              <FiEye className="h-2.5 w-2.5" />
            </button>
            <button
              onClick={handleWishlistClick}
              className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-700 hover:bg-red-100 transition-colors inline-flex items-center justify-center"
              style={{ width: '22px', height: '22px' }}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <FiHeart className={`h-2.5 w-2.5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

CategoryProductCard.displayName = 'CategoryProductCard';

// Memoized Category Products Horizontal Scroll Component
const CategoryProductsSection = memo(({ 
  title, 
  categoryId, 
  categoryName, 
  cartItems, 
  wishlistItems, 
  onAddToCart, 
  onQuickView, 
  onWishlistToggle, 
  isWishlisted, 
  isAddingToCart 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchCategoryProducts = useCallback(async () => {
    if (!categoryId && !categoryName) {
      if (isMountedRef.current) setLoading(false);
      return;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);
    
    try {
      let productsData = [];
      
      if (categoryId) {
        try {
          const response = await apiWrapper.getProductsByCategory(categoryId, 10);
          
          if (!isMountedRef.current) return;
          
          if (response?.data?.success && response.data.data) {
            productsData = response.data.data;
          } else if (response?.data && Array.isArray(response.data)) {
            productsData = response.data;
          } else if (Array.isArray(response)) {
            productsData = response;
          }
        } catch (err) {
          console.warn(`Failed to fetch by category ID ${categoryId}:`, err);
        }
      }
      
      if (productsData.length === 0 && categoryName) {
        try {
          const response = await apiWrapper.getProductsByCategoryName(categoryName, 10);
          
          if (!isMountedRef.current) return;
          
          if (response?.data?.success && response.data.data) {
            productsData = response.data.data;
          } else if (response?.data && Array.isArray(response.data)) {
            productsData = response.data;
          } else if (Array.isArray(response)) {
            productsData = response;
          }
        } catch (err) {
          console.warn(`Failed to fetch by category name ${categoryName}:`, err);
        }
      }
      
      if (!isMountedRef.current) return;
      
      const cartProductIds = new Set(cartItems.map(item => item.product?._id || item._id));
      const wishlistProductIds = new Set(wishlistItems.map(item => item._id));
      const filteredProducts = productsData.filter(p => p && p._id && !cartProductIds.has(p._id) && !wishlistProductIds.has(p._id));
      
      setProducts(filteredProducts.slice(0, 10));
    } catch (error) {
      if (isMountedRef.current && error.name !== 'AbortError' && error.name !== 'CanceledError') {
        console.error(`Error fetching products for category ${categoryName}:`, error);
        setError(error.message);
        setProducts([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [categoryId, categoryName, cartItems, wishlistItems]);

  useEffect(() => {
    fetchCategoryProducts();
  }, [fetchCategoryProducts]);

  if (loading) {
    return (
      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">{title}</h2>
        </div>
        <div className="overflow-x-auto overflow-y-hidden pb-3 scrollbar-hide">
          <div className="flex gap-2 w-max">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[130px] sm:w-[150px] flex-shrink-0">
                <div className="bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-lg aspect-square"></div>
                <div className="mt-2 h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                <div className="mt-1 h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !products || products.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">{title}</h2>
        <Link to={`/categories/${categoryId || categoryName?.toLowerCase()}`} className="text-primary-600 text-[10px] sm:text-xs flex items-center gap-0.5 hover:underline">
          View All <FiChevronRight className="h-2.5 w-2.5" />
        </Link>
      </div>
      
      <div className="overflow-x-auto overflow-y-hidden pb-3 scrollbar-hide">
        <div className="flex gap-2 w-max">
          {products.map((product) => (
            <CategoryProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onWishlistToggle={onWishlistToggle}
              isWishlisted={isWishlisted}
              isAddingToCart={isAddingToCart[product._id]}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

CategoryProductsSection.displayName = 'CategoryProductsSection';

// Memoized Related Products Component
const RelatedProductsHorizontal = memo(({ cartItems, wishlistItems, onAddToCart, onQuickView, onWishlistToggle, isWishlisted, isAddingToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchRelatedProducts = useCallback(async () => {
    const itemsToUse = cartItems.length > 0 ? cartItems : wishlistItems;
    if (!itemsToUse || itemsToUse.length === 0) {
      if (isMountedRef.current) setLoading(false);
      return;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setLoading(true);
    
    try {
      const firstProductId = itemsToUse[0]?.product?._id || itemsToUse[0]?._id;
      
      let productsData = [];
      
      if (firstProductId) {
        const response = await apiWrapper.getRelatedProducts(firstProductId, 10);
        
        if (!isMountedRef.current) return;
        
        if (response?.data?.success && response.data.data) {
          productsData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          productsData = response.data;
        } else if (Array.isArray(response)) {
          productsData = response;
        }
      }
      
      const cartProductIds = new Set(cartItems.map(item => item.product?._id || item._id));
      const wishlistProductIds = new Set(wishlistItems.map(item => item._id));
      const filteredProducts = productsData.filter(p => p && p._id && !cartProductIds.has(p._id) && !wishlistProductIds.has(p._id));
      
      setProducts(filteredProducts.slice(0, 10));
    } catch (error) {
      if (isMountedRef.current && error.name !== 'AbortError' && error.name !== 'CanceledError') {
        console.error('Error fetching related products:', error);
        setProducts([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [cartItems, wishlistItems]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [fetchRelatedProducts]);

  if (loading) {
    return (
      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">Frequently Bought Together</h2>
        </div>
        <div className="overflow-x-auto overflow-y-hidden pb-3 scrollbar-hide">
          <div className="flex gap-2 w-max">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[130px] sm:w-[150px] flex-shrink-0">
                <div className="bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-lg aspect-square"></div>
                <div className="mt-2 h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                <div className="mt-1 h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">Frequently Bought Together</h2>
        <Link to="/products" className="text-primary-600 text-[10px] sm:text-xs flex items-center gap-0.5 hover:underline">
          View All <FiChevronRight className="h-2.5 w-2.5" />
        </Link>
      </div>
      
      <div className="overflow-x-auto overflow-y-hidden pb-3 scrollbar-hide">
        <div className="flex gap-2 w-max">
          {products.map((product) => (
            <CategoryProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onWishlistToggle={onWishlistToggle}
              isWishlisted={isWishlisted}
              isAddingToCart={isAddingToCart[product._id]}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

RelatedProductsHorizontal.displayName = 'RelatedProductsHorizontal';

// Memoized QuickView Modal Component - reduced motion complexity
const QuickViewModal = memo(({ product, isOpen, onClose, addToCart, isWishlisted, toggleWishlist }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuantity(1);
      setSelectedImage(0);
      setIsAddingToCart(false);
      setAddedToCart(false);
    }
  }, [isOpen]);

  const handleQuantityChange = useCallback((delta) => {
    setQuantity(prev => {
      const newQuantity = prev + delta;
      if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
        return newQuantity;
      }
      return prev;
    });
  }, [product?.stock]);

  const handleAddToCart = useCallback(async () => {
    if (!product || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
      setAddedToCart(true);
      toast.success(`${quantity} × ${product.name} added to cart!`);
      setTimeout(() => {
        setAddedToCart(false);
        onClose();
      }, 1200);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, isAddingToCart, addToCart, quantity, onClose]);

  const handleWishlistClick = useCallback(() => {
    if (product) {
      toggleWishlist(product);
    }
  }, [product, toggleWishlist]);

  const handleShare = useCallback(() => {
    if (product) {
      shareProduct(product);
    }
  }, [product]);

  if (!product) return null;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const rating = product.rating || 4.5;
  const reviewCount = product.numReviews || 128;
  const inWishlist = isWishlisted(product._id);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-10"
            >
              <FiX className="h-5 w-5 text-neutral-500" />
            </button>
            
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={product.images?.[selectedImage] || 'https://via.placeholder.com/500x500?text=No+Image'}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                    {discount > 0 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                        -{discount}% OFF
                      </div>
                    )}
                  </div>
                  
                  {product.images && product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                            selectedImage === idx 
                              ? 'border-primary-500 ring-2 ring-primary-500/20' 
                              : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} view ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < Math.floor(rating)
                              ? 'fill-yellow-500 text-yellow-500'
                              : i < rating
                              ? 'fill-yellow-500 text-yellow-500 opacity-50'
                              : 'text-neutral-300 dark:text-neutral-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      {rating} ({reviewCount} reviews)
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="text-2xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                  </div>

                  <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-sm">
                    {product.shortDescription || product.description?.substring(0, 120) || 'No description available.'}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {product.stock > 0 && (
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Quantity
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                          className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors inline-flex items-center justify-center"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <FiMinus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center font-semibold text-base">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= product.stock}
                          className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors inline-flex items-center justify-center"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <FiPlus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || isAddingToCart}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-2.5 rounded-xl font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                    >
                      {isAddingToCart ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding...
                        </div>
                      ) : addedToCart ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <FiCheckCircle className="h-4 w-4" />
                          Added!
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <FiShoppingCart className="h-4 w-4" />
                          Add to Cart - {formatPrice(product.price * quantity)}
                        </div>
                      )}
                    </button>

                    <button
                      onClick={handleWishlistClick}
                      className="p-2.5 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 transition-all inline-flex items-center justify-center"
                      style={{ width: '44px', height: '44px' }}
                    >
                      <FiHeart className={`h-4 w-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-2.5 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all inline-flex  items-center justify-center"
                      style={{ width: '44px', height: '44px' }}
                    >
                      <FiShare2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

QuickViewModal.displayName = 'QuickViewModal';

// Memoized Remove Confirm Modal - simplified motion
const RemoveConfirmModal = memo(({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      variants={modalOverlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        variants={modalContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-2xl"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiTrash2 className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Remove Item?</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Are you sure you want to remove <span className="font-medium">{itemName}</span> from your cart?
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700">Remove</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

RemoveConfirmModal.displayName = 'RemoveConfirmModal';

// Memoized Clear Cart Confirm Modal
const ClearCartConfirmModal = memo(({ isOpen, onClose, onConfirm, itemCount }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      variants={modalOverlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        variants={modalContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-2xl"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiAlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Clear Cart?</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Are you sure you want to remove all {itemCount} items from your cart?
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700">Clear All</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

ClearCartConfirmModal.displayName = 'ClearCartConfirmModal';

// Memoized Mobile Order Summary Component - reduced motion complexity
const MobileOrderSummary = memo(({ 
  subtotal, discount, shipping, tax, total, 
  couponCode, setCouponCode, applyingCoupon, handleApplyCoupon, 
  appliedLocalCoupon, appliedCoupon, handleRemoveLocalCoupon,
  selectedGiftWrap, setSelectedGiftWrap, rushDelivery, setRushDelivery, 
  rushDeliveryCost, insurance, setInsurance, donateToCharity, setDonateToCharity,
  deliverySlots, activeDeliverySlot, setActiveDeliverySlot,
  showGiftOptions, setShowGiftOptions
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => setIsExpanded(prev => !prev), []);

  return (
    <div className="lg:hidden mb-4">
      <button
        onClick={toggleExpand}
        className="w-full bg-white dark:bg-neutral-800 rounded-xl p-3 flex items-center justify-between shadow-md border border-neutral-200 dark:border-neutral-700"
      >
        <div className="flex items-center gap-2">
          <FiShoppingCart className="h-4 w-4 text-primary-500" />
          <span className="font-semibold text-sm text-neutral-900 dark:text-white">Order Summary</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary-600">{formatPrice(total)}</span>
          {isExpanded ? <FiChevronUp className="h-4 w-4 text-neutral-600 dark:text-neutral-400" /> : <FiChevronDown className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <div className="p-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                <span className="font-bold text-neutral-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between py-1 text-green-600 dark:text-green-400 border-b border-neutral-200 dark:border-neutral-700">
                  <span className="flex items-center gap-0.5"><FiPercent className="h-3 w-3" /> Discount</span>
                  <span className="font-bold">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-0.5 text-neutral-600 dark:text-neutral-400">
                  <FiTruck className="h-3 w-3" />
                  <span>Shipping</span>
                </div>
                <span className={cn("font-bold", shipping === 0 && "text-green-600 dark:text-green-400", "text-neutral-900 dark:text-white")}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-0.5 text-neutral-600 dark:text-neutral-400">
                  <FiDollarSign className="h-3 w-3" />
                  <span>Tax</span>
                </div>
                <span className="font-bold text-neutral-900 dark:text-white">{formatPrice(tax)}</span>
              </div>

              <div className="flex gap-1 pt-1">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Promo code"
                  className="flex-1 px-2 py-1.5 text-[10px] bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-1 focus:ring-primary-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                  className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-medium rounded-lg disabled:opacity-50"
                >
                  {applyingCoupon ? <div className="animate-spin rounded-full h-2.5 w-2.5 border-2 border-white border-t-transparent" /> : 'Apply'}
                </button>
              </div>

              {(appliedLocalCoupon || appliedCoupon) && (
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-medium text-green-700 dark:text-green-400">{(appliedLocalCoupon?.code || appliedCoupon?.code)} applied</span>
                    <button onClick={handleRemoveLocalCoupon} className="text-[8px] text-red-500 dark:text-red-400 hover:text-red-600">Remove</button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowGiftOptions(!showGiftOptions)}
                className="w-full flex items-center justify-between text-[10px] text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 py-1"
              >
                <span className="flex items-center gap-1"><FiGift className="h-3 w-3" /> Gift options</span>
                <FiChevronDown className={`h-3 w-3 transition-transform ${showGiftOptions ? 'rotate-180' : ''}`} />
              </button>

              {showGiftOptions && (
                <div className="space-y-1 pl-2">
                  {[
                    { label: "Gift Wrap", price: "+₹299", checked: selectedGiftWrap, setter: setSelectedGiftWrap },
                    { label: "Rush Delivery", price: rushDelivery ? `+₹${rushDeliveryCost}` : "+₹499", checked: rushDelivery, setter: setRushDelivery },
                    { label: "Shipping Insurance", price: "+₹199", checked: insurance, setter: setInsurance },
                    { label: "Donate to Charity", price: "+₹100", checked: donateToCharity, setter: setDonateToCharity },
                  ].map((option) => (
                    <label key={option.label} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-1.5">
                        <input type="checkbox" checked={option.checked} onChange={(e) => option.setter(e.target.checked)} className="w-3 h-3 rounded text-primary-600 focus:ring-primary-500" />
                        <span className="text-[9px] text-neutral-700 dark:text-neutral-300">{option.label}</span>
                      </div>
                      <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400">{option.price}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="pt-1">
                <h4 className="text-[9px] font-bold mb-1 flex items-center gap-1 text-neutral-900 dark:text-white">
                  <FiCalendar className="h-2.5 w-2.5 text-primary-500" /> Delivery Slot
                </h4>
                <div className="space-y-1">
                  {deliverySlots.slice(0, 2).map((slot, idx) => (
                    <label 
                      key={idx} 
                      className={cn(
                        "flex items-center gap-1.5 p-1.5 border rounded-lg cursor-pointer transition-all",
                        activeDeliverySlot === idx 
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
                          : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                      )}
                    >
                      <input 
                        type="radio" 
                        name="delivery" 
                        className="text-primary-600 w-2.5 h-2.5" 
                        checked={activeDeliverySlot === idx} 
                        onChange={() => setActiveDeliverySlot(idx)} 
                      />
                      <div>
                        <p className="text-[9px] font-semibold text-neutral-900 dark:text-white">{slot.date}</p>
                        <p className="text-[6px] text-neutral-500 dark:text-neutral-400">{slot.day} • {slot.time}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">Total</span>
                  <span className="text-base font-bold text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
                </div>
              </div>

              <Link to="/checkout" className="block w-full mt-2">
                <Button variant="primary" size="sm" className="w-full text-[11px] py-1.5">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

MobileOrderSummary.displayName = 'MobileOrderSummary';

// Main Cart Component
const Cart = () => {
  const {
    cartItems,
    loading,
    isEmpty,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemPrice,
    getSubtotal,
    getDiscount,
    getShippingCost,
    getTax,
    getTotal,
    appliedCoupon,
    removeCoupon,
    addToCart,
  } = useCart();
  
  const { addToWishlist, isWishlisted, wishlistItems, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  
  const [viewMode, setViewMode] = useState('grid');
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [selectedGiftWrap, setSelectedGiftWrap] = useState(false);
  const [rushDelivery, setRushDelivery] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [donateToCharity, setDonateToCharity] = useState(false);
  const [activeDeliverySlot, setActiveDeliverySlot] = useState(0);
  const [isUpdatingItems, setIsUpdatingItems] = useState({});
  const [isAddingToCartRelated, setIsAddingToCartRelated] = useState({});
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [localDiscount, setLocalDiscount] = useState(0);
  const [appliedLocalCoupon, setAppliedLocalCoupon] = useState(null);
  const [showGiftOptions, setShowGiftOptions] = useState(false);

  // Memoized unique categories from cart items
  const getUniqueCategoriesFromCart = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return [];
    
    const categoriesMap = new Map();
    
    for (let i = cartItems.length - 1; i >= 0; i--) {
      const item = cartItems[i];
      const categoryId = item.product.categoryId || item.product.category?._id;
      const categoryName = item.product.categoryName || item.product.category?.name;
      
      if (categoryId && categoryName && !categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: categoryName,
          slug: item.product.categorySlug || item.product.category?.slug,
          productName: item.product.name
        });
      }
      
      if (categoriesMap.size >= 2) break;
    }
    
    return Array.from(categoriesMap.values());
  }, [cartItems]);

  // Memoized cart stats
  const stats = useMemo(() => ({
    totalItems: cartItems.length,
    totalValue: getSubtotal(),
    totalSavings: cartItems.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      const currentPrice = getItemPrice(item);
      if (originalPrice > currentPrice) {
        return total + ((originalPrice - currentPrice) * item.quantity);
      }
      return total;
    }, 0) + (getDiscount() + localDiscount)
  }), [cartItems, getSubtotal, getItemPrice, getDiscount, localDiscount]);

  const subtotal = getSubtotal();
  const discount = getDiscount() + localDiscount;
  let shipping = getShippingCost();
  let giftWrapCost = selectedGiftWrap ? 299 : 0;
  let rushDeliveryCost = rushDelivery ? 499 : 0;
  let insuranceCost = insurance ? 199 : 0;
  let charityDonation = donateToCharity ? 100 : 0;
  
  if (rushDelivery && subtotal > 10000) rushDeliveryCost = 299;
  
  const tax = getTax();
  const total = subtotal - discount + shipping + giftWrapCost + rushDeliveryCost + insuranceCost + charityDonation + tax;
  const freeShippingEligible = subtotal - discount >= 5000;
  if (freeShippingEligible) shipping = 0;

  const deliverySlots = useMemo(() => [
    { date: 'Tomorrow', day: 'Apr 25', time: '9 AM - 1 PM' },
    { date: 'Saturday', day: 'Apr 26', time: '1 PM - 5 PM' },
    { date: 'Sunday', day: 'Apr 27', time: '10 AM - 2 PM' },
  ], []);

  // Memoized handlers with useCallback
  const handleUpdateQuantity = useCallback(async (id, newQuantity) => {
    setIsUpdatingItems(prev => ({ ...prev, [id]: true }));
    try {
      await updateQuantity(id, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setIsUpdatingItems(prev => ({ ...prev, [id]: false }));
    }
  }, [updateQuantity]);

  const handleRemoveItem = useCallback(async () => {
    if (itemToRemove) {
      await removeFromCart(itemToRemove.id);
      toast.success(`${itemToRemove.name} removed from cart`);
      setShowRemoveConfirm(false);
      setItemToRemove(null);
    }
  }, [itemToRemove, removeFromCart]);

  const handleClearCart = useCallback(async () => {
    await clearCart();
    toast.success('Cart cleared');
    setShowClearConfirm(false);
  }, [clearCart]);

  const handleMoveToWishlist = useCallback(async (item) => {
    setIsUpdatingItems(prev => ({ ...prev, [item._id]: true }));
    try {
      await addToWishlist(item.product);
      await removeFromCart(item._id);
      toast.success(`Moved ${item.product.name} to wishlist`);
      confetti({ particleCount: 50, spread: 40, origin: { y: 0.6 } });
    } catch (error) {
      toast.error('Failed to move to wishlist');
    } finally {
      setIsUpdatingItems(prev => ({ ...prev, [item._id]: false }));
    }
  }, [addToWishlist, removeFromCart]);

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    setApplyingCoupon(true);
    try {
      const code = couponCode.toUpperCase().trim();
      const coupon = coupons.find(c => c.code === code && c.isActive);
      
      if (!coupon) {
        toast.error('Invalid coupon code');
        setApplyingCoupon(false);
        return;
      }
      
      const today = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validUntil = new Date(coupon.validUntil);
      
      if (today < validFrom) {
        toast.error(`Coupon is valid from ${validFrom.toLocaleDateString()}`);
        setApplyingCoupon(false);
        return;
      }
      
      if (today > validUntil) {
        toast.error(`Coupon expired on ${validUntil.toLocaleDateString()}`);
        setApplyingCoupon(false);
        return;
      }
      
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        toast.error('Coupon usage limit reached');
        setApplyingCoupon(false);
        return;
      }
      
      if (coupon.forNewUsers && isAuthenticated && user?.ordersCount > 0) {
        toast.error('This coupon is for new users only');
        setApplyingCoupon(false);
        return;
      }
      
      if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        toast.error(`Minimum purchase of ${formatPrice(coupon.minPurchase)} required`);
        setApplyingCoupon(false);
        return;
      }
      
      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = (subtotal * coupon.discount) / 100;
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
      } else if (coupon.type === 'fixed') {
        discountAmount = coupon.discount;
      }
      
      setLocalDiscount(discountAmount);
      setAppliedLocalCoupon(coupon);
      toast.success(`Coupon ${coupon.code} applied!`);
      setCouponCode('');
    } catch (error) {
      toast.error('Failed to apply coupon');
    } finally {
      setApplyingCoupon(false);
    }
  }, [couponCode, subtotal, isAuthenticated, user?.ordersCount]);
  
  const handleRemoveLocalCoupon = useCallback(() => {
    setLocalDiscount(0);
    setAppliedLocalCoupon(null);
    removeCoupon();
  }, [removeCoupon]);

  const handleAddToCartRelated = useCallback(async (product) => {
    if (isAddingToCartRelated[product._id]) return;
    setIsAddingToCartRelated(prev => ({ ...prev, [product._id]: true }));
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.5 } });
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCartRelated(prev => ({ ...prev, [product._id]: false }));
    }
  }, [addToCart, isAddingToCartRelated]);

  const handleQuickView = useCallback((product) => {
    setSelectedProductForQuickView(product);
    setIsQuickViewOpen(true);
  }, []);

  const handleShare = useCallback((product) => {
    shareProduct(product);
  }, []);

  const handleWishlistToggle = useCallback((product) => {
    toggleWishlist(product);
  }, [toggleWishlist]);

  const saveViewMode = useCallback((mode) => {
    setViewMode(mode);
    localStorage.setItem('cart_view_mode', mode);
  }, []);

  useEffect(() => {
    const savedViewMode = localStorage.getItem('cart_view_mode');
    if (savedViewMode) setViewMode(savedViewMode);
  }, []);

  if (loading) {
    return (
      <div className="w-full px-[1%] min-h-screen">
        <CartSkeleton />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full px-[1%] py-16 min-h-[70vh] flex items-center justify-center"
      >
        <EmptyState
          icon={FiShoppingCart}
          title="Your Cart is Empty"
          description="Looks like you haven't added any items to your cart yet. Start shopping to find your perfect furniture!"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full px-[1%] py-3 sm:py-6">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <FiShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-neutral-900 dark:text-white">Shopping Cart</h1>
                <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">{stats.totalItems} items</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={() => setShowClearConfirm(true)} className="p-1.5 rounded-xl text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }}>
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
              <div className="flex bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-0.5">
                <button onClick={() => saveViewMode('grid')} className={`p-1.5 rounded-lg transition inline-flex items-center justify-center ${viewMode === 'grid' ? 'bg-primary-500 text-white shadow' : 'text-neutral-600 dark:text-neutral-400'}`} style={{ width: '28px', height: '28px' }}>
                  <FiGrid className="h-3 w-3" />
                </button>
                <button onClick={() => saveViewMode('list')} className={`p-1.5 rounded-lg transition inline-flex items-center justify-center ${viewMode === 'list' ? 'bg-primary-500 text-white shadow' : 'text-neutral-600 dark:text-neutral-400'}`} style={{ width: '28px', height: '28px' }}>
                  <FiList className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mt-3">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2.5 border border-neutral-200 dark:border-neutral-700 text-center">
              <FiPackage className="h-3 w-3 text-primary-500 mx-auto" />
              <p className="text-[9px] sm:text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:block">Items</p>
              <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">{stats.totalItems}</p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2.5 border border-neutral-200 dark:border-neutral-700 text-center">
              <FiDollarSign className="h-3 w-3 text-green-600 mx-auto" />
              <p className="text-[9px] sm:text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:block">Total</p>
              <p className="text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400">{formatPrice(stats.totalValue)}</p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2.5 border border-neutral-200 dark:border-neutral-700 text-center">
              <FiTag className="h-3 w-3 text-orange-600 mx-auto" />
              <p className="text-[9px] sm:text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:block">Save</p>
              <p className="text-xs sm:text-sm font-bold text-green-600 dark:text-green-400">{formatPrice(stats.totalSavings)}</p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2.5 border border-neutral-200 dark:border-neutral-700 text-center">
              <FiTruck className="h-3 w-3 text-blue-600 mx-auto" />
              <p className="text-[9px] sm:text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:block">Shipping</p>
              <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</p>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2.5 border border-neutral-200 dark:border-neutral-700 text-center">
              <FiPercent className="h-3 w-3 text-purple-600 mx-auto" />
              <p className="text-[9px] sm:text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:block">Discount</p>
              <p className="text-xs sm:text-sm font-bold text-green-600 dark:text-green-400">-{formatPrice(discount)}</p>
            </div>
          </div>
        </div>

        {/* Mobile Order Summary */}
        <MobileOrderSummary 
          subtotal={subtotal}
          discount={discount}
          shipping={shipping}
          tax={tax}
          total={total}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          applyingCoupon={applyingCoupon}
          handleApplyCoupon={handleApplyCoupon}
          appliedLocalCoupon={appliedLocalCoupon}
          appliedCoupon={appliedCoupon}
          handleRemoveLocalCoupon={handleRemoveLocalCoupon}
          selectedGiftWrap={selectedGiftWrap}
          setSelectedGiftWrap={setSelectedGiftWrap}
          rushDelivery={rushDelivery}
          setRushDelivery={setRushDelivery}
          rushDeliveryCost={rushDeliveryCost}
          insurance={insurance}
          setInsurance={setInsurance}
          donateToCharity={donateToCharity}
          setDonateToCharity={setDonateToCharity}
          deliverySlots={deliverySlots}
          activeDeliverySlot={activeDeliverySlot}
          setActiveDeliverySlot={setActiveDeliverySlot}
          showGiftOptions={showGiftOptions}
          setShowGiftOptions={setShowGiftOptions}
        />

        {/* Main Content */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Cart Items - Takes 2/3 on desktop */}
          <div className="lg:col-span-2 order-2 lg:order-none">
            <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-3" : "space-y-2"}>
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  viewMode === 'grid' ? (
                    <CartProductCard
                      key={item._id}
                      item={item}
                      getItemPrice={getItemPrice}
                      updateQuantity={handleUpdateQuantity}
                      removeFromCart={removeFromCart}
                      moveToWishlist={handleMoveToWishlist}
                      isWishlisted={isWishlisted}
                      isUpdating={isUpdatingItems[item._id]}
                      onQuickView={handleQuickView}
                      onShare={handleShare}
                      setShowRemoveConfirm={setShowRemoveConfirm}
                      setItemToRemove={setItemToRemove}
                    />
                  ) : (
                    <CartProductRow
                      key={item._id}
                      item={item}
                      getItemPrice={getItemPrice}
                      updateQuantity={handleUpdateQuantity}
                      removeFromCart={removeFromCart}
                      moveToWishlist={handleMoveToWishlist}
                      isWishlisted={isWishlisted}
                      isUpdating={isUpdatingItems[item._id]}
                      onQuickView={handleQuickView}
                      onShare={handleShare}
                      setShowRemoveConfirm={setShowRemoveConfirm}
                      setItemToRemove={setItemToRemove}
                    />
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Frequently Bought Together Section */}
            <RelatedProductsHorizontal 
              cartItems={cartItems}
              wishlistItems={wishlistItems}
              onAddToCart={handleAddToCartRelated}
              onQuickView={handleQuickView}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={isWishlisted}
              isAddingToCart={isAddingToCartRelated}
            />

            {/* Dynamic Category Sections based on last added unique categories */}
            {getUniqueCategoriesFromCart.map((category) => (
              <CategoryProductsSection
                key={category.id}
                title={`More ${category.name}`}
                categoryId={category.id}
                categoryName={category.name}
                cartItems={cartItems}
                wishlistItems={wishlistItems}
                onAddToCart={handleAddToCartRelated}
                onQuickView={handleQuickView}
                onWishlistToggle={handleWishlistToggle}
                isWishlisted={isWishlisted}
                isAddingToCart={isAddingToCartRelated}
              />
            ))}
          </div>

          {/* Desktop Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-none hidden lg:block">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden sticky top-20">
              <div className="p-4">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-1.5">
                  <FiShoppingCart className="h-4 w-4 text-primary-500" />
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between py-1.5 text-green-600 dark:text-green-400 border-b border-neutral-200 dark:border-neutral-700">
                      <span className="flex items-center gap-0.5"><FiPercent className="h-3 w-3" /> Discount</span>
                      <span className="font-bold">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1.5 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-0.5 text-neutral-600 dark:text-neutral-400">
                      <FiTruck className="h-3 w-3" />
                      <span>Shipping</span>
                    </div>
                    <span className={cn("font-bold", shipping === 0 && "text-green-600 dark:text-green-400", "text-neutral-900 dark:text-white")}>
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-0.5 text-neutral-600 dark:text-neutral-400">
                      <FiDollarSign className="h-3 w-3" />
                      <span>Tax (GST)</span>
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white">{formatPrice(tax)}</span>
                  </div>

                  <div className="pt-1">
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Promo code"
                        className="flex-1 px-2 py-1.5 text-[10px] bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-1 focus:ring-primary-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon}
                        className="px-2.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-medium rounded-lg disabled:opacity-50"
                      >
                        {applyingCoupon ? <div className="animate-spin rounded-full h-2.5 w-2.5 border-2 border-white border-t-transparent" /> : 'Apply'}
                      </button>
                    </div>
                    {(appliedLocalCoupon || appliedCoupon) && (
                      <div className="mt-1.5 bg-green-50 dark:bg-green-900/30 rounded-lg p-1.5 border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <FiTag className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                            <span className="text-[9px] font-medium text-green-700 dark:text-green-400">{(appliedLocalCoupon?.code || appliedCoupon?.code)} applied</span>
                          </div>
                          <button onClick={handleRemoveLocalCoupon} className="text-[8px] text-red-500 dark:text-red-400 hover:text-red-600">Remove</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowGiftOptions(!showGiftOptions)}
                    className="w-full flex items-center justify-between text-[10px] text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 py-1"
                  >
                    <span className="flex items-center gap-1"><FiGift className="h-3 w-3" /> Gift options</span>
                    <FiChevronDown className={`h-3 w-3 transition-transform ${showGiftOptions ? 'rotate-180' : ''}`} />
                  </button>

                  {showGiftOptions && (
                    <div className="space-y-1 overflow-hidden">
                      {[
                        { label: "Gift Wrap", price: "+₹299", checked: selectedGiftWrap, setter: setSelectedGiftWrap },
                        { label: "Rush Delivery", price: rushDelivery ? `+₹${rushDeliveryCost}` : "+₹499", checked: rushDelivery, setter: setRushDelivery },
                        { label: "Shipping Insurance", price: "+₹199", checked: insurance, setter: setInsurance },
                        { label: "Donate to Charity", price: "+₹100", checked: donateToCharity, setter: setDonateToCharity },
                      ].map((option) => (
                        <label key={option.label} className="flex items-center justify-between py-1.5 px-1 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800">
                          <div className="flex items-center gap-1.5">
                            <input type="checkbox" checked={option.checked} onChange={(e) => option.setter(e.target.checked)} className="w-3 h-3 rounded text-primary-600 focus:ring-primary-500" />
                            <span className="text-[10px] text-neutral-700 dark:text-neutral-300">{option.label}</span>
                          </div>
                          <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400">{option.price}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="pt-1">
                    <h4 className="text-[10px] font-bold mb-1.5 flex items-center gap-1 text-neutral-900 dark:text-white">
                      <FiCalendar className="h-3 w-3 text-primary-500" /> Delivery Slot
                    </h4>
                    <div className="space-y-1">
                      {deliverySlots.slice(0, 2).map((slot, idx) => (
                        <label key={idx} className={cn("flex items-center gap-1.5 p-1.5 border rounded-lg cursor-pointer", activeDeliverySlot === idx ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-neutral-200 dark:border-neutral-700")}>
                          <input type="radio" name="delivery" className="text-primary-600 w-3 h-3" checked={activeDeliverySlot === idx} onChange={() => setActiveDeliverySlot(idx)} />
                          <div>
                            <p className="text-[10px] font-semibold text-neutral-900 dark:text-white">{slot.date}</p>
                            <p className="text-[7px] text-neutral-500 dark:text-neutral-400">{slot.day} • {slot.time}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">Total</span>
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Link to="/checkout">
                    <Button variant="primary" size="sm" className="w-full text-xs py-2 mt-2">Proceed to Checkout</Button>
                  </Link>

                  <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    <p className="text-[8px] text-neutral-500 dark:text-neutral-400 text-center mb-1">Secure payments</p>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <FaCcVisa className="h-5 w-8" style={{ color: '#1A1F71' }} />
                      <FaCcMastercard className="h-5 w-8" style={{ color: '#EB001B' }} />
                      <FaCcAmex className="h-5 w-8" style={{ color: '#006FCF' }} />
                      <FaPaypal className="h-5 w-8" style={{ color: '#003087' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <RemoveConfirmModal isOpen={showRemoveConfirm} onClose={() => { setShowRemoveConfirm(false); setItemToRemove(null); }} onConfirm={handleRemoveItem} itemName={itemToRemove?.name || ''} />
        <ClearCartConfirmModal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} onConfirm={handleClearCart} itemCount={cartItems.length} />
      </AnimatePresence>

      <QuickViewModal product={selectedProductForQuickView} isOpen={isQuickViewOpen} onClose={() => { setIsQuickViewOpen(false); setSelectedProductForQuickView(null); }} addToCart={addToCart} isWishlisted={isWishlisted} toggleWishlist={toggleWishlist} />
    </div>
  );
};

export default Cart;