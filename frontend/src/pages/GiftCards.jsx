import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  FiGift, 
  FiSend, 
  FiCreditCard, 
  FiMail, 
  FiArrowRight, 
  FiCheck,
  FiX,
  FiUser,
  FiHeart,
  FiStar,
  FiCalendar,
  FiCopy,
  FiDollarSign,
  FiPackage,
  FiMessageCircle,
  FiChevronDown,
  FiChevronRight,
  FiZap,
  FiClock,
  FiShoppingBag,
  FiSmile
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';

// Custom SVG Icons
const GiftBoxIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2m0 0V5.5A2.5 2.5 0 109.5 8H12m-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const SparkleIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// Floating Particles Component
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: Math.random() * 6 + 2,
          height: Math.random() * 6 + 2,
          background: i % 3 === 0 ? 'rgba(255,255,255,0.4)' : i % 3 === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,200,100,0.3)',
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          opacity: [0, 0.8, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Animated Counter
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime = null;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setDisplayValue(Math.floor(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{displayValue}</span>;
};

// Purchase Modal
const PurchaseModal = ({ isOpen, onClose, amount, isCustom = false }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipientName: '', recipientEmail: '', senderName: '', senderEmail: '',
    message: '', deliveryDate: '', quantity: 1
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recipientEmail || !formData.senderEmail) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setStep(1);
      setFormData({ recipientName: '', recipientEmail: '', senderName: '', senderEmail: '', message: '', deliveryDate: '', quantity: 1 });
    }, 3000);
  };

  const total = (amount || 0) * formData.quantity;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }} 
                  className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5"
                >
                  <FiCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <motion.h3 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-xl font-bold dark:text-white mb-2">Gift Card Sent!</motion.h3>
                <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-sm text-neutral-500 mb-2">${total} gift card sent to {formData.recipientEmail}</motion.p>
                <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs text-neutral-400 font-mono">GC-{Math.random().toString(36).substring(2, 8).toUpperCase()}</motion.p>
                <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} onClick={onClose} className="mt-5 px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">Done</motion.button>
              </motion.div>
            ) : (
              <>
                <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-5 text-white overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  <FloatingParticles />
                  <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors z-10">
                    <FiX className="h-4 w-4" />
                  </button>
                  <div className="relative text-center">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                      <GiftBoxIcon className="h-10 w-10 mx-auto mb-2 opacity-80" />
                    </motion.div>
                    <h3 className="text-lg font-bold">${amount} Gift Card</h3>
                    <p className="text-sm text-white/70">Step {step} of 2</p>
                  </div>
                  <div className="flex gap-1.5 mt-4">
                    <motion.div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} animate={{ width: step >= 1 ? '100%' : '0%' }} />
                    <motion.div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} animate={{ width: step >= 2 ? '100%' : '0%' }} />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-5">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Recipient Name *</label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input name="recipientName" value={formData.recipientName} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="Their name" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Recipient Email *</label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input name="recipientEmail" type="email" value={formData.recipientEmail} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="their@email.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Personal Message</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white resize-none" placeholder="Happy Birthday! Hope you find something you love..." />
                        <p className="text-[10px] text-neutral-400 mt-1">{formData.message.length}/500 characters</p>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
                        <button type="button" onClick={() => setStep(2)} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">Continue <FiArrowRight className="h-4 w-4" /></button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Your Name *</label>
                          <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input name="senderName" value={formData.senderName} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="Your name" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Your Email *</label>
                          <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input name="senderEmail" type="email" value={formData.senderEmail} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="your@email.com" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Delivery Date</label>
                          <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input name="deliveryDate" type="date" value={formData.deliveryDate} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Quantity</label>
                          <select name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer">
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </div>

                      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Order Summary</h4>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between"><span className="text-neutral-500">Card Value</span><span className="font-semibold dark:text-white">${amount}</span></div>
                          <div className="flex justify-between"><span className="text-neutral-500">Quantity</span><span className="font-semibold dark:text-white">x{formData.quantity}</span></div>
                          <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-700 pt-1.5"><span className="font-semibold dark:text-white">Total</span><span className="font-bold text-primary-600 text-lg">${total}</span></div>
                        </div>
                      </motion.div>

                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Back</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2">
                          {loading ? (
                            <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </motion.svg>
                          ) : <FiSend className="h-4 w-4" />}
                          {loading ? 'Processing...' : 'Complete Purchase'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const GiftCards = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const cards = [
    { amount: 50, popular: false, color: 'from-pink-400 to-rose-500', bgColor: 'bg-pink-50 dark:bg-pink-900/20', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80' },
    { amount: 100, popular: true, color: 'from-purple-400 to-violet-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&q=80' },
    { amount: 250, popular: false, color: 'from-blue-400 to-cyan-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20', image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=400&q=80' },
    { amount: 500, popular: false, color: 'from-emerald-400 to-teal-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=80' },
  ];

  const features = [
    { icon: FiZap, title: 'Instant Delivery', desc: 'Sent via email within minutes', color: 'from-amber-400 to-orange-500' },
    { icon: FiCreditCard, title: 'No Fees', desc: 'No activation or hidden fees', color: 'from-emerald-400 to-teal-500' },
    { icon: FiMessageCircle, title: 'Personal Message', desc: 'Add a custom gift message', color: 'from-blue-400 to-cyan-500' },
    { icon: FiClock, title: 'No Expiration', desc: 'Gift cards never expire', color: 'from-purple-400 to-indigo-500' },
    { icon: FiPackage, title: 'Works Sitewide', desc: 'Valid on all products', color: 'from-rose-400 to-pink-500' },
    { icon: FiCopy, title: 'Easy to Redeem', desc: 'Enter code at checkout', color: 'from-teal-400 to-green-500' },
  ];

  const faqs = [
    { q: 'How are gift cards delivered?', a: 'Gift cards are delivered instantly via email. You can also schedule delivery for a specific date.' },
    { q: 'Do gift cards expire?', a: 'No! Our gift cards never expire and have no maintenance fees ever.' },
    { q: 'Can I buy multiple gift cards?', a: 'Yes! Select the quantity during checkout to purchase multiple cards.' },
    { q: 'How do I check my balance?', a: 'Visit your account or contact support with your gift card code.' },
  ];

  const handleSelectCard = (amount) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setShowPurchaseModal(true);
  };

  const handleCustomPurchase = () => {
    if (!customAmount || customAmount < 25 || customAmount > 2000) return;
    setSelectedAmount(parseInt(customAmount));
    setIsCustom(true);
    setShowPurchaseModal(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      
      {/* Hero Section with Parallax */}
      <motion.section 
        ref={heroRef}
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&q=80" 
            alt="" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pink-900/30" />
        
        {/* Pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        </div>

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Animated Orbs */}
        <motion.div animate={{ x: [0, 60, 0], y: [0, -40, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-10 left-[5%] w-[500px] h-[500px] bg-pink-400/20 rounded-full blur-[120px]" />
        <motion.div animate={{ x: [0, -50, 0], y: [0, 50, 0] }} transition={{ duration: 18, repeat: Infinity }} className="absolute bottom-10 right-[5%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px]" />
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, delay: 3 }} className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-400/15 rounded-full blur-[80px]" />

        {/* Floating Gift Boxes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${5 + i * 12}%`, top: `${15 + (i % 4) * 20}%` }}
              animate={{
                y: [0, -25, 0],
                x: [0, i % 2 === 0 ? 15 : -15, 0],
                rotate: [0, i % 2 === 0 ? 15 : -15, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
            >
              <GiftBoxIcon className="h-6 w-6 text-white/20" />
            </motion.div>
          ))}
        </div>

        <div className="relative w-full px-[1%] py-16 lg:py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-sm font-semibold mb-6 border border-white/10"
              >
                <SparkleIcon className="h-4 w-4" />
                <span>Gift Cards</span>
                <SparkleIcon className="h-4 w-4" />
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 leading-[1.05] tracking-tight"
              >
                Give the Gift of{' '}
                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                  Great Design
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
              >
                The perfect present for housewarmings, weddings, or any special occasion.
                Let them choose furniture they'll love.
              </motion.p>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-6 sm:gap-10"
              >
                {[
                  { value: 50000, label: 'Gift Cards Sold', suffix: '+' },
                  { value: 98, label: 'Satisfaction', suffix: '%' },
                  { value: 24, label: 'Hour Delivery', suffix: '/7' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl sm:text-3xl font-black">
                      <AnimatedCounter value={stat.value} />
                      {stat.suffix}
                    </div>
                    <div className="text-xs sm:text-sm text-white/60 mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div className="w-1.5 h-3 bg-white/60 rounded-full mt-2" animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
          </div>
        </motion.div>
      </motion.section>

      {/* Gift Card Options - Full Width */}
      <section className="w-full px-[1%] py-10 lg:py-14">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Choose Your Amount</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Select a preset amount or enter your own</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.amount}
              initial={{ opacity: 0, y: 30, rotateY: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ y: -8, scale: 1.04 }}
              onHoverStart={() => setHoveredCard(i)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => handleSelectCard(card.amount)}
              className={`relative ${card.bgColor} rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${
                card.popular
                  ? 'border-purple-400 dark:border-purple-500 shadow-xl shadow-purple-500/15'
                  : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 shadow-md hover:shadow-xl'
              }`}
            >
              {/* Card Image Background */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <img src={card.image} alt="" className="w-full h-full object-cover" />
              </div>
              
              {/* Hover Glow Effect */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {card.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10"
                >
                  <SparkleIcon className="h-3 w-3" />
                  Most Popular
                </motion.div>
              )}

              <div className="relative z-10 p-5 lg:p-6 text-center">
                <motion.div 
                  animate={{ scale: hoveredCard === i ? 1.15 : 1, rotate: hoveredCard === i ? 5 : 0 }}
                  className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}
                >
                  <FiGift className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                </motion.div>
                <h3 className="text-2xl lg:text-3xl font-black dark:text-white mt-2">${card.amount}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-4">Gift Card</p>
                <motion.div 
                  animate={{ x: hoveredCard === i ? 3 : 0 }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400"
                >
                  Select <FiArrowRight className="h-4 w-4" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Amount */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="max-w-sm mx-auto mt-6 text-center"
        >
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">Or enter a custom amount ($25 - $2,000)</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Custom amount"
                min="25"
                max="2000"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCustomPurchase}
              className="px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors flex-shrink-0 shadow-sm"
            >
              Add to Cart
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid - Full Width */}
      <section className="w-full px-[1%] py-10 lg:py-14 bg-neutral-50 dark:bg-neutral-900/50">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Why Gift Cards</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">The perfect way to share great design</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 lg:gap-3">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }} 
              transition={{ delay: i * 0.05, type: "spring" }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="group bg-white dark:bg-neutral-800 rounded-xl p-4 text-center border border-neutral-100 dark:border-neutral-700 hover:shadow-lg transition-all duration-300"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mx-auto mb-2.5 shadow-sm`}
              >
                <f.icon className="h-5 w-5 text-white" />
              </motion.div>
              <h4 className="font-bold text-xs lg:text-sm dark:text-white mb-1">{f.title}</h4>
              <p className="text-[10px] lg:text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ + Bottom CTA */}
      <section className="w-full px-[1%] py-10 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          {/* FAQ */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl lg:text-2xl font-bold dark:text-white mb-4">Common Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-3.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-neutral-800 dark:text-white pr-3">{faq.q}</span>
                    <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <FiChevronDown className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <p className="px-3.5 pb-3.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-6 lg:p-8 text-white text-center flex flex-col justify-center"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            <FloatingParticles />
            
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="relative z-10">
              <GiftBoxIcon className="h-12 w-12 mx-auto mb-3 opacity-80" />
            </motion.div>
            <h2 className="text-xl lg:text-2xl font-bold mb-2 relative z-10">Ready to Send a Gift?</h2>
            <p className="text-sm text-white/70 mb-5 relative z-10">Give the gift of great design today. It takes less than 2 minutes!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedAmount(100); setIsCustom(false); setShowPurchaseModal(true); }}
              className="relative z-10 px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-all shadow-xl inline-flex items-center gap-2"
            >
              Buy a Gift Card <FiArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Newsletter />

      {/* Purchase Modal */}
      <PurchaseModal 
        isOpen={showPurchaseModal} 
        onClose={() => setShowPurchaseModal(false)} 
        amount={selectedAmount} 
        isCustom={isCustom}
      />
    </div>
  );
};

export default GiftCards;