import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

// Custom Star SVG for better control
const StarIcon = ({ filled, halfFilled, className }) => (
  <svg 
    className={cn(
      'transition-all duration-200',
      filled ? 'text-amber-400 fill-amber-400' : halfFilled ? 'text-amber-400 fill-amber-400/50' : 'text-neutral-300 dark:text-neutral-600',
      className
    )}
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

const Rating = ({ 
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

  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7',
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const displayValue = interactive ? (hoveredRating || selectedRating || value) : value;
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    const filled = i <= Math.floor(displayValue);
    const halfFilled = !filled && i - 0.5 <= displayValue;

    stars.push(
      <motion.button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => {
          if (interactive) {
            setSelectedRating(i);
            onChange?.(i);
          }
        }}
        onMouseEnter={() => interactive && setHoveredRating(i)}
        onMouseLeave={() => interactive && setHoveredRating(0)}
        whileHover={interactive ? { scale: 1.2 } : {}}
        whileTap={interactive ? { scale: 0.9 } : {}}
        className={cn(
          'transition-all duration-150 relative',
          interactive && 'cursor-pointer',
          !interactive && 'cursor-default',
        )}
        aria-label={`Rate ${i} star${i !== 1 ? 's' : ''}`}
      >
        <StarIcon 
          filled={filled}
          halfFilled={halfFilled}
          className={sizeClasses[size]}
        />
        
        {/* Ripple effect on click */}
        {interactive && selectedRating === i && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-amber-400 rounded-full"
          />
        )}
      </motion.button>
    );
  }

  // Get rating label
  const getRatingLabel = (rating) => {
    if (rating === 0) return 'No rating';
    if (rating <= 1) return 'Poor';
    if (rating <= 2) return 'Fair';
    if (rating <= 3) return 'Good';
    if (rating <= 4) return 'Very Good';
    return 'Excellent';
  };

  const ratingLabel = getRatingLabel(displayValue);

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {stars}
        </div>
        
        {/* Value */}
        {showValue && (
          <span className={cn('font-bold text-neutral-900 dark:text-white ml-1', textSizeClasses[size])}>
            {typeof displayValue === 'number' ? displayValue.toFixed(1) : displayValue}
          </span>
        )}
        
        {/* Label */}
        {showValue && (
          <span className={cn(
            'font-medium ml-0.5',
            textSizeClasses[size],
            displayValue >= 4 ? 'text-emerald-600 dark:text-emerald-400' : 
            displayValue >= 3 ? 'text-amber-600 dark:text-amber-400' : 
            displayValue > 0 ? 'text-red-500 dark:text-red-400' : 
            'text-neutral-400'
          )}>
            · {ratingLabel}
          </span>
        )}
        
        {/* Review Count */}
        {showCount && numReviews > 0 && (
          <span className={cn('text-neutral-500 dark:text-neutral-400 ml-1', textSizeClasses[size])}>
            ({numReviews.toLocaleString()} {numReviews === 1 ? 'review' : 'reviews'})
          </span>
        )}
      </div>

      {/* Rating Distribution Bars */}
      {showDistribution && distribution.length > 0 && (
        <div className="space-y-1 mt-2">
          {distribution.map((item, index) => {
            const starNum = maxStars - index;
            const percentage = numReviews > 0 ? ((item.count / numReviews) * 100) : 0;
            
            return (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 w-8 flex-shrink-0">{starNum} star</span>
                <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
                <span className="text-xs text-neutral-500 w-10 flex-shrink-0 text-right">{item.count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Rating;