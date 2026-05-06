import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
  FiX,
  FiMaximize2,
  FiMinimize2,
  FiPlay,
  FiPause,
  FiShare2,
} from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { PLACEHOLDER_URL } from '../../utils/constants';

// Constants moved outside component
const MIN_SWIPE_DISTANCE = 50;
const THUMBNAIL_SCROLL_AMOUNT = 100;

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
          setIsZoomed(prev => !prev);
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
  }, [isFullscreen]);

  // Notify parent of image change
  useEffect(() => {
    onImageChange?.(selectedImage);
  }, [selectedImage, onImageChange]);

  // Scroll thumbnail into view
  useEffect(() => {
    const thumbnail = thumbnailScrollRef.current?.children[selectedImage];
    if (thumbnail) {
      thumbnail.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
        inline: 'center',
      });
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
    
    if (Math.abs(distance) > MIN_SWIPE_DISTANCE) {
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
    if (!isDragging || dragStart === null) return;
    
    const distance = dragStart - e.clientX;
    
    if (Math.abs(distance) > MIN_SWIPE_DISTANCE) {
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
    if (navigator.share && images[selectedImage]) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name}`,
          url: images[selectedImage],
        });
      } catch (error) {
        // Fail silently - user cancelled or share not supported
      }
    }
  }, [name, images, selectedImage]);

  // Memoized values
  const hasMultipleImages = useMemo(() => images?.length > 1, [images]);
  const currentImage = useMemo(() =>
    images?.[selectedImage] || '/placeholder.svg',
    [images, selectedImage]
  );

  // Scroll thumbnails helper
  const scrollThumbnails = useCallback((direction) => {
    if (thumbnailScrollRef.current) {
      thumbnailScrollRef.current.scrollBy({ 
        left: direction === 'left' ? -THUMBNAIL_SCROLL_AMOUNT : THUMBNAIL_SCROLL_AMOUNT, 
        behavior: 'smooth' 
      });
    }
  }, []);

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Main Image Container */}
        <div 
          ref={fullscreenRef}
          className={cn(
            'relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 group',
            aspectRatio,
            isFullscreen && 'fixed inset-0 z-[200] rounded-none'
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
          {!images?.[selectedImage] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-neutral-300 border-t-primary-600 rounded-full animate-spin" />
            </div>
          )}

          {/* Main Image */}
          <div className="w-full h-full transition-opacity duration-300">
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
                loading="eager"
              />
            )}
          </div>

          {/* Zoom Overlay */}
          {isZoomed && showZoom && !imageError[selectedImage] && (
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-200"
              style={{
                backgroundImage: `url(${currentImage})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundSize: '250%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}

          {/* Top Controls Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Zoom Toggle */}
              {showZoom && !imageError[selectedImage] && (
                <button
                  onClick={() => setIsZoomed(prev => !prev)}
                  className="p-2 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg transition-all duration-150 active:scale-95"
                  aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
                >
                  {isZoomed ? <FiZoomOut className="h-4 w-4" /> : <FiZoomIn className="h-4 w-4" />}
                </button>
              )}

              {/* Auto-play Toggle */}
              {hasMultipleImages && (
                <button
                  onClick={() => setIsAutoPlaying(prev => !prev)}
                  className="p-2 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg transition-all duration-150 active:scale-95"
                  aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isAutoPlaying ? <FiPause className="h-4 w-4" /> : <FiPlay className="h-4 w-4" />}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Share Button */}
              {navigator.share && hasMultipleImages && (
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg transition-all duration-150 active:scale-95"
                  aria-label="Share image"
                >
                  <FiShare2 className="h-4 w-4" />
                </button>
              )}

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 shadow-lg transition-all duration-150 active:scale-95"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <FiMinimize2 className="h-4 w-4" /> : <FiMaximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {showNavigation && hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg opacity-0 transition-all duration-200 hover:scale-110 hover:bg-white dark:hover:bg-neutral-800 group-hover:opacity-100 active:scale-95"
                aria-label="Previous image"
              >
                <FiChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg opacity-0 transition-all duration-200 hover:scale-110 hover:bg-white dark:hover:bg-neutral-800 group-hover:opacity-100 active:scale-95"
                aria-label="Next image"
              >
                <FiChevronRight className="h-6 w-6" />
              </button>
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
                    'w-2 h-2 rounded-full transition-all duration-200',
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
              <div 
                key={selectedImage}
                className="h-full bg-primary-600 transition-all duration-100"
                style={{ 
                  width: '100%',
                  transition: `width ${autoPlayInterval / 1000}s linear`,
                }}
              />
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {showThumbnails && hasMultipleImages && (
          <div className="relative">
            <div
              ref={thumbnailScrollRef}
              className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setIsAutoPlaying(false);
                  }}
                  className={cn(
                    'relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-center active:scale-95',
                    index === selectedImage
                      ? 'border-primary-600 dark:border-primary-400 shadow-lg shadow-primary-600/20 scale-105'
                      : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 opacity-70 hover:opacity-100 hover:scale-105'
                  )}
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
                    <div className="absolute inset-0 bg-primary-600/10" />
                  )}
                </button>
              ))}
            </div>

            {/* Thumbnail Navigation Buttons */}
            {images.length > 4 && (
              <>
                <button
                  onClick={() => scrollThumbnails('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 active:scale-95"
                  aria-label="Scroll thumbnails left"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollThumbnails('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 active:scale-95"
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
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-[201] p-3 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl shadow-xl hover:bg-white dark:hover:bg-neutral-800 transition-all duration-150 active:scale-95"
          aria-label="Close fullscreen"
        >
          <FiX className="h-6 w-6" />
        </button>
      )}

      {/* CSS Styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .active\\:scale-95:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
};

export default ProductImages;