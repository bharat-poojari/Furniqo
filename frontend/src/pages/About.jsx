import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiAward, 
  FiUsers, 
  FiGlobe,
  FiArrowRight,
  FiStar,
  FiCheckCircle,
  FiCompass,
  FiFeather,
  FiTrendingUp,
  FiShield,
  FiTruck,
  FiRotateCcw,
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Newsletter from '../components/layout/Newsletter';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: FiUsers, value: '50,000+', label: 'Happy Customers', delay: 0 },
    { icon: FiAward, value: '15+', label: 'Years Experience', delay: 0.1 },
    { icon: FiGlobe, value: '30+', label: 'Countries Shipped', delay: 0.2 },
    { icon: FiHeart, value: '100%', label: 'Satisfaction', delay: 0.3 },
  ];

  const values = [
    {
      icon: FiHeart,
      title: 'Quality First',
      description: 'We source only the finest materials and work with skilled artisans to create furniture that lasts generations.',
    },
    {
      icon: FiAward,
      title: 'Design Excellence',
      description: 'Our pieces blend timeless aesthetics with modern functionality, curated by expert designers.',
    },
    {
      icon: FiUsers,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We go above and beyond to ensure a seamless furniture shopping experience.',
    },
    {
      icon: FiGlobe,
      title: 'Sustainability',
      description: 'We\'re committed to eco-friendly practices, from sustainable sourcing to recyclable packaging.',
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
    { year: 2009, title: 'Founded in Brooklyn', description: 'Started as a small workshop' },
    { year: 2014, title: 'First Store Opening', description: 'Expanded to retail locations' },
    { year: 2018, title: 'Global Launch', description: 'Shipped to 30+ countries' },
    { year: 2024, title: 'Sustainable Future', description: '100% eco-friendly packaging' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-white py-24 lg:py-32 overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1920"
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent" />
        
        <div className="w-full px-[1%] sm:px-[1.5%] relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="h-1 bg-primary-500 mb-6"
            />
            <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Crafting Spaces
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                You'll Love Coming Home To
              </span>
            </h1>
            <p className="text-xl text-neutral-300 leading-relaxed mb-8">
              Since 2009, Furniqo has been dedicated to bringing beautiful, 
              high-quality furniture to homes around the world.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold transition-all duration-200"
              >
                Shop Now
                <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl font-semibold transition-all duration-200"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-neutral-950 relative">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={statsVariants}
                className="text-center group cursor-pointer"
              >
                <motion.div 
                  className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <stat.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </motion.div>
                <p className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 lg:py-24 bg-neutral-50 dark:bg-neutral-900">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-6">
                Our Story
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
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"
                alt="Workshop"
                className="rounded-2xl shadow-lg object-cover h-64 w-full"
              />
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600"
                alt="Craftsmanship"
                className="rounded-2xl shadow-lg mt-8 object-cover h-64 w-full"
              />
            </motion.div>
          </div>

          {/* Milestones Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-2xl font-semibold text-center text-neutral-900 dark:text-white mb-8">
              Our Journey
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                    {milestone.year.toString().slice(-2)}
                  </div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {milestone.title}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {milestone.description}
                  </p>
                  {index < milestones.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-primary-200 dark:bg-primary-900/30" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-neutral-950">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-4">
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
                whileHover={{ y: -5 }}
                className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 text-center group cursor-pointer"
              >
                <motion.div 
                  className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Passionate people creating furniture you'll love
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 ring-4 ring-primary-100 dark:ring-primary-900/50 group-hover:ring-primary-300 transition-all duration-300"
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

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
};

export default About;