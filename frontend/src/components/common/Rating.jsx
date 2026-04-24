import { FiStar } from 'react-icons/fi';
import { cn } from '../../utils/cn';

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
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    const filled = i <= Math.floor(value);
    const halfFilled = !filled && i - 0.5 <= value;  // ✅ Now properly scoped inside the loop
    
    stars.push(
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onChange?.(i)}
        className={cn(
          'transition-all duration-200',
          interactive && 'cursor-pointer hover:scale-110',
          !interactive && 'cursor-default',
          sizeClasses[size],
          (filled || halfFilled) 
            ? 'text-amber-400' 
            : 'text-neutral-300 dark:text-neutral-700',
        )}
        aria-label={`${i} star${i !== 1 ? 's' : ''}`}
      >
        <FiStar 
          className={cn(
            'transition-colors duration-200',
            filled ? 'fill-current' : halfFilled ? 'fill-current opacity-60' : ''
          )} 
        />
      </button>
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">{stars}</div>
      
      {showValue && (
        <span className="font-semibold text-neutral-900 dark:text-white ml-1 text-sm">
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
      )}
      
      {showCount && numReviews > 0 && (
        <span className="text-neutral-500 dark:text-neutral-400 text-sm ml-1">
          ({numReviews.toLocaleString()} {numReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default Rating;