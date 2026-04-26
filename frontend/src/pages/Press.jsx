import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDownload, 
  FiMail, 
  FiExternalLink, 
  FiArrowRight, 
  FiAward, 
  FiGlobe, 
  FiTrendingUp, 
  FiUsers,
  FiX,
  FiCheck,
  FiSend,
  FiUser,
  FiFileText,
  FiCalendar,
  FiTag,
  FiSearch,
  FiFilter,
  FiBookmark,
  FiShare2,
  FiCopy,
  FiLink,
  FiPlay,
  FiImage,
  FiMonitor,
  FiSmartphone
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';

// Press Contact Modal
const PressContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    outlet: '',
    topic: '',
    deadline: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setFormData({ name: '', email: '', outlet: '', topic: '', deadline: '', message: '' });
    }, 2500);
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
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            {submitted ? (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <h3 className="text-lg font-bold dark:text-white mb-2">Message Sent!</h3>
                <p className="text-sm text-neutral-500">Our press team will respond within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">Contact Press Team</h3>
                    <p className="text-xs text-neutral-500">For media inquiries and press information</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Name *</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input name="name" value={formData.name} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="Your name" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email *</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="your@email.com" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Media Outlet</label>
                    <div className="relative">
                      <FiMonitor className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input name="outlet" value={formData.outlet} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="Forbes, TechCrunch, etc." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Topic</label>
                      <select name="topic" value={formData.topic} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer">
                        <option value="">Select topic</option>
                        <option value="product">Product Launch</option>
                        <option value="funding">Funding News</option>
                        <option value="partnership">Partnership</option>
                        <option value="company">Company News</option>
                        <option value="interview">Interview Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Deadline</label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white resize-none" placeholder="Describe your inquiry..." />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2">
                      {loading ? (
                        <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </motion.svg>
                      ) : <FiSend className="h-4 w-4" />}
                      {loading ? 'Sending...' : 'Send Message'}
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

// Press Kit Download Modal
const PressKitModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', outlet: '', usage: '' });
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
      setFormData({ name: '', email: '', outlet: '', usage: '' });
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
                <h3 className="text-lg font-bold dark:text-white mb-2">Download Starting!</h3>
                <p className="text-sm text-neutral-500">Check your email for the download link.</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-6 text-white text-center">
                  <FiDownload className="h-10 w-10 mx-auto mb-3 opacity-80" />
                  <h3 className="text-xl font-bold mb-1">Download Press Kit</h3>
                  <p className="text-sm text-white/80">Brand assets, logos, and media resources</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input name="name" value={formData.name} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="Your name" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email *</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Media Outlet</label>
                    <input name="outlet" value={formData.outlet} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="Publication name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Intended Use</label>
                    <select name="usage" value={formData.usage} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer">
                      <option value="">Select purpose</option>
                      <option value="article">News Article</option>
                      <option value="blog">Blog Post</option>
                      <option value="social">Social Media</option>
                      <option value="research">Research</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2">
                      {loading ? (
                        <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </motion.svg>
                      ) : <FiDownload className="h-4 w-4" />}
                      {loading ? 'Preparing...' : 'Download Kit'}
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

// Article Modal
const ArticleModal = ({ isOpen, onClose, article }) => {
  if (!article) return null;

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
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            <div className="relative h-48 bg-gradient-to-br from-primary-500 to-purple-600">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
              <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors">
                <FiX className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white">{article.category}</span>
                  <span className="text-xs text-white/80">{article.date}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{article.title}</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-neutral-500">Published by</span>
                <span className="text-sm font-semibold dark:text-white">{article.outlet}</span>
                <div className="flex items-center gap-2 ml-auto">
                  <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" title="Copy link">
                    <FiLink className="h-4 w-4" />
                  </button>
                  <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" title="Share">
                    <FiShare2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" title="Bookmark">
                    <FiBookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Full article content would be displayed here. This is a summary of the press release covering {article.title.toLowerCase()}. 
                  For the complete article, please visit {article.outlet}'s website or contact our press team for more information.
                </p>
              </div>
              <div className="flex gap-3 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <a href="#" className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-center">
                  Read Full Article <FiExternalLink className="inline ml-1.5 h-3.5 w-3.5" />
                </a>
                <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Press = () => {
  const [hoveredRelease, setHoveredRelease] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPressKitModal, setShowPressKitModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const pressReleases = [
    { date: 'March 15, 2024', title: 'Furniqo Launches Sustainable Furniture Line Made from Recycled Ocean Plastics', outlet: 'Business Wire', category: 'Product', id: 1 },
    { date: 'February 28, 2024', title: 'Furniqo Named Top 10 Most Innovative Furniture Retailer by Forbes', outlet: 'Forbes', category: 'Award', id: 2 },
    { date: 'January 20, 2024', title: 'Furniqo Announces Expansion into European and Asian Markets', outlet: 'Reuters', category: 'Expansion', id: 3 },
    { date: 'December 10, 2023', title: 'Furniqo Raises $50M in Series B Funding to Accelerate Growth', outlet: 'TechCrunch', category: 'Funding', id: 4 },
    { date: 'November 5, 2023', title: 'Furniqo Partners with Award-Winning Interior Designers for Exclusive Collection', outlet: 'Architectural Digest', category: 'Partnership', id: 5 },
    { date: 'October 18, 2023', title: 'Furniqo Opens First Flagship Showroom in New York City', outlet: 'The New York Times', category: 'Expansion', id: 6 },
    { date: 'September 8, 2023', title: 'Furniqo Wins Sustainability Award for Eco-Friendly Packaging Initiative', outlet: 'Green Business Journal', category: 'Award', id: 7 },
  ];

  const categories = ['all', ...new Set(pressReleases.map(p => p.category))];

  const filteredReleases = pressReleases.filter(pr => {
    const matchesSearch = pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.outlet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pr.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const mediaAssets = [
    { title: 'Brand Guidelines', desc: 'Logo files, colors, and typography guide', size: '2.4 MB', format: 'PDF' },
    { title: 'Press Kit', desc: 'High-res product images and fact sheet', size: '15.8 MB', format: 'ZIP' },
    { title: 'Executive Photos', desc: 'CEO and leadership team headshots', size: '8.3 MB', format: 'ZIP' },
    { title: 'Product Gallery', desc: 'Latest collection lifestyle images', size: '22 MB', format: 'ZIP' },
  ];

  const stats = [
    { label: 'Media Mentions', value: '250+', icon: FiTrendingUp },
    { label: 'Countries Covered', value: '15+', icon: FiGlobe },
    { label: 'Industry Awards', value: '12', icon: FiAward },
    { label: 'Press Team', value: '8', icon: FiUsers },
  ];

  const openArticle = (article) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80" 
            alt="Press Room" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/85 to-neutral-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/30" />
        </div>

        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>

        <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-[5%] w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[120px]" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 50, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10 right-[5%] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[120px]" />

        <div className="relative w-full px-[1%] py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-6 border border-white/10">
                  <FiFileText className="h-3.5 w-3.5" />
                  <span className="tracking-wide uppercase">Press Room</span>
                </motion.div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-[1.1] tracking-tight text-white">
                  Furniqo{' '}
                  <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Newsroom</span>
                </h1>
                
                <p className="text-base lg:text-lg text-neutral-300 max-w-lg mb-8 leading-relaxed">
                  Latest news, media resources, and press contact information for journalists and media professionals.
                </p>

                <div className="flex flex-wrap gap-3">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowContactModal(true)} className="px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-all shadow-xl shadow-white/10">
                    <FiMail className="inline mr-2 h-4 w-4" />
                    Contact Press Team
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowPressKitModal(true)} className="px-6 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10">
                    Download Press Kit
                    <FiDownload className="inline ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="grid grid-cols-2 gap-3">
                {stats.map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }} whileHover={{ y: -5, scale: 1.03 }} className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 lg:p-6 hover:bg-white/10 transition-all duration-300">
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

      {/* Press Releases Section */}
      <section className="w-full px-[1%] py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Press Releases</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Stay updated with our latest announcements</p>
          </motion.div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search press releases..." className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 shadow-sm transition-all" />
            </div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer shadow-sm">
              {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            {filteredReleases.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <FiFileText className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">No releases found matching your criteria</p>
              </motion.div>
            ) : (
              filteredReleases.map((pr, i) => (
                <motion.div
                  key={pr.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onHoverStart={() => setHoveredRelease(i)}
                  onHoverEnd={() => setHoveredRelease(null)}
                  onClick={() => openArticle(pr)}
                  className="group cursor-pointer"
                >
                  <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                    hoveredRelease === i 
                      ? 'bg-neutral-50 dark:bg-neutral-900 border-primary-300 dark:border-primary-700 shadow-lg' 
                      : 'bg-white dark:bg-neutral-950 border-neutral-100 dark:border-neutral-800 hover:shadow-md'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs font-medium text-neutral-500">{pr.date}</span>
                          <span className="text-xs text-neutral-300">•</span>
                          <span className="text-xs font-medium text-neutral-500">{pr.outlet}</span>
                          <span className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium">{pr.category}</span>
                        </div>
                        <h3 className="text-sm lg:text-base font-bold dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{pr.title}</h3>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                        <FiArrowRight className={`h-4 w-4 transition-all duration-200 ${hoveredRelease === i ? 'text-primary-600 translate-x-0.5' : 'text-neutral-400'}`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Media Assets Section */}
      <section className="w-full px-[1%] py-12 lg:py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Media Assets</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Download logos, images, and press materials</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {mediaAssets.map((asset, i) => (
              <motion.div key={asset.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }} onClick={() => setShowPressKitModal(true)} className="group cursor-pointer bg-white dark:bg-neutral-800 rounded-2xl p-5 lg:p-6 border border-neutral-100 dark:border-neutral-700 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FiDownload className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-bold text-sm dark:text-white mb-1">{asset.title}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">{asset.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700">
                  <span className="text-[10px] text-neutral-400">{asset.size} • {asset.format}</span>
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Get <FiDownload className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-[1%] py-12 lg:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FiMail className="h-7 w-7 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2 dark:text-white">Media Inquiries</h2>
            <p className="text-sm lg:text-base text-neutral-500 dark:text-neutral-400 mb-6">
              For press inquiries, interview requests, or media information, contact our communications team.
            </p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowContactModal(true)} className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20">
              Contact Press Team
              <FiArrowRight className="inline ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Newsletter />

      {/* Modals */}
      <PressContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      <PressKitModal isOpen={showPressKitModal} onClose={() => setShowPressKitModal(false)} />
      <ArticleModal isOpen={showArticleModal} onClose={() => setShowArticleModal(false)} article={selectedArticle} />
    </div>
  );
};

export default Press;