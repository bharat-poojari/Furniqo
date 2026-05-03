import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiShoppingCart, FiHeart, FiMinus, FiPlus, FiTruck, FiShield, 
  FiRotateCcw, FiShare2, FiCheck, FiAlertCircle, FiChevronLeft, 
  FiTag, FiInfo, FiStar, FiPackage, FiClock, FiDollarSign,
  FiEye, FiX, FiArrowRight
} from 'react-icons/fi';
import ProductImages from '../components/product/ProductImages';
import ProductVariants from '../components/product/ProductVariants';
import ProductReviews from '../components/product/ProductReviews';
import Rating from '../components/common/Rating';
import Badge from '../components/common/Badge';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import { useCart } from '../store/CartContext';
import { useWishlist } from '../store/WishlistContext';
import { useRecentlyViewed } from '../store/RecentlyViewedContext';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import { cn } from '../utils/cn';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'description', label: 'Description', icon: FiInfo },
  { id: 'specifications', label: 'Specs', icon: FiTag },
  { id: 'reviews', label: 'Reviews', icon: FiStar },
];

// Share Modal Component
const ShareModal = ({ isOpen, onClose, product }) => {
  const shareUrl = window.location.href;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name} on Furniqo!`,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
        onClose();
      } catch (error) {
        if (error.name !== 'AbortError') {
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
      toast.success('Link copied!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  if (!isOpen || !product) return null;

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
        className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-xl shadow-2xl p-4"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">Share Product</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95">
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <FiShare2 className="h-4 w-4" />
              Share via...
            </button>
          )}

          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5">Or copy link</p>
            <div className="flex gap-2">
              <input type="text" value={shareUrl} readOnly className="flex-1 px-2 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg" />
              <Button variant="outline" size="xs" onClick={handleCopyLink} className="text-xs py-1.5 px-3">Copy</Button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t dark:border-neutral-800">
            <img src={product.images?.[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{product.name}</p>
              <p className="text-xs font-bold text-primary-600">{formatPrice(product.price)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// QuickView Modal for Related Products
const QuickViewModal = ({ product, isOpen, onClose, onAddToCart, isWishlisted, onWishlistToggle }) => {
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
      if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) return newQuantity;
      return prev;
    });
  };

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart(product, quantity);
      setAddedToCart(true);
      toast.success(`${quantity} × ${product.name} added!`, { icon: '🛒', duration: 1500 });
      setTimeout(() => { setAddedToCart(false); onClose(); }, 1200);
    } catch (error) {
      toast.error('Failed to add');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.originalPrice);
  const inWishlist = isWishlisted(product._id);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[85vh] flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-white/90 dark:bg-neutral-800/90 hover:bg-neutral-100 active:scale-95 transition-all"
            >
              <FiX className="h-4 w-4" />
            </button>
            
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image Gallery */}
                <div className="space-y-2">
                  <div className="relative overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={product.images?.[selectedImage] || 'https://via.placeholder.com/400x400?text=No+Image'}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                        -{discount}%
                      </div>
                    )}
                  </div>
                  {product.images?.length > 1 && (
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === idx ? 'border-primary-500' : 'border-transparent hover:border-neutral-300'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col space-y-3">
                  <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-white line-clamp-2">
                    {product.name}
                  </h3>

                  <Rating value={product.rating || 0} numReviews={product.numReviews || 0} size="sm" />

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="text-xs text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                        <span className="text-[10px] font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                          Save {formatPrice(product.originalPrice - product.price)}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3">
                    {product.shortDescription || product.description?.substring(0, 100)}
                  </p>

                  {product.stock > 0 && (
                    <div>
                      <label className="text-xs font-medium text-neutral-700 mb-1 block">Qty:</label>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-1.5 rounded-lg border disabled:opacity-50 active:scale-95">
                          <FiMinus className="h-3 w-3" />
                        </button>
                        <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
                        <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock} className="p-1.5 rounded-lg border disabled:opacity-50 active:scale-95">
                          <FiPlus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || isAddingToCart}
                      className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold text-sm active:scale-98 transition-all disabled:opacity-50"
                    >
                      {isAddingToCart ? (
                        <div className="flex items-center justify-center gap-1">
                          <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding...
                        </div>
                      ) : addedToCart ? (
                        <div className="flex items-center justify-center gap-1">
                          <FiCheck className="h-3.5 w-3.5" />
                          Added!
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <FiShoppingCart className="h-3.5 w-3.5" />
                          Add - {formatPrice((product.price || 0) * quantity)}
                        </div>
                      )}
                    </button>

                    <button onClick={() => onWishlistToggle(product)} className="p-2 rounded-lg border-2 active:scale-95 transition-all">
                      <FiHeart className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
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
};

// Related Products Horizontal Scroll Component (matching Wishlist pattern)
const RelatedProductsHorizontal = ({ productId, category, onAddToCart, onQuickView, onWishlistToggle, isWishlisted, isAddingToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const fetchRelatedProducts = useCallback(async () => {
    if (!productId) {
      if (isMountedRef.current) setLoading(false);
      return;
    }
    
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setLoading(true);
    
    try {
      const response = await apiWrapper.getRelatedProducts(productId, 10);
      if (!isMountedRef.current) return;
      
      let productsData = [];
      if (response?.data?.success && response.data.data) productsData = response.data.data;
      else if (response?.data && Array.isArray(response.data)) productsData = response.data;
      else if (Array.isArray(response)) productsData = response;
      
      setProducts(productsData.slice(0, 10));
    } catch (error) {
      if (isMountedRef.current && error.name !== 'AbortError') {
        console.error('Error fetching related:', error);
        setProducts([]);
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [fetchRelatedProducts]);

  if (loading) {
    return (
      <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mb-3">You May Also Like</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-32 sm:w-36 flex-shrink-0">
              <div className="bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-lg aspect-square" />
              <div className="mt-1.5 h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
              <div className="mt-1 h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">You May Also Like</h2>
        <Link to="/products" className="text-primary-600 text-xs flex items-center gap-0.5 hover:underline">
          View All <FiArrowRight className="h-3 w-3" />
        </Link>
      </div>
      
      <div className="overflow-x-auto overflow-y-hidden pb-2 -mx-3 px-3 scrollbar-hide">
        <div className="flex gap-2 w-max">
          {products.map((product) => {
            const discount = calculateDiscount(product.price, product.originalPrice);
            const inWishlist = isWishlisted(product._id);
            
            return (
              <div key={product._id} className="w-32 sm:w-36 flex-shrink-0">
                <div className="group relative bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow hover:shadow-md transition-all border border-neutral-200 dark:border-neutral-700">
                  <Link to={`/products/${product.slug}`} className="relative overflow-hidden bg-neutral-100 aspect-square block">
                    <img
                      src={product.images?.[0] || '/images/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {discount > 0 && (
                      <div className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-sm shadow">
                        -{discount}%
                      </div>
                    )}
                  </Link>

                  <div className="p-2">
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="font-medium text-[10px] sm:text-xs text-neutral-900 dark:text-white hover:text-primary-600 truncate">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {product.rating > 0 && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={`h-1.5 w-1.5 ${i < Math.floor(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-300'}`} />
                          ))}
                        </div>
                        <span className="text-[6px] text-neutral-500">({product.numReviews || 0})</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[11px] sm:text-xs font-bold text-primary-600">{formatPrice(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-[8px] text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>

                    <div className="flex gap-1 mt-1.5">
                      <button
                        onClick={() => onAddToCart(product)}
                        disabled={isAddingToCart[product._id]}
                        className="flex-1 bg-primary-600 text-white py-1 rounded-md text-[9px] font-medium transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isAddingToCart[product._id] ? (
                          <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                        ) : (
                          'Add'
                        )}
                      </button>
                      <button
                        onClick={() => onQuickView(product)}
                        className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 transition-colors active:scale-95"
                      >
                        <FiEye className="h-2.5 w-2.5" />
                      </button>
                      <button
                        onClick={() => onWishlistToggle(product)}
                        className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-700 hover:bg-red-100 transition-colors active:scale-95"
                      >
                        <FiHeart className={`h-2.5 w-2.5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const reviewSectionRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [addingToCartRelated, setAddingToCartRelated] = useState({});
  
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Scroll to top on mount/slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    setQuantity(1);
    setSelectedVariant(null);
    setActiveTab('description');
    setAddedToCart(false);
    setError(null);
    if (abortControllerRef.current) abortControllerRef.current.abort();
  }, [slug]);

  const fetchProduct = useCallback(async () => {
    if (!slug || !isMountedRef.current) return;
    
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiWrapper.getProduct(slug);
      if (!isMountedRef.current) return;
      
      if (response?.data?.success && response?.data?.data) {
        const productData = response.data.data;
        setProduct(productData);
        addToRecentlyViewed(productData);
      } else if (response?.data?._id) {
        setProduct(response.data);
        addToRecentlyViewed(response.data);
      } else {
        setError('Product not found');
        toast.error('Product not found');
      }
    } catch (error) {
      if (isMountedRef.current && error.name !== 'AbortError') {
        setError('Failed to load product');
        toast.error('Failed to load product');
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [slug, addToRecentlyViewed]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    const handleScroll = () => {
      if (isMountedRef.current) setIsStickyVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const discount = useMemo(() => {
    if (!product) return 0;
    return calculateDiscount(product.price, product.originalPrice);
  }, [product]);
  
  const currentPrice = useMemo(() => {
    if (selectedVariant?.price) return selectedVariant.price;
    return product?.price || 0;
  }, [selectedVariant, product]);
  
  const inWishlist = useMemo(() => {
    return product ? isWishlisted(product._id) : false;
  }, [product, isWishlisted]);
  
  const inStock = useMemo(() => {
    if (selectedVariant) return selectedVariant.stock > 0;
    return product?.inStock || (product?.stock > 0);
  }, [selectedVariant, product]);

  const handleAddToCart = useCallback(async () => {
    if (!inStock || !product || addingToCart) {
      if (!inStock) toast.error('Out of stock');
      return;
    }
    
    setAddingToCart(true);
    try {
      await addToCart(product, quantity, selectedVariant);
      setAddedToCart(true);
      toast.success(`${quantity} × ${product.name} added!`);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      toast.error('Failed to add');
    } finally {
      setAddingToCart(false);
    }
  }, [product, quantity, selectedVariant, inStock, addToCart, addingToCart]);

  const handleAddToCartRelated = useCallback(async (product, qty = 1) => {
    if (addingToCartRelated[product._id]) return;
    setAddingToCartRelated(prev => ({ ...prev, [product._id]: true }));
    try {
      await addToCart(product, qty);
      toast.success(`${product.name} added!`);
    } catch (error) {
      toast.error('Failed to add');
    } finally {
      setAddingToCartRelated(prev => ({ ...prev, [product._id]: false }));
    }
  }, [addToCart, addingToCartRelated]);

  const handleQuantityChange = useCallback((delta) => {
    setQuantity(prev => {
      const newValue = prev + delta;
      if (newValue < 1) return 1;
      if (newValue > (selectedVariant?.stock || product?.stock || 10)) return selectedVariant?.stock || product?.stock || 10;
      return newValue;
    });
  }, [selectedVariant, product]);

  const handleBuyNow = useCallback(async () => {
    if (!inStock || !product) return;
    await addToCart(product, quantity, selectedVariant);
    navigate('/cart');
  }, [product, quantity, selectedVariant, inStock, addToCart, navigate]);

  const handleWishlistToggle = useCallback(() => {
    if (product) toggleWishlist(product);
  }, [product, toggleWishlist]);

  const handleQuickView = useCallback((product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-950 min-h-screen">
        <div className="w-full px-3 sm:px-4 py-3">
          <div className="animate-pulse">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mb-3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
              <div className="space-y-3">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                <div className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FiAlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">{error || 'Product Not Found'}</h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">The product doesn't exist or was removed.</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline" size="sm" icon={FiChevronLeft}>Back</Button>
            <Link to="/products"><Button size="sm" icon={FiPackage}>Browse</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950">
      <div className="w-full px-3 sm:px-4 py-3">
        {/* Breadcrumb - Responsive */}
        <div className="mb-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Main Product Info - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Product Images */}
          <ProductImages images={product.images || []} name={product.name} />

          {/* Product Details - Reduced text sizes for mobile */}
          <div className="space-y-3">
            {/* Badges - Smaller on mobile */}
            <div className="flex flex-wrap gap-1.5">
              {product.newArrival && <Badge variant="new" size="xs">New</Badge>}
              {product.bestSeller && <Badge variant="featured" size="xs">Bestseller</Badge>}
              {discount > 0 && <Badge variant="sale" size="xs">-{discount}%</Badge>}
              {!inStock && <Badge variant="danger" size="xs">Out of Stock</Badge>}
              {inStock && product.stock <= 10 && product.stock > 0 && (
                <Badge variant="warning" size="xs">Only {product.stock} left</Badge>
              )}
            </div>

            {/* SKU & Category - Smaller text */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-neutral-500">
              <span>SKU: {product.sku || product._id?.slice(-8).toUpperCase()}</span>
              {product.category && (
                <span className="flex items-center gap-0.5">
                  <FiTag className="h-2.5 w-2.5" />
                  {typeof product.category === 'object' ? product.category.name : product.category}
                </span>
              )}
            </div>

            {/* Title - Smaller on mobile */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white">
              {product.name}
            </h1>

            {/* Rating - Compact */}
            <div className="flex items-center gap-2">
              <Rating value={product.rating || 0} numReviews={product.numReviews || 0} size="sm" />
              <button 
                onClick={() => setActiveTab('reviews')} 
                className="text-[10px] text-primary-600 hover:text-primary-700"
              >
                ({product.numReviews || 0})
              </button>
            </div>

            {/* Price - Smaller on mobile */}
            <div className="flex items-baseline gap-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3">
              <span className="text-xl sm:text-2xl font-bold text-primary-600">{formatPrice(currentPrice)}</span>
              {product.originalPrice > currentPrice && (
                <>
                  <span className="text-sm text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-[10px] font-semibold text-green-600 bg-green-100 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full">
                    Save {formatPrice(product.originalPrice - currentPrice)}
                  </span>
                </>
              )}
            </div>

            {/* Description - Smaller text */}
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {product.shortDescription || product.description?.substring(0, 100)}
            </p>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <ProductVariants 
                variants={product.variants} 
                selectedVariant={selectedVariant} 
                onSelect={(variant) => { setSelectedVariant(variant); setQuantity(1); }} 
              />
            )}

            {/* Shipping Info - Compact */}
            {inStock && (
              <div className="flex items-center gap-1.5 text-[10px] text-green-600 bg-green-50 dark:bg-green-900/10 px-2 py-1.5 rounded-lg">
                <FiTruck className="h-3 w-3" />
                <span>Free delivery available</span>
              </div>
            )}

            {/* Actions */}
            {inStock ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium">Qty:</label>
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-1.5 disabled:opacity-50 active:scale-95">
                      <FiMinus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-semibold">{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} disabled={quantity >= (selectedVariant?.stock || product?.stock || 10)} className="p-1.5 disabled:opacity-50 active:scale-95">
                      <FiPlus className="h-3 w-3" />
                    </button>
                  </div>
                  {quantity > 1 && (
                    <span className="text-[10px] text-neutral-500">Total: {formatPrice(currentPrice * quantity)}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddToCart} 
                    loading={addingToCart} 
                    icon={addedToCart ? FiCheck : FiShoppingCart} 
                    size="md" 
                    className={cn("flex-1", addedToCart && "bg-green-500")}
                    disabled={addingToCart}
                  >
                    {addedToCart ? 'Added!' : 'Add to Cart'}
                  </Button>
                  <button 
                    onClick={handleWishlistToggle} 
                    className={cn(
                      "p-2 rounded-lg border-2 transition-all active:scale-95",
                      inWishlist ? "border-red-500 text-red-500 bg-red-50" : "border-neutral-200 hover:border-red-300"
                    )}
                  >
                    <FiHeart className={cn("h-4 w-4", inWishlist && "fill-current")} />
                  </button>
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="p-2 rounded-lg border-2 border-neutral-200 hover:border-primary-300 transition-all active:scale-95"
                  >
                    <FiShare2 className="h-4 w-4" />
                  </button>
                </div>

                <Button onClick={handleBuyNow} variant="outline" size="md" className="w-full" icon={FiDollarSign}>
                  Buy Now
                </Button>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-3">
                <div className="flex gap-2 text-red-600">
                  <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-xs">Out of Stock</p>
                    <Link to="/products" className="text-[10px] underline mt-0.5 inline-block">Browse Similar →</Link>
                  </div>
                </div>
              </div>
            )}

            {/* Features Grid - Compact on mobile */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t">
              {[
                { icon: FiTruck, label: 'Free Ship', desc: '$200+' },
                { icon: FiRotateCcw, label: 'Returns', desc: '30 days' },
                { icon: FiShield, label: 'Warranty', desc: '2 years' },
              ].map((item, index) => (
                <div key={index} className="text-center p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                  <item.icon className="h-3.5 w-3.5 mx-auto mb-0.5 text-primary-600" />
                  <p className="text-[9px] font-semibold">{item.label}</p>
                  <p className="text-[8px] text-neutral-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs - Compact on mobile */}
        <div className="mt-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
                    className={cn(
                      "flex items-center gap-1 pb-2 text-xs font-medium transition-all border-b-2 whitespace-nowrap",
                      activeTab === tab.id ? "text-primary-600 border-primary-600" : "text-neutral-500 border-transparent"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {tab.label}
                    {tab.id === 'reviews' && product.numReviews > 0 && (
                      <span className="text-[9px] px-1 bg-neutral-100 rounded-full">{product.numReviews}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="py-3">
            {activeTab === 'description' && (
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                  {product.description || 'No description available.'}
                </p>
                {product.features?.length > 0 && (
                  <>
                    <h3 className="text-xs font-semibold mt-3 mb-1.5">Key Features</h3>
                    <ul className="grid grid-cols-1 gap-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          <FiCheck className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-[11px] text-neutral-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'Material', value: product.material },
                  { label: 'Color', value: product.color },
                  { label: 'Dimensions', value: product.dimensions },
                  { label: 'Weight', value: product.weight },
                  { label: 'Brand', value: product.brand || 'FurniQo' },
                ].filter(item => item.value).map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <span className="text-[10px] text-neutral-500">{item.label}</span>
                    <span className="text-[10px] font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <ProductReviews 
                productId={product._id} 
                reviews={product.reviews || []} 
                rating={product.rating || 0} 
                numReviews={product.numReviews || 0} 
              />
            )}
          </div>
        </div>

        {/* Related Products - Using Wishlist pattern */}
        <RelatedProductsHorizontal 
          productId={product._id}
          category={product.category}
          onAddToCart={handleAddToCartRelated}
          onQuickView={handleQuickView}
          onWishlistToggle={toggleWishlist}
          isWishlisted={isWishlisted}
          isAddingToCart={addingToCartRelated}
        />
      </div>

      {/* Sticky Bottom Bar - Mobile Only */}
      <AnimatePresence>
        {isStickyVisible && inStock && (
          <motion.div 
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t shadow-xl z-50 lg:hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="flex-1">
                <p className="text-xs font-semibold truncate">{product.name}</p>
                <p className="text-sm font-bold text-primary-600">{formatPrice(currentPrice * quantity)}</p>
              </div>
              <Button 
                onClick={handleAddToCart} 
                loading={addingToCart} 
                icon={addedToCart ? FiCheck : FiShoppingCart} 
                size="sm" 
                className={addedToCart ? 'bg-green-500' : ''}
              >
                {addedToCart ? 'Added' : 'Add'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showShareModal && <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} product={product} />}
      </AnimatePresence>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => { setIsQuickViewOpen(false); setQuickViewProduct(null); }}
        onAddToCart={handleAddToCartRelated}
        isWishlisted={isWishlisted}
        onWishlistToggle={toggleWishlist}
      />

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .active\\:scale-95:active {
          transform: scale(0.95);
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;