import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { cn } from '../../utils/cn';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  variant = 'default', // 'default', 'minimal', 'rounded'
  size = 'md', // 'sm', 'md', 'lg'
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (totalPages <= 1) return null;

  const sizeClasses = {
    sm: {
      button: 'p-1.5 min-w-[32px] h-8 text-xs',
      icon: 'h-4 w-4',
    },
    md: {
      button: 'p-2 min-w-[40px] h-10 text-sm',
      icon: 'h-5 w-5',
    },
    lg: {
      button: 'p-2.5 min-w-[48px] h-12 text-base',
      icon: 'h-6 w-6',
    },
  };

  const variantClasses = {
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
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        end = Math.min(4, totalPages - 1);
      }
      if (currentPage >= totalPages - 1) {
        start = Math.max(totalPages - 3, 2);
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
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Smooth scroll to top when changing page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pageNumbers = getPageNumbers();
  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  return (
    <nav className={cn('flex items-center justify-center gap-1.5', className)} aria-label="Pagination">
      {/* First Page Button */}
      {showFirstLast && (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
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
        </motion.button>
      )}

      {/* Previous Page Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
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
      </motion.button>

      {/* Page Numbers - No AnimatePresence to avoid conflicts */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          const isEllipsis = page === '...';
          const isActive = page === currentPage;
          
          return (
            <motion.button
              key={`${page}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, delay: index * 0.03 }}
              onClick={() => !isEllipsis && handlePageChange(page)}
              disabled={isEllipsis}
              whileHover={!isEllipsis ? { scale: 1.05 } : {}}
              whileTap={!isEllipsis ? { scale: 0.95 } : {}}
              className={cn(
                currentSize.button,
                'rounded-lg font-medium transition-all duration-200',
                isEllipsis
                  ? 'cursor-default text-neutral-400 dark:text-neutral-600'
                  : cn(
                      currentVariant.button,
                      isActive && currentVariant.active,
                      !isActive && 'hover:scale-105',
                      variant === 'rounded' && isActive && 'rounded-full',
                      variant === 'rounded' && !isActive && 'rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    )
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </motion.button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
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
      </motion.button>

      {/* Last Page Button */}
      {showFirstLast && (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
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
        </motion.button>
      )}

      {/* Page Info for Mobile */}
      {isMobile && totalPages > 5 && (
        <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
          Page {currentPage} of {totalPages}
        </span>
      )}
    </nav>
  );
};

export default Pagination;