import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import { FiSearch } from 'react-icons/fi';

const ProductGrid = ({ products, loading, error, emptyMessage = 'No products found' }) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-2">Error loading products</p>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={FiSearch}
        title="No Products Found"
        description={emptyMessage}
        actionLabel="Browse All Products"
        actionHref="/products"
      />
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </motion.div>
  );
};

export default ProductGrid;