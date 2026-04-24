import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye, FiCheck } from 'react-icons/fi';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';
import Rating from '../common/Rating';
import Badge from '../common/Badge';
import { formatPrice, calculateDiscount } from '../../utils/helpers';
import { cn } from '../../utils/cn';

const ProductCard = ({ product, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  const discount = calculateDiscount(product.price, product.originalPrice);
  const inWishlist = isWishlisted(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (addedToCart) return;
    
    setIsAddingToCart(true);
    await addToCart(product, 1);
    setIsAddingToCart(false);
    setAddedToCart(true);
    
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Open quick view modal
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('group relative', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
          {/* Product Image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Second Image on Hover */}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}

          {/* Overlay on Hover */}
          <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <Badge variant="sale" size="md">
                -{discount}%
              </Badge>
            )}
            {product.newArrival && (
              <Badge variant="new" size="md">
                New
              </Badge>
            )}
            {product.bestSeller && (
              <Badge variant="featured" size="md">
                Best Seller
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110',
                inWishlist
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/90 text-neutral-700 hover:bg-white'
              )}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleQuickView}
              className="w-10 h-10 rounded-xl bg-white/90 text-neutral-700 hover:bg-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
              aria-label="Quick view"
            >
              <FiEye className="h-5 w-5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className={cn(
                'w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2',
                addedToCart
                  ? 'bg-green-500 text-white'
                  : product.inStock
                  ? 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg'
                  : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              )}
            >
              {addedToCart ? (
                <>
                  <FiCheck className="h-4 w-4" />
                  Added to Cart
                </>
              ) : isAddingToCart ? (
                <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
              ) : product.inStock ? (
                <>
                  <FiShoppingCart className="h-4 w-4" />
                  Add to Cart
                </>
              ) : (
                'Out of Stock'
              )}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-1">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
          
          <Rating value={product.rating} numReviews={product.numReviews} size="sm" className="mb-2" />

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;