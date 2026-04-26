// src/pages/Wishlist.jsx
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, FiShoppingCart, FiTrash2, FiArrowRight, FiShare2, FiCheck,
  FiAlertCircle, FiGrid, FiList, FiTag, FiClock, FiTrendingUp,
  FiBookmark, FiMoreHorizontal, FiDownload, FiMail, FiBell,
  FiStar, FiDollarSign, FiRefreshCw, FiFilter, FiChevronDown,
  FiX, FiCopy, FiFacebook, FiTwitter, FiLinkedin, FiEye,
  FiPackage, FiTruck, FiShield, FiCalendar, FiBox
} from 'react-icons/fi';
import { useWishlist } from '../store/WishlistContext';
import { useCart } from '../store/CartContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

// Sort Options
const sortOptions = [
  { value: 'date-added', label: 'Latest Added', icon: FiClock },
  { value: 'price-low', label: 'Price: Low to High', icon: FiDollarSign },
  { value: 'price-high', label: 'Price: High to Low', icon: FiTrendingUp },
  { value: 'name', label: 'Name A-Z', icon: FiBookmark },
  { value: 'discount', label: 'Biggest Savings', icon: FiTag }
];

// Custom Dropdown Component
const CustomSelect = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find(opt => opt.value === value);
  const SelectedIcon = selectedOption?.icon;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-primary-300 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {SelectedIcon && <SelectedIcon className="h-4 w-4 text-primary-500" />}
        <span>{selectedOption?.label || label}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
          >
            {options.map((option) => {
              const OptionIcon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${value === option.value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}
                >
                  <OptionIcon className="h-4 w-4" />
                  <span className="flex-1 text-left">{option.label}</span>
                  {value === option.value && <FiCheck className="h-4 w-4" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Price Alert Modal
const PriceAlertModal = ({ isOpen, onClose, product, onSetAlert }) => {
  const [targetPrice, setTargetPrice] = useState('');
  const [alertMethod, setAlertMethod] = useState('email');

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Set Price Alert</h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Current Price</p>
            <p className="text-2xl font-bold text-primary-600">{formatPrice(product.price)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Alert me when price drops below
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Enter target price"
                className="w-full pl-8 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Notification Method
            </label>
            <div className="flex gap-2">
              {['email', 'sms', 'push'].map((method) => (
                <button
                  key={method}
                  onClick={() => setAlertMethod(method)}
                  className={`flex-1 py-2 px-3 rounded-lg capitalize ${alertMethod === method ? 'bg-primary-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <Button variant="primary" fullWidth onClick={() => {
            if (targetPrice && parseFloat(targetPrice) < product.price) {
              onSetAlert(product._id, parseFloat(targetPrice), alertMethod);
              toast.success(`Price alert set for ${formatPrice(parseFloat(targetPrice))}!`);
              onClose();
            } else {
              toast.error('Please enter a price lower than current price');
            }
          }}>
            Set Alert
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Share Modal
const ShareModal = ({ isOpen, onClose, wishlistData, stats }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/shared-wishlist/${wishlistData.id || 'temp'}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied to clipboard!');
  };

  const handleShare = (platform) => {
    const text = `Check out my wishlist! I have ${stats.totalItems} items worth ${formatPrice(stats.totalValue)} on FurniQo`;
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=My Wishlist on FurniQo&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Share Wishlist</h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Share via</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: FiFacebook, name: 'facebook', color: 'bg-[#1877f2]' },
                { icon: FiTwitter, name: 'twitter', color: 'bg-[#1da1f2]' },
                { icon: FiLinkedin, name: 'linkedin', color: 'bg-[#0a66c2]' },
                { icon: FiMail, name: 'email', color: 'bg-[#ea4335]' }
              ].map((platform) => (
                <button key={platform.name} onClick={() => handleShare(platform.name)} className={`${platform.color} w-full py-3 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity`}>
                  <platform.icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Or copy link</p>
            <div className="flex gap-2">
              <input type="text" value={shareUrl} readOnly className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm" />
              <Button variant="outline" onClick={handleCopy} icon={copied ? FiCheck : FiCopy}>{copied ? 'Copied!' : 'Copy'}</Button>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-xs text-neutral-500 text-center">Your wishlist contains {stats.totalItems} items • Total value {formatPrice(stats.totalValue)}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Bulk Actions Bar
const BulkActionsBar = ({ selectedCount, totalCount, onSelectAll, onMoveToCart, onClear, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-2xl"
    >
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button onClick={onSelectAll} className="text-sm font-semibold text-white hover:text-primary-100 transition-colors">
              {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-sm text-white/90">{selectedCount} item{selectedCount !== 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex gap-3">
            <Button variant="white" size="sm" onClick={onMoveToCart} disabled={selectedCount === 0} className="shadow-md">Move to Cart ({selectedCount})</Button>
            <Button variant="ghost" size="sm" onClick={onClear} className="text-white hover:bg-white/10">Clear</Button>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-white hover:bg-white/10">Cancel</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Product Card Component for Grid View
const ProductCard = ({ product, isSelected, onSelect, onMoveToCart, onRemove, onPriceAlert, isMoving, hasPriceAlert, isOutOfStock }) => {
  const discount = calculateDiscount(product.price, product.originalPrice);
  
  return (
    <motion.div
      layout
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, scale: 0.8 } }}
      whileHover={{ y: -4 }}
      className={`group relative bg-white dark:bg-neutral-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${isSelected ? "ring-2 ring-primary-500 shadow-lg shadow-primary-500/20" : ""}`}
    >
      {/* Select Checkbox */}
      <div className="absolute top-3 left-3 z-20">
        <button onClick={onSelect} className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center bg-white shadow-sm ${isSelected ? "bg-primary-500 border-primary-500 text-white shadow-md" : "border-neutral-300 hover:border-primary-400"}`}>
          {isSelected && <FiCheck className="h-4 w-4" />}
        </button>
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden bg-neutral-100 dark:bg-neutral-800 aspect-square">
        <img src={product.images?.[0] || '/api/placeholder/400/400'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
            <FiTag className="h-3 w-3" />-{discount}%
          </div>
        )}

        {hasPriceAlert && (
          <div className="absolute bottom-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
            <FiBell className="h-3 w-3 inline mr-1" />Alert Set
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center">
              <span className="bg-white text-neutral-900 px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg block mb-2">Out of Stock</span>
              <button onClick={(e) => { e.preventDefault(); onPriceAlert(); }} className="bg-primary-500 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-primary-600 transition-colors">Notify Me</button>
            </div>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col">
        <Link to={`/product/${product.slug}`} className="block mb-1">
          <h3 className="font-semibold text-sm text-neutral-900 dark:text-white line-clamp-2 hover:text-primary-600 transition-colors">{product.name}</h3>
        </Link>
        
        {product.category && (
          <div className="mb-2">
            <span className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full inline-block">{product.category}</span>
          </div>
        )}
        
        {product.rating && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (i < Math.floor(product.rating) ? <FiStar key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" /> : <FiStar key={i} className="h-3 w-3 text-neutral-300 dark:text-neutral-600" />))}
            </div>
            <span className="text-xs text-neutral-500">({product.numReviews || 0})</span>
          </div>
        )}

        <div className="mb-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (<span className="text-xs text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>)}
          </div>
        </div>

        <div className="mb-3">
          {product.inStock !== false ? (
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />In Stock
              {product.freeShipping && (<span className="flex items-center gap-1 ml-2 text-blue-600"><FiTruck className="h-3 w-3" />Free Shipping</span>)}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-red-600"><div className="w-1.5 h-1.5 rounded-full bg-red-500" />Out of Stock</div>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <Button variant={!isOutOfStock ? "primary" : "disabled"} size="sm" icon={FiShoppingCart} onClick={() => onMoveToCart()} disabled={isOutOfStock || isMoving} loading={isMoving} className="flex-grow text-xs">
            {isMoving ? 'Moving...' : !isOutOfStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          <Button variant="outline" size="sm" icon={FiBell} onClick={onPriceAlert} className={hasPriceAlert ? "text-yellow-600 border-yellow-300" : ""} title="Set price alert" />
          <Button variant="outline" size="sm" icon={FiTrash2} onClick={onRemove} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" />
        </div>
      </div>
    </motion.div>
  );
};

// Product Row Component for List View
const ProductRow = ({ product, isSelected, onSelect, onMoveToCart, onRemove, onPriceAlert, isMoving, hasPriceAlert, isOutOfStock }) => {
  const discount = calculateDiscount(product.price, product.originalPrice);
  
  return (
    <motion.div
      layout
      variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 } }}
      className={`group bg-white dark:bg-neutral-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${isSelected ? "ring-2 ring-primary-500" : ""}`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Select Checkbox */}
        <div className="absolute top-3 left-3 z-20 sm:relative sm:top-auto sm:left-auto sm:flex sm:items-center sm:px-4">
          <button onClick={onSelect} className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center bg-white shadow-sm ${isSelected ? "bg-primary-500 border-primary-500 text-white shadow-md" : "border-neutral-300 hover:border-primary-400"}`}>
            {isSelected && <FiCheck className="h-3 w-3" />}
          </button>
        </div>

        {/* Product Image */}
        <Link to={`/product/${product.slug}`} className="relative block overflow-hidden bg-neutral-100 dark:bg-neutral-800 w-28 h-28 sm:w-24 sm:h-24 flex-shrink-0 mx-auto mt-3 sm:mt-0 sm:mx-0 rounded-lg">
          <img src={product.images?.[0] || '/api/placeholder/400/400'} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          {discount > 0 && (<div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">-{discount}%</div>)}
        </Link>

        {/* Product Details */}
        <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link to={`/product/${product.slug}`} className="block mb-1"><h3 className="font-semibold text-sm text-neutral-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1">{product.name}</h3></Link>
            {product.category && (<span className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-full inline-block">{product.category}</span>)}
            {product.rating && (<div className="flex items-center gap-1 mt-1"><div className="flex items-center">{[...Array(5)].map((_, i) => (i < Math.floor(product.rating) ? <FiStar key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" /> : <FiStar key={i} className="h-3 w-3 text-neutral-300" />))}</div><span className="text-xs text-neutral-500">({product.numReviews || 0})</span></div>)}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="text-right"><span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</span>{product.originalPrice > product.price && (<span className="text-xs text-neutral-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>)}</div>
            <div className="flex items-center gap-2"><Button variant={!isOutOfStock ? "primary" : "disabled"} size="sm" icon={FiShoppingCart} onClick={() => onMoveToCart()} disabled={isOutOfStock || isMoving} loading={isMoving} className="text-xs">{isMoving ? 'Moving...' : !isOutOfStock ? 'Add' : 'Out'}</Button><Button variant="outline" size="sm" icon={FiBell} onClick={onPriceAlert} className={hasPriceAlert ? "text-yellow-600 border-yellow-300" : ""} /><Button variant="outline" size="sm" icon={FiTrash2} onClick={onRemove} className="text-red-600" /></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Wishlist Component
const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isMovingToCart, setIsMovingToCart] = useState({});
  const [isClearing, setIsClearing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(null);
  const [sortBy, setSortBy] = useState('date-added');
  const [filterInStock, setFilterInStock] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState({});
  const [wishlistName, setWishlistName] = useState('My Wishlist');
  const [isEditingName, setIsEditingName] = useState(false);

  const filteredItems = useMemo(() => {
    let items = [...wishlistItems];
    if (filterInStock) items = items.filter(item => item.inStock !== false);
    switch (sortBy) {
      case 'price-low': items.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case 'price-high': items.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'name': items.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
      case 'discount': items.sort((a, b) => { const da = ((a.originalPrice - a.price) / a.originalPrice) || 0; const db = ((b.originalPrice - b.price) / b.originalPrice) || 0; return db - da; }); break;
      default: items = [...items].reverse();
    }
    return items;
  }, [wishlistItems, filterInStock, sortBy]);

  const stats = useMemo(() => ({
    totalItems: wishlistItems.length,
    totalValue: wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0),
    totalSavings: wishlistItems.reduce((sum, item) => { if (item.originalPrice && item.originalPrice > (item.price || 0)) return sum + (item.originalPrice - (item.price || 0)); return sum; }, 0),
    inStockItems: wishlistItems.filter(item => item.inStock !== false).length,
    outOfStockItems: wishlistItems.filter(item => item.inStock === false).length,
    averagePrice: wishlistItems.length > 0 ? wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0) / wishlistItems.length : 0
  }), [wishlistItems]);

  useEffect(() => {
    const savedViewMode = localStorage.getItem('wishlist_view_mode');
    const savedSortBy = localStorage.getItem('wishlist_sort_by');
    const savedAlerts = localStorage.getItem('price_alerts');
    const savedName = localStorage.getItem('wishlist_name');
    if (savedViewMode) setViewMode(savedViewMode);
    if (savedSortBy) setSortBy(savedSortBy);
    if (savedAlerts) setPriceAlerts(JSON.parse(savedAlerts));
    if (savedName) setWishlistName(savedName);
  }, []);

  const saveViewMode = (mode) => { setViewMode(mode); localStorage.setItem('wishlist_view_mode', mode); };
  const saveSortBy = (sort) => { setSortBy(sort); localStorage.setItem('wishlist_sort_by', sort); };
  const saveWishlistName = (name) => { setWishlistName(name); localStorage.setItem('wishlist_name', name); setIsEditingName(false); toast.success('Wishlist name updated!'); };
  const setPriceAlert = (productId, targetPrice, method) => { const newAlerts = { ...priceAlerts, [productId]: { targetPrice, method, createdAt: new Date().toISOString() } }; setPriceAlerts(newAlerts); localStorage.setItem('price_alerts', JSON.stringify(newAlerts)); };

  const handleMoveToCart = async (product, quantity = 1) => {
    if (isMovingToCart[product._id]) return;
    setIsMovingToCart(prev => ({ ...prev, [product._id]: true }));
    try { await addToCart(product, quantity); removeFromWishlist(product._id); confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); toast.success(`${product.name} added to cart!`); } 
    catch (error) { toast.error('Failed to add to cart'); } 
    finally { setIsMovingToCart(prev => ({ ...prev, [product._id]: false })); }
  };

  const handleMoveAllToCart = async () => {
    if (wishlistItems.length === 0) return;
    const inStockItems = wishlistItems.filter(item => item.inStock !== false);
    if (inStockItems.length === 0) { toast.error('No items in stock available!'); return; }
    toast.loading(`Moving ${inStockItems.length} items to cart...`, { id: 'move-all' });
    try { for (const product of inStockItems) { await addToCart(product, 1); removeFromWishlist(product._id); } confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } }); toast.success(`Successfully moved ${inStockItems.length} items to cart!`, { id: 'move-all' }); } 
    catch (error) { toast.error('Failed to move some items', { id: 'move-all' }); }
  };

  const handleRemoveItem = (productId, productName) => { removeFromWishlist(productId); setSelectedItems(prev => prev.filter(id => id !== productId)); toast.success(`${productName} removed from wishlist`); };
  const handleSelectAll = () => { if (selectedItems.length === filteredItems.length) setSelectedItems([]); else setSelectedItems(filteredItems.map(item => item._id)); };

  const handleMoveSelectedToCart = async () => {
    const selectedProducts = filteredItems.filter(item => selectedItems.includes(item._id) && item.inStock !== false);
    if (selectedProducts.length === 0) { toast.error('No selected items are in stock!'); return; }
    toast.loading(`Moving ${selectedProducts.length} items to cart...`, { id: 'move-selected' });
    try { for (const product of selectedProducts) { await addToCart(product, 1); removeFromWishlist(product._id); } setSelectedItems([]); confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } }); toast.success(`${selectedProducts.length} items moved to cart!`, { id: 'move-selected' }); } 
    catch (error) { toast.error('Failed to move selected items', { id: 'move-selected' }); }
  };

  const handleExportWishlist = () => {
    const exportData = { name: wishlistName, exportDate: new Date().toISOString(), items: wishlistItems.map(item => ({ id: item._id, name: item.name, price: item.price, originalPrice: item.originalPrice, category: item.category, url: `${window.location.origin}/product/${item.slug}` })), stats };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${wishlistName.toLowerCase().replace(/\s/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a'); linkElement.setAttribute('href', dataUri); linkElement.setAttribute('download', exportFileDefaultName); linkElement.click();
    toast.success('Wishlist exported successfully!');
  };

  const handleRefresh = async () => { setIsRefreshing(true); await new Promise(resolve => setTimeout(resolve, 800)); setIsRefreshing(false); toast.success('Wishlist updated with latest prices!'); };
  const getWishlistId = useMemo(() => 'wl_' + Math.random().toString(36).substr(2, 9), []);

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <div className="w-full px-[1%] py-[1%]"><div className="max-w-7xl mx-auto">
          <EmptyState icon={FiHeart} title="Your wishlist is empty" description="Start saving your favorite furniture pieces and create your dream collection!" actionLabel="Explore Collection" actionHref="/products" />
          {/* Featured Categories */}
<div className="mt-20">
  <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[
      { name: 'Living Room', image: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=600&h=400&fit=crop', color: 'from-amber-600/80 to-orange-600/80' },
      { name: 'Bedroom', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop', color: 'from-purple-600/80 to-pink-600/80' },
      { name: 'Dining', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=400&fit=crop', color: 'from-emerald-600/80 to-teal-600/80' },
      { name: 'Office', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop', color: 'from-blue-600/80 to-cyan-600/80' }
    ].map((category) => (
      <Link
        key={category.name}
        to={`/products?category=${category.name.toLowerCase()}`}
        className="group relative overflow-hidden rounded-2xl aspect-square shadow-lg"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={category.image} 
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Dark Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
        </div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
          <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{category.name}</h3>
          <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Shop Now →</p>
        </div>
      </Link>
    ))}
  </div>
</div>
          <div className="mt-20 p-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl text-white"><div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"><div><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm"><FiBell className="h-6 w-6" /></div><h3 className="font-semibold mb-1">Price Drop Alerts</h3><p className="text-sm text-white/80">Get notified when your favorites go on sale</p></div><div><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm"><FiShare2 className="h-6 w-6" /></div><h3 className="font-semibold mb-1">Share Wishlist</h3><p className="text-sm text-white/80">Share with friends & family for gift ideas</p></div><div><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm"><FiTrendingUp className="h-6 w-6" /></div><h3 className="font-semibold mb-1">Smart Suggestions</h3><p className="text-sm text-white/80">Get personalized recommendations</p></div></div></div>
        </div></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="w-full px-[1%] py-[1%]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg shadow-primary-500/25"><FiHeart className="h-6 w-6 text-white" /></div>
                  <div className="flex-1">
                    {isEditingName ? (<div className="flex items-center gap-2"><input type="text" defaultValue={wishlistName} onKeyPress={(e) => { if (e.key === 'Enter') saveWishlistName(e.target.value); }} onBlur={(e) => saveWishlistName(e.target.value)} className="text-3xl lg:text-4xl font-bold bg-transparent border-b-2 border-primary-500 outline-none px-2" autoFocus /><button onClick={() => setIsEditingName(false)} className="p-1"><FiCheck className="h-5 w-5 text-green-500" /></button></div>) : (<div className="flex items-center gap-2"><h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white">{wishlistName}</h1><button onClick={() => setIsEditingName(true)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"><FiMoreHorizontal className="h-4 w-4 text-neutral-500" /></button></div>)}
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2"><FiCalendar className="h-3 w-3" />{stats.totalItems} {stats.totalItems === 1 ? 'item' : 'items'} • Last updated {new Date().toLocaleDateString()}</p>
                  </div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-wrap gap-3">
                <button onClick={handleRefresh} className={`p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 transition-all ${isRefreshing ? 'animate-spin' : ''}`} disabled={isRefreshing}><FiRefreshCw className="h-5 w-5 text-neutral-600" /></button>
                <button onClick={handleExportWishlist} className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 transition-all"><FiDownload className="h-5 w-5 text-neutral-600" /></button>
                <button onClick={() => setShowShareModal(true)} className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 transition-all"><FiShare2 className="h-5 w-5 text-neutral-600" /></button>
                <div className="flex bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-1">
                  <button onClick={() => saveViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary-500 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'}`}><FiGrid className="h-4 w-4" /></button>
                  <button onClick={() => saveViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary-500 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'}`}><FiList className="h-4 w-4" /></button>
                </div>
                <button onClick={() => setShowConfirmModal(true)} className="p-2.5 rounded-xl text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 transition-all"><FiTrash2 className="h-5 w-5" /></button>
              </motion.div>
            </div>

            {/* Stats Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-3 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all group"><div className="flex items-center justify-between"><div><p className="text-xs text-neutral-500 mb-0.5">Total Items</p><p className="text-xl font-bold text-neutral-900 dark:text-white">{stats.totalItems}</p></div><div className="p-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg group-hover:scale-110 transition-transform"><FiPackage className="h-4 w-4 text-primary-600" /></div></div></div>
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-3 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all group"><div className="flex items-center justify-between"><div><p className="text-xs text-neutral-500 mb-0.5">Total Value</p><p className="text-xl font-bold text-primary-600">{formatPrice(stats.totalValue)}</p></div><div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:scale-110 transition-transform"><FiDollarSign className="h-4 w-4 text-green-600" /></div></div></div>
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-3 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all group"><div className="flex items-center justify-between"><div><p className="text-xs text-neutral-500 mb-0.5">You Save</p><p className="text-xl font-bold text-green-600">{formatPrice(stats.totalSavings)}</p></div><div className="p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg group-hover:scale-110 transition-transform"><FiTag className="h-4 w-4 text-orange-600" /></div></div></div>
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-3 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all group"><div className="flex items-center justify-between"><div><p className="text-xs text-neutral-500 mb-0.5">In Stock</p><p className="text-xl font-bold text-neutral-900 dark:text-white">{stats.inStockItems}/{stats.totalItems}</p></div><div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform"><FiCheck className="h-4 w-4 text-blue-600" /></div></div></div>
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-3 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all group"><div className="flex items-center justify-between"><div><p className="text-xs text-neutral-500 mb-0.5">Price Alerts</p><p className="text-xl font-bold text-neutral-900 dark:text-white">{Object.keys(priceAlerts).length}</p></div><div className="p-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg group-hover:scale-110 transition-transform"><FiBell className="h-4 w-4 text-yellow-600" /></div></div></div>
            </motion.div>

            {/* Filters Bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <CustomSelect value={sortBy} onChange={saveSortBy} options={sortOptions} label="Sort by" />
                  <button onClick={() => setFilterInStock(!filterInStock)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterInStock ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 border-primary-300' : 'bg-white text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'} border`}><FiFilter className="h-4 w-4" />In Stock Only{filterInStock && (<span className="ml-1 px-1.5 py-0.5 bg-primary-200 dark:bg-primary-800 rounded-full text-xs">{stats.inStockItems}</span>)}</button>
                </div>
                <div className="text-sm text-neutral-500">Showing {filteredItems.length} of {stats.totalItems} items</div>
              </div>
            </motion.div>
          </div>

          {/* Move All Button */}
          {wishlistItems.length > 0 && stats.inStockItems > 0 && selectedItems.length === 0 && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8"><Button variant="primary" size="lg" icon={FiShoppingCart} onClick={handleMoveAllToCart} className="shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto">Move All to Cart<span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">{stats.inStockItems}</span></Button></motion.div>)}

          {/* Products Grid/List */}
          <motion.div
            key={viewMode + sortBy + filterInStock}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
            initial="hidden" animate="visible"
            className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" : "space-y-3"}
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((product) => {
                const isSelected = selectedItems.includes(product._id);
                const isMoving = isMovingToCart[product._id];
                const hasPriceAlert = priceAlerts[product._id];
                const isOutOfStock = product.inStock === false;
                
                return viewMode === 'grid' ? (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isSelected={isSelected}
                    onSelect={() => { if (isSelected) setSelectedItems(prev => prev.filter(id => id !== product._id)); else setSelectedItems(prev => [...prev, product._id]); }}
                    onMoveToCart={() => handleMoveToCart(product)}
                    onRemove={() => handleRemoveItem(product._id, product.name)}
                    onPriceAlert={() => setShowPriceAlert(product)}
                    isMoving={isMoving}
                    hasPriceAlert={hasPriceAlert}
                    isOutOfStock={isOutOfStock}
                  />
                ) : (
                  <ProductRow
                    key={product._id}
                    product={product}
                    isSelected={isSelected}
                    onSelect={() => { if (isSelected) setSelectedItems(prev => prev.filter(id => id !== product._id)); else setSelectedItems(prev => [...prev, product._id]); }}
                    onMoveToCart={() => handleMoveToCart(product)}
                    onRemove={() => handleRemoveItem(product._id, product.name)}
                    onPriceAlert={() => setShowPriceAlert(product)}
                    isMoving={isMoving}
                    hasPriceAlert={hasPriceAlert}
                    isOutOfStock={isOutOfStock}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Empty Filter State */}
          {filteredItems.length === 0 && wishlistItems.length > 0 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16"><div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4"><FiFilter className="h-12 w-12 text-neutral-400" /></div><h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">No items match your filters</h3><p className="text-neutral-600 dark:text-neutral-400 mb-6">Try adjusting your filter or sort criteria to see more items</p><div className="flex gap-3 justify-center">{filterInStock && (<Button variant="outline" onClick={() => setFilterInStock(false)}>Show All Items</Button>)}<Button variant="primary" onClick={() => { setFilterInStock(false); setSortBy('date-added'); }}>Reset All Filters</Button></div></motion.div>)}

          {/* Smart Recommendations */}
          {wishlistItems.length >= 2 && filteredItems.length > 0 && (<div className="mt-20 pt-8 border-t border-neutral-200 dark:border-neutral-800"><div className="flex items-center justify-between mb-8"><div><h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white">You Might Also Like</h2><p className="text-neutral-600 dark:text-neutral-400 mt-1">Based on your taste and trending items</p></div><Link to="/products" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 font-medium group">Browse All<FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{wishlistItems.slice(0, 4).map((product, idx) => (<motion.div key={`rec-${product._id}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300"><Link to={`/product/${product.slug}`} className="block overflow-hidden aspect-square"><img src={product.images?.[0] || '/api/placeholder/400/400'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></Link><div className="p-4"><Link to={`/product/${product.slug}`}><h3 className="font-semibold text-neutral-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1">{product.name}</h3></Link><p className="text-sm text-neutral-500 mt-1">{product.category || 'Uncategorized'}</p><div className="mt-3 flex items-center justify-between"><div><p className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</p>{product.originalPrice > product.price && (<p className="text-xs text-green-600">Save {formatPrice(product.originalPrice - product.price)}</p>)}</div><button onClick={() => handleMoveToCart(product)} className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 hover:bg-primary-100 transition-colors"><FiShoppingCart className="h-4 w-4" /></button></div></div></motion.div>))}</div></div>)}

        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showConfirmModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} /><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6"><div className="text-center mb-4"><div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"><FiAlertCircle className="h-8 w-8 text-red-500" /></div><h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Clear Wishlist?</h3><p className="text-neutral-600 dark:text-neutral-400">This action cannot be undone. All {stats.totalItems} items will be permanently removed.</p></div><div className="flex gap-3"><Button variant="ghost" onClick={() => setShowConfirmModal(false)} className="flex-1">Cancel</Button><Button variant="primary" onClick={async () => { setIsClearing(true); await clearWishlist(); setSelectedItems([]); toast.success('Wishlist cleared'); setShowConfirmModal(false); setIsClearing(false); }} loading={isClearing} className="flex-1 bg-red-600 hover:bg-red-700">Yes, Clear All</Button></div></motion.div></div>)}
        {showShareModal && (<ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} wishlistData={{ id: getWishlistId, items: wishlistItems }} stats={stats} />)}
        {showPriceAlert && (<PriceAlertModal isOpen={!!showPriceAlert} onClose={() => setShowPriceAlert(null)} product={showPriceAlert} onSetAlert={setPriceAlert} />)}
      </AnimatePresence>

      {/* Floating Bulk Actions */}
      <AnimatePresence>{selectedItems.length > 0 && (<BulkActionsBar selectedCount={selectedItems.length} totalCount={filteredItems.length} onSelectAll={handleSelectAll} onMoveToCart={handleMoveSelectedToCart} onClear={() => setSelectedItems([])} onCancel={() => setSelectedItems([])} />)}</AnimatePresence>
    </div>
  );
};

export default Wishlist;