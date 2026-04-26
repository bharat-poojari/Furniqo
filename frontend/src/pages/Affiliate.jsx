import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDollarSign, FiUsers, FiTrendingUp, FiGift, FiArrowRight, 
  FiCheck, FiAward, FiClock, FiPercent, FiTarget, FiStar, 
  FiBarChart2, FiGlobe, FiZap, FiHeart, FiLink, FiCreditCard,
  FiX, FiMail, FiUser, FiMessageSquare, FiSend, FiFileText,
  FiAlertCircle, FiThumbsUp, FiInstagram, FiYoutube, FiTwitter,
  FiBriefcase, FiMapPin, FiGlobe as FiGlobeIcon
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Affiliate = () => {
  const [hoveredBenefit, setHoveredBenefit] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    audience: '',
    platform: '',
    country: '',
    experience: '',
    hearAbout: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const benefits = [
    {
      icon: FiDollarSign,
      title: '10% Commission',
      description: 'Earn 10% on every sale you refer. No cap on earnings.',
      color: 'from-green-500 to-emerald-600',
      metric: 'Unlimited',
    },
    {
      icon: FiTrendingUp,
      title: '30-Day Cookies',
      description: 'Long cookie duration means more time to earn commissions.',
      color: 'from-blue-500 to-cyan-600',
      metric: '30 Days',
    },
    {
      icon: FiGift,
      title: 'Performance Bonuses',
      description: 'Hit targets and earn extra bonuses on top of commissions.',
      color: 'from-purple-500 to-pink-600',
      metric: 'Up to +5%',
    },
    {
      icon: FiUsers,
      title: 'Dedicated Support',
      description: 'Get personalized support from our affiliate team.',
      color: 'from-orange-500 to-red-600',
      metric: '24/7',
    },
  ];

  const steps = [
    { 
      step: '01', 
      title: 'Apply', 
      description: 'Fill out our simple application form',
      icon: FiCheck,
      time: '5 minutes'
    },
    { 
      step: '02', 
      title: 'Get Approved', 
      description: 'We review within 24 hours',
      icon: FiClock,
      time: 'Fast approval'
    },
    { 
      step: '03', 
      title: 'Share', 
      description: 'Start sharing your unique link',
      icon: FiLink,
      time: 'Anywhere'
    },
    { 
      step: '04', 
      title: 'Earn', 
      description: 'Get paid monthly via PayPal',
      icon: FiCreditCard,
      time: 'Monthly payout'
    },
  ];

  const features = [
    { icon: FiTarget, text: 'Real-time tracking dashboard' },
    { icon: FiBarChart2, text: 'Detailed analytics & reports' },
    { icon: FiGlobe, text: 'Global program acceptance' },
    { icon: FiZap, text: 'Instant payment processing' },
    { icon: FiHeart, text: 'Exclusive partner perks' },
    { icon: FiStar, text: 'Early access to new products' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', earnings: '$12,450', image: 'https://randomuser.me/api/portraits/women/1.jpg', role: 'Lifestyle Blogger' },
    { name: 'Mike Thompson', earnings: '$8,230', image: 'https://randomuser.me/api/portraits/men/2.jpg', role: 'YouTuber' },
    { name: 'Emma Davis', earnings: '$15,670', image: 'https://randomuser.me/api/portraits/women/3.jpg', role: 'Interior Designer' },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowApplyModal(false);
    setShowSuccessModal(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      website: '',
      audience: '',
      platform: '',
      country: '',
      experience: '',
      hearAbout: '',
      message: ''
    });
    
    toast.success('Application submitted successfully! We\'ll review within 24 hours.');
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowContactModal(false);
    toast.success('Message sent! Our team will get back to you shortly.');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section with Background Image - Same as before */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/85 to-purple-900/80 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
            alt="Affiliate Marketing Background"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                y: [null, -100, -200],
                opacity: [0, 0.5, 0],
                x: [null, Math.random() * 100 - 50],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            >
              <FiDollarSign className="h-8 w-8" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-30 w-full px-[1%] sm:px-[1.5%] py-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 text-white"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
              >
                <FiPercent className="h-4 w-4" />
                Affiliate Program
              </motion.span>
              
              <motion.h1 
                className="text-5xl lg:text-7xl xl:text-8xl font-bold mb-6 text-white leading-tight"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Earn With
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Furniqo
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-white/90 max-w-2xl mb-8 leading-relaxed"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Join our affiliate program and earn 10% commission on every sale you refer. 
                No caps, no limits, just pure earning potential.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex gap-4 flex-wrap"
              >
                <Button 
                  variant="primary" 
                  size="lg" 
                  icon={FiArrowRight} 
                  onClick={() => setShowApplyModal(true)}
                  className="shadow-2xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all"
                >
                  Start Earning Now
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setShowContactModal(true)}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  Learn More
                </Button>
              </motion.div>

              <motion.div 
                className="flex items-center gap-6 mt-12 pt-8 border-t border-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40"
                    />
                  ))}
                </div>
                <div className="text-white/80 text-sm">
                  <span className="font-bold text-white">500+</span> active affiliates
                </div>
                <div className="text-white/80 text-sm">
                  <span className="font-bold text-white">$2M+</span> paid in commissions
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-2 bg-white rounded-full mt-2"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Benefits Section - Same as before */}
      <section className="py-24 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">Why Join</span>
              <h2 className="text-3xl md:text-5xl font-bold mt-3 dark:text-white">Perfect for Content Creators</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
                Everything you need to succeed as a Furniqo affiliate partner
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  onHoverStart={() => setHoveredBenefit(i)}
                  onHoverEnd={() => setHoveredBenefit(null)}
                  className="relative group"
                >
                  <motion.div 
                    className="relative h-full p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden"
                    animate={{
                      scale: hoveredBenefit === i ? 1.03 : 1,
                      boxShadow: hoveredBenefit === i ? "0 25px 40px -12px rgba(0,0,0,0.2)" : "0 10px 25px -5px rgba(0,0,0,0.1)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5`}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative z-10">
                      <motion.div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <benefit.icon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                      </motion.div>
                      
                      <div className="flex items-baseline gap-2 mb-2">
                        <h3 className="font-bold text-lg dark:text-white">{benefit.title}</h3>
                        <motion.span 
                          className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {benefit.metric}
                        </motion.span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Same as before */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary-50 to-neutral-50 dark:from-primary-950/20 dark:to-neutral-900">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '30px 30px',
          }} />
        </div>

        <div className="relative w-full px-[1%] sm:px-[1.5%]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
              <h2 className="text-3xl md:text-5xl font-bold mt-3 dark:text-white">Get Started in 4 Easy Steps</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
                From application to your first payment - we've made it simple
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  onHoverStart={() => setHoveredStep(i)}
                  onHoverEnd={() => setHoveredStep(null)}
                  className="relative"
                >
                  {i < steps.length - 1 && (
                    <motion.div 
                      className="hidden lg:block absolute top-20 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-400 to-primary-600"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  )}
                  
                  <motion.div 
                    className="relative text-center cursor-pointer"
                    animate={{
                      y: hoveredStep === i ? -10 : 0,
                    }}
                    onClick={() => i === 0 && setShowApplyModal(true)}
                  >
                    <motion.div 
                      className="relative w-24 h-24 mx-auto mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl" />
                      <div className="absolute inset-1 bg-white dark:bg-neutral-900 rounded-xl flex items-center justify-center">
                        <step.icon className="h-8 w-8 text-primary-600" />
                      </div>
                      <motion.div 
                        className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {step.step}
                      </motion.div>
                    </motion.div>
                    
                    <h4 className="font-bold text-xl mb-2 dark:text-white">{step.title}</h4>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">{step.description}</p>
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{step.time}</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Same as before */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">Features</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 dark:text-white">
                  Powerful Tools for Affiliates
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Get access to real-time analytics, marketing materials, and dedicated support
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <FiCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative cursor-pointer"
                onClick={() => setShowContactModal(true)}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
                    alt="Analytics Dashboard"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-xl"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <FiTrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500">Your Commission</div>
                      <div className="text-2xl font-bold text-green-600">$1,234</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Same as before */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">Success Stories</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 dark:text-white">What Our Affiliates Say</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <h4 className="font-semibold dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-neutral-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-primary-600">${testimonial.earnings}</span>
                    <span className="text-sm text-neutral-500 ml-2">earned</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    "The Furniqo affiliate program has been incredibly rewarding. Great products, excellent support, and timely payments!"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Same as before */}
      <section className="relative py-24 overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-purple-900 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
            alt="CTA Background"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="relative z-20 w-full px-[1%] sm:px-[1.5%]">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-4 text-white"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Ready to Start Earning?
              </motion.h2>
              <motion.p 
                className="text-xl text-white/90 mb-8"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Join thousands of affiliates already earning with Furniqo.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="white" 
                  size="large" 
                  icon={FiArrowRight} 
                  onClick={() => setShowApplyModal(true)}
                  className="shadow-2xl"
                >
                  Apply Now
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Newsletter />

      {/* Enhanced Apply Modal - Scrollable */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowApplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-2xl w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header - Sticky */}
              <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 p-6 text-white sticky top-0 z-10">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiPercent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Join Affiliate Program</h3>
                    <p className="text-white/80 text-sm">Fill out the form below to get started</p>
                  </div>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
                <form onSubmit={handleApplySubmit} className="p-6 space-y-5">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiUser className="h-5 w-5 text-primary-600" />
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="+1 234 567 8900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Country
                        </label>
                        <div className="relative">
                          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          >
                            <option value="">Select country</option>
                            <option value="USA">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Platform Information */}
                  <div className="pt-2">
                    <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiGlobeIcon className="h-5 w-5 text-primary-600" />
                      Platform Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Website/Social Media URL *
                        </label>
                        <div className="relative">
                          <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                          <input
                            type="url"
                            name="website"
                            required
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="https://"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Primary Platform
                        </label>
                        <select
                          name="platform"
                          value={formData.platform}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select platform</option>
                          <option value="blog">Blog / Website</option>
                          <option value="youtube">YouTube</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="tiktok">TikTok</option>
                          <option value="twitter">Twitter/X</option>
                          <option value="email">Email Newsletter</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Audience Size *
                        </label>
                        <select
                          name="audience"
                          required
                          value={formData.audience}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select audience size</option>
                          <option value="1k-10k">1,000 - 10,000</option>
                          <option value="10k-50k">10,000 - 50,000</option>
                          <option value="50k-100k">50,000 - 100,000</option>
                          <option value="100k-500k">100,000 - 500,000</option>
                          <option value="500k+">500,000+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Affiliate Experience
                        </label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select experience level</option>
                          <option value="beginner">Beginner (No experience)</option>
                          <option value="intermediate">Intermediate (1-2 years)</option>
                          <option value="advanced">Advanced (3-5 years)</option>
                          <option value="expert">Expert (5+ years)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiMessageSquare className="h-5 w-5 text-primary-600" />
                      Additional Information
                    </h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        How did you hear about us?
                      </label>
                      <select
                        name="hearAbout"
                        value={formData.hearAbout}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select option</option>
                        <option value="search">Search Engine</option>
                        <option value="social">Social Media</option>
                        <option value="friend">Friend/Colleague</option>
                        <option value="email">Email</option>
                        <option value="ad">Advertisement</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Why do you want to join our affiliate program?
                      </label>
                      <textarea
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                        placeholder="Tell us about your platform, audience, and why you'd be a great fit..."
                      />
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="terms" className="text-sm text-neutral-600 dark:text-neutral-400">
                      I agree to the <a href="#" className="text-primary-600 hover:text-primary-700">Terms & Conditions</a> and 
                      <a href="#" className="text-primary-600 hover:text-primary-700 ml-1">Privacy Policy</a>
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-neutral-900 pb-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApplyModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        <>
                          Submit Application
                          <FiSend className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal - Enhanced */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiMessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Contact Us</h3>
                    <p className="text-white/80 text-sm">We're here to help</p>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
                <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowContactModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </div>
                      ) : (
                        <>
                          Send Message
                          <FiSend className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                >
                  <FiThumbsUp className="h-10 w-10 text-green-600" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Application Submitted!
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Thank you for your interest in joining the Furniqo Affiliate Program. 
                  Our team will review your application within 24 hours and get back to you via email.
                </p>
                
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">Next Steps:</p>
                      <ul className="text-xs text-primary-600 dark:text-primary-400 mt-1 space-y-1">
                        <li>• Check your email for confirmation</li>
                        <li>• Our team will review within 24 hours</li>
                        <li>• You'll receive login credentials upon approval</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="primary"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full"
                >
                  Got it, thanks!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Affiliate;