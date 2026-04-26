import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowUp, FiRefreshCw, FiAlertCircle, FiGrid, FiList, FiChevronDown, FiX
} from 'react-icons/fi';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { useMediaQuery } from '../hooks/useMediaQuery';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 12;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const gridRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(() => searchParams.get('sort') || 'featured');
  const [currentPage, setCurrentPage] = useState(() => parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('productViewMode') || 'grid');
  const [showFilters, setShowFilters] = useState(!isMobile);

  const debouncedFilters = useDebounce(filters, 300);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile filter toggle
  useEffect(() => {
    setShowFilters(!isMobile);
  }, [isMobile]);

  // Save view mode
  useEffect(() => {
    localStorage.setItem('productViewMode', viewMode);
  }, [viewMode]);

  // Parse URL params to filters
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brand = searchParams.get('brand');
    const inStock = searchParams.get('inStock');

    const urlFilters = {};
    if (category) urlFilters.categories = category.split(',');
    if (search) urlFilters.search = search;
    if (minPrice) urlFilters.minPrice = parseInt(minPrice);
    if (maxPrice) urlFilters.maxPrice = parseInt(maxPrice);
    if (brand) urlFilters.brands = brand.split(',');
    if (inStock === 'true') urlFilters.inStock = true;

    setFilters(prev => ({ ...prev, ...urlFilters }));
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [debouncedFilters, sort, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        ...debouncedFilters,
        sort,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      };

      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '' || 
            (Array.isArray(params[key]) && params[key].length === 0)) {
          delete params[key];
        }
      });

      const response = await apiWrapper.getProducts(params);

      if (response.data.success) {
        setProducts(response.data.data || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalResults(response.data.pagination?.total || response.data.data?.length || 0);
      } else {
        throw new Error(response.data.message || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchProducts();
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
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
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.brands?.length) count += filters.brands.length;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.inStock) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSort('featured');
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters = activeFiltersCount > 0 || sort !== 'featured';

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-[98%] mx-auto py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {filters.search 
                  ? `Results for "${filters.search}"`
                  : filters.categories?.[0] || 'All Products'
                }
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
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

            {/* Controls */}
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <FiX className="h-4 w-4" />
                  Clear all
                </button>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600' : 'text-neutral-400 hover:text-neutral-600'}`}
                >
                  <FiGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600' : 'text-neutral-400 hover:text-neutral-600'}`}
                >
                  <FiList className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              {isMobile && (
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium hover:border-primary-300 transition-colors"
                >
                  Filters{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="flex gap-6">
          {/* Filter Sidebar - Desktop */}
          {!isMobile && showFilters && (
            <div className="w-64 flex-shrink-0">
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
          <div ref={gridRef} className="flex-1 min-w-0">
            {/* Desktop Filter Toggle */}
            {!isMobile && !showFilters && (
              <button
                onClick={() => setShowFilters(true)}
                className="mb-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-300 transition-colors"
              >
                Show Filters
              </button>
            )}

            {/* Error State */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <FiAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300 flex-1">{error}</p>
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 text-sm font-semibold border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-700 dark:text-red-300 flex items-center gap-2"
                    >
                      <FiRefreshCw className="h-3 w-3" /> Retry
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Grid */}
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex justify-center"
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  siblingCount={isMobile ? 0 : 1}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        <AnimatePresence>
          {showMobileFilters && isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-neutral-900 shadow-2xl overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold dark:text-white">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <ProductFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                    currentSort={sort}
                    totalResults={totalResults}
                    isMobile={true}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll to Top */}
        <AnimatePresence>
          {isScrolled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 p-3 bg-primary-600 text-white rounded-full shadow-lg shadow-primary-500/30 hover:bg-primary-700 z-40 transition-colors"
              aria-label="Scroll to top"
            >
              <FiArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Products;