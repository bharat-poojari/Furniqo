import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiArrowLeft, 
  FiTrash2, 
  FiMinus, 
  FiPlus,
  FiHeart,
  FiTag,
  FiLoader,
  FiTruck,
  FiShield,
  FiClock,
  FiDollarSign,
  FiPercent,
  FiChevronRight,
  FiGift,
  FiLock,
  FiRefreshCw,
  FiAlertCircle,
  FiCreditCard,
  FiPackage,
  FiMapPin,
  FiCalendar,
  FiStar,
  FiChevronDown,
  FiCheckCircle,
  FiAward,
} from 'react-icons/fi';
import { useCart } from '../store/CartContext';
import { useWishlist } from '../store/WishlistContext';
import { useAuth } from '../store/AuthContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { CartSkeleton } from '../components/common/Skeleton';
import { formatPrice } from '../utils/helpers';
import { SHIPPING_METHODS } from '../utils/constants';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';
import { useState, useEffect, useRef, useCallback } from 'react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    scale: 0.9,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const summaryVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

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
    applyCoupon,
  } = useCart();
  
  const { addToWishlist, isWishlisted } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [showGiftOptions, setShowGiftOptions] = useState(false);
  const [selectedGiftWrap, setSelectedGiftWrap] = useState(false);
  const [rushDelivery, setRushDelivery] = useState(false);
  const [donateToCharity, setDonateToCharity] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [activeDeliverySlot, setActiveDeliverySlot] = useState(0);
  const [isSummarySticky, setIsSummarySticky] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [priceAnimations, setPriceAnimations] = useState({});
  
  const summaryRef = useRef(null);
  const mainContentRef = useRef(null);

  // Simulate fetching recommended products
  useEffect(() => {
    if (cartItems.length > 0) {
      const fetchRecommendations = async () => {
        const mockRecommendations = [
          { id: 1, name: 'Premium Cushion Set', price: 2499, image: '/images/cushion.jpg', rating: 4.8, soldCount: 1243 },
          { id: 2, name: 'Anti-Static Mat', price: 1499, image: '/images/mat.jpg', rating: 4.6, soldCount: 892 },
          { id: 3, name: 'Fabric Protector Spray', price: 899, image: '/images/spray.jpg', rating: 4.7, soldCount: 2156 },
          { id: 4, name: 'Ergonomic Arm Rest', price: 1299, image: '/images/armrest.jpg', rating: 4.5, soldCount: 567 },
        ];
        setRecommendedProducts(mockRecommendations);
      };
      fetchRecommendations();
    }
  }, [cartItems]);

  // Sticky summary observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSummarySticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
    );
    if (mainContentRef.current) observer.observe(mainContentRef.current);
    return () => observer.disconnect();
  }, []);

  // FIXED: Animate price changes - removed dependency on priceAnimations to prevent infinite loop
  useEffect(() => {
    const newAnimations = {};
    cartItems.forEach(item => {
      const total = getItemPrice(item) * item.quantity;
      if (priceAnimations[item._id] !== total) {
        newAnimations[item._id] = total;
      }
    });
    
    if (Object.keys(newAnimations).length > 0) {
      setPriceAnimations(prev => ({ ...prev, ...newAnimations }));
      // Clear animations after timeout
      const timer = setTimeout(() => {
        setPriceAnimations({});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [cartItems, getItemPrice]); // Removed priceAnimations from dependencies

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-full overflow-x-hidden px-[1%]"
      >
        <CartSkeleton />
      </motion.div>
    );
  }

  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
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

  const handleMoveToWishlist = useCallback((item) => {
    addToWishlist(item.product);
    removeFromCart(item._id);
    toast.success(`Moved ${item.product.name} to wishlist`, {
      icon: '❤️',
      duration: 3000,
      style: { borderRadius: '12px', background: '#333', color: '#fff' },
    });
  }, [addToWishlist, removeFromCart]);

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      toast.error('Please enter a coupon code');
      return;
    }

    setApplyingCoupon(true);
    setCouponError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const validCoupons = {
        'WELCOME10': { discount: 10, type: 'percentage', minOrder: 0 },
        'FURNIQO15': { discount: 15, type: 'percentage', minOrder: 5000 },
        'SAVE200': { discount: 200, type: 'fixed', minOrder: 2000 },
        'FREESHIP': { discount: getShippingCost(), type: 'shipping', minOrder: 0 },
      };
      
      if (validCoupons[couponCode.toUpperCase()]) {
        // Simulate applying coupon
        if (applyCoupon) {
          await applyCoupon(couponCode.toUpperCase());
        }
        toast.success(`Coupon ${couponCode.toUpperCase()} applied successfully!`, {
          icon: '🎉',
          duration: 3000,
        });
        setCouponCode('');
      } else {
        setCouponError('Invalid coupon code');
        toast.error('Invalid coupon code');
      }
    } catch (error) {
      setCouponError('Failed to apply coupon. Please try again.');
    } finally {
      setApplyingCoupon(false);
    }
  }, [couponCode, getShippingCost, applyCoupon]);

  const getTotalSavings = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      const currentPrice = getItemPrice(item);
      if (originalPrice > currentPrice) {
        return total + ((originalPrice - currentPrice) * item.quantity);
      }
      return total;
    }, 0);
  }, [cartItems, getItemPrice]);

  const totalSavings = getTotalSavings();
  const subtotal = getSubtotal();
  const discount = getDiscount();
  let shipping = getShippingCost();
  let giftWrapCost = selectedGiftWrap ? 299 : 0;
  let rushDeliveryCost = rushDelivery ? 499 : 0;
  let insuranceCost = insurance ? 199 : 0;
  let charityDonation = donateToCharity ? 100 : 0;
  
  if (rushDelivery && subtotal > 10000) rushDeliveryCost = 299;
  
  const tax = getTax();
  const total = subtotal - discount + shipping + giftWrapCost + rushDeliveryCost + insuranceCost + charityDonation;
  const freeShippingEligible = subtotal - discount >= 5000;
  if (freeShippingEligible) shipping = 0;

  const deliverySlots = [
    { date: 'Tomorrow, Apr 25', available: true, time: '9 AM - 1 PM', icon: FiClock },
    { date: 'Saturday, Apr 26', available: true, time: '1 PM - 5 PM', icon: FiCalendar },
    { date: 'Sunday, Apr 27', available: true, time: '10 AM - 2 PM', icon: FiPackage },
  ];

  const trustBadges = [
    { icon: FiTruck, text: 'Free Delivery', subtext: 'On orders over ₹5000', color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
    { icon: FiRefreshCw, text: 'Easy Returns', subtext: '30 days return policy', color: 'green', gradient: 'from-green-500 to-emerald-500' },
    { icon: FiShield, text: 'Secure Payment', subtext: '100% secure checkout', color: 'purple', gradient: 'from-purple-500 to-violet-500' },
    { icon: FiClock, text: '24/7 Support', subtext: 'Customer care', color: 'orange', gradient: 'from-orange-500 to-amber-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-full overflow-x-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 min-h-screen"
    >
      <div className="w-full px-[1%] py-6 lg:py-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-2 text-sm text-neutral-500 mb-6"
          >
            <Link to="/" className="hover:text-primary-600 transition-colors relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <FiChevronRight className="h-3 w-3" />
            <Link to="/products" className="hover:text-primary-600 transition-colors relative group">
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <FiChevronRight className="h-3 w-3" />
            <motion.span 
              className="text-neutral-900 dark:text-white font-medium"
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 0.5 }}
            >
              Shopping Cart
            </motion.span>
          </motion.div>

          {/* Header */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
          >
            <div>
              <motion.h1 
                className="text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-300 dark:to-white bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
              >
                Shopping Cart
              </motion.h1>
              <div className="flex items-center gap-3 mt-3">
                <motion.span 
                  className="text-sm text-neutral-600 dark:text-neutral-400"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </motion.span>
                {totalSavings > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium"
                  >
                    <FiTag className="h-3 w-3" />
                    Save {formatPrice(totalSavings)}
                  </motion.span>
                )}
                {isAuthenticated && user?.membershipTier === 'premium' && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                    className="text-xs bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium"
                  >
                    <FiStar className="h-3 w-3" />
                    Premium Member
                  </motion.span>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/products"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all duration-300 hover:shadow-md hover:border-primary-300"
                >
                  <FiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Continue Shopping
                </Link>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearCart}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-all duration-300"
              >
                <FiTrash2 className="h-4 w-4" />
                Clear Cart
              </motion.button>
            </div>
          </motion.div>

          {/* Free Shipping Progress Bar */}
          {!freeShippingEligible && subtotal - discount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-5 border border-blue-100 dark:border-blue-900/50 shadow-lg overflow-hidden relative group"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm mb-3 gap-2">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <motion.div
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <FiTruck className="h-5 w-5" />
                  </motion.div>
                  <span className="font-semibold">Unlock Free Shipping</span>
                </div>
                <span className="text-blue-700 dark:text-blue-400 font-bold">
                  Add {formatPrice(5000 - (subtotal - discount))} more
                </span>
              </div>
              <div className="relative h-3 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((subtotal - discount) / 5000) * 100, 100)}%` }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
              <motion.p 
                className="text-xs text-blue-600 dark:text-blue-400 mt-3"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Get free shipping on orders over {formatPrice(5000)}
              </motion.p>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8" ref={mainContentRef}>
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-5">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, idx) => {
                  const price = getItemPrice(item);
                  const itemTotal = price * item.quantity;
                  const originalPrice = item.product.originalPrice || item.product.price;
                  const hasDiscount = originalPrice > price;
                  const inWishlist = isWishlisted(item.product._id);
                  const maxQuantity = Math.min(item.product.stock || 99, 10);
                  const isPriceAnimating = priceAnimations[item._id];

                  return (
                    <motion.div
                      key={item._id}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={idx}
                      onHoverStart={() => setHoveredItem(item._id)}
                      onHoverEnd={() => setHoveredItem(null)}
                      className="group bg-white dark:bg-neutral-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 border border-neutral-200 dark:border-neutral-800 overflow-hidden"
                    >
                      <div className="p-5 lg:p-6">
                        <div className="flex gap-5">
                          {/* Product Image */}
                          <Link
                            to={`/products/${item.product.slug}`}
                            className="flex-shrink-0"
                          >
                            <motion.div 
                              className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-md"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            >
                              <img
                                src={item.product.images?.[0] || '/images/placeholder.jpg'}
                                alt={item.product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                              />
                              {hasDiscount && (
                                <motion.div 
                                  initial={{ scale: 0, rotate: -10 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-lg"
                                >
                                  -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
                                </motion.div>
                              )}
                              {item.product.stock < 5 && item.product.stock > 0 && (
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="absolute bottom-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                                >
                                  Only {item.product.stock} left
                                </motion.div>
                              )}
                            </motion.div>
                          </Link>

                          {/* Product Details */}
                          <div className="flex-grow min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                              <div className="flex-1">
                                <Link
                                  to={`/products/${item.product.slug}`}
                                  className="font-semibold text-lg lg:text-xl text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
                                >
                                  {item.product.name}
                                </Link>
                                
                                {item.variant && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {item.variant.color && (
                                      <div className="flex items-center gap-1.5 text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                        <span 
                                          className="w-2.5 h-2.5 rounded-full"
                                          style={{ backgroundColor: item.variant.color.toLowerCase() }}
                                        />
                                        <span>{item.variant.color}</span>
                                      </div>
                                    )}
                                    {item.variant.material && (
                                      <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                        {item.variant.material}
                                      </span>
                                    )}
                                    {item.variant.size && (
                                      <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                        Size: {item.variant.size}
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                <div className="mt-2">
                                  {item.product.inStock ? (
                                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                      In Stock • Ships in 24hrs
                                    </span>
                                  ) : (
                                    <span className="text-xs text-red-600 flex items-center gap-1.5">
                                      <FiAlertCircle className="h-3 w-3" />
                                      Out of Stock • Backorder available
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Price */}
                              <div className="text-left sm:text-right flex-shrink-0">
                                <div className="flex items-center gap-2 sm:justify-end">
                                  {hasDiscount && (
                                    <span className="text-sm text-neutral-400 line-through">
                                      {formatPrice(originalPrice)}
                                    </span>
                                  )}
                                  <p 
                                    className={`font-bold text-xl lg:text-2xl bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent ${
                                      isPriceAnimating ? 'animate-pulse' : ''
                                    }`}
                                  >
                                    {formatPrice(price)}
                                  </p>
                                </div>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-neutral-500 mt-0.5">
                                    {formatPrice(itemTotal)} total
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                              <div className="flex items-center gap-3">
                                {/* Quantity Selector */}
                                <div className="flex items-center border-2 border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
                                  <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={item.quantity <= 1}
                                  >
                                    <FiMinus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="w-12 text-center font-medium text-sm">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={item.quantity >= maxQuantity}
                                  >
                                    <FiPlus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                
                                {item.quantity === maxQuantity && (
                                  <span className="text-[10px] text-orange-500 font-medium">
                                    Max limit reached
                                  </span>
                                )}

                                {/* Move to Wishlist */}
                                {!inWishlist && (
                                  <button
                                    onClick={() => handleMoveToWishlist(item)}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                                  >
                                    <FiHeart className="h-4 w-4" />
                                    <span className="hidden sm:inline">Save for later</span>
                                  </button>
                                )}
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeFromCart(item._id)}
                                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Animated border on hover */}
                      <div 
                        className={`h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 transition-transform duration-300 origin-left ${
                          hoveredItem === item._id ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Recommended Products */}
              {recommendedProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 pt-6 border-t-2 border-neutral-200 dark:border-neutral-800"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        Frequently Bought Together
                        <FiGift className="h-5 w-5 text-primary-500" />
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        Complete your purchase with these essentials
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {recommendedProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="block p-4 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800/50 dark:to-neutral-900 rounded-xl hover:shadow-lg transition-all duration-300 border border-neutral-200 dark:border-neutral-800"
                      >
                        <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800 rounded-lg mb-3 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-base font-bold text-primary-600">{formatPrice(product.price)}</p>
                          <div className="flex items-center gap-1">
                            <FiStar className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium text-neutral-600">{product.rating}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-1">Sold: {product.soldCount}</p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {trustBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="text-center p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${badge.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <badge.icon className={`h-6 w-6 text-${badge.color}-500 mx-auto mb-2`} />
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">{badge.text}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{badge.subtext}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <motion.div
              ref={summaryRef}
              variants={summaryVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-1"
            >
              <div className={cn(
                "transition-all duration-500",
                isSummarySticky && "lg:sticky lg:top-24"
              )}>
                <div className="space-y-5">
                  {/* Main Order Summary Card */}
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="p-6 lg:p-7">
                      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                        <FiShoppingCart className="h-6 w-6 text-primary-500" />
                        Order Summary
                      </h3>

                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                          <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                          <span className="font-bold text-neutral-900 dark:text-white">
                            {formatPrice(subtotal)}
                          </span>
                        </div>

                        {discount > 0 && (
                          <div className="flex justify-between py-2 text-green-600 dark:text-green-400 border-b border-neutral-100 dark:border-neutral-800">
                            <span className="flex items-center gap-1">
                              <FiPercent className="h-3.5 w-3.5" />
                              Discount
                            </span>
                            <span className="font-bold">-{formatPrice(discount)}</span>
                          </div>
                        )}

                        <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                          <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                            <FiTruck className="h-3.5 w-3.5" />
                            <span>Shipping</span>
                          </div>
                          <span className={cn("font-bold", shipping === 0 && "text-green-600")}>
                            {shipping === 0 ? (
                              <span className="flex items-center gap-1">
                                <FiCheckCircle className="h-3 w-3" /> FREE
                              </span>
                            ) : formatPrice(shipping)}
                          </span>
                        </div>

                        <AnimatePresence>
                          {selectedGiftWrap && (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex justify-between py-2"
                            >
                              <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                                <FiPackage className="h-3.5 w-3.5" />
                                <span>Gift Wrap</span>
                              </div>
                              <span className="font-bold">{formatPrice(giftWrapCost)}</span>
                            </motion.div>
                          )}
                          {rushDelivery && (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex justify-between py-2"
                            >
                              <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                                <FiCalendar className="h-3.5 w-3.5" />
                                <span>Rush Delivery</span>
                              </div>
                              <span className="font-bold">{formatPrice(rushDeliveryCost)}</span>
                            </motion.div>
                          )}
                          {insurance && (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex justify-between py-2"
                            >
                              <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                                <FiShield className="h-3.5 w-3.5" />
                                <span>Shipping Insurance</span>
                              </div>
                              <span className="font-bold">{formatPrice(insuranceCost)}</span>
                            </motion.div>
                          )}
                          {donateToCharity && (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex justify-between py-2 text-green-600"
                            >
                              <div className="flex items-center gap-1">
                                <FiHeart className="h-3.5 w-3.5" />
                                <span>Charity Donation</span>
                              </div>
                              <span className="font-bold">{formatPrice(charityDonation)}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                          <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                            <FiDollarSign className="h-3.5 w-3.5" />
                            <span>Tax (GST 18%)</span>
                          </div>
                          <span className="font-bold text-neutral-900 dark:text-white">
                            {formatPrice(tax)}
                          </span>
                        </div>

                        {/* Coupon Code Input */}
                        <div className="mt-4 pt-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              placeholder="Gift card or promo code"
                              className="flex-1 px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                            <button
                              onClick={handleApplyCoupon}
                              disabled={applyingCoupon}
                              className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold rounded-xl transition-all duration-300 disabled:opacity-50 shadow-md"
                            >
                              {applyingCoupon ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              ) : 'Apply'}
                            </button>
                          </div>
                          {couponError && (
                            <p className="text-xs text-red-500 mt-2">
                              {couponError}
                            </p>
                          )}
                          {appliedCoupon && (
                            <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 border border-green-200 dark:border-green-800">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FiTag className="h-3.5 w-3.5 text-green-600" />
                                  <span className="text-sm font-bold text-green-700 dark:text-green-400">
                                    {appliedCoupon.code} applied
                                  </span>
                                </div>
                                <button
                                  onClick={removeCoupon}
                                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Add-ons Section */}
                      <div className="border-t dark:border-neutral-800 my-5 pt-4 space-y-3">
                        <button
                          onClick={() => setShowGiftOptions(!showGiftOptions)}
                          className="w-full flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors"
                        >
                          <span className="flex items-center gap-2 font-medium">
                            <FiGift className="h-4 w-4" />
                            Add gift options
                          </span>
                          <FiChevronRight className={`h-4 w-4 transition-transform duration-300 ${showGiftOptions ? 'rotate-90' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {showGiftOptions && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-3 pt-2 overflow-hidden"
                            >
                              {[
                                { label: "Premium Gift Wrap", price: "+₹299", description: "Includes gift box & message card", checked: selectedGiftWrap, setter: setSelectedGiftWrap, key: "giftWrap" },
                                { label: "Rush Delivery", price: `+₹${rushDeliveryCost}`, description: "Priority processing & fast shipping", checked: rushDelivery, setter: setRushDelivery, key: "rushDelivery" },
                                { label: "Shipping Insurance", price: "+₹199", description: "Protect your order", checked: insurance, setter: setInsurance, key: "insurance" },
                                { label: "Donate to Charity", price: "+₹100", description: "Support education for children", checked: donateToCharity, setter: setDonateToCharity, key: "charity" },
                              ].map((option) => (
                                <label
                                  key={option.key}
                                  className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                >
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      checked={option.checked}
                                      onChange={(e) => option.setter(e.target.checked)}
                                      className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                    />
                                    <div>
                                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{option.label}</span>
                                      <p className="text-[10px] text-neutral-400">{option.description}</p>
                                    </div>
                                  </div>
                                  <span className="text-xs font-bold text-primary-600">{option.price}</span>
                                </label>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="border-t dark:border-neutral-800 my-5 pt-5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xl font-bold text-neutral-900 dark:text-white">
                            Total
                          </span>
                          <div className="text-right">
                            <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                              {formatPrice(total)}
                            </span>
                            <p className="text-[10px] text-neutral-500 mt-1">
                              Inclusive of all taxes
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Slot Selection */}
                      <div className="mt-5">
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                          <FiCalendar className="h-4 w-4 text-primary-500" />
                          Select Delivery Slot
                        </h4>
                        <div className="space-y-2">
                          {deliverySlots.map((slot, idx) => (
                            <label
                              key={idx}
                              className={cn(
                                "flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-300",
                                activeDeliverySlot === idx 
                                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20" 
                                  : "border-neutral-200 dark:border-neutral-700 hover:border-primary-300"
                              )}
                            >
                              <input
                                type="radio"
                                name="delivery"
                                className="text-primary-600 w-4 h-4"
                                checked={activeDeliverySlot === idx}
                                onChange={() => setActiveDeliverySlot(idx)}
                              />
                              <div>
                                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{slot.date}</p>
                                <p className="text-xs text-neutral-500">{slot.time}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <Link to="/checkout" className="block w-full mt-6">
                        <Button
                          variant="primary"
                          size="lg"
                          className="w-full group relative overflow-hidden shadow-lg"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2 text-base font-bold">
                            Proceed to Checkout
                            <FiChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Button>
                      </Link>

                      {/* Secure Checkout Badge */}
                      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
                        <FiLock className="h-3.5 w-3.5 text-green-600" />
                        <span>Secure checkout with SSL encryption</span>
                      </div>

                      {/* Payment Methods */}
                      <div className="mt-5 pt-4 border-t dark:border-neutral-800">
                        <p className="text-xs text-neutral-500 text-center mb-2">Secure payments by</p>
                        <div className="flex items-center justify-center gap-3">
                          {/* Visa */}
                          <div className="w-8 h-5 bg-[#1A1F71] rounded"></div>
                          {/* Mastercard */}
                          <div className="w-8 h-5 bg-[#EB001B] rounded"></div>
                          {/* PayPal */}
                          <div className="w-8 h-5 bg-[#003087] rounded"></div>
                          {/* Amex */}
                          <div className="w-8 h-5 bg-[#006FCF] rounded"></div>
                        </div>
                        <p className="text-[10px] text-neutral-400 text-center mt-2">
                          100% secure encrypted payments
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Delivery Info */}
                  <div className="bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-950/30 dark:to-indigo-950/30 rounded-xl p-5 border border-primary-100 dark:border-primary-900/50">
                    <div className="flex items-start gap-3">
                      <FiTruck className="h-6 w-6 text-primary-600" />
                      <div>
                        <p className="text-base font-bold text-primary-900 dark:text-primary-400">
                          Estimated Delivery
                        </p>
                        <p className="text-sm text-primary-700 dark:text-primary-500 mt-1 font-medium">
                          {rushDelivery ? '2-3 business days' : '5-7 business days'}
                        </p>
                        <p className="text-xs text-primary-600 dark:text-primary-400 mt-3 flex items-center gap-1">
                          <FiAward className="h-3 w-3" />
                          Free replacement within 7 days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown Note */}
                  <div className="text-center text-[10px] text-neutral-400 space-y-1">
                    <p>Prices are inclusive of all taxes and cess</p>
                    <p>GST invoice will be provided</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;