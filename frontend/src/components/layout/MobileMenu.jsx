import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  FiPackage,
  FiSettings,
  FiStar,
  FiCheck,
  FiTrendingUp,
  FiShield,
  FiTruck
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
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);

  // Load avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setAvatar(savedAvatar);
  }, [user]);

  // Check if a link is active
  const isActiveLink = (href) => {
    if (href === '/') return location.pathname === href;
    if (href === '/offers') return location.pathname === href;
    if (href.includes('/products')) return location.pathname === '/products';
    return location.pathname === href;
  };

  const categories = [
    { name: 'Living Room', icon: SofaIcon, href: '/products?category=Living%20Room', color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-950/30' },
    { name: 'Bedroom', icon: BedIcon, href: '/products?category=Bedroom', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950/30' },
    { name: 'Dining Room', icon: TableIcon, href: '/products?category=Dining%20Room', color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { name: 'Home Office', icon: DeskIcon, href: '/products?category=Office', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/30' },
    { name: 'Outdoor', icon: OutdoorIcon, href: '/products?category=Outdoor', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-950/30' },
    { name: 'Lighting', icon: LightIcon, href: '/products?category=Lighting', color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-950/30' },
    { name: 'Decor', icon: DecorIcon, href: '/products?category=Decor', color: 'text-rose-500', bgColor: 'bg-rose-50 dark:bg-rose-950/30' },
    { name: 'Storage', icon: StorageIcon, href: '/products?category=Storage', color: 'text-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-950/30' },
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
  { label: 'Privacy Policy', href: '/policies/privacy', icon: FiShield },
];

  const handleLogout = () => {
    logout();
    onClose();
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleItemClick = (href, e) => {
    // Set clicked item for visual feedback
    setClickedItem(href);
    setTimeout(() => setClickedItem(null), 300);
    
    // Close menu after navigation with a slight delay for animation
    setTimeout(() => {
      onClose();
    }, 150);
  };

  // Animation variants
  const menuVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: { 
        type: 'spring', 
        damping: 30, 
        stiffness: 300,
        when: 'beforeChildren',
        staggerChildren: 0.03
      }
    },
    exit: { 
      x: '100%',
      transition: { type: 'spring', damping: 30, stiffness: 300 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="mobile-menu"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 lg:hidden"
      >
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
        />
        
        {/* Menu Panel */}
        <motion.div
          variants={menuVariants}
          className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-neutral-950 shadow-2xl flex flex-col"
          style={{ 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0"
          >
            <Link to="/" onClick={(e) => handleItemClick('/', e)} className="flex items-center gap-2.5 group">
              <motion.img 
                src="/logo.svg" 
                alt="Furniqo" 
                className="h-8 w-8 object-contain"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-lg font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                Furniqo
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative overflow-hidden"
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <FiSun className="h-4.5 w-4.5" /> : <FiMoon className="h-4.5 w-4.5" />}
                </motion.div>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close menu"
              >
                <FiX className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* User Section or Sign In */}
          <motion.div variants={itemVariants} className="flex-shrink-0">
            {isAuthenticated ? (
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900/50 dark:to-neutral-900/30">
                <Link to="/profile" onClick={(e) => handleItemClick('/profile', e)} className="flex items-center gap-3 group">
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0 overflow-hidden">
                      {avatar ? (
                        <img src={avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-base">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <motion.div 
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 10 }}
                    >
                      <FiCheck className="h-2 w-2 text-white" />
                    </motion.div>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{user?.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.5 }}
                  >
                    <FiChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </motion.div>
                </Link>
              </div>
            ) : (
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/login"
                    onClick={(e) => handleItemClick('/login', e)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300"
                  >
                    <FiUser className="h-4.5 w-4.5" />
                    Sign In / Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-3 gap-2 p-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0"
          >
            {[
              { to: '/wishlist', icon: FiHeart, label: 'Wishlist', count: wishlistItems.length, color: 'hover:text-red-500' },
              { to: '/cart', icon: FiShoppingCart, label: 'Cart', count: getCartCount(), color: 'hover:text-primary-500' },
              { to: 'tel:+15559876543', icon: FiPhone, label: 'Call Us', color: 'hover:text-emerald-500', external: true }
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.external ? (
                  <a
                    href={item.to}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 relative group"
                  >
                    <div className="relative">
                      <item.icon className={`h-5 w-5 transition-all duration-300 ${item.color}`} />
                      {item.count > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold"
                        >
                          {item.count > 9 ? '9+' : item.count}
                        </motion.span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </a>
                ) : (
                  <Link
                    to={item.to}
                    onClick={(e) => handleItemClick(item.to, e)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300 relative group ${
                      isActiveLink(item.to)
                        ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400'
                        : 'bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="relative">
                      <item.icon className={`h-5 w-5 transition-all duration-300 ${item.color} ${
                        isActiveLink(item.to) ? 'text-primary-600 dark:text-primary-400' : ''
                      }`} />
                      {item.count > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold"
                        >
                          {item.count > 9 ? '9+' : item.count}
                        </motion.span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Main Navigation */}
            <motion.nav variants={itemVariants} className="p-3 border-b border-neutral-100 dark:border-neutral-800">
              {mainLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                const isClicked = clickedItem === link.href;
                
                return (
                  <motion.div
                    key={link.href}
                    whileHover={{ x: 4 }}
                    onHoverStart={() => setHoveredItem(link.href)}
                    onHoverEnd={() => setHoveredItem(null)}
                    className="relative overflow-hidden"
                  >
                    <Link
                      to={link.href}
                      onClick={(e) => handleItemClick(link.href, e)}
                      className={`flex items-center gap-3 py-2.5 px-3 rounded-lg mb-0.5 transition-all duration-300 relative z-10 ${
                        link.highlight && isActive
                          ? 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 text-red-600 dark:text-red-400 font-semibold'
                          : link.highlight && !isActive
                          ? 'text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-950/20'
                          : isActive
                          ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      } ${
                        isClicked ? 'scale-98' : ''
                      }`}
                      style={{
                        transform: isClicked ? 'scale(0.98)' : 'scale(1)',
                      }}
                    >
                      <link.icon className="h-4.5 w-4.5 flex-shrink-0" />
                      <span className="text-sm flex-1">{link.label}</span>
                      <motion.div
                        animate={{ x: hoveredItem === link.href ? 5 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                      </motion.div>
                    </Link>
                    
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-primary-500 rounded-full"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Categories Accordion */}
            <motion.div variants={itemVariants} className="border-b border-neutral-100 dark:border-neutral-800">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSection('categories')}
                className="flex items-center justify-between w-full p-3 font-semibold text-sm dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FiGrid className="h-4 w-4 text-primary-500" />
                  Categories
                </span>
                <motion.div 
                  animate={{ rotate: expandedSection === 'categories' ? 180 : 0 }} 
                  transition={{ duration: 0.3 }}
                >
                  <FiChevronDown className="h-4 w-4 text-neutral-400" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {expandedSection === 'categories' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2 p-3 pt-0">
                      {categories.map((cat, index) => {
                        const IconComponent = cat.icon;
                        const isCategoryActive = location.pathname === '/products' && 
                          new URLSearchParams(location.search).get('category') === cat.name;
                        
                        return (
                          <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              to={cat.href}
                              onClick={(e) => handleItemClick(cat.href, e)}
                              className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-300 group ${
                                isCategoryActive
                                  ? `${cat.bgColor} shadow-md ring-1 ring-primary-500/30`
                                  : cat.bgColor
                              } hover:shadow-md`}
                            >
                              <div className={`w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm ${
                                isCategoryActive ? 'ring-1 ring-primary-500' : ''
                              }`}>
                                <IconComponent className={`h-4 w-4 ${cat.color} ${
                                  isCategoryActive ? 'scale-110' : ''
                                }`} />
                              </div>
                              <span className={`text-xs font-medium dark:text-white ${
                                isCategoryActive ? 'text-primary-600 dark:text-primary-400 font-semibold' : ''
                              }`}>
                                {cat.name}
                              </span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Secondary Links */}
            <motion.nav variants={itemVariants} className="p-3">
              {secondaryLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                const isClicked = clickedItem === link.href;
                
                return (
                  <motion.div
                    key={link.href}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Link
                      to={link.href}
                      onClick={(e) => handleItemClick(link.href, e)}
                      className={`flex items-center gap-3 py-2.5 px-3 rounded-lg mb-0.5 transition-all duration-300 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      } ${
                        isClicked ? 'scale-98' : ''
                      }`}
                      style={{
                        transform: isClicked ? 'scale(0.98)' : 'scale(1)',
                      }}
                    >
                      <link.icon className="h-4.5 w-4.5 flex-shrink-0" />
                      <span className="text-sm flex-1">{link.label}</span>
                      <motion.div
                        animate={{ x: hoveredItem === link.href ? 5 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                      </motion.div>
                    </Link>
                    
                    {/* Active indicator bar for secondary links */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicatorSecondary"
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-primary-500 rounded-full"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.div>
                );
              })}

              {/* Settings for logged-in users */}
              {isAuthenticated && (
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Link
                    to="/profile"
                    onClick={(e) => handleItemClick('/profile', e)}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg mb-0.5 transition-all duration-300 ${
                      isActiveLink('/profile')
                        ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <FiSettings className="h-4.5 w-4.5 flex-shrink-0" />
                    <span className="text-sm flex-1">Account Settings</span>
                    <FiChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  </Link>
                </motion.div>
              )}
            </motion.nav>
          </div>

          {/* Footer */}
          <motion.div 
            variants={itemVariants}
            className="flex-shrink-0 p-4 border-t border-neutral-100 dark:border-neutral-800 bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900/50 dark:to-neutral-900/30"
          >
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 text-sm font-semibold"
              >
                <FiLogOut className="h-4.5 w-4.5" />
                Sign Out
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/login"
                    onClick={(e) => handleItemClick('/login', e)}
                    className="text-center block py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/signup"
                    onClick={(e) => handleItemClick('/signup', e)}
                    className="text-center block py-2.5 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 dark:text-white"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
            <motion.p 
              className="text-center text-[10px] text-neutral-400 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              © {new Date().getFullYear()} Furniqo. All rights reserved.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #404040;
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        .scale-98 {
          transform: scale(0.98);
        }
      `}</style>
    </AnimatePresence>
  );
};

export default MobileMenu;