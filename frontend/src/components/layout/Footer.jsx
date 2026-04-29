import { Link } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiYoutube,
  FiArrowRight,
  FiShield,
  FiTruck,
  FiRotateCcw,
  FiHeart,
  FiStar,
  FiClock,
  FiAward,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { FaPinterest, FaLinkedin } from 'react-icons/fa';
import { useState, useCallback, memo } from 'react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const toggleSection = useCallback((section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleNewsletterSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Thank you for subscribing!');
      setEmail('');
      setIsSubmitting(false);
    }, 500);
  }, [email]);

  const footerLinks = {
    shop: [
      { label: 'All Products', href: '/products' },
      { label: 'Living Room', href: '/products?category=Living%20Room' },
      { label: 'Bedroom', href: '/products?category=Bedroom' },
      { label: 'On Sale', href: '/offers' },
      { label: 'Custom Furniture', href: '/custom-furniture' },
      { label: 'Gift Cards', href: '/gift-cards' },
    ],
    explore: [
      { label: 'Living Room', href: '/products?category=Living%20Room' },
      { label: 'Bedroom', href: '/products?category=Bedroom' },
      { label: 'Dining Room', href: '/products?category=Dining%20Room' },
      { label: 'Home Office', href: '/products?category=Office' },
      { label: 'Outdoor', href: '/products?category=Outdoor' },
      { label: 'Lighting', href: '/products?category=Lighting' },
      { label: 'Storage', href: '/products?category=Storage' },
      { label: 'Decor', href: '/products?category=Decor' },
    ],
    support: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'Privacy Policy', href: 'policies/privacy' },
      { label: 'Terms of Service', href: 'policies/terms' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Trade Program', href: '/trade' },
      { label: 'Affiliate Program', href: '/affiliate' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Reviews', href: '/reviews' },
    ],
  };

  const features = [
    { icon: FiTruck, title: 'Free Shipping', description: 'Over $200' },
    { icon: FiRotateCcw, title: '30-Day Returns', description: 'Hassle-free' },
    { icon: FiShield, title: '2-Year Warranty', description: 'All products' },
    { icon: FiAward, title: 'Premium Quality', description: 'Best materials' },
  ];

  const socialLinks = [
    { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaPinterest, href: 'https://pinterest.com', label: 'Pinterest' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FiYoutube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  const paymentMethods = [
    { name: 'Visa', url: 'https://cdn-icons-png.flaticon.com/512/349/349221.png' },
    { name: 'Mastercard', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png' },
    { name: 'PayPal', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png' },
    { name: 'Amex', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1280px-American_Express_logo_28201829.svg.png' },
  ];

  // Mobile accordion component memoized
  const MobileAccordion = memo(({ title, links, section }) => (
    <div className="border-b border-neutral-800 last:border-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-3 text-left active:opacity-70 transition-opacity"
      >
        <h4 className="font-semibold text-white text-sm">{title}</h4>
        {openSections[section] ? (
          <FiChevronUp className="h-4 w-4 text-neutral-400" />
        ) : (
          <FiChevronDown className="h-4 w-4 text-neutral-400" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${
        openSections[section] ? 'max-h-96 opacity-100 mb-3' : 'max-h-0 opacity-0'
      }`}>
        <ul className="space-y-2 pb-2">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                to={link.href}
                className="text-xs text-neutral-400 hover:text-white transition-colors hover:translate-x-1 inline-block duration-150"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ));

  MobileAccordion.displayName = 'MobileAccordion';

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Features Bar - Compact for mobile, fits in one row */}
      <div className="border-b border-neutral-800">
        <div className="w-full px-[1%] sm:px-[1.5%]">
          <div className="grid grid-cols-4 gap-1 sm:gap-2 py-2 sm:py-3">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center px-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary-600/10 flex items-center justify-center flex-shrink-0 mb-1">
                  <feature.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-[10px] sm:text-xs">{feature.title}</p>
                  <p className="text-[8px] sm:text-[10px] text-neutral-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full px-[1%] sm:px-[1.5%] py-6 sm:py-8">
        {/* Desktop Layout (lg and above) */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img 
                src="/logo.svg" 
                alt="Furniqo" 
                className="h-8 w-8 object-contain"
                loading="eager"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-xl font-bold text-white">Furniqo</span>
            </Link>
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Premium furniture for modern living. We curate the finest pieces 
              to help you create spaces you'll love coming home to.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-1.5 mb-3">
              <a href="tel:+15559876543" className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors">
                <FiPhone className="h-3.5 w-3.5 text-primary-400" />
                <span>+1 (555) 987-6543</span>
              </a>
              <a href="mailto:support@furniqo.com" className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors">
                <FiMail className="h-3.5 w-3.5 text-primary-400" />
                <span>support@furniqo.com</span>
              </a>
              <div className="flex items-start gap-2 text-xs text-neutral-400">
                <FiMapPin className="h-3.5 w-3.5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span>123 Design District, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <FiClock className="h-3.5 w-3.5 text-primary-400" />
                <span>Mon-Fri: 9AM - 6PM EST</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-1.5 flex-wrap">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-all duration-150 hover:scale-105"
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Shop</h4>
            <ul className="space-y-1.5">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-xs text-neutral-400 hover:text-white transition-colors hover:translate-x-1 inline-block duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Explore</h4>
            <ul className="space-y-1.5">
              {footerLinks.explore.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-xs text-neutral-400 hover:text-white transition-colors hover:translate-x-1 inline-block duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Support</h4>
            <ul className="space-y-1.5">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-xs text-neutral-400 hover:text-white transition-colors hover:translate-x-1 inline-block duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Company</h4>
            <ul className="space-y-1.5">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-xs text-neutral-400 hover:text-white transition-colors hover:translate-x-1 inline-block duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Layout (below lg) */}
        <div className="lg:hidden">
          {/* Brand Section - Mobile */}
          <div className="mb-6 pb-6 border-b border-neutral-800">
            <Link to="/" className="flex items-center justify-center gap-2 mb-3">
              <img 
                src="/logo.svg" 
                alt="Furniqo" 
                className="h-8 w-8 object-contain"
                loading="eager"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-xl font-bold text-white">Furniqo</span>
            </Link>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed text-center">
              Premium furniture for modern living. We curate the finest pieces 
              to help you create spaces you'll love coming home to.
            </p>
            
            {/* Contact Info - Mobile */}
            <div className="space-y-2 mb-4">
              <a href="tel:+15559876543" className="flex items-center justify-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors">
                <FiPhone className="h-3.5 w-3.5 text-primary-400" />
                <span>+1 (555) 987-6543</span>
              </a>
              <a href="mailto:support@furniqo.com" className="flex items-center justify-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors">
                <FiMail className="h-3.5 w-3.5 text-primary-400" />
                <span>support@furniqo.com</span>
              </a>
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                <FiMapPin className="h-3.5 w-3.5 text-primary-400 flex-shrink-0" />
                <span className="text-center">123 Design District, New York, NY 10001</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                <FiClock className="h-3.5 w-3.5 text-primary-400" />
                <span>Mon-Fri: 9AM - 6PM EST</span>
              </div>
            </div>

            {/* Social Links - Mobile */}
            <div className="flex gap-2 justify-center flex-wrap">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-all duration-150 hover:scale-105"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Accordion Sections - Mobile */}
          <MobileAccordion title="Shop" links={footerLinks.shop} section="shop" />
          <MobileAccordion title="Explore" links={footerLinks.explore} section="explore" />
          <MobileAccordion title="Support" links={footerLinks.support} section="support" />
          <MobileAccordion title="Company" links={footerLinks.company} section="company" />
        </div>

        {/* Newsletter Section - Centered with reduced width */}
        <div className="border-t border-neutral-800 mt-6 pt-5">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiHeart className="h-3.5 w-3.5 text-primary-400" />
              <FiStar className="h-3.5 w-3.5 text-yellow-500" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">
              Subscribe to Our Newsletter
            </h4>
            <p className="text-xs text-neutral-400 mb-3">
              Get 10% off your first order and exclusive deals
            </p>
            <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  {isSubmitting ? '...' : 'Subscribe'}
                  {!isSubmitting && <FiArrowRight className="h-3 w-3" />}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Responsive */}
        <div className="border-t border-neutral-800 mt-5 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-neutral-500 text-center">
            © {new Date().getFullYear()} Furniqo. All rights reserved.
          </p>
          
          {/* Links - Wrap on mobile */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link to="policies/privacy" className="text-[10px] text-neutral-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="policies/terms" className="text-[10px] text-neutral-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="policies/shipping" className="text-[10px] text-neutral-500 hover:text-white transition-colors">
              Shipping Policy
            </Link>
            <Link to="/accessibility" className="text-[10px] text-neutral-500 hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
          
          {/* Payment Methods - Wrap on mobile */}
          <div className="flex gap-2 flex-wrap justify-center">
            {paymentMethods.map((method, index) => (
              <img
                key={index}
                src={method.url}
                alt={method.name}
                className="h-3.5 opacity-50 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;