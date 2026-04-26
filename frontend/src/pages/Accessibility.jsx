import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEye, FiType, FiVolume2, FiZoomIn, FiZoomOut, 
  FiMonitor, FiMousePointer, FiGlobe,
  FiCheck, FiArrowRight, FiX, FiMail, FiPhone,
  FiMessageCircle, FiUser, FiSend, FiHeart,
  FiShield, FiClock, FiStar, FiTrendingUp,
  FiActivity, FiMenu, FiSettings, FiHelpCircle,
  FiAward, FiBookOpen, FiCompass, FiGrid
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';
import toast from 'react-hot-toast';

const Accessibility = () => {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  
  const [reportForm, setReportForm] = useState({
    name: '',
    email: '',
    issue: '',
    description: '',
    urgency: 'normal'
  });
  
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    rating: 0,
    feedback: '',
    suggestions: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const accessibilityFeatures = [
    {
      icon: FiType,
      title: 'Text Size Adjustment',
      description: 'Increase or decrease text size for better readability',
      action: 'resize',
      status: 'active'
    },
    {
      icon: FiEye,
      title: 'High Contrast Mode',
      description: 'Switch to high contrast colors for better visibility',
      action: 'contrast',
      status: highContrast ? 'on' : 'off'
    },
    {
      icon: FiVolume2,
      title: 'Screen Reader Support',
      description: 'Optimized for screen readers and assistive technologies',
      action: 'reader',
      status: screenReader ? 'on' : 'off'
    },
    {
      icon: FiMonitor,
      title: 'Reduced Motion',
      description: 'Minimize animations and motion effects',
      action: 'motion',
      status: reduceMotion ? 'on' : 'off'
    },
    {
      icon: FiGrid,
      title: 'Keyboard Navigation',
      description: 'Navigate entire site using keyboard only',
      action: 'keyboard',
      status: 'active'
    },
    {
      icon: FiMousePointer,
      title: 'Focus Indicators',
      description: 'Clear visual indicators for keyboard focus',
      action: 'focus',
      status: 'active'
    },
    {
      icon: FiGlobe,
      title: 'Screen Reader Text',
      description: 'Additional ARIA labels and descriptions',
      action: 'aria',
      status: 'active'
    },
    {
      icon: FiActivity,
      title: 'Skip to Content',
      description: 'Skip navigation and jump directly to main content',
      action: 'skip',
      status: 'active'
    }
  ];

  const complianceStandards = [
    { standard: 'WCAG 2.1', level: 'AA', status: 'Compliant', icon: FiCheck },
    { standard: 'ADA', level: 'Title III', status: 'Compliant', icon: FiCheck },
    { standard: 'Section 508', level: 'Full', status: 'Compliant', icon: FiCheck },
    { standard: 'EN 301 549', level: 'V2.1.2', status: 'Compliant', icon: FiCheck },
  ];

  const handleFontSizeChange = (increase) => {
    if (increase && fontSize < 150) {
      setFontSize(fontSize + 10);
      document.documentElement.style.fontSize = `${fontSize + 10}%`;
      toast.success(`Text size increased to ${fontSize + 10}%`);
    } else if (!increase && fontSize > 70) {
      setFontSize(fontSize - 10);
      document.documentElement.style.fontSize = `${fontSize - 10}%`;
      toast.success(`Text size decreased to ${fontSize - 10}%`);
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add('high-contrast');
      toast.success('High contrast mode enabled');
    } else {
      document.documentElement.classList.remove('high-contrast');
      toast.success('High contrast mode disabled');
    }
  };

  const toggleReduceMotion = () => {
    setReduceMotion(!reduceMotion);
    if (!reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
      toast.success('Reduced motion enabled');
    } else {
      document.documentElement.classList.remove('reduce-motion');
      toast.success('Reduced motion disabled');
    }
  };

  const toggleScreenReader = () => {
    setScreenReader(!screenReader);
    toast.success(screenReader ? 'Screen reader optimizations disabled' : 'Screen reader optimizations enabled');
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowReportModal(false);
    setReportForm({ name: '', email: '', issue: '', description: '', urgency: 'normal' });
    toast.success('Accessibility issue reported successfully! Our team will review it.');
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowFeedbackModal(false);
    setFeedbackForm({ name: '', email: '', rating: 0, feedback: '', suggestions: '' });
    toast.success('Thank you for your feedback! We appreciate your input.');
  };

  const resetAllSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setReduceMotion(false);
    setScreenReader(false);
    document.documentElement.style.fontSize = '100%';
    document.documentElement.classList.remove('high-contrast', 'reduce-motion');
    toast.success('All accessibility settings have been reset');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative w-full my-[1%] overflow-hidden rounded-2xl">
        <motion.div 
          className="relative w-full bg-gradient-to-r from-primary-700 to-purple-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '30px 30px',
            }} />
          </div>
          
          {/* Animated Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/10"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                }}
                animate={{
                  y: [null, -50, -100],
                  opacity: [0, 0.3, 0],
                  scale: [0, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              >
                <FiActivity className="h-8 w-8" />
              </motion.div>
            ))}
          </div>

          <div className="relative px-[2%] py-12 lg:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.span 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-5 text-white"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FiActivity className="h-4 w-4" />
                    Inclusive Design For Everyone
                  </motion.span>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                    Accessibility Statement
                  </h1>
                  
                  <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
                    We are committed to ensuring our website is accessible to all users, 
                    regardless of ability or technology.
                  </p>
                  
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button 
                      variant="white" 
                      size="lg" 
                      icon={FiActivity}
                      onClick={() => setShowGuideModal(true)}
                    >
                      Accessibility Guide
                      <FiArrowRight className="ml-2" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={() => setShowReportModal(true)}
                      className="bg-white/15 backdrop-blur-md border-white/30 text-white hover:bg-white/25"
                    >
                      Report Issue
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Accessibility Controls */}
      <div className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold dark:text-white">Accessibility Tools</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Customize your viewing experience</p>
              </div>
              <Button variant="outline" size="sm" onClick={resetAllSettings}>
                Reset All Settings
              </Button>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Text Size Control */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 text-center">
                <FiType className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-2 dark:text-white">Text Size</h3>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleFontSizeChange(false)}
                    className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 flex items-center justify-center transition-colors"
                  >
                    <FiZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium">{fontSize}%</span>
                  <button
                    onClick={() => handleFontSizeChange(true)}
                    className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 flex items-center justify-center transition-colors"
                  >
                    <FiZoomIn className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* High Contrast */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 text-center">
                <FiEye className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-2 dark:text-white">High Contrast</h3>
                <button
                  onClick={toggleHighContrast}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    highContrast 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100'
                  }`}
                >
                  {highContrast ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 text-center">
                <FiMonitor className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-2 dark:text-white">Reduced Motion</h3>
                <button
                  onClick={toggleReduceMotion}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    reduceMotion 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100'
                  }`}
                >
                  {reduceMotion ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Screen Reader */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 text-center">
                <FiVolume2 className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-2 dark:text-white">Screen Reader</h3>
                <button
                  onClick={toggleScreenReader}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    screenReader 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100'
                  }`}
                >
                  {screenReader ? 'Optimized' : 'Standard'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white">Accessibility Features</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Tools and features to enhance your experience</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {accessibilityFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all"
              >
                <feature.icon className="h-8 w-8 text-primary-600 mb-3" />
                <h3 className="font-semibold text-base mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-xs text-neutral-500 mb-3">{feature.description}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  feature.status === 'active' || feature.status === 'on'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                }`}>
                  {feature.status === 'active' ? 'Available' : feature.status === 'on' ? 'Enabled' : 'Available'}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Standards */}
      <div className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-primary-100 dark:border-primary-800"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Compliance Standards</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">We meet or exceed all major accessibility standards</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {complianceStandards.map((standard, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <standard.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg dark:text-white">{standard.standard}</h3>
                  <p className="text-xs text-neutral-500">{standard.level}</p>
                  <p className="text-xs text-green-600 mt-1">{standard.status}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Commitment Statement */}
      <div className="w-full px-[1%] my-[1%]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <FiHeart className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-3 dark:text-white">Our Commitment</h2>
                <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <p>
                    We are dedicated to making our website accessible to everyone, including people with disabilities. 
                    We continuously work to improve the user experience for all visitors and apply relevant accessibility standards.
                  </p>
                  <p>
                    Our goal is to provide an inclusive digital experience that enables all visitors to access our content, 
                    products, and services regardless of their abilities or the technology they use.
                  </p>
                  <div className="flex items-center gap-4 pt-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <FiCheck className="h-4 w-4 text-green-600" />
                      <span className="text-xs">WCAG 2.1 AA Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="h-4 w-4 text-green-600" />
                      <span className="text-xs">Regular Audits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="h-4 w-4 text-green-600" />
                      <span className="text-xs">Continuous Improvement</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact for Accessibility */}
      <div className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
              <FiHelpCircle className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="font-bold text-lg mb-2 dark:text-white">Need Assistance?</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                If you experience any difficulty accessing our website, please contact us.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FiMail className="h-4 w-4 text-primary-600" />
                  <span>accessibility@furniqo.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FiPhone className="h-4 w-4 text-primary-600" />
                  <span>1-800-123-4567</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-6 text-white text-center">
              <FiMessageCircle className="h-8 w-8 mx-auto mb-3 opacity-80" />
              <h3 className="font-bold text-lg mb-2">Share Your Feedback</h3>
              <p className="text-sm text-white/80 mb-4">
                Help us improve our accessibility features
              </p>
              <Button 
                variant="white" 
                size="sm" 
                onClick={() => setShowFeedbackModal(true)}
                className="inline-flex"
              >
                Give Feedback
                <FiArrowRight className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Newsletter />

      {/* Report Issue Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-lg w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-red-600 to-orange-600 p-5 text-white">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiActivity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Report Accessibility Issue</h3>
                    <p className="text-white/80 text-xs">Help us improve our website</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <form onSubmit={handleReportSubmit}>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={reportForm.name}
                      onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={reportForm.email}
                      onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Issue Type *
                    </label>
                    <select
                      required
                      value={reportForm.issue}
                      onChange={(e) => setReportForm({ ...reportForm, issue: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
                    >
                      <option value="">Select issue type</option>
                      <option value="visual">Visual Impairment</option>
                      <option value="hearing">Hearing Impairment</option>
                      <option value="motor">Motor Impairment</option>
                      <option value="cognitive">Cognitive Disability</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 resize-none"
                      placeholder="Describe the accessibility issue you encountered..."
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Urgency
                    </label>
                    <select
                      value={reportForm.urgency}
                      onChange={(e) => setReportForm({ ...reportForm, urgency: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
                    >
                      <option value="low">Low - Minor inconvenience</option>
                      <option value="normal">Normal - Moderate difficulty</option>
                      <option value="high">High - Cannot access content</option>
                      <option value="critical">Critical - Complete barrier</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReportModal(false)}
                      className="flex-1"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      className="flex-1"
                      size="sm"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Reporting...
                        </div>
                      ) : (
                        <>
                          Report Issue
                          <FiSend className="ml-2 h-3 w-3" />
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

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-lg w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-5 text-white">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiHeart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Share Your Feedback</h3>
                    <p className="text-white/80 text-xs">Help us improve accessibility</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <form onSubmit={handleFeedbackSubmit}>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFeedbackForm({ ...feedbackForm, rating })}
                          onMouseEnter={() => setHoveredRating(rating)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none"
                        >
                          <FiStar 
                            className={`h-6 w-6 transition-all ${
                              rating <= (hoveredRating || feedbackForm.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Your Feedback *
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={feedbackForm.feedback}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 resize-none"
                      placeholder="Share your experience with our accessibility features..."
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Suggestions for Improvement
                    </label>
                    <textarea
                      rows="2"
                      value={feedbackForm.suggestions}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, suggestions: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 resize-none"
                      placeholder="Any suggestions to improve accessibility..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowFeedbackModal(false)}
                      className="flex-1"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      className="flex-1"
                      size="sm"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </div>
                      ) : (
                        <>
                          Submit Feedback
                          <FiSend className="ml-2 h-3 w-3" />
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

      {/* Accessibility Guide Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowGuideModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-2xl w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-5 text-white">
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiActivity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Accessibility Guide</h3>
                    <p className="text-white/80 text-xs">Tips for better navigation</p>
                  </div>
                </div>
              </div>

              <div className="p-5 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-base mb-2 dark:text-white flex items-center gap-2">
                      <FiGrid className="h-4 w-4 text-primary-600" />
                      Keyboard Navigation
                    </h4>
                    <ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400 space-y-1 ml-4">
                      <li>Use <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">Tab</kbd> to navigate between interactive elements</li>
                      <li>Use <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">Enter</kbd> or <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">Space</kbd> to activate buttons and links</li>
                      <li>Use <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">Escape</kbd> to close modals and menus</li>
                      <li>Use <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">Shift + Tab</kbd> to navigate backwards</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-base mb-2 dark:text-white flex items-center gap-2">
                      <FiEye className="h-4 w-4 text-primary-600" />
                      Visual Adjustments
                    </h4>
                    <ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400 space-y-1 ml-4">
                      <li>Adjust text size using the +/- buttons in the accessibility toolbar</li>
                      <li>Enable high contrast mode for better visibility</li>
                      <li>Use browser zoom (Ctrl + / Ctrl -) for larger view</li>
                      <li>All images have descriptive alt text</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-base mb-2 dark:text-white flex items-center gap-2">
                      <FiVolume2 className="h-4 w-4 text-primary-600" />
                      Screen Reader Support
                    </h4>
                    <ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400 space-y-1 ml-4">
                      <li>Our site is compatible with JAWS, NVDA, and VoiceOver</li>
                      <li>Proper heading structure for easy navigation</li>
                      <li>ARIA labels for dynamic content</li>
                      <li>Skip to content link available</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-base mb-2 dark:text-white flex items-center gap-2">
                      <FiMonitor className="h-4 w-4 text-primary-600" />
                      Motion & Animations
                    </h4>
                    <ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400 space-y-1 ml-4">
                      <li>Reduced motion option available in accessibility toolbar</li>
                      <li>Animations respect user preferences</li>
                      <li>No auto-playing or flashing content</li>
                      <li>Pause controls for any moving content</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button
                  variant="primary"
                  onClick={() => setShowGuideModal(false)}
                  className="w-full"
                  size="sm"
                >
                  Got it
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accessibility;