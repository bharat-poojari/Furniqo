import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiPause, FiPlay } from 'react-icons/fi';
import { heroSlides } from '../../data/data';
import { cn } from '../../utils/cn';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for layout adjustments
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(nextSlide, 6000);
    }
  }, [currentSlide, isPlaying, nextSlide]);

  // Auto-play with cleanup
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX.current - touchStartX.current;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  };

  // Optimized animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'tween', duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.3 },
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'tween', duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.3 },
      },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.08,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section 
      className="relative overflow-hidden bg-neutral-900"
      style={{ 
        height: '100vh',
        maxHeight: '100vh',
        minHeight: isMobile ? '100vh' : '600px'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Image with optimized loading */}
          <div className="absolute inset-0">
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover object-center"
              loading={currentSlide === 0 ? "eager" : "lazy"}
              fetchpriority={currentSlide === 0 ? "high" : "low"}
            />
            {/* Gradient overlays for text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>

          {/* MOBILE LAYOUT - No empty space */}
          {isMobile ? (
            <div className="relative h-full w-full flex flex-col px-5">
              {/* Content container - takes full height with flex */}
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <motion.div
                  key={`content-${currentSlide}`}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                      },
                    },
                  }}
                  className="w-full"
                >
                  {/* Badge */}
                  <motion.span
                    variants={contentVariants}
                    custom={0}
                    className="inline-block px-2.5 py-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-[10px] font-medium rounded-full mb-3 shadow-lg"
                  >
                    New Collection
                  </motion.span>
                  
                  {/* Title */}
                  <motion.h1
                    variants={contentVariants}
                    custom={1}
                    className="text-3xl font-display font-bold text-white mb-2 leading-tight drop-shadow-2xl px-2"
                  >
                    {heroSlides[currentSlide].title}
                  </motion.h1>
                  
                  {/* Short description for mobile */}
                  <motion.p
                    variants={contentVariants}
                    custom={2}
                    className="text-xs text-white/90 mb-5 max-w-xs mx-auto leading-relaxed drop-shadow-lg px-3"
                  >
                    {heroSlides[currentSlide].subtitle.length > 60 
                      ? heroSlides[currentSlide].subtitle.substring(0, 60) + '...' 
                      : heroSlides[currentSlide].subtitle}
                  </motion.p>
                  
                  {/* Buttons - Stacked vertically */}
                  <motion.div
                    variants={contentVariants}
                    custom={3}
                    className="flex flex-col gap-2.5 justify-center items-stretch max-w-[260px] mx-auto w-full px-4"
                  >
                    <Link
                      to={heroSlides[currentSlide].link}
                      className="group inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg"
                    >
                      {heroSlides[currentSlide].cta}
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-150 h-3.5 w-3.5" />
                    </Link>
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-xl font-semibold text-sm border border-white/30 transition-all active:scale-95"
                    >
                      Browse All
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Bottom Controls - Fixed at bottom */}
              <div className="py-3 pb-4">
                <div className="flex items-center justify-between">
                  {/* Dots */}
                  <div className="flex gap-2">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                          'rounded-full transition-all duration-200 active:scale-90',
                          index === currentSlide
                            ? 'w-6 h-1.5 bg-white shadow-lg'
                            : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/75'
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Play/Pause */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-7 h-7 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all border border-white/30 active:scale-95"
                    aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  >
                    {isPlaying ? <FiPause className="h-3 w-3" /> : <FiPlay className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // DESKTOP LAYOUT - Original design preserved
            <div className="relative h-full w-full flex items-center justify-center text-center px-6">
              <div className="w-full max-w-4xl mx-auto">
                <motion.div
                  key={`content-${currentSlide}`}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {/* Badge */}
                  <motion.span
                    variants={contentVariants}
                    custom={0}
                    className="inline-block px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium rounded-full mb-4 shadow-lg"
                  >
                    New Collection 2024
                  </motion.span>
                  
                  {/* Title */}
                  <motion.h1
                    variants={contentVariants}
                    custom={1}
                    className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 leading-tight drop-shadow-2xl"
                  >
                    {heroSlides[currentSlide].title}
                  </motion.h1>
                  
                  {/* Subtitle */}
                  <motion.p
                    variants={contentVariants}
                    custom={2}
                    className="text-base md:text-lg text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
                  >
                    {heroSlides[currentSlide].subtitle}
                  </motion.p>
                  
                  {/* Buttons */}
                  <motion.div
                    variants={contentVariants}
                    custom={3}
                    className="flex flex-row gap-4 justify-center"
                  >
                    <Link
                      to={heroSlides[currentSlide].link}
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-base transition-all hover:scale-105 shadow-lg hover:shadow-primary-600/30"
                    >
                      {heroSlides[currentSlide].cta}
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-150 h-4 w-4" />
                    </Link>
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-xl font-semibold text-base border border-white/30 transition-all hover:scale-105"
                    >
                      Browse All
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Desktop Bottom Controls */}
              <div className="absolute bottom-6 left-0 right-0 z-10">
                <div className="w-full px-6 flex items-center justify-between max-w-7xl mx-auto">
                  <div className="flex gap-2.5">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                          'rounded-full transition-all duration-200',
                          index === currentSlide
                            ? 'w-8 h-1.5 bg-white shadow-lg'
                            : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/75'
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all border border-white/30 hover:scale-110 active:scale-95"
                    aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  >
                    {isPlaying ? <FiPause className="h-4 w-4" /> : <FiPlay className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Desktop only */}
      {!isMobile && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full items-center justify-center transition-all border border-white/30 z-10 hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full items-center justify-center transition-all border border-white/30 z-10 hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </section>
  );
};

export default Hero;