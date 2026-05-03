import { useState, useCallback, lazy, Suspense, memo, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye, FiCheck, FiStar, FiTrendingUp, FiPackage } from 'react-icons/fi';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';
import Rating from '../common/Rating';
import Badge from '../common/Badge';
import { formatPrice, calculateDiscount, truncateText } from '../../utils/helpers';
import { cn } from '../../utils/cn';

// Lazy load QuickView for better performance
const QuickView = lazy(() => import('./QuickView'));

// Simplified animation variants - optimized for performance
const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.15 } }
};

const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.05 } }
};

// Optimized LazyImage Component with Intersection Observer
const LazyImage = memo(({ src, alt, className, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [srcToLoad, setSrcToLoad] = useState(priority ? src : null);
  const [hasError, setHasError] = useState(false);
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
      { rootMargin: '200px', threshold: 0.01 }
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

  const fallbackSrc = 'https://placehold.co/400x500/eee/999?text=Image+Not+Found';

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={hasError ? fallbackSrc : (srcToLoad || undefined)}
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

// Memoized Badge Item component
const BadgeItem = memo(({ variant, children, className }) => (
  <motion.div variants={scaleOnHover} whileHover="hover" whileTap="tap">
    <Badge variant={variant} size="md" className={cn("shadow-lg", className)}>
      {children}
    </Badge>
  </motion.div>
));

BadgeItem.displayName = 'BadgeItem';

// Memoized Color Variant component
const ColorVariant = memo(({ color, onClick }) => (
  <motion.div
    className="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-600 cursor-pointer"
    style={{ backgroundColor: color.hex || color }}
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.1 }}
    title={color.name || color}
    onClick={onClick}
  />
));

ColorVariant.displayName = 'ColorVariant';

// Memoized Quick Action Button component
const QuickActionButton = memo(({ onClick, className, children, ariaLabel }) => (
  <motion.button
    onClick={onClick}
    className={className}
    whileTap={{ scale: 0.92 }}
    transition={{ duration: 0.05 }}
    aria-label={ariaLabel}
  >
    {children}
  </motion.button>
));

QuickActionButton.displayName = 'QuickActionButton';

// Main ProductCard Component
const ProductCard = memo(({ product, className, size = 'default', priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  // Audio ref - lazy initialization
  const audioRef = useRef(null);
  
  // Memoized calculations
  const discount = useMemo(() => calculateDiscount(product.price, product.originalPrice), [product.price, product.originalPrice]);
  const inWishlist = useMemo(() => isWishlisted(product._id), [isWishlisted, product._id]);
  const outOfStock = useMemo(() => !product.inStock, [product.inStock]);
  const hasLowStock = useMemo(() => product.stock <= 5 && product.stock > 0, [product.stock]);
  
  // Lazy initialize audio only when needed
  const playAddToCartSound = useCallback(() => {
    if (!audioRef.current && typeof window !== 'undefined') {
      try {
        audioRef.current = new Audio('/sounds/add-to-cart.mp3');
        audioRef.current.volume = 0.15;
      } catch (error) {
        console.warn('Audio not supported:', error);
      }
    }
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {}); // Ignore if audio fails
    }
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (addedToCart || outOfStock || isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      await addToCart(product, 1);
      setIsAddingToCart(false);
      setAddedToCart(true);
      
      // Vibrate on mobile for tactile feedback
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(30);
      }
      
      // Play success sound
      playAddToCartSound();
      
      setTimeout(() => setAddedToCart(false), 1500);
    } catch (error) {
      setIsAddingToCart(false);
      console.error('Failed to add to cart:', error);
    }
  }, [addedToCart, outOfStock, isAddingToCart, addToCart, product, playAddToCartSound]);

  const handleToggleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    
    // Haptic feedback
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(20);
    }
  }, [toggleWishlist, product]);

  const handleQuickView = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Memoized truncated name
  const truncatedName = useMemo(() => truncateText(product.name, 50), [product.name]);
  
  // Memoized savings amount
  const savingsAmount = useMemo(() => {
    if (product.originalPrice > product.price) {
      return product.originalPrice - product.price;
    }
    return 0;
  }, [product.originalPrice, product.price]);

  // Memoized category display
  const categoryDisplay = useMemo(() => {
    if (typeof product.category === 'string') return product.category;
    if (product.category?.name) return product.category.name;
    return null;
  }, [product.category]);

  // Default image placeholder
  const defaultImage = 'https://placehold.co/400x500/eee/999?text=No+Image';
  const mainImage = product.images?.[0] || defaultImage;
  const hoverImage = product.images?.[1] || null;

  // Memoized class names
  const containerClassName = useMemo(() => cn(
    'group relative',
    size === 'small' && 'max-w-[250px]',
    size === 'large' && 'max-w-[400px]',
    className
  ), [size, className]);

  const buttonClassName = useMemo(() => cn(
    'w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
    addedToCart
      ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
      : outOfStock
      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
      : 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg hover:shadow-xl'
  ), [addedToCart, outOfStock]);

  return (
    <>
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        exit="exit"
        layout
        className={containerClassName}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link 
          to={`/products/${product.slug}`} 
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl"
          aria-label={`View ${product.name} details`}
        >
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-200">
            
            {/* Main Product Image */}
            <LazyImage
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
              priority={priority}
            />
            
            {/* Second Image on Hover - Only render when hovered */}
            {hoverImage && isHovered && (
              <div className="absolute inset-0 w-full h-full">
                <LazyImage
                  src={hoverImage}
                  alt={`${product.name} alternate view`}
                  className="w-full h-full object-cover"
                  priority={false}
                />
              </div>
            )}

            {/* Gradient Overlay */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Badges section */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <BadgeItem variant="sale">
                  -{discount}% OFF
                </BadgeItem>
              )}
              {product.newArrival && (
                <BadgeItem variant="new">
                  <FiStar className="inline-block mr-1 h-3 w-3" />
                  New
                </BadgeItem>
              )}
              {product.bestSeller && (
                <BadgeItem variant="featured">
                  <FiTrendingUp className="inline-block mr-1 h-3 w-3" />
                  Best Seller
                </BadgeItem>
              )}
              {hasLowStock && (
                <BadgeItem variant="warning">
                  <FiPackage className="inline-block mr-1 h-3 w-3" />
                  Only {product.stock} left
                </BadgeItem>
              )}
              {outOfStock && (
                <BadgeItem variant="outOfStock">
                  Out of Stock
                </BadgeItem>
              )}
            </div>

            {/* Quick Actions */}
            <div 
              className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-200 ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
            >
              <QuickActionButton
                onClick={handleToggleWishlist}
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all',
                  inWishlist
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                    : 'bg-white/90 text-neutral-700 hover:bg-white hover:shadow-lg'
                )}
                ariaLabel={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiHeart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
              </QuickActionButton>
              
              <QuickActionButton
                onClick={handleQuickView}
                className="w-10 h-10 rounded-xl bg-white/90 text-neutral-700 hover:bg-white flex items-center justify-center backdrop-blur-sm transition-all hover:shadow-lg"
                ariaLabel={`Quick view ${product.name}`}
              >
                <FiEye className="h-5 w-5" />
              </QuickActionButton>
            </div>

            {/* Add to Cart Button */}
            <div 
              className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-200 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <button
                onClick={handleAddToCart}
                disabled={outOfStock || isAddingToCart}
                className={buttonClassName}
              >
                {addedToCart ? (
                  <div className="flex items-center gap-2">
                    <FiCheck className="h-4 w-4" />
                    Added
                  </div>
                ) : isAddingToCart ? (
                  <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                ) : outOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <FiShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="px-1">
            {categoryDisplay && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                {categoryDisplay}
              </p>
            )}
            
            <h3 
              className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 text-sm"
              title={product.name}
            >
              {truncatedName}
            </h3>
            
            {product.rating && (
              <Rating 
                value={product.rating} 
                numReviews={product.numReviews} 
                size="sm" 
                className="mb-2"
                showCount={true}
              />
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-neutral-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      Save {formatPrice(savingsAmount)}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Color Variants Preview */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1 mt-2">
                {product.colors.slice(0, 4).map((color, index) => (
                  <ColorVariant key={index} color={color} />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <Suspense fallback={
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8">
                <div className="w-80 h-64 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
              </div>
            </div>
          }>
            <QuickView
              product={product}
              isOpen={isQuickViewOpen}
              onClose={handleCloseQuickView}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;