import { useState } from 'react';
import { cn } from '../../utils/cn';
import { formatPrice } from '../../utils/helpers';
import { FiCheck } from 'react-icons/fi';

const ProductVariants = ({ variants, selectedVariant, onSelect, variantType = 'color' }) => {
  const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];
  const materials = [...new Set(variants.map(v => v.material).filter(Boolean))];
  const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))];

  const getVariantPrice = (variant) => {
    return variant?.price || variants[0]?.price || 0;
  };

  const hasColorVariants = colors.length > 0;
  const hasMaterialVariants = materials.length > 0;
  const hasSizeVariants = sizes.length > 0;

  return (
    <div className="space-y-6">
      {/* Color Variants */}
      {hasColorVariants && (
        <div>
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">
            Color: <span className="text-neutral-500 font-normal">{selectedVariant?.color || variants[0]?.color}</span>
          </h4>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const variant = variants.find(v => v.color === color);
              const isSelected = selectedVariant?.color === color;
              const isOutOfStock = variant?.stock === 0;

              return (
                <button
                  key={color}
                  onClick={() => !isOutOfStock && onSelect(variant)}
                  disabled={isOutOfStock}
                  title={`${color}${isOutOfStock ? ' - Out of Stock' : ''}`}
                  className={cn(
                    'relative px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200',
                    isSelected
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300',
                    isOutOfStock
                      ? 'opacity-40 cursor-not-allowed line-through'
                      : 'cursor-pointer'
                  )}
                >
                  {color}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center">
                      <FiCheck className="h-3 w-3" />
                    </span>
                  )}
                  {isOutOfStock && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-2xs text-red-500 whitespace-nowrap">
                      Out of Stock
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Material Variants */}
      {hasMaterialVariants && (
        <div>
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">
            Material: <span className="text-neutral-500 font-normal">{selectedVariant?.material || variants[0]?.material}</span>
          </h4>
          <div className="flex flex-wrap gap-3">
            {materials.map((material) => {
              const variant = variants.find(v => v.material === material);
              const isSelected = selectedVariant?.material === material;
              const isOutOfStock = variant?.stock === 0;

              return (
                <button
                  key={material}
                  onClick={() => !isOutOfStock && onSelect(variant)}
                  disabled={isOutOfStock}
                  className={cn(
                    'px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200',
                    isSelected
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300',
                    isOutOfStock && 'opacity-40 cursor-not-allowed line-through'
                  )}
                >
                  {material}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Variants */}
      {hasSizeVariants && (
        <div>
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">
            Size: <span className="text-neutral-500 font-normal">{selectedVariant?.size || variants[0]?.size}</span>
          </h4>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => {
              const variant = variants.find(v => v.size === size);
              const isSelected = selectedVariant?.size === size;
              const isOutOfStock = variant?.stock === 0;

              return (
                <button
                  key={size}
                  onClick={() => !isOutOfStock && onSelect(variant)}
                  disabled={isOutOfStock}
                  className={cn(
                    'px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 min-w-[80px]',
                    isSelected
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300',
                    isOutOfStock && 'opacity-40 cursor-not-allowed line-through'
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Display for Selected Variant */}
      {selectedVariant && getVariantPrice(selectedVariant) !== variants[0]?.price && (
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Selected variant price:
            </span>
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(getVariantPrice(selectedVariant))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariants;