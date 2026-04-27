import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowRight, 
  FiGrid, 
  FiRefreshCw, 
  FiAlertCircle,
  FiHeart,
  FiZoomIn,
  FiX
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { Skeleton } from '../components/common/Skeleton';

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

const RoomInspiration = () => {
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
  
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.1 });

  const fetchRooms = async () => {
  try {
    const response = await apiWrapper.getRooms();
    
    // Handle different response structures
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
    
    setRooms(roomsData);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    setRooms([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (inView && rooms.length > 0 && !loading) {
      console.log('Load more rooms triggered');
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

  const retryFetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchRooms();
  }, [fetchRooms]);

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

  const roomsGrid = useMemo(() => {
    if (loading) return null;
    if (error) return null;
    if (!rooms.length) return null;

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="wait">
          {rooms.map((room, index) => (
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
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-3 bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300">
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
                
                {/* Quick Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <button
                    onClick={(e) => handleLike(room._id, e)}
                    className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
                      likedRooms.has(room._id)
                        ? 'bg-red-500 text-white shadow-lg hover:bg-red-600'
                        : 'bg-white/90 text-gray-700 hover:bg-white shadow-md'
                    }`}
                    aria-label={likedRooms.has(room._id) ? 'Remove from favorites' : 'Add to favorites'}
                    title={likedRooms.has(room._id) ? 'Remove from favorites' : 'Add to favorites'}
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
                    title="View details"
                  >
                    <FiZoomIn className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                {/* Room Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full text-white">
                      {room.style}
                    </span>
                    {room.roomType && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-white/10 backdrop-blur-sm rounded-full text-white/80">
                        {room.roomType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Room Description */}
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors duration-200">
                {room.description}
              </p>
              
              {/* Shopping CTA */}
              <Link
                to={`/products?style=${encodeURIComponent(room.style)}&roomId=${room._id}`}
                className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-all duration-200 group/link"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="relative">
                  Shop This Look
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover/link:w-full transition-all duration-300"></span>
                </span>
                <FiArrowRight className="h-3.5 w-3.5 transform group-hover/link:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div ref={loadMoreRef} className="col-span-full h-8" />
      </motion.div>
    );
  }, [rooms, loading, error, imageLoadStates, likedRooms, handleImageLoad, handleImageError, handleLike]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-[1%]">
      <div className="w-full px-[1%]">
        {/* Header Section - Compact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-600 dark:text-primary-400 text-xs font-medium mb-3">
            <FiGrid className="h-3 w-3" />
            <span>Curated Collections</span>
          </div>
          
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
            Room Inspiration
          </h1>
          
          <p className="text-sm lg:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Discover beautifully curated rooms and transform your space with our shoppable inspiration gallery
          </p>
          
          {/* Stats Bar - Compact */}
          {!loading && !error && rooms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center gap-6 mt-4"
            >
              <div className="text-center">
                <div className="text-lg font-bold text-neutral-900 dark:text-white">{rooms.length}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Curated Rooms</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-neutral-900 dark:text-white">
                  {[...new Set(rooms.map(r => r.style))].length}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Unique Styles</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-neutral-900 dark:text-white">
                  {likedRooms.size}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Favorites</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-60 rounded-xl shadow-md" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
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
          ) : rooms.length === 0 ? (
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

        {/* Modal for Room Detail */}
        <AnimatePresence>
          {selectedRoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-[1%] bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedRoom(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <img
                    src={selectedRoom.image}
                    alt={selectedRoom.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="absolute top-3 right-3 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Close modal"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    {selectedRoom.name}
                  </h2>
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full">
                      {selectedRoom.style}
                    </span>
                    {selectedRoom.roomType && (
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                        {selectedRoom.roomType}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5">
                    {selectedRoom.description}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/products?style=${encodeURIComponent(selectedRoom.style)}&roomId=${selectedRoom._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex-1 justify-center"
                    >
                      Shop This Room
                      <FiArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleLike(selectedRoom._id)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        likedRooms.has(selectedRoom._id)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title={likedRooms.has(selectedRoom._id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FiHeart className={`h-4 w-4 ${likedRooms.has(selectedRoom._id) ? 'fill-current' : ''}`} />
                    </button>
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
      `}</style>
    </div>
  );
};

export default RoomInspiration;