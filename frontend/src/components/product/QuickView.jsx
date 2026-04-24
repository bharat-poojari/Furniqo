import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiX, FiMinus, FiPlus } from 'react-icons/fi';
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
  
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  if (!product) return null;

  const discount = calculateDiscount(product.price, product.originalPrice);
  const currentPrice = selectedVariant?.price || product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  index === selectedImage
                    ? 'border-primary-600'
                    : 'border-transparent'
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Link
              to={`/products/${product.slug}`}
              className="text-2xl font-bold text-neutral-900 dark:text-white hover:text-primary-600 transition-colors"
              onClick={onClose}
            >
              {product.name}
            </Link>
            <div className="flex items-center gap-3 mt-2">
              <Rating value={product.rating} numReviews={product.numReviews} size="sm" />
              {discount > 0 && (
                <span className="bg-red-100 dark:bg-red-900/20 text-red-600 text-sm font-medium px-2 py-0.5 rounded-full">
                  Save {discount}%
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(currentPrice)}
            </span>
            {product.originalPrice > currentPrice && (
              <span className="text-lg text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 line-clamp-3">
            {product.description}
          </p>

          {product.variants && product.variants.length > 0 && (
            <ProductVariants
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <FiMinus className="h-4 w-4" />
              </button>
              <span className="px-6 font-semibold min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <FiPlus className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-grow"
              size="lg"
              icon={FiShoppingCart}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3 rounded-xl border-2 transition-colors ${
                isWishlisted(product._id)
                  ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-red-300'
              }`}
            >
              <FiHeart className={`h-5 w-5 ${isWishlisted(product._id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          <Link
            to={`/products/${product.slug}`}
            onClick={onClose}
            className="block text-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View Full Details →
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default QuickView;