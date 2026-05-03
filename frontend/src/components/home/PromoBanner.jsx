import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiGift, FiZap, FiTag, FiShoppingBag } from 'react-icons/fi';
import { useState, useEffect, useCallback, useRef, memo } from 'react';

const PromoBanner = () => {
  // Get target date (28 days from now, stored in localStorage)
  const getTargetDate = useCallback(() => {
    const savedTarget = localStorage.getItem('promoEndDate');
    if (savedTarget) {
      const savedDate = new Date(savedTarget);
      if (savedDate > new Date()) {
        return savedDate;
      }
    }
    
    const target = new Date();
    target.setDate(target.getDate() + 28);
    target.setHours(23, 59, 59, 999);
    
    localStorage.setItem('promoEndDate', target.toISOString());
    return target;
  }, []);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const targetDateRef = useRef(null);
  const timerRef = useRef(null);

  // Calculate time left
  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const difference = targetDateRef.current - now;
    
    if (difference <= 0) {
      setIsExpired(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }, []);

  // Initialize timer
  useEffect(() => {
    targetDateRef.current = getTargetDate();
    
    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    };
    
    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [getTargetDate, calculateTimeLeft]);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  // Expired offer view - Removed framer-motion, kept CSS transitions
  if (isExpired) {
    return (
      <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 shadow-2xl transition-opacity duration-500">
            <div className="relative z-10 p-6 sm:p-8 lg:p-12">
              <div className="items-center text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold mb-3 sm:mb-4 text-white">
                  Offer Expired!
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-6 max-w-md mx-auto">
                  Don't worry! New deals coming soon. Stay tuned for our upcoming offers.
                </p>
                <div className="inline-block transition-transform duration-200 hover:scale-103 active:scale-97">
                  <Link
                    to="/products"
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-xl"
                  >
                    Browse Products
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-orange-700 shadow-2xl transition-opacity duration-500">
          {/* Optimized Background Elements - Reduced animations, kept visual impact */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Static Background Elements - Replaced heavy motion with CSS */}
            <div className="absolute top-5 left-5 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-2xl sm:blur-3xl animate-float-slow" />
            <div className="absolute bottom-5 right-5 w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 bg-yellow-500/10 rounded-full blur-2xl sm:blur-3xl animate-float-slower" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] bg-white/5 rounded-full blur-3xl animate-pulse-slow" />

            {/* Static Sparkles - Replaced with CSS animations */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 w-1 h-1 bg-white/40 rounded-full animate-sparkle"
                style={{ 
                  left: `${10 + (i * 15)}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + (i % 2)}s`
                }}
              />
            ))}

            {/* Rotating Rings - Simplified to CSS */}
            <div className="hidden sm:block">
              <div className="absolute -top-40 -right-40 w-80 h-80 border-2 border-white/10 rounded-full animate-rotate-slow" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 border-2 border-white/10 rounded-full animate-rotate-reverse-slow" />
            </div>

            {/* Static Gradient Lines - Removed motion */}
            <div className="hidden lg:block">
              <div className="absolute top-1/4 left-0 w-64 h-1 bg-gradient-to-r from-transparent via-white to-transparent blur-sm animate-slide-right" />
              <div className="absolute bottom-1/3 right-0 w-64 h-1 bg-gradient-to-r from-transparent via-white to-transparent blur-sm animate-slide-left" />
            </div>

            {/* Particle Field - Optimized to fewer particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute bottom-0 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/30 rounded-full animate-float-up"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 3}s`
                }}
              />
            ))}
            
            {/* Static Grid Pattern - Reduced opacity animation */}
            <div className="absolute inset-0 opacity-5 animate-pulse-very-slow" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '30px 30px sm:40px 40px',
            }} />
            
            {/* Static Diagonal Lines - Removed motion */}
            <div className="hidden sm:block">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 100px)',
              }} />
            </div>

            {/* Static Floating Shapes - Removed motion */}
            <div className="hidden lg:block">
              <div className="absolute top-20 right-20 w-16 h-16 border-2 border-white/20 rounded-2xl backdrop-blur-sm animate-float-slow" />
              <div className="absolute bottom-20 left-20 w-12 h-12 border-2 border-white/20 rounded-full backdrop-blur-sm animate-float-slower" />
            </div>

            {/* Static Glowing Effect - Simplified */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-orange-500/20 animate-pulse-slow" />
          </div>
          
          <div className="relative z-10 p-5 sm:p-6 lg:p-10 xl:p-12">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              {/* Content Left Side */}
              <div className="text-white text-center lg:text-left w-full">
                {/* Multiple Badges - Removed hover animations */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 justify-center lg:justify-start">
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium">
                    <FiZap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-300" />
                    Limited
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium">
                    <FiGift className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-300" />
                    Free Ship
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium">
                    <FiTag className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-300" />
                    Extra 10%
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-display font-bold mb-2 sm:mb-3 leading-tight">
                  Up to{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 animate-pulse-very-slow">
                      40% Off
                    </span>
                    <svg className="absolute -bottom-1 left-0 w-full h-1.5 sm:h-2" viewBox="0 0 200 10">
                      <path 
                        d="M0,5 Q50,0 100,5 T200,5" 
                        fill="none" 
                        stroke="#FBBF24" 
                        strokeWidth="1.5" 
                        opacity="0.5"
                      />
                    </svg>
                  </span>
                  <br />
                  <span className="text-white/90 text-xl sm:text-2xl lg:text-3xl xl:text-5xl block sm:inline">
                    Spring Collection
                  </span>
                </h2>
                
                <p className="text-xs sm:text-sm lg:text-base text-red-100 mb-4 sm:mb-6 max-w-md mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
                  Transform your home with our new spring arrivals. 
                  Premium quality furniture at unbeatable prices.
                </p>
                
                {/* Features List - Removed hover animations */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/10 rounded-full flex items-center justify-center">
                      <FiShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-white/90">Premium</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/10 rounded-full flex items-center justify-center">
                      <FiClock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-white/90">Limited</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/10 rounded-full flex items-center justify-center">
                      <FiGift className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-white/90">Free Returns</span>
                  </div>
                </div>
                
                <div className="inline-block transition-transform duration-200 hover:scale-103 active:scale-97">
                  <Link
                    to="/offers"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-red-600 rounded-xl font-semibold text-sm sm:text-base hover:bg-red-50 transition-all duration-200 shadow-xl"
                  >
                    <span>Shop Sale</span>
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
              
              {/* Countdown Timer - Right Side */}
              <div className="flex justify-center w-full mt-4 lg:mt-0">
                <div className="w-full max-w-xs sm:max-w-sm">
                  {/* Timer Header */}
                  <div className="text-center mb-2 sm:mb-3">
                    <p className="text-white/80 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5">Hurry Up!</p>
                    <p className="text-white font-semibold text-xs sm:text-sm">Offer ends in:</p>
                  </div>
                  
                  {/* Time Blocks */}
                  <div className="flex gap-1.5 sm:gap-2 lg:gap-3 justify-center">
                    {timeBlocks.map((block) => (
                      <div key={block.label} className="text-center relative group">
                        <div className="relative">
                          {/* Static Glow Effect - CSS only */}
                          <div className="absolute inset-0 bg-white/20 rounded-lg sm:rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          
                          {/* Timer Box */}
                          <div className="relative w-12 sm:w-16 lg:w-20 xl:w-24 h-12 sm:h-16 lg:h-20 xl:h-24 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl flex flex-col items-center justify-center border border-white/20 shadow-lg transition-transform duration-200 hover:scale-105">
                            <span className="text-sm sm:text-xl lg:text-2xl xl:text-4xl font-bold text-white font-mono tabular-nums">
                              {String(block.value).padStart(2, '0')}
                            </span>
                          </div>
                          
                          {/* Label */}
                          <p className="text-[8px] sm:text-[10px] lg:text-xs text-white/80 font-medium mt-1">
                            {block.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stock Warning */}
                  <div className="mt-3 sm:mt-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/10 backdrop-blur-sm rounded-full">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-[8px] sm:text-[10px] text-white/90">Few items left!</span>
                    </div>
                  </div>

                  {/* Countdown Info */}
                  <div className="mt-2 sm:mt-3 text-center">
                    <p className="text-[8px] sm:text-[10px] text-white/60">
                      28 days offer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(PromoBanner);