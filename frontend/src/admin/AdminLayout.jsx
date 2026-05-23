// AdminLayout.jsx - Main admin layout wrapper
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiShoppingBag,
  FiHeart,
  FiPackage,
  FiGift,
  FiGrid,
  FiFolder,
  FiMessageSquare,
  FiBookOpen,
  FiHome as FiHomeIcon,
  FiTag,
  FiHelpCircle,
  FiUploadCloud,
  FiMail,
  FiImage,
  FiFileText,
  FiBarChart2,
  FiLogOut,
  FiChevronRight,
  FiChevronLeft,
  FiSettings,
  FiStar,
  FiCalendar,
  FiDollarSign
} from 'react-icons/fi';
import { useAuth } from '../store/AuthContext';
import apiWrapper from '../services/apiWrapper';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if user is admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const menuItems = [
    { path: '/admin/dashboard', icon: FiBarChart2, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { path: '/admin/users', icon: FiUsers, label: 'Users', color: 'from-indigo-500 to-purple-500' },
    { path: '/admin/products', icon: FiShoppingBag, label: 'Products', color: 'from-emerald-500 to-teal-500' },
    { path: '/admin/categories', icon: FiFolder, label: 'Categories', color: 'from-green-500 to-emerald-500' },
    { path: '/admin/orders', icon: FiPackage, label: 'Orders', color: 'from-orange-500 to-red-500' },
    { path: '/admin/wishlist', icon: FiHeart, label: 'Wishlist Management', color: 'from-pink-500 to-rose-500' },
    { path: '/admin/gift-cards', icon: FiGift, label: 'Gift Cards', color: 'from-yellow-500 to-amber-500' },
    { path: '/admin/testimonials', icon: FiStar, label: 'Testimonials', color: 'from-purple-500 to-indigo-500' },
    { path: '/admin/blog', icon: FiBookOpen, label: 'Blog', color: 'from-blue-500 to-sky-500' },
    { path: '/admin/rooms', icon: FiHomeIcon, label: 'Rooms', color: 'from-teal-500 to-cyan-500' },
    { path: '/admin/coupons', icon: FiTag, label: 'Coupons', color: 'from-amber-500 to-orange-500' },
    { path: '/admin/faqs', icon: FiHelpCircle, label: 'FAQs', color: 'from-slate-500 to-gray-500' },
    { path: '/admin/contact', icon: FiMail, label: 'Contact Messages', color: 'from-cyan-500 to-blue-500' },
    { path: '/admin/newsletter', icon: FiMail, label: 'Newsletter', color: 'from-emerald-500 to-green-500' },
    { path: '/admin/hero-slides', icon: FiImage, label: 'Hero Slides', color: 'from-violet-500 to-purple-500' },
    { path: '/admin/policies', icon: FiFileText, label: 'Policies', color: 'from-gray-500 to-slate-500' },
    { path: '/admin/uploads', icon: FiUploadCloud, label: 'Media Manager', color: 'from-rose-500 to-pink-500' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings', color: 'from-neutral-500 to-stone-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : isMobile ? -280 : -80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed left-0 top-0 h-full z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-r border-neutral-200 dark:border-neutral-800 shadow-2xl ${
          sidebarOpen ? 'w-72' : 'w-20'
        } transition-all duration-300`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <FiBarChart2 className="h-5 w-5 text-white" />
              </div>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-neutral-500">Manage your store</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
            {menuItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={idx} to={item.path}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                    {sidebarOpen && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                    {isActive && sidebarOpen && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            {sidebarOpen ? (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 ${
                !sidebarOpen && 'justify-center'
              }`}
            >
              <FiLogOut className="h-5 w-5" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all"
      >
        {sidebarOpen ? <FiChevronLeft className="h-5 w-5" /> : <FiChevronRight className="h-5 w-5" />}
      </button>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
        } min-h-screen`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;