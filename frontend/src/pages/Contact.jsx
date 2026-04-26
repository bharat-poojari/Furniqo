import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiClock, 
  FiSend,
  FiMessageSquare,
  FiUser,
  FiCheck,
  FiHeadphones,
  FiShield,
  FiTruck,
  FiStar,
  FiChevronDown
} from 'react-icons/fi';
import Newsletter from '../components/layout/Newsletter';

const SuccessModal = ({ isOpen, onClose, referenceId }) => {
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
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-neutral-100 dark:border-neutral-800"
          >
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <FiCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <h3 className="text-lg font-bold dark:text-white mb-1">Message Sent!</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">We'll respond within 24 hours.</p>
              <p className="text-xs text-neutral-400 font-mono">#{referenceId}</p>
              <button onClick={onClose} className="mt-5 w-full px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">Done</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const contactCards = [
    { icon: FiPhone, title: 'Phone', details: ['+1 (555) 987-6543'], action: 'tel:+15559876543', color: 'from-blue-500 to-cyan-500' },
    { icon: FiMail, title: 'Email', details: ['support@furniqo.com'], action: 'mailto:support@furniqo.com', color: 'from-emerald-500 to-teal-500' },
    { icon: FiMapPin, title: 'Showroom', details: ['123 Design District, NY'], action: 'https://maps.google.com', color: 'from-purple-500 to-indigo-500' },
    { icon: FiClock, title: 'Hours', details: ['Mon-Fri 9AM-8PM', 'Sat-Sun 10AM-6PM'], color: 'from-amber-500 to-orange-500' },
  ];

  const quickActions = [
    { icon: FiTruck, label: 'Track Order', href: '/orders' },
    { icon: FiShield, label: 'Warranty', href: '/warranty' },
    { icon: FiStar, label: 'Returns', href: '/returns' },
  ];

  const faqs = [
    { q: 'What is your return policy?', a: 'We offer a 30-day return policy on all furniture. Items must be in original condition.' },
    { q: 'How long does delivery take?', a: 'Standard delivery: 5-7 business days. Express: 2-3 business days.' },
    { q: 'Do you offer assembly services?', a: 'Yes! Professional assembly is available and can be added during checkout.' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.length < 2) newErrors.name = 'Required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.subject.trim()) newErrors.subject = 'Select a topic';
    if (!formData.message.trim() || formData.message.length < 10) newErrors.message = 'Min 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setReferenceId('MSG-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    setShowSuccessModal(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const inputClass = (field) => `w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${errors[field] ? 'border-red-400 dark:border-red-500 bg-red-50/30 dark:bg-red-900/10' : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600'} focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 transition-all duration-200`;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-[1%] py-[1%]">
        
        {/* Header + Quick Actions - Full Width */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <FiHeadphones className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Contact Us</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">We're here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {quickActions.map((action, i) => (
              <motion.a key={i} href={action.href} whileHover={{ y: -1 }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 dark:hover:border-primary-700 shadow-sm transition-all">
                <action.icon className="h-3 w-3" /> {action.label}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Full Width Grid - No max-width constraints */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-3">
          
          {/* Left Panel */}
          <div className="space-y-3">
            {/* Contact Cards - Full Width Grid */}
            <div className="grid grid-cols-2 gap-2">
              {contactCards.map((card, i) => (
                <motion.a
                  key={i}
                  href={card.action || '#'}
                  target={card.action?.startsWith('http') ? '_blank' : undefined}
                  rel={card.action?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }}
                  className={`group relative bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${!card.action ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                    <card.icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white mb-0.5">{card.title}</p>
                  {card.details.map((d, j) => (
                    <p key={j} className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{d}</p>
                  ))}
                </motion.a>
              ))}
            </div>

            {/* FAQ - Full Width */}
            <motion.div 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden"
            >
              <div className="p-3 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Quick Answers</h3>
              </div>
              <div>
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-neutral-50 dark:border-neutral-800 last:border-0">
                    <button
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 pr-3">{faq.q}</span>
                      <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <FiChevronDown className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
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
          </div>

          {/* Right Panel - Contact Form Full Width */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <FiMessageSquare className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Send a Message</h2>
                <p className="text-[10px] text-neutral-500">Response within 24 hours</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input name="name" value={formData.name} onChange={handleChange} className={inputClass('name')} placeholder="John Doe" />
                  </div>
                  {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">Email *</label>
                  <div className="relative">
                    <FiMail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass('email')} placeholder="john@email.com" />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">Phone</label>
                  <div className="relative">
                    <FiPhone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputClass('phone')} placeholder="+1 555 000-0000" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">Topic *</label>
                  <div className="relative">
                    <select name="subject" value={formData.subject} onChange={handleChange} className={`${inputClass('subject')} appearance-none cursor-pointer pr-8`}>
                      <option value="">Select topic</option>
                      <option>Product Inquiry</option>
                      <option>Order Support</option>
                      <option>Returns & Refunds</option>
                      <option>Trade Program</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
                  </div>
                  {errors.subject && <p className="text-[10px] text-red-500 mt-0.5">{errors.subject}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className={`${inputClass('message')} resize-none`} placeholder="How can we help you?" />
                <div className="flex justify-between mt-1">
                  {errors.message ? <p className="text-[10px] text-red-500">{errors.message}</p> : <span />}
                  <p className={`text-[10px] ${formData.message.length < 10 ? 'text-red-400' : 'text-emerald-500'}`}>{formData.message.length} chars</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </motion.svg>
                ) : <FiSend className="h-4 w-4" />}
                {loading ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      <Newsletter />
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} referenceId={referenceId} />
    </div>
  );
};

export default Contact;