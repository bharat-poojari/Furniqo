import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  FiSend, FiEdit3, FiDroplet, FiUpload, FiX, FiCheck, FiClock, 
  FiDollarSign, FiInfo, FiChevronDown, FiSave, FiArrowRight, FiAlertCircle,
  FiUser, FiMail, FiPhone, FiLink, FiFileText, FiBox, FiTruck, FiPenTool,
  FiLayers, FiTrash2, FiChevronLeft, FiChevronRight, FiCheckCircle,
  FiShield, FiAward, FiZap, FiStar
} from 'react-icons/fi';

// Custom Icons
const SearchIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Compact Custom Dropdown
const CustomDropdown = ({ value, onChange, options, placeholder, icon: Icon, name, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={dropdownRef} className="relative">
      <motion.div
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-lg border cursor-pointer transition-all duration-200 ${
          error ? 'border-red-400 dark:border-red-500' 
          : isOpen ? 'border-primary-400 dark:border-primary-500 shadow-sm' 
          : 'border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-500'
        }`}
      >
        <div className="flex items-center px-3 py-2">
          {Icon && <Icon className={`h-3.5 w-3.5 mr-2 transition-colors ${isOpen ? 'text-primary-500' : 'text-neutral-400'}`} />}
          <span className={`flex-1 text-xs truncate ${selectedOption ? 'text-neutral-900 dark:text-white font-medium' : 'text-neutral-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <FiChevronDown className={`h-3.5 w-3.5 ${isOpen ? 'text-primary-500' : 'text-neutral-400'}`} />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-neutral-100 dark:border-neutral-700">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-md border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700/50 pl-7 pr-6 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-white placeholder-neutral-400"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchTerm && (
                  <button onClick={(e) => { e.stopPropagation(); setSearchTerm(''); }} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded">
                    <FiX className="h-3 w-3 text-neutral-400" />
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto custom-scrollbar py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleSelect(option.value)}
                    className={`px-3 py-1.5 cursor-pointer transition-colors flex items-center justify-between text-xs ${
                      option.value === value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.value === value && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}>
                        <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center ml-2">
                          <FiCheck className="h-2.5 w-2.5 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="px-3 py-6 text-center">
                  <p className="text-xs text-neutral-400">No options found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Compact Tilt Card
const TiltCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-3, 3]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  return (
    <motion.div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ rotateX, rotateY }} className={`transform-gpu ${className}`}>
      {children}
    </motion.div>
  );
};

// Compact Animated Counter
const AnimatedCounter = ({ value, duration = 1 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setDisplayValue(Math.floor(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  return <span>{displayValue}</span>;
};

// Toast
const toast = {
  success: (msg) => {
    const el = document.createElement('div');
    el.className = 'fixed top-3 right-3 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-[100] animate-slide-down text-xs font-medium flex items-center gap-2';
    el.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg><span>${msg}</span>`;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 2500);
  },
  error: (msg) => {
    const el = document.createElement('div');
    el.className = 'fixed top-3 right-3 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-[100] animate-slide-down text-xs font-medium flex items-center gap-2';
    el.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>${msg}</span>`;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 2500);
  }
};

// Data
const furnitureTypes = [
  { value: 'sofa', label: 'Sofa / Sectional' },
  { value: 'bed', label: 'Bed Frame' },
  { value: 'table', label: 'Dining Table' },
  { value: 'chair', label: 'Accent Chair' },
  { value: 'cabinet', label: 'Cabinet / Storage' },
  { value: 'shelving', label: 'Shelving Unit' },
  { value: 'desk', label: 'Desk / Workstation' },
  { value: 'custom', label: 'Custom Project' },
];

const materialOptions = [
  { value: 'oak', label: 'Oak' }, { value: 'walnut', label: 'Walnut' },
  { value: 'maple', label: 'Maple' }, { value: 'cherry', label: 'Cherry' },
  { value: 'mahogany', label: 'Mahogany' }, { value: 'teak', label: 'Teak' },
  { value: 'leather', label: 'Leather' }, { value: 'velvet', label: 'Velvet' },
  { value: 'metal', label: 'Metal' }, { value: 'marble', label: 'Marble' },
];

const budgetRanges = [
  { value: '500-1000', label: '$500 - $1,000' }, { value: '1000-3000', label: '$1,000 - $3,000' },
  { value: '3000-5000', label: '$3,000 - $5,000' }, { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000+', label: '$10,000+' },
];

const timelineOptions = [
  { value: 'asap', label: 'ASAP (1-2 wks)' }, { value: '2-4-weeks', label: '2-4 Weeks' },
  { value: '4-6-weeks', label: '4-6 Weeks' }, { value: '6-8-weeks', label: '6-8 Weeks' },
  { value: 'flexible', label: 'Flexible' },
];

const initialFormData = {
  furnitureType: 'sofa', dimensions: '', material: '', color: '',
  budget: '', timeline: '', description: '', name: '', email: '', phone: '',
  images: [], inspirationLinks: '', specialRequirements: '',
};

const CustomFurniture = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const totalSteps = 3;

  useEffect(() => {
    if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentStep]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  }, [errors]);

  const handleDrag = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(f => ['image/jpeg','image/png','image/webp'].includes(f.type) && f.size <= 10*1024*1024);
    if (files.length) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files].slice(0, 5) }));
      toast.success(`${files.length} image(s) added`);
    }
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files).filter(f => ['image/jpeg','image/png','image/webp'].includes(f.type) && f.size <= 10*1024*1024);
    if (files.length) setFormData(prev => ({ ...prev, images: [...prev.images, ...files].slice(0, 5) }));
  }, []);

  const removeImage = useCallback((index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }, []);

  const validateStep = useCallback((step) => {
    const newErrors = {};
    if (step === 2 && (!formData.description.trim() || formData.description.length < 10)) newErrors.description = 'Min 10 characters required';
    if (step === 3) {
      if (!formData.name.trim()) newErrors.name = 'Required';
      if (!formData.email.trim()) newErrors.email = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
      if (formData.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) { toast.error('Fix errors first'); return; }
    setIsSubmitting(true); setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setSubmitSuccess(true);
      toast.success('Submitted! We\'ll contact you soon.');
      setTimeout(() => { setFormData(initialFormData); setErrors({}); setCurrentStep(1); setSubmitSuccess(false); window.scrollTo({ top: 0 }); }, 2000);
    } catch { toast.error('Failed. Try again.'); }
    finally { setIsSubmitting(false); setLoading(false); }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-[1%]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-center max-w-sm">
          <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FiCheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Submitted!</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">We'll contact you within 24 hours.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full px-[1%] py-[1%]">
        <div className="max-w-4xl mx-auto">
          {/* Compact Header */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-6">
            <motion.div whileHover={{ scale: 1.03 }} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-800 rounded-full text-primary-600 dark:text-primary-400 text-[11px] font-semibold tracking-wide uppercase mb-3 shadow-sm border border-primary-100 dark:border-primary-900/30">
              <FiStar className="h-3 w-3" />
              <span>Custom Furniture Studio</span>
            </motion.div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mb-1">Craft Your Vision</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">Bespoke furniture crafted by master artisans</p>
          </motion.div>

          {/* Compact Trust Badges */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: FiShield, title: 'Quality', stat: 10, suffix: 'yr warranty' },
              { icon: FiAward, title: 'Artisans', stat: 25, suffix: 'yrs exp.' },
              { icon: FiZap, title: 'Quick', stat: 2, suffix: 'wks min' },
            ].map((badge, i) => (
              <motion.div key={i} whileHover={{ y: -2 }} className="bg-white dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl p-3 text-center border border-neutral-100 dark:border-neutral-700/50 shadow-sm">
                <badge.icon className="h-5 w-5 text-primary-500 mx-auto mb-1" />
                <p className="text-xs font-semibold text-neutral-900 dark:text-white">{badge.title}</p>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400"><AnimatedCounter value={badge.stat} /></span>
                  <span className="text-[10px] text-neutral-400">{badge.suffix}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Compact Process Steps */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-neutral-100 dark:border-neutral-700/50 shadow-sm">
            <div className="relative flex items-center justify-between">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-100 dark:bg-neutral-700 rounded-full">
                <motion.div className="h-full bg-primary-500 rounded-full" initial={{ width: '0%' }} animate={{ width: `${((currentStep - 1) / 2) * 100}%` }} transition={{ duration: 0.3 }} />
              </div>
              {[
                { step: 1, icon: FiEdit3, title: 'Describe' },
                { step: 2, icon: FiDroplet, title: 'Design' },
                { step: 3, icon: FiTruck, title: 'Deliver' },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center relative z-10">
                  <motion.button
                    onClick={() => setCurrentStep(item.step)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all text-sm ${
                      currentStep > item.step ? 'bg-emerald-500 text-white shadow-sm' :
                      currentStep === item.step ? 'bg-primary-500 text-white shadow-md scale-110' :
                      'bg-white dark:bg-neutral-700 text-neutral-400 border border-neutral-200 dark:border-neutral-600'
                    }`}
                  >
                    {currentStep > item.step ? <FiCheck className="h-4 w-4" /> : <item.icon className="h-4 w-4" />}
                    {currentStep === item.step && <motion.div className="absolute inset-0 rounded-xl bg-primary-500" animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                  </motion.button>
                  <p className={`text-xs font-semibold mt-2 ${currentStep >= item.step ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>{item.title}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Compact Form */}
          <TiltCard>
            <motion.form ref={formRef} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} onSubmit={handleSubmit}
              className="bg-white dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl border border-neutral-100 dark:border-neutral-700/50 shadow-md overflow-hidden">
              
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="p-5">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <FiEdit3 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-neutral-900 dark:text-white">Design Details</h2>
                        <p className="text-xs text-neutral-400">Bring your vision to life</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Type</label>
                        <CustomDropdown name="furnitureType" value={formData.furnitureType} onChange={handleChange} options={furnitureTypes} placeholder="Select" icon={FiBox} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Dimensions</label>
                        <input name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder='72"×36"×30"' className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white placeholder-neutral-400 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Material</label>
                        <CustomDropdown name="material" value={formData.material} onChange={handleChange} options={materialOptions} placeholder="Select" icon={FiLayers} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Color</label>
                        <input name="color" value={formData.color} onChange={handleChange} placeholder="Natural, Black..." className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white placeholder-neutral-400 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Budget</label>
                        <CustomDropdown name="budget" value={formData.budget} onChange={handleChange} options={budgetRanges} placeholder="Select" icon={FiDollarSign} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Timeline</label>
                        <CustomDropdown name="timeline" value={formData.timeline} onChange={handleChange} options={timelineOptions} placeholder="Select" icon={FiClock} />
                      </div>
                    </div>

                    {/* Compact Image Upload */}
                    <div className="mt-5">
                      <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Images <span className="text-neutral-400 font-normal normal-case">(max 5)</span></label>
                      <motion.div 
                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        animate={{ scale: dragActive ? 1.01 : 1, borderColor: dragActive ? '#6366f1' : '#d1d5db' }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${dragActive ? 'border-primary-400 bg-primary-50/50' : 'border-neutral-200 dark:border-neutral-600 hover:border-neutral-300'}`}
                      >
                        <FiUpload className="h-6 w-6 mx-auto text-neutral-400 mb-2" />
                        <p className="text-xs text-neutral-500">{dragActive ? 'Drop here' : 'Drop images or click'}</p>
                        <p className="text-[10px] text-neutral-300 mt-1">PNG, JPG • 10MB max</p>
                        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </motion.div>
                      
                      <AnimatePresence>
                        {formData.images.length > 0 && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-5 gap-2 mt-3">
                            {formData.images.map((image, index) => (
                              <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} className="relative group rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 aspect-square">
                                <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover" />
                                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <button type="button" onClick={() => removeImage(index)} className="p-1 bg-white rounded-full text-red-500"><FiX className="h-3 w-3" /></button>
                                </motion.div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="p-5">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <FiInfo className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-neutral-900 dark:text-white">Project Details</h2>
                        <p className="text-xs text-neutral-400">Tell us about your needs</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4"
                          className={`w-full rounded-lg border ${errors.description ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-600'} bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none dark:text-white placeholder-neutral-400 transition-colors`}
                          placeholder="Describe your vision: style, features, intended use..." />
                        <div className="flex justify-between mt-1">
                          {errors.description && <p className="text-xs text-red-500"><FiAlertCircle className="inline h-3 w-3 mr-0.5" />{errors.description}</p>}
                          <p className={`text-xs font-medium ml-auto ${formData.description.length < 10 ? 'text-red-400' : 'text-emerald-500'}`}>{formData.description.length} chars</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Inspiration Links</label>
                        <div className="relative">
                          <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input name="inspirationLinks" value={formData.inspirationLinks} onChange={handleChange} placeholder="Pinterest, Instagram URLs..." className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white placeholder-neutral-400 transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">Special Requirements</label>
                        <textarea name="specialRequirements" value={formData.specialRequirements} onChange={handleChange} rows="3"
                          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none dark:text-white placeholder-neutral-400 transition-colors"
                          placeholder="Eco-friendly, lighting, compartments..." />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="p-5">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <FiSend className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-neutral-900 dark:text-white">Contact Info</h2>
                        <p className="text-xs text-neutral-400">How to reach you</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      {[
                        { name: 'name', label: 'Name', icon: FiUser, type: 'text', placeholder: 'John Doe' },
                        { name: 'email', label: 'Email', icon: FiMail, type: 'email', placeholder: 'john@example.com' },
                        { name: 'phone', label: 'Phone', icon: FiPhone, type: 'tel', placeholder: '+1 555 000-0000' },
                      ].map((field) => (
                        <div key={field.name} className={field.name === 'phone' ? 'col-span-2' : ''}>
                          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">{field.label}</label>
                          <div className="relative">
                            <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input name={field.name} type={field.type} value={formData[field.name]} onChange={handleChange}
                              className={`w-full rounded-lg border ${errors[field.name] ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-600'} bg-white dark:bg-neutral-800 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white placeholder-neutral-400 transition-colors`}
                              placeholder={field.placeholder} />
                          </div>
                          {errors[field.name] && <p className="mt-1 text-xs text-red-500"><FiAlertCircle className="inline h-3 w-3 mr-0.5" />{errors[field.name]}</p>}
                        </div>
                      ))}
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 text-sm">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-1.5"><FiFileText className="h-3.5 w-3.5 text-primary-500" />Summary</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div><p className="text-[10px] text-neutral-400">Type</p><p className="font-medium text-neutral-900 dark:text-white text-sm">{furnitureTypes.find(t => t.value === formData.furnitureType)?.label || 'N/A'}</p></div>
                        {formData.material && <div><p className="text-[10px] text-neutral-400">Material</p><p className="font-medium text-neutral-900 dark:text-white text-sm">{materialOptions.find(m => m.value === formData.material)?.label}</p></div>}
                        {formData.budget && <div><p className="text-[10px] text-neutral-400">Budget</p><p className="font-medium text-neutral-900 dark:text-white text-sm">{budgetRanges.find(b => b.value === formData.budget)?.label}</p></div>}
                        {formData.images.length > 0 && <div><p className="text-[10px] text-neutral-400">Images</p><p className="font-medium text-neutral-900 dark:text-white text-sm">{formData.images.length} attached</p></div>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Compact Footer */}
              <div className="flex items-center justify-between px-5 py-4 bg-neutral-50/80 dark:bg-neutral-800/30 border-t border-neutral-100 dark:border-neutral-700/50">
                <div>
                  {currentStep > 1 && (
                    <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:shadow-sm transition-all">
                      <FiChevronLeft className="h-3.5 w-3.5" /> Back
                    </motion.button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {currentStep < totalSteps ? (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => { if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, totalSteps)); }}
                      className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-all">
                      Next <FiArrowRight className="h-3.5 w-3.5" />
                    </motion.button>
                  ) : (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-400 rounded-lg shadow-sm transition-all">
                      {isSubmitting ? (
                        <><motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></motion.svg> Sending...</>
                      ) : (
                        <><FiSend className="h-3.5 w-3.5" /> Submit Request</>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.form>
          </TiltCard>
        </div>
      </div>

      <style>{`
        @keyframes slide-down { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-down { animation: slide-down 0.25s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; }
        textarea::-webkit-scrollbar { width: 3px; }
        textarea::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default CustomFurniture;