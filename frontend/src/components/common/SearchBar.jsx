import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  FiSearch, FiX, FiTrendingUp, FiClock, FiArrowRight, 
  FiGrid, FiPackage, FiTag, FiStar,
  FiHome, FiLayers
} from 'react-icons/fi';
import apiWrapper from '../../services/apiWrapper';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/cn';
import { formatPrice } from '../../utils/helpers';

// Custom SVG Icons
const SofaIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 11h16v4H4zM4 15l-1 3h18l-1-3M7 11V9a5 5 0 0110 0v2" />
  </svg>
);

const BedIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 10l1-4h16l1 4M3 14v6h18v-6M7 14v6M17 14v6" />
  </svg>
);

const DeskIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 8v8h16V8M12 8v10M8 18v3M16 18v3" />
  </svg>
);

const TableIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 6v12h16V6M12 6v12M4 10h16M4 14h16" />
  </svg>
);

// Constants
const RECENT_SEARCHES_KEY = 'furniqo_recent_searches';
const MAX_RECENT_SEARCHES = 10;
const MAX_DISPLAY_RECENT = 5;
const SEARCH_DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;
const MAX_RESULTS = 8;

const TRENDING_SEARCHES = [
  { term: 'Sofa', category: 'Living Room', icon: SofaIcon, count: '2.3k' },
  { term: 'Bed Frame', category: 'Bedroom', icon: BedIcon, count: '1.8k' },
  { term: 'Dining Table', category: 'Dining', icon: TableIcon, count: '1.5k' },
  { term: 'Office Chair', category: 'Office', icon: DeskIcon, count: '1.2k' },
  { term: 'Bookshelf', category: 'Storage', icon: FiLayers, count: '892' },
  { term: 'Accent Chair', category: 'Living Room', icon: SofaIcon, count: '654' },
];

const QUICK_CATEGORIES = [
  { label: 'Living', icon: SofaIcon, color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' },
  { label: 'Bedroom', icon: BedIcon, color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
  { label: 'Office', icon: DeskIcon, color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
  { label: 'Dining', icon: TableIcon, color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
  { label: 'Sale', icon: FiTag, color: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
];

const SearchBar = ({ 
  isOpen, 
  onClose, 
  placeholder = 'Search furniture...',
  autoFocus = true,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isClosing, setIsClosing] = useState(false);
  
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_DELAY);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Load recent searches
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRecentSearches(Array.isArray(parsed) ? parsed.slice(0, MAX_DISPLAY_RECENT) : []);
      }
    } catch (error) {}
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Auto focus with smooth delay
  useEffect(() => {
    if (autoFocus && isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
        inputRef.current.select();
      }, 200);
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
        setResults(response.data.data?.slice(0, MAX_RESULTS) || []);
      }
    } catch (error) {
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
    try {
      const saved = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
      const updated = [term.trim(), ...saved.filter(s => s !== term.trim())].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      setRecentSearches(updated.slice(0, MAX_DISPLAY_RECENT));
    } catch (error) {}
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
      setIsClosing(false);
      onClose?.();
    }, 200);
  }, [onClose]);

  const performSearch = useCallback((searchTerm) => {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;
    saveRecentSearch(trimmedTerm);
    navigate({ pathname: '/products', search: createSearchParams({ search: trimmedTerm }).toString() });
    handleClose();
  }, [saveRecentSearch, navigate, handleClose]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (query.trim()) performSearch(query);
  }, [query, performSearch]);

  const handleResultClick = useCallback((product) => {
    if (product?.slug) {
      saveRecentSearch(product.name);
      navigate(`/products/${product.slug}`);
      handleClose();
    }
  }, [saveRecentSearch, navigate, handleClose]);

  const handleRecentClick = useCallback((term) => {
    setQuery(term);
    performSearch(term);
  }, [performSearch]);

  const handleClearAllRecent = useCallback(() => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  }, []);

  const handleCategoryClick = useCallback((category) => {
    navigate({ pathname: '/products', search: createSearchParams({ category }).toString() });
    handleClose();
  }, [navigate, handleClose]);

  const handleSaleClick = useCallback(() => {
    navigate({ pathname: '/products', search: createSearchParams({ onSale: 'true' }).toString() });
    handleClose();
  }, [navigate, handleClose]);

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
    }
  }, [isOpen, totalItems, selectedIndex, results, query, handleResultClick, handleSubmit]);

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const el = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const showEmptyState = query.length === 0 || query.length < MIN_SEARCH_LENGTH;
  const hasResults = results.length > 0;

  // Memoized trending searches
  const trendingSearchesElements = useMemo(() => (
    <div className="grid grid-cols-2 gap-2">
      {TRENDING_SEARCHES.map(({ term, category, icon: Icon, count }, idx) => (
        <button
          key={term}
          onClick={() => handleRecentClick(term)}
          className="flex items-center gap-3 p-2.5 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all duration-150 group text-left active:scale-98"
        >
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-150 shadow-sm">
            <Icon className="h-4 w-4 text-primary-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold dark:text-white truncate">{term}</p>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-neutral-500">{category}</p>
              <span className="text-[10px] text-neutral-400">{count} searches</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  ), [handleRecentClick]);

  // Memoized recent searches
  const recentSearchesElements = useMemo(() => {
    if (recentSearches.length === 0) return null;
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FiClock className="h-3.5 w-3.5 text-neutral-500" />
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Recent</p>
          </div>
          <button
            onClick={handleClearAllRecent}
            className="text-[10px] text-primary-600 hover:text-primary-700 font-medium transition-colors duration-150 active:scale-95"
          >
            Clear all
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {recentSearches.map((term, i) => (
            <button
              key={i}
              onClick={() => handleRecentClick(term)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-xs text-neutral-600 dark:text-neutral-400 transition-all duration-150 active:scale-95"
            >
              <FiClock className="h-3 w-3" />
              {term}
            </button>
          ))}
        </div>
      </div>
    );
  }, [recentSearches, handleClearAllRecent, handleRecentClick]);

  // Memoized categories
  const categoriesElements = useMemo(() => (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <FiGrid className="h-3.5 w-3.5 text-primary-500" />
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Categories</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <button
              key={cat.label}
              onClick={() => cat.label === 'Sale' ? handleSaleClick() : handleCategoryClick(cat.label)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 active:scale-95",
                cat.color
              )}
            >
              <IconComponent className="h-3 w-3" />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  ), [handleCategoryClick, handleSaleClick]);

  if (!isOpen && !isClosing) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] p-4">
      {/* Backdrop with smooth fade */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={handleClose}
      />
      
      {/* Modal with simplified transition */}
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-neutral-900 w-full max-w-xl rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[70vh] overflow-hidden transition-all duration-200"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-3 border-b border-neutral-100 dark:border-neutral-800">
          <form onSubmit={handleSubmit} className="relative">
            <div>
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full pl-10 pr-16 py-2.5 text-sm rounded-xl border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:border-primary-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:text-white placeholder-neutral-400 transition-all duration-150"
                autoFocus={autoFocus}
              />
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {loading && (
                <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full" />
              )}
              {query && !loading && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
                  className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors duration-150 active:scale-95"
                >
                  <FiX className="h-3.5 w-3.5 text-neutral-400" />
                </button>
              )}
              <button
                type="submit"
                className="px-3 py-1.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-150 shadow-sm hover:shadow active:scale-95"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!showEmptyState ? (
            <div className="p-3">
              {loading && results.length === 0 ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 animate-pulse" />
                        <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : hasResults ? (
                <div ref={resultsRef} className="space-y-1">
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    {results.length} results
                  </p>
                  <div>
                    {results.map((product, index) => (
                      <button
                        key={product._id}
                        data-index={index}
                        onClick={() => handleResultClick(product)}
                        className={cn(
                          "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-150 text-left active:scale-98",
                          index === selectedIndex && "bg-neutral-50 dark:bg-neutral-800/50 ring-1 ring-primary-500/20"
                        )}
                      >
                        <img
                          src={product.images?.[0] || '/images/placeholder.jpg'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 transition-transform duration-150 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium dark:text-white truncate">{product.name}</p>
                          <p className="text-xs text-neutral-500">{product.category}</p>
                        </div>
                        <p className="text-sm font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent flex-shrink-0">
                          {formatPrice(product.price)}
                        </p>
                      </button>
                    ))}
                  </div>
                  {results.length === MAX_RESULTS && (
                    <button
                      onClick={() => performSearch(query)}
                      className="w-full mt-2 py-2 text-xs font-medium text-primary-600 hover:text-primary-700 text-center hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-150 active:scale-98"
                    >
                      View all results →
                    </button>
                  )}
                </div>
              ) : !loading && (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FiSearch className="h-5 w-5 text-neutral-400" />
                  </div>
                  <p className="text-sm font-medium dark:text-white mb-1">No results for "{query}"</p>
                  <p className="text-xs text-neutral-500">Try a different search term</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              {/* Trending */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <FiTrendingUp className="h-4 w-4 text-primary-500" />
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Trending</p>
                </div>
                {trendingSearchesElements}
              </div>

              {/* Recent */}
              {recentSearchesElements}

              {/* Categories */}
              {categoriesElements}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-3 py-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><FiSearch className="h-2.5 w-2.5" /> Search</span>
            <span className="flex items-center gap-1"><FiTrendingUp className="h-2.5 w-2.5" /> Trending</span>
            <span className="flex items-center gap-1"><FiGrid className="h-2.5 w-2.5" /> Categories</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-[9px] font-mono shadow-sm">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SearchBar;