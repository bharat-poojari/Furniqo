import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGrid, FiTrendingUp, FiAward, FiStar } from 'react-icons/fi';
import apiWrapper from '../../services/apiWrapper';
import { Skeleton } from '../common/Skeleton';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiWrapper.getCategories();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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

  if (loading) {
    return (
      <section className="py-8 sm:py-12 bg-neutral-50 dark:bg-neutral-900">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <div className="text-center mb-6 sm:mb-8">
            <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mx-auto mb-2 sm:mb-3 rounded-lg" />
            <Skeleton className="h-4 sm:h-5 w-64 sm:w-80 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-full aspect-square rounded-xl mb-2 sm:mb-3" />
                <Skeleton className="h-4 sm:h-5 w-20 sm:w-24 mx-auto rounded-lg" />
                <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16 mx-auto mt-1 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-neutral-50 dark:bg-neutral-900 overflow-x-hidden">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        {/* Header Section - Responsive with smooth animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-full mb-2 sm:mb-3"
          >
            <FiGrid className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-600" />
            <span className="text-[10px] sm:text-xs font-medium text-primary-600 dark:text-primary-400">
              Explore Collections
            </span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-1.5 sm:mb-2 px-3 sm:px-0">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto px-4 sm:px-0">
            Discover premium furniture for every room in your home
          </p>
        </motion.div>

        {/* Categories Grid - Smooth responsive grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5"
        >
          {categories.slice(0, 6).map((category, index) => (
            <motion.div
              key={category._id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="relative"
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group block"
              >
                {/* Image Container - Smooth rounded corners and transitions */}
                <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-white dark:bg-neutral-800 shadow-md hover:shadow-xl transition-all duration-400 will-change-transform">
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Subtle Gradient Overlay - Smooth opacity transition */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  
                  {/* Trending Badge - Smooth transform transition */}
                  <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 z-10 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-1.5 sm:px-2 py-0.5 shadow-md">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <FiStar className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-[8px] sm:text-[10px] font-semibold text-neutral-800">
                          Trending
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shop Now Button - Smooth bottom transition */}
                  <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 right-1.5 sm:right-2 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 flex items-center justify-between shadow-md">
                      <span className="text-white text-[10px] sm:text-xs font-semibold">Shop Now</span>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <FiArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Border Effect - Smooth ring transition */}
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-2 ring-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                </div>

                {/* Category Info - Smooth text transitions */}
                <div className="mt-2 sm:mt-3 text-center px-1">
                  <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 truncate">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                    <FiTrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary-500" />
                    <p className="text-[10px] sm:text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {category.itemCount || 120}+ items
                    </p>
                  </div>
                </div>
              </Link>

              {/* Hover Glow Effect - Smooth blur and opacity */}
              {hoveredCategory === index && (
                <motion.div
                  layoutId="categoryGlow"
                  className="absolute -inset-1.5 sm:-inset-2 bg-primary-500/5 rounded-xl sm:rounded-2xl -z-10 blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* View All Categories Button - Smooth hover animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          className="text-center mt-6 sm:mt-8"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Browse All Categories</span>
            <FiArrowRight className="group-hover:translate-x-0.5 transition-transform duration-300 h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Link>
        </motion.div>

        {/* Stats Section - Smoother on mobile with better touch targets */}
        <div className="mt-[2%] sm:mt-[1%] mb-[2%] sm:mb-[1%] pt-4 sm:pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {[
              { label: "Happy Customers", value: "50K+", icon: FiAward },
              { label: "Premium Products", value: "500+", icon: FiGrid },
              { label: "Years of Excellence", value: "10+", icon: FiStar },
              { label: "5-Star Reviews", value: "4.8", icon: FiTrendingUp },
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                className="text-center group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-0.5 sm:mb-1 md:mb-2 group-hover:bg-primary-500/20 transition-all duration-300 group-hover:scale-110">
                  <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary-600 transition-transform duration-300" />
                </div>
                <motion.p 
                  className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-neutral-900 dark:text-white"
                  initial={{ scale: 1 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;