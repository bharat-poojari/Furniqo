import { Link } from 'react-router-dom';
import { FiClock, FiArrowRight, FiTrash2, FiEye } from 'react-icons/fi';
import { useRecentlyViewed } from '../../store/RecentlyViewedContext';
import { formatPrice, calculateDiscount } from '../../utils/helpers';
import { useState, useCallback, memo } from 'react';
import QuickView from './QuickView';

const RecentlyViewed = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const [hoveredId, setHoveredId] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = useCallback((product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
    // Clean up product reference after close
    setTimeout(() => setQuickViewProduct(null), 300);
  }, []);

  const handleMouseEnter = useCallback((productId) => {
    setHoveredId(productId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  if (recentlyViewed.length === 0) return null;

  return (
    <>
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent pointer-events-none" />
        
        <div className="w-full px-[1%] sm:px-[1.5%] relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-full transition-transform duration-300 hover:rotate-180">
                <FiClock className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Recently Viewed
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Pick up where you left off
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {recentlyViewed.length > 0 && (
                <button
                  onClick={clearRecentlyViewed}
                  className="text-sm text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 active:scale-95"
                  title="Clear recently viewed"
                  aria-label="Clear all recently viewed items"
                >
                  <FiTrash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
              
              <Link
                to="/products"
                className="group text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-150"
                aria-label="View all products"
              >
                View All
                <FiArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {recentlyViewed.map((product) => {
              const discount = calculateDiscount(product.price, product.originalPrice);
              
              return (
                <div
                  key={product._id}
                  onMouseEnter={() => handleMouseEnter(product._id)}
                  onMouseLeave={handleMouseLeave}
                  className="flex-shrink-0 w-48 snap-start"
                >
                  <Link
                    to={`/products/${product.slug}`}
                    className="block group relative bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-200"
                    aria-label={`View ${product.name}`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.images?.[0] || '/placeholder-image.jpg'}
                        alt={product.name}
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      
                      {/* Hover Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center transition-opacity duration-200 ${hoveredId === product._id ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                          onClick={(e) => handleQuickView(product, e)}
                          className="flex items-center gap-1.5 text-white text-xs font-medium bg-white/20 backdrop-blur-sm hover:bg-white/30 px-3 py-1.5 rounded-full transition-all duration-150 hover:scale-105 active:scale-95"
                          style={{
                            transform: hoveredId === product._id ? 'translateY(0)' : 'translateY(10px)',
                            transition: 'transform 0.2s ease'
                          }}
                          aria-label={`Quick view ${product.name}`}
                        >
                          <FiEye className="h-3.5 w-3.5" />
                          Quick View
                        </button>
                      </div>
                      
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          {discount}% OFF
                        </span>
                      )}
                      
                      {!product.inStock && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate transition-colors duration-150 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {product.name}
                      </p>
                      
                      <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-sm font-bold text-primary-600">
                          {formatPrice(product.price)}
                        </p>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <p className="text-xs text-neutral-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                      </div>
                      
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {product.rating.toFixed(1)}
                          </span>
                          {product.numReviews > 0 && (
                            <span className="text-xs text-neutral-400">
                              ({product.numReviews})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          
          {/* Scroll Hint */}
          {recentlyViewed.length > 3 && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 animate-fade-in">
                <span>Scroll for more</span>
                <span className="inline-block animate-bounce-x">→</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && isQuickViewOpen && (
        <QuickView
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={handleCloseQuickView}
        />
      )}
    </>
  );
};

export default memo(RecentlyViewed);