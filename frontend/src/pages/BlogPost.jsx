import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiClock, FiUser, FiTag, FiBookmark, FiHeart, FiEye, 
  FiMessageCircle, FiTrendingUp, FiCalendar, FiMaximize2, FiTarget, 
  FiShield, FiDroplet, FiSearch, FiCheckCircle, FiStar, FiGrid, FiList,
  FiShare2, FiChevronRight, FiArrowUp
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { Skeleton } from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    fetchPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await apiWrapper.getBlogPost(slug);
      
      let postData = null;
      if (response?.data?.success && response?.data?.data) {
        postData = response.data.data;
      } else if (response?.success && response?.data) {
        postData = response.data;
      } else if (response?.data && !response?.success) {
        postData = response.data;
      }
      
      if (postData) {
        setPost(postData);
        fetchRelatedPosts(postData);
      } else {
        setPost(null);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (currentPost) => {
    try {
      setLoadingRelated(true);
      const category = currentPost.category;
      
      const response = await apiWrapper.getBlogPosts({ 
        category: category, 
        limit: 3,
        exclude: currentPost._id || currentPost.slug 
      });
      
      let related = response.data.data || [];
      
      if (related.length < 3) {
        const recentResponse = await apiWrapper.getBlogPosts({ 
          limit: 3 - related.length,
          exclude: currentPost._id || currentPost.slug 
        });
        related = [...related, ...(recentResponse.data.data || [])];
      }
      
      setRelatedPosts(related.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related posts:', error);
      setRelatedPosts([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed like' : 'Thanks for your like!');
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Article shared successfully!');
      } catch (err) {
        toast.error('Unable to share');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <div className="w-full px-[1%] py-[1%]">
          {/* Hero Skeleton */}
          <Skeleton className="h-64 sm:h-96 lg:h-[60vh] rounded-2xl mb-6 sm:mb-8" />
          
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 sm:h-12 w-full" />
              <Skeleton className="h-8 sm:h-12 w-3/4" />
              
              {/* Author Skeleton */}
              <div className="flex items-center gap-3 pt-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-4 mt-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-[1%]"
      >
        <div className="text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mb-6"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <FiSearch className="h-12 w-12 sm:h-16 sm:w-16 text-neutral-400" />
            </div>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3">Post Not Found</h2>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all text-sm sm:text-base"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <article className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section - Responsive */}
      <div className="relative w-full h-64 sm:h-96 lg:h-[60vh] overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 via-30% to-transparent" />
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0 px-[1%] pb-4 sm:pb-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="px-3 sm:px-4"
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                <span className="bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-white/80 text-xs sm:text-sm">
                  <FiCalendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{post.date}</span>
                </span>
                <span className="flex items-center gap-1 text-white/80 text-xs sm:text-sm">
                  <FiClock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{post.readTime}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-4 leading-tight">
                {post.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-[1%] py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          
          {/* Author & Stats Bar - Responsive */}
          <motion.div 
            className="bg-neutral-50 dark:bg-neutral-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={post.authorImage} 
                  alt={post.author} 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-4 ring-white dark:ring-neutral-800"
                />
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white text-base sm:text-lg">{post.author}</p>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{post.authorRole}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                    <FiEye className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">{post.views || '1.2k'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                    <FiMessageCircle className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">{post.comments || '24'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={handleLike}
                    className={`p-2 rounded-lg transition-all ${
                      isLiked 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiHeart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    onClick={handleBookmark}
                    className={`p-2 rounded-lg transition-all ${
                      isBookmarked 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiBookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </motion.button>

                  <motion.button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiShare2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Article Content - Responsive Typography */}
          <motion.div 
            className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm sm:text-base lg:text-lg">
              {post.content || post.excerpt}
            </div>
            
            {/* Why This Matters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
                Why This Matters
              </h2>
              <p className="text-sm sm:text-base">
                In today's fast-paced world, creating a space that reflects your personality 
                while maintaining functionality is more important than ever. The choices you 
                make in furniture and decor have a lasting impact on your daily comfort and 
                overall well-being.
              </p>
            </motion.div>

            {/* Key Considerations - Grid optimized for mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
                Key Considerations Before Buying
              </h2>
              <p className="text-sm sm:text-base mb-4">
                Before making any purchase, it's essential to evaluate multiple factors to ensure 
                you're making an investment that will serve you well for years to come.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-6 sm:my-8">
                <div className="bg-neutral-50 dark:bg-neutral-900 p-4 sm:p-5 rounded-xl">
                  <FiMaximize2 className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600 dark:text-primary-400 mb-2" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 text-sm sm:text-base">Measure Your Space</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    Always measure your room dimensions and doorways before purchasing large furniture pieces.
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 p-4 sm:p-5 rounded-xl">
                  <FiTarget className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600 dark:text-primary-400 mb-2" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 text-sm sm:text-base">Consider Traffic Flow</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    Ensure there's enough space for comfortable movement throughout your room.
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 p-4 sm:p-5 rounded-xl">
                  <FiShield className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600 dark:text-primary-400 mb-2" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 text-sm sm:text-base">Durability Matters</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    Look for quality materials and construction that can withstand daily use.
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 p-4 sm:p-5 rounded-xl">
                  <FiDroplet className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600 dark:text-primary-400 mb-2" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 text-sm sm:text-base">Color Coordination</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    Choose colors that complement your existing decor and create harmony.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Expert Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
                Expert Tips for Smart Shopping
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <FiCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-neutral-900 dark:text-white">Research thoroughly:</strong> Read reviews and compare prices across different retailers.</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <FiCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-neutral-900 dark:text-white">Test before buying:</strong> Whenever possible, try furniture in person to assess comfort and quality.</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <FiCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-neutral-900 dark:text-white">Check return policies:</strong> Understand the return and warranty terms before making a purchase.</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <FiCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-neutral-900 dark:text-white">Consider multi-functional pieces:</strong> Opt for furniture that serves multiple purposes in smaller spaces.</span>
                </li>
              </ul>
            </motion.div>

            {/* Pro Tip Card - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-primary-50 to-neutral-50 dark:from-primary-950/20 dark:to-neutral-900 p-5 sm:p-6 rounded-xl sm:rounded-2xl my-6 sm:my-8 border border-primary-100 dark:border-primary-900">
                <div className="flex gap-3 sm:gap-4">
                  <FiStar className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-1 text-base sm:text-lg">Pro Tip</h3>
                    <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300">
                      Start with neutral, timeless pieces for major furniture investments, then add personality 
                      through accessories, accent pieces, and artwork that can be easily updated over time.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Conclusion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
                Conclusion
              </h2>
              <p className="text-sm sm:text-base">
                Investing in quality furniture is an investment in your comfort, lifestyle, and the beauty 
                of your home. Take your time, do thorough research, and choose pieces that you'll love 
                and appreciate for years to come. Remember that the best spaces evolve over time, so be 
                patient and enjoy the process of curating your perfect environment.
              </p>
            </motion.div>
          </motion.div>

          {/* Tags Section - Responsive */}
          {post.tags && post.tags.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-1.5 sm:gap-2 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-neutral-200 dark:border-neutral-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 mr-1">Tags:</span>
              {post.tags.map((tag, idx) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Link
                    to={`/blog?tag=${tag}`}
                    className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs text-neutral-600 dark:text-neutral-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all"
                  >
                    <FiTag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    {tag}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Back Link */}
          <motion.div 
            className="mt-6 sm:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              <FiArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Back to all articles
            </Link>
          </motion.div>

          {/* Author Bio Card - Mobile Optimized */}
          <motion.div 
            className="bg-neutral-50 dark:bg-neutral-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 mt-6 sm:mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <img 
                src={post.authorImage} 
                alt={post.author} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-3 sm:mb-4 ring-4 ring-white dark:ring-neutral-800"
              />
              <h3 className="font-bold text-neutral-900 dark:text-white text-lg sm:text-xl mb-1">{post.author}</h3>
              <p className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 mb-2 sm:mb-3">{post.authorRole}</p>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-3 sm:mb-4">
                {post.authorBio || 'Expert in interior design with over 10 years of experience helping people create beautiful, functional spaces.'}
              </p>
              <div className="flex justify-center gap-4 sm:gap-6 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <div className="text-center">
                  <div className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base">{post.authorArticles || '45'}+</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500">Articles</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base">{post.authorFollowers || '2.5'}k+</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500">Followers</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Posts - Responsive Grid */}
          <motion.div 
            className="mt-8 sm:mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="font-bold text-neutral-900 dark:text-white text-lg sm:text-xl mb-4 flex items-center gap-2">
              <FiTrendingUp className="h-5 w-5" />
              Related Articles
            </h3>
            
            {loadingRelated ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="flex gap-3">
                    <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : relatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {relatedPosts.map((related, idx) => (
                  <motion.div
                    key={related._id || related.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="group"
                  >
                    <Link to={`/blog/${related.slug}`} className="block">
                      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl overflow-hidden hover:shadow-md transition-all">
                        <img 
                          src={related.image || '/api/placeholder/400/300'} 
                          alt={related.title}
                          className="w-full h-32 sm:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-3">
                          <h4 className="font-medium text-neutral-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-1">
                            {related.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <FiCalendar className="h-3 w-3" />
                            <span>{related.date}</span>
                            <FiClock className="h-3 w-3 ml-1" />
                            <span>{related.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No related articles found
                </p>
              </div>
            )}
          </motion.div>

          {/* Newsletter Signup - Optional */}
          <motion.div 
            className="mt-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-white text-lg sm:text-xl font-bold mb-2">Never Miss an Article</h3>
            <p className="text-primary-100 text-sm sm:text-base mb-4">
              Get the latest design tips and inspiration delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-2 rounded-lg text-sm bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button className="px-5 py-2 bg-white text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </article>
  );
};

export default BlogPost;