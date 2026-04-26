import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import Trending from '../components/home/Trending';
import Features from '../components/home/Features';
import Testimonials from '../components/home/Testimonials';
import PromoBanner from '../components/home/PromoBanner';
import InstagramFeed from '../components/home/InstagramFeed';
import Newsletter from '../components/layout/Newsletter';
import apiWrapper from '../services/apiWrapper';

const HEADER_HEIGHT = 64; // Adjust this to match your header height (h-14 = 56px, h-16 = 64px)

const Home = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const containerRef = useRef(null);
  const sectionRefs = useRef({});
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Track page view
    apiWrapper.trackPageView('home').catch(() => {});
    
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sections = [
    { component: Hero, id: 'hero', label: 'Home' },
    { component: Categories, id: 'categories', label: 'Categories' },
    { component: Trending, id: 'trending', label: 'Trending' },
    { component: PromoBanner, id: 'promo', label: 'Offers' },
    { component: Features, id: 'features', label: 'Features' },
    { component: Testimonials, id: 'testimonials', label: 'Reviews' },
    { component: InstagramFeed, id: 'instagram', label: 'Gallery' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - HEADER_HEIGHT - 16; // 16px extra padding

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + HEADER_HEIGHT + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Sections */}
      {sections.map(({ component: Component, id }) => (
        <motion.div
          key={id}
          id={id}
          ref={(el) => { if (el) sectionRefs.current[id] = el; }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <Component />
        </motion.div>
      ))}
      
      <motion.div
        id="newsletter"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <Newsletter />
      </motion.div>

      {/* Desktop Side Navigation - Only visible on hover near right edge */}
      <div className="hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 z-40 group">
        {/* Trigger area */}
        <div className="w-8 h-80 -ml-4" />
        
        {/* Dots - visible on hover */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          {sections.map(({ id, label }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection(id)}
              className="relative flex items-center gap-2 group/dot"
              aria-label={`Scroll to ${label}`}
            >
              <span className="absolute right-6 px-2 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] rounded-md whitespace-nowrap opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none">
                {label}
              </span>
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === id 
                  ? 'bg-primary-500 scale-125 shadow-sm shadow-primary-500/50' 
                  : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-primary-400 dark:hover:bg-primary-500'
              }`} />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;