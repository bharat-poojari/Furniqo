import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';

// Optimized animation variants
const buttonVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.1, ease: 'easeIn' } },
  hover: { scale: 1.05, transition: { duration: 0.08 } },
  tap: { scale: 0.95, transition: { duration: 0.05 } }
};

const ScrollToTop = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const rafRef = useRef(null);

  // Optimized scroll handler with requestAnimationFrame and debouncing
  const handleScroll = useCallback(() => {
    // Cancel previous animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use requestAnimationFrame for smoother performance
    rafRef.current = requestAnimationFrame(() => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const shouldBeVisible = scrollPosition > 400;
      
      // Only update state if visibility changed
      setIsVisible(prev => prev !== shouldBeVisible ? shouldBeVisible : prev);
    });
  }, []);

  // Throttled scroll listener with passive option
  useEffect(() => {
    // Use passive: true for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Optimized scroll to top with smooth behavior and fallback
  const scrollToTop = useCallback(() => {
    // Cancel any ongoing scroll animation
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Use modern smooth scroll with fallback
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      // Fallback for older browsers
      const scrollStep = () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 0) {
          window.scrollTo(0, currentScroll - (currentScroll / 8));
          scrollTimeoutRef.current = setTimeout(scrollStep, 15);
        }
      };
      scrollStep();
    }
  }, []);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  }, [scrollToTop]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.button
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          whileHover="hover"
          whileTap="tap"
          onClick={scrollToTop}
          onKeyDown={handleKeyDown}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
          aria-label="Scroll to top"
          title="Scroll to top"
          role="button"
          tabIndex={0}
        >
          <FiArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
});

ScrollToTop.displayName = 'ScrollToTop';

export default ScrollToTop;