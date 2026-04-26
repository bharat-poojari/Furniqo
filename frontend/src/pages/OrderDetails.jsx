import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiArrowLeft,
  FiMapPin,
  FiMail,
  FiPhone,
  FiPrinter,
  FiDownload,
  FiShoppingBag,
  FiCalendar,
  FiDollarSign,
  FiPercent,
  FiTruck as FiDelivery,
  FiHome,
  FiHeart,
  FiStar,
  FiRefreshCw,
  FiShield,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../store/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { formatPrice, formatDate } from '../utils/helpers';
import { ORDER_STATUS, ORDER_STATUS_COLORS } from '../utils/constants';
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

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    // First check if order data was passed through navigation state
    if (location.state?.order) {
      setOrder(location.state.order);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    if (isAuthenticated && id) {
      fetchOrderDetails();
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [id, isAuthenticated, location.state]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to get order by ID
      const response = await apiWrapper.getOrderById(id);
      if (response.data && response.data.success && response.data.data) {
        setOrder(response.data.data);
        // Fetch tracking info if order is shipped
        if (response.data.data.status === 'shipped' && response.data.data.trackingNumber) {
          fetchTrackingInfo(response.data.data.trackingNumber);
        }
      } else {
        // If API fails, try to get from localStorage (for demo orders)
        const localOrders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
        const localOrder = localOrders.find(o => o._id === id || o.orderNumber === id);
        
        if (localOrder) {
          setOrder(localOrder);
        } else {
          setError('Order not found');
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      
      // Try to get from localStorage as fallback
      const localOrders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      const localOrder = localOrders.find(o => o._id === id || o.orderNumber === id);
      
      if (localOrder) {
        setOrder(localOrder);
      } else {
        setError('Failed to load order details');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingInfo = async (trackingNumber) => {
    // Simulate tracking info - replace with actual API call
    setTrackingInfo({
      carrier: 'FedEx',
      trackingNumber: trackingNumber || 'TRK123456789',
      status: 'In Transit',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      updates: [
        { date: new Date(), status: 'Order confirmed', location: 'Online' },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'Processing at warehouse', location: 'Distribution Center' },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'Order placed', location: 'Online' },
      ]
    });
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await apiWrapper.cancelOrder(id);
        toast.success('Order cancelled successfully');
        fetchOrderDetails();
      } catch (error) {
        toast.error('Failed to cancel order');
      }
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    const statusIndex = statusSteps.findIndex(step => step.key === order.status);
    return statusIndex !== -1 ? statusIndex : 0;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center px-[1%]">
        <div className="text-center">
          <FiPackage className="h-20 w-20 text-neutral-300 dark:text-neutral-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <div className="w-full px-[1%] py-[1%]">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
              <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
              <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center px-[1%] py-[1%]">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full px-[1%] py-[1%]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors group"
              >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Back to Orders
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Print Order"
                >
                  <FiPrinter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Order Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-primary-100 text-sm">Order Number</p>
                  <p className="text-2xl font-bold font-mono text-white tracking-wider">
                    {order.orderNumber || order._id || id}
                  </p>
                </div>
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <p className="text-primary-100 text-sm">Order Date</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      {formatDate(order.createdAt || new Date())}
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

            <div className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary-100 dark:bg-primary-900/30">
                    <StatusIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Current Status</p>
                    <Badge
                      variant={
                        order.status === 'delivered' ? 'success' :
                        order.status === 'cancelled' ? 'danger' :
                        order.status === 'shipped' ? 'info' : 'warning'
                      }
                      size="lg"
                    >
                      {order.status?.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {order.status === 'pending' && (
                  <button
                    onClick={handleCancelOrder}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Cancel Order
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
                        <div key={step.key} className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted 
                              ? 'bg-green-500 text-white ring-4 ring-green-500/30' 
                              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                          } ${isCurrent ? 'scale-110' : ''}`}>
                            {isCompleted && index < currentStep ? (
                              <FiCheckCircle className="h-5 w-5" />
                            ) : (
                              <StepIcon className="h-5 w-5" />
                            )}
                          </div>
                          <p className="text-xs mt-2 text-neutral-600 dark:text-neutral-400 text-center hidden sm:block">
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute top-5 left-0 right-0 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full">
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
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-6"
          >
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <FiShoppingBag className="h-5 w-5 text-primary-600" />
                Order Items ({order.items?.length || 0})
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {order.items?.map((item, index) => {
                  const itemPrice = item.variant?.price || item.product?.price || item.price || 0;
                  const itemName = item.product?.name || item.name || 'Product';
                  const itemImage = item.product?.images?.[0] || item.image || '/api/placeholder/80/80';
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 items-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl hover:shadow-md transition-all"
                    >
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                        onError={(e) => { e.target.src = '/api/placeholder/80/80'; }}
                      />
                      <div className="flex-grow min-w-0">
                        <Link 
                          to={`/products/${item.product?.slug || item.product?._id || '#'}`}
                          className="font-semibold text-neutral-900 dark:text-white hover:text-primary-600 transition-colors"
                        >
                          {itemName}
                        </Link>
                        <p className="text-sm text-neutral-500 mt-1">Qty: {item.quantity}</p>
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
                        <p className="font-bold text-primary-600">
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
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <FiDollarSign className="h-5 w-5 text-primary-600" />
                  Order Summary
                </h3>
              </div>
              <div className="p-6">
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
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <FiMapPin className="h-5 w-5 text-primary-600" />
                  Shipping Information
                </h3>
              </div>
              <div className="p-6">
                {order.shipping ? (
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {order.shipping.firstName} {order.shipping.lastName}
                    </p>
                    <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                      {order.shipping.address}<br />
                      {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}<br />
                      {order.shipping.country}
                    </p>
                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm text-neutral-500 flex items-center gap-2">
                        <FiMail className="h-4 w-4" />
                        {order.shipping.email || order.email || 'N/A'}
                      </p>
                      {order.shipping.phone && (
                        <p className="text-sm text-neutral-500 flex items-center gap-2 mt-2">
                          <FiPhone className="h-4 w-4" />
                          {order.shipping.phone}
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

          {/* Tracking Information (if shipped) */}
          {trackingInfo && order.status === 'shipped' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <FiDelivery className="h-5 w-5 text-primary-600" />
                  Tracking Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-neutral-500">Carrier</p>
                    <p className="font-medium text-neutral-900 dark:text-white">{trackingInfo.carrier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Tracking Number</p>
                    <p className="font-mono text-sm text-primary-600">{trackingInfo.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Status</p>
                    <p className="font-medium text-green-600">{trackingInfo.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Estimated Delivery</p>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {formatDate(trackingInfo.estimatedDelivery)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <h4 className="font-semibold text-sm text-neutral-900 dark:text-white mb-3">Tracking Updates</h4>
                  <div className="space-y-3">
                    {trackingInfo.updates.map((update, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{update.status}</p>
                          <p className="text-xs text-neutral-500">{formatDate(update.date)} • {update.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Need Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
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
              <button
                onClick={() => window.open('/faq', '_blank')}
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View FAQ
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;