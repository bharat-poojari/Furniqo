import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  FiClock, 
  FiUser, 
  FiArrowRight, 
  FiSearch, 
  FiBookOpen,
  FiGrid,
  FiList,
  FiX,
  FiCalendar,
  FiAlertCircle,
  FiSliders,
  FiChevronDown
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { Skeleton } from '../components/common/Skeleton';
import Pagination from '../components/common/Pagination';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const searchInputRef = useRef(null);
  const pageRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiWrapper.getBlogPosts();
      
      let postsData = [];
      if (response?.data?.success && response?.data?.data) {
        postsData = response.data.data;
      } else if (response?.success && response?.data) {
        postsData = response.data;
      } else if (response?.data && Array.isArray(response.data)) {
        postsData = response.data;
      } else if (Array.isArray(response)) {
        postsData = response;
      }
      
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(posts.map(p => p.category).filter(Boolean))];
    return cats;
  }, [posts]);

  const categoryCount = useMemo(() => {
    const counts = { all: posts.length };
    posts.forEach(post => {
      if (post.category) {
        counts[post.category] = (counts[post.category] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => 
    posts.filter(post => {
      const matchesSearch = searchTerm === '' || 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }),
    [posts, searchTerm, selectedCategory]
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredPosts.slice(start, end);
  }, [filteredPosts, currentPage, itemsPerPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setTimeout(() => {
      pageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
    searchInputRef.current?.focus();
    setCurrentPage(1);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowFilters(false);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}`}>
      {[...Array(viewMode === 'grid' ? 6 : 4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {viewMode === 'grid' ? (
            <div className="space-y-2">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ) : (
            <div className="flex flex-row gap-3 p-2.5">
              <Skeleton className="w-28 sm:w-32 md:w-48 h-20 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  // Add shimmer animation to global styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-shimmer {
        animation: shimmer 1.5s infinite;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .will-change-transform {
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Get category color based on name
  const getCategoryColor = (category) => {
    const colors = {
      'Design Tips': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'Trends': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      'Home Office': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'Sustainability': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      'Style Guide': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
      'Buying Guides': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      'Kids Room': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      'Outdoor Living': 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
      'DIY': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
      'Bedroom': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
      'Color Theory': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
      'Small Spaces': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      'Budget Design': 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300',
      'Home Library': 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
      'Pet-Friendly': 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300',
      'Smart Furniture': 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300',
      'Maintenance': 'bg-stone-100 dark:bg-stone-900/30 text-stone-700 dark:text-stone-300',
      'Minimalism': 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
    };
    return colors[category] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full px-[1%] py-[1%]" ref={pageRef}>
        
        {/* Header with Icon and Title on same row */}
        <motion.div 
          style={{ opacity }}
          className="flex flex-row items-center justify-between gap-3 mb-6 sm:mb-8"
        >
          <div className="flex flex-row items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0"
            >
              <FiBookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight"
              >
                Our Blog
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block"
              >
                Design inspiration & expert tips for your home
              </motion.p>
            </div>
          </div>

          {/* Stats - Right aligned */}
          {!loading && !error && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white">{posts.length}</span>
                <span className="text-[10px] sm:text-xs text-neutral-400">Articles</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-neutral-300 dark:bg-neutral-600" />
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white">{categories.length - 1}</span>
                <span className="text-[10px] sm:text-xs text-neutral-400">Categories</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-neutral-300 dark:bg-neutral-600" />
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white">{(posts.filter(p => p.featured)).length || posts.slice(0, 3).length}</span>
                <span className="text-[10px] sm:text-xs text-neutral-400">Featured</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Search & Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search articles..."
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 shadow-sm transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={handleSearchClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                >
                  <FiX className="h-4 w-4 text-neutral-400" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-neutral-700 shadow-md text-primary-600' 
                      : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                  title="Grid view"
                >
                  <FiGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-neutral-700 shadow-md text-primary-600' 
                      : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                  title="List view"
                >
                  <FiList className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={toggleFilters}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 flex-1 sm:flex-none ${
                  showFilters 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <FiSliders className="h-4 w-4" />
                <span className="text-sm font-medium">Filters</span>
                <FiChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <AnimatePresence mode="wait">
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden mt-4"
              >
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Browse Categories</h3>
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => handleCategorySelect('all')}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                          selectedCategory === cat
                            ? 'bg-primary-600 text-white shadow-md'
                            : `hover:shadow-sm ${getCategoryColor(cat)}`
                        }`}
                      >
                        <span className="text-xs font-medium truncate">
                          {cat === 'all' ? 'All Posts' : cat}
                        </span>
                        <span className={`text-[10px] ml-2 px-1.5 py-0.5 rounded-full ${
                          selectedCategory === cat
                            ? 'bg-white/20 text-white'
                            : 'bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                        }`}>
                          {categoryCount[cat] || 0}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Bar */}
          {(selectedCategory !== 'all' || searchTerm) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-center gap-2 mt-3"
            >
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Active filters:</span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => handleCategorySelect('all')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  Category: {selectedCategory}
                  <FiX className="h-3 w-3" />
                </button>
              )}
              {searchTerm && (
                <button
                  onClick={handleSearchClear}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  Search: "{searchTerm}"
                  <FiX className="h-3 w-3" />
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        {!loading && !error && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-center"
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Showing <span className="font-semibold text-neutral-900 dark:text-white">{paginatedPosts.length}</span> of{' '}
              <span className="font-semibold text-neutral-900 dark:text-white">{filteredPosts.length}</span> articles
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </motion.div>
        )}

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LoadingSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <FiAlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Failed to Load Articles</h3>
              <p className="text-sm text-neutral-500 mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
              >
                Try Again
              </button>
            </motion.div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
                <FiSearch className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">No Articles Found</h3>
              <p className="text-sm text-neutral-500 mb-4">
                {searchTerm ? `No results found for "${searchTerm}"` : 'No articles in this category yet'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setCurrentPage(1); }}
                  className="px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`${viewMode}-${selectedCategory}-${searchTerm}-${currentPage}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="will-change-transform"
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginatedPosts.map((post, index) => (
                    <motion.article
                      key={post._id || post.slug || index}
                      variants={itemVariants}
                      layoutId={post._id || post.slug}
                      className="will-change-transform group"
                    >
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="block bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300 h-full"
                      >
                        <div className="relative overflow-hidden aspect-[16/10] bg-neutral-100 dark:bg-neutral-800">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-3 left-3">
                            <span className={`text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </span>
                          </div>
                          {post.featured && (
                            <div className="absolute top-3 right-3">
                              <span className="bg-amber-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm">
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2">
                            <span className="flex items-center gap-1">
                              <FiCalendar className="h-3 w-3" />
                              {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock className="h-3 w-3" />
                              {post.readTime}
                            </span>
                          </div>
                          
                          <h2 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2 line-clamp-2 leading-snug">
                            {post.title}
                          </h2>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                            <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                              <FiUser className="h-3 w-3" />
                              {post.author}
                            </span>
                            <span className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium text-xs group-hover:gap-2 transition-all duration-200">
                              Read More <FiArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                /* LIST VIEW - Compact cards with image height matching card height */
                <div className="space-y-2">
                  {paginatedPosts.map((post, index) => (
                    <motion.article
                      key={post._id || post.slug || index}
                      variants={listItemVariants}
                      layoutId={post._id || post.slug}
                      className="will-change-transform group"
                    >
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="flex flex-row gap-3 p-2.5 sm:p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-200"
                      >
                        {/* Image - Fixed height matching card */}
                        <div className="relative w-20 sm:w-24 md:w-32 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 h-16 sm:h-20 md:h-24">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {post.featured && (
                            <div className="absolute top-0.5 left-0.5">
                              <span className="bg-amber-500 text-white text-[7px] sm:text-[8px] font-semibold px-1 py-0.5 rounded">
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Content - Compact */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                            <span className={`text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-neutral-400 flex items-center gap-0.5">
                              <FiCalendar className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                              <span className="hidden xs:inline">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-neutral-400 flex items-center gap-0.5">
                              <FiClock className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                            </span>
                          </div>
                          
                          <h2 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 leading-tight mb-0.5">
                            {post.title}
                          </h2>
                          
                          <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-relaxed">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between mt-1">
                            <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] text-neutral-500 dark:text-neutral-400">
                              <FiUser className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                              <span className="truncate max-w-[60px] sm:max-w-[80px]">{post.author}</span>
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-primary-600 dark:text-primary-400 font-medium text-[9px] sm:text-[10px] group-hover:gap-1 transition-all duration-200">
                              Read <FiArrowRight className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!loading && !error && filteredPosts.length > 0 && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              variant="rounded"
              size="md"
              showFirstLast={true}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;