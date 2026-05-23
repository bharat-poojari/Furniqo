import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiRefreshCw, FiAlertCircle, FiGrid, FiList, FiX
} from 'react-icons/fi';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { useDebounce } from '../hooks/useDebounce';
import { useMediaQuery } from '../hooks/useMediaQuery';
import apiWrapper from '../services/apiWrapper';

const ITEMS_PER_PAGE = 12;

// Helper function to normalize API responses
const normalizeProductsResponse = (axiosResponse) => {
  const responseData = axiosResponse?.data;
  
  if (!responseData) {
    return { products: [], total: 0, pages: 1, currentPage: 1 };
  }
  
  if (responseData?.success === true && Array.isArray(responseData.data)) {
    return {
      products: responseData.data,
      total: responseData.pagination?.total || responseData.data.length,
      pages: responseData.pagination?.pages || Math.ceil((responseData.pagination?.total || responseData.data.length) / ITEMS_PER_PAGE),
      currentPage: responseData.pagination?.page || 1
    };
  }
  
  if (responseData?.data?.success === true && Array.isArray(responseData.data.data)) {
    return {
      products: responseData.data.data,
      total: responseData.data.pagination?.total || responseData.data.data.length,
      pages: responseData.data.pagination?.pages || Math.ceil((responseData.data.pagination?.total || responseData.data.data.length) / ITEMS_PER_PAGE),
      currentPage: responseData.data.pagination?.page || 1
    };
  }
  
  if (Array.isArray(responseData)) {
    return {
      products: responseData,
      total: responseData.length,
      pages: 1,
      currentPage: 1
    };
  }
  
  if (responseData?.data && Array.isArray(responseData.data)) {
    return {
      products: responseData.data,
      total: responseData.data.length,
      pages: 1,
      currentPage: 1
    };
  }
  
  if (responseData?.products && Array.isArray(responseData.products)) {
    return {
      products: responseData.products,
      total: responseData.total || responseData.products.length,
      pages: responseData.pages || 1,
      currentPage: responseData.page || 1
    };
  }
  
  return {
    products: [],
    total: 0,
    pages: 1,
    currentPage: 1
  };
};

// Helper to map frontend filters to API format
const mapFiltersToAPI = (filters, sort) => {
  const apiParams = {};
  
  if (filters.categories?.length) {
    apiParams.category = filters.categories.join(',');
  }
  
  if (filters.materials?.length) {
    apiParams.material = filters.materials.join(',');
  }
  
  if (filters.colors?.length) {
    apiParams.color = filters.colors.join(',');
  }
  
  if (filters.minPrice !== undefined && filters.minPrice !== '' && filters.minPrice !== null) {
    apiParams.minPrice = filters.minPrice;
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== '' && filters.maxPrice !== null) {
    apiParams.maxPrice = filters.maxPrice;
  }
  
  if (filters.minRating) {
    apiParams.minRating = filters.minRating;
  }
  
  if (filters.minDiscount) {
    apiParams.minDiscount = filters.minDiscount;
  }
  
  if (filters.inStock) {
    apiParams.inStock = true;
  }
  
  if (filters.search) {
    apiParams.search = filters.search;
  }
  
  let apiSort = sort;
  if (sort === 'price-asc') apiSort = 'price_asc';
  if (sort === 'price-desc') apiSort = 'price_desc';
  if (sort === 'featured') apiSort = 'featured';
  if (sort === 'newest') apiSort = 'newest';
  if (sort === 'rating') apiSort = 'rating';
  if (sort === 'discount') apiSort = 'discount';
  
  apiParams.sort = apiSort;
  
  return apiParams;
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const gridRef = useRef(null);
  const observerRef = useRef(null);
  const loadingMoreRef = useRef(false);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(() => searchParams.get('sort') || 'featured');
  const [currentPage, setCurrentPage] = useState(() => {
    const page = parseInt(searchParams.get('page'));
    return isNaN(page) || page < 1 ? 1 : page;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('productViewMode') || 'grid');
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const debouncedFilters = useDebounce(filters, 300);

  // Memoized active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.materials?.length) count += filters.materials.length;
    if (filters.colors?.length) count += filters.colors.length;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.minDiscount) count++;
    if (filters.inStock) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const hasActiveFilters = useMemo(() => activeFiltersCount > 0 || sort !== 'featured', [activeFiltersCount, sort]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Handle view mode persistence
  useEffect(() => {
    localStorage.setItem('productViewMode', viewMode);
  }, [viewMode]);

  // Sync URL params to filters
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const sortParam = searchParams.get('sort');

    const urlFilters = {};
    if (category) urlFilters.categories = category.split(',');
    if (search) urlFilters.search = search;
    if (minPrice) urlFilters.minPrice = parseInt(minPrice);
    if (maxPrice) urlFilters.maxPrice = parseInt(maxPrice);
    if (inStock === 'true') urlFilters.inStock = true;
    
    if (sortParam && sortParam !== sort) {
      setSort(sortParam);
    }
    
    setFilters(prev => ({ ...prev, ...urlFilters }));
  }, []);

  // Reset and fetch products when filters or sort change
  useEffect(() => {
    // Reset state when filters change
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setInitialLoadComplete(false);
    fetchProducts(1, true);
  }, [debouncedFilters, sort]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!initialLoadComplete || loadingMore || !hasMore) return;
    
    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (!loadMoreTrigger) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    observerRef.current.observe(loadMoreTrigger);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [initialLoadComplete, loadingMore, hasMore, loading]);

  const fetchProducts = async (page, isInitial = false) => {
    if (!isMountedRef.current) return;
    if (loadingMoreRef.current && !isInitial) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
      loadingMoreRef.current = true;
    }
    
    setError(null);
    
    try {
      const apiParams = mapFiltersToAPI(filters, sort);
      
      const params = {
        ...apiParams,
        page: page,
        limit: ITEMS_PER_PAGE,
      };
      
      const response = await apiWrapper.getProducts(params);
      
      if (!isMountedRef.current) return;
      
      const normalized = normalizeProductsResponse(response);
      const newProducts = normalized.products || [];
      const total = normalized.total || 0;
      const pages = normalized.pages || 1;
      
      if (isInitial) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
      
      setTotalResults(total);
      setTotalPages(pages);
      setHasMore(page < pages);
      setCurrentPage(page);
      
    } catch (err) {
      if (isMountedRef.current && err.name !== 'AbortError' && err.name !== 'CanceledError') {
        console.error('Error fetching products:', err);
        if (isInitial) {
          setError('Failed to load products. Please try again.');
        }
      }
    } finally {
      if (isMountedRef.current) {
        if (isInitial) {
          setLoading(false);
          setInitialLoadComplete(true);
        } else {
          setLoadingMore(false);
          loadingMoreRef.current = false;
        }
      }
    }
  };

  const loadMoreProducts = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      fetchProducts(nextPage, false);
    }
  }, [hasMore, loadingMore, loading, currentPage, totalPages]);

  const handleRetry = useCallback(() => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [filters, sort]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    const params = new URLSearchParams();
    if (newFilters.categories?.length) params.set('category', newFilters.categories.join(','));
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.inStock) params.set('inStock', 'true');
    if (sort !== 'featured') params.set('sort', sort);
    
    setSearchParams(params, { replace: true });
    setShowMobileFilters(false);
    // Close desktop filter panel after applying filters
    setIsDesktopFilterOpen(false);
  }, [sort, setSearchParams]);

  const handleSortChange = useCallback((newSort) => {
    setSort(newSort);
    
    const params = new URLSearchParams(searchParams);
    if (newSort !== 'featured') {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }
    
    setSearchParams(params, { replace: true });
    // Close desktop filter panel after sorting
    setIsDesktopFilterOpen(false);
  }, [searchParams, setSearchParams]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSort('featured');
    setSearchParams({}, { replace: true });
    setIsDesktopFilterOpen(false);
  }, [setSearchParams]);

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen w-full overflow-x-hidden">
      <div className="w-full max-w-[98%] mx-auto px-2 sm:px-4 py-4">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {filters.search 
                  ? `Results for "${filters.search}"`
                  : filters.categories?.[0] || 'All Products'
                }
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{totalResults.toLocaleString()}</span>
                    {' '}product{totalResults !== 1 ? 's' : ''}
                    {hasActiveFilters && (
                      <span className="text-primary-600 dark:text-primary-400 ml-2">
                        · {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <FiX className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Clear all</span>
                </button>
              )}

              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600' : 'text-neutral-400 hover:text-neutral-600'}`}
                  aria-label="Grid view"
                >
                  <FiGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600' : 'text-neutral-400 hover:text-neutral-600'}`}
                  aria-label="List view"
                >
                  <FiList className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              {isMobile && (
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs sm:text-sm font-medium hover:border-primary-300 transition-colors"
                >
                  Filters{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Always visible */}
          <div ref={gridRef} className="flex-1 min-w-0 w-full">
            {/* Error State */}
            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <FiAlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 flex-1">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-700 dark:text-red-300 flex items-center gap-1 sm:gap-2"
                  >
                    <FiRefreshCw className="h-3 w-3" /> Retry
                  </button>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              totalProducts={totalResults}
              viewMode={viewMode}
              sortBy={sort}
              onSortChange={handleSortChange}
              emptyMessage={
                filters.search
                  ? `No products found for "${filters.search}". Try different keywords.`
                  : filters.categories?.[0]
                  ? `No products found in ${filters.categories[0]}. Try adjusting filters.`
                  : 'No products found. Try adjusting your search or filters.'
              }
              onRetry={handleRetry}
            />

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex justify-center items-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-neutral-200 dark:border-neutral-700 border-t-primary-600 rounded-full animate-spin" />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Loading more products...</p>
                </div>
              </div>
            )}

            {/* Load More Trigger Element */}
            {!loading && !loadingMore && hasMore && products.length > 0 && (
              <div id="load-more-trigger" className="h-10 w-full" />
            )}

            {/* End of Products Message */}
            {!loading && !hasMore && products.length > 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  You've reached the end! 
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Filters - Overlay Panel */}
        {!isMobile && (
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            currentSort={sort}
            totalResults={totalResults}
            isMobile={false}
            isDesktopOpen={isDesktopFilterOpen}
            onDesktopToggle={() => setIsDesktopFilterOpen(prev => !prev)}
          />
        )}

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {showMobileFilters && isMobile && (
            <motion.div
              key="mobile-filters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100]"
            >
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
                onClick={() => setShowMobileFilters(false)} 
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-neutral-900 shadow-2xl overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-4 flex items-center justify-between z-10">
                  <h2 className="text-lg font-bold dark:text-white">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    aria-label="Close filters"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 pb-20">
                  <ProductFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                    currentSort={sort}
                    totalResults={totalResults}
                    isMobile={true}
                    onToggle={() => setShowMobileFilters(false)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Products;