import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiSliders
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { Skeleton } from '../components/common/Skeleton';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setError(null);
      const response = await apiWrapper.getBlogPosts();
      const postData = response.data?.data || response.data || [];
      if (!Array.isArray(postData)) throw new Error('Invalid data format');
      setPosts(postData);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError(error.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => 
    ['all', ...new Set(posts.map(p => p.category).filter(Boolean))],
    [posts]
  );

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

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-[1%]">
        
        {/* Compact Centered Header - Single Row Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-5 sm:mb-6"
        >
          {/* Icon + Title Group */}
          <div className="flex items-center gap-2.5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0"
            >
              <FiBookOpen className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-primary-600 dark:text-primary-400" />
            </motion.div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight leading-tight">
                Our Blog
              </h1>
              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 leading-tight hidden sm:block">
                Design inspiration & expert tips for your home
              </p>
            </div>
          </div>

          {/* Inline Stats - Compact */}
          {!loading && !error && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">{posts.length}</span>
                <span className="text-[10px] sm:text-[11px] text-neutral-400">Articles</span>
              </div>
              <div className="w-px h-3 bg-neutral-300 dark:bg-neutral-600" />
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">{categories.length - 1}</span>
                <span className="text-[10px] sm:text-[11px] text-neutral-400">Categories</span>
              </div>
              <div className="w-px h-3 bg-neutral-300 dark:bg-neutral-600" />
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">{(posts.filter(p => p.featured)).length || posts.slice(0, 3).length}</span>
                <span className="text-[10px] sm:text-[11px] text-neutral-400">Featured</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Compact Centered Search & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto mb-5 sm:mb-6"
        >
          {/* Search Bar with integrated controls */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-9 pr-8 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 shadow-sm transition-all"
              />
              {searchTerm ? (
                <button
                  onClick={handleSearchClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                >
                  <FiX className="h-3.5 w-3.5 text-neutral-400" />
                </button>
              ) : (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all ${
                    showFilters ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400'
                  }`}
                >
                  <FiSliders className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5 flex-shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600' 
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
                title="Grid view"
              >
                <FiGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600' 
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
                title="List view"
              >
                <FiList className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Category Pills - Collapsible */}
          <AnimatePresence>
            {(showFilters || selectedCategory !== 'all') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2.5">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
                        selectedCategory === cat
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      {cat === 'all' ? 'All' : cat}
                      <span className={`text-[10px] ${selectedCategory === cat ? 'text-white/70' : 'text-neutral-400'}`}>
                        {categoryCount[cat] || 0}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filter Indicator */}
          {selectedCategory !== 'all' && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] sm:text-[11px] text-neutral-400">
                <span className="font-medium text-neutral-600 dark:text-neutral-300">{filteredPosts.length}</span> in{' '}
                <span className="font-medium text-primary-600 dark:text-primary-400">{selectedCategory}</span>
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-[10px] text-primary-600 dark:text-primary-400 hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="space-y-2"
                    >
                      <Skeleton className="h-40 sm:h-44 rounded-xl" />
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-2.5 w-full" />
                      <Skeleton className="h-2.5 w-2/3" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5 max-w-3xl mx-auto">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex gap-3 p-2.5 rounded-xl"
                    >
                      <Skeleton className="w-24 sm:w-32 h-20 sm:h-24 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-1/2" />
                        <Skeleton className="h-2.5 w-full" />
                        <Skeleton className="h-2.5 w-3/4" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 mb-3">
                <FiAlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Failed to Load</h3>
              <p className="text-xs text-neutral-500 mb-3">{error}</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={fetchPosts}
                className="px-4 py-2 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Retry
              </motion.button>
            </motion.div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 mb-3">
                <FiSearch className="h-5 w-5 text-neutral-400" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">No Posts Found</h3>
              <p className="text-xs text-neutral-500 mb-3">
                {searchTerm ? 'Try different search terms' : 'No posts in this category yet'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  Clear Filters
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredPosts.map((post, index) => (
                    <motion.article
                      key={post._id || index}
                      variants={itemVariants}
                      layout
                    >
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="group block bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800 hover:shadow-md hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-300"
                      >
                        <div className="relative overflow-hidden aspect-[16/10] bg-neutral-100 dark:bg-neutral-800">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm text-primary-600 dark:text-primary-400 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400 mb-1.5">
                            <span className="flex items-center gap-1">
                              <FiCalendar className="h-2.5 w-2.5" />
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock className="h-2.5 w-2.5" />
                              {post.readTime}
                            </span>
                          </div>
                          
                          <h2 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1 line-clamp-2 leading-snug">
                            {post.title}
                          </h2>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                              <FiUser className="h-2.5 w-2.5" />
                              {post.author}
                            </span>
                            <span className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium text-[11px]">
                              Read <FiArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5 max-w-3xl mx-auto">
                  {filteredPosts.map((post, index) => (
                    <motion.article
                      key={post._id || index}
                      variants={itemVariants}
                      layout
                    >
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="group flex gap-3 p-2.5 sm:p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:shadow-md hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-300"
                      >
                        <div className="relative w-24 sm:w-32 flex-shrink-0 rounded-lg overflow-hidden aspect-[4/3] bg-neutral-100 dark:bg-neutral-800">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                              {post.category}
                            </span>
                            <span className="text-[10px] text-neutral-400">{post.date}</span>
                            <span className="text-[10px] text-neutral-400 flex items-center gap-0.5">
                              <FiClock className="h-2.5 w-2.5" />
                              {post.readTime}
                            </span>
                          </div>
                          
                          <h2 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-0.5 line-clamp-1">
                            {post.title}
                          </h2>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-1.5 leading-relaxed">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                            <span className="flex items-center gap-0.5">
                              <FiUser className="h-2.5 w-2.5" />
                              {post.author}
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-primary-600 dark:text-primary-400 font-medium ml-auto text-[11px]">
                              Read <FiArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
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

        {/* Footer Count */}
        {!loading && !error && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6"
          >
            <p className="text-[10px] sm:text-[11px] text-neutral-400">
              Showing <span className="font-medium text-neutral-600 dark:text-neutral-300">{filteredPosts.length}</span> of{' '}
              <span className="font-medium text-neutral-600 dark:text-neutral-300">{posts.length}</span> articles
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;