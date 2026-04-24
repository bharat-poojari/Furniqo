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
import { useState, useEffect } from 'react';

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

  // Simulate fetching recommended products
  useEffect(() => {
    if (cartItems.length > 0) {
      // Get categories from cart to recommend similar items
      const categories = [...new Set(cartItems.map(item => item.product.category))];
      // Simulate API call
      const fetchRecommendations = async () => {
        // In real app, call your API
        const mockRecommendations = [
          { id: 1, name: 'Premium Cushion Set', price: 2499, image: '/images/cushion.jpg', rating: 4.8 },
          { id: 2, name: 'Anti-Static Mat', price: 1499, image: '/images/mat.jpg', rating: 4.6 },
          { id: 3, name: 'Fabric Protector Spray', price: 899, image: '/images/spray.jpg', rating: 4.7 },
        ];
        setRecommendedProducts(mockRecommendations);
      };
      fetchRecommendations();
    }
  }, [cartItems]);

  if (loading) {
    return <CartSkeleton />;
  }

  if (isEmpty) {
    return (
      <div className="w-full px-[1%] sm:px-[1.5%] py-16 min-h-[60vh] flex items-center justify-center">
        <EmptyState
          icon={FiShoppingCart}
          title="Your Cart is Empty"
          description="Looks like you haven't added any items to your cart yet. Start shopping to find your perfect furniture!"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </div>
    );
  }

  const handleMoveToWishlist = (item) => {
    addToWishlist(item.product);
    removeFromCart(item._id);
    toast.success(`Moved ${item.product.name} to wishlist`, {
      icon: '❤️',
      duration: 3000,
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setApplyingCoupon(true);
    setCouponError('');
    
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock coupon validation
      const validCoupons = {
        'WELCOME10': { discount: 10, type: 'percentage', minOrder: 0 },
        'FURNIQO15': { discount: 15, type: 'percentage', minOrder: 5000 },
        'SAVE200': { discount: 200, type: 'fixed', minOrder: 2000 },
        'FREESHIP': { discount: getShippingCost(), type: 'shipping', minOrder: 0 },
      };
      
      if (validCoupons[couponCode.toUpperCase()]) {
        // In real app, call applyCoupon from cart context
        toast.success(`Coupon ${couponCode.toUpperCase()} applied successfully!`);
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
  };

  // Calculate savings
  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.product.originalPrice || item.product.price;
      const currentPrice = getItemPrice(item);
      if (originalPrice > currentPrice) {
        return total + ((originalPrice - currentPrice) * item.quantity);
      }
      return total;
    }, 0);
  };

  const totalSavings = getTotalSavings();
  const subtotal = getSubtotal();
  const discount = getDiscount();
  let shipping = getShippingCost();
  let giftWrapCost = selectedGiftWrap ? 299 : 0;
  let rushDeliveryCost = rushDelivery ? 499 : 0;
  let insuranceCost = insurance ? 199 : 0;
  let charityDonation = donateToCharity ? 100 : 0;
  
  // Apply rush delivery discount logic
  if (rushDelivery && subtotal > 10000) {
    rushDeliveryCost = 299; // Discounted rush delivery
  }
  
  const tax = getTax();
  const total = subtotal - discount + shipping + giftWrapCost + rushDeliveryCost + insuranceCost + charityDonation;
  const freeShippingEligible = subtotal - discount >= 5000;
  
  if (freeShippingEligible) shipping = 0;

  // Shipping estimate
  const shippingEstimate = {
    standard: { days: '5-7 business days', cost: 499 },
    express: { days: '2-3 business days', cost: 999 },
    nextDay: { days: '1-2 business days', cost: 1499 },
  };

  // Delivery slots
  const deliverySlots = [
    { date: 'Tomorrow, Apr 25', available: true, time: '9 AM - 1 PM' },
    { date: 'Saturday, Apr 26', available: true, time: '1 PM - 5 PM' },
    { date: 'Sunday, Apr 27', available: true, time: '10 AM - 2 PM' },
  ];

  return (
    <div className="w-full px-[1%] sm:px-[1.5%] py-8 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <FiChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-primary-600 transition-colors">Shop</Link>
          <FiChevronRight className="h-3 w-3" />
          <span className="text-neutral-900 dark:text-white font-medium">Shopping Cart</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
              {totalSavings > 0 && (
                <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
                  <FiTag className="h-3 w-3" />
                  Save {formatPrice(totalSavings)}
                </span>
              )}
              {isAuthenticated && user?.membershipTier === 'premium' && (
                <span className="text-xs bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
                  <FiStar className="h-3 w-3" />
                  Premium Member
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link
              to="/products"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all duration-200"
            >
              <FiArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
            >
              <FiTrash2 className="h-4 w-4" />
              Clear Cart
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Bar */}
        {!freeShippingEligible && subtotal - discount > 0 && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50 shadow-sm">
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <FiTruck className="h-4 w-4" />
                <span className="font-semibold">Unlock Free Shipping</span>
              </div>
              <span className="text-blue-700 dark:text-blue-400 font-semibold">
                Add {formatPrice(5000 - (subtotal - discount))} more
              </span>
            </div>
            <div className="relative h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(((subtotal - discount) / 5000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              Get free shipping on orders over {formatPrice(5000)}
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item, idx) => {
                const price = getItemPrice(item);
                const itemTotal = price * item.quantity;
                const originalPrice = item.product.originalPrice || item.product.price;
                const hasDiscount = originalPrice > price;
                const inWishlist = isWishlisted(item.product._id);
                const maxQuantity = Math.min(item.product.stock || 99, 10); // Max 10 items per order

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white dark:bg-neutral-900 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-neutral-200 dark:border-neutral-800 overflow-hidden"
                  >
                    <div className="p-4 lg:p-5">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link
                          to={`/products/${item.product.slug}`}
                          className="flex-shrink-0"
                        >
                          <div className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                            <img
                              src={item.product.images?.[0] || '/images/placeholder.jpg'}
                              alt={item.product.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            {hasDiscount && (
                              <div className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-lg">
                                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
                              </div>
                            )}
                            {item.product.stock < 5 && item.product.stock > 0 && (
                              <div className="absolute bottom-1 left-1 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                                Only {item.product.stock} left
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                            <div className="flex-1">
                              <Link
                                to={`/products/${item.product.slug}`}
                                className="font-semibold text-base lg:text-lg text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
                              >
                                {item.product.name}
                              </Link>
                              
                              {item.variant && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {item.variant.color && (
                                    <div className="flex items-center gap-1.5 text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.variant.color.toLowerCase() }} />
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
                                <p className="font-bold text-lg lg:text-xl text-primary-600 dark:text-primary-400">
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
                            <div className="flex items-center gap-2">
                              {/* Quantity Selector with dynamic limits */}
                              <div className="flex items-center border-2 border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900">
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded-l-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <FiMinus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-12 text-center font-medium text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded-r-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity >= maxQuantity}
                                  aria-label="Increase quantity"
                                >
                                  <FiPlus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              
                              {item.quantity === maxQuantity && (
                                <span className="text-[10px] text-orange-500">Max limit reached</span>
                              )}

                              {/* Move to Wishlist */}
                              {!inWishlist && (
                                <button
                                  onClick={() => handleMoveToWishlist(item)}
                                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                                >
                                  <FiHeart className="h-4 w-4" />
                                  <span className="hidden sm:inline">Save for later</span>
                                </button>
                              )}
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                              aria-label="Remove item"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Recommended Products */}
            {recommendedProducts.length > 0 && (
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      Frequently Bought Together
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Complete your purchase with these essentials
                    </p>
                  </div>
                  <FiGift className="h-5 w-5 text-primary-500" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {recommendedProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="group p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
                    >
                      <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-lg mb-2 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-bold text-primary-600">{formatPrice(product.price)}</p>
                        <div className="flex items-center gap-0.5">
                          <FiStar className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-neutral-600">{product.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { icon: FiTruck, text: 'Free Delivery', subtext: 'On orders over ₹5000', color: 'blue' },
                { icon: FiRefreshCw, text: 'Easy Returns', subtext: '30 days return policy', color: 'green' },
                { icon: FiShield, text: 'Secure Payment', subtext: '100% secure checkout', color: 'purple' },
                { icon: FiClock, text: '24/7 Support', subtext: 'Customer care', color: 'orange' },
              ].map((badge, idx) => (
                <div key={idx} className="text-center p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow">
                  <badge.icon className={`h-5 w-5 text-${badge.color}-500 mx-auto mb-1.5`} />
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">{badge.text}</p>
                  <p className="text-[10px] text-neutral-500">{badge.subtext}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Main Order Summary Card */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="p-5 lg:p-6">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                    <FiShoppingCart className="h-5 w-5 text-primary-500" />
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2">
                      <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between py-2 text-green-600 dark:text-green-400">
                        <span className="flex items-center gap-1">
                          <FiPercent className="h-3.5 w-3.5" />
                          Discount
                        </span>
                        <span className="font-semibold">-{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between py-2">
                      <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                        <FiTruck className="h-3.5 w-3.5" />
                        <span>Shipping</span>
                      </div>
                      <span className={cn(
                        "font-semibold",
                        shipping === 0 && "text-green-600 dark:text-green-400"
                      )}>
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                      </span>
                    </div>

                    {selectedGiftWrap && (
                      <div className="flex justify-between py-2">
                        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                          <FiPackage className="h-3.5 w-3.5" />
                          <span>Gift Wrap</span>
                        </div>
                        <span className="font-semibold">{formatPrice(giftWrapCost)}</span>
                      </div>
                    )}

                    {rushDelivery && (
                      <div className="flex justify-between py-2">
                        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                          <FiCalendar className="h-3.5 w-3.5" />
                          <span>Rush Delivery</span>
                        </div>
                        <span className="font-semibold">{formatPrice(rushDeliveryCost)}</span>
                      </div>
                    )}

                    {insurance && (
                      <div className="flex justify-between py-2">
                        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                          <FiShield className="h-3.5 w-3.5" />
                          <span>Shipping Insurance</span>
                        </div>
                        <span className="font-semibold">{formatPrice(insuranceCost)}</span>
                      </div>
                    )}

                    {donateToCharity && (
                      <div className="flex justify-between py-2 text-green-600">
                        <div className="flex items-center gap-1">
                          <FiHeart className="h-3.5 w-3.5" />
                          <span>Charity Donation</span>
                        </div>
                        <span className="font-semibold">{formatPrice(charityDonation)}</span>
                      </div>
                    )}

                    <div className="flex justify-between py-2">
                      <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                        <FiDollarSign className="h-3.5 w-3.5" />
                        <span>Tax (GST 18%)</span>
                      </div>
                      <span className="font-semibold text-neutral-900 dark:text-white">
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
                          className="flex-1 px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={applyingCoupon}
                          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                        >
                          {applyingCoupon ? <FiLoader className="h-4 w-4 animate-spin" /> : 'Apply'}
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-red-500 mt-1">{couponError}</p>
                      )}
                      {appliedCoupon && (
                        <div className="mt-2 bg-green-50 dark:bg-green-900/20 rounded-xl p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <FiTag className="h-3 w-3 text-green-600" />
                              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                                {appliedCoupon.code} applied
                              </span>
                            </div>
                            <button
                              onClick={removeCoupon}
                              className="text-xs text-red-500 hover:text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add-ons Section */}
                  <div className="border-t dark:border-neutral-800 my-4 pt-4 space-y-2">
                    <button
                      onClick={() => setShowGiftOptions(!showGiftOptions)}
                      className="w-full flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FiGift className="h-4 w-4" />
                        Add gift options
                      </span>
                      <FiChevronRight className={cn("h-4 w-4 transition-transform", showGiftOptions && "rotate-90")} />
                    </button>
                    
                    {showGiftOptions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 pt-2"
                      >
                        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedGiftWrap}
                              onChange={(e) => setSelectedGiftWrap(e.target.checked)}
                              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm">Premium Gift Wrap (+₹299)</span>
                          </div>
                          <span className="text-xs text-neutral-500">Includes gift box & message card</span>
                        </label>
                        
                        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={rushDelivery}
                              onChange={(e) => setRushDelivery(e.target.checked)}
                              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm">Rush Delivery (+₹{rushDeliveryCost})</span>
                          </div>
                          <span className="text-xs text-neutral-500">Priority processing & fast shipping</span>
                        </label>
                        
                        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={insurance}
                              onChange={(e) => setInsurance(e.target.checked)}
                              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm">Shipping Insurance (+₹199)</span>
                          </div>
                          <span className="text-xs text-neutral-500">Protect your order</span>
                        </label>
                        
                        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={donateToCharity}
                              onChange={(e) => setDonateToCharity(e.target.checked)}
                              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm">Donate to Charity (+₹100)</span>
                          </div>
                          <span className="text-xs text-neutral-500">Support education for children</span>
                        </label>
                      </motion.div>
                    )}
                  </div>

                  <div className="border-t dark:border-neutral-800 my-4 pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-bold text-neutral-900 dark:text-white">
                        Total
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                          {formatPrice(total)}
                        </span>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Inclusive of all taxes
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Slot Selection */}
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                      <FiCalendar className="h-4 w-4 text-primary-500" />
                      Select Delivery Slot
                    </h4>
                    <div className="space-y-2">
                      {deliverySlots.map((slot, idx) => (
                        <label key={idx} className="flex items-center gap-3 p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                          <input type="radio" name="delivery" className="text-primary-600" defaultChecked={idx === 0} />
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{slot.date}</p>
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
                      className="w-full group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Proceed to Checkout
                        <FiChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>

                  {/* Secure Checkout Badge */}
                  <div className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <FiLock className="h-3.5 w-3.5 text-green-600" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>

                  {/* Payment Methods */}
                  <div className="mt-4 pt-3 border-t dark:border-neutral-800">
                    <p className="text-xs text-neutral-500 text-center mb-2">We accept</p>
                    <div className="flex items-center justify-center gap-3">
                      <FiCreditCard className="h-5 w-5 text-neutral-400" />
                      <span className="text-lg">💳</span>
                      <span className="text-lg">🏦</span>
                      <span className="text-lg">📱</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estimated Delivery Info */}
              <div className="bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-primary-100 dark:border-primary-900/50">
                <div className="flex items-start gap-3">
                  <FiTruck className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-primary-900 dark:text-primary-400">
                      Estimated Delivery
                    </p>
                    <p className="text-xs text-primary-700 dark:text-primary-500 mt-1">
                      {rushDelivery ? '2-3 business days' : '5-7 business days'}
                    </p>
                    <p className="text-xs text-primary-600 dark:text-primary-400 mt-2">
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
        </div>
      </div>
    </div>
  );
};

export default Cart;