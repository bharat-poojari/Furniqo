import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useWishlist } from '../store/WishlistContext';
import { useCart } from '../store/CartContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, moveAllToCart } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    toast.success(`${product.name} moved to cart!`);
  };

  const handleMoveAllToCart = () => {
    moveAllToCart(addToCart);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="w-full px-[1%] sm:px-[1.5%] py-16">
        <EmptyState
          icon={FiHeart}
          title="Your Wishlist is Empty"
          description="Save your favorite items here and come back to them anytime!"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="w-full px-[1%] sm:px-[1.5%] py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white">
            My Wishlist
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleMoveAllToCart}
          >
            Move All to Cart
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearWishlist}
            className="text-red-600"
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {wishlistItems.map((product) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-800 overflow-hidden group"
            >
              <Link to={`/products/${product.slug}`} className="block relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(product._id);
                    }}
                    className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-neutral-500 mt-1">{product.category}</p>
                <p className="text-lg font-bold text-primary-600 mt-2">
                  {formatPrice(product.price)}
                </p>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={FiShoppingCart}
                    onClick={() => handleMoveToCart(product)}
                    disabled={!product.inStock}
                    className="flex-grow"
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;