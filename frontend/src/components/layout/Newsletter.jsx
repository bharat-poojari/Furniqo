import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, 
  FiArrowRight, 
  FiCheck, 
  FiGift, 
  FiShield, 
  FiX, 
  FiSend,
  FiStar,
  FiCopy,
  FiClock,
  FiAward,
  FiUsers
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// Custom SVG Icons
const SparkleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isCopying, setIsCopying] = useState(false);
  const inputRef = useRef(null);
  const sectionRef = useRef(null);
  const codeRef = useRef(null);

  // Animated counter for social proof
  const [displayCount, setDisplayCount] = useState(0);
  useEffect(() => {
    const target = 2547;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let animationFrame;
    
    const animate = () => {
      current += increment;
      if (current >= target) {
        setDisplayCount(target);
        return;
      }
      setDisplayCount(Math.floor(current));
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Countdown timer for discount expiry
  useEffect(() => {
    if (showDiscount) {
      const endTime = Date.now() + 30 * 60 * 1000;
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

  const formatCountdown = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const validateEmail = useCallback((email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  }, [emailError]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Email is required');
      inputRef.current?.focus();
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Valid email required');
      inputRef.current?.focus();
      return;
    }
    
    try {
      toast.loading('Subscribing...', { id: 'subscribe' });
      await new Promise(resolve => setTimeout(resolve, 600));
      toast.success('Welcome to Furniqo!', { id: 'subscribe' });
      setSubscribed(true);
      setShowDiscount(true);
      setEmail('');
      setEmailError('');
      
      setTimeout(() => setSubscribed(false), 2000);
    } catch (error) {
      toast.error('Try again', { id: 'subscribe' });
    }
  }, [email, validateEmail]);

  // Universal copy function that works on all platforms
  const copyDiscountCode = useCallback(async () => {
    const discountCode = 'FURNIQO10';
    setIsCopying(true);
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(discountCode);
        toast.success('Code copied!', { icon: '📋', duration: 1500 });
        setIsCopying(false);
        return;
      }
      
      const textArea = document.createElement('textarea');
      textArea.value = discountCode;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success('Code copied!', { icon: '📋', duration: 1500 });
      } else {
        throw new Error('execCommand failed');
      }
    } catch (error) {
      toast.error('Press Ctrl+C to copy', { duration: 2000 });
    } finally {
      setTimeout(() => setIsCopying(false), 800);
    }
  }, []);

  const handleCodeClick = useCallback(async () => {
    const discountCode = 'FURNIQO10';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(discountCode);
        toast.success('Code copied!', { icon: '✅', duration: 1200 });
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = discountCode;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Code copied!', { duration: 1200 });
      }
    } catch (error) {
      copyDiscountCode();
    }
  }, [copyDiscountCode]);

  const discountCode = 'FURNIQO10';

  // Reduced particles for better performance
  const particles = useMemo(() => [...Array(25)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 3,
    size: 1 + Math.random() * 2,
  })), []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-6 sm:py-8 md:py-10 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 25%, #db2777 50%, #7c3aed 75%, #4f46e5 100%)',
        backgroundSize: '200% 200%',
      }}
    >
      {/* Animated Gradient Background - Optimized */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Optimized Particle Network - Reduced count */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/15"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, particle.id % 2 === 0 ? 15 : -15, 0],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Simplified Glowing Orbs - Better performance */}
      <motion.div 
        className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-[80px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="w-full px-[2%] sm:px-[3%] md:px-[4%] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4 }}
          className="max-w-xl mx-auto text-center"
        >
          {/* Premium Badge - Optimized */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full mb-3 border border-white/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <SparkleIcon className="h-2.5 w-2.5 text-amber-300" />
            </motion.div>
            <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider">
              EXCLUSIVE 10% OFF
            </span>
            <SparkleIcon className="h-2.5 w-2.5 text-amber-300" />
          </motion.div>

          {/* Title - Responsive */}
          <motion.h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1.5 tracking-tight px-2"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.4 }}
          >
            Join the{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                Furniqo
              </span>
              <motion.span 
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-300 to-yellow-300 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              />
            </span>
            {' '}Family
          </motion.h2>
          
          <motion.p 
            className="text-[11px] sm:text-xs text-white/80 mb-4 max-w-sm mx-auto leading-relaxed px-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 0.3 }}
          >
            Get <span className="font-bold text-amber-300">10% OFF</span> your first order + early access
          </motion.p>
          
          {/* Discount Code Card */}
          <AnimatePresence mode="wait">
            {showDiscount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ type: "spring", stiffness: 500, damping: 30, duration: 0.3 }}
                className="relative mb-4 p-2.5 sm:p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-xl overflow-hidden"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                
                <motion.button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setShowDiscount(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-1.5 right-1.5 z-20 p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <FiX className="h-2.5 w-2.5 text-white" />
                </motion.button>
                
                <div className="relative z-10 text-center">
                  <motion.p 
                    className="text-white text-[10px] sm:text-xs font-semibold mb-1.5 flex items-center justify-center gap-1"
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.08 }}
                  >
                    <SparkleIcon className="h-3 w-3" />
                    Your code is ready!
                  </motion.p>
                  
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <motion.code 
                      ref={codeRef}
                      className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-mono text-white font-bold text-sm sm:text-base tracking-wider border border-white/30 cursor-pointer hover:bg-white/30 transition-colors select-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCodeClick}
                      title="Click to copy"
                    >
                      {discountCode}
                    </motion.code>
                    
                    <motion.button
                      onClick={copyDiscountCode}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-white text-[10px] font-medium"
                      disabled={isCopying}
                    >
                      {isCopying ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        >
                          <FiCheck className="h-3 w-3" />
                        </motion.div>
                      ) : (
                        <FiCopy className="h-3 w-3" />
                      )}
                      <span className="hidden xs:inline">{isCopying ? 'Copied!' : 'Copy'}</span>
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mt-1.5 pt-1.5 border-t border-white/20">
                    <motion.p 
                      className="text-white/80 text-[9px] flex items-center gap-1"
                      animate={{ scale: countdown && countdown <= 10 ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <FiClock className="h-2.5 w-2.5" />
                      Expires: <span className="font-mono font-bold text-white">{countdown ? formatCountdown(countdown) : '30:00'}</span>
                    </motion.p>
                    
                    <Link 
                      to="/products" 
                      className="text-white text-[9px] font-semibold hover:underline flex items-center gap-1 transition-all"
                    >
                      Shop Now <FiArrowRight className="h-2 w-2" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Compact Subscription Form - Single Row with smaller width on mobile */}
          <form onSubmit={handleSubmit} className="max-w-[280px] xs:max-w-sm mx-auto">
            <motion.div 
              className={`flex items-center gap-1.5 p-1 rounded-full transition-all duration-200 ${
                isFocused ? 'bg-white/20 ring-2 ring-white/30' : 'bg-white/10'
              }`}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.15 }}
            >
              <div className="relative flex-grow min-w-0">
                <FiMail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/60" />
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Email"
                  className={`w-full pl-7 pr-2 py-1.5 text-[11px] rounded-full bg-transparent text-white placeholder-white/50 focus:outline-none transition-all ${
                    emailError ? 'ring-2 ring-red-400' : ''
                  }`}
                />
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-2.5 py-1 bg-white text-primary-600 rounded-full font-semibold text-[10px] sm:text-[11px] transition-all hover:bg-neutral-100 flex-shrink-0"
                disabled={subscribed}
              >
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      className="flex items-center gap-0.5"
                    >
                      <FiCheck className="h-2.5 w-2.5" />
                      <span className="hidden xs:inline">Done!</span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="subscribe" 
                      className="flex items-center gap-0.5"
                    >
                      <span className="hidden xs:inline">Subscribe</span>
                      <span className="xs:hidden">Sub</span>
                      <FiSend className="h-2.5 w-2.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
            
            <AnimatePresence>
              {emailError && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-left mt-1 text-[9px] text-red-300 px-2"
                >
                  {emailError}
                </motion.p>
              )}
            </AnimatePresence>
            
            {/* Trust Badges - Compact */}
            <motion.div 
              className="flex items-center justify-center gap-2 mt-2 flex-wrap"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              {[
                { icon: FiShield, label: 'No spam' },
                { icon: FiCheck, label: 'Unsubscribe' },
                { icon: FiGift, label: '10% off' },
              ].map((badge, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-0.5 text-white/50 text-[8px] sm:text-[9px]"
                  whileHover={{ scale: 1.05, color: 'white' }}
                  transition={{ duration: 0.15 }}
                >
                  <badge.icon className="h-2 w-2" />
                  <span>{badge.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </form>
          
          {/* Social Proof - Stars on top, then avatars and count in one row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="mt-3 flex flex-col items-center justify-center gap-1.5"
          >
            {/* Stars Row - Top */}
            <motion.div 
              className="flex items-center justify-center gap-0.5"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.03 }}
                >
                  <FiStar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-300 fill-current" />
                </motion.div>
              ))}
            </motion.div>
            
            {/* Avatars and Count Row - Bottom */}
            <div className="flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Avatars */}
              <div className="flex -space-x-1 flex-shrink-0">
                {['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'].map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.03, type: "spring", stiffness: 500 }}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/30 flex items-center justify-center text-white text-[7px] sm:text-[8px] font-bold"
                    style={{ background: color }}
                    whileHover={{ scale: 1.15, y: -2 }}
                  >
                    {String.fromCharCode(65 + i)}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.72, type: "spring", stiffness: 500 }}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-[7px] sm:text-[8px] font-bold"
                  whileHover={{ scale: 1.15, y: -2 }}
                >
                  {displayCount.toLocaleString()}+
                </motion.div>
              </div>
              
              {/* Count text */}
              <motion.span 
                className="text-[8px] sm:text-[9px] text-white/70 flex-shrink-0"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {displayCount.toLocaleString()}+ joined this month
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;