// src/pages/OrderDetails.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle,
  FiArrowLeft, FiMapPin, FiMail, FiPhone, FiPrinter,
  FiShoppingBag, FiCalendar, FiDollarSign, FiPercent,
  FiShield, FiAlertCircle, FiRefreshCw, FiStar
} from 'react-icons/fi';
import { useAuth } from '../store/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { formatPrice, formatDate } from '../utils/helpers';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';

const statusIcons = {
  pending: FiClock,
  confirmed: FiCheckCircle,
  processing: FiPackage,
  shipped: FiTruck,
  delivered: FiCheckCircle,
  cancelled: FiXCircle,
};

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: FiClock },
  { key: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
  { key: 'processing', label: 'Processing', icon: FiPackage },
  { key: 'shipped', label: 'Shipped', icon: FiTruck },
  { key: 'delivered', label: 'Delivered', icon: FiCheckCircle },
];

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
};

const getProductImage = (item) => {
  try {
    if (item.product?.images && Array.isArray(item.product.images) && item.product.images[0]) {
      return item.product.images[0];
    }
    if (item.image) return item.image;
    return 'https://placehold.co/400x400/eee/999?text=No+Image';
  } catch {
    return 'https://placehold.co/400x400/eee/999?text=No+Image';
  }
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrderDetails = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    
    try {
      let orderData = null;
      
      // Try API first
      try {
        const response = await apiWrapper.getOrderById(id);
        if (response?.success && response?.data) {
          orderData = response.data;
        } else if (response?.data?.success && response?.data?.data) {
          orderData = response.data.data;
        }
      } catch (apiError) {
        console.warn('API fetch failed, checking localStorage:', apiError);
      }
      
      // If API fails, try localStorage
      if (!orderData) {
        const localOrders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
        orderData = localOrders.find(o => o._id === id || o.orderNumber === id);
      }
      
      if (orderData) {
        // Parse items if they're a string
        if (orderData.items && typeof orderData.items === 'string') {
          orderData.items = JSON.parse(orderData.items);
        }
        setOrder(orderData);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
      setLoading(false);
      return;
    }
    
    if (isAuthenticated && id) {
      fetchOrderDetails();
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [id, isAuthenticated, location.state, fetchOrderDetails]);

  const handleRefresh = () => {
    fetchOrderDetails(true);
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
    
    setCancelling(true);
    const loadingToast = toast.loading('Cancelling order...');
    
    try {
      const response = await apiWrapper.cancelOrder(id);
      if (response?.success) {
        toast.success('Order cancelled successfully', { id: loadingToast });
        await fetchOrderDetails(true);
      } else {
        throw new Error(response?.message || 'Cancellation failed');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error(error?.message || 'Failed to cancel order', { id: loadingToast });
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    const statusIndex = statusSteps.findIndex(step => step.key === order.status);
    return statusIndex !== -1 ? statusIndex : 0;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <FiPackage className="h-20 w-20 text-neutral-300 dark:text-neutral-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            Sign In to View Order
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Please sign in to view your order details.
          </p>
          <Link to="/login" state={{ from: `/orders/${id}` }}>
            <Button variant="primary" size="lg">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mb-6" />
          <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-6" />
          <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-6" />
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            {error || "Order Not Found"}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            {error === 'Order not found' 
              ? "We couldn't find the order you're looking for." 
              : "There was an error loading your order details. Please try again."}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/orders">
              <Button variant="primary">View My Orders</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[order.status] || FiClock;
  const currentStep = getCurrentStepIndex();
  const orderItems = Array.isArray(order.items) ? order.items : (order.items ? JSON.parse(order.items) : []);
  const shippingAddress = order.shippingAddress || order.shipping || {};

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Orders
            </Link>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                title="Refresh"
              >
                <FiRefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                title="Print Order"
              >
                <FiPrinter className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Order Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-primary-100 text-sm">Order Number</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wider">
                    {order.orderNumber || order._id}
                  </p>
                </div>
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <p className="text-primary-100 text-sm">Order Date</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary-100 text-sm">Total Amount</p>
                    <p className="text-white font-bold text-2xl">
                      {formatPrice(order.total || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <StatusIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Current Status</p>
                    <Badge variant={statusColors[order.status] || 'warning'} size="lg">
                      {order.status?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {order.status === 'pending' && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>

              {/* Order Status Timeline */}
              <div className="mt-6">
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {statusSteps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted 
                              ? 'bg-green-500 text-white ring-4 ring-green-500/30' 
                              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                          } ${isCurrent ? 'scale-110' : ''}`}>
                            {isCompleted && index < currentStep ? (
                              <FiCheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                              <StepIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </div>
                          <p className="text-[10px] sm:text-xs mt-2 text-neutral-600 dark:text-neutral-400 text-center hidden sm:block">
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-700 rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-6"
          >
            <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <FiShoppingBag className="h-5 w-5 text-primary-600" />
                Order Items ({orderItems.length})
              </h3>
            </div>
            
            <div className="p-5 sm:p-6">
              <div className="space-y-4">
                {orderItems.map((item, index) => {
                  const itemPrice = item.variant?.price || item.product?.price || item.price || 0;
                  const itemName = item.product?.name || item.name || 'Product';
                  const itemImage = item.product?.images?.[0] || item.image || 'https://placehold.co/400x400/eee/999?text=No+Image';
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 items-center p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl hover:shadow-md transition-all"
                    >
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x400/eee/999?text=No+Image'; }}
                      />
                      <div className="flex-grow min-w-0">
                        <Link 
                          to={`/products/${item.product?.slug || item.product?._id || '#'}`}
                          className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white hover:text-primary-600 transition-colors"
                        >
                          {itemName}
                        </Link>
                        <p className="text-xs text-neutral-500 mt-1">Qty: {item.quantity}</p>
                        {item.variant && (
                          <p className="text-xs text-neutral-400 mt-1">
                            {item.variant.color && `Color: ${item.variant.color}`}
                            {item.variant.material && ` • Material: ${item.variant.material}`}
                            {item.variant.size && ` • Size: ${item.variant.size}`}
                          </p>
                        )}
                        <button className="text-xs text-primary-600 hover:text-primary-700 mt-2 flex items-center gap-1">
                          <FiStar className="h-3 w-3" />
                          Write a Review
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600 text-sm sm:text-base">
                          {formatPrice(itemPrice * item.quantity)}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {formatPrice(itemPrice)} each
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Order Summary & Shipping */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Price Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <FiDollarSign className="h-5 w-5 text-primary-600" />
                  Order Summary
                </h3>
              </div>
              <div className="p-5 sm:p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-medium">{formatPrice(order.subtotal || 0)}</span>
                  </div>
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
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="text-lg font-bold text-neutral-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-primary-600">{formatPrice(order.total || 0)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <FiMapPin className="h-5 w-5 text-primary-600" />
                  Shipping Information
                </h3>
              </div>
              <div className="p-5 sm:p-6">
                {shippingAddress ? (
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {shippingAddress.firstName} {shippingAddress.lastName}
                    </p>
                    <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                      {shippingAddress.address}<br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                      {shippingAddress.country || 'United States'}
                    </p>
                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm text-neutral-500 flex items-center gap-2">
                        <FiMail className="h-4 w-4" />
                        {shippingAddress.email || order.email || 'N/A'}
                      </p>
                      {shippingAddress.phone && (
                        <p className="text-sm text-neutral-500 flex items-center gap-2 mt-2">
                          <FiPhone className="h-4 w-4" />
                          {shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-500">No shipping information available</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Need Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-6 text-center border border-blue-100 dark:border-blue-800"
          >
            <FiShield className="h-12 w-12 text-primary-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Need Help With Your Order?
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Our customer support team is here to assist you with any questions or concerns.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/contact">
                <Button variant="primary" size="sm">Contact Support</Button>
              </Link>
              <Link to="/track-order">
                <Button variant="outline" size="sm">Track Another Order</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;