import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
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

  // Animated counter for social proof - Optimized with RAF
  const [displayCount, setDisplayCount] = useState(0);
  useEffect(() => {
    const target = 2547;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let animationFrame;
    let startTime = null;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      const value = Math.floor(target * progress);
      setDisplayCount(value);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayCount(target);
      }
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

  // Universal copy function
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
    copyDiscountCode();
  }, [copyDiscountCode]);

  const discountCode = 'FURNIQO10';

  // Memoized particles - Reduced count for performance
  const particles = useMemo(() => [...Array(15)].map((_, i) => ({
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
      {/* Animated Gradient Background - Simplified CSS animation */}
      <div 
        className="absolute inset-0 pointer-events-none animate-gradient-shift"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Optimized Particle Network - Using CSS animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/15 animate-float-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Simplified Glowing Orbs - CSS animations */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse-slow" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse-slower" />

      <div className="w-full px-[2%] sm:px-[3%] md:px-[4%] relative z-10">
        <div className="max-w-xl mx-auto text-center">
          {/* Premium Badge - Simplified */}
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full mb-3 border border-white/20">
            <div className="animate-spin-slow">
              <SparkleIcon className="h-2.5 w-2.5 text-amber-300" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider">
              EXCLUSIVE 10% OFF
            </span>
            <SparkleIcon className="h-2.5 w-2.5 text-amber-300" />
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1.5 tracking-tight px-2">
            Join the{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                Furniqo
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-300 to-yellow-300 rounded-full" />
            </span>
            {' '}Family
          </h2>
          
          <p className="text-[11px] sm:text-xs text-white/80 mb-4 max-w-sm mx-auto leading-relaxed px-3">
            Get <span className="font-bold text-amber-300">10% OFF</span> your first order + early access
          </p>
          
          {/* Discount Code Card - Simplified */}
          {showDiscount && (
            <div className="relative mb-4 p-2.5 sm:p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
              
              <button
                onClick={() => setShowDiscount(false)}
                className="absolute top-1.5 right-1.5 z-20 p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <FiX className="h-2.5 w-2.5 text-white" />
              </button>
              
              <div className="relative z-10 text-center">
                <p className="text-white text-[10px] sm:text-xs font-semibold mb-1.5 flex items-center justify-center gap-1">
                  <SparkleIcon className="h-3 w-3" />
                  Your code is ready!
                </p>
                
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <code 
                    ref={codeRef}
                    className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-mono text-white font-bold text-sm sm:text-base tracking-wider border border-white/30 cursor-pointer hover:bg-white/30 transition-colors select-all"
                    onClick={handleCodeClick}
                    title="Click to copy"
                  >
                    {discountCode}
                  </code>
                  
                  <button
                    onClick={copyDiscountCode}
                    className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-white text-[10px] font-medium"
                    disabled={isCopying}
                  >
                    {isCopying ? (
                      <div className="animate-spin">
                        <FiCheck className="h-3 w-3" />
                      </div>
                    ) : (
                      <FiCopy className="h-3 w-3" />
                    )}
                    <span className="hidden xs:inline">{isCopying ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-1.5 pt-1.5 border-t border-white/20">
                  <p className="text-white/80 text-[9px] flex items-center gap-1">
                    <FiClock className="h-2.5 w-2.5" />
                    Expires: <span className="font-mono font-bold text-white">{countdown ? formatCountdown(countdown) : '30:00'}</span>
                  </p>
                  
                  <Link 
                    to="/products" 
                    className="text-white text-[9px] font-semibold hover:underline flex items-center gap-1 transition-all"
                  >
                    Shop Now <FiArrowRight className="h-2 w-2" />
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {/* Compact Subscription Form */}
          <form onSubmit={handleSubmit} className="max-w-[280px] xs:max-w-sm mx-auto">
            <div className={`flex items-center gap-1.5 p-1 rounded-full transition-all duration-200 ${
              isFocused ? 'bg-white/20 ring-2 ring-white/30' : 'bg-white/10'
            }`}>
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
              
              <button
                type="submit"
                className="px-2.5 py-1 bg-white text-primary-600 rounded-full font-semibold text-[10px] sm:text-[11px] transition-all hover:bg-neutral-100 flex-shrink-0 active:scale-95"
                disabled={subscribed}
              >
                {subscribed ? (
                  <div className="flex items-center gap-0.5">
                    <FiCheck className="h-2.5 w-2.5" />
                    <span className="hidden xs:inline">Done!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-0.5">
                    <span className="hidden xs:inline">Subscribe</span>
                    <span className="xs:hidden">Sub</span>
                    <FiSend className="h-2.5 w-2.5" />
                  </div>
                )}
              </button>
            </div>
            
            {emailError && (
              <p className="text-left mt-1 text-[9px] text-red-300 px-2">
                {emailError}
              </p>
            )}
            
            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
              {[
                { icon: FiShield, label: 'No spam' },
                { icon: FiCheck, label: 'Unsubscribe' },
                { icon: FiGift, label: '10% off' },
              ].map((badge, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-0.5 text-white/50 text-[8px] sm:text-[9px] hover:text-white transition-colors duration-150"
                >
                  <badge.icon className="h-2 w-2" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </form>
          
          {/* Social Proof */}
          <div className="mt-3 flex flex-col items-center justify-center gap-1.5">
            {/* Stars Row */}
            <div className="flex items-center justify-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-300 fill-current" />
              ))}
            </div>
            
            {/* Avatars and Count Row */}
            <div className="flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Avatars */}
              <div className="flex -space-x-1 flex-shrink-0">
                {['#6366f1', '#8b5cf6', '#a855f7', '#d946ef'].map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/30 flex items-center justify-center text-white text-[7px] sm:text-[8px] font-bold transition-transform duration-150 hover:scale-110 hover:-translate-y-0.5"
                    style={{ background: color }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-[7px] sm:text-[8px] font-bold transition-transform duration-150 hover:scale-110 hover:-translate-y-0.5">
                  {displayCount.toLocaleString()}+
                </div>
              </div>
              
              {/* Count text */}
              <span className="text-[8px] sm:text-[9px] text-white/70 flex-shrink-0">
                {displayCount.toLocaleString()}+ joined this month
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 0%; opacity: 0.5; }
          50% { background-position: 100% 100%; opacity: 0.8; }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.2; }
          100% { transform: translateY(-25px) translateX(var(--tx, 15px)); opacity: 0; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 0.3; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 20s linear infinite;
        }
        
        .animate-float-particle {
          animation: float-particle linear infinite;
          --tx: 15px;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2.5s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default Newsletter;