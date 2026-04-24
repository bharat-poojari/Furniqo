import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiGift, FiZap, FiTag, FiShoppingBag } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const PromoBanner = () => {
  // Set target date (3 days from now or specific date)
  // You can change this to any future date
  const getTargetDate = () => {
    const savedTarget = localStorage.getItem('promoEndDate');
    if (savedTarget) {
      return new Date(savedTarget);
    }
    
    // Set to 3 days from now at 23:59:59
    const target = new Date();
    target.setDate(target.getDate() + 3);
    target.setHours(23, 59, 59, 999);
    
    localStorage.setItem('promoEndDate', target.toISOString());
    return target;
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const targetDate = getTargetDate();
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference <= 0) {
        setIsExpired(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Function to reset or extend the promo (optional)
  const extendPromo = (days = 3) => {
    const newTarget = new Date();
    newTarget.setDate(newTarget.getDate() + days);
    newTarget.setHours(23, 59, 59, 999);
    localStorage.setItem('promoEndDate', newTarget.toISOString());
    setIsExpired(false);
    // Force recalculation
    const difference = newTarget - new Date();
    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    });
  };

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  const bannerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { delay: 0.2, duration: 0.5 }
    },
  };

  const timerVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { delay: 0.3, duration: 0.5 }
    },
  };

  const timeBlockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.4 + (i * 0.1), duration: 0.4 }
    }),
  };

  // If promo is expired, show different content
  if (isExpired) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <motion.div
            variants={bannerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 shadow-2xl"
          >
            <div className="relative z-10 p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="text-white">
                  <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
                    Offer Expired!
                  </h2>
                  <p className="text-lg text-gray-200 mb-6">
                    Don't worry! New deals coming soon. Stay tuned for our upcoming offers.
                  </p>
                  <Link
                    to="/products"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
                  >
                    Browse Products
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-orange-700 shadow-2xl"
        >
          {/* Animated Background Patterns */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }} />
            
            {/* Diagonal Lines */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 100px)',
            }} />
          </div>
          
          <div className="relative z-10 p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Content Left Side */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-white"
              >
                {/* Multiple Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
                    <FiZap className="h-3.5 w-3.5 text-yellow-300" />
                    Limited Time
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
                    <FiGift className="h-3.5 w-3.5 text-yellow-300" />
                    Free Shipping
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
                    <FiTag className="h-3.5 w-3.5 text-yellow-300" />
                    Extra 10% Off
                  </span>
                </div>
                
                <h2 className="text-4xl lg:text-6xl font-display font-bold mb-5 leading-tight">
                  Up to{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                      40% Off
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 10">
                      <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="#FBBF24" strokeWidth="2" opacity="0.5"/>
                    </svg>
                  </span>
                  <br />
                  <span className="text-white/90">Spring Collection</span>
                </h2>
                
                <p className="text-lg text-red-100 mb-8 max-w-md leading-relaxed">
                  Transform your home with our new spring arrivals. 
                  Premium quality furniture at unbeatable prices.
                </p>
                
                {/* Features List */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <FiShoppingBag className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-white/90">Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <FiClock className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-white/90">Limited Stock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <FiGift className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-white/90">Free Returns</span>
                  </div>
                </div>
                
                <Link
                  to="/offers"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 rounded-xl font-semibold text-lg hover:bg-red-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                >
                  <span>Shop the Sale</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
              
              {/* Countdown Timer - Right Side */}
              <motion.div
                variants={timerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex justify-center lg:justify-end"
              >
                <div>
                  {/* Timer Header */}
                  <div className="text-center mb-6">
                    <p className="text-white/80 text-sm uppercase tracking-wider mb-1">Hurry Up!</p>
                    <p className="text-white font-semibold text-lg">Offer ends in:</p>
                  </div>
                  
                  {/* Time Blocks */}
                  <div className="flex gap-3 lg:gap-4 justify-center">
                    {timeBlocks.map((block, index) => (
                      <motion.div
                        key={block.label}
                        custom={index}
                        variants={timeBlockVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center relative group"
                      >
                        <div className="relative">
                          {/* Glow Effect */}
                          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Timer Box */}
                          <div className="relative w-16 lg:w-24 h-16 lg:h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-white/20 shadow-lg transform group-hover:scale-105 transition-all duration-300">
                            <span className="text-2xl lg:text-4xl font-bold text-white font-mono">
                              {String(block.value).padStart(2, '0')}
                            </span>
                          </div>
                          
                          {/* Label */}
                          <p className="text-xs lg:text-sm text-white/80 font-medium mt-2">
                            {block.label}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Stock Warning */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-xs text-white/90">Only few items left!</span>
                    </div>
                  </div>

                  {/* Countdown Info */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-white/60">
                      Offer valid until {new Date(localStorage.getItem('promoEndDate')).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoBanner;