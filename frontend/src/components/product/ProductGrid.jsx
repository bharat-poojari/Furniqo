import { useMemo, memo } from 'react';
import ProductCard from './ProductCard';
import ProductCardList from './ProductCardList';
import { ProductCardSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import { FiSearch, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
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

// Memoized ProductCard wrapper to prevent unnecessary re-renders
const MemoizedProductCard = memo(({ product, size }) => (
  <ProductCard product={product} size={size} />
));

MemoizedProductCard.displayName = 'MemoizedProductCard';

const MemoizedProductCardList = memo(({ product, size }) => (
  <ProductCardList product={product} size={size} />
));

MemoizedProductCardList.displayName = 'MemoizedProductCardList';

// Sort labels constant - moved outside component
const SORT_LABELS = {
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'newest': 'Newest First',
  'rating': 'Highest Rated',
  'discount': 'Biggest Discount'
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
  const currentView = VIEW_MODES[viewMode] || VIEW_MODES.grid;
  const CardComponent = currentView.component === ProductCard ? MemoizedProductCard : MemoizedProductCardList;

  // Memoized skeleton array to prevent recreation on each render
  const skeletonCount = useMemo(() => viewMode === 'list' ? 5 : 8, [viewMode]);
  const skeletons = useMemo(() => 
    Array.from({ length: skeletonCount }, (_, i) => i), 
    [skeletonCount]
  );

  // Memoized sort badge content
  const sortLabel = useMemo(() => {
    return sortBy && sortBy !== 'featured' ? SORT_LABELS[sortBy] : null;
  }, [sortBy]);

  // Loading state
  if (loading) {
    return (
      <div className={cn('grid', currentView.gap, currentView.cols)}>
        {skeletons.map((i) => (
          <ProductCardSkeleton key={i} variant={viewMode} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FiAlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Failed to Load Products</h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">{error}</p>
          <Button onClick={onRetry} icon={FiRefreshCw}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <EmptyState 
        icon={FiSearch} 
        title="No Products Found" 
        description={emptyMessage || "No products match your criteria"} 
        actionLabel="Browse All Products" 
        actionHref="/products" 
      />
    );
  }

  // Products grid
  return (
    <div>
      {/* Sort Info Bar */}
      {sortLabel && (
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="primary" size="sm">
            Sorted: {sortLabel}
            <button 
              onClick={() => onSortChange?.('featured')} 
              className="ml-2 hover:text-neutral-700 transition-colors duration-150"
              aria-label="Clear sort"
            >
              <FiRefreshCw className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      <div className={cn('grid', currentView.gap, currentView.cols)}>
        {products.map((product) => (
          <CardComponent 
            key={product._id || product.id} 
            product={product} 
            size={currentView.size}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ProductGrid);