import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingCart,
  FiHeart,
  FiMinus,
  FiPlus,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiShare2,
  FiCheck,
  FiAlertCircle,
} from 'react-icons/fi';
import ProductImages from '../components/product/ProductImages';
import ProductVariants from '../components/product/ProductVariants';
import ProductReviews from '../components/product/ProductReviews';
import RelatedProducts from '../components/product/RelatedProducts';
import RecentlyViewed from '../components/product/RecentlyViewed';
import Rating from '../components/common/Rating';
import Badge from '../components/common/Badge';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import { ProductDetailSkeleton } from '../components/common/Skeleton';
import { useCart } from '../store/CartContext';
import { useWishlist } from '../store/WishlistContext';
import { useRecentlyViewed } from '../store/RecentlyViewedContext';
import { formatPrice, calculateDiscount, copyToClipboard } from '../utils/helpers';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await apiWrapper.getProduct(slug);
      
      if (response.data.success && response.data.data) {
        const productData = response.data.data;
        setProduct(productData);
        addToRecentlyViewed(productData);
        
        // Track product view
        apiWrapper.trackEvent({
          type: 'product_view',
          productId: productData._id,
          productName: productData.name,
        }).catch(() => {});
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

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    
    setAddingToCart(true);
    await addToCart(product, quantity, selectedVariant);
    setAddingToCart(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shared = await copyToClipboard(url);
    if (shared) {
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="w-full px-[1%] sm:px-[1.5%] py-16 text-center">
        <FiAlertCircle className="h-16 w-16 text-neutral-300 dark:text-neutral-600  mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Product Not Found
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.originalPrice);
  const currentPrice = selectedVariant?.price || product.price;
  const inWishlist = isWishlisted(product._id);
  const inStock = selectedVariant 
    ? selectedVariant.stock > 0 
    : product.inStock;

  const infoItems = [
    { icon: FiTruck, title: 'Free Shipping', description: 'On orders over $200' },
    { icon: FiRotateCcw, title: '30-Day Returns', description: 'Hassle-free returns' },
    { icon: FiShield, title: 'Warranty', description: 'Up to 10 years coverage' },
  ];

  return (
    <div className="bg-white dark:bg-neutral-950">
      <div className="w-full px-[1%] sm:px-[1.5%] py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Products', href: '/products' },
            { label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` },
            { label: product.name },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductImages images={product.images} name={product.name} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.newArrival && <Badge variant="new">New Arrival</Badge>}
              {product.bestSeller && <Badge variant="featured">Best Seller</Badge>}
              {discount > 0 && <Badge variant="sale">Save {discount}%</Badge>}
              {!inStock && <Badge variant="danger">Out of Stock</Badge>}
              {product.inStock && product.stock <= 5 && (
                <Badge variant="warning">Only {product.stock} left</Badge>
              )}
            </div>

            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <Rating value={product.rating} numReviews={product.numReviews} size="md" />
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Read {product.numReviews} reviews
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4">
              <span className="text-3xl lg:text-4xl font-bold text-primary-600">
                {formatPrice(currentPrice)}
              </span>
              {product.originalPrice > currentPrice && (
                <>
                  <span className="text-xl text-neutral-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-sm font-medium text-red-600 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded-full">
                    Save {formatPrice(product.originalPrice - currentPrice)}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <ProductVariants
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            )}

            {/* Quantity & Add to Cart */}
            {inStock ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-neutral-200 dark:border-neutral-700 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="h-5 w-5" />
                  </button>
                  <span className="px-6 font-semibold text-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus className="h-5 w-5" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  icon={FiShoppingCart}
                  size="lg"
                  className="flex-grow"
                >
                  Add to Cart — {formatPrice(currentPrice * quantity)}
                </Button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    inWishlist
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-500'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-red-300 text-neutral-400 hover:text-red-500'
                  }`}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <FiHeart className={`h-6 w-6 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                  <FiAlertCircle className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Currently Out of Stock</p>
                    <p className="text-sm mt-1">Enter your email to be notified when this item is back in stock.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              <FiShare2 className="h-4 w-4" />
              Share this product
            </button>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-3">
              {infoItems.map((item, index) => (
                <div
                  key={index}
                  className="text-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl"
                >
                  <item.icon className="h-5 w-5  mb-1 text-primary-600" />
                  <p className="text-xs font-medium text-neutral-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-2xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex gap-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium capitalize transition-colors relative ${
                    activeTab === tab
                      ? 'text-primary-600'
                      : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'description' && (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
                      {product.description}
                    </p>
                    {product.features && (
                      <>
                        <h3 className="text-xl font-semibold mt-8 mb-4">Key Features</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <FiCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.material && (
                      <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                        <span className="text-neutral-500">Material</span>
                        <span className="font-medium text-neutral-900 dark:text-white">{product.material}</span>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                        <span className="text-neutral-500">Color</span>
                        <span className="font-medium text-neutral-900 dark:text-white">{product.color}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                        <span className="text-neutral-500">Dimensions</span>
                        <span className="font-medium text-neutral-900 dark:text-white">{product.dimensions}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                        <span className="text-neutral-500">Weight</span>
                        <span className="font-medium text-neutral-900 dark:text-white">{product.weight}</span>
                      </div>
                    )}
                    {product.style && (
                      <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                        <span className="text-neutral-500">Style</span>
                        <span className="font-medium text-neutral-900 dark:text-white">{product.style}</span>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ProductReviews
                    reviews={product.reviews || []}
                    rating={product.rating}
                    numReviews={product.numReviews}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts productId={product._id} category={product.category} />
        
        {/* Recently Viewed */}
        <RecentlyViewed />
      </div>
    </div>
  );
};

export default ProductDetail;