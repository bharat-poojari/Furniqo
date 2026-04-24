import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFilter, 
  FiX, 
  FiChevronDown,
  FiSliders,
} from 'react-icons/fi';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../../utils/constants';
import { cn } from '../../utils/cn';
import Button from '../common/Button';

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  onSortChange, 
  currentSort,
  onClearFilters,
  totalResults = 0,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    material: false,
    color: false,
    style: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (type, value) => {
    const current = filters[type] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    
    onFilterChange({
      ...filters,
      [type]: updated.length > 0 ? updated : undefined,
    });
  };

  const handlePriceRange = (min, max) => {
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max === Infinity ? undefined : max,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.categories?.length > 0 ||
      filters.materials?.length > 0 ||
      filters.colors?.length > 0 ||
      filters.styles?.length > 0 ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
    );
  };

  const FilterSection = ({ title, section, children, showCount = false }) => (
    <div className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
      >
        <span className="font-semibold text-sm text-neutral-900 dark:text-white">
          {title}
          {showCount && (
            <span className="ml-2 text-xs text-neutral-400">({totalResults})</span>
          )}
        </span>
        <FiChevronDown className={cn(
          'h-4 w-4 text-neutral-400 transition-transform duration-200',
          expandedSections[section] && 'rotate-180'
        )} />
      </button>
      
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const filterContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div className="px-4 pt-4">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <FilterSection title="Categories" section="categories" showCount>
        <div className="space-y-1">
          {FILTER_OPTIONS.categories.map((category) => (
            <label
              key={category.value}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.categories?.includes(category.value) || false}
                onChange={() => handleCheckboxChange('categories', category.value)}
                className="rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {category.icon} {category.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-1">
          {FILTER_OPTIONS.priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="priceRange"
                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                onChange={() => handlePriceRange(range.min, range.max)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {range.label}
              </span>
            </label>
          ))}
        </div>
        
        {/* Custom Price Inputs */}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({
              ...filters,
              minPrice: e.target.value ? Number(e.target.value) : undefined,
            })}
            className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <span className="text-neutral-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({
              ...filters,
              maxPrice: e.target.value ? Number(e.target.value) : undefined,
            })}
            className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </FilterSection>

      {/* Materials */}
      <FilterSection title="Material" section="material">
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {FILTER_OPTIONS.materials.map((material) => (
            <label
              key={material}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.materials?.includes(material) || false}
                onChange={() => handleCheckboxChange('materials', material)}
                className="rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {material}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Color" section="color">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.colors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleCheckboxChange('colors', color.value)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                filters.colors?.includes(color.value)
                  ? 'border-primary-500 scale-110 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-neutral-900'
                  : 'border-neutral-300 dark:border-neutral-600'
              )}
              style={{ backgroundColor: color.hex }}
              title={color.value}
              aria-label={`Filter by ${color.value}`}
            />
          ))}
        </div>
      </FilterSection>

      {/* Styles */}
      <FilterSection title="Style" section="style">
        <div className="space-y-1">
          {FILTER_OPTIONS.styles.map((style) => (
            <label
              key={style}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.styles?.includes(style) || false}
                onChange={() => handleCheckboxChange('styles', style)}
                className="rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {style}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Clear Filters */}
      {hasActiveFilters() && (
        <div className="px-4 pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="w-full text-red-600 hover:text-red-700"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiSliders className="h-5 w-5 text-primary-600" />
                <h3 className="font-bold text-neutral-900 dark:text-white">Filters</h3>
              </div>
              {hasActiveFilters() && (
                <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
          </div>
          
          {filterContent}
        </div>
      </aside>

      {/* Mobile Filters */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 transition-colors"
          >
            <FiFilter className="h-5 w-5" />
            <span className="font-medium text-sm">Filters</span>
            {hasActiveFilters() && (
              <span className="w-2 h-2 bg-primary-600 rounded-full" />
            )}
          </button>
          
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <span className="text-sm text-neutral-500 ml-auto">
            {totalResults} results
          </span>
        </div>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-neutral-900 overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-4 flex items-center justify-between z-10">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                {filterContent}
                
                <div className="sticky bottom-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 p-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onClearFilters();
                      setShowMobileFilters(false);
                    }}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProductFilters;