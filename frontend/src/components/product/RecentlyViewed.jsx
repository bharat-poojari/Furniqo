import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import { useRecentlyViewed } from '../../store/RecentlyViewedContext';
import { formatPrice } from '../../utils/helpers';

const RecentlyViewed = () => {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="py-12">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiClock className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Recently Viewed
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View All <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {recentlyViewed.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0 w-48"
            >
              <Link
                to={`/products/${product.slug}`}
                className="block bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-primary-600 mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;