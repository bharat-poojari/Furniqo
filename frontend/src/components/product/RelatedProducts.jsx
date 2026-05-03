import { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import apiWrapper from '../../services/apiWrapper';

const RelatedProducts = ({ productId, category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchRelatedProducts = useCallback(async () => {
    if (!productId) {
      if (isMountedRef.current) setLoading(false);
      return;
    }
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiWrapper.getRelatedProducts(productId, 4);
      
      if (!isMountedRef.current) return;
      
      let productsData = [];
      if (response?.data?.success && response.data.data) {
        productsData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      }
      
      // Filter out current product if present
      productsData = productsData.filter(p => p._id !== productId);
      
      setProducts(productsData);
    } catch (error) {
      if (isMountedRef.current && error.name !== 'AbortError' && error.name !== 'CanceledError') {
        console.error('Error fetching related products:', error);
        setError(error.message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [productId]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [fetchRelatedProducts]);

  const handleRetry = () => {
    fetchRelatedProducts();
  };

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

  if (error) {
    return null; // Hide instead of showing error to avoid clutter
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12" aria-label="Related products">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        <div>
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
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;