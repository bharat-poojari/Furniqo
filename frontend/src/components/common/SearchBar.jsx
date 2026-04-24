// src/components/common/SearchBar.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiTrendingUp, FiClock } from 'react-icons/fi';
import apiWrapper from '../../services/apiWrapper';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/cn';
import { formatPrice } from '../../utils/helpers';

const SearchBar = ({ onClose, variant = 'header' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Load recent searches
    try {
      const saved = localStorage.getItem('furniqo_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }

    // Keyboard shortcut to close
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchProducts(debouncedQuery);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const searchProducts = async (searchQuery) => {
    setLoading(true);
    setSelectedIndex(-1);
    
    try {
      const response = await apiWrapper.searchProducts(searchQuery);
      if (response.data.success) {
        setResults(response.data.data.slice(0, 8));
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  };

  const handleResultClick = (slug) => {
    saveRecentSearch(query.trim());
    navigate(`/products/${slug}`);
    onClose?.();
  };

  const handleRecentSearchClick = (term) => {
    setQuery(term);
    navigate(`/products?search=${encodeURIComponent(term)}`);
    onClose?.();
  };

  const saveRecentSearch = (term) => {
    try {
      const saved = JSON.parse(localStorage.getItem('furniqo_recent_searches') || '[]');
      const updated = [term, ...saved.filter(s => s !== term)].slice(0, 10);
      localStorage.setItem('furniqo_recent_searches', JSON.stringify(updated));
      setRecentSearches(updated.slice(0, 5));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex].slug);
        } else if (query.trim()) {
          handleSubmit(e);
        }
        break;
      default:
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const trendingSearches = [
    'Sofa', 'Bed Frame', 'Dining Table', 'Office Chair', 'Bookshelf', 'Accent Chair'
  ];

  const isFullPage = variant === 'fullpage' || variant === 'overlay';

  return (
    <div className={cn(
      'w-full',
      isFullPage && 'fixed inset-0 z-50 bg-white dark:bg-neutral-950 flex items-start justify-center pt-20 px-4'
    )}>
      <div className={cn(
        'w-full',
        isFullPage ? 'max-w-2xl' : 'max-w-full'
      )}>
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            {/* Search Icon */}
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            
            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Search for furniture, categories, styles..."
              className={cn(
                'w-full bg-neutral-100 dark:bg-neutral-800 border-2 border-transparent',
                'focus:border-primary-500 focus:bg-white dark:focus:bg-neutral-900',
                'rounded-2xl transition-all duration-200',
                'placeholder-neutral-400 dark:placeholder-neutral-500',
                'focus:outline-none',
                isFullPage ? 'py-4 pl-14 pr-12 text-lg' : 'py-3 pl-12 pr-10 text-base'
              )}
            />
            
            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}

            {/* Close Button (Full Page Mode) */}
            {isFullPage && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute -top-16 right-0 p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                aria-label="Close search"
              >
                <FiX className="h-6 w-6" />
              </button>
            )}
          </div>
        </form>

        {/* Results Dropdown / Panel */}
        <div className={cn(
          'bg-white dark:bg-neutral-900 rounded-2xl shadow-hard border border-neutral-200 dark:border-neutral-700',
          isFullPage ? 'mt-6' : 'absolute mt-2 left-0 right-0 z-50 max-h-[70vh] overflow-hidden',
          (!isOpen && !query) ? 'block' : (isOpen || (!query && !isFullPage)) ? 'block' : 'hidden'
        )}>
          {/* Loading State */}
          {loading && (
            <div className="p-6 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-primary-600 border-t-transparent rounded-full  mb-2" />
              <p className="text-sm text-neutral-500">Searching...</p>
            </div>
          )}

          {/* Search Results */}
          {!loading && isOpen && results.length > 0 && (
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="px-4 pt-4 pb-2">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Products ({results.length})
                </p>
              </div>
              <div ref={resultsRef}>
                {results.map((product, index) => (
                  <button
                    key={product._id}
                    onClick={() => handleResultClick(product.slug)}
                    className={cn(
                      'w-full flex items-center gap-4 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left',
                      index === selectedIndex && 'bg-neutral-50 dark:bg-neutral-800'
                    )}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-xl flex-shrink-0 bg-neutral-100 dark:bg-neutral-800"
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-medium text-neutral-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-neutral-500 truncate">
                        {product.category} • {product.material}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-primary-600">
                        {formatPrice(product.price)}
                      </p>
                      {product.originalPrice > product.price && (
                        <p className="text-xs text-neutral-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && isOpen && results.length === 0 && query.length >= 2 && (
            <div className="p-8 text-center">
              <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center  mb-4">
                <FiSearch className="h-6 w-6 text-neutral-400" />
              </div>
              <p className="font-medium text-neutral-900 dark:text-white mb-1">
                No results found for "{query}"
              </p>
              <p className="text-sm text-neutral-500">
                Try adjusting your search or browse our categories
              </p>
            </div>
          )}

          {/* Empty State - Show suggestions when no query */}
          {!loading && !isOpen && query.length === 0 && (
            <div className="p-4">
              {/* Trending Searches */}
              {trendingSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <FiTrendingUp className="h-4 w-4 text-primary-600" />
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Trending Searches
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentSearchClick(term)}
                        className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <FiClock className="h-4 w-4 text-neutral-500" />
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Recent Searches
                    </p>
                    <button
                      onClick={() => {
                        localStorage.removeItem('furniqo_recent_searches');
                        setRecentSearches([]);
                      }}
                      className="ml-auto text-xs text-primary-600 hover:text-primary-700"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(term)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left transition-colors group"
                      >
                        <FiClock className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                          {term}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Links */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 p-2 flex gap-1">
            {[
              { label: 'Living Room', href: '/products?category=Living%20Room' },
              { label: 'Bedroom', href: '/products?category=Bedroom' },
              { label: 'Office', href: '/products?category=Office' },
              { label: 'On Sale', href: '/offers' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.href);
                  onClose?.();
                }}
                className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Backdrop for non-modal variant */}
        {!isFullPage && isOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;