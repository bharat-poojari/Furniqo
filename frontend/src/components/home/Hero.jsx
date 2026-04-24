import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiPause, FiPlay } from 'react-icons/fi';
import { heroSlides } from '../../data/data';
import { cn } from '../../utils/cn';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
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

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.6 },
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section className="relative h-screen max-h-[1080px] min-h-[600px] overflow-hidden bg-neutral-900">
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
          {/* Image with better overlay for text readability */}
          <div className="absolute inset-0">
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="w-full h-full object-cover"
              priority="true"
            />
            {/* Improved gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </div>

          {/* Centered Content - Reduced vertical spacing */}
          <div className="relative h-full w-full px-4 sm:px-6 flex items-center justify-center text-center">
            <div className="max-w-4xl mx-auto">
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
                <motion.span
                  variants={contentVariants}
                  custom={0}
                  className="inline-block px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium rounded-full mb-4 shadow-lg"
                >
                New Collection 2024
                </motion.span>
                
                <motion.h1
                  variants={contentVariants}
                  custom={1}
                  className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 leading-tight drop-shadow-2xl"
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>
                
                <motion.p
                  variants={contentVariants}
                  custom={2}
                  className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>
                
                <motion.div
                  variants={contentVariants}
                  custom={3}
                  className="flex flex-wrap gap-4 justify-center"
                >
                  <Link
                    to={heroSlides[currentSlide].link}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-base transition-all hover:shadow-2xl hover:shadow-primary-600/30 hover:scale-105"
                  >
                    {heroSlides[currentSlide].cta}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-xl font-semibold text-base border border-white/30 transition-all hover:scale-105 hover:shadow-xl"
                  >
                    Browse All
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Left and Right */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all border border-white/30 z-10 hover:scale-110"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="h-5 w-5" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all border border-white/30 z-10 hover:scale-110"
        aria-label="Next slide"
      >
        <FiChevronRight className="h-5 w-5" />
      </button>

      {/* Bottom Controls - Dots and Play/Pause */}
      <div className="absolute bottom-6 left-0 right-0 z-10">
        <div className="w-full px-4 sm:px-6 flex items-center justify-between">
          {/* Dots */}
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === currentSlide
                    ? 'w-6 bg-white shadow-lg'
                    : 'w-1.5 bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all border border-white/30 hover:scale-110"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <FiPause className="h-3.5 w-3.5" /> : <FiPlay className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;