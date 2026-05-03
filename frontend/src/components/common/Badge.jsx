import { cn } from '../../utils/cn';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { memo, useCallback, useMemo } from 'react';

// Animation variants - simplified for performance
const badgeVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } }
};

// Memoized remove button component
const RemoveButton = memo(({ onRemove, variant, size, iconSize }) => {
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onRemove?.();
  }, [onRemove]);

  const isLightVariant = useMemo(() => 
    variant === 'sale' || variant === 'new' || variant === 'featured' || 
    variant === 'limited' || variant === 'premium',
  [variant]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'rounded-full p-0.5 transition-colors duration-150',
        isLightVariant
          ? 'hover:bg-white/20 text-white/70 hover:text-white'
          : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-current/50 hover:text-current'
      )}
      aria-label="Remove"
    >
      <FiX className={iconSize} />
    </button>
  );
});

RemoveButton.displayName = 'RemoveButton';

// Memoized count badge component
const CountBadge = memo(({ count, size, variant }) => {
  const sizeClasses = useMemo(() => ({
    xs: 'text-[9px] min-w-[14px] h-[14px] px-1',
    sm: 'text-[10px] min-w-[16px] h-[16px] px-1',
    md: 'text-xs min-w-[18px] h-[18px] px-1.5',
    lg: 'text-xs min-w-[20px] h-[20px] px-1.5'
  }), []);

  const isLightVariant = useMemo(() => 
    variant === 'sale' || variant === 'new' || variant === 'featured' || 
    variant === 'limited' || variant === 'premium',
  [variant]);

  const displayCount = useMemo(() => count > 99 ? '99+' : count, [count]);

  return (
    <span className={cn(
      'inline-flex items-center justify-center rounded-full font-bold',
      isLightVariant
        ? 'bg-white/20 text-white'
        : 'bg-white dark:bg-neutral-700 text-current',
      sizeClasses[size] || sizeClasses.sm
    )}>
      {displayCount}
    </span>
  );
});

CountBadge.displayName = 'CountBadge';

// Memoized Pulse Dot component
const PulseDot = memo(({ variant }) => {
  const dotColor = useMemo(() => {
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
    return dotColors[variant] || dotColors.default;
  }, [variant]);

  return (
    <span className="relative flex h-2 w-2">
      <span className={cn(
        'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
        dotColor
      )} />
      <span className={cn(
        'relative inline-flex rounded-full h-2 w-2',
        dotColor
      )} />
    </span>
  );
});

PulseDot.displayName = 'PulseDot';

// Memoized Static Dot component
const StaticDot = memo(({ variant }) => {
  const dotColor = useMemo(() => {
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
    return dotColors[variant] || dotColors.default;
  }, [variant]);

  return (
    <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
  );
});

StaticDot.displayName = 'StaticDot';

// Main Badge Component
const Badge = memo(({ 
  children, 
  variant = 'default',
  size = 'sm',
  className,
  dot = false,
  removable = false,
  onRemove,
  icon: Icon,
  animated = false,
  pulse = false,
  count,
}) => {
  // Memoized variant classes
  const variantClasses = useMemo(() => ({
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
  }), []);

  const sizeClasses = useMemo(() => ({
    xs: 'px-1.5 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-1.5',
  }), []);

  const iconSizes = useMemo(() => ({
    xs: 'h-2.5 w-2.5',
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  }), []);

  const badgeClassName = useMemo(() => cn(
    'inline-flex items-center font-medium rounded-full transition-colors duration-150',
    'whitespace-nowrap select-none',
    variantClasses[variant],
    sizeClasses[size],
    removable && 'pr-1.5',
    className
  ), [variant, size, removable, className, variantClasses, sizeClasses]);

  const iconSize = useMemo(() => iconSizes[size], [size, iconSizes]);

  const content = (
    <span className={badgeClassName}>
      {pulse && <PulseDot variant={variant} />}
      {dot && !pulse && <StaticDot variant={variant} />}
      {Icon && <Icon className={iconSize} />}
      {children}
      {count !== undefined && (
        <CountBadge count={count} size={size} variant={variant} />
      )}
      {removable && (
        <RemoveButton
          onRemove={onRemove}
          variant={variant}
          size={size}
          iconSize={iconSize}
        />
      )}
    </span>
  );

  // Wrap in motion component if animated
  if (animated) {
    return (
      <AnimatePresence mode="wait">
        <motion.span
          key="badge"
          variants={badgeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {content}
        </motion.span>
      </AnimatePresence>
    );
  }

  return content;
});

Badge.displayName = 'Badge';

// Preset Badges - memoized for better performance
export const SaleBadge = memo((props) => <Badge variant="sale" {...props}>Sale</Badge>);
SaleBadge.displayName = 'SaleBadge';

export const NewBadge = memo((props) => <Badge variant="new" {...props}>New</Badge>);
NewBadge.displayName = 'NewBadge';

export const FeaturedBadge = memo((props) => <Badge variant="featured" {...props}>Featured</Badge>);
FeaturedBadge.displayName = 'FeaturedBadge';

export const BestSellerBadge = memo((props) => <Badge variant="bestseller" {...props}>Best Seller</Badge>);
BestSellerBadge.displayName = 'BestSellerBadge';

export const LimitedBadge = memo((props) => <Badge variant="limited" {...props}>Limited</Badge>);
LimitedBadge.displayName = 'LimitedBadge';

export const PremiumBadge = memo((props) => <Badge variant="premium" {...props}>Premium</Badge>);
PremiumBadge.displayName = 'PremiumBadge';

export const SoldOutBadge = memo((props) => <Badge variant="danger" dot {...props}>Sold Out</Badge>);
SoldOutBadge.displayName = 'SoldOutBadge';

export const InStockBadge = memo((props) => <Badge variant="success" dot pulse {...props}>In Stock</Badge>);
InStockBadge.displayName = 'InStockBadge';

export default Badge;