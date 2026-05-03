import React, { useState, useEffect, useRef } from 'react';
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

const About = () => {
  const [counters, setCounters] = useState({ 
    customers: 0, years: 0, countries: 0, satisfaction: 0
  });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const testimonialsRef = useRef(null);
  const timelineTimerRef = useRef(null);
  
  // Scroll animations
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);

  // Timeline items with background images
  const timelineItems = [
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
    },
    { 
      year: '2026', 
      title: 'AI Integration', 
      event: 'Smart furniture & AI design tools', 
      icon: FiTrendingUp, 
      color: 'indigo',
      gradient: 'from-indigo-500 to-purple-600',
      bgImage: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1200',
      description: 'Revolutionizing furniture design with AI-powered customization and smart furniture technology for modern living.'
    }
  ];

  // Auto-rotate timeline every 4 seconds
  useEffect(() => {
    const startTimer = () => {
      timelineTimerRef.current = setInterval(() => {
        setActiveTimeline((prev) => (prev + 1) % timelineItems.length);
      }, 4000);
    };
    startTimer();
    return () => {
      if (timelineTimerRef.current) clearInterval(timelineTimerRef.current);
    };
  }, [timelineItems.length]);

  // Animate counters
  useEffect(() => {
    const animateCounter = (key, target, duration = 1500) => {
      const start = Date.now();
      const step = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setCounters(prev => ({ ...prev, [key]: Math.floor(target * ease) }));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    animateCounter('customers', 75000);
    animateCounter('years', 17);
    animateCounter('countries', 45);
    animateCounter('satisfaction', 100);
  }, []);

  // Testimonial scroll
  const scrollTestimonials = (dir) => {
    if (testimonialsRef.current) {
      const amount = dir === 'left' ? -340 : 340;
      testimonialsRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Data
  const trustItems = [
    { icon: FiShield, label: 'Quality' },
    { icon: FiTruck, label: 'Free Shipping' },
    { icon: FiRotateCcw, label: '30-Day Returns' },
    { icon: FiThumbsUp, label: '98% Satisfied' },
  ];

  const stats = [
    { icon: FiUsers, key: 'customers', label: 'Happy Customers', suffix: '+', color: 'from-blue-500 to-cyan-500', desc: 'Worldwide' },
    { icon: FiAward, key: 'years', label: 'Years Experience', suffix: '+', color: 'from-emerald-500 to-teal-500', desc: 'Expertise' },
    { icon: FiGlobe, key: 'countries', label: 'Countries', suffix: '+', color: 'from-purple-500 to-pink-500', desc: 'Global reach' },
    { icon: FiHeart, key: 'satisfaction', label: 'Satisfaction', suffix: '%', color: 'from-rose-500 to-orange-500', desc: 'Happy clients' },
  ];

  const values = [
    { icon: FiHeart, title: 'Quality First', desc: 'Premium materials', gradient: 'from-rose-500 to-pink-500' },
    { icon: FiAward, title: 'Design Excellence', desc: 'Timeless aesthetics', gradient: 'from-blue-500 to-cyan-500' },
    { icon: FiUsers, title: 'Customer Focus', desc: 'Seamless support', gradient: 'from-emerald-500 to-teal-500' },
    { icon: FiGlobe, title: 'Sustainability', desc: 'Eco-friendly', gradient: 'from-orange-500 to-amber-500' },
  ];

  const milestones = [
    { year: '2009', title: 'Founded', desc: 'Brooklyn', icon: FiCoffee, color: 'amber' },
    { year: '2014', title: 'First Store', desc: 'Retail', icon: FiMapPin, color: 'blue' },
    { year: '2018', title: 'Global', desc: '30+ countries', icon: FiGlobe, color: 'purple' },
    { year: '2024', title: 'Sustainable', desc: 'Eco-friendly', icon: FiFeather, color: 'green' },
    { year: '2026', title: 'AI Era', desc: 'Smart furniture', icon: FiZap, color: 'indigo' },
  ];

  const team = [
    { 
      name: 'Alexandra Mitchell', 
      role: 'Founder & CEO', 
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 
      bio: 'Visionary leader with 20+ years of design industry experience. Previously led design teams at top furniture brands.',
      expertise: 'Strategic Leadership',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
    { 
      name: 'Marcus Chen', 
      role: 'Head of Design', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 
      bio: 'Award-winning designer with a passion for minimalism and sustainable materials. His work has been featured in Architectural Digest.',
      expertise: 'Product Design',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
    { 
      name: 'Emily Rodriguez', 
      role: 'Creative Director', 
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 
      bio: 'Creative force behind our unique collections with 15+ awards in furniture design. Brings artistic vision to every piece.',
      expertise: 'Creative Vision',
      social: { linkedin: '#', twitter: '#', instagram: '#' }
    },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Interior Designer', content: 'Furniqo transformed my clients\' homes. Unmatched quality and design!', rating: 5, image: 'https://randomuser.me/api/portraits/women/1.jpg', location: 'New York' },
    { name: 'Michael Chen', role: 'Homeowner', content: 'Best furniture investment I\'ve made. Exceptional service throughout!', rating: 5, image: 'https://randomuser.me/api/portraits/men/2.jpg', location: 'California' },
    { name: 'Emma Davis', role: 'Architect', content: 'Sustainable, beautiful, built to last. Perfect for modern projects.', rating: 5, image: 'https://randomuser.me/api/portraits/women/3.jpg', location: 'Texas' },
    { name: 'David Wilson', role: 'Property Developer', content: 'Consistent quality, stunning designs, incredible value for money.', rating: 5, image: 'https://randomuser.me/api/portraits/men/4.jpg', location: 'Florida' },
    { name: 'Lisa Anderson', role: 'Home Stager', content: 'Pieces photograph beautifully. Buyers absolutely love them!', rating: 5, image: 'https://randomuser.me/api/portraits/women/5.jpg', location: 'Illinois' },
    { name: 'James Taylor', role: 'Furniture Blogger', content: 'Attention to detail and customer obsession sets them apart.', rating: 5, image: 'https://randomuser.me/api/portraits/men/6.jpg', location: 'Washington' },
    { name: 'Maria Garcia', role: 'Interior Decorator', content: 'My secret weapon for creating beautiful spaces. Clients love it!', rating: 5, image: 'https://randomuser.me/api/portraits/women/7.jpg', location: 'Arizona' },
  ];

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const getColorClass = (color) => {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 overflow-x-hidden">
      
      {/* ========== HERO SECTION ========== */}
      <section className="relative w-[98%] mx-[1%] my-[1%] rounded-2xl overflow-hidden">
        <motion.div 
          className="relative min-h-[480px] md:min-h-[550px] lg:min-h-[600px] flex items-center"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="absolute inset-0">
            <motion.div 
              className="absolute inset-0"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1920" 
                alt="Hero" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-900/75 to-neutral-800/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <div className="relative w-full px-4 sm:px-6 md:px-8 py-10 md:py-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 md:px-4 md:py-1.5 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <FiHeart className="h-3 w-3 text-rose-400" />
                <span className="text-xs text-white/90">Since 2009 • 75,000+ Customers</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Crafting Spaces
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  You'll Love
                </span>
              </h1>

              <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto mb-6 px-2">
                Premium furniture designed for modern living. Sustainable, beautiful, and built to last.
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl font-semibold text-white shadow-lg text-sm">
                    Shop Now <FiArrowRight className="h-3 w-3" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-white border border-white/20 text-sm">
                    Contact Us <FiArrowRight className="h-3 w-3" />
                  </Link>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-white/20"
              >
                {trustItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-white/70 text-xs">
                    <item.icon className="h-3 w-3" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center">
              <motion.div className="w-1 h-2 bg-white rounded-full mt-2" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="w-[98%] mx-[1%] my-4 md:my-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-4 gap-1.5 md:gap-3"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                onHoverStart={() => setHoveredCard(idx)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-2 md:p-3 text-center shadow-sm border border-neutral-200/50 cursor-pointer"
              >
                <div className={`w-7 h-7 md:w-10 md:h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-1`}>
                  <stat.icon className="h-3.5 w-3.5 md:h-5 md:w-5 text-white" />
                </div>
                <p className="text-sm md:text-lg font-bold text-neutral-900 dark:text-white">
                  {counters[stat.key]}{stat.suffix}
                </p>
                <p className="text-[8px] md:text-[10px] text-neutral-500">{stat.label}</p>
                <AnimatePresence>
                  {hoveredCard === idx && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-5 left-0 right-0 bg-primary-600 text-white text-[8px] py-0.5 rounded-b-xl"
                    >
                      {stat.desc}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== OUR STORY ========== */}
      <section className="w-[98%] mx-[1%] my-8 md:my-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary-600 font-semibold text-xs uppercase tracking-wider">Our Story</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                From Brooklyn to <span className="text-primary-600">Global Brand</span>
              </h2>
              <div className="space-y-3 text-neutral-600 dark:text-neutral-400 text-sm">
                <p>Furniqo was born from a simple belief: everyone deserves a beautiful, comfortable home. What started as a small workshop in Brooklyn has grown into a global furniture brand.</p>
                <p>Every piece is thoughtfully designed and meticulously crafted to last generations.</p>
                <motion.div whileHover={{ x: 5 }} className="inline-block">
                  <Link to="/products" className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm">
                    Explore Collection <FiArrowRight className="h-3 w-3" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3"
            >
              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" alt="Workshop" className="rounded-xl h-40 md:h-48 object-cover shadow-md hover:scale-105 transition duration-500" />
              <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400" alt="Craftsmanship" className="rounded-xl h-40 md:h-48 object-cover shadow-md mt-4 hover:scale-105 transition duration-500" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== TIMELINE ========== */}
      <section className="w-[98%] mx-[1%] my-8 md:my-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
              Our Journey
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mt-3"></div>
          </motion.div>

          <div className="relative rounded-xl overflow-hidden shadow-xl group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTimeline}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-0"
              >
                <img 
                  src={timelineItems[activeTimeline].bgImage} 
                  alt={timelineItems[activeTimeline].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/85" />
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 p-5 md:p-8">
              <div className="hidden md:flex justify-between items-center mb-8">
                {timelineItems.map((item, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setActiveTimeline(idx)}
                    className="relative flex flex-col items-center group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      activeTimeline === idx 
                        ? `bg-gradient-to-br ${getColorClass(item.color)} text-white shadow-lg` 
                        : 'bg-white/20 backdrop-blur-sm text-white/60 border border-white/30'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                      activeTimeline === idx ? 'text-primary-300' : 'text-white/50'
                    }`}>
                      {item.year}
                    </span>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTimeline}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-center py-6 md:py-8"
                >
                  <motion.div 
                    className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-xl bg-gradient-to-br ${getColorClass(timelineItems[activeTimeline].color)} flex items-center justify-center shadow-lg mb-4`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {React.createElement(timelineItems[activeTimeline].icon, { className: "h-6 w-6 md:h-8 md:w-8 text-white" })}
                  </motion.div>
                  
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

              <div className="flex justify-center gap-1.5 mt-4">
                {timelineItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTimeline(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
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
      <section className="w-[98%] mx-[1%] my-8 md:my-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <span className="text-primary-600 text-xs uppercase tracking-wider">Core Principles</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">Our Values</h2>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4"
          >
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                className="relative group bg-white dark:bg-neutral-800 rounded-lg p-2.5 md:p-3 text-center shadow-sm border border-neutral-200 dark:border-neutral-700"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${val.gradient} opacity-0 group-hover:opacity-5 transition duration-300 rounded-lg`} />
                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <val.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary-600" />
                </div>
                <h3 className="font-semibold text-xs md:text-sm">{val.title}</h3>
                <p className="text-[8px] md:text-[10px] text-neutral-500">{val.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== MILESTONES ========== */}
      <section className="w-[98%] mx-[1%] my-8 md:my-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <span className="text-primary-600 text-xs uppercase tracking-wider">Achievements</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">Milestones</h2>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-5 gap-1.5 md:gap-3"
          >
            {milestones.map((m, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                className="bg-white dark:bg-neutral-800 rounded-lg p-2 text-center shadow-sm border"
              >
                <div className={`w-7 h-7 md:w-9 md:h-9 mx-auto rounded-lg bg-gradient-to-br ${getColorClass(m.color)} flex items-center justify-center mb-1`}>
                  <m.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                </div>
                <p className="font-bold text-xs md:text-sm">{m.title}</p>
                <p className="text-[8px] md:text-[10px] text-primary-600 font-semibold">{m.year}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="w-[98%] mx-[1%] my-8 md:my-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <span className="text-primary-600 text-xs uppercase tracking-wider">Testimonials</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">What Customers Say</h2>
          </motion.div>

          <div className="relative">
            <button 
              onClick={() => scrollTestimonials('left')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-800 rounded-full p-2 shadow-md border hidden md:flex items-center justify-center hover:scale-110 transition"
            >
              <FiChevronLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            </button>
            
            <div 
              ref={testimonialsRef} 
              className="flex overflow-x-auto gap-3 pb-3 scrollbar-hide snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="flex-shrink-0 w-[260px] md:w-[280px] snap-start bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-md border"
                >
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(t.rating)].map((_, i) => <FiStar key={i} className="h-3 w-3 text-yellow-400 fill-current" />)}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 italic mb-2 line-clamp-2">"{t.content}"</p>
                  <div className="flex items-center gap-2">
                    <img src={t.image} alt={t.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <h4 className="font-semibold text-xs">{t.name}</h4>
                      <p className="text-[8px] text-primary-500">{t.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button 
              onClick={() => scrollTestimonials('right')} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-neutral-800 rounded-full p-2 shadow-md border hidden md:flex items-center justify-center hover:scale-110 transition"
            >
              <FiChevronRight className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          </div>
          <div className="text-center mt-3 md:hidden text-[10px] text-neutral-400">← Swipe →</div>
        </div>
      </section>

      {/* ========== TEAM - Professional Layout ========== */}
      <section className="w-[98%] mx-[1%] my-12 md:my-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-primary-600 text-xs uppercase tracking-wider">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Meet Our Team</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl mx-auto">
              Passionate experts dedicated to creating exceptional furniture experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Image Container with Overlay */}
                <div className="relative overflow-hidden h-72">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Social Links Overlay */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <a href={member.social.linkedin} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-neutral-700 hover:text-primary-600 transition">
                      <FiLinkedin className="h-4 w-4" />
                    </a>
                    <a href={member.social.twitter} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-neutral-700 hover:text-primary-600 transition">
                      <FiTwitter className="h-4 w-4" />
                    </a>
                    <a href={member.social.instagram} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-neutral-700 hover:text-primary-600 transition">
                      <FiInstagram className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="font-bold text-lg md:text-xl text-neutral-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary-600 font-medium mt-1">{member.role}</p>
                  <div className="mt-2 inline-block px-3 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-full">
                    <span className="text-[10px] font-medium text-primary-600">{member.expertise}</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ANIMATED CTA CARD - Premium Design with Enhanced Effects ========== */}
      <section className="w-[98%] mx-[1%] my-12 md:my-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
          >
            {/* Animated Gradient Background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* Animated Overlay Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '30px 30px',
              }} />
            </div>

            {/* Floating Animated Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white rounded-full"
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: '100%',
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{ 
                    y: '-20%', 
                    opacity: [0, 0.8, 0],
                    x: `calc(${Math.random() * 100}% + ${(Math.random() - 0.5) * 60}px)`
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 4, 
                    repeat: Infinity, 
                    delay: Math.random() * 5,
                    ease: "linear"
                  }}
                />
              ))}
            </div>

            {/* Rotating Gradient Ring Effect */}
            <motion.div 
              className="absolute -inset-20 opacity-30 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-white to-transparent blur-3xl" />
            </motion.div>

            {/* Shine Effect on Hover */}
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              }}
            />

            <div className="relative p-8 md:p-12 text-center z-10">
              {/* Animated Gift Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.15, 0.95, 1]
                }}
                transition={{ duration: 0.8, delay: 0.2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block"
              >
                <div className="relative">
                  <motion.div 
                    className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <FiGift className="h-14 w-14 md:h-20 md:w-20 text-white relative z-10" />
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Ready to Transform Your Space?
              </motion.h2>
              
              <motion.p 
                className="text-white/85 text-base md:text-lg mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Get 10% off your first order + free shipping on all items
              </motion.p>
              
              {/* CTA Button with Pulsing Effect */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative inline-block"
              >
                <motion.div 
                  className="absolute inset-0 bg-white rounded-xl blur-md"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <Link 
                  to="/products" 
                  className="relative inline-flex items-center gap-3 px-8 py-3.5 md:px-12 md:py-4 bg-white text-primary-600 rounded-xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Shop Now 
                  <motion.span
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                  >
                    <FiArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div 
                className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 pt-4 border-t border-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
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
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Newsletter />

      <style jsx>{`
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default About;