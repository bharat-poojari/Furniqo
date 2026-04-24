import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiCheck,
  FiCreditCard,
  FiLock,
  FiMapPin,
  FiTruck,
  FiUser,
  FiMail,
  FiPhone,
  FiChevronRight,
  FiShield,
} from 'react-icons/fi';
import { useCart } from '../store/CartContext';
import { useAuth } from '../store/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { formatPrice } from '../utils/helpers';
import { SHIPPING_METHODS } from '../utils/constants';
import { validateEmail, validateName, validatePhone, validateAddress, validateZipCode } from '../utils/validators';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, label: 'Shipping', icon: FiMapPin },
  { id: 2, label: 'Payment', icon: FiCreditCard },
  { id: 3, label: 'Review', icon: FiCheck },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, isEmpty, getSubtotal, getDiscount, getShippingCost, getTax, getTotal, clearCart, appliedCoupon } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    if (isEmpty) {
      navigate('/cart');
    }
  }, [isEmpty, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    }

    // Format expiry date
    if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    }

    // Limit CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const validateShippingStep = () => {
    const newErrors = {};
    
    const firstNameError = validateName(shippingData.firstName);
    const lastNameError = validateName(shippingData.lastName);
    const emailError = validateEmail(shippingData.email);
    const phoneError = validatePhone(shippingData.phone);
    const addressError = validateAddress(shippingData.address);
    const zipError = validateZipCode(shippingData.zipCode);

    if (firstNameError) newErrors.firstName = firstNameError;
    if (lastNameError) newErrors.lastName = lastNameError;
    if (emailError) newErrors.email = emailError;
    if (phoneError) newErrors.phone = phoneError;
    if (addressError) newErrors.address = addressError;
    if (!shippingData.city) newErrors.city = 'City is required';
    if (!shippingData.state) newErrors.state = 'State is required';
    if (zipError) newErrors.zipCode = zipError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentStep = () => {
    const newErrors = {};
    
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    if (!paymentData.cardName) {
      newErrors.cardName = 'Name on card is required';
    }
    if (!paymentData.expiry || !/^\d{2}\/\d{2}$/.test(paymentData.expiry)) {
      newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
    }
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateShippingStep()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validatePaymentStep()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      const orderData = {
        shipping: shippingData,
        shippingMethod,
        payment: {
          last4: paymentData.cardNumber.replace(/\s/g, '').slice(-4),
          brand: 'Visa',
        },
        items: cartItems,
        subtotal: getSubtotal(),
        discount: getDiscount(),
        shippingCost: getShippingCost(),
        tax: getTax(),
        total: getTotal(),
        coupon: appliedCoupon?.code,
      };

      const response = await apiWrapper.createOrder(orderData);

      if (response.data.success) {
        clearCart();
        navigate(`/order-confirmation/${response.data.data._id}`, {
          state: { order: response.data.data },
        });
        toast.success('Order placed successfully!');
      } else {
        toast.error(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isEmpty) return null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-[1%] sm:px-[1.5%] py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white">
            Checkout
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center max-w-2xl ">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <FiCheck className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-sm mt-2 font-medium ${
                      currentStep >= step.id
                        ? 'text-neutral-900 dark:text-white'
                        : 'text-neutral-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id
                        ? 'bg-green-500'
                        : 'bg-neutral-200 dark:bg-neutral-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-800 p-6 lg:p-8"
                >
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                    <FiMapPin className="h-6 w-6 text-primary-600" />
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={shippingData.firstName}
                      onChange={handleShippingChange}
                      error={errors.firstName}
                      required
                      icon={FiUser}
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={shippingData.lastName}
                      onChange={handleShippingChange}
                      error={errors.lastName}
                      required
                      icon={FiUser}
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={shippingData.email}
                      onChange={handleShippingChange}
                      error={errors.email}
                      required
                      icon={FiMail}
                    />
                    <Input
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                      error={errors.phone}
                      required
                      icon={FiPhone}
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Address"
                        name="address"
                        value={shippingData.address}
                        onChange={handleShippingChange}
                        error={errors.address}
                        required
                        icon={FiMapPin}
                      />
                    </div>
                    <Input
                      label="City"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      error={errors.city}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="State"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        error={errors.state}
                        required
                      />
                      <Input
                        label="ZIP Code"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleShippingChange}
                        error={errors.zipCode}
                        required
                      />
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiTruck className="h-5 w-5 text-primary-600" />
                      Shipping Method
                    </h3>
                    <div className="space-y-3">
                      {SHIPPING_METHODS.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            shippingMethod === method.id
                              ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            checked={shippingMethod === method.id}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <div className="ml-4 flex-grow">
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {method.name}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {method.description} • {method.days}
                            </p>
                          </div>
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {method.price === 0 ? 'FREE' : formatPrice(method.price)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      onClick={handleNextStep}
                      className="w-full"
                      size="lg"
                      icon={FiChevronRight}
                      iconPosition="right"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-800 p-6 lg:p-8"
                >
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                    <FiCreditCard className="h-6 w-6 text-primary-600" />
                    Payment Information
                  </h2>

                  <div className="space-y-4">
                    <Input
                      label="Card Number"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      error={errors.cardNumber}
                      required
                      placeholder="1234 5678 9012 3456"
                    />
                    <Input
                      label="Name on Card"
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      error={errors.cardName}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        name="expiry"
                        value={paymentData.expiry}
                        onChange={handlePaymentChange}
                        error={errors.expiry}
                        required
                        placeholder="MM/YY"
                      />
                      <Input
                        label="CVV"
                        name="cvv"
                        type="password"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        error={errors.cvv}
                        required
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm text-neutral-500">
                    <FiLock className="h-4 w-4" />
                    Your payment information is encrypted and secure
                  </div>

                  <div className="mt-8 flex gap-4">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentStep(1)}
                      size="lg"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="flex-grow"
                      size="lg"
                      icon={FiChevronRight}
                      iconPosition="right"
                    >
                      Review Order
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-800 p-6 lg:p-8"
                >
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-3">
                    <FiCheck className="h-6 w-6 text-green-500" />
                    Review Your Order
                  </h2>

                  {/* Shipping Summary */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Shipping Address</h3>
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4">
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {shippingData.firstName} {shippingData.lastName}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {shippingData.address}, {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                      </p>
                      <p className="text-sm text-neutral-500">{shippingData.email} • {shippingData.phone}</p>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Payment Method</h3>
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            •••• {paymentData.cardNumber.replace(/\s/g, '').slice(-4)}
                          </p>
                          <p className="text-sm text-neutral-500">Expires {paymentData.expiry}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                      Items ({cartItems.length})
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item._id} className="flex gap-3 items-center">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {formatPrice((item.variant?.price || item.product.price) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentStep(2)}
                      size="lg"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      loading={loading}
                      className="flex-grow"
                      size="lg"
                      icon={FiShield}
                    >
                      Place Order — {formatPrice(getTotal())}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-800 p-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                Order Summary
              </h3>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">{formatPrice(getSubtotal())}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(getDiscount())}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="font-medium">
                    {getShippingCost() === 0 ? 'FREE' : formatPrice(getShippingCost())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tax</span>
                  <span className="font-medium">{formatPrice(getTax())}</span>
                </div>
              </div>
              
              <div className="border-t dark:border-neutral-800 pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatPrice(getTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;