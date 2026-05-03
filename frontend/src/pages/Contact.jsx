import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiClock, 
  FiSend,
  FiMessageSquare,
  FiUser,
  FiCheck,
  FiHeadphones,
  FiShield,
  FiTruck,
  FiStar,
  FiChevronDown,
  FiAward,
  FiThumbsUp,
  FiGlobe,
  FiRefreshCw,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiHelpCircle,
  FiBook,
  FiTrendingUp,
  FiSmile,
  FiZap,
  FiCompass,
  FiAlertCircle,
  FiShoppingBag,
  FiHeart,
  FiUsers
} from 'react-icons/fi';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import Newsletter from '../components/layout/Newsletter';

const SuccessModal = ({ isOpen, onClose, referenceId }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-neutral-100 dark:border-neutral-800"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600 opacity-10" />
              <div className="relative p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
                >
                  <FiCheck className="h-10 w-10 text-white" strokeWidth={1.5} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">We'll respond within 24 hours.</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <FiHeadphones className="h-3 w-3 text-primary-500" />
                    <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">Ref: {referenceId}</p>
                  </div>
                </motion.div>
                <button 
                  onClick={onClose} 
                  className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    subject: '', 
    message: '',
    orderNumber: '',
    preferredContact: 'email'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const contactMethods = [
    { 
      icon: FiPhone, 
      title: 'Phone Support', 
      details: ['+1 (555) 987-6543', '+1 (555) 987-6544'],
      availability: '24/7 Emergency Support',
      responseTime: 'Immediate',
      action: 'tel:+15559876543',
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'Fastest'
    },
    { 
      icon: FaWhatsapp, 
      title: 'WhatsApp', 
      details: ['+1 (555) 987-6543'],
      availability: 'Mon-Fri, 9AM-8PM',
      responseTime: 'Within 2 hours',
      action: 'https://wa.me/15559876543',
      gradient: 'from-green-500 to-emerald-500',
      badge: 'Popular'
    },
    { 
      icon: FiMail, 
      title: 'Email Support', 
      details: ['support@furniqo.com', 'sales@furniqo.com'],
      availability: 'Response within 24h',
      responseTime: '24 hours',
      action: 'mailto:support@furniqo.com',
      gradient: 'from-purple-500 to-pink-500',
      badge: 'Detailed'
    },
    { 
      icon: FaTelegramPlane, 
      title: 'Telegram', 
      details: ['@furniqo_support'],
      availability: 'Live Chat Support',
      responseTime: 'Real-time',
      action: 'https://t.me/furniqo_support',
      gradient: 'from-sky-500 to-blue-600',
      badge: 'New'
    },
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM', status: 'open' },
    { day: 'Saturday', hours: '10:00 AM - 6:00 PM', status: 'open' },
    { day: 'Sunday', hours: '12:00 PM - 5:00 PM', status: 'limited' },
    { day: 'Holidays', hours: 'Closed', status: 'closed' },
  ];

  // Fixed quick links - removed non-existent pages
  const quickLinks = [
    { icon: FiTruck, label: 'Track Order', href: '/track-order', desc: 'Real-time delivery status', color: 'blue' },
    { icon: FiShoppingBag, label: 'My Orders', href: '/account/orders', desc: 'View order history', color: 'green' },
    { icon: FiStar, label: 'Leave Review', href: '/reviews', desc: 'Share your experience', color: 'purple' },
    { icon: FiHeart, label: 'Wishlist', href: '/wishlist', desc: 'Saved items', color: 'red' },
  ];

  const faqs = [
    { q: 'What is your return policy?', a: 'We offer a 30-day return policy on all furniture. Items must be in original condition with all packaging. Free returns within the first 14 days.', category: 'returns' },
    { q: 'How long does delivery take?', a: 'Standard delivery: 5-7 business days. Express: 2-3 business days. White glove delivery: 7-10 business days with room placement and assembly.', category: 'shipping' },
    { q: 'Do you offer assembly services?', a: 'Yes! Professional assembly is available for $49-$99 depending on item complexity. Our certified technicians ensure safe and proper assembly.', category: 'services' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, Afterpay, and financing through Affirm.', category: 'billing' },
    { q: 'How can I track my order?', a: 'Visit our Track Order page with your order number and email. You\'ll receive real-time updates on your delivery status.', category: 'shipping' },
    { q: 'Do you ship internationally?', a: 'Yes, we ship to over 30 countries worldwide. International shipping costs vary by location. Customs fees may apply.', category: 'shipping' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.length < 2) newErrors.name = 'Please enter your full name';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.subject.trim()) newErrors.subject = 'Please select a topic';
    if (!formData.message.trim() || formData.message.length < 20) newErrors.message = 'Message must be at least 20 characters';
    if (formData.subject === 'Order Support' && !formData.orderNumber) newErrors.orderNumber = 'Order number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setReferenceId('MSG-' + Math.random().toString(36).substring(2, 10).toUpperCase());
    setShowSuccessModal(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '', orderNumber: '', preferredContact: 'email' });
  };

  const inputClass = (field) => `w-full px-4 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${
    errors[field] 
      ? 'border-red-400 dark:border-red-500 bg-red-50/30 dark:bg-red-900/10' 
      : `border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 ${focusedField === field ? 'border-primary-500 ring-4 ring-primary-500/20' : 'hover:border-neutral-300 dark:hover:border-neutral-600'}`
  } focus:outline-none dark:text-white placeholder-neutral-400`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 dark:bg-primary-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-200/10 dark:bg-cyan-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-10 lg:mb-14"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-purple-500/10 dark:from-primary-500/20 dark:to-purple-500/20 backdrop-blur-sm border border-primary-200/50 dark:border-primary-800/50 mb-4"
          >
            <FiHeadphones className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">24/7 Premium Support</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent mb-3">
            How Can We Help You?
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Get instant support from our dedicated team. We're here to ensure your experience is nothing short of exceptional.
          </p>
        </motion.div>

        {/* Contact Methods - 2x2 grid on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12 lg:mb-16">
          {contactMethods.map((method, i) => (
            <motion.a
              key={i}
              href={method.action}
              target={method.action.includes('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ y: -4 }}
              className="group relative bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 dark:border-neutral-800/50 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {method.badge && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full text-[8px] sm:text-[9px] font-bold text-white uppercase">
                  {method.badge}
                </div>
              )}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${method.gradient} flex items-center justify-center mb-2 sm:mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                <method.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mb-0.5">{method.title}</h3>
              <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 truncate">{method.details[0]}</p>
              <div className="mt-2 pt-1.5 border-t border-neutral-200/50 dark:border-neutral-800/50 hidden sm:block">
                <div className="flex items-center gap-1">
                  <FiZap className="h-3 w-3 text-primary-500" />
                  <p className="text-[10px] font-semibold text-primary-600 dark:text-primary-400">{method.responseTime}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Main Content Grid - Perfect Layout */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 mb-12 lg:mb-16">
          
          {/* Left Column - Info Section (5 columns on desktop) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            {/* Business Hours Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-neutral-200/50 dark:border-neutral-800/50 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <FiClock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">Business Hours</h3>
                  <p className="text-xs text-neutral-500">We're here when you need us</p>
                </div>
              </div>
              <div className="space-y-3">
                {businessHours.map((schedule, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{schedule.day}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${schedule.status === 'closed' ? 'text-red-500' : schedule.status === 'limited' ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {schedule.hours}
                      </span>
                      {schedule.status === 'open' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Location Card */}
            <motion.a
              href="https://maps.google.com/?q=123+Design+District+New+York+NY"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="block group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-5 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FiMapPin className="h-6 w-6 text-white" />
                  </div>
                  <FiCompass className="h-5 w-5 text-white/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Visit Our Showroom</h3>
                <p className="text-white/90 text-sm mb-3">123 Design District, New York, NY 10001</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors">
                  Get Directions
                  <FiMapPin className="h-3 w-3" />
                </div>
              </div>
            </motion.a>

            {/* Quick Links - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="group bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-200 dark:border-neutral-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${link.color}-500 to-${link.color}-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <link.icon className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-0.5">{link.label}</h4>
                  <p className="text-xs text-neutral-500 hidden sm:block">{link.desc}</p>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Form (7 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-5 sm:px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <FiMessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">Send us a Message</h2>
                    <p className="text-sm text-white/90">Fill out the form and we'll get back to you</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg">
                    <FiHeadphones className="h-4 w-4 text-white" />
                    <span className="text-sm text-white font-medium">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Form Body - Optimized spacing */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'name' ? 'text-primary-500' : 'text-neutral-400'}`} />
                      <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClass('name')}
                        placeholder="John Doe" 
                      />
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                          <FiAlertCircle className="h-3 w-3" /> {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'email' ? 'text-primary-500' : 'text-neutral-400'}`} />
                      <input 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClass('email')}
                        placeholder="john@example.com" 
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                          <FiAlertCircle className="h-3 w-3" /> {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Phone & Subject Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'phone' ? 'text-primary-500' : 'text-neutral-400'}`} />
                      <input 
                        name="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClass('phone')}
                        placeholder="+1 (555) 000-0000" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">
                      Topic <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleChange}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass('subject')} appearance-none cursor-pointer pr-10`}
                      >
                        <option value="">Select a topic</option>
                        <option>Product Inquiry</option>
                        <option>Order Support</option>
                        <option>Returns & Refunds</option>
                        <option>Trade Program</option>
                        <option>Partnership</option>
                        <option>Technical Support</option>
                        <option>Feedback</option>
                        <option>Other</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                    </div>
                    <AnimatePresence>
                      {errors.subject && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                          <FiAlertCircle className="h-3 w-3" /> {errors.subject}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Conditional Order Number */}
                <AnimatePresence>
                  {formData.subject === 'Order Support' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">
                        Order Number <span className="text-red-500">*</span>
                      </label>
                      <input 
                        name="orderNumber" 
                        value={formData.orderNumber} 
                        onChange={handleChange}
                        onFocus={() => setFocusedField('orderNumber')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClass('orderNumber')}
                        placeholder="ORD-123456789" 
                      />
                      {errors.orderNumber && (
                        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                          <FiAlertCircle className="h-3 w-3" /> {errors.orderNumber}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message Field */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    className={`${inputClass('message')} resize-none`}
                    placeholder="Please provide details about your inquiry..." 
                  />
                  <div className="flex justify-between items-center mt-1.5">
                    <AnimatePresence>
                      {errors.message && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-500 flex items-center gap-1">
                          <FiAlertCircle className="h-3 w-3" /> {errors.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="h-1 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: `${Math.min((formData.message.length / 20) * 100, 100)}%` }}
                          className={`h-full rounded-full transition-all ${formData.message.length >= 20 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        />
                      </div>
                      <p className="text-[10px] font-mono text-neutral-500">
                        {formData.message.length}/20
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                    Preferred Contact Method
                  </label>
                  <div className="flex flex-nowrap overflow-x-auto gap-3">
  {[
    { value: 'email', label: 'Email', icon: FiMail },
    { value: 'phone', label: 'Phone', icon: FiPhone },
    { value: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp }
  ].map((method) => (
    <label
      key={method.value}
      className="flex items-center gap-2 shrink-0 whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 dark:has-[:checked]:bg-primary-900/20"
    >
      <input
        type="radio"
        name="preferredContact"
        value={method.value}
        checked={formData.preferredContact === method.value}
        onChange={handleChange}
        className="w-4 h-4 text-primary-600"
      />
      <method.icon className="h-3.5 w-3.5 text-neutral-500" />
      <span className="text-sm text-neutral-700 dark:text-neutral-300">
        {method.label}
      </span>
    </label>
  ))}
</div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl hover:shadow-xl disabled:opacity-60 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <FiSend className="h-4 w-4" />
                        Send Message
                      </div>
                    )}
                  </motion.button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-4 pt-3 pb-1">
                  <div className="flex items-center gap-1.5">
                    <FiShield className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs text-neutral-500">SSL Encrypted</span>
                  </div>
                  <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
                  <div className="flex items-center gap-1.5">
                    <FiUsers className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-xs text-neutral-500">50k+ Customers</span>
                  </div>
                  <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
                  <div className="flex items-center gap-1.5">
                    <FiSmile className="h-3.5 w-3.5 text-purple-500" />
                    <span className="text-xs text-neutral-500">98% Satisfaction</span>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden mb-12"
        >
          <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-md">
                <FiHelpCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h3>
                <p className="text-sm text-neutral-500">Find quick answers to common questions</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {faqs.map((faq, idx) => (
              <div key={idx} className="group">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200"
                >
                  <div className="flex-1 pr-4">
                    <h4 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                      {faq.q}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-400">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronDown className="h-5 w-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Social Connect Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-600/10 to-purple-600/10 dark:from-primary-600/20 dark:to-purple-600/20 rounded-2xl p-6 sm:p-8 border border-primary-200/50 dark:border-primary-800/50">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FiTrendingUp className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">Connect With Us</h3>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Follow us on social media for updates, inspiration, and exclusive offers
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: FiTwitter, name: 'Twitter', color: 'bg-sky-500', url: 'https://twitter.com/furniqo' },
                { icon: FiFacebook, name: 'Facebook', color: 'bg-blue-600', url: 'https://facebook.com/furniqo' },
                { icon: FiInstagram, name: 'Instagram', color: 'bg-pink-600', url: 'https://instagram.com/furniqo' },
                { icon: FiLinkedin, name: 'LinkedIn', color: 'bg-blue-700', url: 'https://linkedin.com/company/furniqo' },
                { icon: FiYoutube, name: 'YouTube', color: 'bg-red-600', url: 'https://youtube.com/@furniqo' },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4 }}
                  className="group relative"
                >
                  <div className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}>
                    <social.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs px-2 py-1 rounded-lg">
                      {social.name}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-primary-200/30 dark:border-primary-800/30">
              <p className="text-xs text-neutral-500">
                Join our community of 50,000+ happy customers • Average response time: &lt; 2 hours
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Newsletter />
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} referenceId={referenceId} />
    </div>
  );
};

export default Contact;