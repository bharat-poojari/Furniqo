import { cn } from '../../utils/cn';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'sm',
  className,
  dot,
  removable = false,
  onRemove,
  icon: Icon,
  animated = false,
  pulse = false,
  count,
}) => {
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700',
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-200 dark:border-primary-800/50',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50',
    sale: 'bg-red-500 text-white border border-red-400',
    new: 'bg-emerald-500 text-white border border-emerald-400',
    featured: 'bg-purple-500 text-white border border-purple-400',
    bestseller: 'bg-amber-500 text-white border border-amber-400',
    limited: 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
    premium: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-900',
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-1.5',
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    primary: 'bg-primary-500',
    sale: 'bg-white',
    new: 'bg-white',
    featured: 'bg-white',
    bestseller: 'bg-white',
    limited: 'bg-white',
    premium: 'bg-white',
    default: 'bg-current',
  };

  const iconSizes = {
    xs: 'h-2.5 w-2.5',
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  const Component = animated ? motion.span : 'span';

  const badgeContent = (
    <Component
      initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      exit={animated ? { scale: 0.8, opacity: 0 } : undefined}
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-colors duration-200',
        'whitespace-nowrap select-none',
        variantClasses[variant],
        sizeClasses[size],
        removable && 'pr-1.5',
        className
      )}
    >
      {/* Pulse Dot */}
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            dotColors[variant] || dotColors.default
          )} />
          <span className={cn(
            'relative inline-flex rounded-full h-2 w-2',
            dotColors[variant] || dotColors.default
          )} />
        </span>
      )}

      {/* Static Dot */}
      {dot && !pulse && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          dotColors[variant] || dotColors.default
        )} />
      )}

      {/* Icon */}
      {Icon && <Icon className={iconSizes[size]} />}

      {/* Content */}
      {children}

      {/* Count Badge */}
      {count !== undefined && (
        <span className={cn(
          'inline-flex items-center justify-center rounded-full font-bold',
          variant === 'sale' || variant === 'new' || variant === 'featured' || variant === 'limited' || variant === 'premium'
            ? 'bg-white/20 text-white'
            : 'bg-white dark:bg-neutral-700 text-current',
          size === 'xs' ? 'text-[9px] min-w-[14px] h-[14px] px-1' :
          size === 'sm' ? 'text-[10px] min-w-[16px] h-[16px] px-1' :
          'text-xs min-w-[18px] h-[18px] px-1.5'
        )}>
          {count > 99 ? '99+' : count}
        </span>
      )}

      {/* Remove Button */}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className={cn(
            'rounded-full p-0.5 transition-colors',
            variant === 'sale' || variant === 'new' || variant === 'featured' || variant === 'limited' || variant === 'premium'
              ? 'hover:bg-white/20 text-white/70 hover:text-white'
              : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-current/50 hover:text-current'
          )}
          aria-label="Remove"
        >
          <FiX className={iconSizes[size]} />
        </button>
      )}
    </Component>
  );

  // Wrap in AnimatePresence if animated
  if (animated) {
    return (
      <AnimatePresence>
        {badgeContent}
      </AnimatePresence>
    );
  }

  return badgeContent;
};

// Preset Badges
export const SaleBadge = (props) => <Badge variant="sale" {...props}>Sale</Badge>;
export const NewBadge = (props) => <Badge variant="new" {...props}>New</Badge>;
export const FeaturedBadge = (props) => <Badge variant="featured" {...props}>Featured</Badge>;
export const BestSellerBadge = (props) => <Badge variant="bestseller" {...props}>Best Seller</Badge>;
export const LimitedBadge = (props) => <Badge variant="limited" {...props}>Limited</Badge>;
export const PremiumBadge = (props) => <Badge variant="premium" {...props}>Premium</Badge>;
export const SoldOutBadge = (props) => <Badge variant="danger" dot {...props}>Sold Out</Badge>;
export const InStockBadge = (props) => <Badge variant="success" dot pulse {...props}>In Stock</Badge>;

export default Badge;