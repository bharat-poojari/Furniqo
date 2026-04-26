import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductCardList from './ProductCardList';
import { ProductCardSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import { FiSearch, FiAlertCircle, FiRefreshCw, FiGrid, FiList } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import Button from '../common/Button';
import Badge from '../common/Badge';

const VIEW_MODES = {
  grid: { 
    cols: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', 
    gap: 'gap-4', 
    component: ProductCard,
    size: 'default'
  },
  list: { 
    cols: 'grid-cols-1', 
    gap: 'gap-4', 
    component: ProductCardList,
    size: 'large'
  },
};

const ProductGrid = ({ 
  products, 
  loading, 
  error, 
  viewMode = 'grid', 
  sortBy, 
  onSortChange, 
  emptyMessage, 
  onRetry, 
  totalProducts, 
  currentPage, 
  totalPages 
}) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const currentView = VIEW_MODES[viewMode] || VIEW_MODES.grid;
  const CardComponent = currentView.component;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: viewMode === 'list' ? 0.1 : 0.05,
        delayChildren: 0.05 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      } 
    },
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className={cn('grid', currentView.gap, currentView.cols)}
      >
        {[...Array(viewMode === 'list' ? 5 : 8)].map((_, i) => (
          <ProductCardSkeleton key={i} variant={viewMode} />
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FiAlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Failed to Load Products</h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">{error}</p>
          <Button onClick={onRetry} icon={FiRefreshCw}>Try Again</Button>
        </div>
      </motion.div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState 
        icon={FiSearch} 
        title="No Products Found" 
        description={emptyMessage} 
        actionLabel="Browse All Products" 
        actionHref="/products" 
      />
    );
  }

  return (
    <div>
      {/* Sort Info Bar */}
      {sortBy && sortBy !== 'featured' && (
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="primary" size="sm">
            Sorted: {sortBy === 'price-asc' && 'Price: Low to High'}
            {sortBy === 'price-desc' && 'Price: High to Low'}
            {sortBy === 'newest' && 'Newest First'}
            {sortBy === 'rating' && 'Highest Rated'}
            {sortBy === 'discount' && 'Biggest Discount'}
            <button 
              onClick={() => onSortChange?.('featured')} 
              className="ml-2 hover:text-neutral-700"
              aria-label="Clear sort"
            >
              <FiRefreshCw className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div 
          key={viewMode} 
          variants={containerVariants}
          initial="hidden" 
          animate="visible" 
          className={cn('grid', currentView.gap, currentView.cols)}
        >
          {products.map((product, index) => (
            <motion.div 
              key={product._id || index} 
              variants={itemVariants}
              onMouseEnter={() => setHoveredProduct(product._id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="transform-gpu"
            >
              <CardComponent 
                product={product} 
                size={currentView.size}
                isHovered={hoveredProduct === product._id}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;