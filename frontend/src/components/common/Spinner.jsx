import { cn } from '../../utils/cn';

const Spinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary-600 border-t-transparent',
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
      <div className="text-center">
        <div className="relative">
          <Spinner size="xl" className=" mb-6" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🪑</span>
          </div>
        </div>
        <p className="text-neutral-500 dark:text-neutral-400 animate-pulse">
          Loading Furniqo...
        </p>
      </div>
    </div>
  );
};

export default Spinner;