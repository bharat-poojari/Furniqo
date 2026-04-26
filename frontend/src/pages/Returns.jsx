import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPackage, 
  FiTruck, 
  FiCheck, 
  FiX,
  FiArrowRight,
  FiSearch,
  FiUser,
  FiMail,
  FiFileText,
  FiSend,
  FiClock,
  FiShield,
  FiRefreshCw,
  FiDollarSign,
  FiHelpCircle,
  FiCalendar,
  FiBox,
  FiChevronDown,
  FiChevronRight,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import Newsletter from '../components/layout/Newsletter';

// Track Return Modal
const TrackReturnModal = ({ isOpen, onClose }) => {
  const [returnId, setReturnId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!returnId || !email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setResult({
      id: returnId,
      status: 'In Transit',
      date: 'Dec 20, 2024',
      item: 'Modern Sofa - Gray',
      refund: '$1,299.00',
      eta: 'Dec 28, 2024'
    });
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
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold dark:text-white">Track Return</h3>
                <p className="text-xs text-neutral-500">Check your return status</p>
              </div>
              <button type="button" onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {result ? (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800/30 flex items-center justify-center">
                    <FiCheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300">{result.status}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">ETA: {result.eta}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-500">Return ID</span><span className="font-medium dark:text-white">{result.id}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Item</span><span className="font-medium dark:text-white">{result.item}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Date</span><span className="font-medium dark:text-white">{result.date}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Refund</span><span className="font-bold text-primary-600">{result.refund}</span></div>
                </div>

                <button type="button" onClick={() => { setResult(null); setReturnId(''); setEmail(''); }} className="w-full px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                  Track Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Return ID *</label>
                  <div className="relative">
                    <FiBox className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input type="text" value={returnId} onChange={(e) => setReturnId(e.target.value)} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="RET-123456" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email *</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
                  <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2">
                    {loading ? (
                      <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </motion.svg>
                    ) : <FiSearch className="h-4 w-4" />}
                    {loading ? 'Searching...' : 'Track Return'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Start Return Modal
const StartReturnModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    orderId: '',
    email: '',
    reason: '',
    condition: '',
    preferredAction: '',
    comments: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.orderId || !formData.email || !formData.reason) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setStep(1);
      setFormData({ orderId: '', email: '', reason: '', condition: '', preferredAction: '', comments: '' });
    }, 3000);
  };

  const returnReasons = [
    'Damaged on arrival',
    'Wrong item shipped',
    'Not as described',
    'Changed mind',
    'Quality issue',
    'Size/fit issue',
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
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            {submitted ? (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <h3 className="text-lg font-bold dark:text-white mb-2">Return Initiated!</h3>
                <p className="text-sm text-neutral-500 mb-2">Return ID: <span className="font-mono font-bold text-primary-600">RET-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span></p>
                <p className="text-xs text-neutral-400">Check your email for return instructions.</p>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">Start a Return</h3>
                    <p className="text-xs text-neutral-500">Step {step} of 2</p>
                  </div>
                  <button type="button" onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress */}
                <div className="flex gap-1.5 px-5 pt-4">
                  <div className={`h-1 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                  <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                </div>

                <form onSubmit={handleSubmit} className="p-5">
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Order ID *</label>
                        <div className="relative">
                          <FiBox className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input name="orderId" value={formData.orderId} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="ORD-123456" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email *</label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="your@email.com" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
                        <button type="button" onClick={() => setStep(2)} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">Continue <FiArrowRight className="inline ml-1.5 h-4 w-4" /></button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Reason for Return *</label>
                        <select name="reason" value={formData.reason} onChange={handleChange} required className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer">
                          <option value="">Select reason</option>
                          {returnReasons.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Item Condition</label>
                        <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer">
                          <option value="">Select condition</option>
                          <option value="unopened">Unopened/Sealed</option>
                          <option value="like-new">Like New</option>
                          <option value="used">Lightly Used</option>
                          <option value="damaged">Damaged</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Preferred Action</label>
                        <select name="preferredAction" value={formData.preferredAction} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer">
                          <option value="">Select action</option>
                          <option value="refund">Full Refund</option>
                          <option value="exchange">Exchange</option>
                          <option value="store-credit">Store Credit</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Comments</label>
                        <textarea name="comments" value={formData.comments} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white resize-none" placeholder="Additional details..." />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Back</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2">
                          {loading ? (
                            <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </motion.svg>
                          ) : <FiSend className="h-4 w-4" />}
                          {loading ? 'Submitting...' : 'Submit Return'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Returns = () => {
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showStartReturnModal, setShowStartReturnModal] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const policyHighlights = [
    { icon: FiCalendar, title: '30-Day Window', desc: 'Return within 30 days of delivery', color: 'from-blue-500 to-cyan-500' },
    { icon: FiRefreshCw, title: 'Free Returns', desc: 'Free return shipping on all orders', color: 'from-emerald-500 to-teal-500' },
    { icon: FiDollarSign, title: 'Full Refund', desc: '100% money-back guarantee', color: 'from-purple-500 to-indigo-500' },
    { icon: FiShield, title: 'Quality Promise', desc: 'Defective items replaced free', color: 'from-amber-500 to-orange-500' },
  ];

  const howItWorks = [
    { step: '01', title: 'Initiate Return', desc: 'Fill out the return form with your order details and reason for return.' },
    { step: '02', title: 'Get Label', desc: 'Receive a prepaid shipping label via email within 24 hours.' },
    { step: '03', title: 'Ship Item', desc: 'Pack the item in original packaging and drop off at a carrier location.' },
    { step: '04', title: 'Get Refund', desc: 'Refund processed within 5-7 business days after we receive the item.' },
  ];

  const returnFaqs = [
    { q: 'How long do I have to return an item?', a: 'You have 30 days from the date of delivery to initiate a return. Items must be in original condition with all packaging and tags.' },
    { q: 'Are there any return fees?', a: 'No! We offer free return shipping on all orders. There are no restocking fees for standard returns.' },
    { q: 'How long does a refund take?', a: 'Once we receive and inspect the returned item, refunds are processed within 5-7 business days to your original payment method.' },
    { q: 'Can I exchange an item?', a: 'Yes! During the return process, you can select "Exchange" as your preferred action and choose a different size, color, or item.' },
    { q: 'What if my item arrives damaged?', a: 'If your item arrives damaged, please initiate a return within 48 hours and select "Damaged on arrival" as the reason. We will send a replacement immediately.' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-[1%] py-[1%]">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 mb-3">
            <FiRefreshCw className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </motion.div>
          <h1 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mb-1 tracking-tight">Returns & Exchanges</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">Easy returns within 30 days. Free return shipping on all orders.</p>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="max-w-lg mx-auto mb-6">
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowStartReturnModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
            >
              <FiPackage className="h-4 w-4" />
              Start a Return
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTrackModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all border border-neutral-200 dark:border-neutral-700 shadow-sm"
            >
              <FiSearch className="h-4 w-4" />
              Track Return
            </motion.button>
          </div>
        </motion.div>

        {/* Policy Highlights */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {policyHighlights.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05 }} whileHover={{ y: -2 }} className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform`}>
                <item.icon className="h-4.5 w-4.5 text-white" />
              </div>
              <h3 className="text-sm font-bold dark:text-white mb-0.5">{item.title}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
          
          {/* How It Works */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold dark:text-white flex items-center gap-2">
                <FiTruck className="h-4 w-4 text-primary-500" />
                How Returns Work
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-0">
                {howItWorks.map((step, i) => (
                  <div key={step.step} className="flex gap-3 relative">
                    {/* Timeline Line */}
                    {i < howItWorks.length - 1 && (
                      <div className="absolute left-[18px] top-10 bottom-0 w-px bg-neutral-200 dark:bg-neutral-700" />
                    )}
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400 z-10">
                      {step.step}
                    </div>
                    <div className="pb-5">
                      <h3 className="text-sm font-semibold dark:text-white">{step.title}</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold dark:text-white flex items-center gap-2">
                <FiHelpCircle className="h-4 w-4 text-primary-500" />
                Return FAQs
              </h2>
            </div>
            <div className="divide-y divide-neutral-50 dark:divide-neutral-800">
              {returnFaqs.map((faq, i) => (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 pr-3">{faq.q}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <FiChevronDown className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                        <p className="px-3 pb-3 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 text-center">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-5 text-white">
            <FiHelpCircle className="h-6 w-6 mx-auto mb-2 opacity-60" />
            <h3 className="text-sm font-bold mb-1">Need Help With Your Return?</h3>
            <p className="text-xs text-white/60 mb-3">Our support team is available 7 days a week</p>
            <a href="/contact" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold hover:bg-white/30 transition-all">
              Contact Support <FiArrowRight className="h-3 w-3" />
            </a>
          </div>
        </motion.div>
      </div>

      <Newsletter />

      {/* Modals */}
      <TrackReturnModal isOpen={showTrackModal} onClose={() => setShowTrackModal(false)} />
      <StartReturnModal isOpen={showStartReturnModal} onClose={() => setShowStartReturnModal(false)} />
    </div>
  );
};

export default Returns;