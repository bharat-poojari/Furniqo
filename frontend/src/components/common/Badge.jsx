import { cn } from '../../utils/cn';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'sm',
  className,
  dot,
}) => {
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    sale: 'bg-red-500 text-white',
    new: 'bg-emerald-500 text-white',
    featured: 'bg-purple-500 text-white',
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-2xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'success' && 'bg-green-500',
          variant === 'warning' && 'bg-amber-500',
          variant === 'danger' && 'bg-red-500',
          variant === 'info' && 'bg-blue-500',
          (!['success', 'warning', 'danger', 'info'].includes(variant)) && 'bg-current',
        )} />
      )}
      {children}
    </span>
  );
};

export default Badge;