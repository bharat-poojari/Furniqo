import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, 
  FiArrowRight, 
  FiCheck, 
  FiGift, 
  FiShield, 
  FiX, 
  FiHeart, 
  FiSend,
  FiStar,
  FiUsers,
  FiTrendingUp,
  FiCopy,
  FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// Custom SVG Icons
const SparkleIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const EnvelopeIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const inputRef = useRef(null);

  // Animated counter for social proof
  const [displayCount, setDisplayCount] = useState(0);
  useEffect(() => {
    const target = 2547;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayCount(target);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Countdown timer for discount expiry
  useEffect(() => {
    if (showDiscount) {
      const endTime = Date.now() + 30 * 60 * 1000; // 30 minutes demo
      const timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setCountdown(remaining);
        if (remaining <= 0) {
          setShowDiscount(false);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showDiscount]);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Email address is required');
      inputRef.current?.focus();
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      inputRef.current?.focus();
      return;
    }
    
    try {
      toast.loading('Subscribing...', { id: 'subscribe' });
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.success('Welcome to the Furniqo family!', { id: 'subscribe' });
      setSubscribed(true);
      setShowDiscount(true);
      setEmail('');
      setEmailError('');
      
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error) {
      toast.error('Something went wrong. Try again.', { id: 'subscribe' });
    }
  };

  const copyDiscountCode = () => {
    navigator.clipboard.writeText('FURNIQO10');
    toast.success('Discount code copied!');
  };

  const discountCode = 'FURNIQO10';

  return (
    <section className="relative py-8 lg:py-10 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }} />
      </div>
      
      {/* Floating gradient orbs */}
      <motion.div 
        className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px]"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-[60px]"
        animate={{ scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/8"
            style={{ left: `${5 + i * 8}%`, top: `${10 + (i % 3) * 25}%` }}
            animate={{
              y: [0, -15, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              opacity: [0.15, 0.3, 0.15],
              rotate: [0, i % 2 === 0 ? 15 : -15, 0],
            }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          >
            {i % 3 === 0 ? <EnvelopeIcon className="h-5 w-5" /> : 
             i % 3 === 1 ? <SparkleIcon className="h-4 w-4" /> : 
             <FiGift className="h-5 w-5" />}
          </motion.div>
        ))}
      </div>
      
      <div className="w-full px-[1%] relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-4 border border-white/10"
          >
            <SparkleIcon className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Limited Time Offer</span>
            <SparkleIcon className="h-3.5 w-3.5 text-amber-300" />
          </motion.div>

          {/* Title */}
          <motion.h2 
            className="text-xl lg:text-3xl font-extrabold text-white mb-2 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join the <span className="text-amber-300">Furniqo</span> Family
          </motion.h2>
          
          <motion.p 
            className="text-sm lg:text-base text-primary-100 mb-5 max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Subscribe and get <span className="font-bold text-white">10% off</span> your first order, plus exclusive access to new collections and design inspiration.
          </motion.p>
          
          {/* Discount Code Display */}
          <AnimatePresence>
            {showDiscount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mb-5 p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-2xl shadow-amber-500/30 cursor-pointer group relative overflow-hidden"
                onClick={copyDiscountCode}
              >
                {/* Animated shimmer */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDiscount(false); }}
                  className="absolute top-2 right-2 p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors z-10"
                >
                  <FiX className="h-3.5 w-3.5 text-white" />
                </button>
                
                <div className="relative z-10 text-center">
                  <p className="text-white text-sm font-medium mb-2 flex items-center justify-center gap-1.5">
                    <SparkleIcon className="h-4 w-4" />
                    Your 10% OFF code is ready!
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <code className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-lg font-mono text-white font-bold text-xl tracking-widest border border-white/30">
                      {discountCode}
                    </code>
                    <span className="text-white/70 text-xs flex items-center gap-1">
                      <FiCopy className="h-3 w-3" /> Click to copy
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <p className="text-white/70 text-[10px] flex items-center gap-1">
                      <FiClock className="h-3 w-3" />
                      Expires in {countdown ? formatCountdown(countdown) : '30:00'}
                    </p>
                    <Link to="/products" className="text-white text-[10px] font-semibold hover:underline flex items-center gap-1">
                      Shop Now <FiArrowRight className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <motion.div 
              className={`flex flex-col sm:flex-row gap-2 p-1.5 rounded-xl transition-all duration-300 ${
                isFocused ? 'bg-white/15 ring-2 ring-white/30' : 'bg-white/10'
              }`}
            >
              <div className="relative flex-grow">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-300" />
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your email address"
                  className={`w-full pl-9 pr-3 py-2.5 sm:py-2 text-sm rounded-lg bg-transparent text-white placeholder-primary-300/70 focus:outline-none transition-all ${
                    emailError ? 'ring-2 ring-red-400' : ''
                  }`}
                />
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 sm:py-2 bg-white text-primary-600 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:bg-neutral-100 shadow-lg flex-shrink-0"
                disabled={subscribed}
              >
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <FiCheck className="h-4 w-4" />
                      <span>Subscribed!</span>
                    </motion.div>
                  ) : (
                    <motion.div key="subscribe" className="flex items-center gap-1.5">
                      <span>Subscribe</span>
                      <FiSend className="h-3.5 w-3.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
            
            {emailError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left mt-1.5 text-xs text-red-300 flex items-center gap-1"
              >
                <span className="w-1 h-1 rounded-full bg-red-300" />
                {emailError}
              </motion.p>
            )}
            
            {/* Trust Badges */}
            <motion.div 
              className="flex items-center justify-center gap-4 mt-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {[
                { icon: FiShield, label: 'No spam, ever' },
                { icon: FiCheck, label: 'Unsubscribe anytime' },
                { icon: FiGift, label: '10% off instantly' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-primary-200 text-[10px]">
                  <badge.icon className="h-3 w-3" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </motion.div>
            
            {/* Privacy */}
            <p className="text-[10px] text-primary-300/60 mt-3">
              By subscribing, you agree to our{' '}
              <a href="/policies/privacy" className="underline hover:text-white transition-colors">
                Privacy Policy
              </a>
            </p>
          </form>
          
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {/* Avatar Group */}
            <div className="flex -space-x-2">
              {['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'].map((color, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="w-7 h-7 rounded-full border-2 border-primary-600 flex items-center justify-center text-white text-[9px] font-bold"
                  style={{ background: color }}
                >
                  {String.fromCharCode(65 + i)}
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="w-7 h-7 rounded-full bg-white/20 border-2 border-primary-600 flex items-center justify-center text-white text-[9px] font-bold"
              >
                +{displayCount.toLocaleString()}
              </motion.div>
            </div>
            
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-1 text-amber-300 justify-center sm:justify-start">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-[11px] text-primary-200 mt-0.5">
                <span className="font-bold text-white">{displayCount.toLocaleString()}+</span> furniture lovers joined this month
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;