// AdminDashboard.jsx - Main dashboard with stats
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiEye,
  FiClock,
  FiStar,
  FiMessageSquare,
  FiGift,
  FiTag,
  FiBookOpen
} from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import apiWrapper from '../services/apiWrapper';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    totalReviews: 0,
    totalTestimonials: 0,
    activeCoupons: 0,
    totalBlogPosts: 0,
    pendingContactMessages: 0,
    newsletterSubscribers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, productsRes, ordersRes, testimonialsRes, blogRes, contactRes, newsletterRes] = await Promise.all([
        apiWrapper.getUsers(),
        apiWrapper.getProducts(),
        apiWrapper.getAllOrders(),
        apiWrapper.getTestimonials(),
        apiWrapper.getBlogPosts(),
        apiWrapper.getContactMessages(),
        apiWrapper.getNewsletterSubscribers()
      ]);

      const users = usersRes?.data?.users || [];
      const products = productsRes?.data?.products || [];
      const orders = ordersRes?.data?.orders || [];
      const testimonials = testimonialsRes?.data?.testimonials || [];
      const blog = blogRes?.data?.posts || [];
      const contact = contactRes?.data?.messages || [];
      const newsletter = newsletterRes?.data?.subscribers || [];

      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const lowStock = products.filter(p => p.stockQuantity < 10).length;

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        lowStockProducts: lowStock,
        totalReviews: products.reduce((sum, p) => sum + (p.reviews?.length || 0), 0),
        totalTestimonials: testimonials.length,
        activeCoupons: 0, // Would need separate coupon API
        totalBlogPosts: blog.length,
        pendingContactMessages: contact.filter(c => c.status === 'unread').length,
        newsletterSubscribers: newsletter.length
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentUsers(users.slice(0, 5));

      // Generate sales data for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const salesMap = {};
      orders.forEach(order => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        if (last7Days.includes(date)) {
          salesMap[date] = (salesMap[date] || 0) + (order.totalAmount || 0);
        }
      });

      setSalesData(last7Days.map(date => ({
        date,
        sales: salesMap[date] || 0
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'from-blue-500 to-blue-600', change: '+12%', trend: 'up' },
    { title: 'Total Products', value: stats.totalProducts, icon: FiShoppingBag, color: 'from-emerald-500 to-emerald-600', change: '+5%', trend: 'up' },
    { title: 'Total Orders', value: stats.totalOrders, icon: FiPackage, color: 'from-orange-500 to-orange-600', change: '+8%', trend: 'up' },
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'from-purple-500 to-purple-600', change: '+15%', trend: 'up' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: FiClock, color: 'from-yellow-500 to-yellow-600', change: '-3%', trend: 'down' },
    { title: 'Low Stock', value: stats.lowStockProducts, icon: FiTrendingDown, color: 'from-red-500 to-red-600', change: '+2%', trend: 'up' },
    { title: 'Reviews', value: stats.totalReviews, icon: FiStar, color: 'from-pink-500 to-pink-600', change: '+18%', trend: 'up' },
    { title: 'Newsletter Subs', value: stats.newsletterSubscribers, icon: FiMessageSquare, color: 'from-cyan-500 to-cyan-600', change: '+7%', trend: 'up' }
  ];

  const pieData = [
    { name: 'Completed', value: stats.totalOrders - stats.pendingOrders, color: '#10b981' },
    { name: 'Pending', value: stats.pendingOrders, color: '#f59e0b' }
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-primary-100">Here's what's happening with your store today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color} bg-opacity-10`}>
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  card.trend === 'up' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {card.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{card.value}</h3>
              <p className="text-sm text-neutral-500 mt-1">{card.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-xl p-5 border border-neutral-200 dark:border-neutral-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Sales Overview</h3>
            <select className="text-sm bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-1.5 border-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area type="monotone" dataKey="sales" stroke="#6366f1" fill="url(#salesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-neutral-200 dark:border-neutral-800"
        >
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.name}</span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        >
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Orders</h3>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Order #{order._id?.slice(-6)}</p>
                  <p className="text-sm text-neutral-500">${order.totalAmount?.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-sm text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        >
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">New Users</h3>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {recentUsers.map((user, idx) => (
              <div key={idx} className="p-4 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-neutral-500">{user.email}</p>
                </div>
                <span className="text-sm text-neutral-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-80 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      <div className="h-80 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    </div>
  </div>
);

export default AdminDashboard;