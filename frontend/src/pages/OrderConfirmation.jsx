import { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiArrowRight,
  FiHome,
} from 'react-icons/fi';
import Button from '../components/common/Button';
import { formatPrice, formatDate } from '../utils/helpers';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!order) {
    return (
      <div className="w-full px-[1%] sm:px-[1.5%] py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center  mb-6"
        >
          <FiCheckCircle className="h-10 w-10 text-green-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Thank you for your purchase. You can view your orders in your account.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/orders">
            <Button variant="primary" icon={FiPackage}>View Orders</Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" icon={FiHome}>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-[1%] sm:px-[1.5%] py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl "
      >
        {/* Success Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center  mb-6"
          >
            <FiCheckCircle className="h-12 w-12 text-green-500" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-3"
          >
            Thank You for Your Order! 🎉
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

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-800 overflow-hidden"
        >
          {/* Order Number Banner */}
          <div className="bg-primary-600 text-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-primary-100 text-sm">Order Number</p>
                <p className="text-2xl font-bold font-mono">{order.orderNumber || id}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-primary-100 text-sm">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt || new Date())}</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="p-6 border-b dark:border-neutral-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FiPackage className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white">Order Confirmed</p>
                <p className="text-sm text-neutral-500">We'll send you shipping updates via email</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((status, i) => (
                  <div key={status} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                    }`}>
                      {i === 0 ? '✓' : i + 1}
                    </div>
                    <span className="text-xs mt-1 text-neutral-500">{status}</span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-1/4" />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b dark:border-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
              Order Items ({order.items?.length || 0})
            </h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <img
                    src={item.product?.images?.[0] || '/placeholder.jpg'}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-neutral-100 dark:bg-neutral-800"
                  />
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-neutral-900 dark:text-white truncate">
                      {item.product?.name || 'Product'}
                    </p>
                    <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                    {item.variant && (
                      <p className="text-xs text-neutral-400">
                        {item.variant.color && `${item.variant.color}`}
                        {item.variant.material && ` • ${item.variant.material}`}
                        {item.variant.size && ` • ${item.variant.size}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-primary-600">
                      {formatPrice((item.variant?.price || item.product?.price || 0) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-6 border-b dark:border-neutral-800">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal || 0)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-medium">
                  {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tax</span>
                <span className="font-medium">{formatPrice(order.tax || 0)}</span>
              </div>
            </div>
            <div className="flex justify-between items-baseline mt-4 pt-4 border-t dark:border-neutral-800">
              <span className="text-lg font-bold text-neutral-900 dark:text-white">Total</span>
              <span className="text-2xl font-bold text-primary-600">{formatPrice(order.total || 0)}</span>
            </div>
          </div>

          {/* Shipping Info */}
          {order.shipping && (
            <div className="p-6">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Shipping Details</h3>
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4">
                <p className="font-medium text-neutral-900 dark:text-white">
                  {order.shipping.firstName} {order.shipping.lastName}
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  {order.shipping.address}<br />
                  {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                </p>
                <div className="flex items-center gap-2 mt-3 text-sm text-neutral-500">
                  <FiTruck className="h-4 w-4 text-primary-600" />
                  <span>Estimated delivery: 5-7 business days</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <Link to="/orders">
            <Button variant="primary" icon={FiPackage} size="lg">Track Your Order</Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary" icon={FiArrowRight} size="lg">Continue Shopping</Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;