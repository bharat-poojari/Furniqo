import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { cn } from '../../utils/cn';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  variant = 'default',
  size = 'md',
  siblingCount = 1,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Throttled resize listener
  useEffect(() => {
    let timeoutId;
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    
    checkScreenSize();
    
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const sizeClasses = useMemo(() => ({
    sm: {
      button: 'p-1.5 min-w-[28px] h-7 text-xs',
      icon: 'h-3.5 w-3.5',
      text: 'text-xs',
    },
    md: {
      button: 'p-2 min-w-[36px] h-9 text-sm',
      icon: 'h-4 w-4',
      text: 'text-sm',
    },
    lg: {
      button: 'p-2.5 min-w-[44px] h-11 text-base',
      icon: 'h-5 w-5',
      text: 'text-base',
    },
  }), []);

  const variantClasses = useMemo(() => ({
    default: {
      button: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
      active: 'bg-primary-600 text-white shadow-md shadow-primary-500/25',
    },
    minimal: {
      button: 'hover:text-primary-600 dark:hover:text-primary-400',
      active: 'bg-transparent text-primary-600 dark:text-primary-400 font-bold border-b-2 border-primary-600 rounded-none',
    },
    rounded: {
      button: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
      active: 'bg-primary-600 text-white shadow-md shadow-primary-500/25 rounded-full',
    },
  }), []);

  const getPageNumbers = useCallback(() => {
    const pages = [];
    let maxVisible;
    
    if (isMobile) {
      maxVisible = 3;
    } else if (isTablet) {
      maxVisible = 5;
    } else {
      maxVisible = 7;
    }
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - siblingCount);
      let end = Math.min(totalPages - 1, currentPage + siblingCount);
      
      // Adjust for mobile to show fewer pages
      if (isMobile) {
        if (currentPage <= 2) {
          end = Math.min(3, totalPages - 1);
        } else if (currentPage >= totalPages - 1) {
          start = Math.max(totalPages - 2, 2);
        } else {
          start = currentPage;
          end = currentPage;
        }
      } else if (isTablet) {
        if (currentPage <= 3) {
          end = Math.min(4, totalPages - 1);
        } else if (currentPage >= totalPages - 2) {
          start = Math.max(totalPages - 3, 2);
        } else {
          start = currentPage - 1;
          end = currentPage + 1;
        }
      } else {
        if (currentPage <= 3) {
          end = Math.min(5, totalPages - 1);
        } else if (currentPage >= totalPages - 2) {
          start = Math.max(totalPages - 4, 2);
        } else {
          start = currentPage - 2;
          end = currentPage + 2;
        }
      }
      
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  }, [currentPage, totalPages, isMobile, isTablet, siblingCount]);

  const handlePageChange = useCallback((page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }, [currentPage, totalPages, onPageChange]);

  const pageNumbers = useMemo(() => getPageNumbers(), [getPageNumbers]);
  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  if (totalPages <= 1) return null;

  return (
    <nav className={cn('flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap', className)} aria-label="Pagination">
      {/* First Page Button - Hide on very small screens if needed */}
      {showFirstLast && !isMobile && (
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            currentSize.button,
            'rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
            currentVariant.button,
            variant === 'rounded' && 'rounded-full'
          )}
          aria-label="First page"
        >
          <FiChevronsLeft className={currentSize.icon} />
        </button>
      )}

      {/* Previous Page Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          currentSize.button,
          'rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
          currentVariant.button,
          variant === 'rounded' && 'rounded-full'
        )}
        aria-label="Previous page"
      >
        <FiChevronLeft className={currentSize.icon} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pageNumbers.map((page, index) => {
          const isEllipsis = page === '...';
          const isActive = page === currentPage;
          
          if (isEllipsis) {
            return (
              <span
                key={`ellipsis-${index}`}
                className={cn(currentSize.button, 'cursor-default text-neutral-400 dark:text-neutral-600')}
              >
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={cn(
                currentSize.button,
                'rounded-lg font-medium transition-all duration-200',
                currentVariant.button,
                isActive && currentVariant.active,
                !isActive && 'hover:scale-105',
                variant === 'rounded' && isActive && 'rounded-full',
                variant === 'rounded' && !isActive && 'rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          currentSize.button,
          'rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
          currentVariant.button,
          variant === 'rounded' && 'rounded-full'
        )}
        aria-label="Next page"
      >
        <FiChevronRight className={currentSize.icon} />
      </button>

      {/* Last Page Button - Hide on very small screens if needed */}
      {showFirstLast && !isMobile && (
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            currentSize.button,
            'rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
            currentVariant.button,
            variant === 'rounded' && 'rounded-full'
          )}
          aria-label="Last page"
        >
          <FiChevronsRight className={currentSize.icon} />
        </button>
      )}

      {/* Page Info - More responsive design */}
      <div className={cn(
        "ml-2 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg",
        currentSize.text,
        "font-medium text-neutral-600 dark:text-neutral-400 whitespace-nowrap"
      )}>
        <span className="hidden xs:inline">Page </span>
        <span className="font-bold text-primary-600 dark:text-primary-400">{currentPage}</span>
        <span className="hidden xs:inline"> of </span>
        <span className="hidden xs:inline">{totalPages}</span>
        <span className="xs:hidden">/{totalPages}</span>
      </div>
    </nav>
  );
};

export default memo(Pagination);