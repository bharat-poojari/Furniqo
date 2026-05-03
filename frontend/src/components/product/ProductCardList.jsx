import { useState, useCallback, lazy, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye, FiCheck, FiStar, FiTrendingUp, FiPackage, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';
import Rating from '../common/Rating';
import Badge from '../common/Badge';
import { formatPrice, calculateDiscount, truncateText } from '../../utils/helpers';
import { cn } from '../../utils/cn';

// Lazy load QuickView for better performance
const QuickView = lazy(() => import('./QuickView'));

const ProductCardList = ({ product, className }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState('');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  // Memoized calculations
  const discount = useMemo(() => calculateDiscount(product.price, product.originalPrice), [product.price, product.originalPrice]);
  const inWishlist = useMemo(() => isWishlisted(product._id), [isWishlisted, product._id]);
  const outOfStock = useMemo(() => !product.inStock, [product.inStock]);
  const hasLowStock = useMemo(() => product.stock <= 5 && product.stock > 0, [product.stock]);

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (addedToCart || outOfStock) return;
    
    setIsAddingToCart(true);
    
    try {
      await addToCart(product, 1);
      setIsAddingToCart(false);
      setAddedToCart(true);
      
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(50);
      }
      
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      setIsAddingToCart(false);
      console.error('Failed to add to cart:', error);
    }
  }, [addedToCart, outOfStock, addToCart, product]);

  const handleToggleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(30);
    }
  }, [toggleWishlist, product]);

  const handleQuickView = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
    
    if (window.gtag) {
      window.gtag('event', 'quick_view', {
        event_category: 'engagement',
        event_label: product.name,
        value: product.price
      });
    }
  }, [product]);

  const handleCloseQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
  }, []);

  const showTooltipMessage = useCallback((message) => {
    setShowTooltip(message);
    setTimeout(() => setShowTooltip(''), 1500);
  }, []);

  // Memoized features list
  const featuresList = useMemo(() => {
    if (!product.features?.length) return null;
    return (
      <div className="hidden md:block mb-3">
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {product.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-center gap-1 text-xs text-neutral-500">
              <FiCheck className="h-3 w-3 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    );
  }, [product.features]);

  return (
    <>
      <div className={cn(
        'group relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 hover:shadow-xl',
        className
      )}>
        <Link to={`/products/${product.slug}`} className="block cursor-pointer">
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            {/* Image Section */}
            <div className="relative flex-shrink-0 sm:w-48 md:w-56">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                <img
                  src={product.images?.[0] || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {discount > 0 && (
                    <Badge variant="sale" size="sm" className="shadow-lg">
                      -{discount}% OFF
                    </Badge>
                  )}
                  {product.newArrival && (
                    <Badge variant="new" size="sm" className="shadow-lg">
                      <FiStar className="inline-block mr-1 h-3 w-3" />
                      New
                    </Badge>
                  )}
                  {hasLowStock && (
                    <Badge variant="warning" size="sm" className="shadow-lg">
                      <FiPackage className="inline-block mr-1 h-3 w-3" />
                      Only {product.stock} left
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  {/* Wishlist Button */}
                  <button
                    onClick={handleToggleWishlist}
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all duration-150 cursor-pointer active:scale-95',
                      inWishlist
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-white/90 text-neutral-700 hover:bg-white hover:shadow-lg'
                    )}
                    onMouseEnter={() => showTooltipMessage(inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')}
                    aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <FiHeart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
                  </button>

                  {/* Quick View Button */}
                  <button
                    onClick={handleQuickView}
                    className="w-8 h-8 rounded-lg bg-white/90 text-neutral-700 hover:bg-white flex items-center justify-center backdrop-blur-sm transition-all duration-150 hover:shadow-lg cursor-pointer active:scale-95"
                    onMouseEnter={() => showTooltipMessage('Quick View')}
                    aria-label="Quick view"
                  >
                    <FiEye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
              {/* Category */}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                {typeof product.category === 'object' ? product.category.name : product.category}
              </p>

              {/* Title */}
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150 line-clamp-2">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="mb-2">
                <Rating 
                  value={product.rating || 0} 
                  numReviews={product.numReviews || 0} 
                  size="sm" 
                  showCount={true}
                />
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                {product.shortDescription || truncateText(product.description || '', 100)}
              </p>

              {/* Price Section */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-neutral-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    {discount > 0 && (
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                        Save {formatPrice(product.originalPrice - product.price)}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Stock Status */}
              {outOfStock ? (
                <div className="text-sm text-red-600 dark:text-red-400 font-medium mb-3">
                  Out of Stock
                </div>
              ) : (
                <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-3">
                  In Stock
                </div>
              )}

              {/* Features List */}
              {featuresList}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-auto pt-3">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock || isAddingToCart}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-98',
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : outOfStock
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                  )}
                  aria-label={addedToCart ? 'Added to cart' : outOfStock ? 'Out of stock' : 'Add to cart'}
                >
                  {addedToCart ? (
                    <div className="flex items-center gap-2">
                      <FiCheck className="h-4 w-4" />
                      Added!
                    </div>
                  ) : isAddingToCart ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : outOfStock ? (
                    <span>Out of Stock</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FiShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </div>
                  )}
                </button>

                {/* View Details Link */}
                <span className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600 transition-colors duration-150 group/arrow cursor-pointer">
                  View Details
                  <FiChevronRight className="h-4 w-4 transition-transform duration-150 group-hover/arrow:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-20 right-4 bg-neutral-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none z-10 transition-opacity duration-150">
            {showTooltip}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <Suspense fallback={
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8">
            <div className="w-96 h-64 bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
          </div>
        </div>
      }>
        {isQuickViewOpen && (
          <QuickView
            product={product}
            isOpen={isQuickViewOpen}
            onClose={handleCloseQuickView}
          />
        )}
      </Suspense>

      <style>{`
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
};

export default ProductCardList;