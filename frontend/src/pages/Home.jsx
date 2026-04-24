import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import Trending from '../components/home/Trending';
import Features from '../components/home/Features';
import Testimonials from '../components/home/Testimonials';
import PromoBanner from '../components/home/PromoBanner';
import InstagramFeed from '../components/home/InstagramFeed';
import Newsletter from '../components/layout/Newsletter';
import apiWrapper from '../services/apiWrapper';

const Home = () => {
  useEffect(() => {
    // Track page view
    apiWrapper.trackPageView('home').catch(() => {});
    
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <Categories />
      <Trending />
      <PromoBanner />
      <Features />
      <Testimonials />
      <InstagramFeed />
      <Newsletter />
    </motion.div>
  );
};

export default Home;