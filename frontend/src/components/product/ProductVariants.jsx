import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { formatPrice } from '../../utils/helpers';

const ProductVariants = ({ 
  variants, 
  selectedVariant, 
  onSelect,
  className 
}) => {
  const [showAllSizes, setShowAllSizes] = useState(false);

  // Extract unique variant attributes
  const colors = useMemo(() => 
    [...new Set(variants.map(v => v.color).filter(Boolean))], 
  [variants]);
  
  const materials = useMemo(() => 
    [...new Set(variants.map(v => v.material).filter(Boolean))], 
  [variants]);
  
  const sizes = useMemo(() => 
    [...new Set(variants.map(v => v.size).filter(Boolean))], 
  [variants]);

  // Sort sizes naturally
  const sortedSizes = useMemo(() => {
    const sizeOrder = { 'XS': 0, 'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5, 'XXXL': 6 };
    return [...sizes].sort((a, b) => {
      const aNum = parseFloat(a);
      const bNum = parseFloat(b);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return (sizeOrder[a] ?? 999) - (sizeOrder[b] ?? 999);
    });
  }, [sizes]);

  // Price helpers
  const getVariantPrice = useCallback((variant) => {
    if (!variant) return variants[0]?.price || 0;
    return variant.salePrice || variant.price;
  }, [variants]);

  const getDiscount = useCallback((variant) => {
    if (!variant?.salePrice || !variant?.price) return null;
    const saved = variant.price - variant.salePrice;
    const percentage = Math.round((saved / variant.price) * 100);
    return { saved, percentage };
  }, []);

  // Find variant by attribute combination
  const findVariant = useCallback((attributes) => {
    return variants.find(v => 
      Object.entries(attributes).every(([key, value]) => 
        !value || v[key] === value
      )
    );
  }, [variants]);

  // Get available options based on current selection
  const getAvailableOptions = useCallback((attributeName) => {
    const filters = {};
    if (selectedVariant) {
      if (colors.length && selectedVariant.color) filters.color = selectedVariant.color;
      if (materials.length && selectedVariant.material) filters.material = selectedVariant.material;
      if (sizes.length && selectedVariant.size) filters.size = selectedVariant.size;
      delete filters[attributeName];
    }
    
    return variants
      .filter(v => Object.entries(filters).every(([key, val]) => v[key] === val))
      .map(v => v[attributeName])
      .filter(Boolean);
  }, [variants, selectedVariant, colors.length, materials.length, sizes.length]);

  // Enhanced color utility - checks hex first, then exact match, then normalized match
  const getColorValue = (color) => {
    if (!color) return '#6B7280';
    
    // Check if it's already a valid hex color
    const hexRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
    if (hexRegex.test(color)) return color;
    
    // Check if it's an rgb/rgba string
    if (color.startsWith('rgb')) return color;
    
    // Comprehensive color map with exact names
    const colorMap = {
      // Basic colors
      'red': '#EF4444',
      'blue': '#3B82F6',
      'green': '#22C55E',
      'yellow': '#EAB308',
      'purple': '#A855F7',
      'pink': '#EC4899',
      'black': '#171717',
      'white': '#FAFAFA',
      'gray': '#6B7280',
      'grey': '#6B7280',
      'orange': '#F97316',
      'brown': '#92400E',
      
      // Shades
      'navy': '#1E3A8A',
      'navy blue': '#1E3A8A',
      'dark blue': '#1E3A8A',
      'light blue': '#93C5FD',
      'sky blue': '#38BDF8',
      'royal blue': '#4169E1',
      'baby blue': '#89CFF0',
      
      'dark green': '#166534',
      'light green': '#86EFAC',
      'forest green': '#228B22',
      'olive green': '#556B2F',
      'mint green': '#98FF98',
      'emerald': '#10B981',
      'teal': '#14B8A6',
      
      'dark red': '#991B1B',
      'light red': '#FCA5A5',
      'maroon': '#800000',
      'burgundy': '#800020',
      'crimson': '#DC143C',
      'coral': '#FF7F50',
      'salmon': '#FA8072',
      
      'dark gray': '#374151',
      'light gray': '#D1D5DB',
      'charcoal': '#36454F',
      'slate': '#475569',
      'silver': '#9CA3AF',
      'platinum': '#E5E4E2',
      
      'dark brown': '#451A03',
      'light brown': '#D97706',
      'chocolate': '#D2691E',
      'tan': '#D2B48C',
      'khaki': '#F0E68C',
      'beige': '#FEF3C7',
      'cream': '#FFFDD0',
      'ivory': '#FFFFF0',
      'bone': '#E3DAC9',
      
      'gold': '#D97706',
      'rose gold': '#B76E79',
      'copper': '#B87333',
      'bronze': '#CD7F32',
      'brass': '#B5A642',
      
      'violet': '#8B00FF',
      'indigo': '#6366F1',
      'lavender': '#E6E6FA',
      'lilac': '#C8A2C8',
      'plum': '#DDA0DD',
      'mauve': '#E0B0FF',
      'magenta': '#FF00FF',
      'fuchsia': '#FF00FF',
      
      'peach': '#FFE5B4',
      'apricot': '#FBCFE8',
      'coral pink': '#FF7F50',
      'hot pink': '#FF69B4',
      'dusty rose': '#DCA3A8',
      'blush': '#DE5D83',
      
      // Wood colors
      'oak': '#966F33',
      'walnut': '#5C5248',
      'mahogany': '#4A0404',
      'maple': '#E8C382',
      'cherry': '#954535',
      'pine': '#D2B48C',
      'ash': '#8B8682',
      'birch': '#D4C4A8',
      'teak': '#8B6914',
      'ebony': '#3D2B1F',
      'beech': '#C49E6D',
      'elm': '#96795D',
      'hickory': '#8B6914',
      'rosewood': '#65000B',
      'bamboo': '#C1A95D',
      'wenge': '#5E4732',
      
      // Furniture specific colors
      'natural': '#DEB887',
      'espresso': '#2C1A0E',
      'cappuccino': '#A17B5C',
      'mocha': '#8B5A2B',
      'driftwood': '#9A8C7A',
      'weathered': '#8B8378',
      'distressed': '#9E8E7B',
      'antique white': '#FAEBD7',
      'off white': '#FDF5E6',
      'warm white': '#FFF5E6',
      'cool white': '#F4F4F4',
      'matte black': '#1A1A1A',
      'glossy black': '#000000',
      'jet black': '#0A0A0A',
      'midnight': '#191970',
      'charcoal black': '#36454F',
      
      // Metallic finishes
      'stainless steel': '#C0C0C0',
      'brushed nickel': '#B8B8B8',
      'polished chrome': '#DBE4EB',
      'matte black metal': '#1A1A1A',
      'oil rubbed bronze': '#4A3728',
      'antique brass': '#8B7D3C',
      'satin brass': '#B5A642',
      'polished brass': '#C5A14A',
      'pewter': '#8A8C8E',
      'zinc': '#7E8184',
      'gunmetal': '#2A3439',
      
      // Upholstery colors
      'charcoal grey': '#36454F',
      'dove grey': '#6B6B6B',
      'slate grey': '#708090',
      'heather grey': '#9E9E9E',
      'oatmeal': '#DFD2B6',
      'linen': '#FAF0E6',
      'ecru': '#C2B280',
      'sand': '#C2B280',
      'taupe': '#483C32',
      'mushroom': '#C4A67D',
      'putty': '#CDAE95',
      'stone': '#8B8B83',
      'slate blue': '#6A5ACD',
      'denim': '#1560BD',
      'chambray': '#9BC1E5',
      'french blue': '#318CE7',
      'cobalt': '#0047AB',
      'cerulean': '#007BA7',
      'aqua': '#00FFFF',
      'turquoise': '#40E0D0',
      'seafoam': '#9FE2BF',
      'sage': '#BCB88A',
      'pistachio': '#93C572',
      'avocado': '#568203',
      'lime': '#32CD32',
      'chartreuse': '#7FFF00',
      'mustard': '#FFDB58',
      'amber': '#FFBF00',
      'tangerine': '#FF9966',
      'paprika': '#B22222',
      'cinnamon': '#D2691E',
      'rust': '#B7410E',
      'terracotta': '#CC4E5C',
      'clay': '#B66A50',
      'brick': '#CB4154',
      'wine': '#722F37',
      'merlot': '#73343A',
      'cabernet': '#5E2129',
      'plum purple': '#8E4585',
      'eggplant': '#614051',
      'aubergine': '#3B0910',
    };

    // Try exact match first
    const normalizedColor = color.trim();
    if (colorMap[normalizedColor]) return colorMap[normalizedColor];
    
    // Try case-insensitive match
    const lowerColor = normalizedColor.toLowerCase();
    if (colorMap[lowerColor]) return colorMap[lowerColor];
    
    // Try to find partial match
    for (const [name, value] of Object.entries(colorMap)) {
      if (lowerColor.includes(name) || name.includes(lowerColor)) {
        return value;
      }
    }
    
    // If no match found, generate a consistent hash-based color
    return stringToColor(normalizedColor);
  };

  // Generate consistent color from string (for unknown color names)
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 50%, 50%)`;
  };

  // Stock status helper
  const getStockInfo = (variant) => {
    if (!variant) return null;
    if (variant.stock === 0) return { text: 'Out of Stock', type: 'error' };
    if (variant.stock <= 5) return { text: `Only ${variant.stock} left`, type: 'warning' };
    return { text: 'In Stock', type: 'success' };
  };

  const stockInfo = selectedVariant ? getStockInfo(selectedVariant) : null;
  const hasAnyVariants = colors.length > 0 || materials.length > 0 || sizes.length > 0;

  if (!hasAnyVariants) return null;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Color Variants */}
      {colors.length > 0 && (
        <fieldset>
          <legend className="flex items-baseline gap-2 mb-3">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Color
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedVariant?.color || variants[0]?.color}
            </span>
          </legend>
          
          <div className="flex flex-wrap gap-3">
            {colors.map(color => {
              const variant = findVariant({ color });
              const isSelected = selectedVariant?.color === color;
              const isAvailable = getAvailableOptions('color').includes(color);
              const outOfStock = variant?.stock === 0;
              const disabled = !isAvailable || outOfStock;
              const colorValue = getColorValue(color);

              return (
                <button
                  key={color}
                  onClick={() => variant && !disabled && onSelect(variant)}
                  disabled={disabled}
                  className={cn(
                    'relative group flex flex-col items-center gap-2',
                    'focus:outline-none',
                    !disabled && 'cursor-pointer'
                  )}
                  title={`${color}${outOfStock ? ' - Out of Stock' : ''}`}
                  aria-label={`Select ${color} color`}
                >
                  {/* Color Swatch Circle */}
                  <div className={cn(
                    'relative w-10 h-10 rounded-full transition-all duration-200',
                    'ring-2 ring-offset-2 ring-transparent',
                    isSelected && 'ring-blue-600 scale-110',
                    !isSelected && !disabled && 'group-hover:ring-gray-300 dark:group-hover:ring-gray-600',
                    disabled && 'opacity-50'
                  )}>
                    <div 
                      className={cn(
                        "w-full h-full rounded-full shadow-md",
                        // Add border for light colors
                        (colorValue === '#FAFAFA' || colorValue === '#FFFFFF' || colorValue === '#FFFFF0' || 
                         colorValue === '#FFFDD0' || colorValue === '#FAF0E6' || colorValue === '#FEF3C7' ||
                         colorValue === '#FDF5E6' || colorValue === '#FFF5E6' || colorValue === '#F4F4F4' ||
                         colorValue === '#FFE5B4' || colorValue === '#FAEBD7' || colorValue === '#E6E6FA')
                          ? 'border-2 border-gray-300 dark:border-gray-600'
                          : 'border-2 border-white/20 dark:border-gray-700/20'
                    )}
                      style={{ backgroundColor: colorValue }}
                    />
                    
                    {/* Selected Checkmark */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <svg 
                          className={cn(
                            "w-4 h-4 drop-shadow-lg",
                            // White checkmark for dark colors, dark for light colors
                            isLightColor(colorValue) ? 'text-gray-800' : 'text-white'
                          )}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      </motion.div>
                    )}

                    {/* Out of Stock Cross */}
                    {outOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg 
                          className="w-6 h-6 text-red-500 drop-shadow-lg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M6 18L18 6M6 6l12 12" 
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Color Name */}
                  <span className={cn(
                    'text-xs font-medium text-center max-w-[80px] truncate',
                    isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400',
                    disabled && 'line-through'
                  )}>
                    {color}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Material Variants */}
      {materials.length > 0 && (
        <fieldset>
          <legend className="flex items-baseline gap-2 mb-3">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Material
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedVariant?.material || variants[0]?.material}
            </span>
          </legend>
          
          <div className="flex flex-wrap gap-2">
            {materials.map(material => {
              const variant = findVariant({ material });
              const isSelected = selectedVariant?.material === material;
              const isAvailable = getAvailableOptions('material').includes(material);
              const outOfStock = variant?.stock === 0;
              const disabled = !isAvailable || outOfStock;

              return (
                <button
                  key={material}
                  onClick={() => variant && !disabled && onSelect(variant)}
                  disabled={disabled}
                  className={cn(
                    'relative px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm',
                    disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50'
                  )}
                >
                  {material}
                  
                  {isSelected && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5"
                      viewBox="0 0 20 20"
                    >
                      <circle cx="10" cy="10" r="10" fill="#2563EB" />
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                        fill="white"
                      />
                    </motion.svg>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Size Variants */}
      {sizes.length > 0 && (
        <fieldset>
          <div className="flex items-center justify-between mb-3">
            <legend className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Size
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedVariant?.size || variants[0]?.size}
              </span>
            </legend>
            
            <button
              type="button"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              Size Guide
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {(showAllSizes ? sortedSizes : sortedSizes.slice(0, 6)).map(size => {
              const variant = findVariant({ size });
              const isSelected = selectedVariant?.size === size;
              const isAvailable = getAvailableOptions('size').includes(size);
              const outOfStock = variant?.stock === 0;
              const disabled = !isAvailable || outOfStock;

              return (
                <button
                  key={size}
                  onClick={() => variant && !disabled && onSelect(variant)}
                  disabled={disabled}
                  className={cn(
                    'relative min-w-[56px] px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm',
                    disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50'
                  )}
                >
                  <span className={cn(outOfStock && 'line-through')}>
                    {size}
                  </span>
                </button>
              );
            })}
          </div>

          {sortedSizes.length > 6 && (
            <button
              onClick={() => setShowAllSizes(!showAllSizes)}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              {showAllSizes 
                ? 'Show Less' 
                : `Show All ${sortedSizes.length} Sizes`
              }
            </button>
          )}
        </fieldset>
      )}

      {/* Stock Status */}
      {stockInfo && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex items-center gap-2 text-sm font-medium',
            stockInfo.type === 'error' && 'text-red-600 dark:text-red-400',
            stockInfo.type === 'warning' && 'text-amber-600 dark:text-amber-400',
            stockInfo.type === 'success' && 'text-green-600 dark:text-green-400'
          )}
        >
          {stockInfo.type === 'error' && (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {stockInfo.type === 'warning' && (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          {stockInfo.type === 'success' && (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span>{stockInfo.text}</span>
        </motion.div>
      )}

      {/* Price Display */}
      {selectedVariant && (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Price
          </span>
          <div className="flex items-center gap-3">
            {getDiscount(selectedVariant) && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(selectedVariant.price)}
                </span>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                  -{getDiscount(selectedVariant).percentage}%
                </span>
              </>
            )}
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(getVariantPrice(selectedVariant))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to determine if a color is light (for contrast)
const isLightColor = (color) => {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
};

export default ProductVariants;