import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import apiWrapper from '../../services/apiWrapper';

const RelatedProducts = ({ productId, category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchRelatedProducts = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiWrapper.getRelatedProducts(productId, 4, {
        signal: controller.signal
      });
      
      if (response.data.success) {
        setProducts(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch related products');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching related products:', error);
        setError(error.message || 'Failed to load related products');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [productId]);

  useEffect(() => {
    fetchRelatedProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchRelatedProducts]);

  // Handle retry on error
  const handleRetry = () => {
    fetchRelatedProducts();
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-12" aria-label="Related products loading">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            You May Also Like
          </h2>
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            role="status"
            aria-label="Loading products"
          >
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12" aria-label="Related products error">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            You May Also Like
          </h2>
          <div className="text-center py-8" role="alert">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state (returns null as before, but could show a message)
  if (products.length === 0) return null;

  return (
    <section 
      className="py-12" 
      aria-label="Related products"
    >
      <div className="w-full px-[1%] sm:px-[1.5%]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            You May Also Like
          </h2>
          
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            role="list"
            aria-label="Related products list"
          >
            {products.map((product, index) => (
              <div key={product._id || `product-${index}`} role="listitem">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RelatedProducts;