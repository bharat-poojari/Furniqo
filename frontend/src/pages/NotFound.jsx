import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiSearch, 
  FiArrowRight, 
  FiCompass,
  FiHelpCircle,
  FiPackage,
  FiShoppingBag,
  FiGrid,
  FiTag,
  FiBookOpen,
  FiMapPin,
  FiMail,
  FiChevronRight
} from 'react-icons/fi';
import Button from '../components/common/Button';

// Custom SVG Icons
const SofaIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 11h16v4H4zM4 15l-1 3h18l-1-3M7 11V9a5 5 0 0110 0v2" />
  </svg>
);

const NotFound = () => {
  const quickLinks = [
    { icon: FiGrid, label: 'All Products', href: '/products', color: 'text-blue-500' },
    { icon: FiTag, label: 'Special Offers', href: '/offers', color: 'text-red-500' },
    { icon: FiBookOpen, label: 'Inspiration', href: '/room-inspiration', color: 'text-purple-500' },
    { icon: FiShoppingBag, label: 'New Arrivals', href: '/products?sort=newest', color: 'text-emerald-500' },
    { icon: FiPackage, label: 'Track Order', href: '/track-order', color: 'text-amber-500' },
    { icon: FiHelpCircle, label: 'Help Center', href: '/faq', color: 'text-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-[1%] py-[1%] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-400/8 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-purple-400/8 rounded-full blur-[100px]"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl relative z-10"
      >
        {/* 404 Animation */}
        <div className="relative mb-6">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, -3, 3, 0],
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-[10rem] lg:text-[12rem] font-black text-neutral-100 dark:text-neutral-800 select-none leading-none"
          >
            404
          </motion.div>
          
          {/* Floating Sofa Icon */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-white dark:bg-neutral-800 shadow-2xl flex items-center justify-center border border-neutral-100 dark:border-neutral-700">
                <SofaIcon className="h-10 w-10 lg:h-12 lg:w-12 text-primary-500" />
              </div>
              {/* Shadow */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-3 bg-black/10 rounded-full blur-md" />
            </div>
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm lg:text-base text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto leading-relaxed">
            The page you're looking for has been moved or doesn't exist. Let's get you back on track.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center mb-8">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/"
              className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 inline-flex items-center justify-center gap-2"
            >
              <FiHome className="h-4 w-4" />
              Back to Home
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/products"
              className="px-5 py-2.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all border border-neutral-200 dark:border-neutral-700 shadow-sm inline-flex items-center justify-center gap-2"
            >
              <FiSearch className="h-4 w-4" />
              Browse Products
            </motion.a>
          </div>
        </motion.div>

        {/* Quick Links Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg mx-auto"
        >
          {quickLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <link.icon className={`h-4 w-4 ${link.color}`} />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold dark:text-white">{link.label}</p>
                <div className="flex items-center gap-1 text-[10px] text-neutral-400 group-hover:text-primary-500 transition-colors">
                  <span>Visit</span>
                  <FiChevronRight className="h-2.5 w-2.5" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Bottom Help */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-neutral-400 mt-6"
        >
          Still can't find what you need?{' '}
          <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2">
            Contact our support team
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;