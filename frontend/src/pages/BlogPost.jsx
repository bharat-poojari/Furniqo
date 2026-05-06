import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiClock, FiUser, FiTag, FiBookmark, FiHeart, FiEye, 
  FiMessageCircle, FiTrendingUp, FiCalendar, FiMaximize2, FiTarget, 
  FiShield, FiDroplet, FiSearch, FiCheckCircle, FiStar, FiGrid, FiList,
  FiShare2, FiChevronRight, FiArrowUp, FiZoomIn
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

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
        <Skeleton className="h-72 sm:h-96 lg:h-[70vh] w-full" />
        
        <div className="px-[1%] py-6 sm:py-8">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <Skeleton className="h-10 sm:h-14 w-full rounded-lg" />
            <Skeleton className="h-10 sm:h-14 w-3/4 rounded-lg" />
            
            <div className="flex items-center gap-3 pt-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
            
            <div className="space-y-3 mt-8">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full rounded" />
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
        className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center"
      >
        <div className="text-center px-[1%]">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mb-6"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <FiSearch className="h-12 w-12 sm:h-16 sm:w-16 text-neutral-400" />
            </div>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3">Post Not Found</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all font-medium"
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
      {/* Hero Section - Edge to edge */}
      <div className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[75vh] overflow-hidden bg-neutral-900">
        <div className="absolute inset-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
          )}
          <motion.img 
            src={post.image} 
            alt={post.title} 
            className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
        </div>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setActiveImage(post.image)}
          className="absolute top-4 right-[1%] z-20 p-2.5 sm:p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.button>
        
        <div className="absolute bottom-0 left-0 right-0">
          <div className="px-[1%] pb-8 sm:pb-12 lg:pb-16">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Link
                    to={`/blog?category=${post.category}`}
                    className="bg-white/20 backdrop-blur-md text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    {post.category}
                  </Link>
                  <span className="flex items-center gap-1.5 text-white/80 text-xs sm:text-sm">
                    <FiCalendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span>{post.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-white/80 text-xs sm:text-sm">
                    <FiClock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span>{post.readTime}</span>
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight">
                  {post.title}
                </h1>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 1% padding on sides */}
      <div className="px-[1%] py-6 sm:py-8 lg:py-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Author & Stats Bar */}
          <motion.div 
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 mb-8 lg:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link to={`/blog/author/${post.authorId}`} className="flex items-center gap-3 sm:gap-4 group">
                <img 
                  src={post.authorImage} 
                  alt={post.author} 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all"
                />
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white text-base sm:text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {post.author}
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{post.authorRole}</p>
                </div>
              </Link>
              
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                <div className="flex items-center gap-3 sm:gap-4 text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <FiEye className="h-4 w-4" />
                    <span>{post.views?.toLocaleString() || '1.2k'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <FiMessageCircle className="h-4 w-4" />
                    <span>{post.comments || '24'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <motion.button
                    onClick={handleLike}
                    className={`p-2.5 rounded-xl transition-all ${
                      isLiked 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiHeart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    onClick={handleBookmark}
                    className={`p-2.5 rounded-xl transition-all ${
                      isBookmarked 
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiBookmark className={`h-4 w-4 sm:h-5 sm:w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </motion.button>

                  <motion.button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiShare2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div 
            className="prose prose-neutral prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-base sm:text-lg">
              <div className="first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-bold first-letter:text-primary-600 dark:first-letter:text-primary-400 first-letter:float-left first-letter:mr-3 first-letter:leading-tight">
                {post.content || post.excerpt}
              </div>
            </div>
            
            {/* Why This Matters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative mt-10 sm:mt-12"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
              <div className="pl-5 sm:pl-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-5">
                  Why This Matters
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
                  In today's fast-paced world, creating a space that reflects your personality 
                  while maintaining functionality is more important than ever. The choices you 
                  make in furniture and decor have a lasting impact on your daily comfort and 
                  overall well-being.
                </p>
              </div>
            </motion.div>

            {/* Key Considerations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-10 sm:mt-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-5">
                Key Considerations Before Buying
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 mb-6 sm:mb-8">
                Before making any purchase, it's essential to evaluate multiple factors to ensure 
                you're making an investment that will serve you well for years to come.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { icon: FiMaximize2, title: 'Measure Your Space', desc: 'Always measure your room dimensions and doorways before purchasing large furniture pieces.', color: 'from-blue-500 to-cyan-500' },
                  { icon: FiTarget, title: 'Consider Traffic Flow', desc: "Ensure there's enough space for comfortable movement throughout your room.", color: 'from-purple-500 to-pink-500' },
                  { icon: FiShield, title: 'Durability Matters', desc: 'Look for quality materials and construction that can withstand daily use.', color: 'from-emerald-500 to-teal-500' },
                  { icon: FiDroplet, title: 'Color Coordination', desc: 'Choose colors that complement your existing decor and create harmony.', color: 'from-amber-500 to-orange-500' }
                ].map((item, idx) => (
                  <div key={idx} className="group bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} p-2.5 mb-4 shadow-lg`}>
                      <item.icon className="h-full w-full text-white" />
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white text-lg mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Expert Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 sm:mt-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-5">
                Expert Tips for Smart Shopping
              </h2>
              <div className="space-y-4 sm:space-y-5">
                {[
                  'Research thoroughly: Read reviews and compare prices across different retailers.',
                  'Test before buying: Whenever possible, try furniture in person to assess comfort and quality.',
                  'Check return policies: Understand the return and warranty terms before making a purchase.',
                  'Consider multi-functional pieces: Opt for furniture that serves multiple purposes in smaller spaces.'
                ].map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4 group"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <FiCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500 dark:text-primary-400" />
                    </div>
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      <span className="font-semibold text-neutral-900 dark:text-white">{tip.split(':')[0]}:</span> {tip.split(':')[1]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Pro Tip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative my-10 sm:my-12"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-primary-500/10 to-transparent rounded-2xl blur-xl" />
              <div className="relative bg-gradient-to-r from-primary-50 to-neutral-50 dark:from-primary-950/30 dark:to-neutral-900 rounded-2xl p-6 sm:p-8 border border-primary-200 dark:border-primary-800">
                <div className="flex gap-4 sm:gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <FiStar className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white text-xl sm:text-2xl mb-2">Pro Tip</h3>
                    <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
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
              className="mt-10 sm:mt-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-5">
                Conclusion
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Investing in quality furniture is an investment in your comfort, lifestyle, and the beauty 
                of your home. Take your time, do thorough research, and choose pieces that you'll love 
                and appreciate for years to come. Remember that the best spaces evolve over time, so be 
                patient and enjoy the process of curating your perfect environment.
              </p>
            </motion.div>
          </motion.div>

          {/* Tags Section */}
          {post.tags && post.tags.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-2 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-neutral-200 dark:border-neutral-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mr-2">Tags:</span>
              {post.tags.map((tag, idx) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={`/blog?tag=${tag}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm text-neutral-600 dark:text-neutral-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                  >
                    <FiTag className="h-3 w-3" />
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
              className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors group"
            >
              <FiArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to all articles
            </Link>
          </motion.div>

          {/* Author Bio Card */}
          <motion.div 
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 mt-8 sm:mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <img 
                src={post.authorImage} 
                alt={post.author} 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mx-auto mb-4 ring-4 ring-primary-500/20"
              />
              <h3 className="font-bold text-neutral-900 dark:text-white text-xl sm:text-2xl mb-1">{post.author}</h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-3">{post.authorRole}</p>
              <p className="text-neutral-600 dark:text-neutral-400 mb-5 max-w-md mx-auto">
                {post.authorBio || 'Expert in interior design with over 10 years of experience helping people create beautiful, functional spaces.'}
              </p>
              <div className="flex justify-center gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="text-center">
                  <div className="font-bold text-neutral-900 dark:text-white text-lg">{post.authorArticles || '45'}+</div>
                  <div className="text-xs text-neutral-500">Articles</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-neutral-900 dark:text-white text-lg">{post.authorFollowers || '2.5'}k+</div>
                  <div className="text-xs text-neutral-500">Followers</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Posts */}
          <motion.div 
            className="mt-10 sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="font-bold text-neutral-900 dark:text-white text-xl sm:text-2xl mb-5 flex items-center gap-2">
              <FiTrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
              Related Articles
            </h3>
            
            {loadingRelated ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="space-y-3">
                    <Skeleton className="h-48 sm:h-52 rounded-xl" />
                    <Skeleton className="h-5 w-3/4 rounded" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : relatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {relatedPosts.map((related, idx) => (
                  <motion.div
                    key={related._id || related.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="group"
                  >
                    <Link to={`/blog/${related.slug}`} className="block">
                      <div className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="relative overflow-hidden h-48 sm:h-52">
                          <img 
                            src={related.image || '/api/placeholder/400/300'} 
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-neutral-900 dark:text-white text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                            {related.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                              <FiCalendar className="h-3 w-3" />
                              {related.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock className="h-3 w-3" />
                              {related.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-2xl">
                <p className="text-neutral-500 dark:text-neutral-400">No related articles found</p>
              </div>
            )}
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div 
            className="relative mt-12 overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800" />
            <div className="absolute inset-0 opacity-30">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            <div className="relative bg-white/10 backdrop-blur-sm p-8 sm:p-10 text-center">
              <h3 className="text-white text-2xl sm:text-3xl font-bold mb-3">Never Miss an Article</h3>
              <p className="text-primary-100 text-base sm:text-lg mb-6">
                Get the latest design tips and inspiration delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-5 py-3 rounded-xl text-base bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <button className="px-6 py-3 bg-white text-primary-700 rounded-xl text-base font-semibold hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </div>
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
            className="fixed bottom-6 right-[1%] p-3.5 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700 transition-all z-50 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiArrowUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={activeImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button className="absolute top-6 right-[1%] p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
              <FiArrowUp className="h-6 w-6 rotate-45" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

export default BlogPost;