import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch,
  FiX,
  FiCheck,
  FiMail,
  FiTruck,
  FiPackage,
  FiArrowRight,
  FiSend,
  FiHelpCircle,
  FiChevronRight,
  FiAlertCircle,
  FiPhone,
  FiMessageCircle,
  FiBox
} from 'react-icons/fi';
import Newsletter from '../components/layout/Newsletter';

// Custom SVG Icons
const BoxIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TruckIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h5m0 0l2-4h-5V6m0 0h4l4 4v6" />
  </svg>
);

const MapPinIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Track Order Modal
const TrackOrderModal = ({ isOpen, onClose, initialOrderId = '', initialEmail = '' }) => {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!orderId || !email) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);

    setTrackingResult({
      orderId: orderId,
      status: 'In Transit',
      estimatedDelivery: 'December 28, 2024',
      currentLocation: 'Chicago, IL Distribution Center',
      shippedDate: 'December 20, 2024',
      carrier: 'Furniqo Express',
      trackingNumber: 'FNQ-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      timeline: [
        { status: 'Order Confirmed', date: 'Dec 18, 2024', time: '10:30 AM', completed: true },
        { status: 'Processing', date: 'Dec 19, 2024', time: '2:15 PM', completed: true },
        { status: 'Shipped', date: 'Dec 20, 2024', time: '9:00 AM', completed: true },
        { status: 'In Transit', date: 'Dec 22, 2024', time: '6:45 AM', completed: true, current: true },
        { status: 'Out for Delivery', date: 'Dec 28, 2024', time: 'Expected', completed: false },
        { status: 'Delivered', date: 'Dec 28, 2024', time: 'Expected', completed: false },
      ]
    });
  };

  const handleReset = () => {
    setTrackingResult(null);
    setOrderId('');
    setEmail('');
    setError('');
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
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            {trackingResult ? (
              <>
                <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 p-5 text-white">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors z-10">
                    <FiX className="h-4 w-4" />
                  </button>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-400/30 flex items-center justify-center">
                        <TruckIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Order Found!</p>
                        <p className="text-sm text-white/80">{trackingResult.orderId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2.5 py-1 bg-emerald-400/30 rounded-full text-xs font-medium">{trackingResult.status}</span>
                      <span className="text-white/70">•</span>
                      <span className="text-xs text-white/80">Est. {trackingResult.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Carrier</p>
                      <p className="text-sm font-semibold dark:text-white">{trackingResult.carrier}</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Tracking #</p>
                      <p className="text-sm font-mono font-semibold dark:text-white truncate">{trackingResult.trackingNumber}</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Current Location</p>
                      <p className="text-sm font-semibold dark:text-white">{trackingResult.currentLocation}</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Shipped Date</p>
                      <p className="text-sm font-semibold dark:text-white">{trackingResult.shippedDate}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Tracking Timeline</h4>
                    <div className="space-y-0">
                      {trackingResult.timeline.map((event, i) => (
                        <div key={i} className="flex gap-3 relative">
                          {i < trackingResult.timeline.length - 1 && (
                            <div className={`absolute left-[14px] top-8 bottom-0 w-0.5 ${event.completed ? 'bg-emerald-400' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                          )}
                          <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center z-10 ${event.completed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-neutral-100 dark:bg-neutral-800'} ${event.current ? 'ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-neutral-900' : ''}`}>
                            {event.completed ? (
                              <FiCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                            )}
                          </div>
                          <div className="pb-4">
                            <p className={`text-sm font-semibold ${event.completed ? 'dark:text-white' : 'text-neutral-400 dark:text-neutral-500'}`}>{event.status}</p>
                            <p className="text-xs text-neutral-400">{event.date} • {event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={handleReset} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">
                      Track Another
                    </button>
                    <a href="/contact" className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-center">
                      Need Help?
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">Track Your Order</h3>
                    <p className="text-xs text-neutral-500">Enter your order details to check status</p>
                  </div>
                  <button type="button" onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                      <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Order ID *</label>
                    <div className="relative">
                      <BoxIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input 
                        type="text" 
                        value={orderId} 
                        onChange={(e) => setOrderId(e.target.value)} 
                        placeholder="e.g. ORD-123456" 
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email Address *</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="your@email.com" 
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 transition-all"
                      />
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
                      {loading ? 'Searching...' : 'Track Order'}
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

// Help Modal
const HelpModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', orderId: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setFormData({ name: '', email: '', orderId: '', message: '' });
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
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            {submitted ? (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <h3 className="text-lg font-bold dark:text-white mb-2">Request Sent!</h3>
                <p className="text-sm text-neutral-500">Our support team will respond shortly.</p>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">Need Help?</h3>
                    <p className="text-xs text-neutral-500">We're here to assist with your order</p>
                  </div>
                  <button type="button" onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
                      <input name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email *</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Order ID (if applicable)</label>
                    <input name="orderId" value={formData.orderId} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="ORD-123456" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={3} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white resize-none" placeholder="Describe your issue..." />
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
                      {loading ? 'Sending...' : 'Send Request'}
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

const TrackOrder = () => {
  const [pageOrderId, setPageOrderId] = useState('');
  const [pageEmail, setPageEmail] = useState('');
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [pageTrackingResult, setPageTrackingResult] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  const handlePageTrack = async (e) => {
    e.preventDefault();
    setPageError('');

    if (!pageOrderId || !pageEmail) {
      setPageError('Please fill in all fields');
      return;
    }

    setPageLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setPageLoading(false);

    setPageTrackingResult({
      orderId: pageOrderId,
      status: 'In Transit',
      estimatedDelivery: 'December 28, 2024',
      currentLocation: 'Chicago, IL Distribution Center',
      shippedDate: 'December 20, 2024',
      carrier: 'Furniqo Express',
      trackingNumber: 'FNQ-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      timeline: [
        { status: 'Order Confirmed', date: 'Dec 18, 2024', time: '10:30 AM', completed: true },
        { status: 'Processing', date: 'Dec 19, 2024', time: '2:15 PM', completed: true },
        { status: 'Shipped', date: 'Dec 20, 2024', time: '9:00 AM', completed: true },
        { status: 'In Transit', date: 'Dec 22, 2024', time: '6:45 AM', completed: true, current: true },
        { status: 'Out for Delivery', date: 'Dec 28, 2024', time: 'Expected', completed: false },
        { status: 'Delivered', date: 'Dec 28, 2024', time: 'Expected', completed: false },
      ]
    });
  };

  const handlePageReset = () => {
    setPageTrackingResult(null);
    setPageOrderId('');
    setPageEmail('');
    setPageError('');
  };

  const helpLinks = [
    { icon: FiPhone, title: 'Call Us', desc: '+1 (555) 987-6543', action: 'tel:+15559876543', color: 'from-blue-500 to-cyan-500' },
    { icon: FiMail, title: 'Email Support', desc: 'support@furniqo.com', action: 'mailto:support@furniqo.com', color: 'from-emerald-500 to-teal-500' },
    { icon: FiMessageCircle, title: 'Live Chat', desc: 'Available 9AM-8PM EST', action: '#', color: 'from-purple-500 to-indigo-500' },
  ];

  const trackingFaqs = [
    { q: 'Where can I find my Order ID?', a: 'Your Order ID can be found in the confirmation email sent after purchase, or in your account under Order History. It starts with "ORD-" followed by numbers.' },
    { q: 'How often is tracking updated?', a: 'Tracking information is updated in real-time as your order moves through our fulfillment and delivery network.' },
    { q: 'What if my order is delayed?', a: 'If your order is delayed beyond the estimated delivery date, please contact our support team for an updated timeline.' },
    { q: 'Can I change my delivery address?', a: 'If your order hasn\'t shipped yet, you can update your delivery address from your account. Once shipped, changes may require a fee.' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-[1%] py-[1%]">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 mb-3">
            <TruckIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </motion.div>
          <h1 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mb-1 tracking-tight">Track Your Order</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
            Enter your order details to get real-time updates on your delivery
          </p>
        </motion.div>

        {/* Main Content - Full Width */}
        <div className="space-y-4">
          
          {/* Track Form + Results */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            
            {pageTrackingResult ? (
              /* Tracking Result View */
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 p-5 text-white">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-400/30 flex items-center justify-center">
                        <TruckIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Order Found!</p>
                        <p className="text-sm text-white/80">{pageTrackingResult.orderId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2.5 py-1 bg-emerald-400/30 rounded-full text-xs font-medium">{pageTrackingResult.status}</span>
                      <span className="text-white/70">•</span>
                      <span className="text-xs text-white/80">Est. {pageTrackingResult.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Carrier</p>
                      <p className="text-sm font-semibold dark:text-white">{pageTrackingResult.carrier}</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Tracking #</p>
                      <p className="text-sm font-mono font-semibold dark:text-white truncate">{pageTrackingResult.trackingNumber}</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Location</p>
                      <p className="text-sm font-semibold dark:text-white truncate">{pageTrackingResult.currentLocation}</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Shipped</p>
                      <p className="text-sm font-semibold dark:text-white">{pageTrackingResult.shippedDate}</p>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Tracking Timeline</h4>
                  <div className="space-y-0">
                    {pageTrackingResult.timeline.map((event, i) => (
                      <div key={i} className="flex gap-3 relative">
                        {i < pageTrackingResult.timeline.length - 1 && (
                          <div className={`absolute left-[14px] top-8 bottom-0 w-0.5 ${event.completed ? 'bg-emerald-400' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                        )}
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center z-10 ${event.completed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-neutral-100 dark:bg-neutral-800'} ${event.current ? 'ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-neutral-900' : ''}`}>
                          {event.completed ? (
                            <FiCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className={`text-sm font-semibold ${event.completed ? 'dark:text-white' : 'text-neutral-400 dark:text-neutral-500'}`}>{event.status}</p>
                          <p className="text-xs text-neutral-400">{event.date} • {event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="button" onClick={handlePageReset} className="mt-4 w-full px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">
                    Track Another Order
                  </button>
                </div>
              </div>
            ) : (
              /* Track Form */
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <FiSearch className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold dark:text-white">Check Order Status</h2>
                      <p className="text-xs text-neutral-500">Enter your Order ID and email to track your delivery</p>
                    </div>
                  </div>

                  <form onSubmit={handlePageTrack} className="space-y-4">
                    {pageError && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                        <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
                        {pageError}
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Order ID *</label>
                        <div className="relative">
                          <BoxIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input 
                            type="text" 
                            value={pageOrderId} 
                            onChange={(e) => setPageOrderId(e.target.value)} 
                            placeholder="e.g. ORD-123456" 
                            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email Address *</label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input 
                            type="email" 
                            value={pageEmail} 
                            onChange={(e) => setPageEmail(e.target.value)} 
                            placeholder="your@email.com" 
                            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setShowTrackModal(true)} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">
                        Advanced Search
                      </button>
                      <button type="submit" disabled={pageLoading} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        {pageLoading ? (
                          <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </motion.svg>
                        ) : <FiSearch className="h-4 w-4" />}
                        {pageLoading ? 'Searching...' : 'Track Order'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>

          {/* Bottom Grid: FAQ + Help */}
          <div className="grid lg:grid-cols-2 gap-4">
            
            {/* Tracking FAQ */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-sm font-bold dark:text-white flex items-center gap-2">
                  <FiHelpCircle className="h-4 w-4 text-primary-500" />
                  Tracking FAQs
                </h3>
              </div>
              <div className="divide-y divide-neutral-50 dark:divide-neutral-800">
                {trackingFaqs.map((faq, i) => (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 pr-3">{faq.q}</span>
                      <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <FiChevronRight className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                          <p className="px-3 pb-3 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Help & Contact */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-sm font-bold dark:text-white flex items-center gap-2">
                  <FiPhone className="h-4 w-4 text-primary-500" />
                  Need Help?
                </h3>
              </div>
              <div className="p-3">
                {helpLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.action}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <link.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold dark:text-white">{link.title}</p>
                      <p className="text-[10px] text-neutral-500">{link.desc}</p>
                    </div>
                    <FiChevronRight className="h-3.5 w-3.5 text-neutral-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
                  </a>
                ))}
              </div>
              <div className="p-3 pt-0">
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FiMessageCircle className="h-4 w-4" />
                  Contact Support
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Newsletter />

      {/* Modals */}
      <TrackOrderModal 
        isOpen={showTrackModal} 
        onClose={() => setShowTrackModal(false)} 
        initialOrderId={pageOrderId}
        initialEmail={pageEmail}
      />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default TrackOrder;