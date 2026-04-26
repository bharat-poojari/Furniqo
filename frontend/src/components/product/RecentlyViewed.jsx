import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiArrowRight, FiTrash2, FiEye } from 'react-icons/fi';
import { useRecentlyViewed } from '../../store/RecentlyViewedContext';
import { formatPrice, calculateDiscount } from '../../utils/helpers';
import { useState, useCallback } from 'react';
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
    // Don't clear the product immediately to avoid hook count issues
  }, []);

  if (recentlyViewed.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent pointer-events-none" />
        
        <div className="w-full px-[1%] sm:px-[1.5%] relative">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-full"
              >
                <FiClock className="h-5 w-5 text-primary-600" />
              </motion.div>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearRecentlyViewed}
                  className="text-sm text-neutral-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Clear recently viewed"
                >
                  <FiTrash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Clear</span>
                </motion.button>
              )}
              
              <Link
                to="/products"
                className="group text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                View All
                <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          >
            <AnimatePresence mode="popLayout">
              {recentlyViewed.map((product) => {
                const discount = calculateDiscount(product.price, product.originalPrice);
                
                return (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    layout
                    exit="exit"
                    onHoverStart={() => setHoveredId(product._id)}
                    onHoverEnd={() => setHoveredId(null)}
                    className="flex-shrink-0 w-48 snap-start"
                  >
                    <Link
                      to={`/products/${product.slug}`}
                      className="block group relative bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={product.images?.[0] || '/placeholder-image.jpg'}
                          alt={product.name}
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        
                        <motion.div
                          initial={false}
                          animate={{ opacity: hoveredId === product._id ? 1 : 0 }}
                          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center"
                        >
                          <motion.button
                            initial={{ y: 10 }}
                            animate={{ y: hoveredId === product._id ? 0 : 10 }}
                            onClick={(e) => handleQuickView(product, e)}
                            className="flex items-center gap-1.5 text-white text-xs font-medium bg-white/20 backdrop-blur-sm hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
                          >
                            <FiEye className="h-3.5 w-3.5" />
                            Quick View
                          </motion.button>
                        </motion.div>
                        
                        {discount > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                          >
                            {discount}% OFF
                          </motion.span>
                        )}
                        
                        {!product.inStock && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                            Sold Out
                          </span>
                        )}
                      </div>
                      
                      <div className="p-3">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
                        
                        {product.rating && (
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
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
          
          {recentlyViewed.length > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center mt-4"
            >
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                <span>Scroll for more</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick View Modal - Always render but conditionally show */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={handleCloseQuickView}
        />
      )}
    </>
  );
};

export default RecentlyViewed;