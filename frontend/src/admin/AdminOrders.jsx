// AdminOrders.jsx - Order management with status updates (FIXED)
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiPackage,
  FiClock,
  FiDollarSign,
  FiUser,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiRefreshCw,
  FiDownload,
  FiFilter,
  FiLoader
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    processing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };
  const statusIcons = {
    pending: FiClock,
    confirmed: FiPackage,
    processing: FiPackage,
    shipped: FiTruck,
    delivered: FiCheckCircle,
    cancelled: FiXCircle
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getAllOrders();
      
      console.log('Orders response:', response);
      
      let ordersData = [];
      
      // Handle different response formats from backend
      if (response?.success && response?.data) {
        if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else if (response.data.orders && Array.isArray(response.data.orders)) {
          ordersData = response.data.orders;
        }
      } else if (response?.data && response?.data?.success && response?.data?.data) {
        if (Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        }
      } else if (Array.isArray(response)) {
        ordersData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        ordersData = response.data;
      }
      
      // Parse items and shippingAddress for each order
      const parsedOrders = ordersData.map(order => ({
        ...order,
        items: parseOrderItems(order),
        shippingAddress: parseShippingAddress(order),
        subtotal: order.subtotal || 0,
        discount: order.discount || 0,
        shipping: order.shipping || order.shippingCost || 0,
        tax: order.tax || 0,
        total: order.total || 0,
        userName: order.userName || order.user?.name || order.userName || 'Guest',
        userEmail: order.userEmail || order.user?.email || 'N/A',
      }));
      
      setOrders(parsedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error?.response?.data?.message || 'Failed to load orders');
      
      // Fallback to localStorage
      const localOrders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      if (localOrders.length > 0) {
        setOrders(localOrders);
        toast.success('Loaded orders from cache', { icon: '📦' });
      }
    } finally {
      setLoading(false);
    }
  };

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
      return null;
    } catch (e) {
      console.error('Error parsing shipping address:', e);
      return null;
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await apiWrapper.updateOrderStatus(orderId, { status: newStatus });
      if (response?.success) {
        toast.success(`Order status updated to ${newStatus}`);
        await fetchOrders();
        setShowDetailsModal(false);
      } else {
        throw new Error(response?.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderNumber = (order.orderNumber || order._id || '').toLowerCase();
      const userName = (order.userName || order.user?.name || '').toLowerCase();
      const userEmail = (order.userEmail || order.user?.email || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = searchTerm === '' ||
        orderNumber.includes(searchLower) ||
        userName.includes(searchLower) ||
        userEmail.includes(searchLower);
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleExportOrders = () => {
    const csvHeaders = ['Order Number', 'Customer', 'Email', 'Total Amount', 'Status', 'Date'];
    const csvRows = filteredOrders.map(o => [
      o.orderNumber || o._id?.slice(-8),
      o.userName || o.user?.name || 'Guest',
      o.userEmail || o.user?.email || 'N/A',
      `$${(o.total || 0).toFixed(2)}`,
      o.status || 'pending',
      new Date(o.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Orders exported successfully');
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;
    
    const items = selectedOrder.items || [];
    const shippingAddress = selectedOrder.shippingAddress;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white dark:bg-neutral-900 p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
            <div>
              <h2 className="text-xl font-bold">Order Details</h2>
              <p className="text-sm text-neutral-500 mt-0.5">{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}</p>
            </div>
            <button 
              onClick={() => setShowDetailsModal(false)} 
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <FiXCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-5 space-y-6">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">Order ID</p>
                <p className="font-mono text-sm font-semibold">{selectedOrder._id}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-neutral-500 uppercase tracking-wide">Order Date</p>
                <p className="text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
              <p className="text-sm font-semibold mb-3">Update Order Status</p>
              <div className="flex gap-2 flex-wrap">
                {statuses.map(status => {
                  const Icon = statusIcons[status];
                  const isActive = selectedOrder?.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                      disabled={updatingStatus}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                        isActive
                          ? statusColors[status]
                          : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                <FiUser className="h-4 w-4" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500">Name</p>
                  <p className="font-medium">{selectedOrder.userName || selectedOrder.user?.name || 'Guest'}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Email</p>
                  <p className="flex items-center gap-1 text-sm">
                    <FiMail className="h-3 w-3" />
                    {selectedOrder.userEmail || selectedOrder.user?.email || 'N/A'}
                  </p>
                </div>
                {shippingAddress && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-neutral-500">Shipping Address</p>
                    <p className="flex items-start gap-1 text-sm">
                      <FiMapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>
                        {shippingAddress.address || shippingAddress.street}<br />
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                        {shippingAddress.country || 'United States'}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-md font-semibold mb-3">Order Items ({items.length})</h3>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                    <img
                      src={item.image || 'https://placehold.co/60x60/eee/999?text=Product'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/60x60/eee/999?text=No+Image';
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-500">Quantity: {item.quantity}</p>
                      {item.variant && (
                        <p className="text-xs text-neutral-500">
                          {item.variant.color && `Color: ${item.variant.color}`}
                          {item.variant.material && ` / Material: ${item.variant.material}`}
                          {item.variant.size && ` / Size: ${item.variant.size}`}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-sm">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span>${(selectedOrder.subtotal || 0).toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Discount</span>
                    <span className="text-green-600">-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span>${(selectedOrder.shipping || selectedOrder.shippingCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Tax</span>
                  <span>${(selectedOrder.tax || 0).toFixed(2)}</span>
                </div>
                {(selectedOrder.giftWrapCost || selectedOrder.giftWrap) && (
                  <div className="flex justify-between text-sm text-rose-500">
                    <span>Gift Wrap</span>
                    <span>${(selectedOrder.giftWrapCost || 5.99).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary-600">${(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {selectedOrder.paymentMethod && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-2">Payment Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-neutral-500">Method</p>
                    <p className="capitalize">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Status</p>
                    <p className={`capitalize ${selectedOrder.paymentStatus === 'paid' || selectedOrder.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedOrder.paymentStatus || 'pending'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-2">Order Notes</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Order Management</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Track and manage all customer orders</p>
        </div>
        <button
          onClick={handleExportOrders}
          disabled={filteredOrders.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiDownload className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs sm:text-sm text-neutral-500">Total Orders</p>
          <p className="text-xl sm:text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs sm:text-sm text-neutral-500">Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs sm:text-sm text-neutral-500">Pending</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs sm:text-sm text-neutral-500">Delivered</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by order number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <button 
              onClick={fetchOrders} 
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              title="Refresh Orders"
            >
              <FiRefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center">
          <FiPackage className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
          <h3 className="text-lg font-semibold mb-1">No Orders Found</h3>
          <p className="text-sm text-neutral-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Orders will appear here once customers place them'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Order #</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Customer</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Amount</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Status</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold hidden sm:table-cell">Date</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {paginatedOrders.map((order, idx) => {
                  const StatusIcon = statusIcons[order.status] || FiClock;
                  return (
                    <motion.tr
                      key={order._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="p-3 sm:p-4">
                        <span className="font-mono text-xs sm:text-sm">{order.orderNumber || order._id?.slice(-8)}</span>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div>
                          <p className="text-sm font-medium">{order.userName || 'Guest'}</p>
                          <p className="text-xs text-neutral-500 hidden sm:block">{order.userEmail}</p>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 font-semibold text-sm">${(order.total || 0).toFixed(2)}</td>
                      <td className="p-3 sm:p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${statusColors[order.status] || statusColors.pending}`}>
                          <StatusIcon className="h-3 w-3" />
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-sm hidden sm:table-cell">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3 sm:p-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs sm:text-sm text-neutral-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 hover:bg-neutral-50 transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg">{currentPage}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 hover:bg-neutral-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showDetailsModal && <OrderDetailsModal />}
      </AnimatePresence>
    </div>
  );
};

const OrdersSkeleton = () => (
  <div className="space-y-4 sm:space-y-6 animate-pulse">
    <div className="flex justify-between">
      <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 sm:h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      ))}
    </div>
    <div className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
  </div>
);

export default AdminOrders;