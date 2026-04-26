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
  FiPackage,
  FiStar,
  FiClock,
  FiDollarSign,
  FiPercent,
  FiGift,
  FiAlertCircle,
  FiChevronLeft,
  FiEdit2,
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
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const [giftWrap, setGiftWrap] = useState(false);

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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    }
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const validateShippingStep = () => {
    const newErrors = {};
    if (!shippingData.firstName || shippingData.firstName.length < 2) newErrors.firstName = 'First name is required';
    if (!shippingData.lastName || shippingData.lastName.length < 2) newErrors.lastName = 'Last name is required';
    if (!shippingData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) newErrors.email = 'Valid email is required';
    if (!shippingData.phone || shippingData.phone.length < 10) newErrors.phone = 'Valid phone is required';
    if (!shippingData.address.trim()) newErrors.address = 'Address is required';
    if (!shippingData.city.trim()) newErrors.city = 'City is required';
    if (!shippingData.state.trim()) newErrors.state = 'State is required';
    if (!shippingData.zipCode || shippingData.zipCode.length < 5) newErrors.zipCode = 'Valid ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentStep = () => {
    const newErrors = {};
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Enter valid card number';
    if (!paymentData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    if (!paymentData.expiry || !/^\d{2}\/\d{2}$/.test(paymentData.expiry)) newErrors.expiry = 'Enter valid expiry (MM/YY)';
    if (!paymentData.cvv || paymentData.cvv.length < 3) newErrors.cvv = 'Enter valid CVV';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateShippingStep()) setCurrentStep(2);
    else if (currentStep === 2 && validatePaymentStep()) setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        shipping: shippingData,
        shippingMethod,
        payment: { last4: paymentData.cardNumber.replace(/\s/g, '').slice(-4), brand: 'Visa' },
        items: cartItems,
        subtotal: getSubtotal(),
        discount: getDiscount(),
        shippingCost: getShippingCost(),
        tax: getTax(),
        total: getTotal(),
        coupon: appliedCoupon?.code,
        giftWrap,
      };
      const response = await apiWrapper.createOrder(orderData);
      if (response.data.success) {
        setOrderPlaced(true);
        setTimeout(() => {
          clearCart();
          navigate(`/order-confirmation/${response.data.data._id}`, { state: { order: response.data.data } });
        }, 2000);
      } else {
        toast.error(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepId) => {
    if (currentStep > stepId) return 'completed';
    if (currentStep === stepId) return 'current';
    return 'upcoming';
  };

  if (isEmpty) return null;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-[1%]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-center max-w-md">
          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <FiCheck className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold dark:text-white mb-2">Order Placed!</h2>
          <p className="text-neutral-500 mb-4">Redirecting to order confirmation...</p>
          <div className="flex justify-center gap-2">
            {[1,2,3].map(i => (
              <motion.div key={i} className="w-2 h-2 rounded-full bg-emerald-400" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-[1%] py-[1%]">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors mb-3 group">
            <FiArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </Link>
          <h1 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Checkout</h1>
        </motion.div>

        {/* Progress Steps */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="flex items-center justify-center max-w-lg mx-auto">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1 relative">
                    <motion.button
                      whileHover={status === 'completed' ? { scale: 1.1 } : {}}
                      onClick={() => { if (status === 'completed') setCurrentStep(step.id); }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 cursor-pointer' :
                        status === 'current' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 scale-110' :
                        'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {status === 'completed' ? <FiCheck className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                      {status === 'current' && (
                        <motion.div className="absolute inset-0 rounded-xl bg-primary-500" animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                      )}
                    </motion.button>
                    <span className={`text-xs font-semibold mt-2 ${status === 'current' ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                      <motion.div className="h-full bg-emerald-500 rounded-full" initial={{ width: '0%' }} animate={{ width: currentStep > step.id ? '100%' : '0%' }} transition={{ duration: 0.5 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-4">
          
          {/* Left - Form Steps */}
          <motion.div layout>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                  <div className="p-4 lg:p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <FiMapPin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold dark:text-white">Shipping Information</h2>
                      <p className="text-xs text-neutral-500">Where should we deliver?</p>
                    </div>
                  </div>

                  <div className="p-4 lg:p-5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">First Name *</label>
                        <div className="relative">
                          <FiUser className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                          <input name="firstName" value={shippingData.firstName} onChange={handleShippingChange} className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${errors.firstName ? 'border-red-400 dark:border-red-500' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="John" />
                        </div>
                        {errors.firstName && <p className="text-[10px] text-red-500 mt-0.5">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Last Name *</label>
                        <div className="relative">
                          <FiUser className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                          <input name="lastName" value={shippingData.lastName} onChange={handleShippingChange} className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${errors.lastName ? 'border-red-400 dark:border-red-500' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="Doe" />
                        </div>
                        {errors.lastName && <p className="text-[10px] text-red-500 mt-0.5">{errors.lastName}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email *</label>
                        <div className="relative">
                          <FiMail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                          <input name="email" type="email" value={shippingData.email} onChange={handleShippingChange} className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${errors.email ? 'border-red-400 dark:border-red-500' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="john@email.com" />
                        </div>
                        {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Phone *</label>
                        <div className="relative">
                          <FiPhone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                          <input name="phone" type="tel" value={shippingData.phone} onChange={handleShippingChange} className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${errors.phone ? 'border-red-400 dark:border-red-500' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="+1 555 000-0000" />
                        </div>
                        {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Address *</label>
                        <div className="relative">
                          <FiMapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                          <input name="address" value={shippingData.address} onChange={handleShippingChange} className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${errors.address ? 'border-red-400 dark:border-red-500' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="123 Main Street" />
                        </div>
                        {errors.address && <p className="text-[10px] text-red-500 mt-0.5">{errors.address}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">City *</label>
                        <input name="city" value={shippingData.city} onChange={handleShippingChange} className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.city ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="New York" />
                        {errors.city && <p className="text-[10px] text-red-500 mt-0.5">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">ZIP Code *</label>
                        <input name="zipCode" value={shippingData.zipCode} onChange={handleShippingChange} className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.zipCode ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="10001" />
                        {errors.zipCode && <p className="text-[10px] text-red-500 mt-0.5">{errors.zipCode}</p>}
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">State *</label>
                        <input name="state" value={shippingData.state} onChange={handleShippingChange} className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.state ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="NY" />
                        {errors.state && <p className="text-[10px] text-red-500 mt-0.5">{errors.state}</p>}
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="mt-5">
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <FiTruck className="h-3.5 w-3.5" /> Shipping Method
                      </h3>
                      <div className="space-y-2">
                        {SHIPPING_METHODS.map((method) => (
                          <motion.label key={method.id} whileHover={{ scale: 1.01 }} className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            shippingMethod === method.id ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                          }`}>
                            <input type="radio" name="shippingMethod" value={method.id} checked={shippingMethod === method.id} onChange={(e) => setShippingMethod(e.target.value)} className="text-primary-600" />
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium dark:text-white">{method.name}</p>
                              <p className="text-xs text-neutral-500">{method.description} • {method.days}</p>
                            </div>
                            <span className="text-sm font-semibold dark:text-white">{method.price === 0 ? 'FREE' : formatPrice(method.price)}</span>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    {/* Gift Wrap Option */}
                    <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                            <FiGift className="h-4 w-4 text-rose-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold dark:text-white">Gift Wrap</p>
                            <p className="text-xs text-neutral-500">Add gift wrapping for $5.99</p>
                          </div>
                        </div>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setGiftWrap(!giftWrap)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${giftWrap ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                        >
                          <motion.div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow" animate={{ x: giftWrap ? 24 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        </motion.button>
                      </label>
                    </div>

                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleNextStep} className="w-full mt-5 px-4 py-3 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                      Continue to Payment <FiChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                  <div className="p-4 lg:p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <FiCreditCard className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold dark:text-white">Payment Details</h2>
                      <p className="text-xs text-neutral-500">Secure encrypted payment</p>
                    </div>
                  </div>

                  <div className="p-4 lg:p-5">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Card Number *</label>
                        <div className="relative">
                          <FiCreditCard className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                          <input name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange} maxLength="19" className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${errors.cardNumber ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="4242 4242 4242 4242" />
                        </div>
                        {errors.cardNumber && <p className="text-[10px] text-red-500 mt-0.5">{errors.cardNumber}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Name on Card *</label>
                        <div className="relative">
                          <FiUser className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                          <input name="cardName" value={paymentData.cardName} onChange={handlePaymentChange} className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${errors.cardName ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="John Doe" />
                        </div>
                        {errors.cardName && <p className="text-[10px] text-red-500 mt-0.5">{errors.cardName}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Expiry *</label>
                          <input name="expiry" value={paymentData.expiry} onChange={handlePaymentChange} maxLength="5" className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.expiry ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="MM/YY" />
                          {errors.expiry && <p className="text-[10px] text-red-500 mt-0.5">{errors.expiry}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">CVV *</label>
                          <div className="relative">
                            <FiLock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                            <input name="cvv" type="password" value={paymentData.cvv} onChange={handlePaymentChange} maxLength="4" className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${errors.cvv ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'} bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all`} placeholder="123" />
                          </div>
                          {errors.cvv && <p className="text-[10px] text-red-500 mt-0.5">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl text-xs text-neutral-500">
                      <FiShield className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      Your payment is encrypted with 256-bit SSL security
                    </div>

                    <div className="mt-5 flex gap-3">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setCurrentStep(1)} className="px-4 py-3 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white flex items-center gap-1.5">
                        <FiChevronLeft className="h-4 w-4" /> Back
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleNextStep} className="flex-1 px-4 py-3 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        Review Order <FiChevronRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                  <div className="p-4 lg:p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <FiCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold dark:text-white">Review & Confirm</h2>
                      <p className="text-xs text-neutral-500">Final review before placing order</p>
                    </div>
                  </div>

                  <div className="p-4 lg:p-5 space-y-4">
                    {/* Shipping Summary */}
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold dark:text-white flex items-center gap-2"><FiMapPin className="h-3.5 w-3.5 text-primary-500" /> Shipping</h3>
                        <button onClick={() => setCurrentStep(1)} className="text-xs text-primary-600 hover:underline flex items-center gap-1"><FiEdit2 className="h-3 w-3" /> Edit</button>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">{shippingData.firstName} {shippingData.lastName}</p>
                      <p className="text-xs text-neutral-500">{shippingData.address}, {shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                      <p className="text-xs text-neutral-500">{shippingData.email} • {shippingData.phone}</p>
                    </div>

                    {/* Payment Summary */}
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold dark:text-white flex items-center gap-2"><FiCreditCard className="h-3.5 w-3.5 text-primary-500" /> Payment</h3>
                        <button onClick={() => setCurrentStep(2)} className="text-xs text-primary-600 hover:underline flex items-center gap-1"><FiEdit2 className="h-3 w-3" /> Edit</button>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                        <span className="w-8 h-5 bg-blue-600 rounded text-white text-[9px] font-bold flex items-center justify-center">VISA</span>
                        •••• {paymentData.cardNumber.replace(/\s/g, '').slice(-4)}
                      </p>
                    </div>

                    {/* Items */}
                    <div>
                      <h3 className="text-xs font-semibold dark:text-white mb-2 flex items-center gap-2"><FiPackage className="h-3.5 w-3.5 text-primary-500" /> Items ({cartItems.length})</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cartItems.map((item) => (
                          <div key={item._id} className="flex gap-3 items-center p-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                            <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium dark:text-white truncate">{item.product.name}</p>
                              <p className="text-[10px] text-neutral-500">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-xs font-semibold dark:text-white">{formatPrice((item.variant?.price || item.product.price) * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setCurrentStep(2)} className="px-4 py-3 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white flex items-center gap-1.5">
                        <FiChevronLeft className="h-4 w-4" /> Back
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handlePlaceOrder} disabled={loading} className="flex-1 px-4 py-3 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        {loading ? (
                          <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </motion.svg>
                        ) : <FiShield className="h-4 w-4" />}
                        {loading ? 'Placing Order...' : `Place Order — ${formatPrice(getTotal())}`}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right - Order Summary Sidebar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:sticky lg:top-4 h-fit">
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-4 lg:p-5">
              <h3 className="text-sm font-bold dark:text-white mb-4 flex items-center gap-2">
                <FiPackage className="h-4 w-4 text-primary-500" />
                Order Summary
              </h3>
              
              {/* Coupon Applied */}
              {appliedCoupon && (
                <div className="mb-3 p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center gap-2">
                  <FiPercent className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{appliedCoupon.code}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500">-{formatPrice(getDiscount())} discount</p>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span className="font-medium dark:text-white">{formatPrice(getSubtotal())}</span></div>
                {getDiscount() > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatPrice(getDiscount())}</span></div>}
                <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span className="font-medium dark:text-white">{getShippingCost() === 0 ? 'FREE' : formatPrice(getShippingCost())}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Tax</span><span className="font-medium dark:text-white">{formatPrice(getTax())}</span></div>
                {giftWrap && <div className="flex justify-between text-rose-500"><span>Gift Wrap</span><span>$5.99</span></div>}
              </div>
              
              <div className="border-t dark:border-neutral-800 pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold dark:text-white">Total</span>
                  <span className="text-lg font-bold text-primary-600">{formatPrice(getTotal() + (giftWrap ? 5.99 : 0))}</span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">Including all taxes and shipping</p>
              </div>

              {/* Trust Badges */}
              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <FiShield className="h-3.5 w-3.5 text-emerald-500" />
                  Secure checkout
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <FiTruck className="h-3.5 w-3.5 text-emerald-500" />
                  Free shipping over $200
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <FiClock className="h-3.5 w-3.5 text-emerald-500" />
                  30-day returns
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;