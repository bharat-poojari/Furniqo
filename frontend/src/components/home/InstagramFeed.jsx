import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInstagram, FiExternalLink, FiHeart, FiMessageCircle, FiCamera, FiTrendingUp } from 'react-icons/fi';

const mockPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
    likes: 1234,
    comments: 56,
    caption: 'Modern minimalist living room setup',
    user: '@furniqo',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600',
    likes: 2345,
    comments: 78,
    caption: 'Cozy bedroom inspiration',
    user: '@furniqo',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600',
    likes: 3456,
    comments: 90,
    caption: 'Home office goals',
    user: '@furniqo',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600',
    likes: 4567,
    comments: 112,
    caption: 'Dining room elegance',
    user: '@furniqo',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600',
    likes: 5678,
    comments: 134,
    caption: 'Outdoor living reimagined',
    user: '@furniqo',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=600',
    likes: 6789,
    comments: 156,
    caption: 'Statement pieces that inspire',
    user: '@furniqo',
  },
];

const InstagramFeed = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('instagram-feed');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const stats = {
    posts: 124,
    followers: '45.2K',
    engagement: '4.8%',
  };

  return (
    <section 
      id="instagram-feed"
      className="py-8 sm:py-12 bg-gradient-to-br from-neutral-50 to-purple-50/30 dark:from-neutral-900 dark:to-purple-900/10 relative overflow-hidden"
    >
      {/* Background Decor - Responsive */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-pink-200/10 dark:bg-pink-900/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-200/10 dark:bg-purple-900/5 rounded-full blur-2xl" />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-3 py-1.5 rounded-full mb-3">
            <FiInstagram className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              Social Inspiration
            </span>
          </div>
          
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-display font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
              @Furniqo
            </span>
            <span className="text-neutral-900 dark:text-white hidden sm:inline"> on Instagram</span>
          </h2>
          <h2 className="text-lg sm:hidden text-neutral-900 dark:text-white font-bold mb-2">
            on Instagram
          </h2>
          
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto px-4">
            Get inspired by our community. Tag <span className="font-medium text-pink-600 dark:text-pink-400">#MyFurniqo</span> to be featured!
          </p>
        </motion.div>

        {/* Stats Bar - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FiCamera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
              <span className="font-bold">{stats.posts}</span>
              <span className="hidden xs:inline"> posts</span>
            </span>
          </div>
          <div className="w-px h-3 sm:h-4 bg-neutral-300 dark:bg-neutral-700" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FiHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600 dark:text-pink-400" />
            <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
              <span className="font-bold">{stats.followers}</span>
              <span className="hidden xs:inline"> followers</span>
            </span>
          </div>
          <div className="w-px h-3 sm:h-4 bg-neutral-300 dark:bg-neutral-700" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FiTrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
              <span className="font-bold">{stats.engagement}</span>
              <span className="hidden xs:inline"> engagement</span>
            </span>
          </div>
        </motion.div>

        {/* Instagram Grid - Responsive */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4"
        >
          {mockPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href="https://instagram.com/furniqo"
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
              style={{ willChange: 'transform' }}
            >
              <img
                src={post.image}
                alt={`Instagram post by ${post.user}: ${post.caption}`}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Gradient Overlay - Original design */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
                hoveredId === post.id ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'
              }`}>
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                  <p className="text-white text-[10px] sm:text-xs line-clamp-2 mb-1.5 sm:mb-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    {post.caption}
                  </p>
                  
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <FiHeart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                        <span>{post.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <FiMessageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    
                    <FiInstagram className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80" />
                  </div>
                </div>
              </div>
              
              {/* External Link Indicator */}
              <div className={`absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-black/50 backdrop-blur-sm rounded-full p-1 sm:p-1.5 transition-all duration-300 ${
                hoveredId === post.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75 lg:group-hover:opacity-100 lg:group-hover:scale-100'
              }`}>
                <FiExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
              </div>
              
              {/* Instagram Logo Badge */}
              <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1 sm:p-1.5 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                <FiInstagram className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
              </div>
              
              {/* Animated border on hover */}
              {hoveredId === post.id && (
                <motion.div
                  layoutId="instagram-border"
                  className="absolute inset-0 rounded-lg sm:rounded-xl border-2 border-white/50 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.a>
          ))}
        </motion.div>

        {/* CTA Button - Original design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 sm:mt-8 lg:mt-10"
        >
          <a
            href="https://instagram.com/furniqo"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-full font-medium text-xs sm:text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <FiInstagram className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:rotate-12" />
            <span>Follow @Furniqo</span>
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </a>
          
          <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-3">
            Share your style with <span className="font-medium text-pink-600 dark:text-pink-400">#MyFurniqo</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;