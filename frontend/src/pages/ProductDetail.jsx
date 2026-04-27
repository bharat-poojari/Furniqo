import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiTruck, FiShield, FiRotateCcw, FiShare2, FiCheck, FiAlertCircle, FiChevronLeft, FiTag, FiInfo, FiStar, FiPackage, FiClock, FiDollarSign } from 'react-icons/fi';
import ProductImages from '../components/product/ProductImages';
import ProductVariants from '../components/product/ProductVariants';
import ProductReviews from '../components/product/ProductReviews';
import RelatedProducts from '../components/product/RelatedProducts';
import Rating from '../components/common/Rating';
import Badge from '../components/common/Badge';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import { useCart } from '../store/CartContext';
import { useWishlist } from '../store/WishlistContext';
import { useRecentlyViewed } from '../store/RecentlyViewedContext';
import { formatPrice, calculateDiscount, copyToClipboard } from '../utils/helpers';
import { cn } from '../utils/cn';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'description', label: 'Description', icon: FiInfo },
  { id: 'specifications', label: 'Specifications', icon: FiTag },
  { id: 'reviews', label: 'Reviews', icon: FiStar },
];

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const reviewSectionRef = useRef(null);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    setQuantity(1);
    setSelectedVariant(null);
    setActiveTab('description');
    setAddedToCart(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => setIsStickyVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProduct = async () => {
  setLoading(true);
  try {
    // Use getProduct instead of productAPI.getOne
    const response = await apiWrapper.getProduct(slug);
    
    if (response.data.success && response.data.data) {
      const productData = response.data.data;
      setProduct(productData);
      addToRecentlyViewed(productData);
      
      // Fetch related products
      const relatedResponse = await apiWrapper.getRelatedProducts(productData._id, 4);
      if (relatedResponse.data.success) {
        setRelatedProducts(relatedResponse.data.data);
      }
    } else {
      toast.error('Product not found');
      navigate('/products');
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    toast.error('Failed to load product');
  } finally {
    setLoading(false);
  }
};

  const discount = useMemo(() => product ? calculateDiscount(product.price, product.originalPrice) : 0, [product]);
  const currentPrice = useMemo(() => selectedVariant?.price || product?.price || 0, [selectedVariant, product]);
  const inWishlist = useMemo(() => product ? isWishlisted(product._id) : false, [product, isWishlisted]);
  const inStock = useMemo(() => selectedVariant ? selectedVariant.stock > 0 : product?.inStock || false, [selectedVariant, product]);
  const maxQuantity = useMemo(() => selectedVariant?.stock || product?.stock || 1, [selectedVariant, product]);

  const breadcrumbItems = useMemo(() => [
    { label: 'Products', href: '/products' },
    ...(product?.category ? [{ label: typeof product.category === 'object' ? product.category.name : product.category, href: `/products?category=${encodeURIComponent(typeof product.category === 'object' ? product.category.slug || product.category.name : product.category)}` }] : []),
    { label: product?.name || 'Product' },
  ], [product]);

  const handleAddToCart = useCallback(async () => {
    if (!product?.inStock || !inStock) return;
    setAddingToCart(true);
    try {
      await addToCart(product, quantity, selectedVariant);
      setAddedToCart(true);
      toast.success(`${quantity} × ${product.name} added to cart`);
      if (window.navigator?.vibrate) window.navigator.vibrate(50);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  }, [product, quantity, selectedVariant, inStock, addToCart]);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.min(Math.max(1, prev + delta), maxQuantity));
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: `Check out ${product.name}`, url });
      } catch (error) {
        if (error.name !== 'AbortError') {
          await copyToClipboard(url);
          toast.success('Link copied!');
        }
      }
    } else {
      const copied = await copyToClipboard(url);
      if (copied) toast.success('Link copied!');
    }
  };

  const handleBuyNow = async () => {
    if (!product?.inStock || !inStock) return;
    await addToCart(product, quantity, selectedVariant);
    navigate('/cart');
  };

  const estimatedDelivery = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 5) + 3);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-950 min-h-screen">
        <div className="w-[98%] mx-auto py-4">
          <div className="animate-pulse">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mb-4" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
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
      <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center px-4 py-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FiAlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{error || 'Product Not Found'}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline" icon={FiChevronLeft}>Go Back</Button>
            <Link to="/products"><Button icon={FiPackage}>Browse Products</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950">
      <div className="w-[98%] mx-auto py-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid lg:grid-cols-2 gap-8 mt-6">
          {/* Product Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <ProductImages images={product.images || []} name={product.name} />
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.newArrival && <Badge variant="new">New Arrival</Badge>}
              {product.bestSeller && <Badge variant="featured">Best Seller</Badge>}
              {discount > 0 && <Badge variant="sale">-{discount}% OFF</Badge>}
              {!inStock && <Badge variant="danger">Out of Stock</Badge>}
              {product.inStock && product.stock <= 10 && <Badge variant="warning"><FiClock className="inline mr-1 h-3 w-3" />Only {product.stock} left</Badge>}
            </div>

            {/* SKU & Category */}
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span>SKU: {product.sku || product._id?.slice(-8).toUpperCase()}</span>
              {product.category && <span className="flex items-center gap-1"><FiTag className="h-3 w-3" />{typeof product.category === 'object' ? product.category.name : product.category}</span>}
            </div>

            {/* Title & Rating */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-3">
                <Rating value={product.rating || 0} numReviews={product.numReviews || 0} size="sm" />
                <button onClick={() => { setActiveTab('reviews'); setTimeout(() => reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  {product.numReviews || 0} review{(product.numReviews || 0) !== 1 ? 's' : ''}
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4">
              <span className="text-3xl font-bold text-primary-600">{formatPrice(currentPrice)}</span>
              {product.originalPrice > currentPrice && (
                <>
                  <span className="text-lg text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">Save {formatPrice(product.originalPrice - currentPrice)}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{product.shortDescription || product.description?.substring(0, 120)}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <ProductVariants variants={product.variants} selectedVariant={selectedVariant} onSelect={(variant) => { setSelectedVariant(variant); setQuantity(1); }} />
            )}

            {/* Delivery */}
            {inStock && (
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 px-3 py-2 rounded-lg">
                <FiTruck className="h-4 w-4" />
                <span>Free delivery by <strong>{estimatedDelivery}</strong></span>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            {inStock ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Quantity:</label>
                  <div className="flex items-center border-2 border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-2.5 hover:bg-neutral-50 disabled:opacity-50"> <FiMinus className="h-4 w-4" /> </button>
                    <span className="px-6 font-semibold text-sm min-w-[60px] text-center">{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} disabled={quantity >= maxQuantity} className="p-2.5 hover:bg-neutral-50 disabled:opacity-50"> <FiPlus className="h-4 w-4" /> </button>
                  </div>
                  {quantity > 1 && <span className="text-xs text-neutral-500">Total: {formatPrice(currentPrice * quantity)}</span>}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleAddToCart} loading={addingToCart} icon={addedToCart ? FiCheck : FiShoppingCart} size="lg" className={cn("flex-1", addedToCart && "bg-green-500")}>
                    {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                  </Button>
                  <button onClick={() => toggleWishlist(product)} className={cn("p-3 rounded-lg border-2 transition-all", inWishlist ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20" : "border-neutral-200 dark:border-neutral-700 hover:border-red-300")}>
                    <FiHeart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                  </button>
                </div>

                <Button onClick={handleBuyNow} variant="outline" size="lg" className="w-full" icon={FiDollarSign}>Buy Now</Button>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex gap-3 text-red-600 dark:text-red-400">
                  <FiAlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Out of Stock</p>
                    <p className="text-xs mt-1 opacity-90">This item is currently unavailable.</p>
                    <Link to="/products" className="mt-2 text-xs font-medium underline inline-block">Browse Similar Products →</Link>
                  </div>
                </div>
              </div>
            )}

            {/* Share */}
            <button onClick={handleShare} className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-700">
              <FiShare2 className="h-3.5 w-3.5" /> Share
            </button>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              {[
                { icon: FiTruck, title: 'Free Shipping', desc: 'Orders $200+' },
                { icon: FiRotateCcw, title: '30-Day Returns', desc: 'Easy returns' },
                { icon: FiShield, title: '2-Year Warranty', desc: 'Full coverage' },
              ].map((item, index) => (
                <div key={index} className="text-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                  <item.icon className="h-5 w-5 mx-auto mb-1 text-primary-600" />
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div ref={reviewSectionRef} className="mt-12">
          <div className="border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex gap-6">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex items-center gap-2 pb-3 text-sm font-medium transition-all border-b-2", activeTab === tab.id ? "text-primary-600 border-primary-600" : "text-neutral-500 border-transparent hover:text-neutral-700")}>
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === 'reviews' && product.numReviews > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100">{product.numReviews}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="py-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {activeTab === 'description' && (
                  <div className="max-w-3xl">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">{product.description || 'No description available.'}</p>
                      {product.features && product.features.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold mt-6 mb-3">Key Features</h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {product.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2"><FiCheck className="h-4 w-4 text-green-500 mt-0.5" /><span className="text-sm">{feature}</span></li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { label: 'Material', value: product.material },
                        { label: 'Color', value: product.color },
                        { label: 'Dimensions', value: product.dimensions },
                        { label: 'Weight', value: product.weight },
                        { label: 'SKU', value: product.sku || product._id?.slice(-8).toUpperCase() },
                        { label: 'Category', value: typeof product.category === 'object' ? product.category.name : product.category },
                        { label: 'Brand', value: product.brand || 'Store' },
                      ].filter(item => item.value).map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                          <span className="text-xs text-neutral-500">{item.label}</span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ProductReviews productId={product._id} reviews={product.reviews || []} rating={product.rating || 0} numReviews={product.numReviews || 0} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <RelatedProducts productId={product._id} category={product.category} />
      </div>

      {/* Sticky Mobile Cart Bar */}
      <AnimatePresence>
        {isStickyVisible && inStock && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 shadow-2xl z-50 lg:hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-semibold truncate">{product.name}</p>
                <p className="text-lg font-bold text-primary-600">{formatPrice(currentPrice * quantity)}</p>
              </div>
              <Button onClick={handleAddToCart} loading={addingToCart} icon={addedToCart ? FiCheck : FiShoppingCart} size="md" className={addedToCart ? 'bg-green-500' : ''}>
                {addedToCart ? 'Added' : 'Add to Cart'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;