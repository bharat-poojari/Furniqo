import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowUp, FiRefreshCw, FiAlertCircle, FiGrid, FiList, FiX
} from 'react-icons/fi';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { useMediaQuery } from '../hooks/useMediaQuery';
import apiWrapper from '../services/apiWrapper';

const ITEMS_PER_PAGE = 12;

// Helper function to normalize API responses
const normalizeProductsResponse = (response) => {
  // Case 1: response.data.data exists
  if (response?.data?.data && Array.isArray(response.data.data)) {
    return {
      products: response.data.data,
      total: response.data.pagination?.total || response.data.data.length,
      pages: response.data.pagination?.pages || Math.ceil(response.data.data.length / ITEMS_PER_PAGE)
    };
  }
  
  // Case 2: response.data exists and is array
  if (response?.data && Array.isArray(response.data)) {
    return {
      products: response.data,
      total: response.data.length,
      pages: Math.ceil(response.data.length / ITEMS_PER_PAGE)
    };
  }
  
  // Case 3: response is array directly
  if (Array.isArray(response)) {
    return {
      products: response,
      total: response.length,
      pages: Math.ceil(response.length / ITEMS_PER_PAGE)
    };
  }
  
  // Case 4: response.data.data doesn't exist but .data has .data property
  if (response?.data?.data && !Array.isArray(response.data.data)) {
    return {
      products: response.data.data.products || [],
      total: response.data.data.total || 0,
      pages: response.data.data.pages || 1
    };
  }
  
  // Default fallback
  return {
    products: [],
    total: 0,
    pages: 1
  };
};

// Helper to map frontend filters to API format
const mapFiltersToAPI = (filters, sort) => {
  const apiParams = {};
  
  // Map categories → category (API expects single category or comma-separated)
  if (filters.categories?.length) {
    apiParams.category = filters.categories.join(',');
  }
  
  // Map materials → material
  if (filters.materials?.length) {
    apiParams.material = filters.materials.join(',');
  }
  
  // Map colors → color
  if (filters.colors?.length) {
    apiParams.color = filters.colors.join(',');
  }
  
  // Price range
  if (filters.minPrice !== undefined && filters.minPrice !== '') {
    apiParams.minPrice = filters.minPrice;
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
    apiParams.maxPrice = filters.maxPrice;
  }
  
  // Rating
  if (filters.minRating) {
    apiParams.minRating = filters.minRating;
  }
  
  // Discount
  if (filters.minDiscount) {
    apiParams.minDiscount = filters.minDiscount;
  }
  
  // Stock
  if (filters.inStock) {
    apiParams.inStock = true;
  }
  
  // Search
  if (filters.search) {
    apiParams.search = filters.search;
  }
  
  // Map sort: UI format → API format
  let apiSort = sort;
  if (sort === 'price-asc') apiSort = 'price-low';
  if (sort === 'price-desc') apiSort = 'price-high';
  
  apiParams.sort = apiSort;
  
  return apiParams;
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const gridRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(() => searchParams.get('sort') || 'featured');
  const [currentPage, setCurrentPage] = useState(() => parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('productViewMode') || 'grid');
  const [showFilters, setShowFilters] = useState(!isMobile);

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

  // Memoized has active filters
  const hasActiveFilters = useMemo(() => activeFiltersCount > 0 || sort !== 'featured', [activeFiltersCount, sort]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle view mode persistence
  useEffect(() => {
    localStorage.setItem('productViewMode', viewMode);
  }, [viewMode]);

  // Handle mobile filters visibility
  useEffect(() => {
    setShowFilters(!isMobile);
  }, [isMobile]);

  // Sync URL params to filters (only on mount and URL changes)
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brand = searchParams.get('brand');
    const inStock = searchParams.get('inStock');
    const sortParam = searchParams.get('sort');
    const pageParam = searchParams.get('page');

    const urlFilters = {};
    if (category) urlFilters.categories = category.split(',');
    if (search) urlFilters.search = search;
    if (minPrice) urlFilters.minPrice = parseInt(minPrice);
    if (maxPrice) urlFilters.maxPrice = parseInt(maxPrice);
    if (brand) urlFilters.brands = brand.split(',');
    if (inStock === 'true') urlFilters.inStock = true;
    
    if (sortParam && sortParam !== sort) {
      setSort(sortParam);
    }
    
    if (pageParam && parseInt(pageParam) !== currentPage) {
      setCurrentPage(parseInt(pageParam));
    }

    setFilters(prev => ({ ...prev, ...urlFilters }));
  }, []); // Empty deps - only run on mount

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [debouncedFilters, sort, currentPage]);

  const fetchProducts = async () => {
    if (!isMountedRef.current || isFetchingRef.current) return;
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    isFetchingRef.current = true;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiParams = mapFiltersToAPI(filters, sort);
      
      const params = {
        ...apiParams,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };
      
      const response = await apiWrapper.getProducts(params);
      
      if (!isMountedRef.current) return;
      
      // Normalize the response
      const normalized = normalizeProductsResponse(response);
      
      setProducts(normalized.products);
      setTotalPages(normalized.pages);
      setTotalResults(normalized.total);
      
    } catch (err) {
      if (isMountedRef.current && err.name !== 'AbortError' && err.name !== 'CanceledError') {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setProducts([]);
        setTotalResults(0);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }
  };

  const handleRetry = useCallback(() => {
    fetchProducts();
  }, [filters, sort, currentPage]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.categories?.length) params.set('category', newFilters.categories.join(','));
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.brands?.length) params.set('brand', newFilters.brands.join(','));
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.inStock) params.set('inStock', 'true');
    if (sort !== 'featured') params.set('sort', sort);
    
    setSearchParams(params, { replace: true });
    setShowMobileFilters(false);
  }, [sort, setSearchParams]);

  const handleSortChange = useCallback((newSort) => {
    setSort(newSort);
    setCurrentPage(1);
    
    const params = new URLSearchParams(searchParams);
    if (newSort !== 'featured') {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }
    params.delete('page');
    
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params, { replace: true });
    
    // Smooth scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, setSearchParams]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSort('featured');
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Track scroll position for back to top button
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          {/* Desktop Filters - Sticky on left side */}
          {!isMobile && showFilters && (
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onSortChange={handleSortChange}
                  currentSort={sort}
                  totalResults={totalResults}
                  onToggle={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div ref={gridRef} className="flex-1 min-w-0 w-full">
            {!isMobile && !showFilters && (
              <button
                onClick={() => setShowFilters(true)}
                className="mb-4 hidden lg:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-300 transition-colors"
              >
                Show Filters
              </button>
            )}

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
              currentPage={currentPage}
              totalPages={totalPages}
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

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="mt-8 mb-4 sm:mb-8 flex justify-center pb-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  siblingCount={isMobile ? 0 : 1}
                  size={isMobile ? "sm" : "md"}
                  showFirstLast={!isMobile}
                />
              </div>
            )}
          </div>
        </div>

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

        {/* Scroll to Top Button */}
        {isScrolled && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-2.5 sm:p-3 bg-primary-600 text-white rounded-full shadow-lg shadow-primary-500/30 hover:bg-primary-700 z-40 transition-colors"
            aria-label="Scroll to top"
          >
            <FiArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Products;