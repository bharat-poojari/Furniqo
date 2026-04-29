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
  FiChevronRight
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { Skeleton } from '../components/common/Skeleton';
import { rooms as mockRooms } from '../data/data';

// Custom hook for intersection observer
const useInView = (options = {}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, {
      threshold: options.threshold || 0.1,
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
  }, [options.threshold]);

  return { ref, inView };
};

// Simple toast implementation
const toast = {
  success: (message) => {
    const toastElement = document.createElement('div');
    toastElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[100] animate-slide-down text-sm';
    toastElement.textContent = message;
    document.body.appendChild(toastElement);
    
    setTimeout(() => {
      toastElement.style.opacity = '0';
      toastElement.style.transition = 'opacity 0.3s';
      setTimeout(() => toastElement.remove(), 300);
    }, 2000);
  },
  error: (message) => {
    const toastElement = document.createElement('div');
    toastElement.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-[100] animate-slide-down text-sm';
    toastElement.textContent = message;
    document.body.appendChild(toastElement);
    
    setTimeout(() => {
      toastElement.style.opacity = '0';
      toastElement.style.transition = 'opacity 0.3s';
      setTimeout(() => toastElement.remove(), 300);
    }, 2000);
  }
};

// Horizontal Scrollable Filter Buttons Component
const RoomStyleFilters = ({ selectedStyle, onStyleChange, roomTypes }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [roomTypes]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-4">
      {isMobile && showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700"
        >
          <FiChevronLeft className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
        </button>
      )}
      
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className={`flex gap-2 ${
          isMobile 
            ? 'overflow-x-auto scrollbar-hide px-6' 
            : 'flex-wrap justify-center'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {roomTypes.map((style) => (
          <button
            key={style}
            onClick={() => onStyleChange(style === selectedStyle ? null : style)}
            className={`whitespace-nowrap transition-all duration-300 ${
              isMobile 
                ? 'px-3 py-1.5 text-xs font-medium rounded-full' 
                : 'px-4 py-1.5 text-sm font-medium rounded-full'
            } ${
              selectedStyle === style
                ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                : 'bg-white dark:bg-gray-800 text-neutral-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
      
      {isMobile && showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700"
        >
          <FiChevronRight className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
        </button>
      )}
    </div>
  );
};

// Zoomable Image Component
const ZoomableImage = ({ src, alt }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialZoom, setInitialZoom] = useState(1);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getTouchDistance = (touches) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      setInitialDistance(distance);
      setInitialZoom(zoom);
    } else if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
    if (e.touches.length === 2 && initialDistance > 0) {
      e.preventDefault();
      const newDistance = getTouchDistance(e.touches);
      const scale = newDistance / initialDistance;
      let newZoom = Math.min(Math.max(initialZoom * scale, 1), 4);
      
      setZoom(newZoom);
      
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (isDragging && zoom > 1 && e.touches.length === 1) {
      e.preventDefault();
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      
      if (containerRef.current && imageRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();
        
        const maxX = Math.max(0, (imageRect.width * zoom - containerRect.width) / 2);
        const maxY = Math.max(0, (imageRect.height * zoom - containerRect.height) / 2);
        
        setPosition({
          x: Math.min(Math.max(newX, -maxX), maxX),
          y: Math.min(Math.max(newY, -maxY), maxY)
        });
      }
    }
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    setInitialDistance(0);
  };

  const handleMouseDown = (e) => {
    if (zoom > 1 && !isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1 && !isMobile) {
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      if (containerRef.current && imageRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();
        
        const maxX = Math.max(0, (imageRect.width * zoom - containerRect.width) / 2);
        const maxY = Math.max(0, (imageRect.height * zoom - containerRect.height) / 2);
        
        setPosition({
          x: Math.min(Math.max(newX, -maxX), maxX),
          y: Math.min(Math.max(newY, -maxY), maxY)
        });
      }
    }
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (!isMobile) {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const newZoom = Math.min(Math.max(zoom + delta, 1), 4);
      setZoom(newZoom);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setZoom(zoom === 1 ? 2 : 1);
    if (zoom !== 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    const newZoom = Math.min(zoom + 0.5, 4);
    setZoom(newZoom);
    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    const newZoom = Math.max(zoom - 0.5, 1);
    setZoom(newZoom);
    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: zoom > 1 && !isDragging && !isMobile ? 'grab' : isDragging ? 'grabbing' : 'default' }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-contain pointer-events-none"
        style={{
          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        draggable={false}
      />
      
      {!isMobile && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-sm rounded-full p-2 z-10">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            className={`p-2 rounded-full transition-all duration-200 ${
              zoom <= 1 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                : 'bg-white/20 text-white hover:bg-white/30 active:scale-95'
            }`}
            aria-label="Zoom out"
          >
            <FiZoomOut className="w-5 h-5" />
          </button>
          <div className="px-3 py-2 text-white text-sm font-medium">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 4}
            className={`p-2 rounded-full transition-all duration-200 ${
              zoom >= 4 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                : 'bg-white/20 text-white hover:bg-white/30 active:scale-95'
            }`}
            aria-label="Zoom in"
          >
            <FiZoomIn className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {isMobile && zoom > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 z-10">
          <span className="text-white text-xs font-medium">{Math.round(zoom * 100)}%</span>
        </div>
      )}
      
      {isMobile && zoom === 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 z-10">
          <span className="text-white text-[10px] whitespace-nowrap">Pinch to zoom • Double tap to reset</span>
        </div>
      )}
    </div>
  );
};

const RoomInspiration = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const [likedRooms, setLikedRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('likedRooms');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });
  const [selectedStyle, setSelectedStyle] = useState(null);
  
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.1 });

  const fetchRooms = async () => {
    try {
      const response = await apiWrapper.getRooms();
      
      let roomsData = [];
      if (response?.data?.success && response?.data?.data) {
        roomsData = response.data.data;
      } else if (response?.success && response?.data) {
        roomsData = response.data;
      } else if (response?.data && Array.isArray(response.data)) {
        roomsData = response.data;
      } else if (Array.isArray(response)) {
        roomsData = response;
      }
      
      roomsData = roomsData.map(room => ({
        ...room,
        roomType: room.roomType || mapStyleToCategory(room.style)
      }));
      
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms(mockRooms);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const mapStyleToCategory = (style) => {
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
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (inView && rooms.length > 0 && !loading) {
      // Load more functionality if needed
    }
  }, [inView, rooms.length, loading]);

  useEffect(() => {
    try {
      localStorage.setItem('likedRooms', JSON.stringify([...likedRooms]));
    } catch (error) {
      console.error('Failed to save liked rooms:', error);
    }
  }, [likedRooms]);

  const handleImageLoad = useCallback((roomId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [roomId]: 'loaded'
    }));
  }, []);

  const handleImageError = useCallback((roomId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [roomId]: 'error'
    }));
  }, []);

  const handleLike = useCallback((roomId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
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
  }, [navigate]);

  const retryFetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchRooms();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selectedRoom) {
        setSelectedRoom(null);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedRoom]);

  useEffect(() => {
    if (selectedRoom) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedRoom]);

  const filteredRooms = useMemo(() => {
    if (!selectedStyle) return rooms;
    return rooms.filter(room => room.roomType === selectedStyle);
  }, [rooms, selectedStyle]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const uniqueRoomTypes = useMemo(() => {
    return [...new Set(rooms.map(r => r.roomType).filter(Boolean))];
  }, [rooms]);

  const roomsGrid = useMemo(() => {
    if (loading) return null;
    if (error) return null;
    if (!filteredRooms.length) return null;

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="wait">
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room._id || index}
              variants={itemVariants}
              layout
              className="group cursor-pointer"
              onClick={() => setSelectedRoom(room)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedRoom(room);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${room.name} room details`}
            >
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-2 bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300">
                {(!imageLoadStates[room._id] || imageLoadStates[room._id] === 'loading') && (
                  <Skeleton className="absolute inset-0" />
                )}
                
                {imageLoadStates[room._id] === 'error' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <div className="text-center">
                      <FiAlertCircle className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-xs text-gray-500">Failed to load</p>
                    </div>
                  </div>
                )}

                <img
                  src={room.image}
                  alt={room.name}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                    imageLoadStates[room._id] === 'loaded' ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(room._id)}
                  onError={() => handleImageError(room._id)}
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-x-0 md:translate-x-2 md:group-hover:translate-x-0">
                  <button
                    onClick={(e) => handleLike(room._id, e)}
                    className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
                      likedRooms.has(room._id)
                        ? 'bg-red-500 text-white shadow-lg hover:bg-red-600'
                        : 'bg-white/90 text-gray-700 hover:bg-white shadow-md'
                    }`}
                    aria-label={likedRooms.has(room._id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <FiHeart 
                      className={`h-3.5 w-3.5 ${likedRooms.has(room._id) ? 'fill-current' : ''}`} 
                    />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoom(room);
                    }}
                    className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white backdrop-blur-sm transition-all duration-200 shadow-md"
                    aria-label="View details"
                  >
                    <FiEye className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-sm font-bold text-white mb-0.5 drop-shadow-lg">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-white/20 backdrop-blur-sm rounded-full text-white">
                      {room.style}
                    </span>
                    {room.roomType && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-white/10 backdrop-blur-sm rounded-full text-white/80">
                        {room.roomType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 line-clamp-1 hidden sm:block">
                {room.description}
              </p>
              
              <button
                onClick={(e) => handleShopThisRoom(room, e)}
                className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-all duration-200 group/link"
              >
                <span className="relative">
                  Shop This Look
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover/link:w-full transition-all duration-300"></span>
                </span>
                <FiArrowRight className="h-3 w-3 transform group-hover/link:translate-x-1 transition-transform duration-200" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div ref={loadMoreRef} className="col-span-full h-4" />
      </motion.div>
    );
  }, [filteredRooms, loading, error, imageLoadStates, likedRooms, handleImageLoad, handleImageError, handleLike, handleShopThisRoom]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-4">
      <div className="w-full px-3 sm:px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <FiHome className="h-5 w-5 text-primary-500" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Room Inspiration
            </h1>
          </div>
          
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap overflow-x-auto px-4 pb-1 scrollbar-hide">
            Discover beautifully curated rooms and transform your space with our shoppable inspiration gallery
          </p>
          
          {!loading && !error && filteredRooms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center items-center gap-4 sm:gap-6 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">{filteredRooms.length}</div>
                <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">Curated Rooms</div>
              </div>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {uniqueRoomTypes.length}
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">Unique Styles</div>
              </div>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {likedRooms.size}
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">Favorites</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {!loading && !error && rooms.length > 0 && (
          <RoomStyleFilters 
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
            roomTypes={uniqueRoomTypes}
          />
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[4/3] rounded-xl shadow-md" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <FiAlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Failed to Load Inspiration
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={retryFetch}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
              >
                <FiRefreshCw className="h-3.5 w-3.5" />
                Try Again
              </button>
            </motion.div>
          ) : filteredRooms.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <FiGrid className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                No Rooms Available
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Check back later for new inspiration
              </p>
            </motion.div>
          ) : (
            roomsGrid
          )}
        </AnimatePresence>

        {/* Fixed Modal with Proper Sizing and Scrolling */}
        <AnimatePresence>
          {selectedRoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedRoom(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col h-full">
                  {/* Fixed Image Section */}
                  <div className="relative flex-shrink-0 bg-black">
                    <div className="w-full aspect-[16/9] md:aspect-[16/10]">
                      <ZoomableImage
                        src={selectedRoom.image}
                        alt={selectedRoom.name}
                      />
                    </div>
                    
                    <button
                      onClick={() => setSelectedRoom(null)}
                      className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors backdrop-blur-sm z-20"
                      aria-label="Close modal"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Scrollable Content Section */}
                  <div className="flex-1 overflow-y-auto overscroll-contain p-5 md:p-6 space-y-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                        {selectedRoom.name}
                      </h2>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                          {selectedRoom.style}
                        </span>
                        {selectedRoom.roomType && (
                          <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                            {selectedRoom.roomType}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {selectedRoom.description}
                    </p>
                    
                    {selectedRoom.features && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                          Key Features
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{selectedRoom.features}</p>
                      </div>
                    )}
                    
                    {selectedRoom.tips && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          Design Tip
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-300">{selectedRoom.tips}</p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={() => handleShopThisRoom(selectedRoom)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 text-sm font-medium flex-1 transform active:scale-95"
                      >
                        <FiShoppingBag className="h-4 w-4" />
                        Shop This Room
                        <FiArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleLike(selectedRoom._id)}
                        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium flex-1 transform active:scale-95 ${
                          likedRooms.has(selectedRoom._id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <FiHeart className={`h-4 w-4 ${likedRooms.has(selectedRoom._id) ? 'fill-current' : ''}`} />
                        {likedRooms.has(selectedRoom._id) ? 'Favorited' : 'Add to Favorites'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <style>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .overflow-x-auto {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        .overscroll-contain {
          overscroll-behavior: contain;
        }
      `}</style>
    </div>
  );
};

export default RoomInspiration;