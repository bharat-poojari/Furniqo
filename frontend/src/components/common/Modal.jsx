import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiShoppingCart, FiStar, FiMinus, FiPlus, FiCheck, FiTruck, FiShield, FiClock } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { useCart } from '../../store/CartContext';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

// Helper function to get category name
const getCategoryName = (category) => {
  if (!category) return null;
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && category.name) return category.name;
  if (category.title) return category.title;
  return null;
};

const Modal = ({ 
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
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnOverlay ? onClose : undefined}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
                    className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <FiX className="h-5 w-5 text-neutral-500" />
                  </button>
                )}
              </div>
            )}
            
            {!title && showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-10"
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
};

// QuickViewModal Component - FIXED
export const QuickViewModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToWishlist, 
  isInWishlist // This should be a boolean, not a function
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!isOpen) {
      setQuantity(1);
      setSelectedImage(0);
      setIsAddingToCart(false);
      setAddedToCart(false);
      setIsAddingToWishlist(false);
    }
  }, [isOpen]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
      setAddedToCart(true);
      toast.success(`${quantity} × ${product.name} added to cart`, {
        icon: '🛒',
        duration: 2000
      });
      setTimeout(() => {
        setAddedToCart(false);
        onClose();
      }, 1500);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistClick = async () => {
    if (!product) return;
    
    setIsAddingToWishlist(true);
    try {
      if (onAddToWishlist) {
        await onAddToWishlist(product);
      }
      toast.success(
        isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
        { duration: 1500 }
      );
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  if (!product) return null;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const rating = product.rating || 4.5;
  const reviewCount = product.numReviews || 128;
  const categoryName = getCategoryName(product.category);
  const isInStock = product.stock > 0;
  
  // Generate SKU from product ID if not provided
  const displaySku = product.sku || product._id?.slice(-8).toUpperCase() || 'N/A';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" showCloseButton={true} closeOnOverlay={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
            <motion.img
              key={selectedImage}
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/500x500?text=No+Image'}
              alt={product.name}
              className="w-full aspect-square object-cover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
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
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx 
                      ? 'border-primary-500 ring-2 ring-primary-500/20' 
                      : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
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
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(product.price || 0)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-neutral-400 dark:text-neutral-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.price > 5000 && (
              <p className="text-xs text-neutral-500 mt-1">
                or EMI from {formatPrice(Math.floor(product.price / 6))}/month
              </p>
            )}
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            {product.shortDescription || product.description || 'No description available for this product.'}
          </p>

          {/* Stock Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isInStock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {isInStock 
                  ? `In Stock (${product.stock} available)` 
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-6 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
            <div className="flex items-center gap-3 text-sm">
              <FiTruck className="h-4 w-4 text-primary-600" />
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">Free Delivery</p>
                <p className="text-xs text-neutral-500">Get by {(() => {
                  const date = new Date();
                  date.setDate(date.getDate() + 5);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                })()}</p>
              </div>
              <FiShield className="h-4 w-4 text-green-600 ml-auto" />
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">1 Year Warranty</p>
                <p className="text-xs text-neutral-500">Manufacturer warranty</p>
              </div>
            </div>
          </div>

          {isInStock && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiMinus className="h-4 w-4" />
                </motion.button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <motion.button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlus className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <motion.button
              onClick={handleAddToCart}
              disabled={!isInStock || isAddingToCart}
              className="flex-1 relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              {isAddingToCart ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="flex items-center justify-center gap-2"
                >
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                  Adding...
                </motion.div>
              ) : addedToCart ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center gap-2"
                >
                  <FiCheck className="h-5 w-5" />
                  Added to Cart!
                </motion.div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FiShoppingCart className="h-5 w-5" />
                  Add to Cart - {formatPrice((product.price || 0) * quantity)}
                </div>
              )}
            </motion.button>

            <motion.button
              onClick={handleWishlistClick}
              disabled={isAddingToWishlist}
              className="p-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 transition-all hover:shadow-lg disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAddingToWishlist ? (
                <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiHeart
                  className={`h-5 w-5 transition-colors ${
                    isInWishlist 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                />
              )}
            </motion.button>
          </div>

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
        </div>
      </div>
    </Modal>
  );
};

export default Modal;