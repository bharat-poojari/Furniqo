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
      setLoading(true);
      const response = await apiWrapper.getBlogPost(slug);
      
      console.log('Blog Post API Response:', response);
      
      // Axios response: response.data contains the API response
      const apiResponse = response?.data;
      
      let postData = null;
      
      // Your backend format for single post: { success: true, post: {...} }
      if (apiResponse?.success === true && apiResponse?.post) {
        postData = apiResponse.post;
      }
      // Alternative: { success: true, data: {...} }
      else if (apiResponse?.success === true && apiResponse?.data) {
        postData = apiResponse.data;
      }
      // Direct response with post
      else if (apiResponse?.post) {
        postData = apiResponse.post;
      }
      // response itself has the post
      else if (response?.post) {
        postData = response.post;
      }
      // Direct object
      else if (apiResponse && apiResponse._id) {
        postData = apiResponse;
      }
      else if (response && response._id) {
        postData = response;
      }
      
      console.log('Parsed blog post:', postData);
      
      if (postData) {
        setPost(postData);
        fetchRelatedPosts(postData);
      } else {
        setPost(null);
        toast.error('Blog post not found');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setPost(null);
      toast.error('Failed to load blog post');
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
        limit: 3
      });
      
      const apiResponse = response?.data;
      let related = [];
      
      // Your backend format: { success: true, posts: [...] }
      if (apiResponse?.success === true && Array.isArray(apiResponse.posts)) {
        related = apiResponse.posts.filter(p => p._id !== currentPost._id && p.slug !== currentPost.slug);
      }
      // Alternative format
      else if (apiResponse?.posts && Array.isArray(apiResponse.posts)) {
        related = apiResponse.posts.filter(p => p._id !== currentPost._id && p.slug !== currentPost.slug);
      }
      else if (apiResponse?.success === true && Array.isArray(apiResponse.data)) {
        related = apiResponse.data.filter(p => p._id !== currentPost._id && p.slug !== currentPost.slug);
      }
      else if (Array.isArray(apiResponse)) {
        related = apiResponse.filter(p => p._id !== currentPost._id && p.slug !== currentPost.slug);
      }
      else if (response?.data && Array.isArray(response.data)) {
        related = response.data.filter(p => p._id !== currentPost._id && p.slug !== currentPost.slug);
      }
      
      if (related.length < 3) {
        const recentResponse = await apiWrapper.getBlogPosts({ limit: 3 });
        const recentApiResponse = recentResponse?.data;
        let recentPosts = [];
        
        if (recentApiResponse?.success === true && Array.isArray(recentApiResponse.posts)) {
          recentPosts = recentApiResponse.posts;
        } else if (Array.isArray(recentApiResponse)) {
          recentPosts = recentApiResponse;
        }
        
        const filteredRecent = recentPosts.filter(p => p._id !== currentPost._id && p.slug !== currentPost.slug);
        const combined = [...related, ...filteredRecent];
        related = combined.slice(0, 3);
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
    if (!post) return;
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
            src={post.image || 'https://placehold.co/1200x800/eee/999?text=No+Image'} 
            alt={post.title} 
            className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onError={(e) => { e.target.src = 'https://placehold.co/1200x800/eee/999?text=No+Image'; }}
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
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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
              <div className="flex items-center gap-3 sm:gap-4">
                <img 
                  src={post.authorImage || 'https://placehold.co/100x100/eee/999?text=Author'} 
                  alt={post.author} 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-primary-500/20"
                  onError={(e) => { e.target.src = 'https://placehold.co/100x100/eee/999?text=Author'; }}
                />
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white text-base sm:text-lg">
                    {post.author}
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{post.authorRole || 'Contributor'}</p>
                </div>
              </div>
              
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
                            src={related.image || 'https://placehold.co/400x300/eee/999?text=No+Image'} 
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => { e.target.src = 'https://placehold.co/400x300/eee/999?text=No+Image'; }}
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
                              {new Date(related.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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