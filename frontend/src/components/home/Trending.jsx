import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiHeart, FiShoppingCart } from 'react-icons/fi';
import apiWrapper from '../../services/apiWrapper';
import { useCart } from '../../store/CartContext';
import toast from 'react-hot-toast';

const Trending = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchTrendingProducts();
    loadWishlist();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const response = await apiWrapper.getTrendingProducts(8);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching trending products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = () => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  };

  const saveWishlist = (newWishlist) => {
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setWishlist(newWishlist);
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const handleWishlistToggle = (product) => {
    let newWishlist;
    if (isInWishlist(product._id)) {
      newWishlist = wishlist.filter(id => id !== product._id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      newWishlist = [...wishlist, product._id];
      toast.success(`${product.name} added to wishlist`);
    }
    saveWishlist(newWishlist);
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <section className="py-12 bg-neutral-50 dark:bg-neutral-900">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <div className="text-center mb-10">
            <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-700 rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="h-10 w-64 bg-neutral-200 dark:bg-neutral-700 rounded-lg mx-auto mb-2 animate-pulse" />
            <div className="h-5 w-80 bg-neutral-200 dark:bg-neutral-700 rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md">
                <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                <div className="p-4">
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-3 animate-pulse" />
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 animate-pulse" />
                </div>
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
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FiTrendingUp className="h-5 w-5 text-primary-600" />
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
              Trending Now
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Trending Products
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Most popular furniture pieces this week
          </p>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div key={product._id} variants={itemVariants}>
              <div className="group relative bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                {/* Image Container */}
                <Link to={`/product/${product._id}`} className="block overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                    alt={product.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Wishlist Button */}
                <button
                  onClick={() => handleWishlistToggle(product)}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-all duration-200"
                  aria-label="Add to wishlist"
                >
                  <FiHeart
                    className={`h-4 w-4 transition-colors ${
                      isInWishlist(product._id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  />
                </button>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {product.category && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        ${(product.price || 0).toLocaleString()}
                      </p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-xs text-neutral-400 line-through">
                          ${product.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
                      aria-label="Add to cart"
                    >
                      <FiShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Trending Badge */}
                <div className="absolute bottom-3 left-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-medium px-2 py-0.5 rounded-md">
                  Trending
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/products?sort=popular"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all duration-200 group shadow-md hover:shadow-lg"
            >
              View All Trending Products
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Trending;