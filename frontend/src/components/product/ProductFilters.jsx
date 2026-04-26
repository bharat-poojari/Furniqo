import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck, FiRefreshCw, FiX, FiStar, FiSliders } from 'react-icons/fi';
import { cn } from '../../utils/cn';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'discount', label: 'Biggest Discount' },
];

const FILTER_OPTIONS = {
  categories: ['Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor', 'Lighting', 'Decor', 'Storage'],
  materials: ['Wood', 'Metal', 'Glass', 'Fabric', 'Leather', 'Marble'],
  colors: [
    { value: 'black', label: 'Black', hex: '#1a1a1a' },
    { value: 'white', label: 'White', hex: '#ffffff' },
    { value: 'brown', label: 'Brown', hex: '#8b4513' },
    { value: 'gray', label: 'Gray', hex: '#808080' },
    { value: 'blue', label: 'Blue', hex: '#4169e1' },
    { value: 'green', label: 'Green', hex: '#2e8b57' },
    { value: 'red', label: 'Red', hex: '#dc2626' },
  ],
};

const ProductFilters = ({ filters, onFilterChange, onSortChange, currentSort, totalResults, onToggle, isMobile }) => {
  const [localPriceRange, setLocalPriceRange] = useState({ min: filters.minPrice ?? '', max: filters.maxPrice ?? '' });
  const [openSections, setOpenSections] = useState({
    sort: true,
    categories: true,
    price: true,
    rating: true,
    discount: true,
    material: true,
    color: true,
  });
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef(null);
  const priceTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Prevent body scroll when filter is open on mobile
  useEffect(() => {
    if (isMobile && scrollContainerRef.current) {
      // Don't lock body scroll, let the filter container handle its own scrolling
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setLocalPriceRange({ min: filters.minPrice ?? '', max: filters.maxPrice ?? '' });
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceInputChange = (type, value) => {
    if (value === '' || /^\d+$/.test(value)) {
      setLocalPriceRange(prev => ({ ...prev, [type]: value }));
    }
  };

  useEffect(() => {
    if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
    priceTimeoutRef.current = setTimeout(() => {
      const newMin = localPriceRange.min === '' ? undefined : Number(localPriceRange.min);
      const newMax = localPriceRange.max === '' ? undefined : Number(localPriceRange.max);
      if (newMin !== (filters.minPrice ?? undefined) || newMax !== (filters.maxPrice ?? undefined)) {
        onFilterChange({ ...filters, minPrice: newMin, maxPrice: newMax });
      }
    }, 500);
    return () => clearTimeout(priceTimeoutRef.current);
  }, [localPriceRange.min, localPriceRange.max]);

  const handleCheckboxChange = (type, value) => {
    const currentValues = [...(filters[type] || [])];
    if (currentValues.includes(value)) {
      const updatedValues = currentValues.filter(v => v !== value);
      onFilterChange({ ...filters, [type]: updatedValues.length > 0 ? updatedValues : undefined });
    } else {
      onFilterChange({ ...filters, [type]: [...currentValues, value] });
    }
  };

  const handleRadioChange = (type, value) => {
    onFilterChange({ ...filters, [type]: filters[type] === value ? undefined : value });
  };

  const handleSortSelect = (value) => {
    onSortChange(value);
    setShowSortDropdown(false);
  };

  const handleInStockToggle = () => {
    onFilterChange({ ...filters, inStock: !filters.inStock ? true : undefined });
  };

  const handleResetFilters = () => {
    setLocalPriceRange({ min: '', max: '' });
    onFilterChange({});
    if (onSortChange) onSortChange('featured');
  };

  const hasActiveFilters = () => {
    let count = 0;
    if (filters.categories?.length) count++;
    if (filters.materials?.length) count++;
    if (filters.colors?.length) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.minDiscount) count++;
    if (filters.inStock) count++;
    return count;
  };

  const activeCount = hasActiveFilters();
  const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === currentSort)?.label || 'Featured';

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
      <button
        onClick={() => setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
      >
        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">{title}</span>
        <FiChevronDown className={cn("h-4 w-4 text-neutral-400 transition-transform", openSections[section] && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {openSections[section] && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Desktop version - independent scrollable container
  if (!isMobile) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col h-full max-h-[calc(100vh-120px)]">
        {/* Header - Sticky */}
        <div className="flex-shrink-0 sticky top-0 z-10 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50">
            <div className="flex items-center gap-2">
              <FiSliders className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</span>
              {activeCount > 0 && (
                <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">{activeCount}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeCount > 0 && (
                <button 
                  onClick={handleResetFilters} 
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
                >
                  <FiRefreshCw className="h-3 w-3" />Reset
                </button>
              )}
              {onToggle && (
                <button 
                  onClick={onToggle} 
                  className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  aria-label="Close filters"
                >
                  <FiX className="h-4 w-4 text-neutral-500" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(156, 163, 175, 0.5) rgba(229, 231, 235, 0.3)',
          }}
        >
          {/* Sort Section */}
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Sort By</label>
            <div className="relative" ref={sortRef}>
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)} 
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 transition-all"
              >
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">{currentSortLabel}</span>
                <FiChevronDown className={cn("h-4 w-4 text-neutral-400 transition-transform", showSortDropdown && "rotate-180")} />
              </button>
              <AnimatePresence>
                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: -8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -8 }} 
                      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto"
                    >
                      {SORT_OPTIONS.map(option => (
                        <button 
                          key={option.value} 
                          onClick={() => handleSortSelect(option.value)} 
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50",
                            currentSort === option.value 
                              ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-semibold" 
                              : "text-neutral-700 dark:text-neutral-300"
                          )}
                        >
                          <span className="flex-1 text-left">{option.label}</span>
                          {currentSort === option.value && <FiCheck className="h-4 w-4 text-primary-600" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
            <label className="flex items-center gap-3 cursor-pointer group" onClick={handleInStockToggle}>
              <div className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center transition-all", 
                filters.inStock ? "bg-primary-600 border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
              )}>
                {filters.inStock && <FiCheck className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm text-neutral-700 dark:text-neutral-300 select-none">In Stock Only</span>
            </label>
          </div>

          {/* Categories */}
          <FilterSection title="Categories" section="categories">
            <div className="space-y-2">
              {FILTER_OPTIONS.categories.map(category => (
                <label key={category} className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={() => handleCheckboxChange('categories', category)}>
                  <div className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-all", 
                    (filters.categories || []).includes(category) ? "bg-primary-600 border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
                  )}>
                    {(filters.categories || []).includes(category) && <FiCheck className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 select-none">{category}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range" section="price">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-neutral-500 mb-1 block">Min</label>
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    value={localPriceRange.min} 
                    onChange={(e) => handlePriceInputChange('min', e.target.value)} 
                    placeholder="$0" 
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-neutral-500 mb-1 block">Max</label>
                  <input 
                    type="text" 
                    inputMode="numeric" 
                    value={localPriceRange.max} 
                    onChange={(e) => handlePriceInputChange('max', e.target.value)} 
                    placeholder="$5000" 
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection title="Rating" section="rating">
            <div className="space-y-2">
              {[4, 3, 2].map(rating => (
                <label key={rating} className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={() => handleRadioChange('minRating', rating)}>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center", 
                    filters.minRating === rating ? "border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
                  )}>
                    {filters.minRating === rating && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={cn("h-3.5 w-3.5", i < rating ? "fill-amber-400 text-amber-400" : "text-neutral-300 dark:text-neutral-600")} />
                    ))}
                    <span className="text-sm text-neutral-500 ml-1">& up</span>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Discount */}
          <FilterSection title="Discount" section="discount">
            <div className="space-y-2">
              {[20, 30, 40, 50].map(discount => (
                <label key={discount} className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={() => handleRadioChange('minDiscount', discount)}>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center", 
                    filters.minDiscount === discount ? "border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
                  )}>
                    {filters.minDiscount === discount && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 select-none">{discount}% or more off</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Material */}
          <FilterSection title="Material" section="material">
            <div className="space-y-2">
              {FILTER_OPTIONS.materials.map(material => (
                <label key={material} className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={() => handleCheckboxChange('materials', material)}>
                  <div className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center", 
                    (filters.materials || []).includes(material) ? "bg-primary-600 border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
                  )}>
                    {(filters.materials || []).includes(material) && <FiCheck className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 select-none">{material}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Color */}
          <FilterSection title="Color" section="color">
            <div className="flex flex-wrap gap-3 pb-2">
              {FILTER_OPTIONS.colors.map(color => (
                <button 
                  key={color.value} 
                  onClick={() => handleCheckboxChange('colors', color.value)} 
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all hover:scale-110 relative flex items-center justify-center",
                    (filters.colors || []).includes(color.value) ? "border-primary-500 scale-110 shadow-lg" : "border-neutral-300 dark:border-neutral-600"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.label}
                >
                  {(filters.colors || []).includes(color.value) && (
                    <FiCheck className={cn("h-3 w-3", ['white', '#ffffff'].includes(color.hex) ? 'text-neutral-800' : 'text-white')} />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Results Count - Sticky Footer */}
        {totalResults !== undefined && (
          <div className="flex-shrink-0 sticky bottom-0 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 px-4 py-3">
            <div className="text-center">
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {totalResults} {totalResults === 1 ? 'product' : 'products'} found
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile version - Full screen drawer with independent scroll
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 flex flex-col">
      {/* Mobile Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <FiSliders className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Filters</h2>
          {activeCount > 0 && (
            <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">{activeCount}</span>
          )}
        </div>
        <button 
          onClick={() => onToggle?.()} 
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          aria-label="Close filters"
        >
          <FiX className="h-5 w-5 text-neutral-500" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
        }}
      >
        {/* Sort Section */}
        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Sort By</label>
          <div className="relative" ref={sortRef}>
            <button 
              onClick={() => setShowSortDropdown(!showSortDropdown)} 
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 transition-all"
            >
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">{currentSortLabel}</span>
              <FiChevronDown className={cn("h-4 w-4 text-neutral-400 transition-transform", showSortDropdown && "rotate-180")} />
            </button>
            <AnimatePresence>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -8 }} 
                    className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto"
                  >
                    {SORT_OPTIONS.map(option => (
                      <button 
                        key={option.value} 
                        onClick={() => handleSortSelect(option.value)} 
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50",
                          currentSort === option.value 
                            ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-semibold" 
                            : "text-neutral-700 dark:text-neutral-300"
                        )}
                      >
                        <span className="flex-1 text-left">{option.label}</span>
                        {currentSort === option.value && <FiCheck className="h-4 w-4 text-primary-600" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* In Stock Toggle */}
        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
          <label className="flex items-center gap-3 cursor-pointer group" onClick={handleInStockToggle}>
            <div className={cn(
              "w-4 h-4 rounded border-2 flex items-center justify-center transition-all", 
              filters.inStock ? "bg-primary-600 border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
            )}>
              {filters.inStock && <FiCheck className="h-3 w-3 text-white" />}
            </div>
            <span className="text-sm text-neutral-700 dark:text-neutral-300 select-none">In Stock Only</span>
          </label>
        </div>

        {/* Categories */}
        <FilterSection title="Categories" section="categories">
          <div className="space-y-2">
            {FILTER_OPTIONS.categories.map(category => (
              <label key={category} className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={() => handleCheckboxChange('categories', category)}>
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-all", 
                  (filters.categories || []).includes(category) ? "bg-primary-600 border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
                )}>
                  {(filters.categories || []).includes(category) && <FiCheck className="h-3 w-3 text-white" />}
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400 select-none">{category}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" section="price">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-neutral-500 mb-1 block">Min</label>
                <input 
                  type="text" 
                  inputMode="numeric" 
                  value={localPriceRange.min} 
                  onChange={(e) => handlePriceInputChange('min', e.target.value)} 
                  placeholder="$0" 
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-neutral-500 mb-1 block">Max</label>
                <input 
                  type="text" 
                  inputMode="numeric" 
                  value={localPriceRange.max} 
                  onChange={(e) => handlePriceInputChange('max', e.target.value)} 
                  placeholder="$5000" 
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Rating" section="rating">
          <div className="space-y-2">
            {[4, 3, 2].map(rating => (
              <label key={rating} className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={() => handleRadioChange('minRating', rating)}>
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center", 
                  filters.minRating === rating ? "border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
                )}>
                  {filters.minRating === rating && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={cn("h-3.5 w-3.5", i < rating ? "fill-amber-400 text-amber-400" : "text-neutral-300 dark:text-neutral-600")} />
                  ))}
                  <span className="text-sm text-neutral-500 ml-1">& up</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Discount */}
        <FilterSection title="Discount" section="discount">
          <div className="space-y-2">
            {[20, 30, 40, 50].map(discount => (
              <label key={discount} className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={() => handleRadioChange('minDiscount', discount)}>
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center", 
                  filters.minDiscount === discount ? "border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
                )}>
                  {filters.minDiscount === discount && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400 select-none">{discount}% or more off</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Material */}
        <FilterSection title="Material" section="material">
          <div className="space-y-2">
            {FILTER_OPTIONS.materials.map(material => (
              <label key={material} className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={() => handleCheckboxChange('materials', material)}>
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center", 
                  (filters.materials || []).includes(material) ? "bg-primary-600 border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
                )}>
                  {(filters.materials || []).includes(material) && <FiCheck className="h-3 w-3 text-white" />}
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400 select-none">{material}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Color */}
        <FilterSection title="Color" section="color">
          <div className="flex flex-wrap gap-3 pb-2">
            {FILTER_OPTIONS.colors.map(color => (
              <button 
                key={color.value} 
                onClick={() => handleCheckboxChange('colors', color.value)} 
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all hover:scale-110 relative flex items-center justify-center",
                  (filters.colors || []).includes(color.value) ? "border-primary-500 scale-110 shadow-lg" : "border-neutral-300 dark:border-neutral-600"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              >
                {(filters.colors || []).includes(color.value) && (
                  <FiCheck className={cn("h-3 w-3", ['white', '#ffffff'].includes(color.hex) ? 'text-neutral-800' : 'text-white')} />
                )}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Mobile Footer Actions */}
      <div className="flex-shrink-0 border-t border-neutral-100 dark:border-neutral-800 p-4 flex gap-3 bg-white dark:bg-neutral-900">
        <button 
          onClick={handleResetFilters} 
          className="flex-1 py-2.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
        >
          Reset All
        </button>
        <button 
          onClick={() => onToggle?.()} 
          className="flex-1 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Show {totalResults || 0} results
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;