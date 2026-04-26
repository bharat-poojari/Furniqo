import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiHeart, FiAward, FiUsers, FiGlobe, FiArrowRight, FiStar,
  FiCheckCircle, FiCompass, FiFeather, FiTrendingUp, FiShield,
  FiTruck, FiRotateCcw, FiMapPin, FiCalendar, FiBriefcase,
  FiCoffee, FiSmile, FiThumbsUp, FiZap
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Newsletter from '../components/layout/Newsletter';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ customers: 0, years: 0, countries: 0, satisfaction: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    // Animate counters
    const animateCounter = (key, target, duration = 2000) => {
      const startTime = Date.now();
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
        setCounters(prev => ({ ...prev, [key]: value }));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };
    
    animateCounter('customers', 50000);
    animateCounter('years', 15);
    animateCounter('countries', 30);
    animateCounter('satisfaction', 100);
  }, []);

  const stats = [
    { icon: FiUsers, key: 'customers', label: 'Happy Customers', suffix: '+', delay: 0 },
    { icon: FiAward, key: 'years', label: 'Years Experience', suffix: '+', delay: 0.1 },
    { icon: FiGlobe, key: 'countries', label: 'Countries Shipped', suffix: '+', delay: 0.2 },
    { icon: FiHeart, key: 'satisfaction', label: 'Satisfaction', suffix: '%', delay: 0.3 },
  ];

  const values = [
    {
      icon: FiHeart,
      title: 'Quality First',
      description: 'We source only the finest materials and work with skilled artisans to create furniture that lasts generations.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: FiAward,
      title: 'Design Excellence',
      description: 'Our pieces blend timeless aesthetics with modern functionality, curated by expert designers.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FiUsers,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We go above and beyond to ensure a seamless furniture shopping experience.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: FiGlobe,
      title: 'Sustainability',
      description: 'We\'re committed to eco-friendly practices, from sustainable sourcing to recyclable packaging.',
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  const team = [
    {
      name: 'Alexandra Mitchell',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Visionary leader with 20+ years in furniture design',
    },
    {
      name: 'Marcus Chen',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Award-winning designer with a passion for minimalism',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Creative force behind our unique collections',
    },
  ];

  const milestones = [
    { year: 2009, title: 'Founded in Brooklyn', description: 'Started as a small workshop', icon: FiCoffee },
    { year: 2014, title: 'First Store Opening', description: 'Expanded to retail locations', icon: FiMapPin },
    { year: 2018, title: 'Global Launch', description: 'Shipped to 30+ countries', icon: FiGlobe },
    { year: 2024, title: 'Sustainable Future', description: '100% eco-friendly packaging', icon: FiFeather },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Interior Designer',
      content: 'Furniqo has transformed my clients\' homes. The quality and design are unmatched.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Homeowner',
      content: 'The best furniture investment I\'ve made. Customer service was exceptional throughout.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      name: 'Emma Davis',
      role: 'Architect',
      content: 'Sustainable, beautiful, and built to last. Exactly what I look for in furniture.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
      
      {/* Hero Section */}
      <section className="relative w-full my-[1%] overflow-hidden rounded-2xl">
        <motion.div 
          className="relative w-full min-h-[75vh] flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Image with Parallax */}
          <div className="absolute inset-0">
            <motion.div 
              className="absolute inset-0"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1920"
                alt="Modern Living Room"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-900/85 to-neutral-800/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          {/* Animated Floating Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/10"
                initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, scale: 0 }}
                animate={{
                  y: [null, -60, -120],
                  opacity: [0, 0.3, 0],
                  scale: [0, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 5 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              >
                {i % 3 === 0 ? <FiHeart className="h-8 w-8" /> : <FiStar className="h-6 w-6" />}
              </motion.div>
            ))}
          </div>

          <div className="relative w-full px-[2%] py-16 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 100 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full mb-6"
              />
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight text-white">
                Crafting Spaces
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  You'll Love Coming Home To
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl">
                Since 2009, Furniqo has been dedicated to bringing beautiful, 
                high-quality furniture to homes around the world.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 flex-wrap"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                  >
                    Shop Now
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-sm hover:bg-white/25 rounded-xl font-semibold transition-all duration-200 border border-white/20"
                  >
                    Contact Us
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-6 mt-10 pt-6 border-t border-white/20"
              >
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <FiShield className="h-4 w-4" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <FiTruck className="h-4 w-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <FiRotateCcw className="h-4 w-4" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <FiThumbsUp className="h-4 w-4" />
                  <span>98% Satisfaction</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
              <motion.div 
                className="w-1 h-2 bg-white rounded-full mt-2"
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all border border-neutral-200 dark:border-neutral-700 group cursor-pointer"
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <stat.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </motion.div>
                <p className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-1">
                  {counters[stat.key]}{stat.suffix}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mt-2 mb-6">
                From Brooklyn Workshop to Global Brand
              </h2>
              <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p>
                  Furniqo was born from a simple belief: everyone deserves a beautiful, 
                  comfortable home. What started as a small workshop in Brooklyn has grown 
                  into a global furniture brand serving tens of thousands of customers.
                </p>
                <p>
                  Our founders, Alexandra Mitchell and Marcus Chen, combined their expertise 
                  in design and craftsmanship to create furniture that marries form and function. 
                  Every piece in our collection is thoughtfully designed and meticulously crafted.
                </p>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="inline-block"
                >
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mt-4 group"
                  >
                    Explore Our Collection
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"
                  alt="Workshop"
                  className="rounded-2xl object-cover h-64 w-full hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3, delay: 0.1 }} className="overflow-hidden rounded-2xl shadow-xl mt-8">
                <img
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600"
                  alt="Craftsmanship"
                  className="rounded-2xl object-cover h-64 w-full hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">Our Journey</span>
              <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mt-2">Key Milestones</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">The path that shaped our story</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative text-center bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold mx-auto mb-4 shadow-lg">
                    <milestone.icon className="h-7 w-7" />
                  </div>
                  <h4 className="font-bold text-neutral-900 dark:text-white mb-1">
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-2">{milestone.year}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {milestone.description}
                  </p>
                  {index < milestones.length - 1 && (
                    <div className="hidden md:block absolute top-1/3 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-primary-400 dark:from-primary-700 dark:to-primary-600" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">Core Principles</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mt-2 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                <div className="relative bg-white dark:bg-neutral-800 rounded-2xl p-6 text-center shadow-lg border border-neutral-200 dark:border-neutral-700">
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 5 }}
                  >
                    <value.icon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mt-2 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Real stories from real people who love their Furniqo furniture
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700"
              >
                <div className="text-4xl text-primary-400 mb-4">"</div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-4">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-xs text-neutral-500">{testimonial.role}</p>
                  </div>
                  <div className="flex ml-auto">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">The People Behind</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mt-2 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Passionate people creating furniture you'll love
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <div className="relative inline-block">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 ring-4 ring-primary-200 dark:ring-primary-800 group-hover:ring-primary-400 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white dark:border-neutral-900" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white text-lg">
                  {member.name}
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                  {member.role}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 max-w-xs mx-auto">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '30px 30px',
              }} />
            </div>
            <div className="relative p-10 text-center">
              <FiSmile className="h-12 w-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ready to Transform Your Space?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto mb-6">
                Explore our collection and find the perfect pieces for your home
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-600 hover:bg-neutral-100 rounded-xl font-semibold transition-all shadow-lg"
                >
                  Shop Now
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default About;