// src/pages/Policies.jsx
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  FiShield, FiTruck, FiRotateCcw, FiLock, FiArrowLeft,
  FiCheck, FiClock, FiFileText, FiHeart, FiStar, FiUsers,
  FiGlobe, FiMail, FiPhone, FiMapPin, FiPrinter, FiDownload,
  FiLink, FiBookOpen, FiAlertCircle, FiThumbsUp, FiAward,
  FiTrendingUp, FiZap, FiCompass, FiHelpCircle, FiMessageCircle,
  FiHeadphones, FiSearch, FiX, FiChevronDown, FiChevronUp,
  FiCopy, FiShare2, FiThumbsDown, FiHome, FiChevronRight,
  FiInfo, FiAlertTriangle, FiCheckCircle, FiMinimize2, FiMaximize2,
  FiEye, FiBookmark
} from 'react-icons/fi';
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { policies } from '../data/data';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

// ─── Constants ────────────────────────────────────────────────────────────────

const policyIcons = {
  privacy:  FiLock,
  terms:    FiShield,
  shipping: FiTruck,
  returns:  FiRotateCcw,
};

const policyColors = {
  privacy:  'from-violet-600 to-purple-700',
  terms:    'from-blue-600 to-indigo-700',
  shipping: 'from-emerald-600 to-teal-700',
  returns:  'from-orange-600 to-red-600',
};

const policyAccents = {
  privacy:  'violet',
  terms:    'blue',
  shipping: 'emerald',
  returns:  'orange',
};

const policyBanners = {
  privacy:  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=2070&q=80',
  terms:    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2070&q=80',
  shipping: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=2070&q=80',
  returns:  'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=2070&q=80',
};

const policyDescriptions = {
  privacy:  'Learn how we collect, use, and protect your personal information.',
  terms:    'Understand the terms governing your use of our products and services.',
  shipping: 'Everything you need to know about delivery, timelines, and logistics.',
  returns:  'Our hassle-free return process and eligibility criteria explained.',
};

const faqData = {
  privacy: [
    { q: 'What data do you collect about me?', a: 'We collect information you provide directly, such as your name, email, and order history, as well as technical data like IP address and browser type to improve your experience.' },
    { q: 'Can I request my data to be deleted?', a: 'Yes. Under GDPR and similar regulations, you have the right to request deletion of your personal data. Contact our privacy team at privacy@furniqo.com.' },
    { q: 'Do you share my data with third parties?', a: 'We never sell your data. We may share anonymized data with trusted analytics partners, and share necessary order data with delivery providers.' },
  ],
  terms: [
    { q: 'Can I cancel my order after placing it?', a: 'Orders can be cancelled within 24 hours of placement. After that, the cancellation policy depends on the production status of your item.' },
    { q: 'What constitutes a breach of terms?', a: 'Attempting to misuse discount codes, fraudulent chargebacks, or unauthorized reselling of our products are examples of terms violations.' },
    { q: 'Do these terms apply internationally?', a: 'Yes, our terms apply to all users globally. However, local consumer protection laws in your jurisdiction may provide additional rights.' },
  ],
  shipping: [
    { q: 'How long does standard shipping take?', a: 'Standard shipping takes 5–10 business days. Expedited options are available at checkout for 2–3 business day delivery.' },
    { q: 'Do you ship internationally?', a: 'We ship to over 50 countries. International shipping times vary by destination — typically 10–21 business days.' },
    { q: 'What happens if my item arrives damaged?', a: 'Please photograph the damage and contact us within 48 hours of delivery. We will arrange a replacement or full refund at no extra cost.' },
  ],
  returns: [
    { q: 'How long do I have to return an item?', a: 'You have 30 days from the delivery date to initiate a return. Items must be unused and in their original packaging.' },
    { q: 'Who pays for return shipping?', a: 'We provide a prepaid return label for all defective items. For change-of-mind returns, a flat shipping fee of $15 is deducted from your refund.' },
    { q: 'When will I receive my refund?', a: 'Refunds are processed within 3–5 business days after we receive and inspect the returned item.' },
  ],
};

const keyPoints = {
  privacy:  ['GDPR & CCPA compliant', 'No data selling ever', 'End-to-end encryption', 'Right to erasure supported'],
  terms:    ['Clear purchase terms', 'Transparent pricing', 'Fair dispute resolution', 'Consumer rights respected'],
  shipping: ['Free shipping over $500', 'Real-time tracking', 'Carbon-neutral options', '50+ countries served'],
  returns:  ['30-day return window', 'Free defect returns', 'Fast refund processing', 'No-hassle exchanges'],
};

// ─── Utilities ────────────────────────────────────────────────────────────────

const estimateReadTime = (sections) => {
  const words = sections?.reduce((acc, s) => acc + (s.content?.split(' ').length || 0) + (s.heading?.split(' ').length || 0), 0) || 0;
  return Math.ceil(words / 200);
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// Scroll progress bar
const ScrollProgressBar = ({ color }) => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${color} z-[100] origin-left`}
      style={{ scaleX: scrollYProgress }}
    />
  );
};

// Breadcrumb
const Breadcrumb = ({ type, title }) => (
  <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/60 mb-4">
    <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
      <FiHome className="h-3 w-3" /> Home
    </Link>
    <FiChevronRight className="h-3 w-3" />
    <Link to="/policies" className="hover:text-white transition-colors">Policies</Link>
    <FiChevronRight className="h-3 w-3" />
    <span className="text-white font-medium">{title}</span>
  </nav>
);

// Key Points strip
const KeyPointsStrip = ({ points, color }) => (
  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 mb-6">
    <div className="flex items-center gap-2 mb-3">
      <FiZap className="h-4 w-4 text-primary-500" />
      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Quick Summary</span>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {points.map((pt, i) => (
        <div key={i} className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800 rounded-xl px-3 py-2">
          <FiCheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">{pt}</span>
        </div>
      ))}
    </div>
  </div>
);

// Section search highlight
const highlightText = (text, query) => {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 text-neutral-900 dark:text-yellow-100 rounded px-0.5">{part}</mark>
      : part
  );
};

// Info/warning/tip boxes detected by keywords in heading
const getSectionVariant = (heading) => {
  const h = heading.toLowerCase();
  if (h.includes('warning') || h.includes('important') || h.includes('prohibited') || h.includes('restriction'))
    return 'warning';
  if (h.includes('tip') || h.includes('note') || h.includes('reminder'))
    return 'tip';
  if (h.includes('contact') || h.includes('support') || h.includes('help'))
    return 'info';
  return 'default';
};

const variantStyles = {
  warning: { border: 'border-l-4 border-l-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10', icon: FiAlertTriangle, iconColor: 'text-amber-500' },
  tip:     { border: 'border-l-4 border-l-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10', icon: FiInfo, iconColor: 'text-blue-500' },
  info:    { border: 'border-l-4 border-l-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/10', icon: FiInfo, iconColor: 'text-teal-500' },
  default: { border: '', bg: '', icon: null, iconColor: '' },
};

// FAQ accordion
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-neutral-900 dark:text-white pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <FiChevronDown className="h-4 w-4 text-neutral-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-4 pt-1 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Floating Action Bar
const FloatingActionBar = ({ visible, onPrint, onDownload, onShare, onCopyLink, color }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 hidden lg:flex flex-col gap-2"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-2 flex flex-col gap-1.5">
          {[
            { icon: FiPrinter, label: 'Print', action: onPrint },
            { icon: FiDownload, label: 'Download PDF', action: onDownload },
            { icon: FiShare2, label: 'Share', action: onShare },
            { icon: FiCopy, label: 'Copy Link', action: onCopyLink },
          ].map(({ icon: Icon, label, action }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={action}
              title={label}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gradient-to-r hover:${color} hover:text-white text-neutral-600 dark:text-neutral-400 transition-all text-xs font-medium`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Feedback widget
const FeedbackWidget = () => {
  const [voted, setVoted] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (v) => {
    setVoted(v);
    if (v === 'up') { toast.success('Thanks for the positive feedback!'); setSubmitted(true); }
  };

  const handleSubmit = () => {
    if (feedback.trim()) { toast.success('Feedback submitted. Thank you!'); setSubmitted(true); }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800">
      <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
        <FiHeart className="h-4 w-4 text-red-500" />
        Was this helpful?
      </h3>
      {submitted ? (
        <div className="flex items-center gap-2 text-emerald-600 text-sm">
          <FiCheckCircle className="h-4 w-4" />
          <span>Thanks for your feedback!</span>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => handleVote('up')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-sm font-medium transition-all ${voted === 'up' ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-900/20' : 'border-neutral-200 dark:border-neutral-700 hover:border-emerald-400 hover:text-emerald-600'}`}
            >
              <FiThumbsUp className="h-3.5 w-3.5" /> Yes
            </button>
            <button
              onClick={() => handleVote('down')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-sm font-medium transition-all ${voted === 'down' ? 'bg-red-50 border-red-400 text-red-700 dark:bg-red-900/20' : 'border-neutral-200 dark:border-neutral-700 hover:border-red-400 hover:text-red-600'}`}
            >
              <FiThumbsDown className="h-3.5 w-3.5" /> No
            </button>
          </div>
          {voted === 'down' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Tell us what was confusing..."
                className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                rows={3}
              />
              <button onClick={handleSubmit} className="mt-2 w-full py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors">
                Submit Feedback
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Policies = () => {
  const { type } = useParams();
  const [showPrintModal, setShowPrintModal]   = useState(false);
  const [showShareModal, setShowShareModal]   = useState(false);
  const [activeSection, setActiveSection]     = useState(0);
  const [searchQuery, setSearchQuery]         = useState('');
  const [collapsedSections, setCollapsedSections] = useState({});
  const [showFAB, setShowFAB]                 = useState(false);
  const [copiedLink, setCopiedLink]           = useState(false);
  const [mobileTOCOpen, setMobileTOCOpen]     = useState(false);
  const sectionRefs = useRef([]);
  const searchRef   = useRef(null);
  const heroRef     = useRef(null);

  const policy     = policies[type];
  const Icon       = policyIcons[type]  || FiShield;
  const colorGradient = policyColors[type] || 'from-violet-600 to-purple-700';
  const bannerImage   = policyBanners[type] || policyBanners.privacy;
  const readTime      = useMemo(() => estimateReadTime(policy?.sections), [policy]);
  const points        = keyPoints[type] || keyPoints.privacy;
  const faqs          = faqData[type]   || faqData.privacy;

  // Scroll spy
  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;
      setShowFAB(scrollY > 300);

      if (!policy?.sections) return;
      for (let i = policy.sections.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[i];
        if (el && el.getBoundingClientRect().top < 140) {
          setActiveSection(i);
          break;
        }
      }
    };
    let raf;
    const throttled = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(handler); };
    window.addEventListener('scroll', throttled, { passive: true });
    return () => { window.removeEventListener('scroll', throttled); cancelAnimationFrame(raf); };
  }, [policy]);

  const scrollToSection = useCallback((idx) => {
    const el = sectionRefs.current[idx];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveSection(idx);
      setMobileTOCOpen(false);
    }
  }, []);

  const toggleSection = useCallback((idx) => {
    setCollapsedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success('Link copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch { toast.error('Failed to copy'); }
  }, []);

  const handlePrint  = () => { window.print(); toast.success('Print dialog opened'); setShowPrintModal(false); };
  const handleDownload = () => { toast.success('Policy PDF downloading...'); setShowPrintModal(false); };

  const handleShare = async (platform) => {
    const url   = window.location.href;
    const title = policy?.title || 'Policy';
    if (platform === 'copy')      { handleCopyLink(); }
    else if (platform === 'email')     { window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`; }
    else if (platform === 'whatsapp')  { window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank'); }
    else if (platform === 'twitter')   { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank'); }
    else if (platform === 'facebook')  { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'); }
    else if (platform === 'linkedin')  { window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank'); }
    setShowShareModal(false);
  };

  // Search filter
  const filteredSections = useMemo(() => {
    if (!policy?.sections || !searchQuery.trim()) return policy?.sections?.map((s, i) => ({ ...s, idx: i })) || [];
    return policy.sections
      .map((s, i) => ({ ...s, idx: i }))
      .filter(s =>
        s.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [policy, searchQuery]);

  // Not found
  if (!policy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center px-6 max-w-md">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <FiFileText className="h-12 w-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">Policy Not Found</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">The policy page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
            <FiArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <ScrollProgressBar color={colorGradient} />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: 380 }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/65 z-10" />
          <img src={bannerImage} alt={policy.title} className="w-full h-full object-cover" style={{ minHeight: 380 }} loading="eager" />
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 z-20 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative z-30 px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex items-center" style={{ minHeight: 380 }}>
          <div className="max-w-7xl mx-auto w-full">
            <Breadcrumb type={type} title={policy.title} />

            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
              <div className="flex items-start gap-5">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                  className="w-16 h-16 lg:w-20 lg:h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0"
                >
                  <Icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  {/* Category badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-3">
                    <FiFileText className="h-3 w-3" />
                    {type?.charAt(0).toUpperCase() + type?.slice(1)} Policy
                  </div>

                  <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3 leading-tight">{policy.title}</h1>
                  <p className="text-white/70 text-sm max-w-xl mb-4">{policyDescriptions[type]}</p>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-white/75 text-xs">
                      <FiClock className="h-3.5 w-3.5" /> {readTime} min read
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="flex items-center gap-1.5 text-white/75 text-xs">
                      <FiClock className="h-3.5 w-3.5" /> Updated {policy.lastUpdated}
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="flex items-center gap-1.5 text-white/75 text-xs">
                      <FiCheckCircle className="h-3.5 w-3.5 text-emerald-400" /> GDPR Compliant
                    </span>
                    <span className="flex items-center gap-1.5 text-white/75 text-xs">
                      <FiUsers className="h-3.5 w-3.5 text-blue-400" /> Trusted by 50k+
                    </span>
                  </div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex gap-2 flex-shrink-0">
                <button onClick={() => setShowPrintModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-xl text-white text-sm font-medium hover:bg-white/25 transition-all">
                  <FiPrinter className="h-4 w-4" /> Print
                </button>
                <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-xl text-white text-sm font-medium hover:bg-white/25 transition-all">
                  <FiShare2 className="h-4 w-4" /> Share
                </button>
                <button onClick={handleCopyLink} className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-xl text-white text-sm font-medium hover:bg-white/25 transition-all">
                  {copiedLink ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                  {copiedLink ? 'Copied' : 'Copy'}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="w-full px-3 sm:px-4 lg:px-8 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">

          {/* Key points strip */}
          <KeyPointsStrip points={points} color={colorGradient} />

          {/* Mobile TOC toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileTOCOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-sm font-semibold text-neutral-900 dark:text-white"
            >
              <span className="flex items-center gap-2"><FiBookOpen className="h-4 w-4 text-primary-500" /> Table of Contents</span>
              <motion.div animate={{ rotate: mobileTOCOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <FiChevronDown className="h-4 w-4 text-neutral-500" />
              </motion.div>
            </button>
            <AnimatePresence>
              {mobileTOCOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-white dark:bg-neutral-900 rounded-xl border border-t-0 border-neutral-200 dark:border-neutral-800 px-4 pb-3">
                  {policy.sections.map((s, i) => (
                    <button key={i} onClick={() => scrollToSection(i)} className={`w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${activeSection === i ? 'text-primary-600 font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}>
                      <span className="text-[10px] font-bold text-primary-500">{String(i + 1).padStart(2, '0')}</span>
                      <span className="truncate">{s.heading}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">

            {/* ── Left Sidebar: TOC ──────────────────────────────────────── */}
            <motion.aside initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block lg:col-span-3">
              <div className="sticky top-6 space-y-4">
                {/* TOC */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                  <div className={`bg-gradient-to-r ${colorGradient} p-4`}>
                    <div className="flex items-center gap-2 text-white">
                      <FiBookOpen className="h-4 w-4" />
                      <h3 className="font-bold text-sm">Table of Contents</h3>
                    </div>
                    {/* Reading progress */}
                    <div className="mt-2 text-white/70 text-xs flex items-center gap-1.5">
                      <FiEye className="h-3 w-3" />
                      Section {activeSection + 1} of {policy.sections.length}
                    </div>
                    <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white/80 rounded-full"
                        animate={{ width: `${((activeSection + 1) / policy.sections.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  <div className="p-3 max-h-[420px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    {policy.sections.map((section, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => scrollToSection(idx)}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.15 }}
                        className={`w-full text-left flex items-start gap-2.5 px-2 py-2 rounded-lg transition-all mb-0.5 focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                          activeSection === idx
                            ? 'bg-primary-50 dark:bg-primary-900/20'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                        aria-current={activeSection === idx ? 'true' : undefined}
                      >
                        <span className={`text-[10px] font-bold mt-0.5 flex-shrink-0 transition-colors ${activeSection === idx ? 'text-primary-600' : 'text-neutral-400'}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-xs leading-snug transition-colors ${activeSection === idx ? 'text-primary-700 dark:text-primary-400 font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}>
                          {section.heading}
                        </span>
                        {activeSection === idx && (
                          <motion.div layoutId="toc-indicator" className="ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500 mt-1" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Help card */}
                <div className={`bg-gradient-to-br ${colorGradient} rounded-2xl p-5 shadow-xl`}>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <FiHelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Need Help?</h3>
                  <p className="text-white/80 text-xs mb-4 leading-relaxed">Questions about our policies? Our support team is here 24/7.</p>
                  <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl transition-all">
                    <FiMessageCircle className="h-4 w-4" /> Contact Support
                  </Link>
                </div>

                {/* Quick facts */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800">
                  <h3 className="font-bold text-xs text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                    <FiTrendingUp className="h-3.5 w-3.5 text-primary-500" /> Quick Facts
                  </h3>
                  {[
                    ['Last Updated', policy.lastUpdated],
                    ['Sections', policy.sections.length],
                    ['Read Time', `~${readTime} min`],
                    ['Compliance', 'GDPR ✓'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-1.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                      <span className="text-xs text-neutral-500">{k}</span>
                      <span className="text-xs font-semibold text-neutral-900 dark:text-white">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>

            {/* ── Center: Policy Content ────────────────────────────────── */}
            <div className="lg:col-span-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search within this policy..."
                  className="w-full pl-10 pr-10 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all shadow-sm"
                  aria-label="Search policy content"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Search results count */}
              {searchQuery && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-neutral-500 px-1">
                  {filteredSections.length} section{filteredSections.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </motion.p>
              )}

              {/* Sections */}
              <AnimatePresence mode="popLayout">
                {filteredSections.length === 0 && searchQuery ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-neutral-500 text-sm">
                    No sections match your search.
                  </motion.div>
                ) : (
                  filteredSections.map((section, i) => {
                    const variant  = getSectionVariant(section.heading);
                    const vstyle   = variantStyles[variant];
                    const SideIcon = vstyle.icon;
                    const isCollapsed = collapsedSections[section.idx];

                    return (
                      <motion.section
                        key={section.idx}
                        ref={el => sectionRefs.current[section.idx] = el}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: Math.min(i * 0.05, 0.3) }}
                        className={`bg-white dark:bg-neutral-900 rounded-2xl border transition-all duration-200 overflow-hidden ${
                          activeSection === section.idx && !searchQuery
                            ? 'border-primary-400 shadow-xl ring-2 ring-primary-400/20'
                            : 'border-neutral-200 dark:border-neutral-800 hover:shadow-md'
                        } ${vstyle.border} ${vstyle.bg}`}
                      >
                        {/* Section header */}
                        <div className="flex items-start gap-3 p-5 pb-4">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorGradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            {SideIcon ? <SideIcon className="h-4 w-4 text-white" /> : <span className="text-white font-bold text-xs">{String(section.idx + 1).padStart(2, '0')}</span>}
                          </div>

                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => toggleSection(section.idx)}
                              className="w-full text-left flex items-center justify-between gap-2 group focus:outline-none"
                              aria-expanded={!isCollapsed}
                            >
                              <h2 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                {highlightText(section.heading, searchQuery)}
                              </h2>
                              <motion.div
                                animate={{ rotate: isCollapsed ? 0 : 180 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0 text-neutral-400 group-hover:text-primary-500"
                              >
                                <FiChevronDown className="h-4 w-4" />
                              </motion.div>
                            </button>
                          </div>
                        </div>

                        {/* Section body */}
                        <AnimatePresence initial={false}>
                          {!isCollapsed && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                            >
                              <div className="px-5 pb-5 pl-[3.25rem]">
                                <div className="prose prose-sm max-w-none text-neutral-600 dark:text-neutral-400 space-y-3">
                                  {section.content.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className="text-sm leading-7">
                                      {highlightText(paragraph, searchQuery)}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.section>
                    );
                  })
                )}
              </AnimatePresence>

              {/* Key Summary */}
              {!searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`bg-gradient-to-br ${colorGradient} rounded-2xl p-6 shadow-xl overflow-hidden relative`}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                        <FiCheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Key Takeaways</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {points.map((pt, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5">
                          <FiCheck className="h-4 w-4 text-emerald-300 flex-shrink-0" />
                          <span className="text-sm text-white/90">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* FAQ */}
              {!searchQuery && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <FiHelpCircle className="h-5 w-5 text-primary-500" />
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
                  </div>
                  <div className="space-y-2">
                    {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Right Sidebar ─────────────────────────────────────────── */}
            <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block lg:col-span-3 space-y-4">
              {/* Feedback */}
              <FeedbackWidget />

              {/* Contact */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiHeadphones className="h-4 w-4 text-primary-500" /> Need Clarification?
                </h3>
                <p className="text-xs text-neutral-500 mb-3">Our legal team is available 24/7 to answer your questions.</p>
                <div className="space-y-1">
                  <a href="tel:+15559876543" className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all group">
                    <FiPhone className="h-3.5 w-3.5 text-primary-500" />
                    <span className="text-xs text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors">+1 (555) 987-6543</span>
                  </a>
                  <a href="mailto:legal@furniqo.com" className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all group">
                    <FiMail className="h-3.5 w-3.5 text-primary-500" />
                    <span className="text-xs text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors">legal@furniqo.com</span>
                  </a>
                </div>
              </div>

              {/* Related resources */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiGlobe className="h-4 w-4 text-primary-500" /> Related Resources
                </h3>
                <div className="space-y-1">
                  {[
                    { to: '/faq', icon: FiHelpCircle, label: 'FAQ' },
                    { to: '/contact', icon: FiMessageCircle, label: 'Contact Support' },
                    { href: '#', icon: FiAward, label: 'Compliance Certificate' },
                  ].map(({ to, href, icon: I, label }) =>
                    to ? (
                      <Link key={label} to={to} className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-xs text-neutral-600 dark:text-neutral-400 hover:text-primary-600">
                        <I className="h-3.5 w-3.5" /> {label}
                      </Link>
                    ) : (
                      <a key={label} href={href} className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-xs text-neutral-600 dark:text-neutral-400 hover:text-primary-600">
                        <I className="h-3.5 w-3.5" /> {label}
                      </a>
                    )
                  )}
                </div>
              </div>

              {/* Other policies compact */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiBookOpen className="h-4 w-4 text-primary-500" /> Other Policies
                </h3>
                <div className="space-y-1">
                  {Object.entries(policies).filter(([k]) => k !== type).map(([key, p]) => {
                    const OI = policyIcons[key];
                    return (
                      <Link key={key} to={`/policies/${key}`} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all group">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${policyColors[key]} flex items-center justify-center flex-shrink-0`}>
                          <OI className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-xs text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 font-medium transition-colors">{p.title}</span>
                        <FiChevronRight className="h-3 w-3 text-neutral-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>

      {/* ── Other Policies Grid ──────────────────────────────────────────────── */}
      <div className="w-full px-3 sm:px-4 lg:px-8 py-12 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium mb-3">
              <FiBookOpen className="h-3 w-3" /> Explore More
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Other Policy Documents</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Review all legal documents governing your experience with us</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(policies).map(([key, p], idx) => {
              const OI = policyIcons[key];
              const isActive = type === key;
              return (
                <Link key={key} to={`/policies/${key}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.97 }}
                    className={`group relative p-5 rounded-2xl transition-all cursor-pointer overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-br ${policyColors[key]} text-white shadow-xl`
                        : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-lg'
                    }`}
                  >
                    {!isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${policyColors[key]} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`} />
                    )}
                    <div className="relative z-10">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${isActive ? 'bg-white/20' : `bg-gradient-to-br ${policyColors[key]}`}`}>
                        <OI className="h-5 w-5 text-white" />
                      </div>
                      <h3 className={`font-bold text-sm mb-1 ${isActive ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>{p.title}</h3>
                      <p className={`text-xs mb-2 ${isActive ? 'text-white/70' : 'text-neutral-500'}`}>{policyDescriptions[key]}</p>
                      <span className={`text-xs font-medium inline-flex items-center gap-1 ${isActive ? 'text-white/80' : 'text-primary-600 dark:text-primary-400'}`}>
                        Read more <FiChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                    {isActive && (
                      <div className="absolute top-3 right-3 bg-white/20 rounded-lg px-2 py-0.5 text-white text-[10px] font-semibold">Current</div>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Newsletter />

      {/* ── Floating Action Bar ──────────────────────────────────────────────── */}
      <FloatingActionBar
        visible={showFAB}
        onPrint={() => setShowPrintModal(true)}
        onDownload={handleDownload}
        onShare={() => setShowShareModal(true)}
        onCopyLink={handleCopyLink}
        color={colorGradient}
      />

      {/* ── Print Modal ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPrintModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowPrintModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r ${colorGradient} p-6 text-white`}>
                <button onClick={() => setShowPrintModal(false)} className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-xl transition-colors">
                  <FiX className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiPrinter className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Print or Download</h3>
                    <p className="text-white/75 text-xs">~{readTime} min read · {policy.sections.length} sections</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-2">
                {[
                  { icon: FiPrinter, label: 'Print Policy', sub: 'Open browser print dialog', action: handlePrint },
                  { icon: FiDownload, label: 'Download as PDF', sub: 'Save to your device', action: handleDownload },
                ].map(({ icon: I, label, sub, action }) => (
                  <button key={label} onClick={action} className="w-full flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <I className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm text-neutral-900 dark:text-white">{label}</div>
                      <div className="text-xs text-neutral-500">{sub}</div>
                    </div>
                  </button>
                ))}
                <button onClick={() => setShowPrintModal(false)} className="w-full mt-2 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Share Modal ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r ${colorGradient} p-6 text-white`}>
                <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-xl transition-colors">
                  <FiX className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                    <FiShare2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Share This Policy</h3>
                    <p className="text-white/75 text-xs">{policy.title}</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { platform: 'copy', icon: FiCopy, label: 'Copy Link', bg: 'bg-neutral-100 dark:bg-neutral-800', iconColor: 'text-neutral-700 dark:text-neutral-300' },
                    { platform: 'email', icon: FiMail, label: 'Email', bg: 'bg-red-50 dark:bg-red-900/20', iconColor: 'text-red-600' },
                    { platform: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp', bg: 'bg-green-50 dark:bg-green-900/20', iconColor: 'text-green-600' },
                    { platform: 'twitter', icon: FaTwitter, label: 'Twitter', bg: 'bg-sky-50 dark:bg-sky-900/20', iconColor: 'text-sky-500' },
                    { platform: 'facebook', icon: FaFacebook, label: 'Facebook', bg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-600' },
                    { platform: 'linkedin', icon: FaLinkedin, label: 'LinkedIn', bg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-700' },
                  ].map(({ platform, icon: I, label, bg, iconColor }) => (
                    <button key={platform} onClick={() => handleShare(platform)}
                      className={`${bg} rounded-xl p-3 flex flex-col items-center gap-2 hover:opacity-80 transition-all group`}>
                      <div className="w-9 h-9 bg-white dark:bg-neutral-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <I className={`h-4 w-4 ${iconColor}`} />
                      </div>
                      <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Copy URL input */}
                <div className="flex gap-2 mb-3">
                  <input readOnly value={window.location.href}
                    className="flex-1 px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 truncate" />
                  <button onClick={() => handleShare('copy')} className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5">
                    {copiedLink ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <button onClick={() => setShowShareModal(false)} className="w-full py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Print styles */}
      <style>{`
        @media print {
          .sticky, [class*="fixed"], nav, footer, button, aside { display: none !important; }
          .prose { max-width: 100% !important; }
          section { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

export default Policies;