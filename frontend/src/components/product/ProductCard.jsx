import { useState, useCallback, lazy, Suspense } from 'react';
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

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

const ProductCard = ({ product, className, size = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState('');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  const discount = calculateDiscount(product.price, product.originalPrice);
  const inWishlist = isWishlisted(product._id);
  const outOfStock = !product.inStock;
  const hasLowStock = product.stock <= 5 && product.stock > 0;

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (addedToCart || outOfStock) return;
    
    setIsAddingToCart(true);
    
    try {
      await addToCart(product, 1);
      setIsAddingToCart(false);
      setAddedToCart(true);
      
      // Vibrate on mobile for tactile feedback
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(50);
      }
      
      // Play success sound if available
      const audio = new Audio('/sounds/add-to-cart.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {}); // Ignore if audio fails
      
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      setIsAddingToCart(false);
      console.error('Failed to add to cart:', error);
    }
  }, [addedToCart, outOfStock, addToCart, product]);

  const handleToggleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    
    // Haptic feedback
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(30);
    }
  }, [toggleWishlist, product]);

  const handleQuickView = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
    
    // Track analytics if needed
    if (window.gtag) {
      window.gtag('event', 'quick_view', {
        event_category: 'engagement',
        event_label: product.name,
        value: product.price
      });
    }
  }, [product]);

  const handleCloseQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
  }, []);

  const showTooltipMessage = (message) => {
    setShowTooltip(message);
    setTimeout(() => setShowTooltip(''), 1500);
  };

  return (
    <>
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        exit="exit"
        layout
        className={cn(
          'group relative',
          size === 'small' && 'max-w-[250px]',
          size === 'large' && 'max-w-[400px]',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowTooltip('');
        }}
      >
        <Link 
          to={`/products/${product.slug}`} 
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl"
          aria-label={`View ${product.name} details`}
        >
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
            {/* Main Product Image */}
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
            
            {/* Second Image on Hover */}
            <AnimatePresence>
              {product.images[1] && isHovered && (
                <motion.img
                  src={product.images[1]}
                  alt={`${product.name} alternate view`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>

            {/* Skeleton loading while image loads */}
            {!product.images[0] && (
              <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            )}

            {/* Gradient Overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Badges with animations */}
            <motion.div 
              className="absolute top-3 left-3 flex flex-col gap-2"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              {discount > 0 && (
                <motion.div variants={scaleOnHover} whileHover="hover" whileTap="tap">
                  <Badge variant="sale" size="md" className="shadow-lg">
                    -{discount}% OFF
                  </Badge>
                </motion.div>
              )}
              {product.newArrival && (
                <motion.div variants={scaleOnHover} whileHover="hover" whileTap="tap">
                  <Badge variant="new" size="md" className="shadow-lg">
                    <FiStar className="inline-block mr-1 h-3 w-3" />
                    New
                  </Badge>
                </motion.div>
              )}
              {product.bestSeller && (
                <motion.div variants={scaleOnHover} whileHover="hover" whileTap="tap">
                  <Badge variant="featured" size="md" className="shadow-lg">
                    <FiTrendingUp className="inline-block mr-1 h-3 w-3" />
                    Best Seller
                  </Badge>
                </motion.div>
              )}
              {hasLowStock && (
                <motion.div variants={scaleOnHover} whileHover="hover" whileTap="tap">
                  <Badge variant="warning" size="md" className="shadow-lg">
                    <FiPackage className="inline-block mr-1 h-3 w-3" />
                    Only {product.stock} left
                  </Badge>
                </motion.div>
              )}
              {outOfStock && (
                <motion.div variants={scaleOnHover} whileHover="hover" whileTap="tap">
                  <Badge variant="outOfStock" size="md" className="shadow-lg">
                    Out of Stock
                  </Badge>
                </motion.div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="absolute top-3 right-3 flex flex-col gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Wishlist Button */}
              <div className="relative">
                <motion.button
                  onClick={handleToggleWishlist}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all',
                    inWishlist
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                      : 'bg-white/90 text-neutral-700 hover:bg-white hover:shadow-lg'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  onMouseEnter={() => showTooltipMessage(inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')}
                >
                  <motion.div
                    animate={inWishlist ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <FiHeart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
                  </motion.div>
                </motion.button>
              </div>
              
              {/* Quick View Button */}
              <motion.button
                onClick={handleQuickView}
                className="w-10 h-10 rounded-xl bg-white/90 text-neutral-700 hover:bg-white flex items-center justify-center backdrop-blur-sm transition-all hover:shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Quick view ${product.name}`}
                onMouseEnter={() => showTooltipMessage('Quick View')}
              >
                <FiEye className="h-5 w-5" />
              </motion.button>
            </motion.div>

            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 right-16 bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none"
                >
                  {showTooltip}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add to Cart Button */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.button
                onClick={handleAddToCart}
                disabled={outOfStock || isAddingToCart}
                className={cn(
                  'w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
                  addedToCart
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                    : outOfStock
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg hover:shadow-xl'
                )}
                whileHover={!outOfStock && !addedToCart ? { scale: 1.02 } : {}}
                whileTap={!outOfStock && !addedToCart ? { scale: 0.98 } : {}}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.div
                      key="added"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <FiCheck className="h-4 w-4" />
                      Added to Cart
                    </motion.div>
                  ) : isAddingToCart ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                  ) : outOfStock ? (
                    <motion.span
                      key="outofstock"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Out of Stock
                    </motion.span>
                  ) : (
                    <motion.div
                      key="addtocart"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <FiShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>

          {/* Product Info */}
          <motion.div 
            className="px-1"
            variants={staggerChildren}
          >
            <motion.p 
              className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider"
              variants={fadeInUp}
            >
              {product.category}
            </motion.p>
            
            <motion.h3 
              className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
              variants={fadeInUp}
              title={product.name}
            >
              {truncateText(product.name, 50)}
            </motion.h3>
            
            <motion.div variants={fadeInUp}>
              <Rating 
                value={product.rating} 
                numReviews={product.numReviews} 
                size="sm" 
                className="mb-2"
                showCount={true}
              />
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 flex-wrap"
              variants={fadeInUp}
            >
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
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  )}
                </>
              )}
            </motion.div>

            {/* Color Variants Preview */}
            {product.colors && product.colors.length > 0 && (
              <motion.div 
                className="flex gap-1 mt-2"
                variants={fadeInUp}
              >
                {product.colors.slice(0, 4).map((color, index) => (
                  <motion.div
                    key={index}
                    className="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-600 cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    whileHover={{ scale: 1.2 }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                    +{product.colors.length - 4}
                  </span>
                )}
              </motion.div>
            )}
          </motion.div>
        </Link>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <Suspense fallback={
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 animate-pulse">
                <div className="w-96 h-64 bg-neutral-200 dark:bg-neutral-700 rounded-xl" />
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
};

export default ProductCard;