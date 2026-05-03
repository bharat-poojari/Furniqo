import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight, FiStar, FiMessageCircle, FiHeart, FiThumbsUp } from 'react-icons/fi';
import { testimonials } from '../../data/data';
import { Skeleton } from '../common/Skeleton';

// Memoized Star Rating Component - Removed unnecessary animations
const StarRating = memo(({ rating }) => (
  <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
    {[...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
          i < rating 
            ? 'fill-amber-400 text-amber-400' 
            : 'text-neutral-300 dark:text-neutral-600'
        }`}
      />
    ))}
  </div>
));

StarRating.displayName = 'StarRating';

// Optimized Author Info - Removed framer-motion, kept only essential CSS transitions
const AuthorInfo = memo(({ name, role, location, image, verified, isLiked, likes, onLike }) => {
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikes, setLocalLikes] = useState(likes);

  useEffect(() => {
    setLocalLiked(isLiked);
    setLocalLikes(likes);
  }, [isLiked, likes]);

  const handleLikeClick = useCallback(() => {
    const newLiked = !localLiked;
    setLocalLiked(newLiked);
    setLocalLikes(prev => newLiked ? prev + 1 : prev - 1);
    onLike();
  }, [localLiked, onLike]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-900"
            loading="lazy"
          />
          <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full w-2 h-2 sm:w-2 sm:h-2 border border-white dark:border-neutral-800" />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="font-semibold text-neutral-900 dark:text-white text-xs sm:text-sm truncate">
              {name}
            </p>
            {verified && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5 flex-shrink-0">
                <FiThumbsUp className="w-2 h-2" />
                <span className="hidden xs:inline">Verified</span>
              </span>
            )}
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-[9px] sm:text-[10px] truncate">
            {role} • {location}
          </p>
        </div>
      </div>
      
      {/* Simplified like button - removed framer-motion animations, kept CSS transitions */}
      <button 
        onClick={handleLikeClick}
        className={`relative p-1.5 rounded-full transition-all duration-200 flex-shrink-0 ${
          localLiked 
            ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
            : 'text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
        }`}
        aria-label={localLiked ? "Unlike testimonial" : "Like testimonial"}
      >
        <FiHeart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${localLiked ? 'fill-current' : ''}`} />
        
        {localLikes > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[8px] font-bold rounded-full min-w-[14px] h-3.5 px-0.5 flex items-center justify-center">
            {localLikes > 99 ? '99+' : localLikes}
          </span>
        )}
      </button>
    </div>
  );
});

AuthorInfo.displayName = 'AuthorInfo';

// Memoized Autoplay Button Component - Removed hover scale animation
const AutoplayButton = memo(({ isPlaying, onClick }) => (
  <button
    onClick={onClick}
    className="group relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white dark:bg-neutral-800 shadow-soft hover:shadow-medium border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500"
    aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
  >
    {isPlaying ? (
      <svg 
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700 dark:text-neutral-300"
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      </svg>
    ) : (
      <svg 
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700 dark:text-neutral-300"
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z"/>
      </svg>
    )}
    
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-neutral-800 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded pointer-events-none whitespace-nowrap">
      {isPlaying ? 'Pause' : 'Play'}
    </span>
  </button>
));

AutoplayButton.displayName = 'AutoplayButton';

// Optimized Stats Component - Removed framer-motion, using CSS-only
const StatsSection = memo(() => {
  const stats = useMemo(() => [
    { value: '98%', label: 'Satisfaction' },
    { value: '10k+', label: 'Customers' },
    { value: '4.9', label: 'Rating' },
    { value: '5+ Yrs', label: 'Trusted' },
  ], []);

  return (
    <div className="mt-6 sm:mt-8 grid grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto">
      {stats.map((stat, idx) => (
        <div key={idx} className="text-center p-1.5 sm:p-3">
          <div className="text-sm sm:text-base md:text-xl font-bold text-primary-600 dark:text-primary-400">
            {stat.value}
          </div>
          <div className="text-[9px] sm:text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
});

StatsSection.displayName = 'StatsSection';

const Testimonials = () => {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [autoplay, setAutoplay] = useState(true);
  const [likedTestimonials, setLikedTestimonials] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const intervalRef = useRef(null);
  const autoplayRef = useRef(autoplay);

  // Update ref when autoplay changes
  useEffect(() => {
    autoplayRef.current = autoplay;
  }, [autoplay]);

  // Load likes from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('furniqo_liked_testimonials');
    if (savedLikes) {
      setLikedTestimonials(JSON.parse(savedLikes));
    }
  }, []);

  // Save likes to localStorage whenever they change
  const handleLike = useCallback((testimonialId) => {
    setLikedTestimonials(prev => {
      const updated = {
        ...prev,
        [testimonialId]: !prev[testimonialId]
      };
      localStorage.setItem('furniqo_liked_testimonials', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Load testimonials data
  useEffect(() => {
    const timer = setTimeout(() => {
      setTestimonialsData(testimonials);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Optimized navigation functions
  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  }, [testimonialsData.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  }, [testimonialsData.length]);

  const goToTestimonial = useCallback((index) => {
    setCurrentIndex(index);
    if (autoplayRef.current) {
      setAutoplay(false);
    }
  }, []);

  const toggleAutoplay = useCallback(() => {
    setAutoplay(prev => !prev);
  }, []);

  // Autoplay functionality - optimized
  useEffect(() => {
    if (autoplay && testimonialsData.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
      }, 5000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, testimonialsData.length]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.touches[0].clientX);
    if (autoplayRef.current) setAutoplay(false);
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextTestimonial();
      } else {
        prevTestimonial();
      }
    }
    setTouchStart(null);
  }, [touchStart, nextTestimonial, prevTestimonial]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevTestimonial();
        if (autoplayRef.current) setAutoplay(false);
      } else if (e.key === 'ArrowRight') {
        nextTestimonial();
        if (autoplayRef.current) setAutoplay(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevTestimonial, nextTestimonial]);

  // Loading skeleton - removed motion wrapper
  const LoadingSkeleton = useMemo(() => (
    <section className="py-6 sm:py-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        <div className="text-center mb-6 sm:mb-8">
          <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mx-auto mb-2 sm:mb-3" />
          <Skeleton className="h-4 sm:h-5 w-64 sm:w-96 mx-auto" />
        </div>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-80 lg:h-72 w-full rounded-2xl sm:rounded-3xl" />
        </div>
      </div>
    </section>
  ), []);

  if (loading) return LoadingSkeleton;

  const currentTestimonial = testimonialsData[currentIndex];
  const isLiked = likedTestimonials[currentTestimonial?.id];

  if (!currentTestimonial) return null;

  return (
    <section 
      className="py-6 sm:py-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800 relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Decorations - Minimal for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary-200/20 dark:bg-primary-900/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-purple-200/20 dark:bg-purple-900/10 rounded-full translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="w-full px-[1%] sm:px-[1.5%] relative">
        {/* Header - Removed motion wrapper, using CSS only */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-3">
            <FiMessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="text-[10px] sm:text-xs font-medium">Trusted by 10,000+ customers</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-display font-bold bg-gradient-to-r from-neutral-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent mb-1.5 sm:mb-2 px-4 sm:px-0">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto px-4 sm:px-0">
            Join thousands of satisfied customers who love their Furniqo furniture
          </p>
        </div>

        {/* Testimonial Card - Simplified, removed AnimatePresence and motion */}
        <div className="max-w-4xl mx-auto">
          <div className="relative px-4 sm:px-0">
            {/* Navigation Buttons - Removed hover scale animations */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-3 lg:-translate-x-10 z-10 w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-white dark:bg-neutral-800 shadow-soft hover:shadow-medium border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-3 lg:translate-x-10 z-10 w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-white dark:bg-neutral-800 shadow-soft hover:shadow-medium border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Next testimonial"
            >
              <FiChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            {/* Simplified Card - Removed framer-motion, using CSS transitions */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl relative transition-opacity duration-300">
              {/* Quote mark */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-4xl sm:text-5xl lg:text-6xl text-primary-100 dark:bg-primary-900/20 leading-none select-none">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-serif">"</span>
              </div>
              
              <div className="relative z-10">
                <StarRating rating={currentTestimonial.rating} />
                
                <blockquote className="text-sm sm:text-base lg:text-xl text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed mb-4 sm:mb-5 font-display">
                  "{currentTestimonial.content}"
                </blockquote>
                
                <div>
                  <AuthorInfo 
                    name={currentTestimonial.name}
                    role={currentTestimonial.role}
                    location={currentTestimonial.location}
                    image={currentTestimonial.image}
                    verified={currentTestimonial.verified}
                    isLiked={isLiked}
                    likes={currentTestimonial.likes}
                    onLike={() => handleLike(currentTestimonial.id)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            <div className="flex gap-1 sm:gap-1.5">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'w-4 sm:w-6 h-1 bg-primary-600'
                      : 'w-1 h-1 bg-neutral-300 dark:bg-neutral-600 hover:bg-primary-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <AutoplayButton isPlaying={autoplay} onClick={toggleAutoplay} />
          </div>
        </div>

        {/* Stats Section */}
        <StatsSection />
      </div>
    </section>
  );
};

export default memo(Testimonials);