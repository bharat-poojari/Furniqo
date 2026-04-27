// src/components/home/Trending.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
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
  FiCheck
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

// Modal Component
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

// QuickView Modal Component
const QuickViewModal = ({ product, isOpen, onClose }) => {
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

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
      setAddedToCart(true);
      
      toast.success(`${quantity} × ${product.name} added to cart!`, {
        icon: '🛒',
        duration: 2000,
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

  const handleWishlistClick = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

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
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              ${product.price?.toLocaleString() || 0}
            </span>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            {product.shortDescription || product.description || 'No description available for this product.'}
          </p>

          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
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
              disabled={product.stock === 0 || isAddingToCart}
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
                  Add to Cart - ${((product.price || 0) * quantity).toLocaleString()}
                </div>
              )}
            </motion.button>

            <motion.button
              onClick={handleWishlistClick}
              className="p-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 transition-all hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiHeart
                className={`h-5 w-5 transition-colors ${
                  inWishlist
                    ? 'fill-red-500 text-red-500' 
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              />
            </motion.button>
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

// Main Trending Component
const Trending = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const toastIdRef = useRef(null);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
  try {
    const response = await apiWrapper.getTrendingProducts(8);
    if (response.data.success) {
      setProducts(response.data.data);
    }
  } catch (error) {
    console.error('Error fetching trending products:', error);
    // Fallback - use local data directly
    const featured = response?.data?.data || [];
    setProducts(featured);
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

  const handleAddToCart = async (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      await addToCart(product, 1);
      
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      
      toastIdRef.current = toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        style: { 
          background: '#333', 
          color: '#fff',
          borderRadius: '10px',
          padding: '12px 20px'
        },
        duration: 2000
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart', {
        icon: '❌',
        style: { background: '#333', color: '#fff' },
        duration: 2000
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleImageLoad = (productId) => {
    setImageLoaded(prev => ({ ...prev, [productId]: true }));
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const getDisplayCategory = (product) => {
    if (!product.category) return null;
    if (typeof product.category === 'string') return product.category;
    if (typeof product.category === 'object' && product.category.name) return product.category.name;
    return null;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.2
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.5 
      } 
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      } 
    },
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="w-full px-[2%] sm:px-[3%] lg:px-[5%] max-w-[1600px] mx-auto">
          <div className="text-center mb-12">
            <div className="h-6 w-36 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-10 sm:h-12 w-64 sm:w-80 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="h-5 w-72 sm:w-96 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-full mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-800 shadow-lg">
                <div className="aspect-square bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse" />
                <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                  <div className="h-4 sm:h-5 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg w-3/4 animate-pulse" />
                  <div className="h-3 sm:h-4 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg w-1/2 animate-pulse" />
                  <div className="h-6 sm:h-7 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg w-1/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 overflow-hidden">
      <div className="w-full px-[2%] sm:px-[3%] lg:px-[5%] max-w-[1600px] mx-auto">
        {/* Animated Header - Responsive */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <motion.div 
            className="flex items-center justify-center gap-2 mb-3 sm:mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="relative">
              <FiTrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
              <motion.div
                className="absolute inset-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut" 
                }}
              >
                <FiTrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary-400 dark:text-primary-300" />
              </motion.div>
            </div>
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Trending Now
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent mb-2 sm:mb-3 px-4 sm:px-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Trending Products
          </motion.h2>
          
          <motion.p 
            className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4 sm:px-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Discover our most sought-after furniture pieces making waves this week
          </motion.p>
        </motion.div>

        {/* Products Grid - 2 cards on mobile, 4 on desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={itemVariants}
              onHoverStart={() => setHoveredProduct(product._id)}
              onHoverEnd={() => setHoveredProduct(null)}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="group relative bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out h-full flex flex-col">
                {/* Image Container with Overlay */}
                <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
                  {!imageLoaded[product._id] && (
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 animate-pulse" />
                  )}
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                    alt={product.name}
                    className={`w-full aspect-square object-cover transition-all duration-700 group-hover:scale-110 ${
                      imageLoaded[product._id] ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => handleImageLoad(product._id)}
                    loading="lazy"
                  />
                  
                  <motion.div 
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />
                  
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  >
                    <button
                      onClick={() => handleQuickView(product)}
                      className="bg-white/90 backdrop-blur-md text-neutral-900 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white shadow-lg text-xs sm:text-sm"
                    >
                      Quick View
                    </button>
                  </motion.div>
                </div>

                {/* Wishlist Button - Responsive positioning */}
                <motion.button
                  onClick={(e) => handleWishlistToggle(product, e)}
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 z-10"
                  aria-label="Add to wishlist"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiHeart
                    className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 ${
                      isWishlisted(product._id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-neutral-600 dark:text-neutral-400 group-hover:text-red-500'
                    }`}
                  />
                </motion.button>

                {/* Trending Badge - Responsive */}
                <motion.div 
                  className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-0.5 sm:gap-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-[9px] sm:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg">
                    <FiZap className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                    <span>Trending</span>
                  </div>
                </motion.div>

                {/* Product Info - Responsive padding */}
                <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
                  {/* Category */}
                  {product.category && (
                    <p className="text-[10px] sm:text-xs text-primary-600 dark:text-primary-400 font-medium mb-0.5 sm:mb-1">
                      {getDisplayCategory(product)}
                    </p>
                  )}

                  {/* Product Name */}
                  <Link to={`/products/${product._id}`} className="block mb-1 sm:mb-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 line-clamp-2 text-xs sm:text-sm lg:text-base">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating - Responsive */}
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

                  {/* Price and Cart Button - Responsive */}
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

                    <motion.button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isAddingToCart}
                      className="relative overflow-hidden group/btn p-1.5 sm:p-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      <FiShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 relative z-10" />
                    </motion.button>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-primary-500/50" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {products.length > 0 && (
          <motion.div 
            className="text-center mt-8 sm:mt-12 lg:mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link
              to="/products?sort=popular"
              className="inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <span>Explore All Trending Products</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
              </motion.div>
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

export default Trending;