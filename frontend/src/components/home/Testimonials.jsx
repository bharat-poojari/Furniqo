import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiMessageCircle, FiHeart, FiThumbsUp } from 'react-icons/fi';
import { testimonials } from '../../data/data';
import { Skeleton } from '../common/Skeleton';

const Testimonials = () => {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [autoplay, setAutoplay] = useState(true);
  const [likedTestimonials, setLikedTestimonials] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const intervalRef = useRef(null);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setTestimonialsData(testimonials);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && testimonialsData.length > 0) {
      intervalRef.current = setInterval(() => {
        nextTestimonial();
      }, 5000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, testimonialsData.length, currentIndex]);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  }, [testimonialsData.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  }, [testimonialsData.length]);

  const goToTestimonial = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const toggleAutoplay = useCallback(() => {
    setAutoplay(prev => !prev);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    if (autoplay) setAutoplay(false);
  };

  const handleTouchEnd = (e) => {
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
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevTestimonial();
        if (autoplay) setAutoplay(false);
      } else if (e.key === 'ArrowRight') {
        nextTestimonial();
        if (autoplay) setAutoplay(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevTestimonial, nextTestimonial, autoplay]);

  // Autoplay SVG Button Component
  const AutoplayButton = ({ isPlaying, onClick }) => (
    <button
      onClick={onClick}
      className="group relative w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-soft hover:shadow-medium border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
    >
      {isPlaying ? (
        // Pause SVG Icon
        <svg 
          className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      ) : (
        // Play SVG Icon
        <svg 
          className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z"/>
        </svg>
      )}
      
      {/* Tooltip */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
        {isPlaying ? 'Pause' : 'Play'}
      </span>
    </button>
  );

  const LoadingSkeleton = () => (
    <section className="py-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-64 lg:h-72 w-full rounded-3xl" />
        </div>
      </div>
    </section>
  );

  if (loading) return <LoadingSkeleton />;

  const currentTestimonial = testimonialsData[currentIndex];
  const isLiked = likedTestimonials[currentTestimonial?.id];

  return (
    <section 
      className="py-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800 relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Decorations - Minimal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200/20 dark:bg-primary-900/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200/20 dark:bg-purple-900/10 rounded-full translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="w-full px-[1%] sm:px-[1.5%] relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full mb-3">
            <FiMessageCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Trusted by 10,000+ customers</span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-display font-bold bg-gradient-to-r from-neutral-900 to-primary-600 dark:from-white dark:to-primary-400 bg-clip-text text-transparent mb-2">
            What Our Customers Say
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Join thousands of satisfied customers who love their Furniqo furniture
          </p>
        </motion.div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 lg:-translate-x-10 z-10 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white dark:bg-neutral-800 shadow-soft hover:shadow-medium border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 lg:translate-x-10 z-10 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white dark:bg-neutral-800 shadow-soft hover:shadow-medium border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Next testimonial"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>

            {/* Animated Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-6 lg:p-8 shadow-xl relative"
              >
                {/* Quote marks */}
                <div className="absolute top-4 right-4 text-6xl text-primary-100 dark:text-primary-900/20 leading-none select-none">
                  <span className="text-6xl font-serif">"</span>
                </div>
                
                <div className="relative z-10">
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <FiStar
                          className={`w-4 h-4 ${i < currentTestimonial.rating 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-neutral-300 dark:text-neutral-600'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Testimonial content */}
                  <motion.blockquote 
                    className="text-base lg:text-xl text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed mb-6 font-display"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    "{currentTestimonial.content}"
                  </motion.blockquote>
                  
                  {/* Author info */}
                  <motion.div 
                    className="flex flex-col sm:flex-row sm:items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={currentTestimonial.image}
                          alt={currentTestimonial.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-900"
                          loading="lazy"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full w-2.5 h-2.5 border border-white dark:border-neutral-800" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                          {currentTestimonial.name}
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400 text-xs">
                          {currentTestimonial.role} • {currentTestimonial.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:ml-auto">
                      {currentTestimonial.verified && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1">
                          <FiThumbsUp className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      )}
                      
                      {/* Like Button with Animation */}
                      <motion.button 
                        onClick={() => handleLike(currentTestimonial.id)}
                        className={`relative p-1.5 rounded-full transition-all duration-300 ${
                          isLiked 
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                            : 'text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                        whileTap={{ scale: 0.8 }}
                        animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                        aria-label={isLiked ? "Unlike testimonial" : "Like testimonial"}
                      >
                        <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        
                        {/* Like count badge */}
                        {currentTestimonial.likes > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                            {currentTestimonial.likes + (isLiked ? 1 : 0)}
                          </span>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {/* Dots Indicator */}
            <div className="flex gap-1.5">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-6 bg-primary-600'
                      : 'w-1.5 bg-neutral-300 dark:bg-neutral-600 hover:bg-primary-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Autoplay Button */}
            <AutoplayButton isPlaying={autoplay} onClick={toggleAutoplay} />
          </div>
        </div>

        {/* Simple Stats */}
        <motion.div 
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center">
            <div className="text-xl font-bold text-primary-600 dark:text-primary-400">98%</div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary-600 dark:text-primary-400">10k+</div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">Customers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary-600 dark:text-primary-400">4.9</div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary-600 dark:text-primary-400">5+ Years</div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">Trusted</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;