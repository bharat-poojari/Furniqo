// src/pages/Wishlist.jsx
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, FiShoppingCart, FiTrash2, FiArrowRight, FiShare2, FiCheck,
  FiAlertCircle, FiGrid, FiList, FiTag, FiClock, FiTrendingUp,
  FiBookmark, FiDownload, FiMail, FiBell,
  FiStar, FiDollarSign, FiRefreshCw, FiFilter, FiChevronDown,
  FiX, FiCopy, FiFacebook, FiTwitter, FiLinkedin, FiEye,
  FiPackage, FiTruck, FiShield, FiCalendar, FiBox, FiMinus, FiPlus
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useWishlist } from '../store/WishlistContext';
import { useCart } from '../store/CartContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import apiWrapper from '../services/apiWrapper';

// Sort Options
const sortOptions = [
  { value: 'date-added', label: 'Latest Added', icon: FiClock },
  { value: 'price-low', label: 'Price: Low to High', icon: FiDollarSign },
  { value: 'price-high', label: 'Price: High to Low', icon: FiTrendingUp },
  { value: 'name', label: 'Name A-Z', icon: FiBookmark },
  { value: 'discount', label: 'Biggest Savings', icon: FiTag }
];

// Custom Dropdown Component
const CustomSelect = ({ value, onChange, options }) => {
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
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-primary-300 transition-all"
      >
        {SelectedIcon && <SelectedIcon className="h-3 w-3 text-primary-500" />}
        <span>{selectedOption?.label}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown className="h-3 w-3" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
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
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${value === option.value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}
                >
                  <OptionIcon className="h-3 w-3" />
                  <span className="flex-1 text-left">{option.label}</span>
                  {value === option.value && <FiCheck className="h-3 w-3" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Share Modal with Native Share
const ShareModal = ({ isOpen, onClose, stats }) => {
  const shareUrl = window.location.href;
  const shareTitle = 'My Wishlist on Furniqo';
  const shareText = `Check out my wishlist! I have ${stats.totalItems} items worth ${formatPrice(stats.totalValue)}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
        onClose();
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Share failed. Copying link instead.');
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
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
          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              <FiShare2 className="h-5 w-5" />
              Share via...
            </button>
          )}

          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Share via social media</p>
            <div className="grid grid-cols-4 gap-3">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="bg-[#1877f2] p-3 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-all"><FiFacebook className="h-5 w-5" /></a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="bg-[#1da1f2] p-3 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-all"><FiTwitter className="h-5 w-5" /></a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="bg-[#0a66c2] p-3 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-all"><FiLinkedin className="h-5 w-5" /></a>
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="bg-[#25d366] p-3 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-all"><FaWhatsapp className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Or copy link</p>
            <div className="flex gap-2">
              <input type="text" value={shareUrl} readOnly className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm" />
              <Button variant="outline" onClick={handleCopyLink} icon={FiCopy}>Copy</Button>
            </div>
          </div>

          <p className="text-xs text-neutral-500 text-center pt-2 border-t dark:border-neutral-800">
            {stats.totalItems} items • Total {formatPrice(stats.totalValue)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Price Alert Modal
const PriceAlertModal = ({ isOpen, onClose, product, onSetAlert }) => {
  const [targetPrice, setTargetPrice] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTargetPrice('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Set Price Alert</h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
            <FiX className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Current Price</p>
            <p className="text-2xl font-bold text-primary-600">{formatPrice(product.price)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Alert me when price drops below
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">$</span>
              <input 
                type="number" 
                value={targetPrice} 
                onChange={(e) => setTargetPrice(e.target.value)} 
                placeholder="Enter target price" 
                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500"
                autoFocus
              />
            </div>
          </div>
          <Button 
            variant="primary" 
            fullWidth 
            onClick={() => { 
              if (targetPrice && parseFloat(targetPrice) < product.price) { 
                onSetAlert(product._id, parseFloat(targetPrice)); 
                toast.success(`Alert set for ${formatPrice(parseFloat(targetPrice))}!`); 
                onClose(); 
              } else { 
                toast.error('Enter a lower price than current'); 
              } 
            }}
          >
            Set Alert
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Share function for individual product
const shareProduct = async (product) => {
  const shareUrl = `${window.location.origin}/products/${product.slug}`;
  const shareTitle = product.name;
  const shareText = `Check out ${product.name} on Furniqo!`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
      toast.success('Shared successfully!');
    } catch (error) {
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!');
        } catch (err) {
          toast.error('Failed to share');
        }
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  }
};

// QuickView Modal Component
const QuickViewModal = ({ product, isOpen, onClose, addToCart, isWishlisted, toggleWishlist }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuantity(1);
      setSelectedImage(0);
      setIsAddingToCart(false);
      setAddedToCart(false);
    }
  }, [isOpen]);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const newQuantity = prev + delta;
      if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
        return newQuantity;
      }
      return prev;
    });
  };

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
      setAddedToCart(true);
      
      toast.success(`${quantity} × ${product.name} added to cart!`, {
        icon: '🛒',
        duration: 1500,
      });
      
      setTimeout(() => {
        setAddedToCart(false);
        onClose();
      }, 1200);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistClick = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

  const handleShare = () => {
    if (product) {
      shareProduct(product);
    }
  };

  if (!product) return null;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const rating = product.rating || 4.5;
  const reviewCount = product.numReviews || 128;
  const categoryName = product.category;
  const inWishlist = isWishlisted(product._id);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-10"
            >
              <FiX className="h-5 w-5 text-neutral-500" />
            </button>
            
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Image Gallery */}
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={product.images?.[selectedImage] || 'https://via.placeholder.com/500x500?text=No+Image'}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                    
                    {discount > 0 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                        -{discount}% OFF
                      </div>
                    )}
                  </div>
                  
                  {product.images && product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                            selectedImage === idx 
                              ? 'border-primary-500 ring-2 ring-primary-500/20' 
                              : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} view ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                  {categoryName && (
                    <span className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2 inline-block">
                      {categoryName}
                    </span>
                  )}

                  <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(rating)
                              ? 'fill-yellow-500 text-yellow-500'
                              : i < rating
                              ? 'fill-yellow-500 text-yellow-500 opacity-50'
                              : 'text-neutral-300 dark:text-neutral-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {rating} ({reviewCount} reviews)
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      ${product.price?.toLocaleString() || 0}
                    </span>
                  </div>

                  <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed text-sm">
                    {product.shortDescription || product.description?.substring(0, 150) || 'No description available.'}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {product.stock > 0 
                          ? `In Stock (${product.stock} available)` 
                          : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {product.stock > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                          className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <FiMinus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-lg">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= product.stock}
                          className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <FiPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || isAddingToCart}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isAddingToCart ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding...
                        </div>
                      ) : addedToCart ? (
                        <div className="flex items-center justify-center gap-2">
                          <FiCheck className="h-5 w-5" />
                          Added to Cart!
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <FiShoppingCart className="h-5 w-5" />
                          Add to Cart - ${((product.price || 0) * quantity).toLocaleString()}
                        </div>
                      )}
                    </button>

                    <button
                      onClick={handleWishlistClick}
                      className="p-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 transition-all"
                    >
                      <FiHeart
                        className={`h-5 w-5 transition-colors ${
                          inWishlist
                            ? 'fill-red-500 text-red-500' 
                            : 'text-neutral-600 dark:text-neutral-400'
                        }`}
                      />
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
                    >
                      <FiShare2 className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">SKU:</span>
                        <span className="ml-2 text-neutral-700 dark:text-neutral-300">
                          {product.sku || product._id?.slice(-8).toUpperCase() || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">Category:</span>
                        <span className="ml-2 text-neutral-700 dark:text-neutral-300 capitalize">
                          {categoryName || 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Product Row for List View
const ProductRow = ({ product, onMoveToCart, onRemove, onQuickView, onShare, onPriceAlert, isMoving, isOutOfStock, hasPriceAlert, setShowRemoveConfirm, setProductToRemove }) => {
  const discount = calculateDiscount(product.price, product.originalPrice);
  const savings = product.originalPrice && product.originalPrice > product.price ? product.originalPrice - product.price : 0;
  
  const handleRemoveClick = () => {
    setProductToRemove({ id: product._id, name: product.name });
    setShowRemoveConfirm(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group bg-white dark:bg-neutral-800 rounded-xl hover:shadow-lg transition-all overflow-hidden border border-neutral-200 dark:border-neutral-700"
    >
      <div className="flex gap-3 p-3">
        {/* Product Image */}
        <Link to={`/products/${product.slug}`} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-neutral-100">
          <img src={product.images?.[0] || 'https://placehold.co/400x400/eee/999?text=No+Image'} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          {discount > 0 && (<div className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">-{discount}%</div>)}
          {hasPriceAlert && (<div className="absolute bottom-1 left-1 bg-yellow-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full"><FiBell className="h-2 w-2 inline mr-0.5" /></div>)}
          {isOutOfStock && (<div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="bg-white text-neutral-900 px-1.5 py-0.5 rounded-full text-[9px] font-semibold">Out</span></div>)}
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link to={`/products/${product.slug}`}>
                <h3 className="font-semibold text-sm hover:text-primary-600 truncate">{product.name}</h3>
              </Link>
              {product.category && (<span className="text-[10px] text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded-full inline-block mt-0.5">{product.category}</span>)}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={onQuickView} className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 transition-colors inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }} title="Quick View"><FiEye className="h-3.5 w-3.5" /></button>
              <button onClick={onShare} className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 transition-colors inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }} title="Share"><FiShare2 className="h-3.5 w-3.5" /></button>
              <button onClick={handleRemoveClick} className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-red-100 transition-colors inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }} title="Remove"><FiTrash2 className="h-3.5 w-3.5 text-red-500" /></button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1.5 overflow-hidden flex-nowrap">
              <span className="text-sm font-bold text-primary-600 whitespace-nowrap flex-shrink-0">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-[9px] text-neutral-400 line-through whitespace-nowrap flex-shrink-0">{formatPrice(product.originalPrice)}</span>
              )}
              {savings > 0 && (
                <span className="text-[9px] text-green-600 font-medium whitespace-nowrap flex-shrink-0">Save {formatPrice(savings)}</span>
              )}
            </div>

            <div className="flex gap-1.5">
              <Button variant={!isOutOfStock ? "primary" : "disabled"} size="xs" icon={FiShoppingCart} onClick={() => onMoveToCart()} disabled={isOutOfStock || isMoving} loading={isMoving} className="text-[10px] py-1.5 px-2">{isMoving ? 'Adding...' : !isOutOfStock ? 'Add' : 'Out'}</Button>
              <button onClick={onPriceAlert} className={`p-1.5 rounded-lg border inline-flex items-center justify-center transition-all ${hasPriceAlert ? "text-yellow-600 border-yellow-300 bg-yellow-50" : "border-neutral-200 bg-white dark:bg-neutral-800 hover:border-primary-300"}`} style={{ width: '28px', height: '28px' }}><FiBell className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Product Card for Grid View
const ProductCardGrid = ({ product, onMoveToCart, onRemove, onQuickView, onShare, onPriceAlert, isMoving, isOutOfStock, hasPriceAlert, setShowRemoveConfirm, setProductToRemove }) => {
  const discount = calculateDiscount(product.price, product.originalPrice);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  const handleRemoveClick = () => {
    setProductToRemove({ id: product._id, name: product.name });
    setShowRemoveConfirm(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-700 aspect-square">
        {!imageLoaded && <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 animate-pulse" />}
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400/eee/999?text=No+Image'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-lg z-10">
            -{discount}%
          </div>
        )}

        {hasPriceAlert && !discount && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-md z-10">
            <FiBell className="h-2 w-2 inline mr-0.5" />Alert
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="bg-white text-neutral-900 px-2 py-1 rounded-full text-xs font-semibold">Out of Stock</span>
          </div>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }} className="p-1.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-all inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }} title="Quick View"><FiEye className="h-3.5 w-3.5" /></button>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShare(); }} className="p-1.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-all inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }} title="Share"><FiShare2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div className="p-2.5 flex flex-col flex-grow">
        <Link to={`/products/${product.slug}`} className="block mb-1">
          <h3 className="font-semibold text-xs text-neutral-900 dark:text-white hover:text-primary-600 transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        
        {product.rating && (
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`h-2 w-2 ${i < Math.floor(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-300'}`} />
              ))}
            </div>
            <span className="text-[8px] text-neutral-500 truncate">({product.numReviews || 0})</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 overflow-hidden flex-nowrap mb-1">
          <span className="text-sm font-bold text-primary-600 whitespace-nowrap flex-shrink-0">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-[9px] text-neutral-400 line-through whitespace-nowrap flex-shrink-0">{formatPrice(product.originalPrice)}</span>
          )}
          {savings > 0 && (
            <span className="text-[9px] text-green-600 font-medium whitespace-nowrap flex-shrink-0">Save {formatPrice(savings)}</span>
          )}
        </div>

        <div className="flex gap-1.5 mt-auto pt-1.5 border-t border-neutral-100 dark:border-neutral-700">
          <Button variant={!isOutOfStock ? "primary" : "disabled"} size="xs" icon={FiShoppingCart} onClick={() => onMoveToCart()} disabled={isOutOfStock || isMoving} loading={isMoving} className="flex-1 text-[10px] py-1.5">
            {isMoving ? 'Adding...' : !isOutOfStock ? 'Add to Cart' : 'Out'}
          </Button>
          <button onClick={onPriceAlert} className={`p-1.5 rounded-lg border inline-flex items-center justify-center transition-all ${hasPriceAlert ? "text-yellow-600 border-yellow-300 bg-yellow-50" : "border-neutral-200 bg-white dark:bg-neutral-800 hover:border-primary-300"}`} style={{ width: '32px', height: '32px' }}><FiBell className="h-3.5 w-3.5" /></button>
          <button onClick={handleRemoveClick} className="p-1.5 rounded-lg border border-neutral-200 bg-white dark:bg-neutral-800 hover:border-red-300 hover:bg-red-50 transition-all inline-flex items-center justify-center" style={{ width: '32px', height: '32px' }}><FiTrash2 className="h-3.5 w-3.5 text-red-500" /></button>
        </div>
      </div>

      {isHovered && !isMobile && (
        <div className="absolute inset-0 rounded-xl pointer-events-none ring-2 ring-primary-500/50 transition-all duration-150" />
      )}
    </motion.div>
  );
};

// Related Product Card Component (Compact for horizontal scroll) - WITH FIXED ADD TO CART
const RelatedProductCard = ({ product, onAddToCart, onQuickView, onWishlistToggle, isWishlisted, isAddingToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;
  const inWishlist = isWishlisted(product._id);

  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle(product);
  };

  return (
    <div className="group relative bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-200 h-full flex flex-col border border-neutral-200 dark:border-neutral-700">
      <Link to={`/products/${product.slug}`} className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-700 aspect-square block">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 animate-pulse" />
        )}
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400/eee/999?text=No+Image'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {discount > 0 && (
          <div className="absolute top-1 left-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-sm shadow-lg z-10">
            -{discount}%
          </div>
        )}
      </Link>

      <div className="p-2 flex flex-col flex-grow">
        <Link to={`/products/${product.slug}`} className="block mb-0.5">
          <h3 className="font-medium text-[11px] text-neutral-900 dark:text-white hover:text-primary-600 transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        
        {product.rating && (
          <div className="flex items-center gap-0.5 mb-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`h-1.5 w-1.5 ${i < Math.floor(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-300'}`} />
              ))}
            </div>
            <span className="text-[6px] text-neutral-500 truncate">({product.numReviews || 0})</span>
          </div>
        )}

        <div className="flex items-center gap-1 overflow-hidden flex-nowrap mb-1">
          <span className="text-[11px] font-bold text-primary-600 whitespace-nowrap flex-shrink-0">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-[7px] text-neutral-400 line-through whitespace-nowrap flex-shrink-0">{formatPrice(product.originalPrice)}</span>
          )}
          {savings > 0 && (
            <span className="text-[7px] text-green-600 font-medium whitespace-nowrap flex-shrink-0">Save {formatPrice(savings)}</span>
          )}
        </div>

        <div className="flex gap-1 mt-auto pt-1">
          <button
            onClick={handleAddClick}
            disabled={isAddingToCart}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-1 rounded-md text-[9px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1"
          >
            {isAddingToCart ? (
              <>
                <div className="h-2.5 w-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <FiShoppingCart className="h-2.5 w-2.5" />
                Add
              </>
            )}
          </button>
          <button
            onClick={handleQuickViewClick}
            className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 transition-colors inline-flex items-center justify-center"
            style={{ width: '24px', height: '24px' }}
            title="Quick View"
          >
            <FiEye className="h-2.5 w-2.5" />
          </button>
          <button
            onClick={handleWishlistClick}
            className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-700 hover:bg-red-100 transition-colors inline-flex items-center justify-center"
            style={{ width: '24px', height: '24px' }}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <FiHeart className={`h-2.5 w-2.5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Related Products Horizontal Scroll Component with API integration
const RelatedProductsHorizontal = ({ wishlistItems, onAddToCart, onQuickView, onWishlistToggle, isWishlisted, isAddingToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchRelatedProducts = useCallback(async () => {
    if (!wishlistItems || wishlistItems.length === 0) {
      if (isMountedRef.current) setLoading(false);
      return;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    
    try {
      const firstProductId = wishlistItems[0]?._id;
      
      let productsData = [];
      
      if (firstProductId) {
        const response = await apiWrapper.getRelatedProducts(firstProductId, 10);
        
        if (!isMountedRef.current) return;
        
        if (response?.data?.success && response.data.data) {
          productsData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          productsData = response.data;
        } else if (Array.isArray(response)) {
          productsData = response;
        }
      }
      
      const wishlistIds = new Set(wishlistItems.map(item => item._id));
      const filteredProducts = productsData.filter(p => !wishlistIds.has(p._id));
      
      setProducts(filteredProducts.slice(0, 10));
    } catch (error) {
      if (isMountedRef.current && error.name !== 'AbortError' && error.name !== 'CanceledError') {
        console.error('Error fetching related products:', error);
        setProducts([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [wishlistItems]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [fetchRelatedProducts]);

  if (loading) {
    return (
      <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">You Might Also Like</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-40 sm:w-44 flex-shrink-0">
                <div className="bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-lg aspect-square"></div>
                <div className="mt-2 h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                <div className="mt-1 h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">You Might Also Like</h2>
        <Link to="/products" className="text-primary-600 text-xs flex items-center gap-0.5 hover:underline">
          View All <FiArrowRight className="h-3 w-3" />
        </Link>
      </div>
      
      <div className="overflow-x-auto overflow-y-hidden pb-3 -mx-3 px-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex gap-3 w-max">
          {products.map((product) => (
            <div key={product._id} className="w-40 sm:w-44 flex-shrink-0">
              <RelatedProductCard 
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onWishlistToggle={onWishlistToggle}
                isWishlisted={isWishlisted}
                isAddingToCart={isAddingToCart[product._id]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Remove Confirm Modal
const RemoveConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-2xl"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiTrash2 className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            Remove Item?
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Are you sure you want to remove <span className="font-medium">{productName}</span> from your wishlist?
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700">
              Remove
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Wishlist Component
const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [viewMode, setViewMode] = useState('grid');
  const [isMovingToCart, setIsMovingToCart] = useState({});
  const [isClearing, setIsClearing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(null);
  const [sortBy, setSortBy] = useState('date-added');
  const [filterInStock, setFilterInStock] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState({});
  const [wishlistName, setWishlistName] = useState('My Wishlist');
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAddingToCartRelated, setIsAddingToCartRelated] = useState({});
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);

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
  }), [wishlistItems]);

  useEffect(() => {
    const savedViewMode = localStorage.getItem('wishlist_view_mode');
    const savedSortBy = localStorage.getItem('wishlist_sort_by');
    const savedAlerts = localStorage.getItem('price_alerts');
    if (savedViewMode) setViewMode(savedViewMode);
    if (savedSortBy) setSortBy(savedSortBy);
    if (savedAlerts) setPriceAlerts(JSON.parse(savedAlerts));
  }, []);

  const saveViewMode = (mode) => { setViewMode(mode); localStorage.setItem('wishlist_view_mode', mode); };
  const saveSortBy = (sort) => { setSortBy(sort); localStorage.setItem('wishlist_sort_by', sort); };
  const setPriceAlert = (productId, targetPrice) => { const newAlerts = { ...priceAlerts, [productId]: { targetPrice, createdAt: new Date().toISOString() } }; setPriceAlerts(newAlerts); localStorage.setItem('price_alerts', JSON.stringify(newAlerts)); };

  const handleMoveToCart = async (product) => {
    if (isMovingToCart[product._id]) return;
    setIsMovingToCart(prev => ({ ...prev, [product._id]: true }));
    try { 
      await addToCart(product, 1); 
      removeFromWishlist(product._id); 
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); 
      toast.success(`${product.name} added to cart!`);
    } 
    catch (error) { 
      toast.error('Failed to add to cart'); 
    } 
    finally { 
      setIsMovingToCart(prev => ({ ...prev, [product._id]: false })); 
    }
  };

  const handleAddToCartRelated = async (product) => {
    if (isAddingToCartRelated[product._id]) return;
    setIsAddingToCartRelated(prev => ({ ...prev, [product._id]: true }));
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCartRelated(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const handleMoveAllToCart = async () => {
    const inStockItems = wishlistItems.filter(item => item.inStock !== false);
    if (inStockItems.length === 0) { toast.error('No items in stock available!'); return; }
    toast.loading(`Moving ${inStockItems.length} items to cart...`, { id: 'move-all' });
    try { 
      for (const product of inStockItems) { 
        await addToCart(product, 1); 
        removeFromWishlist(product._id); 
      } 
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } }); 
      toast.success(`Successfully moved ${inStockItems.length} items to cart!`, { id: 'move-all' });
    } 
    catch (error) { 
      toast.error('Failed to move some items', { id: 'move-all' }); 
    }
  };

  const handleRemoveItem = () => {
    if (productToRemove) {
      removeFromWishlist(productToRemove.id);
      toast.success(`${productToRemove.name} removed from wishlist`);
      setShowRemoveConfirm(false);
      setProductToRemove(null);
    }
  };
  
  const handleClearWishlist = async () => { 
    setIsClearing(true); 
    await clearWishlist(); 
    toast.success('Wishlist cleared'); 
    setShowConfirmModal(false); 
    setIsClearing(false);
  };
  
  const handleQuickView = (product) => { 
    setSelectedProductForQuickView(product); 
    setIsQuickViewOpen(true); 
  };
  
  const handleShare = (product) => {
    shareProduct(product);
  };

  const handleWishlistToggle = (product) => {
    toggleWishlist(product);
  };

  const features = [
    { icon: FiBell, title: 'Price Drop Alerts', description: 'Get notified when your favorites go on sale' },
    { icon: FiShare2, title: 'Share Wishlist', description: 'Share with friends & family for gift ideas' },
    { icon: FiTrendingUp, title: 'Smart Suggestions', description: 'Get personalized recommendations' }
  ];

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <EmptyState icon={FiHeart} title="Your wishlist is empty" description="Start saving your favorite furniture pieces and create your dream collection!" actionLabel="Explore Collection" actionHref="/products" />
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-neutral-900 dark:text-white mb-0.5">{feature.title}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full px-3 sm:px-4 py-3 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg"><FiHeart className="h-4 w-4 sm:h-5 sm:w-5 text-white" /></div>
                <div><h1 className="text-base sm:text-xl font-bold">{wishlistName}</h1><p className="text-[10px] sm:text-xs text-neutral-500">{stats.totalItems} items</p></div>
              </div>

              <div className="flex items-center gap-1.5">
                <button onClick={() => setShowShareModal(true)} className="p-1.5 rounded-xl bg-white dark:bg-neutral-800 border shadow-sm inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }}><FiShare2 className="h-3.5 w-3.5" /></button>
                <button onClick={() => setShowConfirmModal(true)} className="p-1.5 rounded-xl text-red-600 bg-red-50 border border-red-200 inline-flex items-center justify-center" style={{ width: '28px', height: '28px' }}><FiTrash2 className="h-3.5 w-3.5" /></button>
                <div className="flex bg-white dark:bg-neutral-800 rounded-xl border p-0.5">
                  <button onClick={() => saveViewMode('grid')} className={`p-1.5 rounded-lg transition inline-flex items-center justify-center ${viewMode === 'grid' ? 'bg-primary-500 text-white shadow' : 'text-neutral-600'}`} style={{ width: '28px', height: '28px' }}><FiGrid className="h-3 w-3" /></button>
                  <button onClick={() => saveViewMode('list')} className={`p-1.5 rounded-lg transition inline-flex items-center justify-center ${viewMode === 'list' ? 'bg-primary-500 text-white shadow' : 'text-neutral-600'}`} style={{ width: '28px', height: '28px' }}><FiList className="h-3 w-3" /></button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mt-3">
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2.5 border text-center">
                <FiPackage className="h-3 w-3 text-primary-500 mx-auto" />
                <p className="text-[9px] sm:text-[10px] text-neutral-500 hidden sm:block">Items</p>
                <p className="text-xs sm:text-sm font-bold">{stats.totalItems}</p>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2.5 border text-center">
                <FiDollarSign className="h-3 w-3 text-green-600 mx-auto" />
                <p className="text-[9px] sm:text-[10px] text-neutral-500 hidden sm:block">Value</p>
                <p className="text-xs sm:text-sm font-bold text-primary-600">{formatPrice(stats.totalValue)}</p>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2.5 border text-center">
                <FiTag className="h-3 w-3 text-orange-600 mx-auto" />
                <p className="text-[9px] sm:text-[10px] text-neutral-500 hidden sm:block">Save</p>
                <p className="text-xs sm:text-sm font-bold text-green-600">{formatPrice(stats.totalSavings)}</p>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2.5 border text-center">
                <FiCheck className="h-3 w-3 text-blue-600 mx-auto" />
                <p className="text-[9px] sm:text-[10px] text-neutral-500 hidden sm:block">Stock</p>
                <p className="text-xs sm:text-sm font-bold">{stats.inStockItems}/{stats.totalItems}</p>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-1.5 sm:p-2.5 border text-center">
                <FiBell className="h-3 w-3 text-yellow-600 mx-auto" />
                <p className="text-[9px] sm:text-[10px] text-neutral-500 hidden sm:block">Alerts</p>
                <p className="text-xs sm:text-sm font-bold">{Object.keys(priceAlerts).length}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-1.5">
              <CustomSelect value={sortBy} onChange={saveSortBy} options={sortOptions} />
              <button onClick={() => setFilterInStock(!filterInStock)} className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition border ${filterInStock ? 'bg-primary-50 text-primary-700 border-primary-300' : 'bg-white text-neutral-600 border-neutral-200'}`}>
                <FiFilter className="h-3 w-3" />In Stock{filterInStock && <span className="ml-0.5 px-1 bg-primary-200 rounded-full text-[9px]">{stats.inStockItems}</span>}
              </button>
            </div>
            {stats.inStockItems > 0 && <Button variant="primary" size="xs" icon={FiShoppingCart} onClick={handleMoveAllToCart} className="text-xs py-1.5">Move All ({stats.inStockItems})</Button>}
          </div>

          <div className={`${viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4" : "space-y-2"}`}>
            <AnimatePresence mode="popLayout">
              {filteredItems.map((product) => (
                viewMode === 'grid' ? (
                  <ProductCardGrid
                    key={product._id}
                    product={product}
                    onMoveToCart={() => handleMoveToCart(product)}
                    onRemove={() => handleRemoveItem()}
                    onQuickView={() => handleQuickView(product)}
                    onShare={() => handleShare(product)}
                    onPriceAlert={() => setShowPriceAlert(product)}
                    isMoving={isMovingToCart[product._id]}
                    isOutOfStock={product.inStock === false}
                    hasPriceAlert={priceAlerts[product._id]}
                    setShowRemoveConfirm={setShowRemoveConfirm}
                    setProductToRemove={setProductToRemove}
                  />
                ) : (
                  <ProductRow
                    key={product._id}
                    product={product}
                    onMoveToCart={() => handleMoveToCart(product)}
                    onRemove={() => handleRemoveItem()}
                    onQuickView={() => handleQuickView(product)}
                    onShare={() => handleShare(product)}
                    onPriceAlert={() => setShowPriceAlert(product)}
                    isMoving={isMovingToCart[product._id]}
                    isOutOfStock={product.inStock === false}
                    hasPriceAlert={priceAlerts[product._id]}
                    setShowRemoveConfirm={setShowRemoveConfirm}
                    setProductToRemove={setProductToRemove}
                  />
                )
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && wishlistItems.length > 0 && (
            <div className="text-center py-12"><div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3"><FiFilter className="h-8 w-8 text-neutral-400" /></div><h3 className="text-base font-semibold mb-1">No items match</h3><p className="text-xs text-neutral-500 mb-4">Try adjusting your filters</p><div className="flex gap-2 justify-center"><Button variant="outline" size="sm" onClick={() => setFilterInStock(false)}>Show All</Button><Button variant="primary" size="sm" onClick={() => { setFilterInStock(false); setSortBy('date-added'); }}>Reset</Button></div></div>
          )}

          <RelatedProductsHorizontal 
            wishlistItems={wishlistItems}
            onAddToCart={handleAddToCartRelated}
            onQuickView={handleQuickView}
            onWishlistToggle={handleWishlistToggle}
            isWishlisted={isWishlisted}
            isAddingToCart={isAddingToCartRelated}
          />
        </div>
      </div>

      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-xl p-5">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiAlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-base font-semibold mb-1 text-neutral-900 dark:text-white">Clear Wishlist?</h3>
                <p className="text-xs text-neutral-500 mb-4">{stats.totalItems} items will be removed</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowConfirmModal(false)} className="flex-1">Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleClearWishlist} loading={isClearing} className="flex-1 bg-red-600 hover:bg-red-700">Clear All</Button>
              </div>
            </motion.div>
          </div>
        )}
        {showShareModal && <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} stats={stats} />}
        {showPriceAlert && <PriceAlertModal isOpen={!!showPriceAlert} onClose={() => setShowPriceAlert(null)} product={showPriceAlert} onSetAlert={setPriceAlert} />}
        <RemoveConfirmModal 
          isOpen={showRemoveConfirm}
          onClose={() => {
            setShowRemoveConfirm(false);
            setProductToRemove(null);
          }}
          onConfirm={handleRemoveItem}
          productName={productToRemove?.name || ''}
        />
      </AnimatePresence>

      <QuickViewModal
        product={selectedProductForQuickView}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedProductForQuickView(null);
        }}
        addToCart={addToCart}
        isWishlisted={isWishlisted}
        toggleWishlist={toggleWishlist}
      />
    </div>
  );
};

export default Wishlist;