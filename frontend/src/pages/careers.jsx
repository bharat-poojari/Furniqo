import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  FiBriefcase, 
  FiMapPin, 
  FiClock, 
  FiUsers, 
  FiHeart, 
  FiCoffee, 
  FiGlobe, 
  FiArrowRight,
  FiArrowUpRight,
  FiSearch,
  FiX,
  FiCheckCircle,
  FiStar,
  FiDollarSign,
  FiGift,
  FiBookOpen,
  FiZap,
  FiSend,
  FiChevronRight,
  FiMonitor,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiUpload,
  FiLinkedin,
  FiCheck
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';

// Application Modal Component
const ApplicationModal = ({ isOpen, onClose, jobTitle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    resume: null,
    coverLetter: '',
    portfolio: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFormData(prev => ({ ...prev, resume: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.resume) {
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', linkedin: '', resume: null, coverLetter: '', portfolio: '' });
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
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            {submitted ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <FiCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <h3 className="text-lg font-bold dark:text-white mb-2">Application Submitted!</h3>
                <p className="text-sm text-neutral-500">We'll review your application and get back to you soon.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">Apply for Position</h3>
                    <p className="text-sm text-neutral-500">{jobTitle}</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Full Name *</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                        <input name="name" value={formData.name} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="John Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email *</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                        <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="john@email.com" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Phone</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                        <input name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="+1 (555) 000-0000" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">LinkedIn</label>
                      <div className="relative">
                        <FiLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                        <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="linkedin.com/in/..." />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Resume/CV *</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-primary-400 ${
                        formData.resume ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10' : 'border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      {formData.resume ? (
                        <div className="flex items-center justify-center gap-2">
                          <FiCheck className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-600">{formData.resume.name}</span>
                        </div>
                      ) : (
                        <>
                          <FiUpload className="h-6 w-6 text-neutral-400 mx-auto mb-2" />
                          <p className="text-sm text-neutral-500">Click to upload resume</p>
                          <p className="text-xs text-neutral-400 mt-1">PDF, DOCX up to 10MB</p>
                        </>
                      )}
                      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Portfolio URL</label>
                    <input name="portfolio" value={formData.portfolio} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white" placeholder="https://yourportfolio.com" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Cover Letter</label>
                    <textarea name="coverLetter" value={formData.coverLetter} onChange={handleChange} rows={4} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white resize-none" placeholder="Tell us why you're a great fit..." />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
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

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [expandedJob, setExpandedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    { 
      id: 1,
      title: 'Senior Frontend Developer', 
      department: 'Engineering', 
      location: 'New York, NY', 
      type: 'Full-time',
      salary: '$120k - $160k',
      description: 'Build and maintain our e-commerce platform using React, Next.js, and modern web technologies. Lead frontend architecture decisions and mentor junior developers.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'E-commerce experience', 'Team leadership'],
      posted: '2 days ago',
      urgent: true
    },
    { 
      id: 2,
      title: 'UX/UI Designer', 
      department: 'Design', 
      location: 'Remote', 
      type: 'Full-time',
      salary: '$90k - $130k',
      description: 'Design intuitive and beautiful experiences for our furniture shopping platform. Create wireframes, prototypes, and high-fidelity designs.',
      requirements: ['3+ years UX/UI design', 'Figma expertise', 'User research experience', 'Design systems'],
      posted: '1 week ago'
    },
    { 
      id: 3,
      title: 'Product Manager', 
      department: 'Product', 
      location: 'San Francisco, CA', 
      type: 'Full-time',
      salary: '$130k - $170k',
      description: 'Lead product strategy and roadmap for our core shopping experience. Work cross-functionally with engineering, design, and business teams.',
      requirements: ['5+ years PM experience', 'E-commerce background', 'Data-driven mindset', 'Agile methodologies'],
      posted: '3 days ago',
      urgent: true
    },
    { 
      id: 4,
      title: 'Customer Success Manager', 
      department: 'Support', 
      location: 'New York, NY', 
      type: 'Full-time',
      salary: '$70k - $90k',
      description: 'Ensure our customers have an exceptional experience from purchase to delivery. Handle escalations and build customer loyalty programs.',
      requirements: ['3+ years customer success', 'Furniture industry knowledge', 'Problem-solving skills', 'CRM experience'],
      posted: '5 days ago'
    },
    { 
      id: 5,
      title: 'Supply Chain Analyst', 
      department: 'Operations', 
      location: 'Chicago, IL', 
      type: 'Full-time',
      salary: '$75k - $95k',
      description: 'Optimize our furniture supply chain and logistics operations. Analyze data to improve delivery times and reduce costs.',
      requirements: ['3+ years supply chain', 'Data analysis skills', 'Logistics experience', 'ERP systems knowledge'],
      posted: '1 week ago'
    },
    { 
      id: 6,
      title: 'Content Marketing Specialist', 
      department: 'Marketing', 
      location: 'Remote', 
      type: 'Full-time',
      salary: '$65k - $85k',
      description: 'Create compelling content that inspires and educates our furniture-buying audience across multiple channels.',
      requirements: ['3+ years content marketing', 'SEO knowledge', 'Social media expertise', 'Writing portfolio'],
      posted: '4 days ago'
    },
  ];

  const departments = ['all', ...new Set(jobs.map(j => j.department))];
  const locations = ['all', ...new Set(jobs.map(j => j.location))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  const openApplication = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const perks = [
    { icon: FiHeart, title: 'Health & Wellness', desc: 'Comprehensive health, dental, and vision plans', color: 'from-red-500 to-pink-500' },
    { icon: FiCoffee, title: 'Flexible Work', desc: 'Remote-friendly with flexible hours', color: 'from-amber-500 to-orange-500' },
    { icon: FiGlobe, title: 'Growth', desc: '$2,000 annual learning budget', color: 'from-blue-500 to-cyan-500' },
    { icon: FiUsers, title: 'Team Culture', desc: 'Regular events and retreats', color: 'from-purple-500 to-indigo-500' },
    { icon: FiDollarSign, title: 'Competitive Pay', desc: 'Top-market salaries with equity', color: 'from-emerald-500 to-teal-500' },
    { icon: FiGift, title: 'Generous PTO', desc: 'Unlimited vacation policy', color: 'from-green-500 to-lime-500' },
    { icon: FiMonitor, title: 'Tech Stipend', desc: '$1,500 annual equipment budget', color: 'from-violet-500 to-purple-500' },
    { icon: FiBookOpen, title: 'Learning', desc: 'Free courses & conferences', color: 'from-rose-500 to-pink-500' },
  ];

  const stats = [
    { value: '150+', label: 'Team Members', icon: FiUsers, color: 'text-blue-400' },
    { value: '12', label: 'Countries', icon: FiGlobe, color: 'text-green-400' },
    { value: '98%', label: 'Retention', icon: FiHeart, color: 'text-red-400' },
    { value: '4.8', label: 'Rating', icon: FiStar, color: 'text-amber-400' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Frontend Developer', quote: 'The culture here is incredible. I have the freedom to innovate and grow every day.', avatar: 'SC' },
    { name: 'Marcus Johnson', role: 'Product Designer', quote: 'We are truly empowered to make decisions that impact the product and our customers.', avatar: 'MJ' },
    { name: 'Emily Rodriguez', role: 'Supply Chain Lead', quote: 'The benefits and work-life balance are unmatched in the industry.', avatar: 'ER' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section with Background Image & Animation */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80" 
            alt="Team collaboration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/85 to-neutral-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/40" />
        </div>

        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} 
          />
        </div>

        {/* Floating Orbs */}
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-[10%] w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-blue-500/8 rounded-full blur-[80px]"
        />

        <div className="relative w-full px-[1%] py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left Content */}
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
                  <FiBriefcase className="h-3.5 w-3.5" />
                  <span className="tracking-wide uppercase">Careers</span>
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                  />
                </motion.div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 leading-[1.1] tracking-tight text-white">
                  Join the{' '}
                  <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Furniqo
                  </span>{' '}
                  Team
                </h1>
                
                <p className="text-base lg:text-lg text-neutral-300 max-w-lg mb-8 leading-relaxed">
                  Help us shape the future of furniture shopping. Build products that transform houses into homes.
                </p>

                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-6 py-3 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-all shadow-xl shadow-white/10"
                  >
                    View Open Roles
                    <FiArrowRight className="inline ml-2 h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-6 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/10"
                  >
                    Learn About Culture
                    <FiArrowUpRight className="inline ml-2 h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Right Stats Grid */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="grid grid-cols-2 gap-3"
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 lg:p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
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

      {/* Perks Section */}
      <section className="w-full px-[1%] py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Why Work With Us</h2>
            <p className="text-sm lg:text-base text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
              We believe in taking care of our team with benefits that matter
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg border border-neutral-100 dark:border-neutral-800"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${perk.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                <div className={`relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br ${perk.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                  <perk.icon className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-bold text-sm lg:text-base dark:text-white mb-1">{perk.title}</h4>
                <p className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{perk.desc}</p>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${perk.color} flex items-center justify-center`}>
                    <FiArrowRight className="h-3 w-3 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="open-positions" className="w-full px-[1%] py-12 lg:py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">Open Positions</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} available
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, department, or keyword..."
                  className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 shadow-sm transition-all"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    <FiX className="h-4 w-4 text-neutral-400" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="flex-1 sm:flex-none px-3 py-3 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer shadow-sm">
                  {departments.map(dept => <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>)}
                </select>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="flex-1 sm:flex-none px-3 py-3 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer shadow-sm">
                  {locations.map(loc => <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="max-w-3xl mx-auto">
            {filteredJobs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiBriefcase className="h-7 w-7 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white mb-1">No matching positions</h3>
                <p className="text-sm text-neutral-500 mb-4">Try different search terms or filters</p>
                <button onClick={() => { setSearchTerm(''); setSelectedDepartment('all'); setSelectedLocation('all'); }} className="text-sm text-primary-600 hover:text-primary-700 font-medium">Clear all filters</button>
              </motion.div>
            ) : (
              <div className="space-y-2.5">
                {filteredJobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    layout
                  >
                    <div 
                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                      className={`group bg-white dark:bg-neutral-900 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                        expandedJob === job.id 
                          ? 'border-primary-300 dark:border-primary-700 shadow-lg shadow-primary-500/5' 
                          : 'border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 hover:shadow-md'
                      }`}
                    >
                      <div className="p-4 lg:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="font-bold text-sm lg:text-base dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{job.title}</h3>
                              {job.urgent && (
                                <span className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-semibold px-2 py-0.5 rounded-full animate-pulse">Urgent</span>
                              )}
                              <span className="flex-shrink-0 text-[10px] text-neutral-400 font-medium px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">{job.posted}</span>
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
                              <span className="flex items-center gap-1"><FiBriefcase className="h-3 w-3" /> {job.department}</span>
                              <span className="flex items-center gap-1"><FiMapPin className="h-3 w-3" /> {job.location}</span>
                              <span className="flex items-center gap-1"><FiClock className="h-3 w-3" /> {job.type}</span>
                              <span className="flex items-center gap-1 font-semibold text-neutral-700 dark:text-neutral-300"><FiDollarSign className="h-3 w-3" /> {job.salary}</span>
                            </div>
                          </div>
                          <motion.div animate={{ rotate: expandedJob === job.id ? 90 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                            <FiChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                          </motion.div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedJob === job.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                            <div className="px-4 lg:px-5 pb-5 border-t border-neutral-100 dark:border-neutral-800">
                              <div className="pt-4 space-y-3">
                                <div>
                                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">About the Role</h4>
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{job.description}</p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Requirements</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {job.requirements.map((req, idx) => (
                                      <div key={idx} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                          <FiCheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        {req}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="pt-2 flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => { e.stopPropagation(); openApplication(job); }}
                                    className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
                                  >
                                    Apply Now
                                    <FiSend className="inline ml-2 h-3.5 w-3.5" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full px-[1%] py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-2">What Our Team Says</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Hear from the people building Furniqo</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 lg:p-6 border border-neutral-100 dark:border-neutral-800 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{t.avatar}</div>
                  <div><p className="font-semibold text-sm dark:text-white">{t.name}</p><p className="text-xs text-neutral-500">{t.role}</p></div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic">"{t.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-[1%] py-12 lg:py-16 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FiSend className="h-7 w-7 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2 dark:text-white">Don't See Your Role?</h2>
            <p className="text-sm lg:text-base text-neutral-500 dark:text-neutral-400 mb-6">
              We're always looking for talented people. Send us your resume.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openApplication({ title: 'Open Application' })}
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
            >
              Send Open Application
              <FiArrowRight className="inline ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Newsletter />

      {/* Application Modal */}
      <ApplicationModal 
        isOpen={showApplicationModal} 
        onClose={() => setShowApplicationModal(false)} 
        jobTitle={selectedJob?.title || 'Open Application'} 
      />
    </div>
  );
};

export default Careers;