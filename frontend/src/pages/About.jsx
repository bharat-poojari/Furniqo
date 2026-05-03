import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiHeart, FiAward, FiUsers, FiGlobe, FiArrowRight, FiStar,
  FiShield, FiTruck, FiRotateCcw, FiMapPin, FiCoffee,
  FiFeather, FiSmile, FiThumbsUp,
  FiCompass, FiClock, FiGift, FiMessageCircle, FiZap, FiTrendingUp,
  FiChevronLeft, FiChevronRight, FiLinkedin, FiTwitter, FiInstagram
} from 'react-icons/fi';
import Newsletter from '../components/layout/Newsletter';

// Optimized LazyImage component
const LazyImage = React.memo(({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observerRef.current?.disconnect();
          }
        });
      },
      { rootMargin: '100px', threshold: 0.01 }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  const fallbackSrc = 'https://placehold.co/600x400/eee/999?text=Image+Not+Available';

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={hasError ? fallbackSrc : (isLoaded ? src : undefined)}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={() => setHasError(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

// Optimized Counter component
const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 1500;
            const start = Date.now();
            const step = () => {
              const now = Date.now();
              const progress = Math.min((now - start) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(target * ease));
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            observerRef.current?.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [target]);

  return (
    <span ref={elementRef}>
      {count}{suffix}
    </span>
  );
};

const About = () => {
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [hoveredStat, setHoveredStat] = useState(null);
  const testimonialsRef = useRef(null);
  const timelineTimerRef = useRef(null);
  
  // Scroll animations - simplified
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

  // Timeline items
  const timelineItems = useMemo(() => [
    { 
      year: '2009', 
      title: 'The Beginning', 
      event: 'First workshop opens in Brooklyn', 
      icon: FiCoffee, 
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500',
      bgImage: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1200',
      description: 'Started with a dream and a small workshop in the heart of Brooklyn, crafting each piece by hand with love and dedication.'
    },
    { 
      year: '2012', 
      title: 'First Collection', 
      event: 'Launch of signature "Heritage" line', 
      icon: FiStar, 
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      bgImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
      description: 'Our first major collection launched to critical acclaim, establishing Furniqo as a rising star in the furniture industry.'
    },
    { 
      year: '2015', 
      title: 'National Recognition', 
      event: 'Featured in Home & Design Magazine', 
      icon: FiAward, 
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bgImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200',
      description: 'Industry recognition begins as we expand our reach, winning multiple awards for design excellence and craftsmanship.'
    },
    { 
      year: '2018', 
      title: 'Global Expansion', 
      event: 'Online store ships worldwide', 
      icon: FiGlobe, 
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-500',
      bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
      description: 'Reaching customers across 30+ countries globally, bringing beautiful furniture to homes around the world.'
    },
    { 
      year: '2021', 
      title: 'Sustainability Pledge', 
      event: 'Carbon neutral commitment', 
      icon: FiFeather, 
      color: 'teal',
      gradient: 'from-teal-500 to-green-500',
      bgImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200',
      description: 'Eco-friendly transformation with sustainable practices, using recycled materials and carbon-neutral shipping.'
    },
    { 
      year: '2024', 
      title: 'Innovation Hub', 
      event: 'Opened design innovation lab', 
      icon: FiZap, 
      color: 'rose',
      gradient: 'from-rose-500 to-pink-500',
      bgImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200',
      description: 'Future of furniture design with cutting-edge technology, creating smarter, more sustainable furniture solutions.'
    }
  ], []);

  // Auto-rotate timeline every 5 seconds
  useEffect(() => {
    timelineTimerRef.current = setInterval(() => {
      setActiveTimeline((prev) => (prev + 1) % timelineItems.length);
    }, 5000);
    return () => {
      if (timelineTimerRef.current) clearInterval(timelineTimerRef.current);
    };
  }, [timelineItems.length]);

  // Testimonial scroll
  const scrollTestimonials = useCallback((dir) => {
    if (testimonialsRef.current) {
      const amount = dir === 'left' ? -300 : 300;
      testimonialsRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  }, []);

  const getColorClass = useCallback((color) => {
    const map = {
      amber: 'from-amber-500 to-orange-500',
      blue: 'from-blue-500 to-cyan-500',
      purple: 'from-purple-500 to-pink-500',
      emerald: 'from-emerald-500 to-teal-500',
      teal: 'from-teal-500 to-green-500',
      rose: 'from-rose-500 to-pink-500',
      green: 'from-green-500 to-emerald-500',
      indigo: 'from-indigo-500 to-purple-600',
    };
    return map[color] || map.blue;
  }, []);

  // Data - memoized
  const trustItems = useMemo(() => [
    { icon: FiShield, label: 'Quality' },
    { icon: FiTruck, label: 'Free Shipping' },
    { icon: FiRotateCcw, label: '30-Day Returns' },
    { icon: FiThumbsUp, label: '98% Satisfied' },
  ], []);

  const stats = useMemo(() => [
    { icon: FiUsers, target: 75000, label: 'Happy Customers', suffix: '+', color: 'from-blue-500 to-cyan-500', desc: 'Worldwide' },
    { icon: FiAward, target: 17, label: 'Years Experience', suffix: '+', color: 'from-emerald-500 to-teal-500', desc: 'Expertise' },
    { icon: FiGlobe, target: 45, label: 'Countries', suffix: '+', color: 'from-purple-500 to-pink-500', desc: 'Global reach' },
    { icon: FiHeart, target: 100, label: 'Satisfaction', suffix: '%', color: 'from-rose-500 to-orange-500', desc: 'Happy clients' },
  ], []);

  const values = useMemo(() => [
    { icon: FiHeart, title: 'Quality First', desc: 'Premium materials', gradient: 'from-rose-500 to-pink-500' },
    { icon: FiAward, title: 'Design Excellence', desc: 'Timeless aesthetics', gradient: 'from-blue-500 to-cyan-500' },
    { icon: FiUsers, title: 'Customer Focus', desc: 'Seamless support', gradient: 'from-emerald-500 to-teal-500' },
    { icon: FiGlobe, title: 'Sustainability', desc: 'Eco-friendly', gradient: 'from-orange-500 to-amber-500' },
  ], []);

  const milestones = useMemo(() => [
    { year: '2009', title: 'Founded', desc: 'Brooklyn', icon: FiCoffee, color: 'amber' },
    { year: '2014', title: 'First Store', desc: 'Retail', icon: FiMapPin, color: 'blue' },
    { year: '2018', title: 'Global', desc: '30+ countries', icon: FiGlobe, color: 'purple' },
    { year: '2024', title: 'Sustainable', desc: 'Eco-friendly', icon: FiFeather, color: 'green' },
  ], []);

  const testimonials = useMemo(() => [
    { name: 'Sarah Johnson', role: 'Interior Designer', content: 'Furniqo transformed my clients\' homes. Unmatched quality and design!', rating: 5, image: 'https://randomuser.me/api/portraits/women/1.jpg', location: 'New York' },
    { name: 'Michael Chen', role: 'Homeowner', content: 'Best furniture investment I\'ve made. Exceptional service throughout!', rating: 5, image: 'https://randomuser.me/api/portraits/men/2.jpg', location: 'California' },
    { name: 'Emma Davis', role: 'Architect', content: 'Sustainable, beautiful, built to last. Perfect for modern projects.', rating: 5, image: 'https://randomuser.me/api/portraits/women/3.jpg', location: 'Texas' },
    { name: 'David Wilson', role: 'Property Developer', content: 'Consistent quality, stunning designs, incredible value for money.', rating: 5, image: 'https://randomuser.me/api/portraits/men/4.jpg', location: 'Florida' },
    { name: 'Lisa Anderson', role: 'Home Stager', content: 'Pieces photograph beautifully. Buyers absolutely love them!', rating: 5, image: 'https://randomuser.me/api/portraits/women/5.jpg', location: 'Illinois' },
    { name: 'James Taylor', role: 'Furniture Blogger', content: 'Attention to detail and customer obsession sets them apart.', rating: 5, image: 'https://randomuser.me/api/portraits/men/6.jpg', location: 'Washington' },
  ], []);

  const team = useMemo(() => [
    { 
      name: 'Alexandra Mitchell', 
      role: 'Founder & CEO', 
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 
      bio: 'Visionary leader with 20+ years of design industry experience.',
      expertise: 'Strategic Leadership',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
    { 
      name: 'Marcus Chen', 
      role: 'Head of Design', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 
      bio: 'Award-winning designer with a passion for minimalism and sustainable materials.',
      expertise: 'Product Design',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
    { 
      name: 'Emily Rodriguez', 
      role: 'Creative Director', 
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 
      bio: 'Creative force behind our unique collections with 15+ awards in furniture design.',
      expertise: 'Creative Vision',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 overflow-x-hidden">
      
      {/* ========== HERO SECTION ========== */}
      <section className="relative w-[98%] mx-[1%] my-[1%] rounded-2xl overflow-hidden">
        <motion.div 
          className="relative min-h-[450px] md:min-h-[550px] flex items-center"
          style={{ opacity: heroOpacity }}
        >
          <div className="absolute inset-0">
            <LazyImage 
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1920" 
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-900/75 to-neutral-800/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <div className="relative w-full px-4 sm:px-6 md:px-8 py-10 md:py-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 md:px-4 md:py-1.5 mb-4">
                <FiHeart className="h-3 w-3 text-rose-400" />
                <span className="text-xs text-white/90">Since 2009 • 75,000+ Customers</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Crafting Spaces
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  You'll Love
                </span>
              </h1>

              <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto mb-6 px-2">
                Premium furniture designed for modern living. Sustainable, beautiful, and built to last.
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl font-semibold text-white shadow-lg text-sm hover:scale-105 transition-transform duration-150">
                  Shop Now <FiArrowRight className="h-3 w-3" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-white border border-white/20 text-sm hover:scale-105 transition-transform duration-150">
                  Contact Us
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-white/20">
                {trustItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-white/70 text-xs">
                    <item.icon className="h-3 w-3" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="w-[98%] mx-[1%] my-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredStat(idx)}
                onMouseLeave={() => setHoveredStat(null)}
                className="relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-2 md:p-4 text-center shadow-sm border border-neutral-200/50 transition-all duration-150 hover:-translate-y-1"
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <p className="text-sm md:text-xl font-bold text-neutral-900 dark:text-white">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </p>
                <p className="text-[10px] md:text-xs text-neutral-500">{stat.label}</p>
                {hoveredStat === idx && (
                  <div className="absolute -bottom-4 left-0 right-0 bg-primary-600 text-white text-[8px] py-0.5 rounded-b-xl">
                    {stat.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== OUR STORY ========== */}
      <section className="w-[98%] mx-[1%] my-10 md:my-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-primary-600 font-semibold text-xs uppercase tracking-wider">Our Story</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                From Brooklyn to <span className="text-primary-600">Global Brand</span>
              </h2>
              <div className="space-y-3 text-neutral-600 dark:text-neutral-400 text-sm">
                <p>Furniqo was born from a simple belief: everyone deserves a beautiful, comfortable home. What started as a small workshop in Brooklyn has grown into a global furniture brand.</p>
                <p>Every piece is thoughtfully designed and meticulously crafted to last generations.</p>
                <Link to="/products" className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm hover:gap-3 transition-all duration-150">
                  Explore Collection <FiArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3"
            >
              <LazyImage src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" alt="Workshop" className="rounded-xl h-40 md:h-48 object-cover shadow-md" />
              <LazyImage src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400" alt="Craftsmanship" className="rounded-xl h-40 md:h-48 object-cover shadow-md mt-4" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== TIMELINE ========== */}
      <section className="w-[98%] mx-[1%] my-10 md:my-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
              Our Journey
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mt-3" />
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-xl min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTimeline}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-0"
              >
                <LazyImage 
                  src={timelineItems[activeTimeline].bgImage} 
                  alt={timelineItems[activeTimeline].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/85" />
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 p-6 md:p-8">
              <div className="hidden md:flex justify-between items-center mb-8">
                {timelineItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTimeline(idx)}
                    className="relative flex flex-col items-center group transition-all duration-150 hover:scale-105"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 ${
                      activeTimeline === idx 
                        ? `bg-gradient-to-br ${getColorClass(item.color)} text-white shadow-lg` 
                        : 'bg-white/20 backdrop-blur-sm text-white/60 border border-white/30'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs mt-1 font-medium transition-colors duration-150 ${
                      activeTimeline === idx ? 'text-primary-300' : 'text-white/50'
                    }`}>
                      {item.year}
                    </span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTimeline}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="text-center py-8 md:py-10"
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-xl bg-gradient-to-br ${getColorClass(timelineItems[activeTimeline].color)} flex items-center justify-center shadow-lg mb-4`}>
                    {React.createElement(timelineItems[activeTimeline].icon, { className: "h-6 w-6 md:h-8 md:w-8 text-white" })}
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {timelineItems[activeTimeline].title}
                  </h3>
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-300 to-purple-300 bg-clip-text text-transparent mb-2">
                    {timelineItems[activeTimeline].year}
                  </p>
                  <p className="text-sm md:text-base text-white/80 max-w-md mx-auto">
                    {timelineItems[activeTimeline].event}
                  </p>
                  <p className="text-xs text-white/60 max-w-lg mx-auto mt-2">
                    {timelineItems[activeTimeline].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-4">
                {timelineItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTimeline(idx)}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      activeTimeline === idx 
                        ? 'w-6 bg-gradient-to-r from-primary-400 to-purple-400' 
                        : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== VALUES ========== */}
      <section className="w-[98%] mx-[1%] my-10 md:my-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-primary-600 text-xs uppercase tracking-wider">Core Principles</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">Our Values</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-neutral-800 rounded-xl p-4 text-center shadow-sm border border-neutral-200 dark:border-neutral-700 transition-all duration-150 hover:-translate-y-1"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <val.icon className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">{val.title}</h3>
                <p className="text-xs text-neutral-500 mt-1">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MILESTONES ========== */}
      <section className="w-[98%] mx-[1%] my-10 md:my-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-primary-600 text-xs uppercase tracking-wider">Achievements</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">Milestones</h2>
          </div>

          <div className="grid grid-cols-4 gap-3 md:gap-5">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-neutral-800 rounded-xl p-3 text-center shadow-sm border border-neutral-200 dark:border-neutral-700 transition-all duration-150 hover:-translate-y-1"
              >
                <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${getColorClass(m.color)} flex items-center justify-center mb-2`}>
                  <m.icon className="h-5 w-5 text-white" />
                </div>
                <p className="font-bold text-sm md:text-base">{m.title}</p>
                <p className="text-xs text-primary-600 font-semibold">{m.year}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="w-[98%] mx-[1%] my-10 md:my-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-primary-600 text-xs uppercase tracking-wider">Testimonials</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">What Customers Say</h2>
          </div>

          <div className="relative">
            <button 
              onClick={() => scrollTestimonials('left')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-800 rounded-full p-2 shadow-md border hidden md:flex items-center justify-center hover:scale-110 transition-transform duration-150"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            
            <div 
              ref={testimonialsRef} 
              className="flex overflow-x-auto gap-4 pb-4 snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-[280px] snap-start bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-md border border-neutral-200 dark:border-neutral-700 transition-all duration-150 hover:-translate-y-1"
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.rating)].map((_, i) => <FiStar key={i} className="h-3 w-3 text-yellow-400 fill-current" />)}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 italic mb-3">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-semibold text-sm">{t.name}</h4>
                      <p className="text-xs text-primary-500">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => scrollTestimonials('right')} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-800 rounded-full p-2 shadow-md border hidden md:flex items-center justify-center hover:scale-110 transition-transform duration-150"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center mt-3 md:hidden text-xs text-neutral-400">← Swipe →</div>
        </div>
      </section>

      {/* ========== TEAM SECTION ========== */}
      <section className="w-[98%] mx-[1%] my-12 md:my-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary-600 text-xs uppercase tracking-wider">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Meet Our Team</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl mx-auto">
              Passionate experts dedicated to creating exceptional furniture experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden h-72">
                  <LazyImage 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <a href={member.social.linkedin} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-neutral-700 hover:text-primary-600 transition-colors duration-150">
                      <FiLinkedin className="h-4 w-4" />
                    </a>
                    <a href={member.social.twitter} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-neutral-700 hover:text-primary-600 transition-colors duration-150">
                      <FiTwitter className="h-4 w-4" />
                    </a>
                    <a href={member.social.instagram} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-neutral-700 hover:text-primary-600 transition-colors duration-150">
                      <FiInstagram className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-primary-600 font-medium mt-1">{member.role}</p>
                  <div className="mt-3 inline-block px-3 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-full">
                    <span className="text-xs font-medium text-primary-600">{member.expertise}</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="w-[98%] mx-[1%] my-12 md:my-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600" />
            
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '30px 30px',
            }} />

            <div className="relative p-8 md:p-12 text-center">
              <div className="inline-block">
                <FiGift className="h-14 w-14 md:h-20 md:w-20 text-white mx-auto" />
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 mt-4">
                Ready to Transform Your Space?
              </h2>
              
              <p className="text-white/85 text-base md:text-lg mb-6">
                Get 10% off your first order + free shipping on all items
              </p>
              
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-600 rounded-xl font-bold text-base shadow-lg hover:shadow-2xl transition-all duration-150 hover:scale-105"
              >
                Shop Now 
                <FiArrowRight className="h-5 w-5" />
              </Link>

              <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 pt-4 border-t border-white/20">
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <FiShield className="h-3 w-3" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <FiTruck className="h-3 w-3" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <FiHeart className="h-3 w-3" />
                  <span>Love It or Return It</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default About;