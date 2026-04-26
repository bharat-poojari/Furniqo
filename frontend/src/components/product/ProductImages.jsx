import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, 
  FiX, FiMaximize2, FiMinimize2, FiPlay, FiPause,
  FiShare2
} from 'react-icons/fi';
import { cn } from '../../utils/cn';

const ProductImages = ({ 
  images, 
  name, 
  autoPlay = false, 
  autoPlayInterval = 3000,
  showThumbnails = true,
  showZoom = true,
  showNavigation = true,
  showCounter = true,
  aspectRatio = 'aspect-square',
  className,
  onImageChange,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [imageError, setImageError] = useState({});
  
  const mainImageRef = useRef(null);
  const thumbnailScrollRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const fullscreenRef = useRef(null);

  // Reset state when images change
  useEffect(() => {
    setSelectedImage(0);
    setImageError({});
  }, [images]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
    }
    
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, images.length, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          setIsFullscreen(false);
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'z':
          setIsZoomed(!isZoomed);
          break;
        default:
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen, isZoomed]);

  // Notify parent of image change
  useEffect(() => {
    onImageChange?.(selectedImage);
  }, [selectedImage, onImageChange]);

  // Scroll thumbnail into view
  useEffect(() => {
    if (thumbnailScrollRef.current) {
      const thumbnail = thumbnailScrollRef.current.children[selectedImage];
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedImage]);

  const nextImage = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  }, [images.length]);

  const handleMouseMove = useCallback((e) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({
      x: Math.min(Math.max(x, 0), 100),
      y: Math.min(Math.max(y, 0), 100),
    });
  }, [isZoomed]);

  const handleTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, nextImage, prevImage]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  }, []);

  const handleMouseUp = useCallback((e) => {
    if (!isDragging || !dragStart) return;
    
    const distance = dragStart - e.clientX;
    const minSwipeDistance = 50;
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    
    setIsDragging(false);
    setDragStart(null);
  }, [isDragging, dragStart, nextImage, prevImage]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const handleImageError = useCallback((index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name}`,
          url: images[selectedImage],
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  }, [name, images, selectedImage]);

  // Generate placeholder URL for fallback
  const getPlaceholderUrl = (width = 800, height = 800) => 
    `https://via.placeholder.com/${width}x${height}?text=No+Image`;

  const hasMultipleImages = images && images.length > 1;
  const currentImage = images && images[selectedImage] 
    ? images[selectedImage] 
    : getPlaceholderUrl();

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Main Image Container */}
        <div 
          ref={fullscreenRef}
          className={cn(
            'relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 group',
            aspectRatio,
            isFullscreen ? 'fixed inset-0 z-[200] rounded-none' : ''
          )}
          onMouseEnter={() => showZoom && setIsZoomed(true)}
          onMouseLeave={() => {
            setIsZoomed(false);
            setIsDragging(false);
          }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Loading Spinner */}
          {!images[selectedImage] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-neutral-300 border-t-primary-600 rounded-full animate-spin" />
            </div>
          )}

          {/* Main Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              {imageError[selectedImage] ? (
                <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                      Failed to load image
                    </p>
                  </div>
                </div>
              ) : (
                <img
                  src={currentImage}
                  alt={`${name} - Image ${selectedImage + 1} of ${images.length}`}
                  className={cn(
                    'w-full h-full object-cover select-none',
                    isZoomed && 'cursor-zoom-out',
                    !isZoomed && showZoom && 'cursor-zoom-in',
                    isDragging && 'cursor-grabbing'
                  )}
                  onError={() => handleImageError(selectedImage)}
                  draggable={false}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Zoom Overlay */}
          <AnimatePresence>
            {isZoomed && showZoom && !imageError[selectedImage] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${currentImage})`,
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundSize: '250%',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}
          </AnimatePresence>

          {/* Top Controls Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Zoom Toggle */}
              {showZoom && !imageError[selectedImage] && (
                <motion.button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-2 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
                >
                  {isZoomed ? (
                    <FiZoomOut className="h-4 w-4" />
                  ) : (
                    <FiZoomIn className="h-4 w-4" />
                  )}
                </motion.button>
              )}

              {/* Auto-play Toggle */}
              {hasMultipleImages && (
                <motion.button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isAutoPlaying ? (
                    <FiPause className="h-4 w-4" />
                  ) : (
                    <FiPlay className="h-4 w-4" />
                  )}
                </motion.button>
              )}
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Share Button */}
              {navigator.share && (
                <motion.button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Share image"
                >
                  <FiShare2 className="h-4 w-4" />
                </motion.button>
              )}

              {/* Fullscreen Toggle */}
              <motion.button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <FiMinimize2 className="h-4 w-4" />
                ) : (
                  <FiMaximize2 className="h-4 w-4" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {showNavigation && hasMultipleImages && (
            <>
              <motion.button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white dark:hover:bg-neutral-800"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous image"
              >
                <FiChevronLeft className="h-6 w-6" />
              </motion.button>
              <motion.button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white dark:hover:bg-neutral-800"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next image"
              >
                <FiChevronRight className="h-6 w-6" />
              </motion.button>
            </>
          )}

          {/* Image Counter */}
          {showCounter && hasMultipleImages && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {selectedImage + 1} / {images.length}
            </div>
          )}

          {/* Progress Dots */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setIsAutoPlaying(false);
                  }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    index === selectedImage
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Auto-play Progress Bar */}
          {isAutoPlaying && hasMultipleImages && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <motion.div
                key={selectedImage}
                className="h-full bg-primary-600"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
              />
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {showThumbnails && hasMultipleImages && (
          <div className="relative">
            <div
              ref={thumbnailScrollRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
            >
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setIsAutoPlaying(false);
                  }}
                  className={cn(
                    'relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-center',
                    index === selectedImage
                      ? 'border-primary-600 dark:border-primary-400 shadow-lg shadow-primary-600/20 scale-105'
                      : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 opacity-70 hover:opacity-100'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`View image ${index + 1}`}
                >
                  {imageError[index] ? (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                      <span className="text-xs text-neutral-400">Error</span>
                    </div>
                  ) : (
                    <img
                      src={image}
                      alt={`${name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={() => handleImageError(index)}
                    />
                  )}
                  
                  {/* Selected Indicator */}
                  {index === selectedImage && (
                    <motion.div
                      layoutId="selectedThumbnail"
                      className="absolute inset-0 bg-primary-600/10"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Thumbnail Navigation Buttons */}
            {images.length > 4 && (
              <>
                <button
                  onClick={() => {
                    if (thumbnailScrollRef.current) {
                      thumbnailScrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Scroll thumbnails left"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (thumbnailScrollRef.current) {
                      thumbnailScrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Scroll thumbnails right"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Overlay Close Button */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => setIsFullscreen(false)}
            className="fixed top-4 right-4 z-[201] p-3 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl shadow-xl hover:bg-white dark:hover:bg-neutral-800"
            aria-label="Close fullscreen"
          >
            <FiX className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductImages;