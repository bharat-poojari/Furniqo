// src/pages/Offers.jsx
import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPercent, FiClock, FiTag, FiGrid, FiList, FiFilter,
  FiChevronDown, FiCheck, FiShoppingCart, FiHeart, FiShare2,
  FiEye, FiX, FiStar, FiTrendingUp, FiDollarSign, FiRefreshCw,
  FiArrowRight, FiPackage, FiMinus, FiPlus, FiZap, FiAlertCircle
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { useWishlist } from '../store/WishlistContext';
import { useCart } from '../store/CartContext';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import apiWrapper from '../services/apiWrapper';

// Simplified animation variants - minimal for scroll performance
const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
};

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.1 } },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.08 } },
};

// Constants
const SORT_OPTIONS = [
  { value: 'discount_desc', label: 'Highest Discount', icon: FiPercent },
  { value: 'price_asc',    label: 'Price: Low → High', icon: FiDollarSign },
  { value: 'price_desc',   label: 'Price: High → Low', icon: FiZap },
  { value: 'newest',       label: 'Newest', icon: FiClock },
];

// Helpers
const calcDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

const calcSavings = (price, originalPrice) =>
  originalPrice && originalPrice > price ? originalPrice - price : 0;

// Share Product
const shareProduct = async (product) => {
  const url = `${window.location.origin}/products/${product.slug}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: product.name, text: `Check out ${product.name} on sale!`, url });
      toast.success('Shared successfully!');
    } catch (e) {
      if (e.name !== 'AbortError') {
        try { await navigator.clipboard.writeText(url); toast.success('Link copied!'); } catch {}
      }
    }
  } else {
    try { await navigator.clipboard.writeText(url); toast.success('Link copied!'); } catch {}
  }
};

// Fixed Lazy Image Component with Intersection Observer
const LazyImage = memo(({ src, alt, className, onLoad, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [srcToLoad, setSrcToLoad] = useState(priority ? src : null);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // If priority, load immediately
    if (priority) {
      setSrcToLoad(src);
      return;
    }

    // Create intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSrcToLoad(src);
            observerRef.current?.disconnect();
          }
        });
      },
      { rootMargin: '200px', threshold: 0.01 }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [src, priority]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-700">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={srcToLoad || undefined}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

// Memoized Custom Dropdown
const CustomSelect = memo(({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.value === value);
  const SelIcon = selected?.icon;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);
  const handleSelect = useCallback((optValue) => {
    onChange(optValue);
    setIsOpen(false);
  }, [onChange]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-primary-300 transition-colors"
      >
        {SelIcon && <SelIcon className="h-3 w-3 text-primary-500" />}
        <span>{selected?.label}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
          <FiChevronDown className="h-3 w-3" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.08 }}
            className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
          >
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span className="flex-1 text-left">{opt.label}</span>
                  {isSelected && <FiCheck className="h-3 w-3" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CustomSelect.displayName = 'CustomSelect';

// Memoized Countdown Timer
const CountdownTimer = memo(() => {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 5, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = useCallback(n => String(n).padStart(2, '0'), []);

  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded text-white font-bold">{v}</span>
          {i < 2 && <span className="text-white/70">:</span>}
        </span>
      ))}
    </div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

// Optimized Offer Card – Grid View
const OfferCardGrid = memo(({ product, onAddToCart, onQuickView, onWishlistToggle, isWishlisted, isAdding, priority = false }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const discount = calcDiscount(product.price, product.originalPrice);
  const savings = calcSavings(product.price, product.originalPrice);
  const inWishlist = isWishlisted(product._id);
  const isHotDeal = discount >= 35;

  const handleAdd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  }, [onAddToCart, product]);
  
  const handleQuick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  }, [onQuickView, product]);
  
  const handleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle(product);
  }, [onWishlistToggle, product]);
  
  const handleShare = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    shareProduct(product);
  }, [product]);

  const imageUrl = product.images?.[0] || 'https://placehold.co/400x400/eee/999?text=No+Image';

  return (
    <div className="group relative bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-150 h-full flex flex-col border border-neutral-200 dark:border-neutral-700 will-change-transform">
      {/* Image container */}
      <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-700 aspect-square contain-paint">
        <LazyImage
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onLoad={() => setImgLoaded(true)}
          priority={priority}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg">
              -{discount}%
            </div>
          )}
          {isHotDeal && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
              <FaFire className="h-2 w-2" /> Hot
            </div>
          )}
        </div>

        {/* Out of stock overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="bg-white text-neutral-900 px-2 py-1 rounded-full text-xs font-semibold">Out of Stock</span>
          </div>
        )}

        {/* Quick actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={handleQuick}
            className="p-1.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow-md hover:scale-105 transition-transform duration-150 inline-flex items-center justify-center w-7 h-7"
            title="Quick View"
          >
            <FiEye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleWishlist}
            className="p-1.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow-md hover:scale-105 transition-transform duration-150 inline-flex items-center justify-center w-7 h-7"
            title="Wishlist"
          >
            <FiHeart className={`h-3.5 w-3.5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow-md hover:scale-105 transition-transform duration-150 inline-flex items-center justify-center w-7 h-7"
            title="Share"
          >
            <FiShare2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Info */}
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
            <span className="text-[9px] text-neutral-500">({product.numReviews || 0})</span>
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

        <div className="mt-auto pt-2 border-t border-neutral-100 dark:border-neutral-700">
          <button
            onClick={handleAdd}
            disabled={product.inStock === false || isAdding}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-[10px] font-semibold shadow transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? (
              <><span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
            ) : product.inStock === false ? 'Out of Stock' : (
              <><FiShoppingCart className="h-3 w-3" /> Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

OfferCardGrid.displayName = 'OfferCardGrid';

// Optimized Offer Row – List View
const OfferRow = memo(({ product, onAddToCart, onQuickView, onWishlistToggle, isWishlisted, isAdding }) => {
  const discount = calcDiscount(product.price, product.originalPrice);
  const savings = calcSavings(product.price, product.originalPrice);
  const inWishlist = isWishlisted(product._id);

  const handleAdd = useCallback(() => onAddToCart(product), [onAddToCart, product]);
  const handleQuick = useCallback(() => onQuickView(product), [onQuickView, product]);
  const handleWishlist = useCallback(() => onWishlistToggle(product), [onWishlistToggle, product]);
  const handleShare = useCallback(() => shareProduct(product), [product]);

  const imageUrl = product.images?.[0] || 'https://placehold.co/400x400/eee/999?text=No+Image';

  return (
    <div className="group bg-white dark:bg-neutral-800 rounded-xl hover:shadow-lg transition-shadow duration-150 overflow-hidden border border-neutral-200 dark:border-neutral-700 will-change-transform">
      <div className="flex gap-3 p-3">
        <Link to={`/products/${product.slug}`} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-neutral-100">
          <LazyImage
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-150"
          />
          {discount > 0 && <div className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">-{discount}%</div>}
          {product.inStock === false && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="bg-white text-neutral-900 px-1.5 py-0.5 rounded-full text-[9px] font-semibold">Out</span></div>}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link to={`/products/${product.slug}`}>
                <h3 className="font-semibold text-sm hover:text-primary-600 truncate">{product.name}</h3>
              </Link>
              {product.category && <span className="text-[10px] text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded-full inline-block mt-0.5">{product.category}</span>}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={handleQuick} className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 transition-colors w-7 h-7 inline-flex items-center justify-center" title="Quick View"><FiEye className="h-3.5 w-3.5" /></button>
              <button onClick={handleWishlist} className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-red-100 transition-colors w-7 h-7 inline-flex items-center justify-center" title="Wishlist">
                <FiHeart className={`h-3.5 w-3.5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button onClick={handleShare} className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 transition-colors w-7 h-7 inline-flex items-center justify-center" title="Share"><FiShare2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1.5 overflow-hidden flex-nowrap">
              <span className="text-sm font-bold text-primary-600 whitespace-nowrap">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && <span className="text-[9px] text-neutral-400 line-through whitespace-nowrap">{formatPrice(product.originalPrice)}</span>}
              {savings > 0 && <span className="text-[9px] text-green-600 font-medium whitespace-nowrap">Save {formatPrice(savings)}</span>}
            </div>

            <button
              onClick={handleAdd}
              disabled={product.inStock === false || isAdding}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-[10px] font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <><span className="h-2.5 w-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
              ) : product.inStock === false ? 'Out' : (
                <><FiShoppingCart className="h-3 w-3" /> Add to Cart</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

OfferRow.displayName = 'OfferRow';

// Quick View Modal
const QuickViewModal = memo(({ product, isOpen, onClose, addToCart, isWishlisted, toggleWishlist }) => {
  const [qty, setQty] = useState(1);
  const [selImg, setSelImg] = useState(0);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!isOpen) { 
      setQty(1); 
      setSelImg(0); 
      setAdding(false); 
      setAdded(false); 
    }
  }, [isOpen]);

  const discount = product ? calcDiscount(product.price, product.originalPrice) : 0;
  const inWishlist = product ? isWishlisted(product._id) : false;

  const handleQuantityChange = useCallback((delta) => {
    setQty(prev => Math.max(1, prev + delta));
  }, []);

  const handleAdd = useCallback(async () => {
    if (!product || adding) return;
    setAdding(true);
    try {
      await addToCart(product, qty);
      setAdded(true);
      confetti({ particleCount: 50, spread: 40, origin: { y: 0.6 } });
      toast.success(`${qty} × ${product.name} added to cart!`);
      setTimeout(() => { 
        setAdded(false); 
        onClose(); 
      }, 1000);
    } catch { 
      toast.error('Failed to add to cart'); 
    } finally { 
      setAdding(false); 
    }
  }, [product, adding, addToCart, qty, onClose]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 z-10">
              <FiX className="h-5 w-5 text-neutral-500" />
            </button>

            <div className="p-6 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 aspect-square">
                    <img
                      src={product.images?.[selImg] || 'https://placehold.co/500x500/eee/999?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {discount > 0 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                        -{discount}% OFF
                      </div>
                    )}
                  </div>
                  {product.images?.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {product.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelImg(i)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            selImg === i ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-transparent hover:border-neutral-300'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">{product.name}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 4.5) ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-500">({product.numReviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-lg text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-5">
                    {product.shortDescription || product.description?.substring(0, 150) || 'No description available.'}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAdd}
                      disabled={product.inStock === false || adding}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 transition-all"
                    >
                      {adding ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding...
                        </span>
                      ) : added ? (
                        <span className="flex items-center justify-center gap-2"><FiCheck className="h-5 w-5" /> Added!</span>
                      ) : (
                        <span className="flex items-center justify-center gap-2"><FiShoppingCart className="h-5 w-5" /> Add to Cart</span>
                      )}
                    </button>
                    <button onClick={() => toggleWishlist(product)} className="p-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 hover:border-red-500 transition-colors">
                      <FiHeart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

QuickViewModal.displayName = 'QuickViewModal';

// Main Offers Component
const Offers = () => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('discount_desc');
  const [filterInStock, setFilterInStock] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const abortRef = useRef(null);

  const getMockData = useCallback(() => [
    { _id: '1', name: 'Modern Sofa', price: 49999, originalPrice: 79999, images: ['https://placehold.co/400x400/eee/999?text=Sofa'], slug: 'modern-sofa', rating: 4.5, numReviews: 128, inStock: true, category: 'Living Room' },
    { _id: '2', name: 'Dining Table Set', price: 29999, originalPrice: 49999, images: ['https://placehold.co/400x400/eee/999?text=Dining+Table'], slug: 'dining-table-set', rating: 4.8, numReviews: 95, inStock: true, category: 'Dining' },
    { _id: '3', name: 'Ergonomic Chair', price: 14999, originalPrice: 24999, images: ['https://placehold.co/400x400/eee/999?text=Chair'], slug: 'ergonomic-chair', rating: 4.7, numReviews: 210, inStock: true, category: 'Office' },
    { _id: '4', name: 'Queen Bed Frame', price: 34999, originalPrice: 49999, images: ['https://placehold.co/400x400/eee/999?text=Bed'], slug: 'queen-bed-frame', rating: 4.6, numReviews: 73, inStock: false, category: 'Bedroom' },
    { _id: '5', name: 'Wardrobe Cabinet', price: 24999, originalPrice: 39999, images: ['https://placehold.co/400x400/eee/999?text=Wardrobe'], slug: 'wardrobe-cabinet', rating: 4.4, numReviews: 58, inStock: true, category: 'Bedroom' },
    { _id: '6', name: 'Coffee Table', price: 9999, originalPrice: 14999, images: ['https://placehold.co/400x400/eee/999?text=Coffee+Table'], slug: 'coffee-table', rating: 4.3, numReviews: 142, inStock: true, category: 'Living Room' },
    { _id: '7', name: 'Bookshelf Unit', price: 7999, originalPrice: 12999, images: ['https://placehold.co/400x400/eee/999?text=Bookshelf'], slug: 'bookshelf-unit', rating: 4.5, numReviews: 89, inStock: true, category: 'Storage' },
    { _id: '8', name: 'Standing Desk', price: 19999, originalPrice: 34999, images: ['https://placehold.co/400x400/eee/999?text=Desk'], slug: 'standing-desk', rating: 4.9, numReviews: 301, inStock: true, category: 'Office' },
    { _id: '9', name: 'Leather Recliner', price: 59999, originalPrice: 89999, images: ['https://placehold.co/400x400/eee/999?text=Recliner'], slug: 'leather-recliner', rating: 4.7, numReviews: 156, inStock: true, category: 'Living Room' },
    { _id: '10', name: 'Study Table', price: 7999, originalPrice: 14999, images: ['https://placehold.co/400x400/eee/999?text=Study+Table'], slug: 'study-table', rating: 4.4, numReviews: 89, inStock: true, category: 'Office' },
    { _id: '11', name: 'Night Stand', price: 4999, originalPrice: 8999, images: ['https://placehold.co/400x400/eee/999?text=Night+Stand'], slug: 'night-stand', rating: 4.3, numReviews: 67, inStock: true, category: 'Bedroom' },
    { _id: '12', name: 'Shoe Rack', price: 2999, originalPrice: 5999, images: ['https://placehold.co/400x400/eee/999?text=Shoe+Rack'], slug: 'shoe-rack', rating: 4.2, numReviews: 124, inStock: true, category: 'Storage' },
  ], []);

  const fetchOffers = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const res = await apiWrapper.getProducts({ onSale: true, discount: true, limit: 50, sort: 'discount_desc' });
      let data = [];
      if (res?.data?.success && res?.data?.data) data = res.data.data;
      else if (res?.success && res?.data) data = res.data;
      else if (res?.data && Array.isArray(res.data)) data = res.data;
      else if (Array.isArray(res)) data = res;

      const onSale = data.filter(p => p.discount || (p.originalPrice && p.originalPrice > p.price));
      setProducts(onSale.length ? onSale : getMockData());
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError('Failed to load offers. Please try again.');
        setProducts(getMockData());
      }
    } finally {
      setLoading(false);
    }
  }, [getMockData]);

  useEffect(() => { 
    fetchOffers(); 
    return () => abortRef.current?.abort(); 
  }, [fetchOffers]);

  const displayProducts = useMemo(() => {
    let items = [...products];
    if (filterInStock) items = items.filter(p => p.inStock !== false);
    switch (sortBy) {
      case 'price_asc':    items.sort((a, b) => a.price - b.price); break;
      case 'price_desc':   items.sort((a, b) => b.price - a.price); break;
      case 'newest':       items.reverse(); break;
      default: items.sort((a, b) => calcDiscount(b.price, b.originalPrice) - calcDiscount(a.price, a.originalPrice));
    }
    return items;
  }, [products, sortBy, filterInStock]);

  const stats = useMemo(() => {
    const discounts = products.map(p => calcDiscount(p.price, p.originalPrice)).filter(d => d > 0);
    return {
      total: products.length,
      avgDisc: discounts.length ? Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length) : 0,
      maxDisc: discounts.length ? Math.max(...discounts) : 0,
      inStock: products.filter(p => p.inStock !== false).length,
    };
  }, [products]);

  const handleAddToCart = useCallback(async (product) => {
    if (isAddingToCart[product._id]) return;
    setIsAddingToCart(prev => ({ ...prev, [product._id]: true }));
    try {
      await addToCart(product, 1);
      confetti({ particleCount: 40, spread: 40, origin: { y: 0.6 } });
      toast.success(`${product.name} added to cart!`);
    } catch { 
      toast.error('Failed to add to cart'); 
    } finally { 
      setIsAddingToCart(prev => ({ ...prev, [product._id]: false })); 
    }
  }, [addToCart, isAddingToCart]);

  const handleQuickView = useCallback((product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  }, []);

  const handleWishlistToggle = useCallback((product) => {
    toggleWishlist(product);
  }, [toggleWishlist]);

  const toggleStockFilter = useCallback(() => {
    setFilterInStock(prev => !prev);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
        <div className="w-full px-3 sm:px-4 py-3 sm:py-6">
          <div className="max-w-7xl mx-auto">
            <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 animate-pulse">
                  <div className="aspect-square bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                    <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg mt-3" />
                  </div>
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
          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-orange-700 mb-6">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
            <div className="relative p-6 lg:p-8 text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-3">
                <FiPercent className="h-6 w-6" />
                <span className="text-sm font-semibold uppercase tracking-wider bg-white/20 rounded-full px-4 py-1 backdrop-blur-sm">
                  Limited Time Offers
                </span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold mb-3">
                Up to <span>{stats.maxDisc > 0 ? `${stats.maxDisc}%` : '40%'} Off</span>
              </h1>
              <p className="text-base text-red-100 max-w-xl mx-auto mb-5">
                Incredible savings on premium furniture. Don't miss out on these exclusive deals!
              </p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <FiClock className="h-4 w-4 opacity-80" />
                <span className="opacity-80 text-xs">Deals end in:</span>
                <CountdownTimer />
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-5">
            {[
              { icon: FiPackage, label: 'Total Offers', value: stats.total, color: 'text-primary-500' },
              { icon: FiPercent, label: 'Avg Discount', value: `${stats.avgDisc}%`, color: 'text-orange-500' },
              { icon: FiZap, label: 'Max Discount', value: `${stats.maxDisc}%`, color: 'text-red-500' },
              { icon: FiCheck, label: 'In Stock', value: stats.inStock, color: 'text-green-500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white dark:bg-neutral-800 rounded-lg p-2 sm:p-3 border border-neutral-200 dark:border-neutral-700 text-center">
                <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${color} mx-auto mb-0.5`} />
                <p className="text-[9px] sm:text-[10px] text-neutral-500 hidden sm:block">{label}</p>
                <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-1.5">
              <CustomSelect value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
              <button
                onClick={toggleStockFilter}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  filterInStock
                    ? 'bg-primary-50 text-primary-700 border-primary-300 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-700'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <FiFilter className="h-3 w-3" />
                In Stock
                {filterInStock && <span className="ml-0.5 px-1 bg-primary-200 dark:bg-primary-800 rounded-full text-[9px] text-primary-800 dark:text-primary-200">{stats.inStock}</span>}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mr-1">
                {displayProducts.length} offer{displayProducts.length !== 1 ? 's' : ''}
              </span>
              <div className="flex bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all inline-flex items-center justify-center w-7 h-7 ${viewMode === 'grid' ? 'bg-primary-500 text-white shadow' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  <FiGrid className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all inline-flex items-center justify-center w-7 h-7 ${viewMode === 'list' ? 'bg-primary-500 text-white shadow' : 'text-neutral-600 dark:text-neutral-400'}`}
                >
                  <FiList className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-2xl mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiAlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-red-600 dark:text-red-400 mb-4 font-medium">{error}</p>
              <button
                onClick={fetchOffers}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors inline-flex items-center gap-2"
              >
                <FiRefreshCw className="h-4 w-4" /> Try Again
              </button>
            </div>
          )}

          {/* Products Grid/List */}
          {!error && displayProducts.length > 0 && (
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4' : 'space-y-2'}`}>
              {displayProducts.map((product, idx) => (
                viewMode === 'grid' ? (
                  <OfferCardGrid
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onWishlistToggle={handleWishlistToggle}
                    isWishlisted={isWishlisted}
                    isAdding={isAddingToCart[product._id]}
                    priority={idx < 4}
                  />
                ) : (
                  <OfferRow
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onWishlistToggle={handleWishlistToggle}
                    isWishlisted={isWishlisted}
                    isAdding={isAddingToCart[product._id]}
                  />
                )
              ))}
            </div>
          )}

          {/* Empty State */}
          {!error && !loading && displayProducts.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <FiTag className="h-10 w-10 text-neutral-400" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                {filterInStock && products.length > 0 ? 'No In-Stock Offers' : 'No Active Offers'}
              </h2>
              <div className="flex gap-3 justify-center mt-6">
                {filterInStock && (
                  <button onClick={toggleStockFilter} className="px-5 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    Show All
                  </button>
                )}
                <Link to="/products" className="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all inline-flex items-center gap-2">
                  <FiArrowRight className="h-4 w-4" /> Browse Products
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewOpen}
        onClose={() => { setQuickViewOpen(false); setQuickViewProduct(null); }}
        addToCart={addToCart}
        isWishlisted={isWishlisted}
        toggleWishlist={toggleWishlist}
      />
    </div>
  );
};

export default Offers;