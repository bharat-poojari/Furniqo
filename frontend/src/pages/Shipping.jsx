import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTruck, FiPackage, FiClock, FiGlobe, FiShield, FiCheck, 
  FiArrowRight, FiMail, FiPhone, FiRefreshCw,
  FiBox, FiHome, FiMessageCircle, FiX, FiSend, FiUser,
  FiAlertCircle, FiNavigation, FiMapPin, FiSearch
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';
import toast from 'react-hot-toast';

// Custom SVG Icons
const TruckIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h5m0 0l2-4h-5V6m0 0h4l4 4v6" />
  </svg>
);

const Shipping = () => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [postalCode, setPostalCode] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  
  // Modal states
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showCalculateModal, setShowCalculateModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  
  // Form states
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [emailForm, setEmailForm] = useState({ name: '', email: '', message: '' });
  const [chatForm, setChatForm] = useState({ name: '', email: '', question: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingMethods = [
    { 
      name: 'Standard Shipping', 
      icon: FiPackage, 
      time: '5-7 Business Days', 
      price: '$5.99',
      freeOver: '$50',
      color: 'from-blue-500 to-blue-600',
      image: 'https://images.unsplash.com/photo-1580674285054-bed31e145e59?w=600&q=80'
    },
    { 
      name: 'Express Shipping', 
      icon: FiTruck, 
      time: '2-3 Business Days', 
      price: '$12.99',
      freeOver: '$100',
      color: 'from-emerald-500 to-teal-600',
      image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80'
    },
    { 
      name: 'Next Day Delivery', 
      icon: FiClock, 
      time: '1 Business Day', 
      price: '$24.99',
      freeOver: '$200',
      color: 'from-purple-500 to-violet-600',
      image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&q=80'
    },
    { 
      name: 'International Shipping', 
      icon: FiGlobe, 
      time: '7-14 Business Days', 
      price: '$29.99',
      freeOver: '$150',
      color: 'from-orange-500 to-amber-600',
      image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80'
    },
  ];

  const faqs = [
    { question: 'How long does shipping take?', answer: 'Shipping times vary based on your location and selected shipping method. Standard shipping takes 5-7 business days, Express takes 2-3 business days, and Next Day Delivery arrives within 1 business day for orders placed before 2 PM EST.' },
    { question: 'Do you ship internationally?', answer: 'Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days. Customs fees and import duties may apply depending on your country\'s regulations.' },
    { question: 'How can I track my order?', answer: 'Once your order ships, you\'ll receive a confirmation email with a tracking number. You can also track your order by logging into your account or using our tracking tool.' },
    { question: 'What if I receive a damaged item?', answer: 'If your item arrives damaged, please contact our customer service within 48 hours of delivery. We\'ll arrange for a replacement or refund immediately.' },
    { question: 'Can I change my shipping address?', answer: 'You can change your shipping address within 1 hour of placing your order by contacting customer support.' },
    { question: 'Do you offer free shipping?', answer: 'Yes! We offer free standard shipping on orders over $50 within the US. Express shipping is free on orders over $100, and Next Day Delivery is free on orders over $200.' }
  ];

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸', delivery: '3-7 days' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', delivery: '5-10 days' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', delivery: '5-10 days' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', delivery: '7-14 days' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', delivery: '5-10 days' },
    { code: 'FR', name: 'France', flag: '🇫🇷', delivery: '5-10 days' },
  ];

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setIsTracking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTrackingResult({
      status: 'In Transit',
      location: 'Distribution Center',
      estimatedDelivery: '2-3 business days',
      updates: [
        { date: '2024-03-20 14:30', status: 'Package departed from facility' },
        { date: '2024-03-19 09:15', status: 'Package processed at sorting center' },
        { date: '2024-03-18 16:45', status: 'Order confirmed and label created' }
      ]
    });
    setIsTracking(false);
    toast.success('Tracking information retrieved!');
  };

  const handleCalculateDelivery = (e) => {
    e.preventDefault();
    if (postalCode) {
      const days = Math.floor(Math.random() * 5) + 3;
      setEstimatedDelivery(`Estimated delivery: ${days}-${days + 2} business days`);
      toast.success('Delivery estimate calculated!');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowEmailModal(false);
    setEmailForm({ name: '', email: '', message: '' });
    toast.success('Message sent! We\'ll respond within 24 hours.');
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowChatModal(false);
    setChatForm({ name: '', email: '', question: '' });
    toast.success('Chat request submitted! A representative will join shortly.');
  };

  const handleCallNow = () => {
    setShowCallModal(false);
    toast.success('Connecting you to a representative...');
  };

  // Modal component to avoid repetition
  const ModalWrapper = ({ isOpen, onClose, gradient, icon: Icon, title, subtitle, children }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className={`bg-gradient-to-r ${gradient} p-5 text-white`}>
              <button onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <FiX className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{title}</h3>
                  {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
                </div>
              </div>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative w-full px-[1%] py-[1%]">
        <div className="relative rounded-2xl overflow-hidden min-h-[60vh] lg:min-h-[65vh] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1580674285054-bed31e145e59?w=1920&q=80"
              alt="Warehouse and Logistics"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/80 to-neutral-900/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-transparent to-transparent" />
          </div>

          {/* Dot Pattern */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 20}%` }}
                animate={{ y: [0, -20, 0], opacity: [0.1, 0.25, 0.1] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.6 }}
              >
                {i % 2 === 0 ? 
                  <TruckIcon className="h-6 w-6 text-white/15" /> : 
                  <FiPackage className="h-5 w-5 text-white/15" />
                }
              </motion.div>
            ))}
          </div>

          <div className="relative w-full px-[2%] py-12 lg:py-16">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-5 text-white border border-white/10"
                >
                  <FiTruck className="h-3.5 w-3.5" />
                  <span>Premium Logistics</span>
                </motion.div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-[1.1] tracking-tight">
                  Fast & Secure{' '}
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Shipping</span>
                </h1>
                
                <p className="text-base lg:text-lg text-neutral-300 max-w-lg mb-6 leading-relaxed">
                  Free shipping on orders over $50. Real-time tracking on every delivery.
                </p>

                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowTrackModal(true)}
                    className="px-5 py-2.5 bg-white text-neutral-900 text-sm font-semibold rounded-xl hover:bg-neutral-100 transition-all shadow-lg"
                  >
                    Track Order
                    <FiArrowRight className="inline ml-2 h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCalculateModal(true)}
                    className="px-5 py-2.5 bg-white/10 backdrop-blur-md text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10"
                  >
                    Calculate Delivery
                    <FiClock className="inline ml-2 h-4 w-4" />
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-5 mt-8 pt-6 border-t border-white/15">
                  {[
                    { icon: FiShield, label: 'Insured' },
                    { icon: FiClock, label: 'Real-Time Tracking' },
                    { icon: FiRefreshCw, label: 'Free Returns' },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/70 text-xs">
                      <badge.icon className="h-3.5 w-3.5" />
                      <span>{badge.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Methods - With Background Images */}
      <section className="w-full px-[1%] py-[1%]">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
          <h2 className="text-xl lg:text-2xl font-bold dark:text-white mb-1">Shipping Options</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Choose the delivery method that works for you</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {shippingMethods.map((method, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setShowCalculateModal(true)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={method.image} 
                  alt={method.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/95 via-neutral-900/60 to-neutral-900/30" />
                <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-30 group-hover:opacity-40 transition-opacity`} />
              </div>

              {/* Content */}
              <div className="relative p-5 lg:p-6 h-full flex flex-col justify-between min-h-[240px]">
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <method.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{method.name}</h3>
                  <p className="text-xs text-white/70">{method.time}</p>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-black text-white">{method.price}</div>
                  <p className="text-xs text-white/60 mt-1">Free over {method.freeOver}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                    Calculate <FiArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full px-[1%] py-[1%]">
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { icon: FiGlobe, title: 'Worldwide Shipping', desc: 'We deliver to over 50 countries', color: 'from-blue-500 to-cyan-500' },
            { icon: FiShield, title: 'Package Protection', desc: 'All shipments fully insured & tracked', color: 'from-emerald-500 to-teal-500' },
            { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy with free returns', color: 'from-purple-500 to-pink-500' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -2 }}
              onClick={() => setShowPolicyModal(true)}
              className="bg-white dark:bg-neutral-900 rounded-xl p-5 text-center border border-neutral-100 dark:border-neutral-800 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={`w-11 h-11 mx-auto mb-3 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                <feature.icon className="h-5.5 w-5.5 text-white" />
              </div>
              <h3 className="font-bold text-sm dark:text-white mb-1">{feature.title}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Shipping Process */}
      <section className="w-full px-[1%] py-[1%]">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
          <h2 className="text-xl lg:text-2xl font-bold dark:text-white mb-1">How Shipping Works</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Simple and transparent process</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { step: '01', icon: FiBox, title: 'Place Order', desc: 'Complete your purchase' },
            { step: '02', icon: FiPackage, title: 'Process', desc: 'We prepare items (1-2 days)' },
            { step: '03', icon: FiTruck, title: 'Ship', desc: 'Dispatched for delivery' },
            { step: '04', icon: FiHome, title: 'Deliver', desc: 'Arrives at your door' },
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="relative"
            >
              {idx < 3 && (
                <div className="hidden lg:block absolute top-10 left-[55%] w-[90%] h-0.5 bg-gradient-to-r from-primary-300 to-primary-500" />
              )}
              <div className="text-center">
                <div className="relative w-14 h-14 mx-auto mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-sm" />
                  <div className="absolute inset-1 bg-white dark:bg-neutral-900 rounded-lg flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-bold text-sm dark:text-white mb-0.5">{step.title}</h3>
                <p className="text-xs text-neutral-500">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full px-[1%] py-[1%]">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
            <h2 className="text-xl lg:text-2xl font-bold dark:text-white mb-1">Frequently Asked Questions</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Everything you need to know</p>
          </motion.div>

          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <span className="text-sm font-medium dark:text-white pr-3">{faq.question}</span>
                  <motion.div animate={{ rotate: openFaq === idx ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <FiArrowRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                      <p className="px-3.5 pb-3.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="w-full px-[1%] py-[1%]">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 text-center border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <FiMessageCircle className="h-8 w-8 text-primary-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2 dark:text-white">Still have questions?</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5 max-w-md mx-auto">
            Our support team is available 24/7 to help with any shipping questions.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <button onClick={() => setShowEmailModal(true)} className="px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-1.5">
              <FiMail className="h-3.5 w-3.5" /> Email
            </button>
            <button onClick={() => setShowCallModal(true)} className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5 dark:text-white">
              <FiPhone className="h-3.5 w-3.5" /> Call
            </button>
            <button onClick={() => setShowChatModal(true)} className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5 dark:text-white">
              <FiMessageCircle className="h-3.5 w-3.5" /> Chat
            </button>
          </div>
        </div>
      </section>

      <Newsletter />

      {/* Modals using ModalWrapper */}
      <ModalWrapper isOpen={showTrackModal} onClose={() => { setShowTrackModal(false); setTrackingResult(null); setTrackingNumber(''); }} gradient="from-primary-600 to-purple-600" icon={FiPackage} title="Track Your Order" subtitle="Enter your tracking number">
        <div className="p-5">
          <form onSubmit={handleTrackOrder} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tracking Number *</label>
              <input type="text" required value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="FURN123456789" />
            </div>
            {trackingResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-xs">
                <div className="flex items-center gap-2 mb-2"><FiCheck className="h-4 w-4 text-emerald-600" /><span className="font-semibold text-emerald-700 dark:text-emerald-400">{trackingResult.status}</span></div>
                <p className="text-neutral-600 dark:text-neutral-400">Location: {trackingResult.location}</p>
                <p className="text-neutral-600 dark:text-neutral-400 mb-2">ETA: {trackingResult.estimatedDelivery}</p>
                {trackingResult.updates.map((u, i) => <p key={i} className="text-neutral-500">• {u.date} - {u.status}</p>)}
              </motion.div>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => { setShowTrackModal(false); setTrackingResult(null); setTrackingNumber(''); }} className="flex-1 px-4 py-2 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
              <button type="submit" disabled={isTracking} className="flex-1 px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2">
                {isTracking ? <><motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></motion.svg> Tracking...</> : <><FiSearch className="h-3.5 w-3.5" /> Track</>}
              </button>
            </div>
          </form>
        </div>
      </ModalWrapper>

      <ModalWrapper isOpen={showCalculateModal} onClose={() => setShowCalculateModal(false)} gradient="from-blue-600 to-cyan-600" icon={FiClock} title="Calculate Delivery" subtitle="Get estimated delivery time">
        <div className="p-5">
          <form onSubmit={handleCalculateDelivery} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Country *</label>
              <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer">
                {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Postal Code *</label>
              <input type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="Enter postal code" />
            </div>
            {estimatedDelivery && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm text-primary-700 dark:text-primary-300 text-center">{estimatedDelivery}</motion.div>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowCalculateModal(false)} className="flex-1 px-4 py-2 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
              <button type="submit" className="flex-1 px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Calculate</button>
            </div>
          </form>
        </div>
      </ModalWrapper>

      <ModalWrapper isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} gradient="from-primary-600 to-purple-600" icon={FiMail} title="Email Support" subtitle="We'll respond within 24 hours">
        <div className="p-5">
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input type="text" required value={emailForm.name} onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="Your name" />
            <input type="email" required value={emailForm.email} onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="your@email.com" />
            <textarea required rows={3} value={emailForm.message} onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white resize-none" placeholder="How can we help?" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowEmailModal(false)} className="flex-1 px-4 py-2 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? <><motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></motion.svg> Sending...</> : <><FiSend className="h-3.5 w-3.5" /> Send</>}
              </button>
            </div>
          </form>
        </div>
      </ModalWrapper>

      <ModalWrapper isOpen={showCallModal} onClose={() => setShowCallModal(false)} gradient="from-emerald-600 to-teal-600" icon={FiPhone} title="Call Support" subtitle="Available 24/7">
        <div className="p-5 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">1-800-FURNIQO</div>
          <p className="text-xs text-neutral-500 mb-4">Average wait time: under 2 minutes</p>
          <div className="flex gap-2">
            <button onClick={() => setShowCallModal(false)} className="flex-1 px-4 py-2 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
            <button onClick={handleCallNow} className="flex-1 px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"><FiPhone className="h-3.5 w-3.5" /> Call Now</button>
          </div>
        </div>
      </ModalWrapper>

      <ModalWrapper isOpen={showChatModal} onClose={() => setShowChatModal(false)} gradient="from-purple-600 to-pink-600" icon={FiMessageCircle} title="Live Chat" subtitle="Start a conversation">
        <div className="p-5">
          <form onSubmit={handleChatSubmit} className="space-y-3">
            <input type="text" required value={chatForm.name} onChange={(e) => setChatForm({ ...chatForm, name: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="Your name" />
            <input type="email" required value={chatForm.email} onChange={(e) => setChatForm({ ...chatForm, email: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="your@email.com" />
            <textarea required rows={3} value={chatForm.question} onChange={(e) => setChatForm({ ...chatForm, question: e.target.value })} className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white resize-none" placeholder="What would you like to know?" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowChatModal(false)} className="flex-1 px-4 py-2 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? <><motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></motion.svg> Connecting...</> : <><FiMessageCircle className="h-3.5 w-3.5" /> Start Chat</>}
              </button>
            </div>
          </form>
        </div>
      </ModalWrapper>

      <ModalWrapper isOpen={showPolicyModal} onClose={() => setShowPolicyModal(false)} gradient="from-blue-600 to-indigo-600" icon={FiShield} title="Shipping Policy" subtitle="Everything you need to know">
        <div className="p-5 max-h-[40vh] overflow-y-auto space-y-3 text-sm">
          <div><h4 className="font-bold dark:text-white mb-1">Processing</h4><p className="text-xs text-neutral-500">Orders processed within 1-2 business days.</p></div>
          <div><h4 className="font-bold dark:text-white mb-1">Methods</h4><p className="text-xs text-neutral-500">Standard (5-7 days), Express (2-3 days), Next Day, International (7-14 days).</p></div>
          <div><h4 className="font-bold dark:text-white mb-1">International</h4><p className="text-xs text-neutral-500">Customs fees may apply. Customer responsible for duties.</p></div>
          <div><h4 className="font-bold dark:text-white mb-1">Damaged Items</h4><p className="text-xs text-neutral-500">Contact within 48 hours for replacement/refund.</p></div>
        </div>
        <div className="p-5 pt-0">
          <button onClick={() => setShowPolicyModal(false)} className="w-full px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Got it</button>
        </div>
      </ModalWrapper>

      <style>{`.h-5\\.5 { height: 1.375rem; } .w-5\\.5 { width: 1.375rem; }`}</style>
    </div>
  );
};

export default Shipping;