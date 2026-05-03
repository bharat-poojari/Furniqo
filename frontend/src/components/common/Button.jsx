import { forwardRef, useMemo, memo } from 'react';
import { cn } from '../../utils/cn';

// CSS classes with better performance - consolidated
const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500/30 shadow-sm shadow-primary-500/20 hover:shadow-md hover:shadow-primary-500/25',
  secondary: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:bg-neutral-300 dark:active:bg-neutral-600 focus:ring-neutral-400/30',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/50 active:bg-primary-100 dark:active:bg-primary-950 focus:ring-primary-500/30',
  ghost: 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700 focus:ring-neutral-400/30',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500/30 shadow-sm shadow-red-500/20 hover:shadow-md hover:shadow-red-500/25',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500/30 shadow-sm shadow-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/25',
  white: 'bg-white text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 border border-neutral-200 focus:ring-neutral-400/30 shadow-sm hover:shadow-md',
  dark: 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-700 focus:ring-neutral-500/30 shadow-sm hover:shadow-md dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100',
  gradient: 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-500 hover:to-purple-500 active:from-primary-700 active:to-purple-700 focus:ring-primary-500/30 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
  sm: 'px-3.5 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
  xl: 'px-8 py-3.5 text-base rounded-xl gap-2.5',
};

const iconSizes = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-4.5 w-4.5',
  lg: 'h-5 w-5',
  xl: 'h-5.5 w-5.5',
};

// Memoized Loading Spinner component
const LoadingSpinner = memo(({ sizeClass }) => (
  <svg 
    className={cn('animate-spin flex-shrink-0', sizeClass)} 
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Memoized Button Icon component
const ButtonIcon = memo(({ Icon, iconSizeClass, position }) => (
  <Icon className={cn('flex-shrink-0', iconSizeClass)} aria-hidden="true" />
));

ButtonIcon.displayName = 'ButtonIcon';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  animate = true,
  loadingText,
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  // Memoize class combinations
  const buttonClasses = useMemo(() => cn(
    'relative inline-flex items-center justify-center font-semibold transition-all duration-150',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 focus:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'select-none',
    fullWidth && 'w-full',
    variants[variant],
    sizes[size],
    animate && !isDisabled && 'hover:scale-102 active:scale-98',
    className
  ), [variant, size, fullWidth, className, animate, isDisabled]);

  // Memoize icon size class
  const iconSizeClass = useMemo(() => iconSizes[size], [size]);

  // Memoize loading spinner with icon size
  const spinnerElement = useMemo(() => 
    loading && <LoadingSpinner sizeClass={iconSizeClass} />,
  [loading, iconSizeClass]);

  const iconElement = useMemo(() => 
    !loading && Icon && <ButtonIcon Icon={Icon} iconSizeClass={iconSizeClass} position={iconPosition} />,
  [loading, Icon, iconSizeClass, iconPosition]);

  // Memoize button content
  const buttonContent = useMemo(() => (
    <>
      {spinnerElement}
      {iconPosition === 'left' && iconElement}
      <span className="relative">
        {loading && loadingText ? loadingText : children}
      </span>
      {iconPosition === 'right' && iconElement}
      {loading && (
        <span className="absolute inset-0 rounded-inherit border-2 border-current opacity-20 animate-pulse" aria-hidden="true" />
      )}
    </>
  ), [spinnerElement, iconPosition, iconElement, loading, loadingText, children]);

  const handleClick = useMemo(() => {
    if (isDisabled) return undefined;
    return onClick;
  }, [isDisabled, onClick]);

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={handleClick}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...props}
    >
      {buttonContent}
    </button>
  );
});

Button.displayName = 'Button';

// Named exports for specific button types
export const PrimaryButton = memo(forwardRef((props, ref) => (
  <Button ref={ref} variant="primary" {...props} />
)));
PrimaryButton.displayName = 'PrimaryButton';

export const SecondaryButton = memo(forwardRef((props, ref) => (
  <Button ref={ref} variant="secondary" {...props} />
)));
SecondaryButton.displayName = 'SecondaryButton';

export const OutlineButton = memo(forwardRef((props, ref) => (
  <Button ref={ref} variant="outline" {...props} />
)));
OutlineButton.displayName = 'OutlineButton';

export const DangerButton = memo(forwardRef((props, ref) => (
  <Button ref={ref} variant="danger" {...props} />
)));
DangerButton.displayName = 'DangerButton';

export const GradientButton = memo(forwardRef((props, ref) => (
  <Button ref={ref} variant="gradient" {...props} />
)));
GradientButton.displayName = 'GradientButton';

export default memo(Button);