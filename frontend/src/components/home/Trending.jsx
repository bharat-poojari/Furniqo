// src/components/home/Trending.jsx
import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowRight, 
  FiTrendingUp, 
  FiHeart, 
  FiShoppingCart,
  FiStar,
  FiZap,
  FiX,
  FiMinus,
  FiPlus,
  FiCheck,
  FiShare2,
  FiEye
} from 'react-icons/fi';
import apiWrapper from '../../services/apiWrapper';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';
import { formatPrice } from '../../utils/helpers';

// Helper function to get category name
const getCategoryName = (category) => {
  if (!category) return null;
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && category.name) return category.name;
  if (category.title) return category.title;
  return null;
};

// Improved Share functionality that opens native share panel on mobile
const shareProduct = async (product, e) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  const shareUrl = `${window.location.origin}/products/${product.slug}`;
  const shareTitle = product.name;
  const shareText = `Check out ${product.name} on Furniqo!`;
  
  // Create share data object
  const shareData = {
    title: shareTitle,
    text: shareText,
    url: shareUrl,
  };
  
  // Check if Web Share API is available (requires HTTPS)
  if (navigator.share && typeof navigator.share === 'function') {
    try {
      // Try to share using native share panel
      await navigator.share(shareData);
      toast.success('Shared successfully!', {
        icon: '📱',
        duration: 2000
      });
      return;
    } catch (error) {
      console.error('Share error:', error);
      // User cancelled share or share failed
      if (error.name !== 'AbortError') {
        toast.error('Could not open share panel', {
          icon: '❌',
          duration: 2000
        });
      }
      return;
    }
  }
  
  // If Web Share API is not available (desktop or HTTP), copy to clipboard
  await copyToClipboard(shareUrl);
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Product link copied to clipboard!', {
      icon: '🔗',
      duration: 2000
    });
  } catch (err) {
    console.error('Clipboard error:', err);
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      toast.success('Product link copied to clipboard!', {
        icon: '🔗',
        duration: 2000
      });
    } catch (fallbackErr) {
      toast.error('Failed to copy link. Please try again.', {
        icon: '❌',
        duration: 2000
      });
    }
    document.body.removeChild(textarea);
  }
};

// Optimized Modal Component
const Modal = memo(({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md',
  showCloseButton = true,
  closeOnOverlay = true,
  className,
}) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full m-4',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnOverlay ? onClose : undefined}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className={cn(
              'relative w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl',
              'border border-neutral-200 dark:border-neutral-800',
              sizeClasses[size],
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {title}
                </h2>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                  >
                    <FiX className="h-5 w-5 text-neutral-500" />
                  </button>
                )}
              </div>
            )}
            
            {!title && showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 z-10"
              >
                <FiX className="h-5 w-5 text-neutral-500" />
              </button>
            )}
            
            <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

Modal.displayName = 'Modal';

// Optimized QuickView Modal Component
const QuickViewModal = memo(({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

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
      
      toast.success(`${quantity} × ${product.name} added to cart!`, {
        icon: '🛒',
        duration: 1500,
      });
      
      setTimeout(() => {
        setAddedToCart(false);
        onClose();
      }, 1200);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, isAddingToCart, addToCart, onClose]);

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
  const categoryName = getCategoryName(product.category);
  const inWishlist = isWishlisted(product._id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" showCloseButton={true} closeOnOverlay={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Image Gallery */}
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
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
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

        {/* Product Details */}
        <div className="flex flex-col">
          {categoryName && (
            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2 inline-block">
              {categoryName}
            </span>
          )}

          <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
            {product.name}
          </h3>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-500 text-yellow-500'
                      : i < rating
                      ? 'fill-yellow-500 text-yellow-500 opacity-50'
                      : 'text-neutral-300 dark:text-neutral-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {rating} ({reviewCount} reviews)
            </span>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              ${product.price?.toLocaleString() || 0}
            </span>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed text-sm">
            {product.shortDescription || product.description?.substring(0, 150) || 'No description available.'}
          </p>

          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {product.stock > 0 
                  ? `In Stock (${product.stock} available)` 
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                >
                  <FiMinus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {isAddingToCart ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </div>
              ) : addedToCart ? (
                <div className="flex items-center justify-center gap-2">
                  <FiCheck className="h-5 w-5" />
                  Added to Cart!
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FiShoppingCart className="h-5 w-5" />
                  Add to Cart - ${((product.price || 0) * quantity).toLocaleString()}
                </div>
              )}
            </button>

            <button
              onClick={handleWishlistClick}
              className="p-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 transition-all duration-150"
            >
              <FiHeart
                className={`h-5 w-5 transition-colors duration-150 ${
                  inWishlist
                    ? 'fill-red-500 text-red-500' 
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-150"
            >
              <FiShare2 className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">SKU:</span>
                <span className="ml-2 text-neutral-700 dark:text-neutral-300">
                  {product.sku || product._id?.slice(-8).toUpperCase() || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Category:</span>
                <span className="ml-2 text-neutral-700 dark:text-neutral-300 capitalize">
                  {categoryName || 'Uncategorized'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
});

QuickViewModal.displayName = 'QuickViewModal';

// Optimized Product Card Component
const ProductCard = memo(({ product, index, onQuickView, onWishlistToggle, onAddToCart, isWishlisted, isAddingToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for layout adjustments
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const getDisplayCategory = useCallback((product) => {
    if (!product.category) return null;
    if (typeof product.category === 'string') return product.category;
    if (typeof product.category === 'object' && product.category.name) return product.category.name;
    return null;
  }, []);

  const handleShare = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    shareProduct(product, e);
  }, [product]);

  const category = getDisplayCategory(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="group relative bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 animate-pulse" />
          )}
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
            alt={product.name}
            className={`w-full aspect-square object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'} ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            loading="lazy"
          />
          
          {isHovered && !isMobile && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200">
              <button
                onClick={() => onQuickView(product)}
                className="bg-white/90 backdrop-blur-md text-neutral-900 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full font-medium transform transition-all duration-200 hover:bg-white shadow-lg text-xs sm:text-sm flex items-center gap-2"
              >
                <FiEye className="h-3 w-3 sm:h-4 sm:w-4" />
                Quick View
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons - Vertical stack */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1.5 sm:gap-2 z-10">
          {/* Wishlist Button */}
          <button
            onClick={(e) => onWishlistToggle(product, e)}
            className="p-1.5 sm:p-2 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow duration-150"
            aria-label="Add to wishlist"
          >
            <FiHeart
              className={`h-3 w-3 sm:h-4 sm:w-4 transition-colors duration-150 ${
                isWishlisted(product._id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            />
          </button>

          {/* Quick View Button - Mobile only with Eye icon */}
          {isMobile && (
            <button
              onClick={() => onQuickView(product)}
              className="p-1.5 sm:p-2 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow duration-150"
              aria-label="Quick view"
            >
              <FiEye className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 sm:p-2 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow duration-150"
            aria-label="Share product"
          >
            <FiShare2 className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Trending Badge */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
          <div className="flex items-center gap-0.5 sm:gap-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-[9px] sm:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg">
            <FiZap className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
            <span>Trending</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
          {category && (
            <p className="text-[10px] sm:text-xs text-primary-600 dark:text-primary-400 font-medium mb-0.5 sm:mb-1">
              {category}
            </p>
          )}

          <Link to={`/products/${product.slug}`} className="block mb-1 sm:mb-2">
            <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-150 line-clamp-2 text-xs sm:text-sm lg:text-base">
              {product.name}
            </h3>
          </Link>

          {product.rating && (
            <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
              <div className="flex items-center gap-0.5">
                <FiStar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] sm:text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  {product.rating}
                </span>
              </div>
              <span className="text-[9px] sm:text-xs text-neutral-400">•</span>
              <span className="text-[9px] sm:text-xs text-neutral-500 dark:text-neutral-400">
                {product.numReviews || 0} reviews
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3 border-t border-neutral-100 dark:border-neutral-700">
            <div className="flex flex-col">
              <span className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
                ${(product.price || 0).toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[8px] sm:text-xs text-neutral-400 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <button
              onClick={(e) => onAddToCart(product, e)}
              disabled={isAddingToCart}
              className="p-1.5 sm:p-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-lg sm:rounded-xl transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* Hover Border Effect - Desktop only */}
        {isHovered && !isMobile && (
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none ring-2 ring-primary-500/50 transition-all duration-150" />
        )}
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

// Main Trending Component
const Trending = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const fetchAttempted = useRef(false);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;
    
    try {
      const response = await apiWrapper.getTrendingProducts(8);
      
      if (response?.data?.success && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else if (Array.isArray(response)) {
        setProducts(response);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching trending products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = useCallback((product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    toggleWishlist(product);
  }, [toggleWishlist]);

  const handleAddToCart = useCallback(async (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        duration: 1500
      });
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  }, [addToCart, isAddingToCart]);

  const handleQuickView = useCallback((product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  // Memoized header variants
  const headerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: "easeOut" } 
    },
  }), []);

  // Loading skeleton
  if (loading && products.length === 0) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="w-full px-[2%] sm:px-[3%] lg:px-[5%] max-w-[1600px] mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-6 w-36 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-10 sm:h-12 w-64 sm:w-80 bg-neutral-200 dark:bg-neutral-700 rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="h-5 w-72 sm:w-96 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-800 shadow-lg overflow-hidden">
                <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                <div className="p-3 sm:p-5 space-y-2">
                  <div className="h-4 sm:h-5 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-3/4 animate-pulse" />
                  <div className="h-3 sm:h-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-1/2 animate-pulse" />
                  <div className="h-6 sm:h-7 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-1/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 overflow-hidden">
      <div className="w-full px-[2%] sm:px-[3%] lg:px-[5%] max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <FiTrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Trending Now
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent mb-2 sm:mb-3 px-4 sm:px-0">
            Trending Products
          </h2>
          
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4 sm:px-0">
            Discover our most sought-after furniture pieces making waves this week
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              index={index}
              onQuickView={handleQuickView}
              onWishlistToggle={handleWishlistToggle}
              onAddToCart={handleAddToCart}
              isWishlisted={isWishlisted}
              isAddingToCart={isAddingToCart}
            />
          ))}
        </div>

        {/* View All Button */}
        {products.length > 0 && (
          <motion.div 
            className="text-center mt-8 sm:mt-12 lg:mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              to="/products?sort=popular"
              className="inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-150 shadow-lg hover:shadow-xl group"
            >
              <span>Explore All Trending Products</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-150" />
            </Link>
          </motion.div>
        )}
      </div>

      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedProduct(null);
        }}
      />
    </section>
  );
};

export default memo(Trending);