import { motion } from 'framer-motion';
import { 
  FiTruck, 
  FiShield, 
  FiRotateCcw, 
  FiHeadphones,
  FiCreditCard,
  FiAward,
  FiStar,
} from 'react-icons/fi';

const features = [
  {
    icon: FiTruck,
    title: 'Free Shipping',
    description: 'Enjoy free standard shipping on all orders over $200 across the United States.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconBg: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FiShield,
    title: 'Secure Payment',
    description: 'Your payment information is processed securely with industry-standard encryption.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    iconBg: 'from-green-500 to-emerald-500',
  },
  {
    icon: FiRotateCcw,
    title: '30-Day Returns',
    description: 'Not satisfied? Return your purchase within 30 days for a full refund, no questions asked.',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    iconBg: 'from-purple-500 to-violet-500',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to assist with any questions.',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    iconBg: 'from-orange-500 to-amber-500',
  },
  {
    icon: FiAward,
    title: 'Quality Guarantee',
    description: 'All our furniture comes with a minimum 2-year warranty against manufacturing defects.',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    iconBg: 'from-red-500 to-pink-500',
  },
  {
    icon: FiCreditCard,
    title: 'Flexible Payment',
    description: 'Choose from multiple payment options including interest-free installments with Affirm.',
    color: 'from-teal-500 to-green-500',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    iconBg: 'from-teal-500 to-green-500',
  },
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section className="py-[1%] bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        {/* Header Section - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-full mb-3"
          >
            <FiStar className="h-3.5 w-3.5 text-primary-600" />
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              Why Choose Us
            </span>
          </motion.div>

          <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-2">
            Why Choose Furniqo?
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Premium quality furniture with exceptional service
          </p>
        </motion.div>

        {/* Features Grid - Compact */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group relative bg-white dark:bg-neutral-800/50 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-800"
            >
              {/* Icon Container - Compact with gradient background */}
              <div className="relative mb-3">
                <div className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${feature.iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              
              {/* Content - Compact */}
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badge - Compact with real payment icons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6"
        >
          <div className="bg-white dark:bg-neutral-800/50 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Rating */}
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-sm text-neutral-900 dark:text-white">4.8/5</p>
                  <p className="text-[10px] text-neutral-500">10,000+ reviews</p>
                </div>
              </div>
              
              {/* Security */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <FiShield className="h-4 w-4 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <p className="font-bold text-sm text-neutral-900 dark:text-white">256-bit SSL</p>
                  <p className="text-[10px] text-neutral-500">Secure encryption</p>
                </div>
              </div>
              
              {/* Payment Methods - Real Images */}
              <div>
                <p className="text-center text-xs text-neutral-500 mb-2">Secure payments with</p>
                <div className="flex items-center justify-center gap-3">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/349/349221.png"
                    alt="Visa" 
                    className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                    alt="Mastercard" 
                    className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    alt="PayPal" 
                    className="h-5 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                    alt="American Express" 
                    className="h-5 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;