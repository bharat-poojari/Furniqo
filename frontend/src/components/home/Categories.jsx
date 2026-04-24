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
      <section className="py-12 bg-neutral-50 dark:bg-neutral-900">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-64 mx-auto mb-3 rounded-lg" />
            <Skeleton className="h-5 w-80 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-full aspect-square rounded-xl mb-3" />
                <Skeleton className="h-5 w-24 mx-auto rounded-lg" />
                <Skeleton className="h-3 w-16 mx-auto mt-1 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-neutral-50 dark:bg-neutral-900">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-full mb-3"
          >
            <FiGrid className="h-3.5 w-3.5 text-primary-600" />
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              Explore Collections
            </span>
          </motion.div>

          <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-2">
            Shop by Category
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Discover premium furniture for every room in your home
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5"
        >
          {categories.slice(0, 6).map((category, index) => (
            <motion.div
              key={category._id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="relative"
            >
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group block"
              >
                {/* Image Container */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-neutral-800 shadow-md hover:shadow-xl transition-all duration-400">
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  
                  {/* Trending Badge */}
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-md">
                      <div className="flex items-center gap-1">
                        <FiStar className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-semibold text-neutral-800">
                          Trending
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shop Now Button */}
                  <div className="absolute bottom-2 left-2 right-2 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg px-2.5 py-1.5 flex items-center justify-between shadow-md">
                      <span className="text-white text-xs font-semibold">Shop Now</span>
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <FiArrowRight className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Border Effect */}
                  <div className="absolute inset-0 rounded-xl ring-2 ring-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                </div>

                {/* Category Info */}
                <div className="mt-3 text-center">
                  <h3 className="font-semibold text-base text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <FiTrendingUp className="h-3 w-3 text-primary-500" />
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {category.itemCount || 120}+ items
                    </p>
                  </div>
                </div>
              </Link>

              {/* Hover Glow Effect */}
              {hoveredCategory === index && (
                <motion.div
                  layoutId="categoryGlow"
                  className="absolute -inset-2 bg-primary-500/5 rounded-2xl -z-10 blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* View All Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span>Browse All Categories</span>
            <FiArrowRight className="group-hover:translate-x-0.5 transition-transform duration-300 h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Stats Section - Minimal margin 1% */}
        <div className="mt-[1%] mb-[1%] pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Happy Customers", value: "50K+", icon: FiAward },
              { label: "Premium Products", value: "500+", icon: FiGrid },
              { label: "Years of Excellence", value: "10+", icon: FiStar },
              { label: "5-Star Reviews", value: "4.8", icon: FiTrendingUp },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary-500/20 transition-colors duration-300">
                  <stat.icon className="h-5 w-5 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;