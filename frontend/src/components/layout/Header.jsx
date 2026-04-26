import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiPackage,
  FiSettings,
  FiBell,
  FiHome,
  FiGrid,
  FiBookOpen,
  FiTag,
  FiPenTool,
  FiEdit,
  FiChevronRight,
} from 'react-icons/fi';
import { 
  MdOutlineLiving, 
  MdOutlineBed, 
  MdOutlineDining, 
  MdOutlineWork, 
  MdOutlineGrass,
  MdOutlineLightbulb,
  MdOutlineTableRestaurant,
  MdOutlineDoorFront,
  MdOutlineWindow,
  MdOutlineStorage,
  MdOutlineChair,
  MdOutlineKingBed,
  MdOutlineDesk,
  MdOutlineCoffeeMaker,
  MdOutlinePhotoLibrary,
  MdOutlineWatchLater,
  MdOutlineLocalFlorist,
} from 'react-icons/md';
import { GiSofa, GiBookshelf, GiMirrorMirror } from 'react-icons/gi';
import { IoIosDesktop } from 'react-icons/io';
import { useAuth } from '../../store/AuthContext';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';
import { useTheme } from '../../store/ThemeContext';
import { useNotifications } from '../../store/NotificationContext';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import SearchBar from '../common/SearchBar';
import MobileMenu from './MobileMenu';
import NotificationsModal from '../common/NotificationsModal';
import { cn } from '../../utils/cn';

const Header = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [isCategoryClicked, setIsCategoryClicked] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems, getCartCount, getSubtotal } = useCart();
  const { wishlistItems } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const { scrollPosition } = useScrollPosition();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const cartPreviewRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const categoryButtonRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const cartTimeoutRef = useRef(null);

  // Load avatar from localStorage
  const [avatar, setAvatar] = useState(null);
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setAvatar(savedAvatar);
  }, [user]); // Reload when user changes

  useEffect(() => {
    setIsScrolled(scrollPosition > 30);
  }, [scrollPosition]);

  // Handle cart preview with delay for better UX
  const handleCartMouseEnter = () => {
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = null;
    }
    setShowCartPreview(true);
  };

  const handleCartMouseLeave = () => {
    cartTimeoutRef.current = setTimeout(() => {
      setShowCartPreview(false);
    }, 200);
  };

  // Handle cart click - navigate to cart page directly
  const handleCartClick = () => {
    setShowCartPreview(false);
    navigate('/cart');
  };

  // Handle category dropdown with click instead of hover
  const handleCategoryClick = (categoryName) => {
    setIsCategoryClicked(false);
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  // Handle subcategory click - navigate to shop and close dropdown
  const handleSubcategoryClick = (categoryName, subcategoryName) => {
    setIsCategoryClicked(false);
    navigate(`/products?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(subcategoryName)}`);
  };

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (cartPreviewRef.current && !cartPreviewRef.current.contains(e.target)) {
        setShowCartPreview(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target) &&
          categoryButtonRef.current && !categoryButtonRef.current.contains(e.target)) {
        setIsCategoryClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (cartTimeoutRef.current) {
        clearTimeout(cartTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to get product image safely
  const getProductImage = (item) => {
    try {
      if (item.product?.images && Array.isArray(item.product.images) && item.product.images[0]) {
        return item.product.images[0];
      }
      return 'https://via.placeholder.com/64x64?text=No+Image';
    } catch (error) {
      return 'https://via.placeholder.com/64x64?text=No+Image';
    }
  };

  // Helper function to get product price safely
  const getProductPrice = (item) => {
    try {
      return (item.variant?.price || item.product?.price || 0).toFixed(2);
    } catch (error) {
      return '0.00';
    }
  };

  // Helper function to get product name safely
  const getProductName = (item) => {
    try {
      return item.product?.name || 'Unknown Product';
    } catch (error) {
      return 'Unknown Product';
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // Category data with valid icons only
  const categories = [
    {
      name: 'Living Room',
      icon: MdOutlineLiving,
      color: 'from-purple-500 to-pink-500',
      subcategories: [
        'Sofas & Sectionals', 'Armchairs', 'Coffee Tables', 'TV Stands', 
        'Bookshelves', 'Ottomans', 'Rugs', 'Curtains'
      ]
    },
    {
      name: 'Bedroom',
      icon: MdOutlineBed,
      color: 'from-blue-500 to-cyan-500',
      subcategories: [
        'Beds & Frames', 'Mattresses', 'Nightstands', 'Dressers', 
        'Wardrobes', 'Vanities', 'Bedding', 'Mirrors'
      ]
    },
    {
      name: 'Dining Room',
      icon: MdOutlineDining,
      color: 'from-emerald-500 to-teal-500',
      subcategories: [
        'Dining Tables', 'Dining Chairs', 'Bar Stools', 'Buffets & Sideboards', 
        'Cabinets', 'Bar Carts', 'Tableware', 'Table Linens'
      ]
    },
    {
      name: 'Office',
      icon: MdOutlineWork,
      color: 'from-orange-500 to-red-500',
      subcategories: [
        'Desks', 'Office Chairs', 'Bookcases', 'Filing Cabinets', 
        'Desk Accessories', 'Lighting', 'Storage Solutions', 'Conference Tables'
      ]
    },
    {
      name: 'Outdoor',
      icon: MdOutlineGrass,
      color: 'from-green-500 to-lime-500',
      subcategories: [
        'Outdoor Seating', 'Dining Sets', 'Loungers', 'Umbrellas', 
        'Fire Pits', 'Planters', 'Outdoor Rugs', 'Garden Decor'
      ]
    },
    {
      name: 'Lighting',
      icon: MdOutlineLightbulb,
      color: 'from-yellow-500 to-amber-500',
      subcategories: [
        'Chandeliers', 'Pendant Lights', 'Floor Lamps', 'Table Lamps', 
        'Wall Sconces', 'Ceiling Lights', 'Outdoor Lighting', 'Smart Bulbs'
      ]
    },
    {
      name: 'Decor',
      icon: MdOutlinePhotoLibrary,
      color: 'from-rose-500 to-pink-500',
      subcategories: [
        'Wall Art', 'Mirrors', 'Clocks', 'Vases', 
        'Candles', 'Frames', 'Sculptures', 'Artificial Plants'
      ]
    },
    {
      name: 'Storage',
      icon: MdOutlineStorage,
      color: 'from-indigo-500 to-purple-500',
      subcategories: [
        'Shelving Units', 'Cabinets', 'Drawers', 'Storage Bins', 
        'Closet Systems', 'Garage Storage', 'Display Cases', 'Wine Racks'
      ]
    }
  ];

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md shadow-medium border-b border-neutral-200/50 dark:border-neutral-800/50'
            : 'bg-white dark:bg-neutral-950 border-b border-transparent'
        )}
      >
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="relative">
                <img 
                  src="/logo.svg" 
                  alt="Furniqo" 
                  className="h-9 w-9 lg:h-10 lg:w-10 object-contain transition-all duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40x40?text=F';
                    e.target.style.borderRadius = '8px';
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent leading-tight">
                  Furniqo
                </span>
                <span className="text-[9px] lg:text-[10px] text-neutral-400 dark:text-neutral-500 -mt-0.5 tracking-wide">
                  Premium Furniture
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {isDesktop && (
              <nav className="hidden lg:flex items-center gap-1">
                <Link to="/" className="nav-link">
                  <FiHome className="inline-block mr-1.5 h-3.5 w-3.5" />
                  Home
                </Link>
                <Link to="/products" className="nav-link">
                  <FiGrid className="inline-block mr-1.5 h-3.5 w-3.5" />
                  Shop
                </Link>
                
                {/* Categories Dropdown - Opens on Click */}
                <div 
                  className="relative"
                  ref={categoryMenuRef}
                >
                  <button 
                    ref={categoryButtonRef}
                    onClick={() => setIsCategoryClicked(!isCategoryClicked)}
                    className="nav-link flex items-center gap-1"
                    aria-expanded={isCategoryClicked}
                  >
                    <FiGrid className="h-3.5 w-3.5" />
                    Categories
                    <FiChevronDown className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      isCategoryClicked && "rotate-180"
                    )} />
                  </button>
                  
                  <AnimatePresence>
                    {isCategoryClicked && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: 10, scaleY: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-1 w-[800px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 z-50 overflow-hidden origin-top"
                        style={{ transformOrigin: 'top' }}
                      >
                        <div className="grid grid-cols-4 gap-0">
                          {categories.map((category) => (
                            <div key={category.name} className="group/category">
                              <div
                                onClick={() => handleCategoryClick(category.name)}
                                className="block p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 border-r border-b border-neutral-100 dark:border-neutral-800 cursor-pointer"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div className={cn(
                                    "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform group-hover/category:scale-105",
                                    category.color
                                  )}>
                                    <category.icon className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">
                                      {category.name}
                                    </h4>
                                    <p className="text-xs text-neutral-500">
                                      {category.subcategories.length} items
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  {category.subcategories.slice(0, 3).map((sub) => (
                                    <p 
                                      key={sub} 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubcategoryClick(category.name, sub);
                                      }}
                                      className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors cursor-pointer"
                                    >
                                      {sub}
                                    </p>
                                  ))}
                                  {category.subcategories.length > 3 && (
                                    <p 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCategoryClick(category.name);
                                      }}
                                      className="text-xs text-primary-600 font-medium mt-1.5 flex items-center gap-1 cursor-pointer hover:text-primary-700"
                                    >
                                      +{category.subcategories.length - 3} more
                                      <FiChevronRight className="h-3 w-3" />
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white text-sm font-semibold">Browse All Categories</p>
                              <p className="text-white/80 text-xs">Discover our complete collection</p>
                            </div>
                            <Link
                              to="/products"
                              onClick={() => setIsCategoryClicked(false)}
                              className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-all duration-200 hover:scale-105"
                            >
                              View All
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <Link to="/room-inspiration" className="nav-link">
                  <FiBookOpen className="inline-block mr-1.5 h-3.5 w-3.5" />
                  Inspiration
                </Link>
                <Link to="/offers" className="nav-link text-red-500 hover:text-red-600 font-semibold">
                  <FiTag className="inline-block mr-1.5 h-3.5 w-3.5" />
                  Sale
                </Link>
                <Link to="/custom-furniture" className="nav-link">
                  <FiPenTool className="inline-block mr-1.5 h-3.5 w-3.5" />
                  Custom
                </Link>
                <Link to="/blog" className="nav-link">
                  <FiEdit className="inline-block mr-1.5 h-3.5 w-3.5" />
                  Blog
                </Link>
              </nav>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-1 lg:gap-1.5">
              {/* Search Toggle */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
                aria-label="Search"
              >
                <FiSearch className="h-4.5 w-4.5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors hidden sm:flex"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <FiSun className="h-4.5 w-4.5 text-amber-500" />
                ) : (
                  <FiMoon className="h-4.5 w-4.5" />
                )}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <FiHeart className="h-4.5 w-4.5" />
                {wishlistItems?.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-2xs w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold text-[10px]">
                    {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart - Hover shows preview, Click goes to cart page */}
              <div 
                className="relative" 
                ref={cartPreviewRef}
                onMouseEnter={handleCartMouseEnter}
                onMouseLeave={handleCartMouseLeave}
              >
                <button
                  onClick={handleCartClick}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
                  aria-label="Cart"
                >
                  <FiShoppingCart className="h-4.5 w-4.5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-2xs w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold text-[10px]">
                      {getCartCount() > 99 ? '99+' : getCartCount()}
                    </span>
                  )}
                </button>
                
                {/* Cart Preview Dropdown - Shows on Hover */}
                <AnimatePresence>
                  {showCartPreview && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow-hard border border-neutral-200 dark:border-neutral-800 z-50"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">
                            Cart ({getCartCount()} items)
                          </h3>
                          <Link
                            to="/cart"
                            className="text-sm text-primary-600 hover:text-primary-700"
                            onClick={() => setShowCartPreview(false)}
                          >
                            View Cart
                          </Link>
                        </div>
                        
                        {!cartItems || cartItems.length === 0 ? (
                          <p className="text-center text-neutral-500 py-4">
                            Your cart is empty
                          </p>
                        ) : (
                          <>
                            <div className="space-y-3 max-h-64 overflow-auto mb-4">
                              {cartItems.slice(0, 3).map((item) => (
                                <div key={item._id || item.product?._id} className="flex gap-3">
                                  <img
                                    src={getProductImage(item)}
                                    alt={getProductName(item)}
                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                    }}
                                  />
                                  <div className="flex-grow min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {getProductName(item)}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                      Qty: {item.quantity || 1}
                                    </p>
                                    <p className="text-sm font-semibold text-primary-600">
                                      ${getProductPrice(item)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {cartItems.length > 3 && (
                                <p className="text-sm text-neutral-500 text-center">
                                  +{cartItems.length - 3} more items
                                </p>
                              )}
                            </div>
                            <div className="border-t dark:border-neutral-800 pt-3">
                              <div className="flex justify-between mb-4">
                                <span className="font-medium">Subtotal</span>
                                <span className="font-bold">${getSubtotal().toFixed(2)}</span>
                              </div>
                              <Link
                                to="/checkout"
                                className="block w-full text-center bg-primary-600 text-white py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                                onClick={() => setShowCartPreview(false)}
                              >
                                Checkout
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <button
                onClick={() => setShowNotificationsModal(true)}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative hidden sm:flex"
                aria-label="Notifications"
              >
                <FiBell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-2xs w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold text-[10px] animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md overflow-hidden">
                        {avatar ? (
                          <img src={avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold text-white">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium hidden lg:block text-neutral-700 dark:text-neutral-300">
                        {user?.name?.split(' ')[0]}
                      </span>
                    </button>
                    
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-hard border border-neutral-200 dark:border-neutral-800 z-50 overflow-hidden"
                        >
                          <div className="p-3 border-b dark:border-neutral-800">
                            <p className="font-semibold text-sm">{user?.name}</p>
                            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                          </div>
                          <div className="p-2">
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <FiUser className="h-4 w-4" />
                              My Profile
                            </Link>
                            <Link
                              to="/orders"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <FiPackage className="h-4 w-4" />
                              My Orders
                            </Link>
                            <Link
                              to="/wishlist"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm sm:hidden"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <FiHeart className="h-4 w-4" />
                              Wishlist
                            </Link>
                          </div>
                          <div className="border-t dark:border-neutral-800 p-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 text-sm w-full"
                            >
                              <FiLogOut className="h-4 w-4" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <FiUser className="h-4.5 w-4.5" />
                    <span className="text-sm font-medium hidden lg:block">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors lg:hidden"
                aria-label="Menu"
              >
                {showMobileMenu ? (
                  <FiX className="h-4.5 w-4.5" />
                ) : (
                  <FiMenu className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchBar 
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotificationsModal && (
          <NotificationsModal
            isOpen={showNotificationsModal}
            onClose={() => setShowNotificationsModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <MobileMenu onClose={() => setShowMobileMenu(false)} />
        )}
      </AnimatePresence>

      <style>{`
        .nav-link {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #525252;
          transition: all 0.2s;
        }
        .dark .nav-link {
          color: #a3a3a3;
        }
        .nav-link:hover {
          color: #9333ea;
          background-color: #f5f5f5;
        }
        .dark .nav-link:hover {
          color: #a855f7;
          background-color: #262626;
        }
        .h-4\\.5 {
          height: 1.125rem;
        }
        .w-4\\.5 {
          width: 1.125rem;
        }
      `}</style>
    </>
  );
};

export default Header;