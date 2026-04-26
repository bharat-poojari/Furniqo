import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  FiArrowRight,
  FiCheck,
  FiX,
  FiSend,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiHeart,
  FiGlobe,
  FiPackage,
  FiTruck,
  FiShield,
  FiDroplet,
  FiSun,
  FiTrendingUp,
  FiAward,
  FiUsers,
  FiStar,
  FiPlay,
  FiDownload,
  FiBookOpen,
  FiChevronRight,
  FiZap
} from 'react-icons/fi';
import { 
  MdOutlineRecycling,
  MdOutlineEnergySavingsLeaf,
  MdOutlineForest
} from 'react-icons/md';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';

// Custom Leaf Icon (Feather-style)
const LeafIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-0.66 0.95-2.3c0.48-0.17 1.06-0.27 2.34-0.27C14 18 20.22 12 22 6c0 0-1.5 2-5 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 6c-2.5 2-6.5 4-11 4" />
  </svg>
);

// Custom Recycle Icon (Feather-style)
const RecycleIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h0.582m0 0a9.001 9.001 0 0015.356 2.476M4 9h5m11 11v-5h-0.581m0 0a8.997 8.997 0 01-15.357-2.476M20 15h-5" />
  </svg>
);

// Newsletter Modal
const NewsletterModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail('');
    }, 2000);
  };

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
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            {submitted ? (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <h3 className="text-lg font-bold dark:text-white mb-2">You're In!</h3>
                <p className="text-sm text-neutral-500">Thanks for subscribing to our sustainability newsletter.</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white text-center">
                  <LeafIcon className="h-10 w-10 mx-auto mb-3 opacity-80" />
                  <h3 className="text-xl font-bold mb-1">Stay Updated</h3>
                  <p className="text-sm text-white/80">Get sustainability tips and exclusive eco-friendly product launches.</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors flex items-center justify-center gap-2">
                      {loading ? (
                        <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </motion.svg>
                      ) : <FiSend className="h-4 w-4" />}
                      {loading ? 'Subscribing...' : 'Subscribe'}
                    </button>
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

// Report Download Modal
const ReportModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setFormData({ name: '', email: '', company: '' });
    }, 2000);
  };

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
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            {submitted ? (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiDownload className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <h3 className="text-lg font-bold dark:text-white mb-2">Report Sent!</h3>
                <p className="text-sm text-neutral-500">Check your email for the sustainability report.</p>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">Download Report</h3>
                    <p className="text-xs text-neutral-500">Get our 2024 Sustainability Report</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"><FiX className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input name="name" value={formData.name} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white" placeholder="Your name" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email *</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Company</label>
                    <div className="relative">
                      <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input name="company" value={formData.company} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white" placeholder="Company name" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors flex items-center justify-center gap-2">
                      {loading ? (
                        <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </motion.svg>
                      ) : <FiDownload className="h-4 w-4" />}
                      {loading ? 'Sending...' : 'Get Report'}
                    </button>
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

// Video Modal
const VideoModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl aspect-video bg-neutral-900 rounded-2xl overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
              <FiX className="h-5 w-5" />
            </button>
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <FiPlay className="h-16 w-16 mx-auto mb-4 text-white/60" />
                <p className="text-lg font-semibold">Sustainability at Furniqo</p>
                <p className="text-sm text-white/60">Video placeholder - Add your video embed here</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Sustainability = () => {
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [hoveredInitiative, setHoveredInitiative] = useState(null);

  const initiatives = [
    { 
      icon: RecycleIcon,
      title: 'Circular Design',
      description: 'Our furniture is designed for longevity and recyclability. We use modular components that can be easily repaired, refurbished, or recycled.',
      color: 'from-emerald-500 to-teal-500',
      stat: '95%',
      statLabel: 'Recyclable Materials'
    },
    { 
      icon: FiDroplet,
      title: 'Water Conservation',
      description: 'Our manufacturing processes use 60% less water than traditional furniture production through closed-loop water systems.',
      color: 'from-blue-500 to-cyan-500',
      stat: '60%',
      statLabel: 'Less Water Usage'
    },
    { 
      icon: FiSun,
      title: 'Renewable Energy',
      description: 'All our facilities run on 100% renewable energy. Solar panels power our manufacturing plants and warehouses.',
      color: 'from-amber-500 to-orange-500',
      stat: '100%',
      statLabel: 'Renewable Energy'
    },
    { 
      icon: FiTruck,
      title: 'Carbon Neutral Shipping',
      description: 'We offset 100% of our shipping emissions through verified carbon offset programs and optimized logistics.',
      color: 'from-purple-500 to-indigo-500',
      stat: '0',
      statLabel: 'Net Carbon Emissions'
    },
  ];

  const certifications = [
    { name: 'FSC Certified', description: 'Forest Stewardship Council certified wood sourcing', icon: FiShield },
    { name: 'GREENGUARD Gold', description: 'Low chemical emissions for healthier indoor air', icon: FiAward },
    { name: 'B Corp Certified', description: 'Meeting highest standards of social and environmental impact', icon: FiStar },
    { name: 'Carbon Neutral', description: 'Certified carbon neutral operations since 2020', icon: FiGlobe },
  ];

  const milestones = [
    { year: '2020', title: 'Carbon Neutral Achieved', desc: 'Became a fully carbon-neutral company across all operations.' },
    { year: '2021', title: '100% Renewable Energy', desc: 'Transitioned all facilities to renewable energy sources.' },
    { year: '2022', title: 'Zero Waste Manufacturing', desc: 'Achieved zero waste to landfill in manufacturing.' },
    { year: '2023', title: 'Circular Program Launch', desc: 'Launched furniture take-back and recycling program.' },
    { year: '2024', title: 'Net Zero Target Set', desc: 'Committed to net-zero emissions by 2030.' },
  ];

  const impactStats = [
    { value: '50,000+', label: 'Trees Planted', icon: FiHeart, color: 'text-emerald-500' },
    { value: '10M lbs', label: 'Waste Diverted', icon: RecycleIcon, color: 'text-blue-500' },
    { value: '100%', label: 'Green Energy', icon: FiZap, color: 'text-amber-500' },
    { value: '25K+', label: 'Tons CO2 Offset', icon: FiGlobe, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80" 
            alt="Sustainable nature" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/85 to-neutral-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/30" />
        </div>

        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>

        <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-[5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 50, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10 right-[5%] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[120px]" />

        <div className="relative w-full px-[1%] py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-6 border border-white/10">
                  <LeafIcon className="h-3.5 w-3.5" />
                  <span className="tracking-wide uppercase">Sustainability</span>
                  <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </motion.div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-[1.1] tracking-tight text-white">
                  Our Commitment to a{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">Greener Future</span>
                </h1>
                
                <p className="text-base lg:text-lg text-neutral-300 max-w-lg mb-8 leading-relaxed">
                  We believe beautiful furniture shouldn't cost the earth. Discover how we're reducing our environmental impact while delivering exceptional quality.
                </p>

                <div className="flex flex-wrap gap-3">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowVideoModal(true)} className="px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-all shadow-xl shadow-white/10">
                    <FiPlay className="inline mr-2 h-4 w-4" />
                    Watch Our Story
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowReportModal(true)} className="px-6 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10">
                    Download Report
                    <FiDownload className="inline ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="grid grid-cols-2 gap-3">
                {impactStats.map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }} whileHover={{ y: -5, scale: 1.03 }} className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 lg:p-6 hover:bg-white/10 transition-all duration-300">
                    <stat.icon className={`h-6 w-6 ${stat.color} mb-3`} />
                    <div className="text-2xl lg:text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-neutral-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="w-full px-[1%] py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Our Sustainability Initiatives</h2>
            <p className="text-sm lg:text-base text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
              Concrete actions we're taking to protect our planet
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {initiatives.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }} onHoverStart={() => setHoveredInitiative(i)} onHoverEnd={() => setHoveredInitiative(null)} className="group relative bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 lg:p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg border border-neutral-100 dark:border-neutral-800">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                    <item.icon className="h-5 w-5 lg:h-5.5 lg:w-5.5 text-white" />
                  </div>
                  <motion.span animate={{ scale: hoveredInitiative === i ? 1.1 : 1 }} className={`text-lg lg:text-xl font-black bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}>
                    {item.stat}
                  </motion.span>
                </div>
                <h3 className="font-bold text-sm lg:text-base dark:text-white mb-1.5">{item.title}</h3>
                <p className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">{item.description}</p>
                <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">{item.statLabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="w-full px-[1%] py-12 lg:py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Our Journey</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Key milestones in our sustainability journey</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-700 -translate-x-1/2" />

            <div className="space-y-6">
              {milestones.map((milestone, i) => (
                <motion.div key={milestone.year} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-emerald-500 rounded-full -translate-x-1/2 border-2 border-white dark:border-neutral-900 shadow-sm z-10" />
                  
                  <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:pl-10'}`}>
                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-md transition-shadow">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{milestone.year}</span>
                      <h3 className="font-semibold text-sm dark:text-white mt-0.5">{milestone.title}</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{milestone.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="w-full px-[1%] py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Certifications & Standards</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Recognized for our environmental commitment</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {certifications.map((cert, i) => (
              <motion.div key={cert.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }} className="text-center p-5 lg:p-6 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <cert.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-sm dark:text-white mb-1">{cert.name}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-[1%] py-12 lg:py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <LeafIcon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2 dark:text-white">Join Our Green Movement</h2>
            <p className="text-sm lg:text-base text-neutral-500 dark:text-neutral-400 mb-6">
              Sign up for our sustainability newsletter and be the first to know about our eco-friendly initiatives and product launches.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowNewsletterModal(true)} className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
                Subscribe to Updates
                <FiArrowRight className="inline ml-2 h-4 w-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowReportModal(true)} className="px-6 py-3 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all border border-neutral-200 dark:border-neutral-700">
                Download Full Report
                <FiDownload className="inline ml-2 h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Newsletter />

      {/* Modals */}
      <NewsletterModal isOpen={showNewsletterModal} onClose={() => setShowNewsletterModal(false)} />
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
      <VideoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />

      <style>{`
        .h-5\\.5 { height: 1.375rem; }
        .w-5\\.5 { width: 1.375rem; }
      `}</style>
    </div>
  );
};

export default Sustainability;