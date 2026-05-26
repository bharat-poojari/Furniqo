// src/pages/ProductDetail.jsx
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
  { id: 'specifications', label: 'Specifications', icon: FiTag },
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Share Product</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <FiShare2 className="h-4 w-4" />
              Share via...
            </button>
          )}

          <div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">Or copy link</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="flex-1 px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg" 
              />
              <Button variant="outline" size="sm" onClick={handleCopyLink}>Copy</Button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t dark:border-neutral-800">
            <img 
              src={product.images?.[0] || 'https://placehold.co/60x60/eee/999?text=No+Image'} 
              alt={product.name} 
              className="w-12 h-12 rounded-lg object-cover" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-sm font-bold text-primary-600">{formatPrice(product.price)}</p>
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
      setTimeout(() => { setAddedToCart(false); onClose(); }, 1200);
    } catch (error) {
      // Error handled by parent
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white dark:bg-neutral-800 shadow-lg hover:bg-neutral-100 transition-all"
            >
              <FiX className="h-5 w-5" />
            </button>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Gallery */}
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={product.images?.[selectedImage] || 'https://placehold.co/600x600/eee/999?text=No+Image'}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                    />
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discount}%
                      </div>
                    )}
                  </div>
                  {product.images?.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === idx ? 'border-primary-500' : 'border-transparent hover:border-neutral-300'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col space-y-4">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white line-clamp-2">
                    {product.name}
                  </h3>

                  <Rating value={product.rating || 0} numReviews={product.numReviews || 0} size="md" />

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="text-sm text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                          Save {formatPrice(product.originalPrice - product.price)}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                    {product.shortDescription || product.description?.substring(0, 150)}
                  </p>

                  {product.stock > 0 && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-2 block">Quantity:</label>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleQuantityChange(-1)} 
                          disabled={quantity <= 1} 
                          className="p-2 rounded-lg border disabled:opacity-50 hover:bg-neutral-100 transition"
                        >
                          <FiMinus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(1)} 
                          disabled={quantity >= product.stock} 
                          className="p-2 rounded-lg border disabled:opacity-50 hover:bg-neutral-100 transition"
                        >
                          <FiPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || isAddingToCart}
                      className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                      {isAddingToCart ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding...
                        </div>
                      ) : addedToCart ? (
                        <div className="flex items-center justify-center gap-2">
                          <FiCheck className="h-4 w-4" />
                          Added!
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <FiShoppingCart className="h-4 w-4" />
                          Add to Cart - {formatPrice((product.price || 0) * quantity)}
                        </div>
                      )}
                    </button>

                    <button 
                      onClick={() => onWishlistToggle(product)} 
                      className="p-3 rounded-xl border-2 transition-all hover:scale-105"
                    >
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
};

// Related Products Horizontal Scroll Component
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
      
      // Handle different response structures
      if (response?.success && response?.data) {
        productsData = Array.isArray(response.data) ? response.data : [];
      } else if (response?.data?.success && response?.data?.data) {
        productsData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (response?.data && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      }
      
      // Parse images and other fields
      productsData = productsData.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []),
        features: typeof p.features === 'string' ? JSON.parse(p.features || '[]') : (p.features || []),
        tags: typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || []),
        inStock: p.inStock === 1 || p.inStock === true,
      }));
      
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
      <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">You May Also Like</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-40 flex-shrink-0">
              <div className="bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-xl aspect-square" />
              <div className="mt-2 h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
              <div className="mt-1 h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">You May Also Like</h2>
        <Link to="/products" className="text-primary-600 text-sm flex items-center gap-1 hover:underline">
          View All <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-4 w-max">
          {products.map((product) => {
            const discount = calculateDiscount(product.price, product.originalPrice);
            const inWishlist = isWishlisted(product._id);
            
            return (
              <div key={product._id} className="w-40 flex-shrink-0">
                <div className="group relative bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all border border-neutral-200 dark:border-neutral-700">
                  <Link to={`/products/${product.slug || product._id}`} className="relative overflow-hidden bg-neutral-100 aspect-square block">
                    <img
                      src={product.images?.[0] || 'https://placehold.co/400x400/eee/999?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        -{discount}%
                      </div>
                    )}
                  </Link>

                  <div className="p-3">
                    <Link to={`/products/${product.slug || product._id}`}>
                      <h3 className="font-medium text-sm text-neutral-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-2 min-h-[40px]">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={`h-2.5 w-2.5 ${i < Math.floor(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-300'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-neutral-500">({product.numReviews || 0})</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-sm font-bold text-primary-600">{formatPrice(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-[10px] text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => onAddToCart(product)}
                        disabled={isAddingToCart[product._id]}
                        className="flex-1 bg-primary-600 text-white py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-primary-700 disabled:opacity-50"
                      >
                        {isAddingToCart[product._id] ? (
                          <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                        ) : (
                          'Add to Cart'
                        )}
                      </button>
                      <button
                        onClick={() => onQuickView(product)}
                        className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 transition-colors"
                        title="Quick View"
                      >
                        <FiEye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onWishlistToggle(product)}
                        className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-red-100 transition-colors"
                        title="Add to Wishlist"
                      >
                        <FiHeart className={`h-3.5 w-3.5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
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

  useEffect(() => {
    window.scrollTo({ top: 0 });
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
  }, [slug]);

  const parseProductData = useCallback((data) => {
    if (!data) return null;
    
    return {
      ...data,
      images: typeof data.images === 'string' ? JSON.parse(data.images || '[]') : (data.images || []),
      features: typeof data.features === 'string' ? JSON.parse(data.features || '[]') : (data.features || []),
      tags: typeof data.tags === 'string' ? JSON.parse(data.tags || '[]') : (data.tags || []),
      variants: typeof data.variants === 'string' ? JSON.parse(data.variants || '[]') : (data.variants || []),
      reviews: typeof data.reviews === 'string' ? JSON.parse(data.reviews || '[]') : (data.reviews || []),
      inStock: data.inStock === 1 || data.inStock === true || data.stock > 0,
      featured: data.featured === 1 || data.featured === true,
      trending: data.trending === 1 || data.trending === true,
      bestSeller: data.bestSeller === 1 || data.bestSeller === true,
      newArrival: data.newArrival === 1 || data.newArrival === true,
      onSale: data.onSale === 1 || data.onSale === true,
      stock: data.stock || 0,
      price: data.price || 0,
      originalPrice: data.originalPrice || 0,
      rating: data.rating || 0,
      numReviews: data.numReviews || 0,
    };
  }, []);

  const fetchProduct = useCallback(async () => {
    if (!slug || !isMountedRef.current) return;
    
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiWrapper.getProduct(slug);
      
      if (!isMountedRef.current) return;
      
      let productData = null;
      
      // Handle different response structures from backend
      if (response?.success && response?.product) {
        productData = response.product;
      } else if (response?.data?.success && response?.data?.product) {
        productData = response.data.product;
      } else if (response?.data && response?.data._id) {
        productData = response.data;
      } else if (response?.product && response.product._id) {
        productData = response.product;
      }
      
      if (productData) {
        const parsedData = parseProductData(productData);
        setProduct(parsedData);
        addToRecentlyViewed(parsedData);
      } else {
        setError('Product not found');
        toast.error('Product not found');
      }
    } catch (error) {
      if (isMountedRef.current && error.name !== 'AbortError') {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
        toast.error('Failed to load product');
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [slug, addToRecentlyViewed, parseProductData]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    const handleScroll = () => {
      setIsStickyVisible(window.scrollY > 500);
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

  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' }
    ];
    
    if (product?.category) {
      const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
      items.push({ 
        label: categoryName, 
        href: `/products?category=${encodeURIComponent(categoryName)}` 
      });
    }
    
    if (product?.name) {
      items.push({ label: product.name });
    }
    
    return items;
  }, [product]);
  
  const inStock = useMemo(() => {
    if (selectedVariant) return selectedVariant.stock > 0;
    return product?.inStock || product?.stock > 0;
  }, [selectedVariant, product]);

  const handleAddToCart = useCallback(async () => {
    if (!inStock || !product || addingToCart) {
      if (!inStock) toast.error('Out of stock');
      return;
    }
    
    setAddingToCart(true);
    try {
      const cartProduct = {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: currentPrice,
        originalPrice: product.originalPrice,
        images: product.images || [],
        stock: selectedVariant?.stock || product.stock || 0,
        ...(selectedVariant && { variant: selectedVariant })
      };
      
      await addToCart(cartProduct, quantity);
      setAddedToCart(true);
      toast.success(`${quantity} × ${product.name} added to cart!`);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Add to cart error:', error);
      // Error toast already shown by CartContext
    } finally {
      setAddingToCart(false);
    }
  }, [product, quantity, selectedVariant, inStock, addToCart, addingToCart, currentPrice]);

  const handleAddToCartRelated = useCallback(async (product, qty = 1) => {
    if (addingToCartRelated[product._id]) return;
    setAddingToCartRelated(prev => ({ ...prev, [product._id]: true }));
    try {
      await addToCart(product, qty);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCartRelated(prev => ({ ...prev, [product._id]: false }));
    }
  }, [addToCart, addingToCartRelated]);

  const handleQuantityChange = useCallback((delta) => {
    setQuantity(prev => {
      const newValue = prev + delta;
      if (newValue < 1) return 1;
      const max = selectedVariant?.stock || product?.stock || 10;
      if (newValue > max) return max;
      return newValue;
    });
  }, [selectedVariant, product]);

  const handleBuyNow = useCallback(async () => {
    if (!inStock || !product) return;
    const cartProduct = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      originalPrice: product.originalPrice,
      images: product.images || [],
      stock: selectedVariant?.stock || product.stock || 0,
      ...(selectedVariant && { variant: selectedVariant })
    };
    await addToCart(cartProduct, quantity);
    navigate('/cart');
  }, [product, quantity, selectedVariant, inStock, addToCart, navigate, currentPrice]);

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
        <div className="w-full px-4 py-6 max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                <div className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded" />
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
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FiAlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            {error || 'Product Not Found'}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline" icon={FiChevronLeft}>
              Go Back
            </Button>
            <Link to="/products">
              <Button icon={FiPackage}>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen">
      <div className="w-full px-4 py-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Main Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <ProductImages images={product.images || []} name={product.name} />

          {/* Product Details */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.newArrival && <Badge variant="new" size="sm">New Arrival</Badge>}
              {product.bestSeller && <Badge variant="featured" size="sm">Best Seller</Badge>}
              {discount > 0 && <Badge variant="sale" size="sm">-{discount}% OFF</Badge>}
              {!inStock && <Badge variant="danger" size="sm">Out of Stock</Badge>}
              {inStock && product.stock <= 10 && product.stock > 0 && (
                <Badge variant="warning" size="sm">Only {product.stock} left</Badge>
              )}
            </div>

            {/* SKU & Category */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
              <span>SKU: {product.sku || (product._id || '').slice(-8).toUpperCase()}</span>
              {product.category && (
                <span className="flex items-center gap-1">
                  <FiTag className="h-3 w-3" />
                  {typeof product.category === 'object' ? product.category.name : product.category}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Rating value={product.rating || 0} numReviews={product.numReviews || 0} size="md" />
              <button 
                onClick={() => {
                  setActiveTab('reviews');
                  reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                Read all {product.numReviews || 0} reviews
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4">
              <span className="text-3xl font-bold text-primary-600">{formatPrice(currentPrice)}</span>
              {product.originalPrice > currentPrice && (
                <>
                  <span className="text-sm text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    Save {formatPrice(product.originalPrice - currentPrice)}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {product.shortDescription || product.description?.substring(0, 250)}
              {product.description?.length > 250 && '...'}
            </p>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <ProductVariants 
                variants={product.variants} 
                selectedVariant={selectedVariant} 
                onSelect={(variant) => { setSelectedVariant(variant); setQuantity(1); }} 
              />
            )}

            {/* Shipping Info */}
            {inStock && (
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/10 px-3 py-2 rounded-lg">
                <FiTruck className="h-3.5 w-3.5" />
                <span>Free shipping on orders over $200 • Fast delivery</span>
              </div>
            )}

            {/* Actions */}
            {inStock ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <button 
                      onClick={() => handleQuantityChange(-1)} 
                      disabled={quantity <= 1} 
                      className="p-2 disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-l-lg transition"
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)} 
                      disabled={quantity >= (selectedVariant?.stock || product?.stock || 10)} 
                      className="p-2 disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-r-lg transition"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>
                  {quantity > 1 && (
                    <span className="text-sm text-neutral-500">
                      Total: {formatPrice(currentPrice * quantity)}
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleAddToCart} 
                    loading={addingToCart} 
                    icon={addedToCart ? FiCheck : FiShoppingCart} 
                    size="lg" 
                    className={cn("flex-1", addedToCart && "bg-green-600")}
                    disabled={addingToCart}
                  >
                    {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                  </Button>
                  <button 
                    onClick={handleWishlistToggle} 
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all hover:scale-105",
                      inWishlist ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20" : "border-neutral-200 dark:border-neutral-700 hover:border-red-300"
                    )}
                  >
                    <FiHeart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                  </button>
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="p-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-300 transition-all hover:scale-105"
                  >
                    <FiShare2 className="h-5 w-5" />
                  </button>
                </div>

                <Button onClick={handleBuyNow} variant="outline" size="lg" className="w-full" icon={FiDollarSign}>
                  Buy Now
                </Button>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex gap-3 text-red-600">
                  <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Out of Stock</p>
                    <Link to="/products" className="text-xs underline mt-1 inline-block">
                      Browse similar products →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              {[
                { icon: FiTruck, label: 'Free Shipping', desc: 'On orders $200+' },
                { icon: FiRotateCcw, label: 'Easy Returns', desc: '30 days return' },
                { icon: FiShield, label: 'Warranty', desc: '2 year warranty' },
              ].map((item, index) => (
                <div key={index} className="text-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                  <item.icon className="h-5 w-5 mx-auto mb-1 text-primary-600" />
                  <p className="text-xs font-semibold">{item.label}</p>
                  <p className="text-[10px] text-neutral-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-10" ref={reviewSectionRef}>
          <div className="border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
                    className={cn(
                      "flex items-center gap-2 pb-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap",
                      activeTab === tab.id ? "text-primary-600 border-primary-600" : "text-neutral-500 border-transparent hover:text-neutral-700"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === 'reviews' && product.numReviews > 0 && (
                      <span className="text-xs px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                        {product.numReviews}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                    {product.description || 'No description available.'}
                  </p>
                </div>
                {product.features?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <FiCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Material', value: product.material },
                  { label: 'Color', value: product.color },
                  { label: 'Dimensions', value: product.dimensions },
                  { label: 'Weight', value: product.weight },
                  { label: 'Style', value: product.style },
                  { label: 'Brand', value: product.brand || 'FurniQo' },
                ].filter(item => item.value).map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                    <span className="text-sm text-neutral-500">{item.label}</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">{item.value}</span>
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

        {/* Related Products */}
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
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-xs font-semibold truncate">{product.name}</p>
                <p className="text-lg font-bold text-primary-600">{formatPrice(currentPrice * quantity)}</p>
              </div>
              <Button 
                onClick={handleAddToCart} 
                loading={addingToCart} 
                icon={addedToCart ? FiCheck : FiShoppingCart} 
                size="md" 
                className={addedToCart ? 'bg-green-600' : ''}
              >
                {addedToCart ? 'Added' : 'Add to Cart'}
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
      `}</style>
    </div>
  );
};

export default ProductDetail;