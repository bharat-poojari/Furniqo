import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500 shadow-lg hover:shadow-xl',
  secondary: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:ring-neutral-500',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 focus:ring-primary-500',
  ghost: 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:ring-neutral-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-lg',
  success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 shadow-lg',
  white: 'bg-white text-neutral-900 hover:bg-neutral-100 border border-neutral-200 focus:ring-neutral-500 shadow-sm',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
  sm: 'px-3 py-2 text-sm rounded-lg gap-2',
  md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
  xl: 'px-8 py-4 text-lg rounded-xl gap-3',
};

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
  ...props
}, ref) => {
  const Component = animate ? motion.button : 'button';

  return (
    <Component
      ref={ref}
      whileHover={animate && !disabled ? { scale: 1.02 } : {}}
      whileTap={animate && !disabled ? { scale: 0.98 } : {}}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        fullWidth && 'w-full',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin h-4 w-4" 
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
          />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="h-5 w-5" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="h-5 w-5" />}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;