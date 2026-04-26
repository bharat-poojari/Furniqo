import { Link } from 'react-router-dom';
import { FiTruck, FiPhone, FiPercent, FiX, FiGift, FiChevronRight } from 'react-icons/fi';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom SVG Icons
const SparkleIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const announcements = [
  { 
    icon: FiTruck, 
    text: 'Free shipping on orders over $200', 
    link: '/shipping',
    linkText: 'Learn More'
  },
  { 
    icon: FiPercent, 
    text: 'Up to 40% off on selected items – Limited Time!', 
    link: '/offers',
    linkText: 'Shop Sale'
  },
  { 
    icon: FiGift, 
    text: 'New customers get 10% off their first order', 
    link: '/signup',
    linkText: 'Sign Up'
  },
];

const TopBar = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentAnnouncement(prev => (prev + 1) % announcements.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentAnnouncement(prev => (prev - 1 + announcements.length) % announcements.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  if (!isVisible) return null;

  const CurrentIcon = announcements[currentAnnouncement].icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 text-white overflow-hidden"
          onMouseEnter={() => { setIsPaused(true); setIsHovered(true); }}
          onMouseLeave={() => { setIsPaused(false); setIsHovered(false); }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.06]">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          </div>

          {/* Animated Gradient Orbs */}
          <motion.div
            animate={{ x: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 rounded-full blur-xl hidden sm:block"
          />
          <motion.div
            animate={{ x: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -right-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 rounded-full blur-xl hidden sm:block"
          />

          <div className="relative w-full px-[1%] py-1.5 flex items-center justify-between gap-1 sm:gap-2">
            
            {/* Previous Arrow - Hidden on very small screens */}
            <button
              onClick={goToPrev}
              className={`p-1 hover:bg-white/10 rounded transition-all flex-shrink-0 ${isHovered || isMobile ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 hidden xs:inline-flex`}
              aria-label="Previous announcement"
            >
              <motion.svg 
                whileHover={{ x: -2 }}
                className="h-3.5 w-3.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </motion.svg>
            </button>

            {/* Announcement Content - Responsive */}
            <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAnnouncement}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center"
                >
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: currentAnnouncement * 0.5 }}
                    className="flex-shrink-0"
                  >
                    <CurrentIcon className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                  </motion.span>
                  
                  {/* Responsive Text */}
                  <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-center leading-tight break-words">
                    {announcements[currentAnnouncement].text}
                  </span>
                  
                  {/* Responsive Link Button */}
                  {announcements[currentAnnouncement].link && (
                    <Link
                      to={announcements[currentAnnouncement].link}
                      className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] xs:text-[10px] sm:text-xs font-semibold bg-white/15 hover:bg-white/25 backdrop-blur-sm px-1.5 xs:px-2 sm:px-2.5 py-0.5 rounded-full transition-all ml-0.5 sm:ml-2 flex-shrink-0"
                    >
                      <span className="hidden xs:inline">{announcements[currentAnnouncement].linkText}</span>
                      <span className="xs:hidden">
                        {announcements[currentAnnouncement].linkText === 'Learn More' ? 'Learn' : 
                         announcements[currentAnnouncement].linkText === 'Shop Sale' ? 'Shop' : 'Join'}
                      </span>
                      <FiChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Dot Indicators - Hide on very small screens */}
              <div className="hidden xs:flex gap-1 ml-2 sm:ml-3 flex-shrink-0">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAnnouncement(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentAnnouncement
                        ? 'bg-white w-4 sm:w-5 h-1 sm:h-1.5'
                        : 'bg-white/40 hover:bg-white/60 w-1 h-1 sm:w-1.5 sm:h-1.5'
                    }`}
                    aria-label={`Announcement ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Next Arrow - Hidden on very small screens */}
            <button
              onClick={goToNext}
              className={`p-1 hover:bg-white/10 rounded transition-all flex-shrink-0 ${isHovered || isMobile ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 hidden xs:inline-flex`}
              aria-label="Next announcement"
            >
              <motion.svg 
                whileHover={{ x: 2 }}
                className="h-3.5 w-3.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </button>

            {/* Close Button - Always visible, adjusted size */}
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0 ml-0 sm:ml-2"
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

export default TopBar;