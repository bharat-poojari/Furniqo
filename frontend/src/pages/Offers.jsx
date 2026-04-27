import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiPercent, FiClock, FiTag } from 'react-icons/fi';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import apiWrapper from '../services/apiWrapper';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOnSaleProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch products that are on sale
      const response = await apiWrapper.getProducts({
        onSale: true,
        discount: true,
        limit: 12,
        sort: 'discount_desc'
      });
      
      // Handle different response structures
      let productsData = [];
      if (response?.data?.success && response?.data?.data) {
        productsData = response.data.data;
      } else if (response?.success && response?.data) {
        productsData = response.data;
      } else if (response?.data && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      }
      
      // Filter products that actually have discount
      const onSaleProducts = productsData.filter(product => 
        product.discount || 
        (product.originalPrice && product.originalPrice > product.price)
      );
      
      setProducts(onSaleProducts);
    } catch (error) {
      console.error('Error fetching on-sale products:', error);
      setError('Failed to load offers. Please try again.');
      setProducts([]);
      
      // Fallback to mock data if API fails (optional)
      setProducts(getMockSaleProducts());
    } finally {
      setLoading(false);
    }
  }, []);

  // Mock data for fallback (remove this if not needed)
  const getMockSaleProducts = () => {
    return [
      {
        _id: '1',
        name: 'Modern Sofa',
        price: 49999,
        originalPrice: 79999,
        discount: 38,
        images: ['/images/sofa.jpg'],
        slug: 'modern-sofa',
        rating: 4.5,
        numReviews: 128,
        inStock: true,
        category: 'Living Room'
      },
      {
        _id: '2',
        name: 'Dining Table Set',
        price: 29999,
        originalPrice: 49999,
        discount: 40,
        images: ['/images/dining-table.jpg'],
        slug: 'dining-table-set',
        rating: 4.8,
        numReviews: 95,
        inStock: true,
        category: 'Dining'
      },
    ];
  };

  useEffect(() => {
    fetchOnSaleProducts();
  }, [fetchOnSaleProducts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
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

  return (
    <div className="min-h-screen py-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-orange-700 mb-8 group cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '30px 30px',
            }} />
          </div>
          
          {/* Floating Particles */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  scale: 0
                }}
                animate={{
                  y: [null, -30, -60],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          {/* Rotating Discount Ring */}
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-4 border-white/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border-4 border-white/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          {/* Glowing Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
            animate={{ 
              opacity: [0, 0.1, 0],
              x: ['-100%', '100%']
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
          />

          <div className="relative p-6 lg:p-8 text-center text-white">
            <motion.div 
              className="flex items-center justify-center gap-3 mb-3"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <FiPercent className="h-7 w-7" />
              </motion.div>
              <motion.span 
                className="text-sm font-medium uppercase tracking-wider bg-white/20 rounded-full px-4 py-1 backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
              >
                Limited Time Offers
              </motion.span>
            </motion.div>

            <motion.h1 
              className="text-3xl lg:text-4xl font-display font-bold mb-3"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              Up to{' '}
              <motion.span
                className="inline-block"
                animate={{ 
                  scale: [1, 1.1, 1],
                  textShadow: [
                    "0 0 0px rgba(255,255,255,0)",
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 0px rgba(255,255,255,0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                40% Off
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-base text-red-100 max-w-xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Incredible savings on premium furniture. Don't miss out on these exclusive deals!
            </motion.p>

            {/* Animated Timer Indicator */}
            <motion.div 
              className="absolute bottom-3 right-4 flex items-center gap-2 text-xs bg-black/20 rounded-full px-3 py-1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <FiClock className="h-3 w-3" />
              </motion.div>
              <span>Limited Time</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-2xl mb-6"
          >
            <FiTag className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
            <button
              onClick={fetchOnSaleProducts}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Products Grid */}
        {!error && (
          loading ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : products.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <FiTag className="h-10 w-10 text-neutral-400" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                No Active Offers
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                We don't have any active offers right now. Check back soon for amazing deals and discounts!
              </p>
              <button
                onClick={fetchOnSaleProducts}
                className="mt-6 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
              >
                <FiClock className="h-4 w-4" />
                Refresh Offers
              </button>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default Offers;