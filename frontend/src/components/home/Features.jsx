import { useMemo, memo } from 'react';
import { 
  FiTruck, 
  FiShield, 
  FiRotateCcw, 
  FiHeadphones,
  FiCreditCard,
  FiAward,
  FiStar,
} from 'react-icons/fi';

// Memoized features data to prevent recreation
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

// Optimized feature card component - Removed framer-motion
const FeatureCard = memo(({ feature }) => {
  const IconComponent = feature.icon;
  
  return (
    <div className="group relative bg-white dark:bg-neutral-800/50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 shadow-md hover:shadow-xl transition-all duration-200 border border-neutral-100 dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-800">
      {/* Icon Container */}
      <div className="relative mb-1.5 sm:mb-2 md:mb-3">
        <div className={`relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${feature.iconBg} flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110`}>
          <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
        </div>
      </div>
      
      {/* Content */}
      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-neutral-900 dark:text-white mb-0.5 sm:mb-1 transition-colors duration-150 group-hover:text-primary-600 dark:group-hover:text-primary-400">
        {feature.title}
      </h3>
      <p className="text-[10px] sm:text-[11px] md:text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

// Optimized trust badge component - Removed framer-motion
const TrustBadge = memo(() => {
  const paymentMethods = useMemo(() => [
    { name: 'Visa', url: 'https://cdn-icons-png.flaticon.com/512/349/349221.png', class: 'h-4 sm:h-5' },
    { name: 'Mastercard', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png', class: 'h-4 sm:h-5' },
    { name: 'PayPal', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', class: 'h-3.5 sm:h-4' },
    { name: 'American Express', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg', class: 'h-3.5 sm:h-4' },
  ], []);

  return (
    <div className="mt-4 sm:mt-6">
      <div className="bg-white dark:bg-neutral-800/50 rounded-lg sm:rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-3 sm:p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-4 md:gap-5">
          {/* Row 1: Rating & Security */}
          <div className="grid grid-cols-2 gap-3 md:flex md:flex-row md:gap-5 md:flex-1">
            {/* Rating Section */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">4.8/5</p>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-neutral-500">10k+ reviews</p>
              </div>
            </div>
            
            {/* Security Section */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FiShield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">256-bit SSL</p>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-neutral-500">Secure</p>
              </div>
            </div>
          </div>
          
          {/* Row 2: Payment Methods */}
          <div className="w-full md:w-auto md:min-w-[240px]">
            <p className="text-center md:text-left text-[10px] sm:text-[11px] text-neutral-500 mb-1.5">Secure payments with</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-2.5">
              {paymentMethods.map((method, idx) => (
                <img 
                  key={idx}
                  src={method.url}
                  alt={method.name}
                  className={`${method.class} w-auto opacity-70 hover:opacity-100 transition-opacity duration-150`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TrustBadge.displayName = 'TrustBadge';

const Features = () => {
  return (
    <section className="py-[2%] sm:py-[1%] bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full px-[1%] sm:px-[1.5%]">
        {/* Header Section - Removed framer-motion */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-full mb-2 sm:mb-3">
            <FiStar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-600" />
            <span className="text-[10px] sm:text-xs font-medium text-primary-600 dark:text-primary-400">
              Why Choose Us
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-1.5 sm:mb-2 px-4 sm:px-0">
            Why Choose Furniqo?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto px-4 sm:px-0">
            Premium quality furniture with exceptional service
          </p>
        </div>

        {/* Features Grid - Simplified, removed stagger animations */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

        {/* Trust Badge */}
        <TrustBadge />
      </div>
    </section>
  );
};

export default memo(Features);