import { useState, useCallback, useEffect, useRef, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, FiHeart, FiX, FiMinus, FiPlus, 
  FiChevronLeft, FiChevronRight, FiTruck,
  FiShield, FiRotateCcw
} from 'react-icons/fi';
import Modal from '../common/Modal';
import Rating from '../common/Rating';
import Button from '../common/Button';
import ProductVariants from './ProductVariants';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';
import { formatPrice, calculateDiscount } from '../../utils/helpers';

// Fallback image constant
const FALLBACK_IMAGE = 'https://placehold.co/600x600/eee/999?text=Image+Not+Available';

// Optimized LazyImage component with error handling
const LazyImage = memo(({ src, alt, className, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [srcToLoad, setSrcToLoad] = useState(priority ? src : null);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setSrcToLoad(src);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSrcToLoad(src);
            observerRef.current?.disconnect();
          }
        });
      },
      { rootMargin: '100px', threshold: 0.01 }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [src, priority]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  const displaySrc = hasError ? FALLBACK_IMAGE : (srcToLoad || undefined);

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={displaySrc}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

// Memoized Thumbnail component with error handling
const Thumbnail = memo(({ image, alt, index, isSelected, onSelect }) => {
  const [hasError, setHasError] = useState(false);

  const handleClick = useCallback(() => onSelect(index), [onSelect, index]);
  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const displaySrc = hasError ? FALLBACK_IMAGE : image;

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      onClick={handleClick}
      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-150 ${
        isSelected
          ? 'border-primary-600 ring-2 ring-primary-600/20'
          : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
      }`}
      aria-label={`View image ${index + 1}`}
      aria-current={isSelected ? 'true' : 'false'}
    >
      <img 
        src={displaySrc} 
        alt={`${alt} - View ${index + 1}`}
        className="w-full h-full object-cover"
        onError={handleError}
        loading="lazy"
      />
    </motion.button>
  );
});

Thumbnail.displayName = 'Thumbnail';

// Memoized Feature Item component
const FeatureItem = memo(({ icon: Icon, text }) => (
  <div className="text-center">
    <Icon className="h-5 w-5 mx-auto mb-1 text-neutral-400" />
    <span className="text-xs text-neutral-500">{text}</span>
  </div>
));

FeatureItem.displayName = 'FeatureItem';

// Memoized Quantity Selector component
const QuantitySelector = memo(({ quantity, onIncrement, onDecrement, min = 1, max }) => (
  <div className="flex items-center border-2 border-neutral-200 dark:border-neutral-700 rounded-xl">
    <button
      onClick={onDecrement}
      disabled={quantity <= min}
      className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Decrease quantity"
    >
      <FiMinus className="h-4 w-4" />
    </button>
    <span className="px-6 font-semibold min-w-[60px] text-center select-none">
      {quantity}
    </span>
    <button
      onClick={onIncrement}
      disabled={quantity >= max}
      className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Increase quantity"
    >
      <FiPlus className="h-4 w-4" />
    </button>
  </div>
));

QuantitySelector.displayName = 'QuantitySelector';

// Main QuickView Component
const QuickView = memo(({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const imageContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const modalRef = useRef(null);
  
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedVariant(null);
      setSelectedImage(0);
      setAddedToCart(false);
      setIsAddingToCart(false);
    }
  }, [product?._id, isOpen]);

  // Memoized calculations
  const discount = useMemo(() => 
    product ? calculateDiscount(product.price, product.originalPrice) : 0, 
  [product]);
  
  const currentPrice = useMemo(() => 
    product ? (selectedVariant?.price || product.price) : 0, 
  [product, selectedVariant]);
  
  const inStock = useMemo(() => 
    product ? (selectedVariant?.inStock !== false && product.inStock) : false, 
  [product, selectedVariant]);
  
  const maxQuantity = useMemo(() => 
    product ? (selectedVariant?.stock || product.stock || 99) : 99, 
  [product, selectedVariant]);
  
  const isWishlistedProduct = useMemo(() => 
    product ? isWishlisted(product._id) : false, 
  [product, isWishlisted]);

  const savingsAmount = useMemo(() => {
    if (product?.originalPrice && product.originalPrice > currentPrice) {
      return product.originalPrice - currentPrice;
    }
    return 0;
  }, [product, currentPrice]);

  const features = useMemo(() => [
    { icon: FiTruck, text: 'Free Shipping' },
    { icon: FiShield, text: 'Secure Checkout' },
    { icon: FiRotateCcw, text: '30-Day Returns' },
  ], []);

  const handleAddToCart = useCallback(async () => {
    if (!product || isAddingToCart || !inStock) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity, selectedVariant);
      setAddedToCart(true);
      
      // Vibrate on mobile for feedback
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(30);
      }
      
      setTimeout(() => {
        onClose();
        setAddedToCart(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, selectedVariant, addToCart, onClose, isAddingToCart, inStock]);

  const handleImageNavigation = useCallback((direction) => {
    if (!product?.images?.length) return;
    setSelectedImage(prev => {
      if (direction === 'next') {
        return (prev + 1) % product.images.length;
      }
      return prev === 0 ? product.images.length - 1 : prev - 1;
    });
  }, [product]);

  const handlePrevImage = useCallback(() => handleImageNavigation('prev'), [handleImageNavigation]);
  const handleNextImage = useCallback(() => handleImageNavigation('next'), [handleImageNavigation]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      handleImageNavigation(diff > 0 ? 'next' : 'prev');
    }
  }, [handleImageNavigation]);

  const incrementQuantity = useCallback(() => {
    setQuantity(prev => Math.min(maxQuantity, prev + 1));
  }, [maxQuantity]);

  const decrementQuantity = useCallback(() => {
    setQuantity(prev => Math.max(1, prev - 1));
  }, []);

  const handleWishlistToggle = useCallback(() => {
    if (product) {
      toggleWishlist(product);
      // Haptic feedback
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(20);
      }
    }
  }, [product, toggleWishlist]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'ArrowRight') handleNextImage();
    if (e.key === 'Escape') onClose();
  }, [handlePrevImage, handleNextImage, onClose]);

  const handleVariantSelect = useCallback((variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  }, []);

  const handleModalClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Conditional return after all hooks
  if (!product) return null;

  const imageCount = product.images?.length || 0;
  const hasMultipleImages = imageCount > 1;
  const hasVariants = product.variants?.length > 0;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleModalClose} 
      size="4xl"
      closeOnOverlayClick={true}
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="grid md:grid-cols-2 gap-8"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="dialog"
        aria-label={`Quick view: ${product.name}`}
      >
        {/* Images Section */}
        <div className="space-y-4" ref={imageContainerRef}>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 group">
            <LazyImage
              src={product.images?.[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              priority={selectedImage === 0}
            />
            
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                -{discount}% OFF
              </div>
            )}
            
            {/* Image Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <NavButton direction="prev" onClick={handlePrevImage} />
                <NavButton direction="next" onClick={handleNextImage} />
              </>
            )}

            {/* Image Counter */}
            {hasMultipleImages && (
              <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs z-10">
                {selectedImage + 1} / {imageCount}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {hasMultipleImages && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {product.images.map((image, index) => (
                <Thumbnail
                  key={index}
                  image={image}
                  alt={product.name}
                  index={index}
                  isSelected={index === selectedImage}
                  onSelect={setSelectedImage}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <Link
              to={`/products/${product.slug}`}
              className="text-2xl font-bold text-neutral-900 dark:text-white hover:text-primary-600 transition-colors duration-150 line-clamp-2"
              onClick={handleModalClose}
            >
              {product.name}
            </Link>
            
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <Rating 
                value={product.rating || 4.5} 
                numReviews={product.numReviews || 0} 
                size="sm"
                showCount={true}
              />
              {discount > 0 && (
                <span className="bg-red-100 dark:bg-red-900/20 text-red-600 text-sm font-medium px-2 py-0.5 rounded-full">
                  Save {discount}%
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(currentPrice)}
            </span>
            {product.originalPrice && product.originalPrice > currentPrice && (
              <>
                <span className="text-lg text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                {savingsAmount > 0 && (
                  <span className="text-sm text-green-600 font-medium">
                    Save {formatPrice(savingsAmount)}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-neutral-600 dark:text-neutral-400 line-clamp-3 text-sm leading-relaxed">
            {product.description || product.shortDescription || 'No description available for this product.'}
          </p>

          {/* Variants */}
          {hasVariants && (
            <ProductVariants
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelect={handleVariantSelect}
            />
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${inStock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
              {inStock ? `In Stock (${maxQuantity} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4">
            {inStock && (
              <QuantitySelector
                quantity={quantity}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                min={1}
                max={maxQuantity}
              />
            )}

            <Button
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
              className="flex-grow"
              size="lg"
              icon={addedToCart ? undefined : FiShoppingCart}
              loading={isAddingToCart}
            >
              {!inStock 
                ? 'Out of Stock' 
                : addedToCart 
                  ? '✓ Added!' 
                  : 'Add to Cart'
              }
            </Button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              onClick={handleWishlistToggle}
              className={`p-3 rounded-xl border-2 transition-all duration-150 ${
                isWishlistedProduct
                  ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-red-300 hover:shadow-md'
              }`}
              aria-label={isWishlistedProduct ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart 
                className={`h-5 w-5 transition-colors duration-150 ${isWishlistedProduct ? 'fill-current' : ''}`} 
              />
            </motion.button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            {features.map((feature, index) => (
              <FeatureItem key={index} {...feature} />
            ))}
          </div>

          {/* Full Details Link */}
          <Link
            to={`/products/${product.slug}`}
            onClick={handleModalClose}
            className="block text-center text-primary-600 hover:text-primary-700 font-medium text-sm group transition-colors duration-150"
          >
            View Full Details{' '}
            <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </motion.div>
    </Modal>
  );
});

QuickView.displayName = 'QuickView';

export default QuickView;