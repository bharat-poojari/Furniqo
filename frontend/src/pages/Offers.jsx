import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPercent, FiClock, FiTag } from 'react-icons/fi';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import apiWrapper from '../services/apiWrapper';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOnSaleProducts();
  }, []);

  const fetchOnSaleProducts = async () => {
    try {
      const response = await apiWrapper.getOnSaleProducts(12);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-orange-700 mb-12"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '30px 30px',
            }} />
          </div>
          <div className="relative p-8 lg:p-12 text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiPercent className="h-8 w-8" />
              <span className="text-sm font-medium uppercase tracking-wider bg-white/20 rounded-full px-4 py-1">
                Limited Time Offers
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Up to 40% Off
            </h1>
            <p className="text-xl text-red-100 max-w-xl ">
              Incredible savings on premium furniture. Don't miss out on these exclusive deals!
            </p>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FiTag className="h-16 w-16 text-neutral-300 dark:text-neutral-600  mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              No Active Offers
            </h2>
            <p className="text-neutral-500">
              Check back soon for new deals and promotions!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;