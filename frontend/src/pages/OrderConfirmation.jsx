import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiArrowRight,
  FiHome,
  FiClock,
  FiMapPin,
  FiMail,
  FiPhone,
  FiPrinter,
  FiDownload,
  FiShare2,
  FiStar,
  FiHeart,
  FiShield,
  FiRotateCcw,
  FiSmile,
  FiAward,
  FiUsers,
  FiGlobe
} from 'react-icons/fi';
import Button from '../components/common/Button';
import { formatPrice, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = `Order Confirmation - Furniqo`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Check out my order from Furniqo!',
          url: url,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleWriteReview = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center px-[1%]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Thank you for your purchase. You can view your orders in your account.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/orders">
              <Button variant="primary" icon={FiPackage}>View Orders</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" icon={FiHome}>Back to Home</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full px-[1%] py-[1%]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Success Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <FiCheckCircle className="h-12 w-12 text-white" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3"
              >
                Thank You for Your Order!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-neutral-600 dark:text-neutral-400"
              >
                Your order has been confirmed and will be shipped soon.
              </motion.p>
            </div>

            {/* Order Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {[
                { icon: FiShield, label: 'Secure Payment', value: 'Verified', color: 'from-blue-500 to-cyan-500' },
                { icon: FiTruck, label: 'Free Shipping', value: 'Available', color: 'from-green-500 to-emerald-500' },
                { icon: FiRotateCcw, label: 'Easy Returns', value: '30 Days', color: 'from-purple-500 to-pink-500' },
                { icon: FiSmile, label: 'Support', value: '24/7', color: 'from-orange-500 to-red-500' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl p-4 text-center shadow-md border border-neutral-200 dark:border-neutral-700"
                >
                  <div className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Order Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              {/* Order Number Banner */}
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-primary-100 text-sm">Order Number</p>
                    <p className="text-3xl font-bold font-mono tracking-wider">{order.orderNumber || id}</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-primary-100 text-sm">Order Date</p>
                      <p className="font-medium flex items-center gap-1">
                        <FiClock className="h-4 w-4" />
                        {formatDate(order.createdAt || new Date())}
                      </p>
                    </div>
                    <div>
                      <p className="text-primary-100 text-sm">Total Amount</p>
                      <p className="font-bold text-2xl">{formatPrice(order.total || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-end gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Print Order"
                >
                  <FiPrinter className="h-4 w-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Share Order"
                >
                  <FiShare2 className="h-4 w-4" />
                </button>
              </div>

              {/* Order Status Tracker */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/30">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiTruck className="h-5 w-5 text-primary-600" />
                  Order Status
                </h3>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    {['Order Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((status, i) => (
                      <div key={status} className="flex flex-col items-center relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          i === 0 
                            ? 'bg-green-500 text-white ring-4 ring-green-500/30' 
                            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                        }`}>
                          {i === 0 ? <FiCheckCircle className="h-5 w-5" /> : i + 1}
                        </div>
                        <span className="text-xs mt-2 text-neutral-500 text-center hidden sm:block">{status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-5 left-0 right-0 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full">
                    <div className="h-full bg-green-500 rounded-full w-1/5" />
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-6 text-center">
                  Estimated delivery: <span className="font-semibold text-primary-600">5-7 business days</span>
                </p>
              </div>

              {/* Order Items */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <FiPackage className="h-5 w-5 text-primary-600" />
                    Order Items ({order.items?.length || 0})
                  </h3>
                  <button className="text-sm text-primary-600 hover:text-primary-700">View Details</button>
                </div>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 items-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl hover:shadow-md transition-all"
                    >
                      <img
                        src={item.product?.images?.[0] || '/placeholder.jpg'}
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-neutral-900 dark:text-white truncate">
                          {item.product?.name || 'Product'}
                        </p>
                        <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                        {item.variant && (
                          <p className="text-xs text-neutral-400 mt-1">
                            {item.variant.color && `${item.variant.color}`}
                            {item.variant.material && ` • ${item.variant.material}`}
                            {item.variant.size && ` • ${item.variant.size}`}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">
                          {formatPrice((item.variant?.price || item.product?.price || 0) * item.quantity)}
                        </p>
                        <button
                          onClick={() => handleWriteReview(item.product)}
                          className="text-xs text-primary-600 hover:text-primary-700 mt-1 flex items-center gap-1"
                        >
                          <FiStar className="h-3 w-3" />
                          Write Review
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Price Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-medium">{formatPrice(order.subtotal || 0)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Shipping</span>
                    <span className="font-medium">
                      {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Tax</span>
                    <span className="font-medium">{formatPrice(order.tax || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="text-lg font-bold text-neutral-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-primary-600">{formatPrice(order.total || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Contact Info */}
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {order.shipping && (
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                      <FiMapPin className="h-5 w-5 text-primary-600" />
                      Shipping Details
                    </h3>
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {order.shipping.firstName} {order.shipping.lastName}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                        {order.shipping.address}<br />
                        {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-sm text-neutral-500">
                        <FiTruck className="h-4 w-4 text-primary-600" />
                        <span>Standard Shipping (5-7 business days)</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                    <FiSmile className="h-5 w-5 text-primary-600" />
                    Need Help?
                  </h3>
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                      Have questions about your order? Our support team is here to help.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FiMail className="h-4 w-4 text-primary-600" />
                        <span>support@furniqo.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FiPhone className="h-4 w-4 text-primary-600" />
                        <span>1-800-FURNIQO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            >
              <Link to="/orders">
                <Button variant="primary" icon={FiPackage} size="lg" className="shadow-lg">
                  Track Your Order
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" icon={FiArrowRight} size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </motion.div>

            {/* Recommended Products Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white text-center mb-6">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md border border-neutral-200 dark:border-neutral-700"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${item === 1 ? '1555041469-a586c61ea9bc' : item === 2 ? '1524758631624-e2822e304c36' : item === 3 ? '1493663284031-b7e3aefcae8e' : '1490481651871-ab68de25d43d'}?w=300`}
                      alt="Recommended product"
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        Modern {item === 1 ? 'Sofa' : item === 2 ? 'Coffee Table' : item === 3 ? 'Dining Chair' : 'Floor Lamp'}
                      </p>
                      <p className="text-xs text-primary-600 mt-1">${(199 + item * 50).toFixed(0)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-5 text-white">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiCheckCircle className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiStar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Write a Review</h3>
                    <p className="text-white/80 text-xs">Share your experience</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        className="focus:outline-none"
                      >
                        <FiStar className="h-8 w-8 text-gray-300 hover:text-yellow-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
                    placeholder="Summarize your experience"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 resize-none"
                    placeholder="Tell us about your experience with this product..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      toast.success('Thank you for your review!');
                      setShowReviewModal(false);
                    }}
                    className="flex-1"
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderConfirmation;