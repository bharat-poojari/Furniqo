import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPackage, 
  FiSearch, 
  FiChevronRight, 
  FiFilter,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
} from 'react-icons/fi';
import { useAuth } from '../store/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import { formatPrice, formatDate } from '../utils/helpers';
import { ORDER_STATUS, ORDER_STATUS_COLORS } from '../utils/constants';
import apiWrapper from '../services/apiWrapper';

const statusIcons = {
  pending: FiClock,
  confirmed: FiCheckCircle,
  processing: FiPackage,
  shipped: FiTruck,
  delivered: FiCheckCircle,
  cancelled: FiXCircle,
};

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiWrapper.getOrders();
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const ordersPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  if (!isAuthenticated) {
    return (
      <div className="w-full px-[1%] sm:px-[1.5%] py-16 text-center">
        <FiPackage className="h-20 w-20 text-neutral-300 dark:text-neutral-600  mb-6" />
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
          Sign In to View Orders
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Track your orders and view your purchase history.
        </p>
        <Link to="/login">
          <Button variant="primary" size="lg">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full px-[1%] sm:px-[1.5%] py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-[1%] sm:px-[1.5%] py-8">
      <div className="max-w-5xl ">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-8">
          My Orders
        </h1>

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
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by order number..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                {Object.entries(ORDER_STATUS).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              <AnimatePresence>
                {paginatedOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status] || FiClock;
                  
                  return (
                    <motion.div
                      key={order._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Link
  to={`/orders/${order._id}`}
  state={{ order: order }}  // Add this line
  className="block bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-800 hover:shadow-medium transition-all overflow-hidden group"
>
                        <div className="p-4 lg:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-xs text-neutral-500 mb-1">Order Number</p>
                              <p className="font-mono font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                {order.orderNumber || order._id}
                              </p>
                              <p className="text-sm text-neutral-500 mt-1">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            
                            <Badge
                              variant={
                                order.status === 'delivered' ? 'success' :
                                order.status === 'cancelled' ? 'danger' :
                                order.status === 'shipped' ? 'info' : 'warning'
                              }
                              size="md"
                              dot
                            >
                              <span className="flex items-center gap-1.5">
                                <StatusIcon className="h-3.5 w-3.5" />
                                {order.status?.replace(/_/g, ' ')}
                              </span>
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-neutral-500">
                                {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                              </p>
                              {order.items?.slice(0, 3).map((item, i) => (
                                <div key={i} className="flex items-center gap-2 mt-1">
                                  <img
                                    src={item.product?.images?.[0]}
                                    alt=""
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                  <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                                    {item.product?.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary-600">
                                {formatPrice(order.total || 0)}
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
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500">No orders match your search criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;