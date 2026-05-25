import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiClock, FiStar,
  FiMessageSquare, FiRefreshCw, FiAlertCircle, FiShoppingCart, 
  FiCheckCircle, FiTag, FiBookOpen, FiTrendingUp, FiTrendingDown,
  FiTruck, FiCalendar, FiPercent, FiAward, FiMail, FiSend,
  FiSmile, FiBarChart2
} from 'react-icons/fi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, ComposedChart
} from 'recharts';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalReviews: 0,
    avgRating: 0,
    totalTestimonials: 0,
    activeCoupons: 0,
    totalBlogPosts: 0,
    pendingContactMessages: 0,
    newsletterSubscribers: 0,
    todayOrders: 0,
    todayRevenue: 0,
    weekOrders: 0,
    weekRevenue: 0,
    monthOrders: 0,
    monthRevenue: 0,
    popularProducts: [],
    topCustomers: []
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchDashboardData = useCallback(async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      
      const listFromResponse = (res, keys = []) => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data?.data)) return res.data.data;
        if (res?.success && Array.isArray(res?.data)) return res.data;
        for (const k of keys) {
          if (Array.isArray(res[k])) return res[k];
          if (Array.isArray(res.data?.[k])) return res.data[k];
        }
        return [];
      };

      const [usersRes, productsRes, ordersRes, testimonialsRes, blogRes, contactRes, newsletterRes, couponsRes] = await Promise.all([
        apiWrapper.getUsers(),
        apiWrapper.getProducts({ limit: 1000 }),
        apiWrapper.getAllOrders({ limit: 1000 }),
        apiWrapper.getTestimonials(),
        apiWrapper.getBlogPosts({ limit: 100 }),
        apiWrapper.getContactMessages(),
        apiWrapper.getNewsletterSubscribers(),
        apiWrapper.getAllCoupons()
      ]);

      const users = listFromResponse(usersRes, ['users']);
      const products = listFromResponse(productsRes, ['products']);
      const orders = listFromResponse(ordersRes, ['orders']);
      const testimonials = listFromResponse(testimonialsRes, ['testimonials']);
      const blogPosts = listFromResponse(blogRes, ['posts']);
      const contactMessages = listFromResponse(contactRes, ['messages']);
      const newsletter = listFromResponse(newsletterRes, ['subscribers']);
      const coupons = listFromResponse(couponsRes, ['coupons']);

      const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'Pending').length;
      const processingOrders = orders.filter(o => o.status === 'processing' || o.status === 'Processing').length;
      const shippedOrders = orders.filter(o => o.status === 'shipped' || o.status === 'Shipped').length;
      const deliveredOrders = orders.filter(o => o.status === 'delivered' || o.status === 'Delivered').length;
      const cancelledOrders = orders.filter(o => o.status === 'cancelled' || o.status === 'Cancelled').length;

      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter(o => o.createdAt?.split('T')[0] === today);
      const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekOrders = orders.filter(o => new Date(o.createdAt) >= weekAgo);
      const weekRevenue = weekOrders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);

      let totalRating = 0;
      let reviewCount = 0;
      products.forEach(product => {
        if (product.rating) {
          totalRating += product.rating;
          reviewCount++;
        }
        if (product.reviews?.length) {
          const avg = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
          totalRating += avg;
          reviewCount += product.reviews.length;
        }
      });
      const avgRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;

      const popularProducts = [...products]
        .sort((a, b) => (b.soldCount || b.salesCount || 0) - (a.soldCount || a.salesCount || 0))
        .slice(0, 5)
        .map(p => ({ name: p.name, sales: p.soldCount || p.salesCount || 0, price: p.price || 0 }));

      const customerMap = new Map();
      orders.forEach(order => {
        const email = order.customerEmail || order.email;
        if (email) {
          const existing = customerMap.get(email) || { name: order.customerName || email.split('@')[0], total: 0, orders: 0 };
          existing.total += (order.total || order.totalAmount || 0);
          existing.orders++;
          customerMap.set(email, existing);
        }
      });
      const topCustomers = Array.from(customerMap.values())
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }

      const salesMap = {};
      const orderCountMap = {};
      orders.forEach(order => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];
        if (last7Days.includes(date)) {
          salesMap[date] = (salesMap[date] || 0) + (order.total || order.totalAmount || 0);
          orderCountMap[date] = (orderCountMap[date] || 0) + 1;
        }
      });

      setSalesData(last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: salesMap[date] || 0,
        orders: orderCountMap[date] || 0
      })));

      const categoryMap = {};
      products.forEach(product => {
        const cat = product.category || 'Uncategorized';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });
      const sortedCategories = Object.entries(categoryMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
      setCategoryData(sortedCategories);

      setOrderStatusData([
        { name: 'Pending', value: pendingOrders, color: '#f59e0b' },
        { name: 'Processing', value: processingOrders, color: '#3b82f6' },
        { name: 'Shipped', value: shippedOrders, color: '#8b5cf6' },
        { name: 'Delivered', value: deliveredOrders, color: '#10b981' }
      ].filter(item => item.value > 0));

      const lowStock = products.filter(p => (p.stock || p.quantity || 0) < 10 && (p.stock || p.quantity || 0) > 0).length;
      const outOfStock = products.filter(p => (p.stock || p.quantity || 0) === 0).length;
      const totalReviews = products.reduce((sum, p) => sum + (p.numReviews || p.reviews?.length || 0), 0);
      const activeCoupons = coupons.filter(c => c.isActive !== false && (!c.validUntil || new Date(c.validUntil) > new Date())).length;

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0),
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        lowStockProducts: lowStock,
        outOfStockProducts: outOfStock,
        totalReviews,
        avgRating,
        totalTestimonials: testimonials.length,
        activeCoupons,
        totalBlogPosts: blogPosts.length,
        pendingContactMessages: contactMessages.filter(c => c.status === 'unread' || c.status === 'Unread').length,
        newsletterSubscribers: newsletter.length,
        todayOrders: todayOrders.length,
        todayRevenue,
        weekOrders: weekOrders.length,
        weekRevenue,
        monthOrders: 0,
        monthRevenue: 0,
        popularProducts,
        topCustomers
      });

      setRecentOrders(orders.slice(0, 6));
      setRecentUsers(users.slice(0, 5));

      if (showToast) toast.success('Dashboard refreshed');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (showToast) toast.error('Failed to refresh dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  if (loading) {
    return (
      <div className="space-y-3 px-2">
        <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  const mainStats = [
    { title: 'Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, icon: FiDollarSign, change: '+12%', color: 'text-emerald-600' },
    { title: 'Orders', value: stats.totalOrders, icon: FiShoppingCart, change: `+${stats.weekOrders}`, color: 'text-blue-600' },
    { title: 'Users', value: stats.totalUsers, icon: FiUsers, change: '+8%', color: 'text-purple-600' },
    { title: 'Products', value: stats.totalProducts, icon: FiPackage, change: `${stats.lowStockProducts} low`, color: 'text-orange-600' }
  ];

  const quickStats = [
    { label: 'Today', orders: stats.todayOrders, revenue: `₹${(stats.todayRevenue / 1000).toFixed(0)}K` },
    { label: 'Week', orders: stats.weekOrders, revenue: `₹${(stats.weekRevenue / 1000).toFixed(0)}K` },
    { label: 'Pending', value: stats.pendingOrders, icon: FiClock },
    { label: 'Delivered', value: stats.deliveredOrders, icon: FiCheckCircle }
  ];

  return (
    <div className="space-y-3 pb-16 px-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-3 flex-1">
          <p className="text-white/80 text-[10px]">Welcome back</p>
          <p className="text-white font-semibold text-sm">Admin Dashboard</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2.5 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 active:scale-95 disabled:opacity-50"
        >
          <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Stats - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2">
        {mainStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-1">
                <Icon className={`h-4 w-4 ${stat.color}`} />
                {stat.change && <span className="text-[9px] font-medium text-green-600">{stat.change}</span>}
              </div>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] text-neutral-500">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Row - Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {quickStats.map((stat, idx) => (
          <div key={idx} className="flex-shrink-0 w-[100px] bg-white dark:bg-neutral-900 rounded-xl p-2 border border-neutral-200 dark:border-neutral-800">
            {stat.icon ? (
              <>
                <stat.icon className="h-4 w-4 text-primary-500 mb-1" />
                <p className="text-base font-bold">{stat.value}</p>
                <p className="text-[9px] text-neutral-500">{stat.label}</p>
              </>
            ) : (
              <>
                <p className="text-[9px] text-neutral-500">{stat.label}</p>
                <p className="text-sm font-bold">{stat.orders} orders</p>
                <p className="text-[10px] text-green-600 font-medium">{stat.revenue}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-semibold">Sales Overview</h3>
            <p className="text-[9px] text-neutral-500">Last 7 days</p>
          </div>
          <FiBarChart2 className="h-3.5 w-3.5 text-neutral-400" />
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={0.5} />
            <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 9 }} tickMargin={3} />
            <YAxis yAxisId="left" stroke="#9ca3af" tick={{ fontSize: 9 }} tickFormatter={(v) => `₹${v/1000}K`} width={35} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" tick={{ fontSize: 9 }} width={25} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '6px', fontSize: '10px', padding: '4px 8px' }} />
            <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#6366f1" fill="url(#salesGradient)" strokeWidth={1.5} />
            <Bar yAxisId="right" dataKey="orders" fill="#f59e0b" radius={[2, 2, 0, 0]} barSize={20} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-2">
        {/* Order Status */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-xs font-semibold mb-2">Order Status</h3>
          {orderStatusData.length === 0 ? (
            <p className="text-center text-neutral-500 text-[10px] py-4">No data</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '10px', padding: '4px 8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {orderStatusData.map(item => (
                  <div key={item.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[8px] text-neutral-600">{item.name}</span>
                    <span className="text-[8px] font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-xs font-semibold mb-2">Top Categories</h3>
          {categoryData.length === 0 ? (
            <p className="text-center text-neutral-500 text-[10px] py-4">No data</p>
          ) : (
            <div className="space-y-2">
              {categoryData.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="truncate flex-1">{cat.name}</span>
                    <span className="ml-1">{cat.value}</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1">
                    <div
                      className="bg-primary-500 rounded-full h-1"
                      style={{ width: `${(cat.value / stats.totalProducts) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popular Products */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold">🔥 Popular Products</h3>
          <FiTrendingUp className="h-3 w-3 text-green-500" />
        </div>
        {stats.popularProducts.length === 0 ? (
          <p className="text-center text-neutral-500 text-[10px] py-3">No data</p>
        ) : (
          <div className="space-y-1.5">
            {stats.popularProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 px-1 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-primary-500 w-4">{idx + 1}</span>
                  <span className="text-[11px] font-medium truncate flex-1">{product.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold">{product.sales}</span>
                  <span className="text-[9px] text-neutral-500 ml-1">sold</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Customers */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold">🏆 Top Customers</h3>
          <FiAward className="h-3 w-3 text-amber-500" />
        </div>
        {stats.topCustomers.length === 0 ? (
          <p className="text-center text-neutral-500 text-[10px] py-3">No data</p>
        ) : (
          <div className="space-y-1.5">
            {stats.topCustomers.map((customer, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 px-1 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {customer.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate">{customer.name}</p>
                    <p className="text-[9px] text-neutral-500">{customer.orders} orders</p>
                  </div>
                </div>
                <p className="text-[11px] font-semibold text-green-600">₹{customer.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="p-2.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold">📦 Recent Orders</h3>
          <span className="text-[9px] text-neutral-500">{recentOrders.length} orders</span>
        </div>
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 max-h-72 overflow-y-auto">
          {recentOrders.length === 0 ? (
            <div className="p-4 text-center text-neutral-500 text-[10px]">No orders found</div>
          ) : (
            recentOrders.map((order, idx) => (
              <div key={idx} className="p-2 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[11px] text-neutral-900 dark:text-white truncate">
                    #{order.orderNumber || order._id?.slice(-8)}
                  </p>
                  <p className="text-[10px] text-neutral-500">₹{(order.total || order.totalAmount || 0).toLocaleString()}</p>
                </div>
                <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded-full ml-2 whitespace-nowrap ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {order.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Users & Extra Stats */}
      <div className="grid grid-cols-2 gap-2">
        {/* Recent Users */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-[10px] font-semibold">👥 New Users</h3>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800 max-h-48 overflow-y-auto">
            {recentUsers.length === 0 ? (
              <div className="p-3 text-center text-neutral-500 text-[9px]">No users</div>
            ) : (
              recentUsers.map((user, idx) => (
                <div key={idx} className="p-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium truncate">{user.name || 'User'}</p>
                    <p className="text-[8px] text-neutral-500 truncate">{user.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Extra Stats */}
        <div className="space-y-2">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-2 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] text-neutral-500">Newsletter</p>
                <p className="text-base font-bold">{stats.newsletterSubscribers}</p>
              </div>
              <FiMail className="h-5 w-5 text-primary-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-2 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] text-neutral-500">Messages</p>
                <p className="text-base font-bold">{stats.pendingContactMessages}</p>
              </div>
              <FiMessageSquare className="h-5 w-5 text-amber-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-2 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] text-neutral-500">Coupons</p>
                <p className="text-base font-bold">{stats.activeCoupons}</p>
              </div>
              <FiTag className="h-5 w-5 text-green-500 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2 border border-neutral-200 dark:border-neutral-800 text-center">
          <FiStar className="h-3.5 w-3.5 text-amber-500 mx-auto mb-0.5" />
          <p className="text-sm font-bold">{stats.avgRating}</p>
          <p className="text-[8px] text-neutral-500">Rating</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2 border border-neutral-200 dark:border-neutral-800 text-center">
          <FiBookOpen className="h-3.5 w-3.5 text-purple-500 mx-auto mb-0.5" />
          <p className="text-sm font-bold">{stats.totalBlogPosts}</p>
          <p className="text-[8px] text-neutral-500">Blog Posts</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2 border border-neutral-200 dark:border-neutral-800 text-center">
          <FiSmile className="h-3.5 w-3.5 text-pink-500 mx-auto mb-0.5" />
          <p className="text-sm font-bold">{stats.totalTestimonials}</p>
          <p className="text-[8px] text-neutral-500">Testimonials</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;