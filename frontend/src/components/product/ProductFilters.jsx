import { useState, useCallback, useRef, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck, FiRefreshCw, FiX, FiStar, FiSliders } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import apiWrapper from '../../services/apiWrapper';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'discount', label: 'Biggest Discount' },
];

// Memoized filter section component
const FilterSection = memo(({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 px-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors duration-150"
    >
      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">{title}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <FiChevronDown className="h-4 w-4 text-neutral-400" />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }} 
          animate={{ height: "auto", opacity: 1 }} 
          exit={{ height: 0, opacity: 0 }} 
          transition={{ duration: 0.15 }} 
          className="overflow-hidden"
        >
          <div className="px-4 pb-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));

FilterSection.displayName = 'FilterSection';

// Memoized Sort Dropdown component
const SortDropdown = memo(({ currentSort, onSortSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSortLabel = useMemo(() => 
    SORT_OPTIONS.find(opt => opt.value === currentSort)?.label || 'Featured', 
    [currentSort]
  );

  const handleSelect = useCallback((value) => {
    onSortSelect(value);
    setIsOpen(false);
  }, [onSortSelect]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(prev => !prev)} 
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 transition-all duration-150"
      >
        <span className="text-neutral-700 dark:text-neutral-300 font-medium">{currentSortLabel}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
          <FiChevronDown className="h-4 w-4 text-neutral-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: -8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -8 }} 
              transition={{ duration: 0.12 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto"
            >
              {SORT_OPTIONS.map(option => (
                <button 
                  key={option.value} 
                  onClick={() => handleSelect(option.value)} 
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors duration-100 hover:bg-neutral-50 dark:hover:bg-neutral-700/50",
                    currentSort === option.value 
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-semibold" 
                      : "text-neutral-700 dark:text-neutral-300"
                  )}
                >
                  <span className="flex-1 text-left">{option.label}</span>
                  {currentSort === option.value && <FiCheck className="h-4 w-4" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

SortDropdown.displayName = 'SortDropdown';

// Memoized Checkbox component
const Checkbox = memo(({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={onChange}>
    <div className={cn(
      "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-100", 
      checked ? "bg-primary-600 border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
    )}>
      {checked && <FiCheck className="h-3 w-3 text-white" />}
    </div>
    <span className="text-sm text-neutral-600 dark:text-neutral-400 select-none">{label}</span>
  </label>
));

Checkbox.displayName = 'Checkbox';

// Memoized Radio component
const Radio = memo(({ checked, onChange, children }) => (
  <label className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={onChange}>
    <div className={cn(
      "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-100", 
      checked ? "border-primary-600" : "border-neutral-300 dark:border-neutral-600 group-hover:border-primary-400"
    )}>
      {checked && <div className="w-2 h-2 rounded-full bg-primary-600" />}
    </div>
    {children}
  </label>
));

Radio.displayName = 'Radio';

const ProductFilters = memo(({ filters, onFilterChange, onSortChange, currentSort, totalResults, onToggle, isMobile, isDesktopOpen = false, onDesktopToggle }) => {
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
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    materials: [],
    colors: [],
  });
  const [loadingFilters, setLoadingFilters] = useState(true);
  const priceTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Fetch filter options from API
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      setLoadingFilters(true);
      
      try {
        const categoriesResponse = await apiWrapper.getCategories();
        let categoriesData = [];
        
        // New format: { success: true, categories: [...] }
        if (categoriesResponse?.success && categoriesResponse?.categories && Array.isArray(categoriesResponse.categories)) {
          categoriesData = categoriesResponse.categories.map(cat => cat.name);
        }
        // Legacy formats
        else if (categoriesResponse?.data?.success && categoriesResponse.data.data) {
          categoriesData = categoriesResponse.data.data.map(cat => cat.name);
        } else if (Array.isArray(categoriesResponse)) {
          categoriesData = categoriesResponse.map(cat => cat.name);
        } else if (categoriesResponse?.data && Array.isArray(categoriesResponse.data)) {
          categoriesData = categoriesResponse.data.map(cat => cat.name);
        }
        
        const productsResponse = await apiWrapper.getProducts({ limit: 100 });
        let productsData = [];
        
        // New format: { success: true, products: [...] }
        if (productsResponse?.success && productsResponse?.products && Array.isArray(productsResponse.products)) {
          productsData = productsResponse.products;
        }
        // Legacy formats
        else if (productsResponse?.data?.success && productsResponse.data.data) {
          productsData = productsResponse.data.data;
        } else if (Array.isArray(productsResponse)) {
          productsData = productsResponse;
        } else if (productsResponse?.data && Array.isArray(productsResponse.data)) {
          productsData = productsResponse.data;
        }
        
        const materialsSet = new Set();
        const colorsSet = new Set();
        
        productsData.forEach(product => {
          if (product.material) {
            materialsSet.add(product.material);
          }
          if (product.color) {
            colorsSet.add(product.color);
          }
        });
        
        const colorMap = {
          'black': { value: 'black', label: 'Black', hex: '#1a1a1a' },
          'white': { value: 'white', label: 'White', hex: '#ffffff' },
          'brown': { value: 'brown', label: 'Brown', hex: '#8b4513' },
          'gray': { value: 'gray', label: 'Gray', hex: '#808080' },
          'grey': { value: 'gray', label: 'Gray', hex: '#808080' },
          'blue': { value: 'blue', label: 'Blue', hex: '#4169e1' },
          'green': { value: 'green', label: 'Green', hex: '#2e8b57' },
          'red': { value: 'red', label: 'Red', hex: '#dc2626' },
          'yellow': { value: 'yellow', label: 'Yellow', hex: '#eab308' },
          'purple': { value: 'purple', label: 'Purple', hex: '#9333ea' },
          'pink': { value: 'pink', label: 'Pink', hex: '#ec4899' },
          'orange': { value: 'orange', label: 'Orange', hex: '#f97316' },
          'beige': { value: 'beige', label: 'Beige', hex: '#f5f5dc' },
          'navy': { value: 'navy', label: 'Navy', hex: '#1e3a8a' },
          'gold': { value: 'gold', label: 'Gold', hex: '#d4af37' },
          'silver': { value: 'silver', label: 'Silver', hex: '#c0c0c0' },
        };
        
        const colorsArray = Array.from(colorsSet)
          .map(color => {
            const colorKey = color?.toLowerCase();
            return colorMap[colorKey] || { value: colorKey, label: color, hex: '#999' };
          })
          .filter(c => c.value);
        
        if (isMountedRef.current) {
          setFilterOptions({
            categories: categoriesData.length > 0 ? categoriesData : [
              'Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor', 'Lighting', 'Decor', 'Storage'
            ],
            materials: Array.from(materialsSet).length > 0 ? Array.from(materialsSet) : [
              'Wood', 'Metal', 'Glass', 'Fabric', 'Leather', 'Marble'
            ],
            colors: colorsArray.length > 0 ? colorsArray : [
              { value: 'black', label: 'Black', hex: '#1a1a1a' },
              { value: 'white', label: 'White', hex: '#ffffff' },
              { value: 'brown', label: 'Brown', hex: '#8b4513' },
              { value: 'gray', label: 'Gray', hex: '#808080' },
              { value: 'blue', label: 'Blue', hex: '#4169e1' },
              { value: 'green', label: 'Green', hex: '#2e8b57' },
              { value: 'red', label: 'Red', hex: '#dc2626' },
            ],
          });
        }
      } catch (error) {
        if (isMountedRef.current && error.name !== 'AbortError') {
          console.warn('Failed to fetch filter options, using defaults:', error);
          setFilterOptions({
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
          });
        }
      } finally {
        if (isMountedRef.current) {
          setLoadingFilters(false);
        }
      }
    };
    
    fetchFilterOptions();
  }, []);

  // Sync local price range with props
  useEffect(() => {
    setLocalPriceRange({ min: filters.minPrice ?? '', max: filters.maxPrice ?? '' });
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceInputChange = useCallback((type, value) => {
    if (value === '' || /^\d+$/.test(value)) {
      setLocalPriceRange(prev => ({ ...prev, [type]: value }));
    }
  }, []);

  // Debounced price update
  useEffect(() => {
    if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
    priceTimeoutRef.current = setTimeout(() => {
      const newMin = localPriceRange.min === '' ? undefined : Number(localPriceRange.min);
      const newMax = localPriceRange.max === '' ? undefined : Number(localPriceRange.max);
      if (newMin !== (filters.minPrice ?? undefined) || newMax !== (filters.maxPrice ?? undefined)) {
        onFilterChange({ ...filters, minPrice: newMin, maxPrice: newMax });
      }
    }, 400);
    return () => clearTimeout(priceTimeoutRef.current);
  }, [localPriceRange.min, localPriceRange.max, filters, onFilterChange]);

  const handleCheckboxChange = useCallback((type, value) => {
    const currentValues = [...(filters[type] || [])];
    let updatedValues;
    if (currentValues.includes(value)) {
      updatedValues = currentValues.filter(v => v !== value);
    } else {
      updatedValues = [...currentValues, value];
    }
    onFilterChange({ ...filters, [type]: updatedValues.length > 0 ? updatedValues : undefined });
  }, [filters, onFilterChange]);

  const handleRadioChange = useCallback((type, value) => {
    onFilterChange({ ...filters, [type]: filters[type] === value ? undefined : value });
  }, [filters, onFilterChange]);

  const handleSortSelect = useCallback((value) => {
    onSortChange(value);
  }, [onSortChange]);

  const handleInStockToggle = useCallback(() => {
    onFilterChange({ ...filters, inStock: !filters.inStock ? true : undefined });
  }, [filters, onFilterChange]);

  const handleResetFilters = useCallback(() => {
    setLocalPriceRange({ min: '', max: '' });
    onFilterChange({});
    if (onSortChange) onSortChange('featured');
  }, [onFilterChange, onSortChange]);

  const toggleSection = useCallback((section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // Memoized active filter count
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.materials?.length) count += filters.materials.length;
    if (filters.colors?.length) count += filters.colors.length;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.minDiscount) count++;
    if (filters.inStock) count++;
    return count;
  }, [filters]);

  const ratingOptions = useMemo(() => [4, 3, 2], []);
  const discountOptions = useMemo(() => [20, 30, 40, 50], []);

  const filterContent = useMemo(() => (
    <>
      {/* In Stock Toggle */}
      <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
        <Checkbox 
          checked={filters.inStock || false} 
          onChange={handleInStockToggle} 
          label="In Stock Only" 
        />
      </div>

      {/* Categories */}
      <FilterSection 
        title="Categories" 
        isOpen={openSections.categories} 
        onToggle={() => toggleSection('categories')}
      >
        <div className="space-y-2">
          {filterOptions.categories.map(category => (
            <Checkbox 
              key={category}
              checked={(filters.categories || []).includes(category)} 
              onChange={() => handleCheckboxChange('categories', category)} 
              label={category}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection 
        title="Price Range" 
        isOpen={openSections.price} 
        onToggle={() => toggleSection('price')}
      >
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
      <FilterSection 
        title="Rating" 
        isOpen={openSections.rating} 
        onToggle={() => toggleSection('rating')}
      >
        <div className="space-y-2">
          {ratingOptions.map(rating => (
            <Radio 
              key={rating}
              checked={filters.minRating === rating} 
              onChange={() => handleRadioChange('minRating', rating)}
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={cn("h-3.5 w-3.5", i < rating ? "fill-amber-400 text-amber-400" : "text-neutral-300 dark:text-neutral-600")} />
                ))}
                <span className="text-sm text-neutral-500 ml-1">& up</span>
              </div>
            </Radio>
          ))}
        </div>
      </FilterSection>

      {/* Discount */}
      <FilterSection 
        title="Discount" 
        isOpen={openSections.discount} 
        onToggle={() => toggleSection('discount')}
      >
        <div className="space-y-2">
          {discountOptions.map(discount => (
            <Radio 
              key={discount}
              checked={filters.minDiscount === discount} 
              onChange={() => handleRadioChange('minDiscount', discount)}
            >
              <span className="text-sm text-neutral-600 dark:text-neutral-400 select-none">{discount}% or more off</span>
            </Radio>
          ))}
        </div>
      </FilterSection>

      {/* Material */}
      <FilterSection 
        title="Material" 
        isOpen={openSections.material} 
        onToggle={() => toggleSection('material')}
      >
        <div className="space-y-2">
          {filterOptions.materials.map(material => (
            <Checkbox 
              key={material}
              checked={(filters.materials || []).includes(material)} 
              onChange={() => handleCheckboxChange('materials', material)} 
              label={material}
            />
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection 
        title="Color" 
        isOpen={openSections.color} 
        onToggle={() => toggleSection('color')}
      >
        <div className="flex flex-wrap gap-3 pb-2">
          {filterOptions.colors.map(color => {
            const isSelected = (filters.colors || []).includes(color.value);
            return (
              <button 
                key={color.value} 
                onClick={() => handleCheckboxChange('colors', color.value)} 
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all duration-150 hover:scale-110 relative flex items-center justify-center",
                  isSelected ? "border-primary-500 scale-110 shadow-lg" : "border-neutral-300 dark:border-neutral-600"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              >
                {isSelected && (
                  <FiCheck className={cn("h-3 w-3", ['white', '#ffffff'].includes(color.hex) ? 'text-neutral-800' : 'text-white')} />
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </>
  ), [filters, openSections, localPriceRange, filterOptions, handleCheckboxChange, handleRadioChange, handleInStockToggle, handlePriceInputChange, toggleSection]);

  // Desktop version - Sidebar Panel (not floating)
  if (!isMobile) {
    return (
      <>
        {/* Desktop Sidebar Panel - Slides from right when isDesktopOpen is true */}
        <AnimatePresence>
          {isDesktopOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={onDesktopToggle}
              />
              
              {/* Filter Panel - Slides from right */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col"
              >
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <FiSliders className="h-5 w-5 text-primary-600" />
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Filters</h2>
                    {activeCount > 0 && (
                      <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">{activeCount}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {activeCount > 0 && (
                      <button 
                        onClick={handleResetFilters} 
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-primary-50"
                      >
                        <FiRefreshCw className="h-3 w-3" />Reset
                      </button>
                    )}
                    <button 
                      onClick={onDesktopToggle} 
                      className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div 
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto overscroll-contain"
                >
                  {/* Sort Section */}
                  <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Sort By</label>
                    <SortDropdown currentSort={currentSort} onSortSelect={handleSortSelect} />
                  </div>

                  {loadingFilters ? (
                    <div className="p-4 space-y-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-24 mb-2" />
                          <div className="space-y-2">
                            {[1, 2, 3].map(j => (
                              <div key={j} className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-full" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    filterContent
                  )}
                </div>

                {/* Footer with Results Count */}
                {totalResults !== undefined && (
                  <div className="flex-shrink-0 border-t border-neutral-100 dark:border-neutral-800 px-4 py-3 bg-white dark:bg-neutral-900">
                    <div className="text-center">
                      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        {totalResults.toLocaleString()} {totalResults === 1 ? 'product' : 'products'} found
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Mobile version - Full screen drawer
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
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors duration-150"
          aria-label="Close filters"
        >
          <FiX className="h-5 w-5 text-neutral-500" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain"
      >
        {/* Sort Section */}
        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Sort By</label>
          <SortDropdown currentSort={currentSort} onSortSelect={handleSortSelect} />
        </div>

        {loadingFilters ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-24 mb-2" />
                <div className="space-y-2">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          filterContent
        )}
      </div>

      {/* Mobile Footer Actions */}
      <div className="flex-shrink-0 border-t border-neutral-100 dark:border-neutral-800 p-4 flex gap-3 bg-white dark:bg-neutral-900">
        <button 
          onClick={handleResetFilters} 
          className="flex-1 py-2.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors duration-150"
        >
          Reset All
        </button>
        <button 
          onClick={() => onToggle?.()} 
          className="flex-1 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-150"
        >
          Show {totalResults || 0} results
        </button>
      </div>
    </div>
  );
});

ProductFilters.displayName = 'ProductFilters';

export default ProductFilters;