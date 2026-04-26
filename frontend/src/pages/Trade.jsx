import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPercent, 
  FiPackage, 
  FiHeadphones, 
  FiStar, 
  FiArrowRight, 
  FiCheck,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiFileText,
  FiSend,
  FiX,
  FiShield,
  FiTruck,
  FiClock,
  FiDollarSign,
  FiAward,
  FiUsers,
  FiGrid,
  FiLayers,
  FiGift,
  FiZap,
  FiChevronRight
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';

// Application Modal
const TradeApplicationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    profession: '',
    licenseNumber: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    annualBudget: '',
    projectTypes: '',
    hearAbout: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email || !formData.profession) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setStep(1);
      setFormData({
        companyName: '', contactName: '', email: '', phone: '', profession: '',
        licenseNumber: '', website: '', address: '', city: '', state: '',
        zipCode: '', annualBudget: '', projectTypes: '', hearAbout: ''
      });
    }, 2500);
  };

  const professions = [
    'Interior Designer',
    'Architect',
    'Property Developer',
    'Real Estate Stager',
    'Hospitality Group',
    'Contractor',
    'Other'
  ];

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            {submitted ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5"
                >
                  <FiCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <h3 className="text-xl font-bold dark:text-white mb-2">Application Submitted!</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                  Our team will review your application and get back to you within 2-3 business days.
                </p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">Trade Program Application</h3>
                    <p className="text-xs text-neutral-500">Step {step} of 2</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-1.5 px-5 pt-4">
                  <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                  <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                </div>

                <form onSubmit={handleSubmit} className="p-5">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Company Name *</label>
                        <div className="relative">
                          <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="Your Company Name" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Contact Name</label>
                          <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input name="contactName" value={formData.contactName} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="John Doe" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email *</label>
                          <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="john@company.com" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Phone</label>
                          <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="+1 (555) 000-0000" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Profession *</label>
                          <select name="profession" value={formData.profession} onChange={handleChange} required className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer">
                            <option value="">Select profession</option>
                            {professions.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">License/Registration Number</label>
                        <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="License # (if applicable)" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Website/Portfolio</label>
                        <input name="website" value={formData.website} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="https://yourcompany.com" />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">City</label>
                          <input name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="City" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">State</label>
                          <input name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="State" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Annual Project Budget</label>
                        <select name="annualBudget" value={formData.annualBudget} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer">
                          <option value="">Select budget range</option>
                          <option value="under-50k">Under $50,000</option>
                          <option value="50k-100k">$50,000 - $100,000</option>
                          <option value="100k-250k">$100,000 - $250,000</option>
                          <option value="250k-500k">$250,000 - $500,000</option>
                          <option value="500k+">$500,000+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Types of Projects</label>
                        <textarea name="projectTypes" value={formData.projectTypes} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white resize-none" placeholder="Residential, Commercial, Hospitality, etc." />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">How did you hear about us?</label>
                        <select name="hearAbout" value={formData.hearAbout} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer">
                          <option value="">Select option</option>
                          <option value="search">Search Engine</option>
                          <option value="social">Social Media</option>
                          <option value="referral">Referral</option>
                          <option value="event">Trade Show/Event</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-5">
                    {step === 2 && (
                      <button type="button" onClick={() => setStep(1)} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">
                        Back
                      </button>
                    )}
                    {step === 1 ? (
                      <button type="button" onClick={() => setStep(2)} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                        Continue <FiArrowRight className="inline ml-1.5 h-4 w-4" />
                      </button>
                    ) : (
                      <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2">
                        {loading ? (
                          <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </motion.svg>
                        ) : (
                          <FiSend className="h-4 w-4" />
                        )}
                        {loading ? 'Submitting...' : 'Submit Application'}
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Trade = () => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);

  const benefits = [
    { 
      icon: FiPercent, 
      title: 'Exclusive Discounts', 
      description: 'Up to 20% off on all orders for trade professionals. Volume pricing for large projects.',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      stat: '20%'
    },
    { 
      icon: FiPackage, 
      title: 'Bulk Ordering', 
      description: 'Streamlined process for large volume orders with dedicated logistics support.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      stat: '2x'
    },
    { 
      icon: FiHeadphones, 
      title: 'Dedicated Manager', 
      description: 'Personal account manager for all your needs. Priority support and consultations.',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      stat: '24/7'
    },
    { 
      icon: FiStar, 
      title: 'Early Access', 
      description: 'First look at new collections before public release. Exclusive previews.',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      stat: 'VIP'
    },
  ];

  const additionalBenefits = [
    { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $1,000' },
    { icon: FiShield, title: 'Extended Warranty', desc: '5-year coverage on all products' },
    { icon: FiClock, title: 'Quick Turnaround', desc: 'Priority production scheduling' },
    { icon: FiGift, title: 'Sample Program', desc: 'Free material samples' },
    { icon: FiZap, title: 'Express Delivery', desc: 'Rush orders available' },
    { icon: FiAward, title: 'Quality Guarantee', desc: '100% satisfaction assured' },
  ];

  const eligibleProfessions = [
    { title: 'Licensed Interior Designers', description: 'ASID, IIDA, or state-licensed professionals' },
    { title: 'Registered Architects', description: 'AIA members and licensed practitioners' },
    { title: 'Property Developers', description: 'Commercial and residential developers' },
    { title: 'Real Estate Stagers', description: 'Certified home staging professionals' },
    { title: 'Hospitality Groups', description: 'Hotels, restaurants, and event spaces' },
    { title: 'Contractors & Builders', description: 'Licensed general contractors' },
  ];

  const testimonials = [
    { name: 'Studio McGee Design', role: 'Interior Design Firm', quote: 'The trade program has transformed how we source furniture for our clients. The discounts and dedicated support are unmatched.' },
    { name: 'HOK Architecture', role: 'Architecture Firm', quote: 'Seamless bulk ordering and priority support make Furniqo our go-to for commercial projects.' },
    { name: 'Meridith Baer Home', role: 'Staging Company', quote: 'Early access to new collections gives us a competitive edge. Highly recommend the trade program.' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80" 
            alt="Interior design professional" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/80 to-neutral-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/30" />
        </div>

        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>

        {/* Floating Orbs */}
        <motion.div animate={{ x: [0, 60, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-[5%] w-[350px] h-[350px] bg-primary-500/10 rounded-full blur-[100px]" />
        <motion.div animate={{ x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10 right-[5%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />

        <div className="relative w-full px-[1%] py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-6 border border-white/10"
                >
                  <FiAward className="h-3.5 w-3.5" />
                  <span className="tracking-wide uppercase">Trade Program</span>
                  <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </motion.div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-[1.1] tracking-tight text-white">
                  Furniqo for{' '}
                  <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Professionals</span>
                </h1>
                
                <p className="text-base lg:text-lg text-neutral-300 max-w-lg mb-8 leading-relaxed">
                  Exclusive benefits, dedicated support, and preferential pricing for interior designers, architects, and property developers.
                </p>

                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowApplicationModal(true)}
                    className="px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-all shadow-xl shadow-white/10"
                  >
                    Apply for Trade Account
                    <FiArrowRight className="inline ml-2 h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-6 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10"
                  >
                    View Benefits
                    <FiChevronRight className="inline ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Right Side - Key Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { value: '20%', label: 'Trade Discount', icon: FiPercent },
                  { value: '500+', label: 'Trade Partners', icon: FiUsers },
                  { value: '24/7', label: 'Priority Support', icon: FiHeadphones },
                  { value: '2x', label: 'Faster Delivery', icon: FiTruck },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 lg:p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <stat.icon className="h-6 w-6 text-primary-400 mb-3" />
                    <div className="text-2xl lg:text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-neutral-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="w-full px-[1%] py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Trade Benefits</h2>
            <p className="text-sm lg:text-base text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
              Everything you need to grow your business
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                onHoverStart={() => setHoveredBenefit(i)}
                onHoverEnd={() => setHoveredBenefit(null)}
                className={`group relative ${b.bgColor} rounded-2xl p-5 lg:p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${b.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                    <b.icon className="h-5 w-5 lg:h-5.5 lg:w-5.5 text-white" />
                  </div>
                  <motion.span
                    animate={{ scale: hoveredBenefit === i ? 1.1 : 1 }}
                    className={`text-lg lg:text-xl font-black bg-gradient-to-br ${b.color} bg-clip-text text-transparent`}
                  >
                    {b.stat}
                  </motion.span>
                </div>
                <h3 className="font-bold text-sm lg:text-base dark:text-white mb-1.5">{b.title}</h3>
                <p className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Additional Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
            {additionalBenefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="text-center p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:shadow-sm transition-all duration-200"
              >
                <b.icon className="h-4 w-4 text-primary-500 mx-auto mb-1.5" />
                <p className="text-xs font-semibold dark:text-white">{b.title}</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="w-full px-[1%] py-12 lg:py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Who Can Apply?</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Membership is available for qualified professionals</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {eligibleProfessions.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ x: 3 }}
                className="flex items-start gap-3 bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100 dark:border-neutral-700 group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FiCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm dark:text-white">{item.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full px-[1%] py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Trusted by Industry Leaders</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">See what our trade partners say</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 lg:p-6 border border-neutral-100 dark:border-neutral-800 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-sm dark:text-white">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-[1%] py-12 lg:py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FiAward className="h-7 w-7 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2 dark:text-white">Join Our Trade Program</h2>
            <p className="text-sm lg:text-base text-neutral-500 dark:text-neutral-400 mb-6">
              Apply today and start enjoying exclusive trade benefits, dedicated support, and preferential pricing.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowApplicationModal(true)}
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
            >
              Apply Now
              <FiArrowRight className="inline ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Newsletter />

      {/* Application Modal */}
      <TradeApplicationModal 
        isOpen={showApplicationModal} 
        onClose={() => setShowApplicationModal(false)} 
      />
    </div>
  );
};

export default Trade;