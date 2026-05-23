// AdminOrders.jsx - Order management with status updates
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
  FiFilter
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  const statusIcons = {
    pending: FiClock,
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
      setOrders(response?.data?.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await apiWrapper.updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchTerm === '' ||
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const handleExportOrders = () => {
    const csv = [
      ['Order ID', 'Customer', 'Email', 'Total Amount', 'Status', 'Date'],
      ...filteredOrders.map(o => [
        o._id,
        o.user?.name || 'Guest',
        o.user?.email || 'N/A',
        `$${o.totalAmount}`,
        o.status,
        new Date(o.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Orders exported successfully');
  };

  const OrderDetailsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button onClick={() => setShowDetailsModal(false)} className="p-1 rounded-lg hover:bg-neutral-100">
            <FiXCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-5 space-y-6">
          {/* Order Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-500">Order ID</p>
              <p className="font-mono text-lg font-semibold">{selectedOrder?._id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-500">Order Date</p>
              <p>{new Date(selectedOrder?.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
            <p className="text-sm font-semibold mb-2">Update Order Status</p>
            <div className="flex gap-2 flex-wrap">
              {statuses.map(status => {
                const Icon = statusIcons[status];
                return (
                  <button
                    key={status}
                    onClick={() => {
                      handleUpdateStatus(selectedOrder._id, status);
                      setShowDetailsModal(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedOrder?.status === status
                        ? statusColors[status]
                        : 'bg-white dark:bg-neutral-800 border border-neutral-200 hover:border-primary-300'
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
                <p className="text-sm text-neutral-500">Name</p>
                <p className="font-medium">{selectedOrder?.user?.name || 'Guest'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="flex items-center gap-1">
                  <FiMail className="h-3 w-3" />
                  {selectedOrder?.user?.email || 'N/A'}
                </p>
              </div>
              {selectedOrder?.shippingAddress && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-neutral-500">Shipping Address</p>
                  <p className="flex items-start gap-1">
                    <FiMapPin className="h-3 w-3 mt-0.5" />
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-md font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {selectedOrder?.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <img
                    src={item.product?.images?.[0] || 'https://placehold.co/60x60'}
                    alt={item.product?.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-neutral-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-primary-600">${selectedOrder?.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <OrdersSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Order Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Track and manage all customer orders</p>
        </div>
        <button
          onClick={handleExportOrders}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          <FiDownload className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200">
          <p className="text-sm text-neutral-500">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200">
          <p className="text-sm text-neutral-500">Total Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200">
          <p className="text-sm text-neutral-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200">
          <p className="text-sm text-neutral-500">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
          >
            <option value="all">All Status</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button onClick={fetchOrders} className="px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-neutral-50">
            <FiRefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-semibold">Order ID</th>
                <th className="text-left p-4 text-sm font-semibold">Customer</th>
                <th className="text-left p-4 text-sm font-semibold">Amount</th>
                <th className="text-left p-4 text-sm font-semibold">Status</th>
                <th className="text-left p-4 text-sm font-semibold">Date</th>
                <th className="text-left p-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedOrders.map((order, idx) => {
                const StatusIcon = statusIcons[order.status];
                return (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
                  >
                    <td className="p-4 font-mono text-sm">{order._id?.slice(-8)}</td>
                    <td className="p-4">{order.user?.name || 'Guest User'}</td>
                    <td className="p-4 font-semibold">${order.totalAmount?.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${statusColors[order.status]}`}>
                        <StatusIcon className="h-3 w-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailsModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 transition"
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
          <div className="p-4 border-t flex justify-between items-center">
            <p className="text-sm text-neutral-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-primary-600 text-white rounded-lg">{currentPage}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showDetailsModal && <OrderDetailsModal />}
    </div>
  );
};

const OrdersSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      ))}
    </div>
    <div className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
  </div>
);

export default AdminOrders;