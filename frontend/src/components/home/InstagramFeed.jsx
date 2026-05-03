import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
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

// Optimized LazyImage Component with Intersection Observer
const LazyImage = memo(({ src, alt, className, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [srcToLoad, setSrcToLoad] = useState(priority ? src : null);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setSrcToLoad(src);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSrcToLoad(src);
            observerRef.current?.disconnect();
          }
        });
      },
      { rootMargin: '200px', threshold: 0.01 }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [src, priority]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={srcToLoad || undefined}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

// Memoized Instagram Post Card Component
const InstagramPost = memo(({ post, index, isHovered, onHoverStart, onHoverEnd }) => {
  const [isMobileHover, setIsMobileHover] = useState(false);
  const imageRef = useRef(null);

  // Handle touch events for mobile
  const handleTouchStart = useCallback(() => {
    if (window.innerWidth < 768) {
      setIsMobileHover(true);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (window.innerWidth < 768) {
      setIsMobileHover(false);
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    onHoverStart(post.id);
  }, [onHoverStart, post.id]);

  const handleMouseLeave = useCallback(() => {
    onHoverEnd();
  }, [onHoverEnd]);

  const showZoom = isHovered === post.id || isMobileHover;

  // Memoized animation variants
  const variants = useMemo(() => ({
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, delay: index * 0.02 } }
  }), [index]);

  // Format numbers for display
  const formattedLikes = useMemo(() => {
    return post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes;
  }, [post.likes]);

  const formattedComments = useMemo(() => {
    return post.comments >= 1000 ? `${(post.comments / 1000).toFixed(1)}k` : post.comments;
  }, [post.comments]);

  return (
    <motion.a
      href="https://instagram.com/furniqo"
      target="_blank"
      rel="noopener noreferrer"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 cursor-pointer shadow hover:shadow-lg transition-shadow duration-150 will-change-transform"
    >
      <LazyImage
        src={post.image}
        alt={`Instagram post by ${post.user}: ${post.caption}`}
        className={`w-full h-full object-cover transition-transform duration-300 ${
          showZoom ? 'scale-105' : 'scale-100'
        }`}
        priority={index < 2}
      />
      
      {/* Content Overlay - Gradient only at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pt-8 pb-2 sm:pb-3 px-2 sm:px-3">
        <p className="text-white text-[10px] sm:text-xs line-clamp-2 mb-1.5 sm:mb-2 font-medium">
          {post.caption}
        </p>
        
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <FiHeart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span>{formattedLikes}</span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <FiMessageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{formattedComments}</span>
            </div>
          </div>
          
          <FiInstagram className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-90" />
        </div>
      </div>
      
      {/* External Link Indicator */}
      <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-black/50 backdrop-blur-sm rounded-full p-1 sm:p-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-150">
        <FiExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
      </div>
      
      {/* Instagram Logo Badge */}
      <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1 sm:p-1.5 shadow-md">
        <FiInstagram className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
      </div>
    </motion.a>
  );
});

InstagramPost.displayName = 'InstagramPost';

// Memoized Stats Component
const StatsBar = memo(({ stats }) => {
  const statsItems = useMemo(() => [
    { icon: FiCamera, label: 'posts', value: stats.posts, color: 'text-purple-600 dark:text-purple-400' },
    { icon: FiHeart, label: 'followers', value: stats.followers, color: 'text-pink-600 dark:text-pink-400' },
    { icon: FiTrendingUp, label: 'engagement', value: stats.engagement, color: 'text-green-600 dark:text-green-400' },
  ], [stats]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
      {statsItems.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5 sm:gap-2">
          <item.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.color}`} />
          <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="font-bold">{item.value}</span>
            <span className="hidden xs:inline"> {item.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
});

StatsBar.displayName = 'StatsBar';

// Main Instagram Feed Component
const InstagramFeed = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const sectionRef = useRef(null);
  const sectionObserverRef = useRef(null);

  useEffect(() => {
    sectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        // Just observe, no state update needed
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Optional: analytics tracking could go here
          }
        });
      },
      { threshold: 0.05, rootMargin: "100px" }
    );
    
    const element = sectionRef.current;
    if (element) {
      sectionObserverRef.current.observe(element);
    }
    
    return () => {
      if (element && sectionObserverRef.current) {
        sectionObserverRef.current.unobserve(element);
      }
    };
  }, []);

  const handleHoverStart = useCallback((id) => {
    setHoveredId(id);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredId(null);
  }, []);

  const stats = useMemo(() => ({
    posts: 124,
    followers: '45.2K',
    engagement: '4.8%',
  }), []);

  // Header animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-8 sm:py-12 bg-gradient-to-br from-neutral-50 to-purple-50/30 dark:from-neutral-900 dark:to-purple-900/10 relative overflow-hidden"
    >
      {/* Background Decor - Simplified for performance */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-pink-200/10 dark:bg-pink-900/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-200/10 dark:bg-purple-900/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
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

        {/* Stats Bar */}
        <StatsBar stats={stats} />

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          {mockPosts.map((post, index) => (
            <InstagramPost
              key={post.id}
              post={post}
              index={index}
              isHovered={hoveredId}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div 
          className="text-center mt-6 sm:mt-8 lg:mt-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <a
            href="https://instagram.com/furniqo"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-full font-medium text-xs sm:text-sm hover:shadow-lg transition-all duration-150 hover:scale-105 active:scale-95 will-change-transform"
          >
            <FiInstagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Follow @Furniqo</span>
          </a>
          
          <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-3">
            Share your style with <span className="font-medium text-pink-600 dark:text-pink-400">#MyFurniqo</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(InstagramFeed);