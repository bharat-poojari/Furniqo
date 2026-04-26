import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronDown, 
  FiSearch, 
  FiMessageCircle, 
  FiX,
  FiArrowRight,
  FiHelpCircle,
  FiBookOpen,
  FiExternalLink,
  FiCopy,
  FiCheck,
  FiShare2
} from 'react-icons/fi';
import { faqs } from '../data/data';
import Newsletter from '../components/layout/Newsletter';

// Question Detail Modal
const QuestionDetailModal = ({ isOpen, onClose, faq }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !faq) return null;

  return (
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
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-neutral-800"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 p-5 text-white">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="absolute top-4 right-4 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors z-10"
          >
            <FiX className="h-4 w-4" />
          </button>
          <div className="relative">
            <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-3">
              {faq.category}
            </span>
            <h2 className="text-lg font-bold leading-snug pr-8">{faq.question}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
              {faq.answer}
            </p>
          </div>

          {/* Related Links */}
          {faq.relatedLinks && faq.relatedLinks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Related Resources</h4>
              <div className="space-y-2">
                {faq.relatedLinks.map((link, i) => (
                  <a key={i} href={link.url} className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group">
                    <FiExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="group-hover:underline">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-neutral-400"
            >
              {copied ? <FiCheck className="h-3.5 w-3.5 text-emerald-500" /> : <FiCopy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-neutral-400"
            >
              <FiShare2 className="h-3.5 w-3.5" />
              Share
            </button>
            <a
              href="/contact"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors ml-auto"
            >
              <FiMessageCircle className="h-3.5 w-3.5" />
              Contact Support
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const categories = ['all', ...new Set(faqs.map(faq => faq.category))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedFAQs = categories.filter(c => c !== 'all').map(cat => ({
    category: cat,
    items: filteredFAQs.filter(f => f.category === cat)
  })).filter(g => g.items.length > 0);

  const popularQuestions = faqs.slice(0, 5);

  const handlePopularClick = (faq) => {
    setSearchTerm('');
    setActiveCategory('all');
    setSelectedFaq(faq);
    setShowDetailModal(true);
  };

  const handleFaqClick = (faq, indexKey) => {
    setSelectedFaq(faq);
    if (openIndex === indexKey) {
      setOpenIndex(null);
    } else {
      setOpenIndex(indexKey);
    }
  };

  const handleViewDetails = (e, faq) => {
    e.stopPropagation();
    setSelectedFaq(faq);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedFaq(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-[1%] py-[1%]">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-5"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 mb-3"
          >
            <FiHelpCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </motion.div>
          <h1 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mb-1 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
            Find answers to common questions about our products and services
          </p>
        </motion.div>

        {/* Search & Category Tabs - Single Row */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-5 space-y-3"
        >
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 shadow-sm transition-all"
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <FiX className="h-4 w-4 text-neutral-400" />
              </button>
            )}
          </div>

          {/* Category Tabs - Single Row with Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-4">
          
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-3"
          >
            {/* Popular Questions Panel */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                <FiBookOpen className="h-4 w-4 text-primary-500" />
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Popular Questions</h3>
              </div>
              <div>
                {popularQuestions.map((faq, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePopularClick(faq)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-b border-neutral-50 dark:border-neutral-800 last:border-0 group"
                  >
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors pr-2 line-clamp-2 leading-relaxed">
                      {faq.question}
                    </span>
                    <FiExternalLink className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Help CTA */}
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-4 text-white text-center">
              <FiMessageCircle className="h-6 w-6 mx-auto mb-2 opacity-80" />
              <h3 className="text-sm font-bold mb-1">Still need help?</h3>
              <p className="text-xs text-white/80 mb-3">Our support team is ready to assist you.</p>
              <a
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold hover:bg-white/30 transition-all"
              >
                Contact Us <FiArrowRight className="h-3 w-3" />
              </a>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
                <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FiSearch className="h-6 w-6 text-neutral-400" />
                </div>
                <h3 className="text-sm font-semibold dark:text-white mb-1">No questions found</h3>
                <p className="text-xs text-neutral-500 mb-3">Try different search terms or browse categories</p>
                <button 
                  type="button"
                  onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                  className="text-xs text-primary-600 font-medium hover:text-primary-700"
                >
                  Clear search
                </button>
              </div>
            ) : searchTerm ? (
              <div className="space-y-2">
                <p className="text-xs text-neutral-400 mb-2">{filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchTerm}"</p>
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={`search-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => handleFaqClick(faq, `search-${index}`)}
                      className="w-full p-3.5 text-left flex items-start justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">{faq.question}</span>
                        <p className="text-xs text-neutral-400 mt-0.5">{faq.category}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleViewDetails(e, faq)}
                          className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline hidden sm:block"
                        >
                          View Details
                        </button>
                        <motion.div animate={{ rotate: openIndex === `search-${index}` ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <FiChevronDown className="h-4 w-4 text-neutral-400" />
                        </motion.div>
                      </div>
                    </button>
                    <AnimatePresence>
                      {openIndex === `search-${index}` && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3.5 pb-3.5">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">{faq.answer}</p>
                            <button
                              type="button"
                              onClick={(e) => handleViewDetails(e, faq)}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                            >
                              View full details <FiArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {groupedFAQs.map((group, gi) => (
                  <motion.div
                    key={group.category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.08 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{group.category}</h3>
                      <span className="text-[10px] text-neutral-300">{group.items.length} Q&A</span>
                    </div>
                    <div className="space-y-1.5">
                      {group.items.map((faq, index) => (
                        <div
                          key={`${gi}-${index}`}
                          className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => handleFaqClick(faq, `${gi}-${index}`)}
                            className="w-full p-3 text-left flex items-start justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
                          >
                            <span className="text-sm font-medium text-neutral-900 dark:text-white pr-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{faq.question}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                type="button"
                                onClick={(e) => handleViewDetails(e, faq)}
                                className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                              >
                                Details
                              </button>
                              <motion.div 
                                animate={{ rotate: openIndex === `${gi}-${index}` ? 180 : 0 }} 
                                transition={{ duration: 0.2 }}
                              >
                                <FiChevronDown className="h-4 w-4 text-neutral-400" />
                              </motion.div>
                            </div>
                          </button>
                          <AnimatePresence>
                            {openIndex === `${gi}-${index}` && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3">
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">{faq.answer}</p>
                                  <button
                                    type="button"
                                    onClick={(e) => handleViewDetails(e, faq)}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                                  >
                                    View full details <FiArrowRight className="h-3 w-3" />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredFAQs.length > 0 && (
              <p className="text-center text-[10px] text-neutral-400 mt-4">
                Showing {filteredFAQs.length} of {faqs.length} questions
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <Newsletter />

      {/* Question Detail Modal */}
      <QuestionDetailModal 
        isOpen={showDetailModal} 
        onClose={closeModal} 
        faq={selectedFaq} 
      />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default FAQ;