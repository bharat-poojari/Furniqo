import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowRight, FiCheck, FiGift, FiShield, FiX, FiHeart, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Validate email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  // Handle submit with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Simulate API call
    try {
      // Show loading toast
      toast.loading('Subscribing...', { id: 'subscribe' });
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      toast.success('Welcome to the Furniqo family! 🎉', { id: 'subscribe' });
      setSubscribed(true);
      setShowDiscount(true);
      setEmail('');
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
      
      // Auto-hide discount code after 10 seconds
      setTimeout(() => {
        setShowDiscount(false);
      }, 10000);
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.', { id: 'subscribe' });
    }
  };

  // Copy discount code to clipboard
  const copyDiscountCode = () => {
    navigator.clipboard.writeText('FURNIQO10');
    toast.success('Discount code copied! 🎁', {
      icon: '📋',
      duration: 2000,
    });
  };

  const discountCode = 'FURNIQO10';

  return (
    <section className="relative py-8 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>
      
      {/* Animated Decorations */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, -90, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-white/10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <FiGift className="w-16 h-16" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/4 text-white/10"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <FiHeart className="w-12 h-12" />
      </motion.div>
      
      <div className="w-full px-[1%] sm:px-[1.5%] relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4"
          >
            <FiGift className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Limited Offer
            </span>
          </motion.div>

          {/* Title with gradient animation */}
          <motion.h2 
            className="text-2xl lg:text-4xl font-display font-bold text-white mb-3"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            Join the Furniqo Family
          </motion.h2>
          
          <motion.p 
            className="text-sm lg:text-base text-primary-100 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Subscribe and get <span className="font-bold text-white">10% off</span> your first order, plus exclusive access to new collections and design inspiration.
          </motion.p>
          
          {/* Discount Code Display */}
          <AnimatePresence>
            {showDiscount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="mb-6 p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg cursor-pointer group relative"
                onClick={copyDiscountCode}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDiscount(false);
                  }}
                  className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
                >
                  <FiX className="h-4 w-4" />
                </button>
                <div className="text-center">
                  <p className="text-white text-sm font-medium mb-1">🎉 Your 10% OFF code is ready!</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg font-mono text-white font-bold text-lg tracking-wider">
                      {discountCode}
                    </code>
                    <span className="text-white/80 text-sm group-hover:text-white transition-colors">
                      (Click to copy)
                    </span>
                  </div>
                  <p className="text-white/80 text-xs mt-2">
                    Valid for first order • Expires in 30 days
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-300" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  required
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-white/10 backdrop-blur-sm border text-white placeholder-primary-200 focus:outline-none focus:ring-2 transition-all ${
                    emailError 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-white/20 focus:bg-white/20 focus:border-white/40 focus:ring-primary-300'
                  }`}
                />
                {emailError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 -bottom-5 text-xs text-red-200"
                  >
                    {emailError}
                  </motion.p>
                )}
              </div>
              
              <motion.button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden px-4 py-2.5 bg-white text-primary-600 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 group"
                disabled={subscribed}
              >
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.div
                      key="check"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <FiCheck className="h-4 w-4" />
                      <span>Subscribed!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="arrow"
                      initial={{ x: 0, opacity: 1 }}
                      animate={{ x: isHovered ? -5 : 0 }}
                      className="flex items-center gap-2"
                    >
                      <span>Subscribe</span>
                      <FiSend className={`h-4 w-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Button hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50"
                  initial={{ x: '100%' }}
                  animate={{ x: isHovered ? '0%' : '100%' }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {!subscribed && (
                    <>
                      <span>Subscribe</span>
                      <FiArrowRight className={`h-4 w-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                    </>
                  )}
                </span>
              </motion.button>
            </div>
            
            {/* Trust badges */}
            <motion.div 
              className="flex items-center justify-center gap-4 mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-1.5 text-primary-200 text-xs">
                <FiShield className="h-3 w-3" />
                <span>No spam</span>
              </div>
              <div className="w-px h-3 bg-primary-300/50" />
              <div className="flex items-center gap-1.5 text-primary-200 text-xs">
                <FiCheck className="h-3 w-3" />
                <span>Unsubscribe anytime</span>
              </div>
              <div className="w-px h-3 bg-primary-300/50" />
              <div className="flex items-center gap-1.5 text-primary-200 text-xs">
                <FiGift className="h-3 w-3" />
                <span>10% off code</span>
              </div>
            </motion.div>
            
            {/* Privacy policy link */}
            <p className="text-xs text-primary-200/80 mt-4">
              By subscribing, you agree to our{' '}
              <a href="/privacy" className="underline hover:text-white transition-colors">
                Privacy Policy
              </a>
              . We respect your inbox.
            </p>
          </form>
          
          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 border-2 border-primary-600"
                />
              ))}
            </div>
            <p className="text-xs text-primary-200">
              <span className="font-bold text-white">2,500+</span> subscribers joined this week
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;