// src/components/common/SearchBar.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  FiSearch, FiX, FiTrendingUp, FiClock, FiArrowRight, 
  FiGrid, FiPackage, FiTag, FiStar, FiShoppingBag, 
  FiBriefcase, FiHome, FiTool, FiLayers
} from 'react-icons/fi';
import apiWrapper from '../../services/apiWrapper';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/cn';
import { formatPrice } from '../../utils/helpers';

// Constants
const RECENT_SEARCHES_KEY = 'furniqo_recent_searches';
const MAX_RECENT_SEARCHES = 10;
const MAX_DISPLAY_RECENT = 5;
const SEARCH_DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;
const MAX_RESULTS = 8;

const TRENDING_SEARCHES = [
  { term: 'Sofa', category: 'Living Room', icon: <FiPackage className="h-3 w-3" />, count: '2.3k' },
  { term: 'Bed Frame', category: 'Bedroom', icon: <FiHome className="h-3 w-3" />, count: '1.8k' },
  { term: 'Dining Table', category: 'Dining', icon: <FiTool className="h-3 w-3" />, count: '1.5k' },
  { term: 'Office Chair', category: 'Office', icon: <FiBriefcase className="h-3 w-3" />, count: '1.2k' },
  { term: 'Bookshelf', category: 'Storage', icon: <FiLayers className="h-3 w-3" />, count: '892' },
  { term: 'Accent Chair', category: 'Living Room', icon: <FiPackage className="h-3 w-3" />, count: '654' },
];

const QUICK_CATEGORIES = [
  { label: 'Living', icon: <FiGrid className="h-3.5 w-3.5" />, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' },
  { label: 'Bedroom', icon: <FiHome className="h-3.5 w-3.5" />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
  { label: 'Office', icon: <FiBriefcase className="h-3.5 w-3.5" />, color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
  { label: 'Dining', icon: <FiTool className="h-3.5 w-3.5" />, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
  { label: 'Sale', icon: <FiTag className="h-3.5 w-3.5" />, color: 'bg-red-100 dark:bg-red-900/30 text-red-600' },
];

const SearchBar = ({ 
  isOpen, 
  onClose, 
  placeholder = 'Search furniture...',
  autoFocus = true,
  onSearch,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_DELAY);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = useCallback(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRecentSearches(Array.isArray(parsed) ? parsed.slice(0, MAX_DISPLAY_RECENT) : []);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [autoFocus, isOpen]);

  // Search products
  const searchProducts = useCallback(async (searchQuery) => {
    if (searchQuery.length < MIN_SEARCH_LENGTH) {
      setResults([]);
      return;
    }

    setLoading(true);
    setSelectedIndex(-1);
    
    try {
      const response = await apiWrapper.searchProducts(searchQuery);
      if (response.data?.success) {
        const products = response.data.data?.slice(0, MAX_RESULTS) || [];
        setResults(products);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();
    if (trimmedQuery.length >= MIN_SEARCH_LENGTH) {
      searchProducts(trimmedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, searchProducts]);

  const saveRecentSearch = useCallback((term) => {
    if (!term?.trim()) return;
    
    const trimmedTerm = term.trim();
    try {
      const saved = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
      const updated = [trimmedTerm, ...saved.filter(s => s !== trimmedTerm)].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      setRecentSearches(updated.slice(0, MAX_DISPLAY_RECENT));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleClose = useCallback(() => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    onClose?.();
  }, [onClose]);

  const performSearch = useCallback((searchTerm) => {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;
    
    saveRecentSearch(trimmedTerm);
    
    if (onSearch) {
      onSearch(trimmedTerm);
    } else {
      navigate({
        pathname: '/products',
        search: createSearchParams({ search: trimmedTerm }).toString()
      });
    }
    
    handleClose();
  }, [saveRecentSearch, onSearch, navigate, handleClose]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  }, [query, performSearch]);

  const handleResultClick = useCallback((product) => {
    if (product?.slug) {
      saveRecentSearch(product.name);
      navigate(`/products/${product.slug}`);
      handleClose();
    }
  }, [saveRecentSearch, navigate, handleClose]);

  const handleRecentSearchClick = useCallback((term) => {
    setQuery(term);
    performSearch(term);
  }, [performSearch]);

  const handleClearAllRecent = useCallback(() => {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }, []);

  const handleCategoryClick = useCallback((category) => {
    navigate({
      pathname: '/products',
      search: createSearchParams({ category }).toString()
    });
    handleClose();
  }, [navigate, handleClose]);

  const handleSaleClick = useCallback(() => {
    navigate({
      pathname: '/products',
      search: createSearchParams({ onSale: 'true' }).toString()
    });
    handleClose();
  }, [navigate, handleClose]);

  // Keyboard navigation for results
  const totalItems = results.length;
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < totalItems - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < totalItems) {
          handleResultClick(results[selectedIndex]);
        } else if (query.trim()) {
          handleSubmit(e);
        }
        break;
      default:
        break;
    }
  }, [isOpen, totalItems, selectedIndex, results, query, handleResultClick, handleSubmit]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const hasResults = results.length > 0;
  const showEmptyState = query.length === 0 || query.length < MIN_SEARCH_LENGTH;

  // Render product result - compact version
  const renderProductResult = (product, index) => (
    <button
      key={product._id}
      data-index={index}
      onClick={() => handleResultClick(product)}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-150 text-left group',
        index === selectedIndex && 'bg-neutral-50 dark:bg-neutral-800/50 ring-1 ring-primary-500/20'
      )}
      role="option"
      aria-selected={index === selectedIndex}
    >
      <div className="relative flex-shrink-0">
        <img
          src={product.images?.[0] || '/images/placeholder.jpg'}
          alt={product.name}
          className="w-10 h-10 object-cover rounded-lg bg-neutral-100 dark:bg-neutral-800"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
          }}
        />
        {product.discountPercentage > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
            -{product.discountPercentage}%
          </span>
        )}
      </div>
      
      <div className="flex-grow min-w-0">
        <p className="font-medium text-sm text-neutral-900 dark:text-white truncate">
          {product.name}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <span className="text-xs">{product.category}</span>
          {product.rating > 0 && (
            <div className="flex items-center gap-0.5">
              <FiStar className="h-2.5 w-2.5 text-yellow-500 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-sm text-primary-600 dark:text-primary-400">
          {formatPrice(product.price)}
        </p>
        {product.originalPrice > product.price && (
          <p className="text-xs text-neutral-400 line-through">
            {formatPrice(product.originalPrice)}
          </p>
        )}
      </div>
    </button>
  );

  // Render trending searches - compact version
  const renderTrendingSearches = () => (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-2">
        <FiTrendingUp className="h-3.5 w-3.5 text-primary-500" />
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Trending
        </p>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {TRENDING_SEARCHES.map(({ term, category, icon, count }) => (
          <button
            key={term}
            onClick={() => handleRecentSearchClick(term)}
            className="group flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-150"
          >
            <div className="flex items-center gap-2">
              <div className="p-1 bg-white dark:bg-neutral-900 rounded-md text-primary-500">
                {icon}
              </div>
              <div className="text-left">
                <p className="font-medium text-neutral-900 dark:text-white text-xs">{term}</p>
                <p className="text-xs text-neutral-500">{category}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-400">{count}</p>
          </button>
        ))}
      </div>
    </div>
  );

  // Render recent searches - compact version
  const renderRecentSearches = () => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <FiClock className="h-3.5 w-3.5 text-neutral-500" />
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Recent
          </p>
        </div>
        <button
          onClick={handleClearAllRecent}
          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
        >
          Clear
        </button>
      </div>
      <div className="space-y-0.5">
        {recentSearches.map((term, index) => (
          <button
            key={index}
            onClick={() => handleRecentSearchClick(term)}
            className="w-full flex items-center justify-between group px-2 py-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-150"
          >
            <div className="flex items-center gap-2">
              <FiClock className="h-3 w-3 text-neutral-400" />
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                {term}
              </span>
            </div>
            <FiArrowRight className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );

  // Render quick categories - compact version
  const renderQuickCategories = () => (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <FiGrid className="h-3.5 w-3.5 text-primary-500" />
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Categories
        </p>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {QUICK_CATEGORIES.map((category) => (
          <button
            key={category.label}
            onClick={() => category.label === 'Sale' ? handleSaleClick() : handleCategoryClick(category.label)}
            className={cn(
              'flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-150 text-xs font-medium',
              category.color
            )}
          >
            {category.icon}
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  // Modal content
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
        onClick={handleClose}
      />
      
      {/* Modal Container - Smaller and more compact */}
      <div 
        ref={modalRef}
        className={cn(
          'relative bg-white dark:bg-neutral-900 shadow-xl',
          'w-full max-w-3xl h-auto max-h-[80vh] flex flex-col',
          'animate-in slide-in-from-top-4 duration-300',
          'rounded-xl'
        )}
      >
        {/* Modal Header - Compact */}
        <div className="flex-shrink-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 rounded-t-xl">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Search</h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close search"
              >
                <FiX className="h-4 w-4 text-neutral-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative group">
                <FiSearch className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors",
                  "group-focus-within:text-primary-500",
                  "h-4 w-4"
                )} />
                
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  aria-label="Search"
                  aria-expanded={isOpen}
                  aria-autocomplete="list"
                  className={cn(
                    'w-full bg-neutral-100 dark:bg-neutral-800 border border-transparent',
                    'focus:border-primary-500 focus:bg-white dark:focus:bg-neutral-900',
                    'rounded-lg transition-all duration-200',
                    'placeholder-neutral-400 dark:placeholder-neutral-500 text-sm',
                    'focus:outline-none focus:ring-1 focus:ring-primary-500/20',
                    'py-2 pl-9 pr-20'
                  )}
                  autoFocus={autoFocus}
                />
                
                {loading && (
                  <div className="absolute right-14 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-3.5 w-3.5 border-2 border-primary-500 border-t-transparent rounded-full" />
                  </div>
                )}
                
                {query && !loading && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-400 transition-colors"
                    aria-label="Clear search"
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                )}

                {/* Search Button - Compact */}
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-xs font-medium rounded-md transition-all duration-200"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Body - Scrollable with compact padding */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Results Section */}
          {!showEmptyState && (
            <div id="search-results" className="p-3">
              {loading && results.length === 0 ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                        <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : hasResults ? (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Results ({results.length})
                    </p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1">
                      <span>↑↓</span> navigate
                    </p>
                  </div>
                  <div ref={resultsRef} className="space-y-0.5">
                    {results.map((product, index) => renderProductResult(product, index))}
                  </div>
                  {results.length === MAX_RESULTS && (
                    <button
                      onClick={() => performSearch(query)}
                      className="w-full mt-3 py-2 text-center text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 border-t border-neutral-200 dark:border-neutral-800 pt-3 hover:bg-neutral-50 rounded-md transition-all"
                    >
                      View all "{query}" results →
                    </button>
                  )}
                </div>
              ) : !loading && (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FiSearch className="h-5 w-5 text-neutral-400" />
                  </div>
                  <p className="font-semibold text-neutral-900 dark:text-white text-sm mb-1">
                    No results found
                  </p>
                  <p className="text-xs text-neutral-500">
                    Try checking your spelling
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Initial State - Compact */}
          {showEmptyState && (
            <div className="p-3">
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-full mb-2">
                  <FiSearch className="h-3 w-3 text-primary-500" />
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                    Find your furniture
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  What are you looking for?
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {renderTrendingSearches()}
                  {recentSearches.length > 0 && renderRecentSearches()}
                </div>
                <div>
                  {renderQuickCategories()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer - Compact */}
        <div className="flex-shrink-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-3 py-2 rounded-b-xl">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FiSearch className="h-3 w-3" />
                <span>Search</span>
              </div>
              <div className="flex items-center gap-1">
                <FiGrid className="h-3 w-3" />
                <span>Categories</span>
              </div>
              <div className="flex items-center gap-1">
                <FiTrendingUp className="h-3 w-3" />
                <span>Trending</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-[10px] font-mono">ESC</kbd>
              <span className="text-[10px]">close</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Add custom scrollbar styles
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background: #2d2d2d;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4a4a4a;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #606060;
  }
`;
document.head.appendChild(style);

export default SearchBar;