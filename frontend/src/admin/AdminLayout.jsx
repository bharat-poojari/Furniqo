// AdminLayout.jsx - Main admin layout wrapper (ENHANCED MOBILE OPTIMIZED)
import { useState, useEffect, useCallback, useRef } from 'react';
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
  FiDollarSign,
  FiLoader,
  FiBell,
  FiSearch,
  FiUser,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';

// Menu sections for better organization
const menuSections = [
  {
    title: 'Main',
    items: [
      { path: '/admin/dashboard', icon: FiBarChart2, label: 'Dashboard', color: 'from-blue-500 to-cyan-500', description: 'Overview & stats' },
      { path: '/admin/users', icon: FiUsers, label: 'Users', color: 'from-indigo-500 to-purple-500', description: 'Manage customers' },
      { path: '/admin/orders', icon: FiPackage, label: 'Orders', color: 'from-orange-500 to-red-500', description: 'Track & manage' },
    ]
  },
  {
    title: 'Catalog',
    items: [
      { path: '/admin/products', icon: FiShoppingBag, label: 'Products', color: 'from-emerald-500 to-teal-500', description: 'Manage inventory' },
      { path: '/admin/categories', icon: FiFolder, label: 'Categories', color: 'from-green-500 to-emerald-500', description: 'Organize products' },
      { path: '/admin/rooms', icon: FiHomeIcon, label: 'Rooms', color: 'from-teal-500 to-cyan-500', description: 'Room inspiration' },
      { path: '/admin/blog', icon: FiBookOpen, label: 'Blog', color: 'from-blue-500 to-sky-500', description: 'Content management' },
    ]
  },
  {
    title: 'Marketing',
    items: [
      { path: '/admin/coupons', icon: FiTag, label: 'Coupons', color: 'from-amber-500 to-orange-500', description: 'Discount codes' },
      { path: '/admin/gift-cards', icon: FiGift, label: 'Gift Cards', color: 'from-yellow-500 to-amber-500', description: 'Digital gifts' },
      { path: '/admin/hero-slides', icon: FiImage, label: 'Hero Slides', color: 'from-violet-500 to-purple-500', description: 'Homepage banners' },
      { path: '/admin/testimonials', icon: FiStar, label: 'Testimonials', color: 'from-purple-500 to-indigo-500', description: 'Customer reviews' },
    ]
  },
  {
    title: 'Support',
    items: [
      { path: '/admin/faqs', icon: FiHelpCircle, label: 'FAQs', color: 'from-slate-500 to-gray-500', description: 'Help articles' },
      { path: '/admin/contact', icon: FiMail, label: 'Contact', color: 'from-cyan-500 to-blue-500', description: 'Contact queries' }
       ]
  },
  {
    title: 'Content',
    items: [
      { path: '/admin/policies', icon: FiFileText, label: 'Policies', color: 'from-gray-500 to-slate-500', description: 'Legal pages' },
      { path: '/admin/uploads', icon: FiUploadCloud, label: 'Media', color: 'from-rose-500 to-pink-500', description: 'File manager' },
      { path: '/admin/settings', icon: FiSettings, label: 'Settings', color: 'from-neutral-500 to-stone-500', description: 'Site config' },
    ]
  }
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const sidebarRef = useRef(null);

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Handle theme toggle
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('adminTheme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('adminTheme', 'light');
      }
      return newMode;
    });
  }, []);

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
        setMobileMenuOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Handle click outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && mobileMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, mobileMenuOpen]);

  // Check if user is admin
  useEffect(() => {
    if (user === undefined) return;
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    } finally {
      setLoggingOut(false);
    }
  }, [logout, navigate]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  }, [isMobile, mobileMenuOpen, sidebarOpen]);

  // Loading state
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{
          x: isMobile ? (mobileMenuOpen ? 0 : -320) : (sidebarOpen ? 0 : -80),
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed left-0 top-0 h-full z-50 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-y-auto custom-scrollbar ${
          isMobile ? 'w-72' : (sidebarOpen ? 'w-72' : 'w-20')
        } transition-all duration-300`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="sticky top-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl z-10 p-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <FiBarChart2 className="h-5 w-5 text-white" />
              </motion.div>
              {(sidebarOpen || isMobile) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent truncate">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-neutral-500 truncate">Manage your store</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
            {menuSections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="mb-5">
                {(sidebarOpen || isMobile) && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-2"
                  >
                    {section.title}
                  </motion.p>
                )}
                {section.items.map((item, idx) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link key={idx} to={item.path}>
                      <motion.div
                        whileHover={!isActive ? { x: 5, backgroundColor: 'rgba(0,0,0,0.05)' } : {}}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                        {(sidebarOpen || isMobile) && (
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium block truncate">{item.label}</span>
                            {isActive && (
                              <span className="text-[10px] opacity-80 block truncate">{item.description}</span>
                            )}
                          </div>
                        )}
                        {!sidebarOpen && !isMobile && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg"
                          >
                            {item.label}
                          </motion.div>
                        )}
                        {isActive && (sidebarOpen || isMobile) && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Info & Actions */}
          <div className="sticky bottom-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                !sidebarOpen && !isMobile && 'justify-center'
              }`}
            >
              {isDarkMode ? (
                <FiSun className="h-5 w-5 flex-shrink-0" />
              ) : (
                <FiMoon className="h-5 w-5 flex-shrink-0" />
              )}
              {(sidebarOpen || isMobile) && (
                <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              )}
            </button>

            {/* User Info */}
            {(sidebarOpen || isMobile) ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950/30 dark:to-purple-950/30"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-md">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                </div>
              </motion.div>
            ) : (
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-md">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              </div>
            )}

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              disabled={loggingOut}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed ${
                !sidebarOpen && !isMobile && 'justify-center'
              }`}
            >
              {loggingOut ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FiLoader className="h-5 w-5 flex-shrink-0" />
                </motion.div>
              ) : (
                <FiLogOut className="h-5 w-5 flex-shrink-0" />
              )}
              {(sidebarOpen || isMobile) && (
                <span className="text-sm font-medium">
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Header Bar (Mobile) */}
      <div className={`fixed top-0 right-0 left-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300 lg:hidden ${
        scrolled ? 'shadow-md' : ''
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <FiMenu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
              <FiSearch className="h-5 w-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              {isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: isMobile ? 0 : (sidebarOpen ? '288px' : '80px'),
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="min-h-screen"
      >
        <div className="p-4 pt-20 lg:pt-6 md:p-6">
          {/* Page Header with Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
              <FiHome className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Admin</span>
              <FiChevronRight className="h-3 w-3 hidden xs:inline" />
              <span className="capitalize">
                {location.pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Custom Scrollbar Styles */}
      {/* Custom Scrollbar Styles */}
<style>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #334155;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #475569;
  }
`}</style>
    </div>
  );
};

export default AdminLayout;