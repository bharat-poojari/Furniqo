import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  FiShare2,
  FiTrendingUp,
  FiZap,
  FiStar,
  FiThumbsUp,
  FiThumbsDown,
  FiMail,
  FiClock,
  FiUsers,
  FiTag,
  FiLink,
  FiFilter,
  FiLoader
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import apiWrapper from '../services/apiWrapper';

// ============================================================================
// Types & Constants
// ============================================================================

const categoryNames = {
  'all': 'All',
  'Returns': 'Returns',
  'Shipping': 'Shipping',
  'Orders': 'Orders',
  'Payments': 'Payments',
  'Products': 'Products',
  'general': 'General',
  'account': 'Account',
  'technical': 'Technical',
  'gift cards': 'Gift Cards'
};

const categoryIcons = {
  'All': FiHelpCircle,
  'Returns': FiStar,
  'Shipping': FiClock,
  'Orders': FiBookOpen,
  'Payments': FiZap,
  'Products': FiTrendingUp,
  'General': FiHelpCircle,
  'Account': FiUsers,
  'Technical': FiZap,
  'Gift Cards': FiStar
};

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant', icon: FiTrendingUp },
  { value: 'popular', label: 'Most Helpful', icon: FiThumbsUp },
  { value: 'newest', label: 'Newest First', icon: FiClock }
];

// ============================================================================
// Utility Functions
// ============================================================================

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) => 
    regex.test(part) ? 
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-neutral-900 dark:text-white rounded px-0.5">
        {part}
      </mark> : 
      part
  );
};

// ============================================================================
// Subcomponents
// ============================================================================

// Category Chip with animation
const CategoryChip = ({ category, count, isActive, onClick }) => {
  const Icon = categoryIcons[category] || FiHelpCircle;
  
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
        isActive
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
          : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-sm'
      }`}
    >
      <Icon className={`h-3 w-3 ${isActive ? 'text-white' : ''}`} />
      <span>{category}</span>
      <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-neutral-400'}`}>{count}</span>
    </motion.button>
  );
};

// Popular Item Component
const PopularItem = ({ faq, rank, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-start gap-3 p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-xl transition-all group"
  >
    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mt-0.5 shadow-sm">
      <span className="text-[9px] font-bold text-white">{rank}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
        {faq.question}
      </p>
      <span className="text-[10px] text-neutral-400 mt-0.5 block">{faq.category || 'General'}</span>
    </div>
    <FiArrowRight className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
  </motion.button>
);

// FAQ Item Component - No nested buttons
const FAQItem = ({ faq, isOpen, onToggle, onViewDetails, searchTerm, onHelpful, helpfulStates }) => {
  const helpfulState = helpfulStates[faq.id] || { type: null, count: faq.helpful || 0 };
  
  const handleHelpfulClick = (type, e) => {
    e.stopPropagation();
    onHelpful(faq.id, type, helpfulState.count);
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    onViewDetails();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-white dark:bg-neutral-900 rounded-xl border transition-all duration-200 overflow-hidden ${
        isOpen 
          ? 'border-primary-300 dark:border-primary-700 shadow-lg shadow-primary-500/10' 
          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md'
      }`}
    >
      {/* Header - Clickable div instead of button to avoid nesting */}
      <div
        onClick={onToggle}
        className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors group cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-neutral-900 dark:text-white leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {searchTerm ? highlightText(faq.question, searchTerm) : faq.question}
          </h4>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] px-1.5 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
              {faq.category || 'General'}
            </span>
            <span className="text-[10px] text-neutral-400 flex items-center gap-0.5">
              <FiThumbsUp className="h-2.5 w-2.5" />
              {helpfulState.count}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            onClick={handleDetailsClick}
            className="text-[11px] px-2.5 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors cursor-pointer hidden sm:inline-block"
          >
            Details
          </span>
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }} 
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="text-neutral-400"
          >
            <FiChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-3">
                {searchTerm ? highlightText(faq.answer, searchTerm) : faq.answer}
              </p>
              
              <div className="flex items-center gap-3 mt-3 pt-2">
                <span className="text-[10px] text-neutral-500">Was this helpful?</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleHelpfulClick('yes', e)}
                    className={`p-1 rounded-md transition-all ${
                      helpfulState.type === 'yes' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' 
                        : 'text-neutral-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                    }`}
                  >
                    <FiThumbsUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => handleHelpfulClick('no', e)}
                    className={`p-1 rounded-md transition-all ${
                      helpfulState.type === 'no' 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600' 
                        : 'text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    <FiThumbsDown className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <span
                onClick={handleDetailsClick}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 dark:text-primary-400 mt-3 hover:gap-2 transition-all cursor-pointer"
              >
                Read full answer <FiArrowRight className="h-2.5 w-2.5" />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced Question Detail Modal
const QuestionDetailModal = ({ isOpen, onClose, faq, relatedFaqs, onRelatedClick, onHelpful, helpfulStates }) => {
  const [copied, setCopied] = useState(false);
  const helpfulState = faq ? (helpfulStates[faq.id] || { type: null, count: faq.helpful || 0 }) : { type: null, count: 0 };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?faq=${faq?.id}`);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?faq=${faq?.id}`;
    const shareData = {
      title: 'FAQ - Furniqo',
      text: faq?.question,
      url: shareUrl,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleHelpfulClick = (type) => {
    if (faq) {
      onHelpful(faq.id, type, helpfulState.count);
    }
  };

  if (!isOpen || !faq) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="relative bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border-t sm:border border-neutral-200 dark:border-neutral-800"
        >
          {/* Header with gradient */}
          <div className="sticky top-0 bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 p-5 text-white z-10">
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all hover:scale-105"
            >
              <FiX className="h-4 w-4" />
            </button>
            <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-2">
              {faq.category || 'General'}
            </span>
            <h2 className="text-base font-bold leading-snug pr-8">{faq.question}</h2>
          </div>

          <div className="p-5">
            {/* Answer */}
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {faq.answer}
            </p>

            {/* Helpful section */}
            <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-xs text-neutral-500 mb-2">Was this answer helpful?</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleHelpfulClick('yes')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    helpfulState.type === 'yes' 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700'
                      : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 hover:border-emerald-300'
                  }`}
                >
                  <FiThumbsUp className="h-3 w-3" />
                  Yes ({helpfulState.count})
                </button>
                <button
                  onClick={() => handleHelpfulClick('no')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    helpfulState.type === 'no'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700'
                      : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 hover:border-red-300'
                  }`}
                >
                  <FiThumbsDown className="h-3 w-3" />
                  No
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 hover:border-primary-300 transition-all"
              >
                {copied ? <FiCheck className="h-3 w-3 text-emerald-500" /> : <FiCopy className="h-3 w-3" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 hover:border-primary-300 transition-all"
              >
                <FiShare2 className="h-3 w-3" />
                Share
              </button>
              <a
                href="/contact"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-all ml-auto shadow-sm hover:shadow"
              >
                <FiMessageCircle className="h-3 w-3" />
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Recent Searches Component
const RecentSearches = ({ searches, onSelect, onClear }) => {
  if (searches.length === 0) return null;
  
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-20">
      <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-700 flex justify-between items-center">
        <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Recent Searches</span>
        <button onClick={onClear} className="text-[10px] text-neutral-400 hover:text-red-500 transition-colors">
          Clear
        </button>
      </div>
      {searches.map((search, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(search)}
          className="w-full px-3 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
        >
          <FiSearch className="h-3 w-3 text-neutral-400" />
          {search}
        </button>
      ))}
    </div>
  );
};

// Quick Navigation Component
const QuickNav = ({ categories, activeCategory, onSelect, categoryCounts }) => {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {categories.map((cat) => (
        <CategoryChip
          key={cat}
          category={categoryNames[cat] || cat}
          count={categoryCounts[cat] || 0}
          isActive={activeCategory === cat}
          onClick={() => onSelect(cat)}
        />
      ))}
    </div>
  );
};

// Empty State Component
const EmptyStateFaq = ({ onClearFilters, searchTerm }) => (
  <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
    <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-xl flex items-center justify-center mx-auto mb-4">
      <FiSearch className="h-8 w-8 text-neutral-400" />
    </div>
    <h3 className="text-base font-semibold dark:text-white mb-2">No results found</h3>
    <p className="text-sm text-neutral-500 max-w-xs mx-auto mb-4">
      We couldn't find any questions matching "{searchTerm}". Try different keywords.
    </p>
    <button 
      onClick={onClearFilters}
      className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow"
    >
      Clear all filters
    </button>
  </div>
);

// Loading Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <FiLoader className="h-8 w-8 animate-spin text-primary-500 mb-3" />
    <p className="text-sm text-neutral-500">Loading frequently asked questions...</p>
  </div>
);

// ============================================================================
// Main FAQ Component
// ============================================================================

const FAQ = () => {
  // State
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('faq_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [helpfulStates, setHelpfulStates] = useState(() => {
    try {
      const saved = localStorage.getItem('faq_helpful_states');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const categoryBarRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch FAQs from API
  const fetchFaqs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getFAQs();
      
      console.log('FAQ API response:', response);
      
      let faqsData = [];
      
      // Handle different response formats
      if (response?.faqs && Array.isArray(response.faqs)) {
        faqsData = response.faqs;
      } else if (response?.data && Array.isArray(response.data)) {
        faqsData = response.data;
      } else if (Array.isArray(response)) {
        faqsData = response;
      } else if (response?.data?.faqs && Array.isArray(response.data.faqs)) {
        faqsData = response.data.faqs;
      }
      
      // Map the data to ensure consistent field names
      const mappedFaqs = faqsData.map(faq => ({
        id: faq.id || faq._id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'General',
        popular: faq.popular || false,
        helpful: faq.helpful || 0,
        tags: faq.tags || [],
        relatedLinks: faq.relatedLinks || [],
        relatedFaqIds: faq.relatedFaqIds || []
      }));
      
      setFaqs(mappedFaqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load FAQs on mount
  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // Derived data
  const categories = useMemo(() => {
    const cats = new Set(faqs.map(faq => faq.category));
    return ['all', ...Array.from(cats).sort()];
  }, [faqs]);
  
  const categoryCounts = useMemo(() => {
    const counts = {};
    faqs.forEach(faq => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });
    counts['all'] = faqs.length;
    return counts;
  }, [faqs]);

  // Filtered FAQs with sort
  const filteredFAQs = useMemo(() => {
    let filtered = faqs.filter(faq => {
      const matchesSearch = searchTerm === '' ||
        faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (faq.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (helpfulStates[b.id]?.count || b.helpful || 0) - (helpfulStates[a.id]?.count || a.helpful || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      default:
        // relevance - keep as is
        break;
    }
    
    return filtered;
  }, [faqs, searchTerm, activeCategory, sortBy, helpfulStates]);

  const groupedFAQs = useMemo(() => {
    return categories.filter(c => c !== 'all').map(cat => ({
      category: cat,
      items: filteredFAQs.filter(f => f.category === cat)
    })).filter(g => g.items.length > 0);
  }, [filteredFAQs, categories]);

  const popularQuestions = useMemo(() => {
    return [...faqs]
      .filter(f => f.popular)
      .sort((a, b) => (helpfulStates[b.id]?.count || b.helpful || 0) - (helpfulStates[a.id]?.count || a.helpful || 0))
      .slice(0, 4);
  }, [faqs, helpfulStates]);

  // Get related FAQs
  const getRelatedFaqs = useCallback((faq) => {
    if (!faq?.relatedFaqIds?.length) return [];
    return faq.relatedFaqIds
      .map(id => faqs.find(f => f.id === id))
      .filter(Boolean);
  }, [faqs]);

  // Handlers
  const handleFaqToggle = useCallback((faqId) => {
    setOpenId(prev => prev === faqId ? null : faqId);
  }, []);

  const handleViewDetails = useCallback((faq) => {
    setSelectedFaq(faq);
    setShowDetailModal(true);
  }, []);

  const handlePopularClick = useCallback((faq) => {
    setSearchTerm('');
    setActiveCategory('all');
    setSelectedFaq(faq);
    setShowDetailModal(true);
  }, []);

  const handleRelatedClick = useCallback((faq) => {
    setSelectedFaq(faq);
    setOpenId(faq.id);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setActiveCategory('all');
    setSortBy('relevance');
  }, []);

  const handleHelpful = useCallback((faqId, type, currentCount) => {
    setHelpfulStates(prev => {
      const existing = prev[faqId];
      let newCount = currentCount;
      let newType = type;
      
      if (existing?.type === type) {
        newCount = type === 'yes' ? currentCount - 1 : currentCount + 1;
        newType = null;
      } else if (existing?.type === 'yes' && type === 'no') {
        newCount = currentCount - 2;
      } else if (existing?.type === 'no' && type === 'yes') {
        newCount = currentCount + 2;
      } else if (type === 'yes') {
        newCount = currentCount + 1;
      } else if (type === 'no') {
        newCount = currentCount - 1;
      }
      
      const newState = {
        ...prev,
        [faqId]: { type: newType, count: Math.max(0, newCount) }
      };
      
      localStorage.setItem('faq_helpful_states', JSON.stringify(newState));
      return newState;
    });
    
    toast.success(type === 'yes' ? 'Thanks for your feedback!' : 'We appreciate your feedback');
  }, []);

  // Debounced search for performance
  const debouncedSetSearch = useCallback(
    debounce((value) => {
      if (value && !recentSearches.includes(value)) {
        const newSearches = [value, ...recentSearches].slice(0, 5);
        setRecentSearches(newSearches);
        localStorage.setItem('faq_recent_searches', JSON.stringify(newSearches));
      }
    }, 500),
    [recentSearches]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSetSearch(value);
  };

  const handleRecentSearchSelect = (search) => {
    setSearchTerm(search);
    setShowSearchDropdown(false);
    searchInputRef.current?.blur();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('faq_recent_searches');
  };

  // Sticky category bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (categoryBarRef.current) {
        const rect = categoryBarRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 64);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle URL param for direct FAQ linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const faqId = params.get('faq');
    if (faqId && faqs.length > 0) {
      const faq = faqs.find(f => f.id === parseInt(faqId));
      if (faq) {
        setSelectedFaq(faq);
        setShowDetailModal(true);
      }
    }
  }, [faqs]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="w-full px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-500/25 mb-3">
              <FiHelpCircle className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-2 max-w-2xl mx-auto">
              Find answers to common questions about our products and services
            </p>
          </div>

          {/* Search Section with Recent Searches */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                  placeholder="Search questions, topics, or keywords..."
                  className="w-full pl-11 pr-11 py-3 text-base rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:text-white placeholder-neutral-400 transition-all"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <FiX className="h-4 w-4 text-neutral-400" />
                  </button>
                )}
              </div>
              
              <RecentSearches 
                searches={recentSearches}
                onSelect={handleRecentSearchSelect}
                onClear={clearRecentSearches}
              />
            </div>
          </div>

          {/* Category Navigation with Sticky */}
          <div 
            ref={categoryBarRef}
            className={`sticky top-0 z-30 py-3 transition-all duration-200 ${
              isSticky 
                ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm -mx-3 px-3' 
                : ''
            }`}
          >
            <QuickNav 
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Sort and Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setSortBy(prev => {
                    const options = ['relevance', 'popular', 'newest'];
                    const currentIndex = options.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % options.length;
                    return options[nextIndex];
                  })}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-primary-300 transition-all"
                >
                  <FiFilter className="h-3 w-3" />
                  Sort: {sortOptions.find(o => o.value === sortBy)?.label}
                </button>
              </div>
              
              {searchTerm && (
                <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                  {filteredFAQs.length} result(s)
                </span>
              )}
            </div>

            {searchTerm && (
              <button 
                onClick={clearFilters} 
                className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Sidebar */}
            <div className="lg:block">
              {!searchTerm && activeCategory === 'all' && (
                <div className="sticky top-24 space-y-4">
                  {/* Popular Questions Panel */}
                  {popularQuestions.length > 0 && (
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
                            <FiTrendingUp className="h-3.5 w-3.5 text-white" />
                          </div>
                          <h3 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                            Most Popular Questions
                          </h3>
                        </div>
                      </div>
                      <div>
                        {popularQuestions.map((faq, idx) => (
                          <PopularItem 
                            key={faq.id} 
                            faq={faq} 
                            rank={idx + 1} 
                            onClick={() => handlePopularClick(faq)} 
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Support Card */}
                  <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-5 text-white text-center shadow-lg">
                    <FiUsers className="h-8 w-8 mx-auto mb-3 opacity-80" />
                    <h3 className="text-base font-semibold mb-1">Need More Help?</h3>
                    <p className="text-xs text-white/80 mb-4">Our support team is available 24/7</p>
                    <a 
                      href="/contact" 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 rounded-lg text-xs font-semibold hover:bg-white/30 transition-all hover:gap-2"
                    >
                      Contact Support <FiArrowRight className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary-600">{faqs.length}</p>
                        <p className="text-[10px] text-neutral-500">Total Articles</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">
                          {Object.values(helpfulStates).reduce((sum, h) => sum + (h.count || 0), faqs.reduce((s, f) => s + (f.helpful || 0), 0))}
                        </p>
                        <p className="text-[10px] text-neutral-500">Helpful Votes</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Content - FAQ List */}
            <div className="lg:col-span-2">
              {/* Mobile Popular Questions */}
              {!searchTerm && activeCategory === 'all' && popularQuestions.length > 0 && (
                <div className="lg:hidden mb-5">
                  <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                    <div className="p-3 border-b border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
                          <FiTrendingUp className="h-3 w-3 text-white" />
                        </div>
                        <h3 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                          Popular Questions
                        </h3>
                      </div>
                    </div>
                    <div>
                      {popularQuestions.slice(0, 3).map((faq, idx) => (
                        <PopularItem 
                          key={faq.id} 
                          faq={faq} 
                          rank={idx + 1} 
                          onClick={() => handlePopularClick(faq)} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ Results */}
              {filteredFAQs.length === 0 ? (
                <EmptyStateFaq onClearFilters={clearFilters} searchTerm={searchTerm} />
              ) : searchTerm ? (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredFAQs.map((faq) => (
                      <FAQItem
                        key={faq.id}
                        faq={faq}
                        isOpen={openId === faq.id}
                        onToggle={() => handleFaqToggle(faq.id)}
                        onViewDetails={() => handleViewDetails(faq)}
                        searchTerm={searchTerm}
                        onHelpful={handleHelpful}
                        helpfulStates={helpfulStates}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedFAQs.map((group) => (
                    <motion.div 
                      key={group.category}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary-500 to-purple-600" />
                        <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                          {group.category}
                        </h3>
                        <span className="text-[11px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                          {group.items.length} questions
                        </span>
                      </div>
                      <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                          {group.items.map((faq) => (
                            <FAQItem
                              key={faq.id}
                              faq={faq}
                              isOpen={openId === faq.id}
                              onToggle={() => handleFaqToggle(faq.id)}
                              onViewDetails={() => handleViewDetails(faq)}
                              searchTerm={searchTerm}
                              onHelpful={handleHelpful}
                              helpfulStates={helpfulStates}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Footer Stats */}
              {filteredFAQs.length > 0 && (
                <p className="text-center text-xs text-neutral-400 mt-6">
                  Showing {filteredFAQs.length} of {faqs.length} questions
                </p>
              )}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="max-w-6xl mx-auto mt-10">
            <div className="relative bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white overflow-hidden shadow-xl">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 40%, white 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 rounded-full text-xs font-semibold mb-2">
                    <FiMail className="h-3 w-3" />
                    Stay Updated
                  </div>
                  <h3 className="text-lg font-bold mb-0.5">Get the latest updates</h3>
                  <p className="text-sm text-white/80">Subscribe to our newsletter for news and offers</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 rounded-lg text-neutral-900 dark:text-white dark:bg-neutral-800 min-w-[240px] focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="px-5 py-2 bg-white text-primary-600 font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <QuestionDetailModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
        faq={selectedFaq}
        relatedFaqs={getRelatedFaqs(selectedFaq)}
        onRelatedClick={handleRelatedClick}
        onHelpful={handleHelpful}
        helpfulStates={helpfulStates}
      />
    </div>
  );
};

export default FAQ;