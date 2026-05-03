import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowRight, 
  FiGrid, 
  FiRefreshCw, 
  FiAlertCircle,
  FiHeart,
  FiEye,
  FiX,
  FiHome,
  FiShoppingBag,
  FiZoomIn,
  FiZoomOut,
  FiChevronLeft,
  FiChevronRight,
  FiInfo
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { Skeleton } from '../components/common/Skeleton';
import { rooms as mockRooms } from '../data/data';

// ============================================
// 1. CUSTOM HOOKS
// ============================================

const useInView = (options = {}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return { ref, inView };
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// ============================================
// 2. TOAST SYSTEM
// ============================================

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(this.container);
  }

  show(message, type = 'success') {
    const toastElement = document.createElement('div');
    toastElement.className = `transform transition-all duration-300 translate-y-full opacity-0 ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 pointer-events-auto`;
    
    const icon = document.createElement('span');
    icon.innerHTML = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    icon.className = 'font-bold text-sm';
    
    const text = document.createElement('span');
    text.textContent = message;
    
    toastElement.appendChild(icon);
    toastElement.appendChild(text);
    this.container.appendChild(toastElement);
    
    setTimeout(() => {
      toastElement.classList.remove('translate-y-full', 'opacity-0');
      toastElement.classList.add('translate-y-0', 'opacity-100');
    }, 10);
    
    setTimeout(() => {
      toastElement.classList.add('translate-y-full', 'opacity-0');
      setTimeout(() => toastElement.remove(), 300);
    }, 2000);
  }

  success(message) { this.show(message, 'success'); }
  error(message) { this.show(message, 'error'); }
  info(message) { this.show(message, 'info'); }
}

const toast = new ToastManager();

// ============================================
// 3. SHIMMER SKELETON
// ============================================

const ShimmerSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-[4/3] rounded-xl bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// 4. DRAGGABLE ZOOMABLE IMAGE COMPONENT - FULLY FIXED FOR DESKTOP
// ============================================

const DraggableZoomableImage = ({ src, alt }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const ZOOM_CONFIG = { MIN: 1, MAX: 3, STEP: 0.2 };

  const constrainPosition = useCallback((x, y, currentZoom) => {
    if (containerRef.current && currentZoom > 1) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imgElement = containerRef.current.querySelector('img');
      
      if (imgElement) {
        const imgRect = imgElement.getBoundingClientRect();
        const maxX = Math.max(0, (imgRect.width * currentZoom - containerRect.width) / 2);
        const maxY = Math.max(0, (imgRect.height * currentZoom - containerRect.height) / 2);
        
        return {
          x: Math.min(Math.max(x, -maxX), maxX),
          y: Math.min(Math.max(y, -maxY), maxY)
        };
      }
    }
    return { x: 0, y: 0 };
  }, []);

  // Desktop drag handlers - COMPLETELY REWRITTEN
  const dragStartPos = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  
  const handleMouseDown = useCallback((e) => {
    if (zoom > 1) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      
      dragStartPos.current = {
        x: e.clientX,
        y: e.clientY,
        startX: position.x,
        startY: position.y
      };
    }
  }, [zoom, position]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && zoom > 1) {
      e.preventDefault();
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      
      const newX = dragStartPos.current.startX + deltaX;
      const newY = dragStartPos.current.startY + deltaY;
      
      const constrained = constrainPosition(newX, newY, zoom);
      setPosition(constrained);
    }
  }, [isDragging, zoom, constrainPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_CONFIG.STEP : ZOOM_CONFIG.STEP;
    let newZoom = Math.min(Math.max(zoom + delta, ZOOM_CONFIG.MIN), ZOOM_CONFIG.MAX);
    
    if (newZoom !== zoom) {
      setZoom(newZoom);
      if (newZoom === ZOOM_CONFIG.MIN) {
        setPosition({ x: 0, y: 0 });
      }
    }
  }, [zoom]);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    if (zoom === ZOOM_CONFIG.MIN) {
      setZoom(2.5);
    } else {
      setZoom(ZOOM_CONFIG.MIN);
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  const handleZoomIn = useCallback(() => {
    let newZoom = Math.min(zoom + ZOOM_CONFIG.STEP, ZOOM_CONFIG.MAX);
    setZoom(newZoom);
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    let newZoom = Math.max(zoom - ZOOM_CONFIG.STEP, ZOOM_CONFIG.MIN);
    setZoom(newZoom);
    if (newZoom === ZOOM_CONFIG.MIN) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  const handleReset = useCallback(() => {
    setZoom(ZOOM_CONFIG.MIN);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Mobile touch handlers
  const touchStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialZoom, setInitialZoom] = useState(1);

  const getDistance = (touches) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches);
      setInitialDistance(distance);
      setInitialZoom(zoom);
    } else if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        startX: position.x,
        startY: position.y
      };
    }
  }, [zoom, position]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 2 && initialDistance > 0) {
      const newDistance = getDistance(e.touches);
      const scale = newDistance / initialDistance;
      let newZoom = Math.min(Math.max(initialZoom * scale, ZOOM_CONFIG.MIN), ZOOM_CONFIG.MAX);
      setZoom(newZoom);
      if (newZoom === ZOOM_CONFIG.MIN) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && zoom > 1 && isDragging) {
      const deltaX = e.touches[0].clientX - touchStartRef.current.x;
      const deltaY = e.touches[0].clientY - touchStartRef.current.y;
      
      const newX = touchStartRef.current.startX + deltaX;
      const newY = touchStartRef.current.startY + deltaY;
      
      const constrained = constrainPosition(newX, newY, zoom);
      setPosition(constrained);
    }
  }, [initialDistance, initialZoom, zoom, isDragging, constrainPosition]);

  const handleTouchEnd = useCallback(() => {
    setInitialDistance(0);
    setIsDragging(false);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black select-none"
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        touchAction: 'none'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
          willChange: 'transform'
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
          loading="lazy"
        />
      </div>
      
      {/* Zoom Controls */}
      <div className={`absolute flex gap-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5 z-10 transition-all duration-300 ${
        isMobile 
          ? 'bottom-4 right-4' 
          : 'bottom-4 left-1/2 transform -translate-x-1/2'
      }`}>
        <button
          onClick={handleZoomOut}
          disabled={zoom <= ZOOM_CONFIG.MIN}
          className={`p-1.5 rounded-full transition-all active:scale-95 ${zoom <= ZOOM_CONFIG.MIN ? 'bg-gray-600 text-gray-400 opacity-50 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30'}`}
          aria-label="Zoom out"
        >
          <FiZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="px-2 py-1 text-white text-xs font-medium min-w-[45px] text-center">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= ZOOM_CONFIG.MAX}
          className={`p-1.5 rounded-full transition-all active:scale-95 ${zoom >= ZOOM_CONFIG.MAX ? 'bg-gray-600 text-gray-400 opacity-50 cursor-not-allowed' : 'bg-white/20 text-white hover:bg-white/30'}`}
          aria-label="Zoom in"
        >
          <FiZoomIn className="w-3.5 h-3.5" />
        </button>
        {zoom > 1 && (
          <button
            onClick={handleReset}
            className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all active:scale-95"
            aria-label="Reset zoom"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      
      {/* Desktop hint */}
      {!isMobile && zoom === 1 && (
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 z-10 text-white text-[10px]">
          Scroll to zoom • Click and drag to pan
        </div>
      )}
      
      {/* Mobile hint */}
      {isMobile && zoom === 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 z-10 whitespace-nowrap">
          <span className="text-white text-[10px]">Pinch to zoom • Drag to pan</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// 5. ROOM STYLE FILTERS
// ============================================

const RoomStyleFilters = ({ selectedStyle, onStyleChange, roomTypes }) => {
  const scrollContainerRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="relative mb-6">
      <div
        ref={scrollContainerRef}
        className={`flex gap-2 ${
          isMobile 
            ? 'overflow-x-auto scrollbar-hide px-2' 
            : 'flex-wrap justify-center'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
          onClick={() => onStyleChange(null)}
          className={`whitespace-nowrap transition-all duration-300 ${
            isMobile 
              ? 'px-3 py-1.5 text-xs font-medium rounded-full' 
              : 'px-5 py-2 text-sm font-medium rounded-full'
          } ${
            !selectedStyle
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-neutral-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md'
          }`}
        >
          All Rooms
        </button>
        {roomTypes.map((style) => (
          <button
            key={style}
            onClick={() => onStyleChange(style === selectedStyle ? null : style)}
            className={`whitespace-nowrap transition-all duration-300 ${
              isMobile 
                ? 'px-3 py-1.5 text-xs font-medium rounded-full' 
                : 'px-5 py-2 text-sm font-medium rounded-full'
            } ${
              selectedStyle === style
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-neutral-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 6. ROOM CARD
// ============================================

const RoomCard = ({ room, isLiked, onLike, onView, onShop, index }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  return (
    <div
      className="group cursor-pointer"
      onClick={() => onView(room)}
    >
      <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-2 bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        )}
        <img
          src={room.image}
          alt={room.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => onLike(room._id, e)}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}
          >
            <div className="h-3.5 w-3.5">
              <FiHeart className={`h-full w-full ${isLiked ? 'fill-current' : ''}`} />
            </div>
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); onView(room); }}
            className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white backdrop-blur-sm"
          >
            <FiEye className="h-3.5 w-3.5" />
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-sm font-bold text-white mb-0.5 drop-shadow-lg">{room.name}</h3>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-white/20 backdrop-blur-sm rounded-full text-white">{room.style}</span>
            {room.roomType && <span className="px-1.5 py-0.5 text-[10px] font-medium bg-white/10 backdrop-blur-sm rounded-full text-white/80">{room.roomType}</span>}
          </div>
        </div>
      </div>
      
      <button
        onClick={(e) => onShop(room, e)}
        className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
      >
        <span>Shop This Look</span>
        <FiArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
};

// ============================================
// 7. MOBILE MODAL
// ============================================

const MobileRoomModal = ({ room, isLiked, onClose, onLike, onShop }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="relative h-1/2 bg-black flex-shrink-0">
          <DraggableZoomableImage src={room.image} alt={room.name} />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm z-10"
          >
            <FiX className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold text-white mb-1">{room.name}</h2>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full text-white">{room.style}</span>
              {room.roomType && <span className="px-2 py-0.5 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full text-white/90">{room.roomType}</span>}
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-800 px-4 flex-shrink-0">
            {['details', 'features', 'tip'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-all relative capitalize ${
                  activeTab === tab ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'
                }`}
              >
                {tab === 'details' ? 'Details' : tab === 'features' ? 'Features' : 'Design Tip'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                )}
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{room.description}</p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => onShop(room)}
                    className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FiShoppingBag className="h-4 w-4" /> Shop Now
                  </button>
                  <button
                    onClick={(e) => onLike(room._id, e)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${
                      isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FiHeart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Favorited' : 'Save'}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'features' && (
              <div>
                {room.features ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <FiInfo className="h-4 w-4 text-primary-600" />
                      </div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white">Key Features</h3>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{room.features}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No features listed for this room</div>
                )}
              </div>
            )}
            
            {activeTab === 'tip' && (
              <div>
                {room.tips ? (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="text-lg">💡</span>
                      </div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-300">Design Tip</h3>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">{room.tips}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No design tip available</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 8. DESKTOP MODAL
// ============================================

const DesktopRoomModal = ({ room, isLiked, onClose, onLike, onShop }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-5xl overflow-hidden flex flex-row shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Draggable Image */}
        <div className="w-1/2 bg-black relative">
          <div className="h-[500px]">
            <DraggableZoomableImage src={room.image} alt={room.name} />
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors z-10"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
        
        {/* Right Side - Content */}
        <div className="w-1/2 p-6 flex flex-col">
          <div className="flex-1 overflow-y-auto pr-2 space-y-4" style={{ maxHeight: 'calc(500px - 80px)' }}>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">{room.name}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">{room.style}</span>
                {room.roomType && <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">{room.roomType}</span>}
              </div>
            </div>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{room.description}</p>
            
            {room.features && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span> Key Features
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{room.features}</p>
              </div>
            )}
            
            {room.tips && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Design Tip
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">{room.tips}</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onShop(room)}
              className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <FiShoppingBag className="h-4 w-4" /> Shop This Room <FiArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => onLike(room._id, e)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                isLiked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              <FiHeart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Favorited' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 9. ROOM MODAL WRAPPER
// ============================================

const RoomModal = ({ room, isLiked, onClose, onLike, onShop }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (isMobile) {
    return <MobileRoomModal room={room} isLiked={isLiked} onClose={onClose} onLike={onLike} onShop={onShop} />;
  }
  
  return <DesktopRoomModal room={room} isLiked={isLiked} onClose={onClose} onLike={onLike} onShop={onShop} />;
};

// ============================================
// 10. MAIN ROOM INSPIRATION COMPONENT
// ============================================

const RoomInspiration = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [likedRooms, setLikedRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('likedRooms');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });
  const [selectedStyle, setSelectedStyle] = useState(null);
  
  const { ref: loadMoreRef } = useInView({ threshold: 0.1 });
  const isMobile = useMediaQuery('(max-width: 768px)');

  const mapStyleToCategory = useCallback((style) => {
    const styleMap = {
      'Contemporary Industrial': 'Living Room',
      'Japanese Minimalism': 'Bedroom',
      'Nordic Modern': 'Dining',
      'Art Deco Luxury': 'Living Room',
      'Coastal Contemporary': 'Outdoor',
      'Modern Professional': 'Office',
      'Eclectic Bohemian': 'Bedroom',
      'Rustic Modern': 'Living Room',
      'Mediterranean Villa': 'Outdoor',
      'Futuristic Gaming': 'Office',
      'Boutique Luxury': 'Storage',
      'Modern Art Deco': 'Lighting'
    };
    return styleMap[style] || 'Living Room';
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getRooms();
      
      let roomsData = [];
      if (response?.data?.success && response?.data?.data) roomsData = response.data.data;
      else if (response?.success && response?.data) roomsData = response.data;
      else if (response?.data && Array.isArray(response.data)) roomsData = response.data;
      else if (Array.isArray(response)) roomsData = response;
      
      if (roomsData.length === 0) roomsData = mockRooms;
      
      roomsData = roomsData.map(room => ({
        ...room,
        roomType: room.roomType || mapStyleToCategory(room.style)
      }));
      
      setRooms(roomsData);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      const mockData = mockRooms.map(room => ({
        ...room,
        roomType: room.roomType || mapStyleToCategory(room.style)
      }));
      setRooms(mockData);
    } finally {
      setLoading(false);
    }
  }, [mapStyleToCategory]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  useEffect(() => {
    try {
      localStorage.setItem('likedRooms', JSON.stringify([...likedRooms]));
    } catch (error) {
      console.error('Failed to save liked rooms:', error);
    }
  }, [likedRooms]);

  const handleLike = useCallback((roomId, e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setLikedRooms(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(roomId)) {
        newLiked.delete(roomId);
        toast.success('Removed from favorites');
      } else {
        newLiked.add(roomId);
        toast.success('Added to favorites');
      }
      return newLiked;
    });
  }, []);

  const handleShopThisRoom = useCallback((room, e) => {
    if (e) e.stopPropagation();
    const category = room.roomType || mapStyleToCategory(room.style);
    navigate(`/products?category=${encodeURIComponent(category)}&style=${encodeURIComponent(room.style)}&roomId=${room._id}`);
  }, [navigate, mapStyleToCategory]);

  const retryFetch = useCallback(() => {
    setLoading(true);
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (selectedRoom) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedRoom]);

  const filteredRooms = useMemo(() => {
    if (!selectedStyle) return rooms;
    return rooms.filter(room => room.roomType === selectedStyle);
  }, [rooms, selectedStyle]);

  const uniqueRoomTypes = useMemo(() => {
    return [...new Set(rooms.map(r => r.roomType).filter(Boolean))];
  }, [rooms]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-4">
      <div className="w-full px-3 sm:px-4 md:px-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiHome className="h-5 w-5 text-primary-500" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Room Inspiration
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Discover beautifully curated rooms and transform your space with our shoppable inspiration gallery</p>
          
          {!loading && !error && filteredRooms.length > 0 && (
            <div className="flex justify-center items-center gap-6 mt-4 pt-3 border-t border-gray-200">
              <div><div className="text-lg font-bold">{filteredRooms.length}</div><div className="text-[10px] text-neutral-500">Rooms</div></div>
              <div className="w-px h-5 bg-gray-300"></div>
              <div><div className="text-lg font-bold">{uniqueRoomTypes.length}</div><div className="text-[10px] text-neutral-500">Styles</div></div>
              <div className="w-px h-5 bg-gray-300"></div>
              <div><div className="text-lg font-bold">{likedRooms.size}</div><div className="text-[10px] text-neutral-500">Favorites</div></div>
            </div>
          )}
        </div>

        {!loading && !error && rooms.length > 0 && (
          <RoomStyleFilters selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} roomTypes={uniqueRoomTypes} />
        )}

        {loading ? (
          <ShimmerSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load</h3>
            <button onClick={retryFetch} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg">
              <FiRefreshCw /> Try Again
            </button>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <FiGrid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold">No Rooms Found</h3>
            {selectedStyle && (
              <button onClick={() => setSelectedStyle(null)} className="mt-4 text-primary-600">
                Show All Rooms
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRooms.map((room, index) => (
              <RoomCard 
                key={room._id} 
                room={room} 
                isLiked={likedRooms.has(room._id)} 
                onLike={handleLike} 
                onView={setSelectedRoom} 
                onShop={handleShopThisRoom} 
                index={index} 
              />
            ))}
            <div ref={loadMoreRef} className="col-span-full h-4" />
          </div>
        )}

        {selectedRoom && (
          <RoomModal 
            room={selectedRoom} 
            isLiked={likedRooms.has(selectedRoom._id)} 
            onClose={() => setSelectedRoom(null)} 
            onLike={handleLike} 
            onShop={handleShopThisRoom} 
          />
        )}
      </div>
      
      <style>{`
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        .overflow-y-auto {
          scroll-behavior: smooth;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;
        }
        
        .dark ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        
        .dark ::-webkit-scrollbar-thumb {
          background: #4f46e5;
        }
      `}</style>
    </div>
  );
};

export default RoomInspiration;