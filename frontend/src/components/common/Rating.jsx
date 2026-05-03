import { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

// Optimized StarIcon component with memo
const StarIcon = memo(({ filled, halfFilled, className }) => {
  const iconClassName = useMemo(() => cn(
    'transition-colors duration-150',
    filled ? 'text-amber-400 fill-amber-400' : 
    halfFilled ? 'text-amber-400 fill-amber-400/50' : 
    'text-neutral-300 dark:text-neutral-600',
    className
  ), [filled, halfFilled, className]);

  return (
    <svg 
      className={iconClassName}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={filled || halfFilled ? 0 : 2}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
      />
    </svg>
  );
});

StarIcon.displayName = 'StarIcon';

// Memoized Ripple Effect component
const RippleEffect = memo(({ isActive }) => {
  if (!isActive) return null;
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0.5 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-amber-400 rounded-full pointer-events-none"
    />
  );
});

RippleEffect.displayName = 'RippleEffect';

// Memoized individual Star Button component
const StarButton = memo(({ 
  starIndex, 
  displayValue, 
  sizeClasses, 
  interactive, 
  selectedRating, 
  onHover, 
  onSelect 
}) => {
  const filled = starIndex <= Math.floor(displayValue);
  const halfFilled = !filled && starIndex - 0.5 <= displayValue;

  const handleMouseEnter = useCallback(() => {
    if (interactive) onHover(starIndex);
  }, [interactive, onHover, starIndex]);

  const handleMouseLeave = useCallback(() => {
    if (interactive) onHover(0);
  }, [interactive, onHover]);

  const handleClick = useCallback(() => {
    if (interactive) onSelect(starIndex);
  }, [interactive, onSelect, starIndex]);

  return (
    <motion.button
      type="button"
      disabled={!interactive}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={interactive ? { scale: 1.1 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      transition={{ duration: 0.08 }}
      className={cn(
        'transition-all duration-100 relative',
        interactive && 'cursor-pointer',
        !interactive && 'cursor-default',
      )}
      aria-label={`Rate ${starIndex} star${starIndex !== 1 ? 's' : ''}`}
    >
      <StarIcon 
        filled={filled}
        halfFilled={halfFilled}
        className={sizeClasses}
      />
      <RippleEffect isActive={interactive && selectedRating === starIndex} />
    </motion.button>
  );
});

StarButton.displayName = 'StarButton';

// Memoized Rating Distribution component
const RatingDistribution = memo(({ distribution, maxStars, numReviews }) => {
  const getPercentage = useCallback((count) => {
    return numReviews > 0 ? (count / numReviews) * 100 : 0;
  }, [numReviews]);

  return (
    <div className="space-y-1 mt-2">
      {distribution.map((item, index) => {
        const starNum = maxStars - index;
        const percentage = getPercentage(item.count);
        
        return (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 w-8 flex-shrink-0">{starNum} star</span>
            <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full bg-amber-400 rounded-full"
              />
            </div>
            <span className="text-xs text-neutral-500 w-10 flex-shrink-0 text-right">{item.count}</span>
          </div>
        );
      })}
    </div>
  );
});

RatingDistribution.displayName = 'RatingDistribution';

// Main Rating Component
const Rating = memo(({ 
  value = 0, 
  maxStars = 5, 
  size = 'md',
  showValue = false,
  showCount = false,
  numReviews = 0,
  interactive = false,
  onChange,
  className,
  showDistribution = false,
  distribution = [],
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  // Memoized size classes
  const sizeClasses = useMemo(() => ({
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7',
  }), []);

  const textSizeClasses = useMemo(() => ({
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }), []);

  // Memoized display value
  const displayValue = useMemo(() => 
    interactive ? (hoveredRating || selectedRating || value) : value,
  [interactive, hoveredRating, selectedRating, value]);

  // Memoized rating label
  const getRatingLabel = useCallback((rating) => {
    if (rating === 0) return 'No rating';
    if (rating <= 1) return 'Poor';
    if (rating <= 2) return 'Fair';
    if (rating <= 3) return 'Good';
    if (rating <= 4) return 'Very Good';
    return 'Excellent';
  }, []);

  const ratingLabel = useMemo(() => getRatingLabel(displayValue), [displayValue, getRatingLabel]);

  // Handle star hover
  const handleStarHover = useCallback((starIndex) => {
    if (interactive) {
      setHoveredRating(starIndex);
    }
  }, [interactive]);

  // Handle star selection
  const handleStarSelect = useCallback((starIndex) => {
    if (interactive) {
      setSelectedRating(starIndex);
      onChange?.(starIndex);
    }
  }, [interactive, onChange]);

  // Generate star buttons
  const starButtons = useMemo(() => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <StarButton
          key={i}
          starIndex={i}
          displayValue={displayValue}
          sizeClasses={sizeClasses[size]}
          interactive={interactive}
          selectedRating={selectedRating}
          onHover={handleStarHover}
          onSelect={handleStarSelect}
        />
      );
    }
    return stars;
  }, [maxStars, displayValue, size, sizeClasses, interactive, selectedRating, handleStarHover, handleStarSelect]);

  // Memoized formatted display value
  const formattedValue = useMemo(() => 
    typeof displayValue === 'number' ? displayValue.toFixed(1) : displayValue,
  [displayValue]);

  // Memoized review count text
  const reviewCountText = useMemo(() => 
    numReviews > 0 ? `${numReviews.toLocaleString()} ${numReviews === 1 ? 'review' : 'reviews'}` : '',
  [numReviews]);

  // Determine rating color class
  const ratingColorClass = useMemo(() => {
    if (displayValue >= 4) return 'text-emerald-600 dark:text-emerald-400';
    if (displayValue >= 3) return 'text-amber-600 dark:text-amber-400';
    if (displayValue > 0) return 'text-red-500 dark:text-red-400';
    return 'text-neutral-400';
  }, [displayValue]);

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {starButtons}
        </div>
        
        {/* Value */}
        {showValue && (
          <span className={cn('font-bold text-neutral-900 dark:text-white ml-1', textSizeClasses[size])}>
            {formattedValue}
          </span>
        )}
        
        {/* Label */}
        {showValue && (
          <span className={cn(
            'font-medium ml-0.5',
            textSizeClasses[size],
            ratingColorClass
          )}>
            · {ratingLabel}
          </span>
        )}
        
        {/* Review Count */}
        {showCount && numReviews > 0 && (
          <span className={cn('text-neutral-500 dark:text-neutral-400 ml-1', textSizeClasses[size])}>
            ({reviewCountText})
          </span>
        )}
      </div>

      {/* Rating Distribution Bars */}
      {showDistribution && distribution.length > 0 && (
        <RatingDistribution 
          distribution={distribution} 
          maxStars={maxStars} 
          numReviews={numReviews} 
        />
      )}
    </div>
  );
});

Rating.displayName = 'Rating';

export default Rating;