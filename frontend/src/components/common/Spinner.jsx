import { cn } from '../../utils/cn';

const Spinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div
      className={cn(
        'spinner rounded-full border-primary-500/30 border-t-primary-600 dark:border-primary-400/20 dark:border-t-primary-400',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-6">
        {/* Logo + Spinner */}
        <div className="relative">
          <Spinner size="xl" className="border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/logo.svg" 
              alt="Furniqo" 
              className="h-8 w-8 object-contain"
              loading="eager"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
        
        {/* Loading Text */}
        <p className="text-sm text-neutral-400 dark:text-neutral-500 pulse-text">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Spinner;