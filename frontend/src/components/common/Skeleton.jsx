import { cn } from '../../utils/cn';

// Base Skeleton Component
export const Skeleton = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800 relative overflow-hidden',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.5s_infinite]',
        'after:bg-gradient-to-r after:from-transparent after:via-white/20 dark:after:via-white/5 after:to-transparent',
        className
      )}
    />
  );
};

// Product Card Skeleton - Grid View
export const ProductCardSkeleton = ({ variant = 'grid' }) => {
  if (variant === 'list') {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Image Skeleton */}
          <div className="sm:w-48 md:w-56">
            <Skeleton className="w-full aspect-square rounded-xl" />
          </div>
          
          {/* Content Skeleton */}
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded-full" />
              ))}
              <Skeleton className="h-4 w-12 rounded-md ml-2" />
            </div>
            <Skeleton className="h-16 w-full rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view skeleton (default)
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>
      </div>
    </div>
  );
};

// Product Detail Skeleton
export const ProductDetailSkeleton = () => {
  return (
    <div className="w-[98%] mx-auto py-4">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-3">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-8 w-3/4 rounded-md" />
            <Skeleton className="h-5 w-1/4 rounded-md" />
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Skeleton
export const CartSkeleton = () => {
  return (
    <div className="w-[98%] mx-auto py-4">
      <Skeleton className="h-6 w-32 mb-4 rounded-md" />
      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Cart Items */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
              <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/3 rounded-md" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-8 w-24 rounded-lg" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Order Summary */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 p-5 space-y-3">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="w-[98%] mx-auto py-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      
      {/* Tabs */}
      <Skeleton className="h-10 w-full rounded-lg mb-6" />
      
      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className={`h-12 rounded-lg ${i === 5 ? 'col-span-2' : ''}`} />
        ))}
      </div>
      <Skeleton className="h-12 w-full rounded-lg mt-3" />
    </div>
  );
};

// Home Page Skeleton
export const HomeSkeleton = () => {
  return (
    <div>
      {/* Hero */}
      <Skeleton className="w-full h-[60vh] rounded-none" />
      
      {/* Categories */}
      <div className="w-[98%] mx-auto py-8">
        <div className="text-center mb-6">
          <Skeleton className="h-8 w-48 mx-auto mb-2 rounded-md" />
          <Skeleton className="h-4 w-64 mx-auto rounded-md" />
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="h-3 w-16 mx-auto rounded-md" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Trending Products */}
      <div className="w-[98%] mx-auto py-8">
        <div className="text-center mb-6">
          <Skeleton className="h-8 w-48 mx-auto rounded-md" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} variant="grid" />
          ))}
        </div>
      </div>
    </div>
  );
};

// Blog Card Skeleton
export const BlogCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
      <Skeleton className="w-full aspect-[16/10] rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
};

// Order Card Skeleton
export const OrderCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
      {/* Header */}
      <div className="grid gap-4 p-4 border-b border-neutral-100 dark:border-neutral-800" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {[...Array(cols)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-3/4 rounded-md" />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {[...Array(cols)].map((_, j) => (
              <Skeleton key={j} className="h-3 w-2/3 rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Grid Skeleton (for generic grid layouts)
export const GridSkeleton = ({ columns = 4, count = 8, variant = 'grid' }) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns] || gridCols[4])}>
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
};