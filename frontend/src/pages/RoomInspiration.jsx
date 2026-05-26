// RoomInspiration.jsx - Frontend room inspiration gallery (PROFESSIONAL SCROLL-AWARE FILTER)
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowRight, FiGrid, FiRefreshCw, FiAlertCircle,
  FiHeart, FiEye, FiX, FiHome, FiShoppingBag,
  FiChevronLeft, FiChevronRight, FiPackage, FiFilter,
  FiSliders, FiCheck, FiStar, FiTrendingUp, FiTag
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

// Helper function to safely parse JSON
const safeJSONParse = (data, defaultValue = []) => {
  if (!data) return defaultValue;
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') return data;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// Helper function to safely get image URL
const getImageUrl = (room) => {
  if (room.image && typeof room.image === 'string' && room.image.startsWith('http')) {
    return room.image;
  }
  return 'https://placehold.co/600x400/eee/999?text=No+Image';
};

// ============================================
// CUSTOM HOOKS
// ============================================

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
// PROFESSIONAL SCROLL-AWARE MOBILE FILTER BUTTON
// ============================================

const MobileFilterButton = ({ onClick, filtersAppliedCount }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (!isMobile) return;
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY;
          
          // Show button when scrolling up or at the top
          // Hide button when scrolling down and not at the top
          if (scrollDelta > 5 && currentScrollY > 100) {
            setIsVisible(false);
          } else if (scrollDelta < -5 || currentScrollY < 50) {
            setIsVisible(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile]);

  if (!isMobile) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isVisible ? 1 : 0.8, 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 30,
        duration: 0.2
      }}
      className="fixed z-50"
      style={{ 
        bottom: '24px', 
        right: '24px',
      }}
    >
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden group"
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isHovered 
            ? '0 20px 25px -12px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.2)' 
            : '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Ripple effect background */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isHovered ? 1 : 0, 
            opacity: isHovered ? 0.3 : 0 
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Filter Icon with pulse animation when filters are applied */}
        <motion.div
          animate={filtersAppliedCount > 0 ? {
            rotate: [0, 10, -10, 10, 0],
            transition: { duration: 0.5, repeat: 1 }
          } : {}}
        >
          <FiFilter className="h-4 w-4 relative z-10" />
        </motion.div>
        
        <span className="text-sm font-medium relative z-10">
          {filtersAppliedCount > 0 ? 'Filters Active' : 'Filter & Sort'}
        </span>
        
        {/* Badge for active filters count */}
        {filtersAppliedCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold bg-white text-primary-600 rounded-full shadow-md z-20"
          >
            {filtersAppliedCount}
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  );
};

// ============================================
// PROFESSIONAL MOBILE FILTER DRAWER
// ============================================

const MobileFilterDrawer = ({ 
  isOpen, 
  onClose, 
  selectedStyle, 
  onStyleChange, 
  roomStyles,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedRoomType,
  onRoomTypeChange,
  roomTypes,
  filtersAppliedCount
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localSelectedStyle, setLocalSelectedStyle] = useState(selectedStyle);
  const [localSelectedRoomType, setLocalSelectedRoomType] = useState(selectedRoomType);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const drawerRef = useRef(null);

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: FiStar },
    { value: 'popular', label: 'Most Popular', icon: FiTrendingUp },
    { value: 'name_asc', label: 'Name (A-Z)', icon: FiTag },
    { value: 'name_desc', label: 'Name (Z-A)', icon: FiTag },
  ];

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleApply = () => {
    onSearchChange(localSearchTerm);
    onStyleChange(localSelectedStyle);
    onRoomTypeChange(localSelectedRoomType);
    onSortChange(localSortBy);
    onClose();
    toast.success('Filters applied', {
      icon: '✅',
      duration: 2000,
    });
  };

  const handleReset = () => {
    setLocalSearchTerm('');
    setLocalSelectedStyle(null);
    setLocalSelectedRoomType(null);
    setLocalSortBy('newest');
    onSearchChange('');
    onStyleChange(null);
    onRoomTypeChange(null);
    onSortChange('newest');
    onClose();
    toast.success('All filters cleared', {
      icon: '🔄',
      duration: 2000,
    });
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <FiSliders className="h-4 w-4 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter & Sort</h2>
                {filtersAppliedCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full"
                  >
                    {filtersAppliedCount}
                  </motion.span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <FiX className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Search Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Rooms
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, style, or type..."
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    autoFocus
                    className="w-full px-4 py-3 pl-10 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {localSearchTerm && (
                    <button
                      onClick={() => setLocalSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sort By Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = localSortBy === option.value;
                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => setLocalSortBy(option.value)}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                          isSelected
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 border-primary-200 dark:border-primary-800 border'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                        {isSelected && <FiCheck className="h-4 w-4 ml-auto" />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Style Filter Section */}
              {roomStyles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Style
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLocalSelectedStyle(null)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                        !localSelectedStyle
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      All Styles
                    </motion.button>
                    {roomStyles.map((style) => (
                      <motion.button
                        key={style}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLocalSelectedStyle(style === localSelectedStyle ? null : style)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                          localSelectedStyle === style
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {style}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Type Filter Section */}
              {roomTypes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLocalSelectedRoomType(null)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                        !localSelectedRoomType
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      All Types
                    </motion.button>
                    {roomTypes.map((type) => (
                      <motion.button
                        key={type}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLocalSelectedRoomType(type === localSelectedRoomType ? null : type)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                          localSelectedRoomType === type
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              {(localSelectedStyle || localSelectedRoomType || localSearchTerm || localSortBy !== 'newest') && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Filters will be applied to <span className="font-semibold text-primary-600">all rooms</span>
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 dark:border-gray-700"
              >
                Reset All
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-md"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================
// HORIZONTAL SCROLL FILTERS (DESKTOP)
// ============================================

const HorizontalScrollFilters = ({ selectedStyle, onStyleChange, roomStyles }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [roomStyles]);

  if (isMobile) return null;

  return (
    <div className="relative mb-6">
      {showLeftArrow && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <FiChevronLeft className="h-4 w-4" />
        </motion.button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onStyleChange(null)}
          className={`whitespace-nowrap transition-all duration-300 flex-shrink-0 px-5 py-2 text-sm font-medium rounded-full ${
            !selectedStyle
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-neutral-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700'
          }`}
        >
          All Rooms
        </motion.button>
        {roomStyles.map((style) => (
          <motion.button
            key={style}
            whileTap={{ scale: 0.97 }}
            onClick={() => onStyleChange(style === selectedStyle ? null : style)}
            className={`whitespace-nowrap transition-all duration-300 flex-shrink-0 px-5 py-2 text-sm font-medium rounded-full ${
              selectedStyle === style
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-neutral-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700'
            }`}
          >
            {style}
          </motion.button>
        ))}
      </div>

      {showRightArrow && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <FiChevronRight className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  );
};

// ============================================
// ACTIVE FILTERS DISPLAY
// ============================================

const ActiveFiltersDisplay = ({ 
  selectedStyle, 
  selectedRoomType, 
  searchTerm, 
  sortBy,
  onClearStyle, 
  onClearRoomType, 
  onClearSearch,
  onClearSort 
}) => {
  const hasActiveFilters = selectedStyle || selectedRoomType || searchTerm || (sortBy !== 'newest');
  
  if (!hasActiveFilters) return null;

  const getSortLabel = () => {
    const sortMap = {
      'newest': 'Newest',
      'popular': 'Popular',
      'name_asc': 'A-Z',
      'name_desc': 'Z-A'
    };
    return sortMap[sortBy] || '';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 mb-3 px-1"
    >
      <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
      {searchTerm && (
        <motion.span 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full"
        >
          Search: "{searchTerm.length > 15 ? searchTerm.slice(0, 15) + '...' : searchTerm}"
          <button onClick={onClearSearch} className="hover:text-red-500 ml-1">
            <FiX className="h-3 w-3" />
          </button>
        </motion.span>
      )}
      {selectedStyle && (
        <motion.span 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
        >
          Style: {selectedStyle}
          <button onClick={onClearStyle} className="hover:text-red-500 ml-1">
            <FiX className="h-3 w-3" />
          </button>
        </motion.span>
      )}
      {selectedRoomType && (
        <motion.span 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full"
        >
          Type: {selectedRoomType}
          <button onClick={onClearRoomType} className="hover:text-red-500 ml-1">
            <FiX className="h-3 w-3" />
          </button>
        </motion.span>
      )}
      {sortBy !== 'newest' && (
        <motion.span 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
        >
          Sort: {getSortLabel()}
          <button onClick={onClearSort} className="hover:text-red-500 ml-1">
            <FiX className="h-3 w-3" />
          </button>
        </motion.span>
      )}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          onClearStyle();
          onClearRoomType();
          onClearSearch();
          onClearSort();
        }}
        className="text-xs text-primary-600 hover:text-primary-700 underline ml-1"
      >
        Clear all
      </motion.button>
    </motion.div>
  );
};

// ============================================
// ROOM CARD COMPONENT
// ============================================

const RoomCard = ({ room, isLiked, onLike, onView, onShop }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageUrl = getImageUrl(room);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onLike(room._id);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    onView(room);
  };

  const handleShopClick = (e) => {
    e.stopPropagation();
    onShop(room);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={handleViewClick}
    >
      <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-2 bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt={room.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLikeClick}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-all ${
              isLiked ? 'bg-red-500 text-white shadow-lg' : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <FiHeart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleViewClick}
            className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white backdrop-blur-sm transition-all"
          >
            <FiEye className="h-3.5 w-3.5" />
          </motion.button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-sm font-bold text-white mb-0.5 drop-shadow-lg line-clamp-1">{room.name}</h3>
          <div className="flex flex-wrap items-center gap-1">
            {room.style && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-white/20 backdrop-blur-sm rounded-full text-white">
                {room.style}
              </span>
            )}
            {room.roomType && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-white/10 backdrop-blur-sm rounded-full text-white/80">
                {room.roomType}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <motion.button
        whileHover={{ x: 3 }}
        onClick={handleShopClick}
        className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
      >
        <span>Shop This Look</span>
        <FiArrowRight className="h-3 w-3" />
      </motion.button>
    </motion.div>
  );
};

// ============================================
// ROOM MODAL COMPONENT
// ============================================

const RoomModal = ({ room, isLiked, onClose, onLike, onShop }) => {
  const [activeTab, setActiveTab] = useState('details');
  const imageUrl = getImageUrl(room);
  const products = safeJSONParse(room.products, []);

  const handleLikeClick = () => {
    onLike(room._id);
  };

  const handleShopClick = () => {
    onShop(room);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="md:w-1/2 bg-black relative h-64 md:h-auto">
            <img
              src={imageUrl}
              alt={room.name}
              className="w-full h-full object-cover"
            />
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="absolute top-3 right-3 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors z-10"
            >
              <FiX className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="md:w-1/2 p-4 sm:p-6 flex flex-col overflow-y-auto" style={{ maxHeight: 'calc(90vh - 2rem)' }}>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{room.name}</h2>
                <div className="flex flex-wrap gap-2">
                  {room.style && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                      {room.style}
                    </span>
                  )}
                  {room.roomType && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      {room.roomType}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                {['details', 'features', 'tips', 'products'].map((tab) => (
                  <motion.button
                    key={tab}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-3 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab 
                        ? 'text-primary-600 border-b-2 border-primary-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'details' ? 'Details' : tab === 'features' ? 'Features' : tab === 'tips' ? 'Design Tip' : 'Products'}
                  </motion.button>
                ))}
              </div>
              
              <div className="space-y-4 min-h-[180px]">
                {activeTab === 'details' && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {room.description || 'No description available.'}
                  </p>
                )}
                
                {activeTab === 'features' && (
                  <div>
                    {room.features ? (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {room.features}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">No features listed</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'tips' && (
                  <div>
                    {room.tips ? (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                          {room.tips}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">No design tips available</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'products' && (
                  <div>
                    {products.length > 0 ? (
                      <div className="space-y-2">
                        {products.map((product, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <FiPackage className="h-4 w-4 text-primary-500 flex-shrink-0" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400 break-all">
                              {product}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">No related products</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleShopClick}
                className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <FiShoppingBag className="h-4 w-4" /> Shop This Room
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleLikeClick}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  isLiked 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                <FiHeart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Favorited' : 'Save to Favorites'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================
// SHIMMER SKELETON
// ============================================

const ShimmerSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="aspect-[4/3] rounded-xl bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    ))}
  </div>
);

// ============================================
// MAIN ROOM INSPIRATION COMPONENT
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
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const isMobile = useMediaQuery('(max-width: 768px)');

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiWrapper.getRooms();
      
      let roomsData = [];
      if (response?.success && response?.rooms) roomsData = response.rooms;
      else if (response?.data?.success && response?.data?.rooms) roomsData = response.data.rooms;
      else if (Array.isArray(response)) roomsData = response;
      else if (response?.data && Array.isArray(response.data)) roomsData = response.data;
      
      const parsedRooms = roomsData.map(room => ({
        ...room,
        products: safeJSONParse(room.products, []),
        tags: safeJSONParse(room.tags, [])
      }));
      
      setRooms(parsedRooms);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms. Please try again.');
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    try {
      localStorage.setItem('likedRooms', JSON.stringify([...likedRooms]));
    } catch (error) {
      console.error('Failed to save liked rooms:', error);
    }
  }, [likedRooms]);

  const handleLike = useCallback((roomId) => {
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

  const handleShopThisRoom = useCallback((room) => {
    const category = room.roomType || room.style;
    navigate(`/products?category=${encodeURIComponent(category || '')}&roomId=${room._id}`);
  }, [navigate]);

  const retryFetch = useCallback(() => {
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
    let filtered = [...rooms];
    
    if (selectedStyle) {
      filtered = filtered.filter(room => room.style === selectedStyle);
    }
    
    if (selectedRoomType) {
      filtered = filtered.filter(room => room.roomType === selectedRoomType);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(room => 
        room.name?.toLowerCase().includes(term) ||
        room.style?.toLowerCase().includes(term) ||
        room.roomType?.toLowerCase().includes(term) ||
        room.description?.toLowerCase().includes(term)
      );
    }
    
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
        break;
      case 'name_asc':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'name_desc':
        filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      default:
        break;
    }
    
    return filtered;
  }, [rooms, selectedStyle, selectedRoomType, searchTerm, sortBy]);

  const uniqueStyles = useMemo(() => {
    return [...new Set(rooms.map(r => r.style).filter(Boolean))];
  }, [rooms]);

  const uniqueRoomTypes = useMemo(() => {
    return [...new Set(rooms.map(r => r.roomType).filter(Boolean))];
  }, [rooms]);

  const filtersAppliedCount = useMemo(() => {
    let count = 0;
    if (selectedStyle) count++;
    if (selectedRoomType) count++;
    if (searchTerm) count++;
    if (sortBy !== 'newest') count++;
    return count;
  }, [selectedStyle, selectedRoomType, searchTerm, sortBy]);

  const clearAllFilters = useCallback(() => {
    setSelectedStyle(null);
    setSelectedRoomType(null);
    setSearchTerm('');
    setSortBy('newest');
    toast.success('All filters cleared');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-4 sm:py-6">
      <div className="w-full px-3 sm:px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiHome className="h-5 w-5 text-primary-500" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Room Inspiration
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Discover beautifully curated rooms and transform your space with our shoppable inspiration gallery
          </p>
          
          {!loading && !error && filteredRooms.length > 0 && (
            <div className="flex justify-center items-center gap-4 sm:gap-6 mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-primary-600">{filteredRooms.length}</div>
                <div className="text-[10px] sm:text-xs text-neutral-500">Rooms</div>
              </div>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-green-600">{uniqueStyles.length}</div>
                <div className="text-[10px] sm:text-xs text-neutral-500">Styles</div>
              </div>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-red-500">{likedRooms.size}</div>
                <div className="text-[10px] sm:text-xs text-neutral-500">Favorites</div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Search Bar */}
        <div className="mb-4 max-w-md mx-auto hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms by name, style, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Filters */}
        {!loading && !error && rooms.length > 0 && uniqueStyles.length > 0 && (
          <HorizontalScrollFilters 
            selectedStyle={selectedStyle} 
            onStyleChange={setSelectedStyle} 
            roomStyles={uniqueStyles} 
          />
        )}

        {/* Active Filters Display */}
        <ActiveFiltersDisplay 
          selectedStyle={selectedStyle}
          selectedRoomType={selectedRoomType}
          searchTerm={searchTerm}
          sortBy={sortBy}
          onClearStyle={() => setSelectedStyle(null)}
          onClearRoomType={() => setSelectedRoomType(null)}
          onClearSearch={() => setSearchTerm('')}
          onClearSort={() => setSortBy('newest')}
        />

        {/* Content */}
        {loading ? (
          <ShimmerSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{error}</h3>
            <motion.button 
              whileTap={{ scale: 0.97 }}
              onClick={retryFetch} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiRefreshCw /> Try Again
            </motion.button>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <FiGrid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Rooms Found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchTerm 
                ? `No rooms matching "${searchTerm}"` 
                : selectedStyle || selectedRoomType
                  ? `No rooms match your filters` 
                  : 'No rooms available'}
            </p>
            {(selectedStyle || selectedRoomType || searchTerm) && (
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={clearAllFilters} 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Clear All Filters
              </motion.button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredRooms.map((room) => (
                <RoomCard 
                  key={room._id} 
                  room={room} 
                  isLiked={likedRooms.has(room._id)} 
                  onLike={handleLike} 
                  onView={setSelectedRoom} 
                  onShop={handleShopThisRoom} 
                />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Modal */}
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

      {/* Professional Scroll-Aware Mobile Filter Button */}
      <MobileFilterButton 
        onClick={() => setIsFilterDrawerOpen(true)} 
        filtersAppliedCount={filtersAppliedCount}
      />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer 
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
        roomStyles={uniqueStyles}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedRoomType={selectedRoomType}
        onRoomTypeChange={setSelectedRoomType}
        roomTypes={uniqueRoomTypes}
        filtersAppliedCount={filtersAppliedCount}
      />
      
      {/* Global Styles */}
      <style>{`
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default RoomInspiration;