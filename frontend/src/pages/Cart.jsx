import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiArrowLeft, 
  FiTrash2, 
  FiMinus, 
  FiPlus,
  FiHeart,
  FiTag,
  FiLoader,
} from 'react-icons/fi';
import { useCart } from '../store/CartContext';
import { useWishlist } from '../store/WishlistContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { CartSkeleton } from '../components/common/Skeleton';
import { formatPrice } from '../utils/helpers';
import { SHIPPING_METHODS } from '../utils/constants';
import toast from 'react-hot-toast';

const Cart = () => {
  const {
    cartItems,
    loading,
    isEmpty,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemPrice,
    getSubtotal,
    getDiscount,
    getShippingCost,
    getTax,
    getTotal,
    appliedCoupon,
    removeCoupon,
  } = useCart();
  
  const { addToWishlist, isWishlisted } = useWishlist();

  if (loading) {
    return <CartSkeleton />;
  }

  if (isEmpty) {
    return (
      <div className="w-full px-[1%] sm:px-[1.5%] py-16">
        <EmptyState
          icon={FiShoppingCart}
          title="Your Cart is Empty"
          description="Looks like you haven't added any items to your cart yet. Start shopping to find your perfect furniture!"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </div>
    );
  }

  const handleMoveToWishlist = (item) => {
    addToWishlist(item.product);
    removeFromCart(item._id);
    toast.success(`Moved ${item.product.name} to wishlist`);
  };

  return (
    <div className="w-full px-[1%] sm:px-[1.5%] py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/products"
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <FiArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <button
            onClick={clearCart}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => {
              const price = getItemPrice(item);
              const itemTotal = price * item.quantity;
              const inWishlist = isWishlisted(item.product._id);

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-4 lg:p-6 shadow-soft border border-neutral-100 dark:border-neutral-800"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-xl"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            to={`/products/${item.product.slug}`}
                            className="font-semibold text-neutral-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          
                          {item.variant && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              {item.variant.color && `Color: ${item.variant.color}`}
                              {item.variant.material && ` | Material: ${item.variant.material}`}
                              {item.variant.size && ` | Size: ${item.variant.size}`}
                            </p>
                          )}
                          
                          <p className="text-sm text-neutral-500 mt-1">
                            {item.product.inStock ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                In Stock
                              </span>
                            ) : (
                              <span className="text-red-600">Out of Stock</span>
                            )}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="font-bold text-lg text-neutral-900 dark:text-white">
                            {formatPrice(itemTotal)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-neutral-500">
                              {formatPrice(price)} each
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          {/* Quantity */}
                          <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus className="h-4 w-4" />
                            </button>
                            <span className="px-4 font-medium min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                              disabled={item.quantity >= (item.product.stock || 99)}
                            >
                              <FiPlus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Move to Wishlist */}
                          {!inWishlist && (
                            <button
                              onClick={() => handleMoveToWishlist(item)}
                              className="flex items-center gap-1 px-3 py-2 text-sm text-neutral-500 hover:text-red-500 transition-colors"
                            >
                              <FiHeart className="h-4 w-4" />
                              Save
                            </button>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-800 p-6">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {formatPrice(getSubtotal())}
                  </span>
                </div>

                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <FiTag className="h-4 w-4" />
                      Discount
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-500 ml-1"
                      >
                        (remove)
                      </button>
                    </span>
                    <span>-{formatPrice(getDiscount())}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Shipping</span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {getShippingCost() === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(getShippingCost())
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Tax</span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {formatPrice(getTax())}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Coupon "{appliedCoupon.code}" applied!
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t dark:border-neutral-800 my-4 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(getTotal())}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Including VAT and shipping
                </p>
              </div>

              <Link
                to="/checkout"
                className="block w-full mt-6"
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="mt-6 text-center">
                <p className="text-xs text-neutral-500 flex items-center justify-center gap-2">
                  <span>🔒</span> Secure checkout with SSL encryption
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 space-y-2">
              {SHIPPING_METHODS.slice(0, 2).map((method) => (
                <div
                  key={method.id}
                  className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400"
                >
                  <span>📦</span>
                  <span>
                    {method.name}: {method.price === 0 ? 'FREE' : method.price} ({method.days})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;