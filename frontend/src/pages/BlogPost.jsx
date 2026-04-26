import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, FiClock, FiUser, FiTag, FiBookmark, FiHeart, FiEye, 
  FiMessageCircle, FiTrendingUp, FiCalendar, FiMaximize2, FiTarget, 
  FiShield, FiDroplet, FiSearch, FiCheckCircle, FiStar, FiGrid, FiList
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import { Skeleton } from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    fetchPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getBlogPost(slug);
      const postData = response.data.data;
      setPost(postData);
      
      // Fetch related posts based on category or tags
      if (postData) {
        await fetchRelatedPosts(postData);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (currentPost) => {
    try {
      setLoadingRelated(true);
      // Use category to find related posts
      const category = currentPost.category;
      const tags = currentPost.tags || [];
      
      // Fetch posts from same category
      const response = await apiWrapper.getBlogPosts({ 
        category: category, 
        limit: 3,
        exclude: currentPost._id || currentPost.slug 
      });
      
      let related = response.data.data || [];
      
      // If not enough posts from same category, fetch recent posts
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
      // Fallback to empty array
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <div className="w-full px-[1%] py-[1%]">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-[60vh] rounded-2xl mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/3 mb-8" />
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-96 rounded-2xl mb-6" />
                <Skeleton className="h-64 rounded-2xl" />
              </div>
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
            <FiSearch className="h-24 w-24 text-neutral-300 dark:text-neutral-700" />
          </motion.div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Post Not Found</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-3 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all"
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
      {/* Hero Section - Full Width */}
      <div className="relative w-full h-[50vh] lg:h-[60vh] overflow-hidden">
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
            onError={(e) => {
              e.target.src = '/api/placeholder/1200/800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0 px-[1%] py-[1%]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-white/80 text-sm">
                  <FiCalendar className="h-4 w-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5 text-white/80 text-sm">
                  <FiClock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Background with Centered Content */}
      <div className="w-full px-[1%] py-[1%]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Article Column */}
            <div className="lg:col-span-2">
              {/* Author & Stats Bar */}
              <motion.div 
                className="flex items-center justify-between flex-wrap gap-4 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-2xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={post.authorImage} 
                    alt={post.author} 
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-white dark:ring-neutral-800"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/100/100';
                    }}
                  />
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white text-lg">{post.author}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{post.authorRole}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                    <FiEye className="h-5 w-5" />
                    <span className="text-sm font-medium">{post.views || '1.2k'} views</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                    <FiMessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{post.comments || '24'} comments</span>
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
                      <FiHeart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
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
                      <FiBookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Breadcrumb */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <Breadcrumb items={[
                  { label: 'Blog', href: '/blog' },
                  { label: post.title },
                ]} />
              </motion.div>

              {/* Article Content */}
              <motion.div 
                className="prose prose-lg dark:prose-invert max-w-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg">
                  {post.content || post.excerpt}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
                    Why This Matters
                  </h2>
                  <p>
                    In today's fast-paced world, creating a space that reflects your personality 
                    while maintaining functionality is more important than ever. The choices you 
                    make in furniture and decor have a lasting impact on your daily comfort and 
                    overall well-being.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
                    Key Considerations Before Buying
                  </h2>
                  <p>
                    Before making any purchase, it's essential to evaluate multiple factors to ensure 
                    you're making an investment that will serve you well for years to come.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 my-8">
                    <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl">
                      <FiMaximize2 className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-3" />
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Measure Your Space</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Always measure your room dimensions and doorways before purchasing large furniture pieces.
                      </p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl">
                      <FiTarget className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-3" />
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Consider Traffic Flow</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Ensure there's enough space for comfortable movement throughout your room.
                      </p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl">
                      <FiShield className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-3" />
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Durability Matters</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Look for quality materials and construction that can withstand daily use.
                      </p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl">
                      <FiDroplet className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-3" />
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Color Coordination</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Choose colors that complement your existing decor and create harmony.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
                    Expert Tips for Smart Shopping
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <FiCheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-neutral-900 dark:text-white">Research thoroughly:</strong> Read reviews and compare prices across different retailers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-neutral-900 dark:text-white">Test before buying:</strong> Whenever possible, try furniture in person to assess comfort and quality.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-neutral-900 dark:text-white">Check return policies:</strong> Understand the return and warranty terms before making a purchase.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-neutral-900 dark:text-white">Consider multi-functional pieces:</strong> Opt for furniture that serves multiple purposes in smaller spaces.</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="bg-gradient-to-r from-primary-50 to-neutral-50 dark:from-primary-950/20 dark:to-neutral-900 p-8 rounded-2xl my-8 border border-primary-100 dark:border-primary-900">
                    <div className="flex items-start gap-4">
                      <FiStar className="h-8 w-8 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white mb-2">Pro Tip</h3>
                        <p className="text-neutral-700 dark:text-neutral-300">
                          Start with neutral, timeless pieces for major furniture investments, then add personality 
                          through accessories, accent pieces, and artwork that can be easily updated over time.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
                    Conclusion
                  </h2>
                  <p>
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
                  className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-neutral-200 dark:border-neutral-800"
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
                      whileHover={{ scale: 1.05 }}
                    >
                      <Link
                        to={`/blog?tag=${tag}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm text-neutral-600 dark:text-neutral-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-all"
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
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Back to all articles
                </Link>
              </motion.div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="lg:col-span-1">
              {/* Author Bio Card */}
              <motion.div 
                className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 mb-8 sticky top-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-center">
                  <img 
                    src={post.authorImage} 
                    alt={post.author} 
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-white dark:ring-neutral-800"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/100/100';
                    }}
                  />
                  <h3 className="font-bold text-neutral-900 dark:text-white text-lg mb-1">{post.author}</h3>
                  <p className="text-sm text-primary-600 dark:text-primary-400 mb-3">{post.authorRole}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {post.authorBio || 'Expert in interior design with over 10 years of experience helping people create beautiful, functional spaces.'}
                  </p>
                  <div className="flex justify-center gap-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="text-center">
                      <div className="font-bold text-neutral-900 dark:text-white">{post.authorArticles || '45'}+</div>
                      <div className="text-xs text-neutral-500">Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-neutral-900 dark:text-white">{post.authorFollowers || '2.5'}k+</div>
                      <div className="text-xs text-neutral-500">Followers</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Table of Contents */}
              <motion.div 
                className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 mb-8 sticky top-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiGrid className="h-5 w-5" />
                  Table of Contents
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <FiList className="h-3 w-3" />
                      Why This Matters
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <FiList className="h-3 w-3" />
                      Key Considerations Before Buying
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <FiList className="h-3 w-3" />
                      Expert Tips for Smart Shopping
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <FiList className="h-3 w-3" />
                      Conclusion
                    </a>
                  </li>
                </ul>
              </motion.div>

              {/* Related Posts - Real Data */}
              <motion.div 
                className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 sticky top-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiTrendingUp className="h-5 w-5" />
                  Related Articles
                </h3>
                
                {loadingRelated ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="flex gap-3">
                        <Skeleton className="w-20 h-20 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : relatedPosts.length > 0 ? (
                  <div className="space-y-4">
                    {relatedPosts.map((related, idx) => (
                      <motion.div
                        key={related._id || related.id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                        className="group cursor-pointer"
                      >
                        <Link to={`/blog/${related.slug}`} className="flex gap-3">
                          <img 
                            src={related.image || '/api/placeholder/400/300'} 
                            alt={related.title}
                            className="w-20 h-20 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/400/300';
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-neutral-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                              {related.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                              <FiCalendar className="h-3 w-3" />
                              <span>{related.date}</span>
                              <span>•</span>
                              <FiClock className="h-3 w-3" />
                              <span>{related.readTime}</span>
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
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;