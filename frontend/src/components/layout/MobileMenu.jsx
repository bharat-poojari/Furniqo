import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiUser, 
  FiHeart, 
  FiShoppingCart, 
  FiLogOut, 
  FiChevronRight,
  FiChevronDown,
  FiSun,
  FiMoon,
  FiPhone,
  FiHome,
  FiGrid,
  FiTag,
  FiBookOpen,
  FiPenTool,
  FiEdit,
  FiInfo,
  FiHelpCircle,
  FiMessageCircle,
  FiMapPin,
  FiPackage,
  FiSettings,
  FiStar,
  FiCheck
} from 'react-icons/fi';
import { useAuth } from '../../store/AuthContext';
import { useWishlist } from '../../store/WishlistContext';
import { useCart } from '../../store/CartContext';
import { useTheme } from '../../store/ThemeContext';

// Custom SVG Icons for categories
const SofaIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 11h16v4H4zM4 15l-1 3h18l-1-3M7 11V9a5 5 0 0110 0v2" />
  </svg>
);

const BedIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 10l1-4h16l1 4M3 14v6h18v-6M7 14v6M17 14v6" />
  </svg>
);

const TableIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 6v12h16V6M12 6v12M4 10h16M4 14h16" />
  </svg>
);

const DeskIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 8v8h16V8M12 8v10M8 18v3M16 18v3" />
  </svg>
);

const OutdoorIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4M6 12h12M4 8l4-4h8l4 4M4 16l4 4h8l4-4" />
  </svg>
);

const LightIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const DecorIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 7v10h16V7M8 7V4h8v3M4 12h16" />
  </svg>
);

const StorageIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4zM4 9h16M12 4v16" />
  </svg>
);

const MobileMenu = ({ onClose }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const { getCartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [expandedSection, setExpandedSection] = useState(null);
  const [avatar, setAvatar] = useState(null);

  // Load avatar from localStorage (same source as Profile page)
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setAvatar(savedAvatar);
  }, [user]);

  const categories = [
    { name: 'Living Room', icon: SofaIcon, href: '/products?category=Living%20Room', color: 'text-purple-500' },
    { name: 'Bedroom', icon: BedIcon, href: '/products?category=Bedroom', color: 'text-blue-500' },
    { name: 'Dining Room', icon: TableIcon, href: '/products?category=Dining%20Room', color: 'text-emerald-500' },
    { name: 'Home Office', icon: DeskIcon, href: '/products?category=Office', color: 'text-orange-500' },
    { name: 'Outdoor', icon: OutdoorIcon, href: '/products?category=Outdoor', color: 'text-green-500' },
    { name: 'Lighting', icon: LightIcon, href: '/products?category=Lighting', color: 'text-amber-500' },
    { name: 'Decor', icon: DecorIcon, href: '/products?category=Decor', color: 'text-rose-500' },
    { name: 'Storage', icon: StorageIcon, href: '/products?category=Storage', color: 'text-indigo-500' },
  ];

  const mainLinks = [
    { label: 'Home', href: '/', icon: FiHome },
    { label: 'All Products', href: '/products', icon: FiGrid },
    { label: 'On Sale', href: '/offers', icon: FiTag, highlight: true },
    { label: 'Room Inspiration', href: '/room-inspiration', icon: FiBookOpen },
    { label: 'Custom Furniture', href: '/custom-furniture', icon: FiPenTool },
    { label: 'Blog', href: '/blog', icon: FiEdit },
  ];

  const secondaryLinks = [
    { label: 'About Us', href: '/about', icon: FiInfo },
    { label: 'Contact', href: '/contact', icon: FiMessageCircle },
    { label: 'FAQ', href: '/faq', icon: FiHelpCircle },
    { label: 'Store Locator', href: '/stores', icon: FiMapPin },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      {/* Menu Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-neutral-950 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <img 
              src="/logo.svg" 
              alt="Furniqo" 
              className="h-8 w-8 object-contain transition-all duration-300 group-hover:scale-105"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-lg font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
              Furniqo
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="h-4.5 w-4.5" /> : <FiMoon className="h-4.5 w-4.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close menu"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* User Section or Sign In */}
        <div className="flex-shrink-0">
          {isAuthenticated ? (
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              <Link to="/profile" onClick={onClose} className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0 overflow-hidden">
                    {avatar ? (
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-base">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center">
                    <FiCheck className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{user?.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                </div>
                <FiChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors shadow-sm"
              >
                <FiUser className="h-4.5 w-4.5" />
                Sign In / Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 p-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
          <Link
            to="/wishlist"
            onClick={onClose}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative group"
          >
            <div className="relative">
              <FiHeart className="h-5 w-5 group-hover:text-red-500 transition-colors" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Wishlist</span>
          </Link>
          <Link
            to="/cart"
            onClick={onClose}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative group"
          >
            <div className="relative">
              <FiShoppingCart className="h-5 w-5 group-hover:text-primary-500 transition-colors" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {getCartCount() > 9 ? '9+' : getCartCount()}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </Link>
          <a
            href="tel:+15559876543"
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
          >
            <FiPhone className="h-5 w-5 group-hover:text-emerald-500 transition-colors" />
            <span className="text-[10px] font-medium">Call Us</span>
          </a>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <nav className="p-3 border-b border-neutral-100 dark:border-neutral-800">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg mb-0.5 transition-all ${
                  link.highlight
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-900/30'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <link.icon className="h-4.5 w-4.5 flex-shrink-0" />
                <span className="text-sm flex-1">{link.label}</span>
                <FiChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              </Link>
            ))}
          </nav>

          {/* Categories Accordion */}
          <div className="border-b border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full p-3 font-semibold text-sm dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FiGrid className="h-4 w-4 text-primary-500" />
                Categories
              </span>
              <motion.div animate={{ rotate: expandedSection === 'categories' ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <FiChevronDown className="h-4 w-4 text-neutral-400" />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSection === 'categories' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-1.5 p-3 pt-0">
                    {categories.map((cat) => {
                      const IconComponent = cat.icon;
                      return (
                        <Link
                          key={cat.name}
                          to={cat.href}
                          onClick={onClose}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <IconComponent className={`h-4 w-4 ${cat.color}`} />
                          </div>
                          <span className="text-xs font-medium dark:text-white">{cat.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Secondary Links */}
          <nav className="p-3">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg mb-0.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
              >
                <link.icon className="h-4.5 w-4.5 flex-shrink-0" />
                <span className="text-sm flex-1">{link.label}</span>
                <FiChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              </Link>
            ))}

            {/* Settings for logged-in users */}
            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg mb-0.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
              >
                <FiSettings className="h-4.5 w-4.5 flex-shrink-0" />
                <span className="text-sm flex-1">Account Settings</span>
                <FiChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              </Link>
            )}
          </nav>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm font-semibold"
            >
              <FiLogOut className="h-4.5 w-4.5" />
              Sign Out
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex-1 text-center py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={onClose}
                className="flex-1 text-center py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
          <p className="text-center text-[10px] text-neutral-400 mt-3">
            © {new Date().getFullYear()} Furniqo. All rights reserved.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobileMenu;