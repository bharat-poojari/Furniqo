import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiSearch, FiArrowRight } from 'react-icons/fi';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-9xl font-display font-bold text-neutral-200 dark:text-neutral-800 select-none"
          >
            404
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-6xl">🪑</span>
          </motion.div>
        </div>

        <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Oops! The page you're looking for has been moved or doesn't exist. 
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg" icon={FiHome}>
              Back to Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary" size="lg" icon={FiSearch}>
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 grid grid-cols-2 gap-4 text-left">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Popular Pages</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-neutral-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                  <FiArrowRight className="h-3 w-3" /> All Products
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-neutral-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                  <FiArrowRight className="h-3 w-3" /> Special Offers
                </Link>
              </li>
              <li>
                <Link to="/room-inspiration" className="text-neutral-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                  <FiArrowRight className="h-3 w-3" /> Room Inspiration
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-neutral-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                  <FiArrowRight className="h-3 w-3" /> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-neutral-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                  <FiArrowRight className="h-3 w-3" /> FAQ
                </Link>
              </li>
              <li>
                <Link to="/policies/shipping" className="text-neutral-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                  <FiArrowRight className="h-3 w-3" /> Shipping Info
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;