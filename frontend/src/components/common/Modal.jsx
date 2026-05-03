import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiShoppingCart, FiStar, FiMinus, FiPlus, FiCheck, FiTruck, FiShield, FiClock } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { useCart } from '../../store/CartContext';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

// Optimized animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.96, y: 15, transition: { duration: 0.15, ease: 'easeIn' } }
};

// Helper function to get category name
const getCategoryName = (category) => {
  if (!category) return null;
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && category.name) return category.name;
  if (category.title) return category.title;
  return null;
};

// Memoized Modal Component
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
      document.body.style.paddingRight = '0px';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, handleEscape]);

  const sizeClasses = useMemo(() => ({
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full m-4',
  }), []);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnOverlay ? onClose : undefined}
          />
          
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
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
                    aria-label="Close modal"
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
                aria-label="Close modal"
              >
                <FiX className="h-5 w-5 text-neutral-500" />
              </button>
            )}
            
            <div className="px-6 py-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

Modal.displayName = 'Modal';

// Memoized Delivery Info component
const DeliveryInfo = memo(() => {
  const deliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  return (
    <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
      <div className="flex items-center gap-3 text-sm">
        <FiTruck className="h-4 w-4 text-primary-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-neutral-900 dark:text-white">Free Delivery</p>
          <p className="text-xs text-neutral-500">Get by {deliveryDate}</p>
        </div>
        <FiShield className="h-4 w-4 text-green-600 flex-shrink-0" />
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">1 Year Warranty</p>
          <p className="text-xs text-neutral-500">Manufacturer warranty</p>
        </div>
      </div>
    </div>
  );
});

DeliveryInfo.displayName = 'DeliveryInfo';

// Memoized ProductSpecs component
const ProductSpecs = memo(({ product, categoryName, displaySku }) => (
  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <span className="text-neutral-500 dark:text-neutral-400">SKU:</span>
        <span className="ml-2 text-neutral-700 dark:text-neutral-300">{displaySku}</span>
      </div>
      <div>
        <span className="text-neutral-500 dark:text-neutral-400">Category:</span>
        <span className="ml-2 text-neutral-700 dark:text-neutral-300 capitalize">
          {categoryName || 'Uncategorized'}
        </span>
      </div>
      {product.material && (
        <div>
          <span className="text-neutral-500 dark:text-neutral-400">Material:</span>
          <span className="ml-2 text-neutral-700 dark:text-neutral-300">{product.material}</span>
        </div>
      )}
      {product.style && (
        <div>
          <span className="text-neutral-500 dark:text-neutral-400">Style:</span>
          <span className="ml-2 text-neutral-700 dark:text-neutral-300">{product.style}</span>
        </div>
      )}
    </div>
  </div>
));

ProductSpecs.displayName = 'ProductSpecs';

// Main QuickViewModal Component
export const QuickViewModal = memo(({ 
  product, 
  isOpen, 
  onClose, 
  onAddToWishlist, 
  isInWishlist = false
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const { addToCart } = useCart();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timeoutId = setTimeout(() => {
        setQuantity(1);
        setSelectedImage(0);
        setIsAddingToCart(false);
        setAddedToCart(false);
        setIsAddingToWishlist(false);
      }, 150);
      return () => clearTimeout(timeoutId);
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
      toast.success(`${quantity} × ${product.name} added to cart`, {
        icon: '🛒',
        duration: 1500
      });
      setTimeout(() => {
        setAddedToCart(false);
        onClose();
      }, 1000);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, isAddingToCart, addToCart, onClose]);

  const handleWishlistClick = useCallback(async () => {
    if (!product || isAddingToWishlist) return;
    
    setIsAddingToWishlist(true);
    try {
      if (onAddToWishlist) {
        await onAddToWishlist(product);
      }
      toast.success(
        isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
        { duration: 1200 }
      );
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  }, [product, isAddingToWishlist, onAddToWishlist, isInWishlist]);

  const handleImageSelect = useCallback((index) => {
    setSelectedImage(index);
  }, []);

  // Memoized values
  const discount = useMemo(() => 
    product?.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0,
  [product]);

  const rating = useMemo(() => product?.rating || 4.5, [product]);
  const reviewCount = useMemo(() => product?.numReviews || 128, [product]);
  const categoryName = useMemo(() => getCategoryName(product?.category), [product]);
  const isInStock = useMemo(() => product?.stock > 0, [product]);
  const displaySku = useMemo(() => 
    product?.sku || product?._id?.slice(-8).toUpperCase() || 'N/A',
  [product]);

  const emiPrice = useMemo(() => 
    product?.price > 5000 ? Math.floor(product.price / 6) : null,
  [product]);

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" showCloseButton={true} closeOnOverlay={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
            <img
              src={product.images?.[selectedImage] || 'https://placehold.co/500x500/eee/999?text=No+Image'}
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
                  onClick={() => handleImageSelect(idx)}
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
            <div className="flex items-center gap-0.5">
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
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(product.price || 0)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-neutral-400 dark:text-neutral-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {emiPrice && (
              <p className="text-xs text-neutral-500 mt-1">
                or EMI from {formatPrice(emiPrice)}/month
              </p>
            )}
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed text-sm">
            {product.shortDescription || product.description || 'No description available for this product.'}
          </p>

          {/* Stock Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {isInStock 
                  ? `In Stock (${product.stock} available)` 
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <DeliveryInfo />

          {/* Quantity Selector */}
          {isInStock && (
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock || isAddingToCart}
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
                  Add to Cart - {formatPrice((product.price || 0) * quantity)}
                </div>
              )}
            </button>

            <button
              onClick={handleWishlistClick}
              disabled={isAddingToWishlist}
              className="p-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 transition-all duration-150 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isAddingToWishlist ? (
                <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiHeart
                  className={`h-5 w-5 transition-colors duration-150 ${
                    isInWishlist 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                />
              )}
            </button>
          </div>

          {/* Product Specifications */}
          <ProductSpecs product={product} categoryName={categoryName} displaySku={displaySku} />
        </div>
      </div>
    </Modal>
  );
});

QuickViewModal.displayName = 'QuickViewModal';

// Add custom scrollbar styles
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background: #2a2a2a;
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4a4a4a;
  }
`;

// Inject styles if needed
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Modal;