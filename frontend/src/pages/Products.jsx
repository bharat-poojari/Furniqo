import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiList, FiSliders } from 'react-icons/fi';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import Pagination from '../components/common/Pagination';
import Breadcrumb from '../components/common/Breadcrumb';
import apiWrapper from '../services/apiWrapper';
import { useDebounce } from '../hooks/useDebounce';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  
  const debouncedFilters = useDebounce(filters, 300);

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortParam = searchParams.get('sort');
    const pageParam = searchParams.get('page');
    
    const initialFilters = {};
    if (category) initialFilters.categories = [category];
    
    setFilters(initialFilters);
    if (sortParam) setSort(sortParam);
    if (pageParam) setCurrentPage(parseInt(pageParam));
    if (search) {
      // Handle search query
    }
  }, [searchParams]);

  // Fetch products when filters/sort/page change
  useEffect(() => {
    fetchProducts();
  }, [debouncedFilters, sort, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...filters,
        sort,
        page: currentPage,
        limit: 12,
      };
      
      const response = await apiWrapper.getProducts(params);
      
      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalResults(response.data.pagination?.total || response.data.data.length);
      } else {
        setError(response.data.message || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    
    if (newFilters.categories?.length === 1) {
      params.set('category', newFilters.categories[0]);
    } else {
      params.delete('category');
    }
    
    setSearchParams(params);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSort('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  const breadcrumbItems = [
    { label: 'Products', href: '/products' },
  ];
  
  if (filters.categories?.[0]) {
    breadcrumbItems.push({ label: filters.categories[0] });
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-[1%] sm:px-[1.5%] py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-2">
              {filters.categories?.[0] || 'All Products'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {loading ? 'Searching...' : `${totalResults} product${totalResults !== 1 ? 's' : ''} found`}
            </p>
          </motion.div>
          
          {/* View Mode Toggle (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 mt-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' : 'text-neutral-400 hover:text-neutral-600'}`}
              aria-label="Grid view"
            >
              <FiGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' : 'text-neutral-400 hover:text-neutral-600'}`}
              aria-label="List view"
            >
              <FiList className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            currentSort={sort}
            onClearFilters={handleClearFilters}
            totalResults={totalResults}
          />

          {/* Main Content */}
          <div className="flex-grow min-w-0">
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              emptyMessage={
                filters.categories?.[0]
                  ? `No products found in ${filters.categories[0]}. Try adjusting your filters.`
                  : 'No products found. Try adjusting your search or filters.'
              }
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;