import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, FiHeart, FiX, FiMinus, FiPlus, 
  FiChevronLeft, FiChevronRight, FiTruck,
  FiShield, FiRotateCcw
} from 'react-icons/fi';
import Modal from '../common/Modal';
import Rating from '../common/Rating';
import Button from '../common/Button';
import ProductVariants from './ProductVariants';
import { useCart } from '../../store/CartContext';
import { useWishlist } from '../../store/WishlistContext';
import { formatPrice, calculateDiscount } from '../../utils/helpers';

const QuickView = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageError, setImageError] = useState({});
  const imageContainerRef = useRef(null);
  const touchStartX = useRef(0);
  
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedVariant(null);
    setSelectedImage(0);
    setAddedToCart(false);
    setImageError({});
  }, [product?._id]);

  // Calculate values - moved before conditional return
  const discount = product ? calculateDiscount(product.price, product.originalPrice) : 0;
  const currentPrice = product ? (selectedVariant?.price || product.price) : 0;
  const inStock = product ? (selectedVariant?.inStock !== false && product.inStock) : false;
  const maxQuantity = product ? (selectedVariant?.stock || product.stock || 99) : 99;
  const isWishlistedProduct = product ? isWishlisted(product._id) : false;

  const handleAddToCart = useCallback(async () => {
    if (!product || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity, selectedVariant);
      setAddedToCart(true);
      
      setTimeout(() => {
        onClose();
        setAddedToCart(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, selectedVariant, addToCart, onClose, isAddingToCart]);

  const handleImageNavigation = useCallback((direction) => {
    if (!product) return;
    setSelectedImage(prev => {
      if (direction === 'next') {
        return (prev + 1) % product.images.length;
      }
      return prev === 0 ? product.images.length - 1 : prev - 1;
    });
  }, [product]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      handleImageNavigation(diff > 0 ? 'next' : 'prev');
    }
  };

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const quantityHandlers = {
    increment: () => setQuantity(prev => Math.min(maxQuantity, prev + 1)),
    decrement: () => setQuantity(prev => Math.max(1, prev - 1)),
  };

  const features = [
    { icon: FiTruck, text: 'Free Shipping' },
    { icon: FiShield, text: 'Secure Checkout' },
    { icon: FiRotateCcw, text: '30-Day Returns' },
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handleImageNavigation('prev');
    if (e.key === 'ArrowRight') handleImageNavigation('next');
  };

  // Conditional return after all hooks
  if (!product) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="4xl"
      closeOnOverlayClick={true}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="grid md:grid-cols-2 gap-8"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="dialog"
        aria-label={`Quick view: ${product.name}`}
      >
        {/* Images Section */}
        <div className="space-y-4" ref={imageContainerRef}>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 group">
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={imageError[selectedImage] ? '/placeholder-image.jpg' : product.images?.[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => handleImageError(selectedImage)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              draggable={false}
            />
            
            {/* Image Navigation Arrows */}
            {product.images?.length > 1 && (
              <>
                <button
                  onClick={() => handleImageNavigation('prev')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-neutral-900"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleImageNavigation('next')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-neutral-900"
                  aria-label="Next image"
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {product.images?.length > 1 && (
              <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                {selectedImage + 1} / {product.images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    index === selectedImage
                      ? 'border-primary-600 ring-2 ring-primary-600/20'
                      : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === selectedImage ? 'true' : 'false'}
                >
                  <img 
                    src={imageError[index] ? '/placeholder-image.jpg' : image} 
                    alt={`${product.name} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                    loading="lazy"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <Link
              to={`/products/${product.slug}`}
              className="text-2xl font-bold text-neutral-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-2"
              onClick={onClose}
            >
              {product.name}
            </Link>
            
            <div className="flex items-center gap-3 mt-2">
              <Rating 
                value={product.rating || 4.5} 
                numReviews={product.numReviews || 0} 
                size="sm"
                showCount={true}
              />
              {discount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-red-100 dark:bg-red-900/20 text-red-600 text-sm font-medium px-2 py-0.5 rounded-full"
                >
                  Save {discount}%
                </motion.span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(currentPrice)}
            </span>
            {product.originalPrice && product.originalPrice > currentPrice && (
              <>
                <span className="text-lg text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  You save {formatPrice(product.originalPrice - currentPrice)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-neutral-600 dark:text-neutral-400 line-clamp-3">
            {product.description || product.shortDescription || 'No description available.'}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <ProductVariants
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
              {inStock ? `In Stock (${maxQuantity} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-neutral-200 dark:border-neutral-700 rounded-xl">
              <button
                onClick={quantityHandlers.decrement}
                disabled={quantity <= 1}
                className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <FiMinus className="h-4 w-4" />
              </button>
              <span className="px-6 font-semibold min-w-[60px] text-center select-none">
                {quantity}
              </span>
              <button
                onClick={quantityHandlers.increment}
                disabled={quantity >= maxQuantity}
                className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <FiPlus className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
              className="flex-grow"
              size="lg"
              icon={addedToCart ? undefined : FiShoppingCart}
              loading={isAddingToCart}
            >
              {!inStock 
                ? 'Out of Stock' 
                : addedToCart 
                  ? '✓ Added to Cart!' 
                  : 'Add to Cart'
              }
            </Button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleWishlist(product)}
              className={`p-3 rounded-xl border-2 transition-colors ${
                isWishlistedProduct
                  ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-red-300'
              }`}
              aria-label={isWishlistedProduct ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart 
                className={`h-5 w-5 ${isWishlistedProduct ? 'fill-current' : ''}`} 
              />
            </motion.button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <feature.icon className="h-5 w-5 mx-auto mb-1 text-neutral-400" />
                <span className="text-xs text-neutral-500">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Full Details Link */}
          <Link
            to={`/products/${product.slug}`}
            onClick={onClose}
            className="block text-center text-primary-600 hover:text-primary-700 font-medium group"
          >
            View Full Details{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </motion.div>
    </Modal>
  );
};

export default QuickView;