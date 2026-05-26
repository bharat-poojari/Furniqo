// src/pages/Orders.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPackage, FiSearch, FiChevronRight, FiClock,
  FiCheckCircle, FiTruck, FiXCircle, FiRefreshCw,
  FiAlertCircle, FiShoppingBag
} from 'react-icons/fi';
import { useAuth } from '../store/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
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
    if (item.image) return item.image;
    if (item.product?.images && Array.isArray(item.product.images) && item.product.images[0]) {
      return item.product.images[0];
    }
    return 'https://placehold.co/400x400/eee/999?text=No+Image';
  } catch {
    return 'https://placehold.co/400x400/eee/999?text=No+Image';
  }
};

const Orders = () => {
  const { isAuthenticated, token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const abortControllerRef = useRef(null);

  const parseOrderItems = (order) => {
    try {
      if (Array.isArray(order.items)) {
        return order.items;
      }
      if (order.items && typeof order.items === 'string') {
        return JSON.parse(order.items);
      }
      return [];
    } catch (e) {
      console.error('Error parsing order items:', e);
      return [];
    }
  };

  const parseShippingAddress = (order) => {
    try {
      if (order.shippingAddress && typeof order.shippingAddress === 'object') {
        return order.shippingAddress;
      }
      if (order.shippingAddress && typeof order.shippingAddress === 'string') {
        return JSON.parse(order.shippingAddress);
      }
      if (order.shipping && typeof order.shipping === 'object') {
        return order.shipping;
      }
      return {};
    } catch (e) {
      console.error('Error parsing shipping address:', e);
      return {};
    }
  };

  const fetchOrders = useCallback(async (showRefresh = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      // ONLY fetch from API - don't mix with localStorage for authenticated users
      const response = await apiWrapper.getOrders(params);
      
      let ordersData = [];
      
      // Handle different response structures from API
      if (response?.success && response?.data) {
        if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.data.orders && Array.isArray(response.data.orders)) {
          ordersData = response.data.orders;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        }
      } else if (response?.data?.success && response?.data?.data) {
        ordersData = Array.isArray(response.data.data) ? response.data.data : [];
      }
      
      // Parse and normalize each order
      const normalizedOrders = ordersData.map(order => ({
        ...order,
        items: parseOrderItems(order),
        shippingAddress: parseShippingAddress(order),
        shippingCost: order.shippingCost ?? order.shipping ?? 0,
      }));
      
      setOrders(normalizedOrders);
      
      // Store ONLY current user's orders in localStorage (for caching, not for cross-user access)
      if (normalizedOrders.length > 0 && user?._id) {
        // Store orders with user ID to prevent cross-user contamination
        const userOrdersCache = {
          userId: user._id,
          orders: normalizedOrders,
          timestamp: Date.now()
        };
        localStorage.setItem(`furniqo_orders_${user._id}`, JSON.stringify(userOrdersCache));
      }
      
      if (showRefresh) toast.success('Orders refreshed');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching orders:', error);
        
        // ONLY load cached orders for the CURRENT user
        if (user?._id) {
          const cachedData = localStorage.getItem(`furniqo_orders_${user._id}`);
          if (cachedData) {
            try {
              const parsedCache = JSON.parse(cachedData);
              // Check if cache is less than 5 minutes old
              if (Date.now() - parsedCache.timestamp < 5 * 60 * 1000) {
                setOrders(parsedCache.orders);
                if (!showRefresh) {
                  toast.success('Loaded orders from cache');
                }
              } else {
                // Cache expired, remove it
                localStorage.removeItem(`furniqo_orders_${user._id}`);
              }
            } catch (e) {
              console.error('Error parsing cached orders:', e);
            }
          }
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, user?._id]);

  // Initial fetch on mount and when auth status changes
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchOrders();
    } else {
      // Clear orders when not authenticated
      setOrders([]);
      setLoading(false);
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isAuthenticated, user?._id, fetchOrders]);

  const handleRefresh = () => {
    fetchOrders(true);
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const orderNumber = order.orderNumber || order._id || '';
    const matchesSearch = orderNumber.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ordersPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="h-10 w-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
            Sign In to View Orders
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Track your orders and view your purchase history.
          </p>
          <Link to="/login" state={{ from: '/orders' }}>
            <Button variant="primary" size="lg">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
            <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                My Orders
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Track and manage your orders ({orders.length} total)
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <EmptyState
              icon={FiPackage}
              title="No Orders Yet"
              description="You haven't placed any orders yet. Start shopping to see your orders here!"
              actionLabel="Start Shopping"
              actionHref="/products"
            />
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by order number..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                <AnimatePresence>
                  {paginatedOrders.map((order, idx) => {
                    const StatusIcon = statusIcons[order.status] || FiClock;
                    const orderItems = order.items || [];
                    const orderTotal = order.total || 0;
                    const orderNumber = order.orderNumber || order._id?.slice(-8).toUpperCase() || 'N/A';
                    const orderDate = order.createdAt;
                    
                    return (
                      <motion.div
                        key={order._id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link
                          to={`/orders/${order._id}`}
                          state={{ order: order }}
                          className="block bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all overflow-hidden group"
                        >
                          <div className="p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                              <div>
                                <p className="text-xs text-neutral-500 mb-1">Order Number</p>
                                <p className="font-mono font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                  {orderNumber}
                                </p>
                                <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
                                  <FiClock className="h-3 w-3" />
                                  {formatDate(orderDate)}
                                </p>
                              </div>
                              
                              <Badge
                                variant={statusColors[order.status] || 'warning'}
                                size="md"
                                dot
                              >
                                <span className="flex items-center gap-1.5">
                                  <StatusIcon className="h-3 w-3" />
                                  {order.status?.toUpperCase() || 'PENDING'}
                                </span>
                              </Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-sm text-neutral-500 mb-2">
                                  {orderItems.length} {orderItems.length === 1 ? 'item' : 'items'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {orderItems.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <img
                                        src={getProductImage(item)}
                                        alt=""
                                        className="w-8 h-8 rounded object-cover"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x400/eee/999?text=No+Image'; }}
                                      />
                                      <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-[150px]">
                                        {item.name || item.product?.name || 'Product'}
                                      </span>
                                    </div>
                                  ))}
                                  {orderItems.length > 3 && (
                                    <span className="text-sm text-neutral-500">+{orderItems.length - 3} more</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-right sm:text-left">
                                <p className="text-xl font-bold text-primary-600">
                                  {formatPrice(orderTotal)}
                                </p>
                                <div className="flex items-center gap-1 text-sm text-primary-600 group-hover:text-primary-700 transition-colors mt-1">
                                  <span>View Details</span>
                                  <FiChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiSearch className="h-8 w-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-500">No orders match your search criteria.</p>
                  <button
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                    className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;