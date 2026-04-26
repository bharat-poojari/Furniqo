import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShield, FiTruck, FiRotateCcw, FiLock, FiArrowLeft, 
  FiCheck, FiClock, FiFileText, FiHeart, FiStar, FiUsers,
  FiGlobe, FiMail, FiPhone, FiMapPin, FiPrinter, FiDownload
} from 'react-icons/fi';
import { policies } from '../data/data';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';
import { useState } from 'react';
import toast from 'react-hot-toast';

const policyIcons = {
  privacy: FiLock,
  terms: FiShield,
  shipping: FiTruck,
  returns: FiRotateCcw,
};

const policyColors = {
  privacy: 'from-purple-600 to-pink-600',
  terms: 'from-blue-600 to-cyan-600',
  shipping: 'from-green-600 to-emerald-600',
  returns: 'from-orange-600 to-red-600',
};

const Policies = () => {
  const { type } = useParams();
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const policy = policies[type];
  const Icon = policyIcons[type] || FiShield;
  const colorGradient = policyColors[type] || 'from-primary-600 to-purple-600';

  if (!policy) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-[1%]"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <FiFileText className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
            Policy Not Found
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md">
            The policy page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all">
            <FiArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
    setShowPrintModal(false);
  };

  const handleDownload = () => {
    toast.success('Policy downloaded successfully');
    setShowPrintModal(false);
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = policy.title;
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
    }
    
    setShowShareModal(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative w-full my-[1%] overflow-hidden rounded-2xl">
        <motion.div 
          className="relative w-full bg-gradient-to-r from-primary-900 to-primary-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '30px 30px',
            }} />
          </div>
          
          {/* Animated Floating Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/10"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                }}
                animate={{
                  y: [null, -30, -60],
                  opacity: [0, 0.3, 0],
                  scale: [0, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              >
                <Icon className="h-6 w-6" />
              </motion.div>
            ))}
          </div>

          <div className="relative px-[2%] py-12 lg:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">
                      {policy.title}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1.5 text-white/70 text-sm">
                        <FiClock className="h-3.5 w-3.5" />
                        Last updated: {policy.lastUpdated}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/70 text-sm">
                        <FiCheck className="h-3.5 w-3.5" />
                        Legally compliant
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPrintModal(true)}
                    className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-lg text-white text-sm hover:bg-white/25 transition-all flex items-center gap-2"
                  >
                    <FiPrinter className="h-4 w-4" />
                    Print
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareModal(true)}
                    className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-lg text-white text-sm hover:bg-white/25 transition-all flex items-center gap-2"
                  >
                    <FiHeart className="h-4 w-4" />
                    Share
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-8">
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-700 mb-6">
                  <h3 className="font-semibold text-base mb-3 dark:text-white flex items-center gap-2">
                    <FiFileText className="h-4 w-4 text-primary-600" />
                    Policy Index
                  </h3>
                  <div className="space-y-2">
                    {policy.sections.map((section, idx) => (
                      <a
                        key={idx}
                        href={`#section-${idx}`}
                        className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-1 hover:translate-x-1 transition-transform"
                      >
                        • {section.heading}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-950/20 dark:to-purple-950/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800">
                  <h3 className="font-semibold text-base mb-3 dark:text-white flex items-center gap-2">
                    <FiShield className="h-4 w-4 text-primary-600" />
                    Need Help?
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Have questions about our policies? Our support team is here to help.
                  </p>
                  <Button variant="primary" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Policy Content */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {policy.sections.map((section, index) => (
                  <motion.section
                    key={index}
                    id={`section-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                          {section.heading}
                        </h2>
                        <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                          {section.content.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="text-sm">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.section>
                ))}
              </div>

              {/* Summary Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-primary-100 dark:border-primary-800"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiCheck className="h-6 w-6 text-primary-600" />
                  <h3 className="text-lg font-semibold dark:text-white">Key Points Summary</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <FiCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>All policies are legally compliant and regularly updated</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <FiCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Your privacy and data security are our top priorities</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <FiCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Clear terms and conditions for all transactions</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <FiCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Hassle-free returns and exchanges policy</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Policies Section */}
      <div className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white">Other Policies</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-sm">Explore our other policy documents</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(policies).map(([key, p]) => {
              const OtherIcon = policyIcons[key];
              const isActive = type === key;
              return (
                <Link key={key} to={`/policies/${key}`}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:shadow-md'
                    }`}
                  >
                    <OtherIcon className={`h-6 w-6 mb-2 ${isActive ? 'text-white' : 'text-primary-600'}`} />
                    <h3 className={`font-semibold text-sm ${isActive ? 'text-white' : 'dark:text-white'}`}>
                      {p.title}
                    </h3>
                    <p className={`text-xs mt-1 ${isActive ? 'text-white/70' : 'text-neutral-500'}`}>
                      Learn more →
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Newsletter />

      {/* Print Modal */}
      <AnimatePresence>
        {showPrintModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPrintModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r ${colorGradient} p-5 text-white`}>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiLock className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiPrinter className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Print or Download</h3>
                    <p className="text-white/80 text-xs">Choose your preferred option</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handlePrint}
                    className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all flex items-center gap-3"
                  >
                    <FiPrinter className="h-5 w-5 text-primary-600" />
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm dark:text-white">Print Policy</div>
                      <div className="text-xs text-neutral-500">Print directly from your browser</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all flex items-center gap-3"
                  >
                    <FiDownload className="h-5 w-5 text-primary-600" />
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm dark:text-white">Download as PDF</div>
                      <div className="text-xs text-neutral-500">Save to your device</div>
                    </div>
                  </button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowPrintModal(false)}
                  className="w-full"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r ${colorGradient} p-5 text-white`}>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiLock className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiHeart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Share This Policy</h3>
                    <p className="text-white/80 text-xs">Share with your network</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center"
                  >
                    <FiLink className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                    <div className="text-xs">Copy Link</div>
                  </button>
                  
                  <button
                    onClick={() => handleShare('email')}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center"
                  >
                    <FiMail className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                    <div className="text-xs">Email</div>
                  </button>
                  
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center"
                  >
                    <svg className="h-5 w-5 text-primary-600 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <div className="text-xs">Twitter</div>
                  </button>
                  
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center"
                  >
                    <svg className="h-5 w-5 text-primary-600 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                    <div className="text-xs">Facebook</div>
                  </button>
                  
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center col-span-2"
                  >
                    <svg className="h-5 w-5 text-primary-600 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
                    </svg>
                    <div className="text-xs">LinkedIn</div>
                  </button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowShareModal(false)}
                  className="w-full"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Policies;