import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiX, 
  FiUser, 
  FiHeart, 
  FiPackage, 
  FiLogOut, 
  FiChevronRight,
  FiSun,
  FiMoon,
  FiPhone,
} from 'react-icons/fi';
import { useAuth } from '../../store/AuthContext';
import { useWishlist } from '../../store/WishlistContext';
import { useCart } from '../../store/CartContext';
import { useTheme } from '../../store/ThemeContext';

const MobileMenu = ({ onClose }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const { getCartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [expandedSection, setExpandedSection] = useState(null);

  const categories = [
    { name: 'Living Room', icon: '🛋️', href: '/products?category=Living%20Room' },
    { name: 'Bedroom', icon: '🛏️', href: '/products?category=Bedroom' },
    { name: 'Dining Room', icon: '🍽️', href: '/products?category=Dining%20Room' },
    { name: 'Home Office', icon: '💼', href: '/products?category=Office' },
    { name: 'Outdoor', icon: '🌿', href: '/products?category=Outdoor' },
    { name: 'Lighting', icon: '💡', href: '/products?category=Lighting' },
    { name: 'Decor', icon: '🎨', href: '/products?category=Decor' },
    { name: 'Storage', icon: '📦', href: '/products?category=Storage' },
  ];

  const mainLinks = [
    { label: 'Home', href: '/' },
    { label: 'All Products', href: '/products' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Best Sellers', href: '/products?sort=popular' },
    { label: 'On Sale', href: '/offers', highlight: true },
  ];

  const secondaryLinks = [
    { label: 'Room Inspiration', href: '/room-inspiration' },
    { label: 'Custom Furniture', href: '/custom-furniture' },
    { label: 'Blog', href: '/blog' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 lg:hidden bg-white dark:bg-neutral-950"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-neutral-800">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <span className="text-2xl">🪑</span>
            <span className="text-xl font-display font-bold text-primary-600">Furniqo</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* User Section */}
          {isAuthenticated ? (
            <div className="p-4 border-b dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span className="font-semibold text-primary-700 dark:text-primary-300">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{user?.name}</p>
                  <p className="text-xs text-neutral-500">{user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="flex-1 text-center py-2 bg-white dark:bg-neutral-800 rounded-lg text-sm font-medium border dark:border-neutral-700"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={onClose}
                  className="flex-1 text-center py-2 bg-white dark:bg-neutral-800 rounded-lg text-sm font-medium border dark:border-neutral-700"
                >
                  Orders
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b dark:border-neutral-800">
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-xl font-semibold"
              >
                <FiUser className="h-5 w-5" />
                Sign In / Sign Up
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2 p-4 border-b dark:border-neutral-800">
            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 relative"
            >
              <FiHeart className="h-5 w-5" />
              <span className="text-xs">Wishlist</span>
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-2xs w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 relative"
            >
              <FiPackage className="h-5 w-5" />
              <span className="text-xs">Cart</span>
              {getCartCount() > 0 && (
                <span className="absolute top-1 right-1 bg-primary-600 text-white text-2xs w-4 h-4 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <a
              href="tel:+15559876543"
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900"
            >
              <FiPhone className="h-5 w-5" />
              <span className="text-xs">Call</span>
            </a>
          </div>

          {/* Main Navigation */}
          <nav className="p-4 border-b dark:border-neutral-800">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className={`flex items-center justify-between py-3 px-4 rounded-xl mb-1 transition-colors ${
                  link.highlight
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 font-semibold'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-900'
                }`}
              >
                <span>{link.label}</span>
                <FiChevronRight className="h-4 w-4 text-neutral-400" />
              </Link>
            ))}
          </nav>

          {/* Categories */}
          <div className="p-4 border-b dark:border-neutral-800">
            <button
              onClick={() => setExpandedSection(expandedSection === 'categories' ? null : 'categories')}
              className="flex items-center justify-between w-full py-2 mb-2"
            >
              <span className="font-semibold">Categories</span>
              <FiChevronRight className={`h-4 w-4 transition-transform ${expandedSection === 'categories' ? 'rotate-90' : ''}`} />
            </button>
            {expandedSection === 'categories' && (
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.href}
                    onClick={onClose}
                    className="flex items-center gap-2 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 text-sm"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Secondary Links */}
          <nav className="p-4 border-b dark:border-neutral-800">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-3 px-4 rounded-xl mb-1 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <span>{link.label}</span>
                <FiChevronRight className="h-4 w-4 text-neutral-400" />
              </Link>
            ))}
          </nav>

          {/* Logout */}
          {isAuthenticated && (
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full py-3 px-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <FiLogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;