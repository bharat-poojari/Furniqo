import { Link } from 'react-router-dom';
import { FiTruck, FiPhone, FiPercent, FiX, FiGift, FiChevronRight, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom SVG Icons - memoized
const SparkleIcon = memo((props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
));

SparkleIcon.displayName = 'SparkleIcon';

// Memoized announcements data
const announcements = [
  { 
    icon: FiTruck, 
    text: 'Free shipping on orders over $200', 
    link: '/shipping',
    linkText: 'Learn More',
    mobileText: 'Learn'
  },
  { 
    icon: FiPercent, 
    text: 'Up to 40% off on selected items – Limited Time!', 
    link: '/offers',
    linkText: 'Shop Sale',
    mobileText: 'Shop'
  },
  { 
    icon: FiGift, 
    text: 'New customers get 10% off their first order', 
    link: '/signup',
    linkText: 'Sign Up',
    mobileText: 'Join'
  },
];

// Optimized animation variants
const containerVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.2 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.15 } }
};

const contentVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

const orbVariants = {
  animate: {
    x: [0, 15, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  }
};

const iconVariants = {
  animate: {
    rotate: [0, 8, -8, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
  }
};

// Memoized Dot Indicator component
const DotIndicator = memo(({ index, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-white/50 ${
      isActive
        ? 'bg-white w-3 sm:w-4 h-1 sm:h-1.5 rounded-full'
        : 'bg-white/40 hover:bg-white/60 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full'
    }`}
    aria-label={`Announcement ${index + 1}`}
  />
));

DotIndicator.displayName = 'DotIndicator';

// Memoized Navigation Button component
const NavButton = memo(({ direction, onClick, ariaLabel }) => (
  <button
    onClick={onClick}
    className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 hidden xs:inline-flex focus:outline-none focus:ring-1 focus:ring-white/30 active:scale-95"
    aria-label={ariaLabel}
  >
    {direction === 'prev' ? (
      <FiArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
    ) : (
      <FiArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
    )}
  </button>
));

NavButton.displayName = 'NavButton';

// Main TopBar Component
const TopBar = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Optimized mobile detection with debounce
  useEffect(() => {
    let timeoutId;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Memoized navigation functions
  const goToNext = useCallback(() => {
    setCurrentAnnouncement(prev => (prev + 1) % announcements.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentAnnouncement(prev => (prev - 1 + announcements.length) % announcements.length);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentAnnouncement(index);
  }, []);

  // Optimized interval with cleanup
  useEffect(() => {
    if (isPaused || !isVisible) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    intervalRef.current = setInterval(goToNext, 5000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, isVisible, goToNext]);

  // Touch swipe for mobile
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  }, [goToNext, goToPrev]);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);
  const handleClose = useCallback(() => setIsVisible(false), []);

  // Memoized current announcement data
  const currentData = useMemo(() => announcements[currentAnnouncement], [currentAnnouncement]);
  const CurrentIcon = currentData.icon;

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 text-white overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Simplified Background Pattern - Better performance */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', 
              backgroundSize: '24px 24px' 
            }} />
          </div>

          {/* Optimized Gradient Orbs - Only on desktop, reduced complexity */}
          <motion.div
            variants={orbVariants}
            animate="animate"
            className="absolute -left-10 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/8 rounded-full blur-xl hidden sm:block pointer-events-none"
          />
          <motion.div
            variants={orbVariants}
            animate="animate"
            custom={2.5}
            className="absolute -right-10 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/8 rounded-full blur-xl hidden sm:block pointer-events-none"
          />

          <div className="relative w-full px-[1%] py-1.5 flex items-center justify-between gap-1 sm:gap-2">
            
            {/* Previous Arrow */}
            <NavButton direction="prev" onClick={goToPrev} ariaLabel="Previous announcement" />

            {/* Announcement Content */}
            <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAnnouncement}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center"
                >
                  {/* Smaller icon with reduced animation */}
                  <motion.span
                    variants={iconVariants}
                    animate="animate"
                    className="flex-shrink-0"
                  >
                    <CurrentIcon className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                  </motion.span>
                  
                  {/* Optimized Text */}
                  <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-center leading-tight">
                    {currentData.text}
                  </span>
                  
                  {/* Responsive Link Button */}
                  <Link
                    to={currentData.link}
                    className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] xs:text-[10px] sm:text-xs font-semibold bg-white/15 hover:bg-white/25 backdrop-blur-sm px-1.5 xs:px-2 sm:px-2.5 py-0.5 rounded-full transition-all ml-0.5 sm:ml-2 flex-shrink-0 active:scale-95"
                  >
                    <span className="hidden xs:inline">{currentData.linkText}</span>
                    <span className="xs:hidden">{currentData.mobileText}</span>
                    <FiChevronRight className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                  </Link>
                </motion.div>
              </AnimatePresence>
              
              {/* Dot Indicators */}
              <div className="hidden xs:flex gap-1 ml-2 sm:ml-3 flex-shrink-0">
                {announcements.map((_, index) => (
                  <DotIndicator
                    key={index}
                    index={index}
                    isActive={index === currentAnnouncement}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>

            {/* Next Arrow */}
            <NavButton direction="next" onClick={goToNext} ariaLabel="Next announcement" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 ml-0 sm:ml-2 focus:outline-none focus:ring-1 focus:ring-white/30 active:scale-95"
              aria-label="Close announcement bar"
            >
              <FiX className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(TopBar);