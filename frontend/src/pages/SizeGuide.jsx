import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMaximize,
  FiArrowRight,
  FiDownload,
  FiHelpCircle,
  FiX,
  FiCheck,
  FiSend,
  FiUser,
  FiMail,
  FiFileText,
  FiBox,
  FiGrid,
  FiLayers,
  FiPackage,
  FiMonitor,
  FiBookOpen,
  FiCoffee,
  FiDroplet
} from 'react-icons/fi';
import Newsletter from '../components/layout/Newsletter';

// Custom SVG Icons
const RulerIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h12M3 17h6M6 3v18" />
  </svg>
);

const SofaIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 11h16v4H4zM4 15l-1 3h18l-1-3M7 11V9a5 5 0 0110 0v2" />
  </svg>
);

const BedIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 10l1-4h16l1 4M3 14v6h18v-6M7 14v6M17 14v6" />
  </svg>
);

const TableIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 6v12h16V6M12 6v12M4 10h16M4 14h16" />
  </svg>
);

const ChairIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12v6h12v-6M6 12V8a2 2 0 012-2h8a2 2 0 012 2v4M8 18v3h8v-3" />
  </svg>
);

const StorageIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4zM4 9h16M12 4v16" />
  </svg>
);

const DeskIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 8v8h16V8M12 8v10M8 18v3M16 18v3" />
  </svg>
);

const WidthIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M6 9l-3 3 3 3M18 9l3 3-3 3" />
  </svg>
);

const DepthIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18M9 6l3-3 3 3M9 18l3 3 3-3" />
  </svg>
);

const HeightIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3h8M8 21h8M12 3v18M10 7h4M10 11h4M10 15h4" />
  </svg>
);

const SeatIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18v3h12v-3M6 10v8h12v-8M8 10V7a4 4 0 018 0v3" />
  </svg>
);

const ClearanceIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 8v12h16V8M4 12h16M4 16h16M8 4V2M16 4V2M12 4V2" />
  </svg>
);

// Download Guide Modal
const DownloadGuideModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', profession: '' });
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
      setFormData({ name: '', email: '', profession: '' });
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
                <h3 className="text-lg font-bold dark:text-white mb-2">Guide Sent!</h3>
                <p className="text-sm text-neutral-500">Check your email for the size guide PDF.</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-5 text-white text-center">
                  <FiDownload className="h-8 w-8 mx-auto mb-2 opacity-80" />
                  <h3 className="text-lg font-bold mb-1">Download Size Guide</h3>
                  <p className="text-sm text-white/80">Complete furniture measurement reference</p>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Profession</label>
                    <select name="profession" value={formData.profession} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white cursor-pointer">
                      <option value="">Select profession</option>
                      <option value="designer">Interior Designer</option>
                      <option value="architect">Architect</option>
                      <option value="homeowner">Homeowner</option>
                      <option value="contractor">Contractor</option>
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
                      {loading ? 'Sending...' : 'Download Guide'}
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

const SizeGuide = () => {
  const [activeCategory, setActiveCategory] = useState('sofas');
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const categories = [
    { id: 'sofas', label: 'Sofas & Sectionals', icon: SofaIcon },
    { id: 'beds', label: 'Beds & Frames', icon: BedIcon },
    { id: 'tables', label: 'Dining Tables', icon: TableIcon },
    { id: 'chairs', label: 'Chairs', icon: ChairIcon },
    { id: 'storage', label: 'Storage', icon: StorageIcon },
    { id: 'desks', label: 'Desks', icon: DeskIcon },
  ];

  const sizeData = {
    sofas: {
      title: 'Sofa & Sectional Dimensions',
      description: 'Standard measurements to help you find the perfect fit for your space.',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      sizes: [
        { type: 'Armchair', width: '35-40"', depth: '35-40"', height: '35-40"', seatDepth: '20-24"', seatHeight: '18-20"' },
        { type: 'Loveseat', width: '55-65"', depth: '35-40"', height: '35-40"', seatDepth: '20-24"', seatHeight: '18-20"' },
        { type: '3-Seat Sofa', width: '75-90"', depth: '35-40"', height: '35-40"', seatDepth: '20-24"', seatHeight: '18-20"' },
        { type: 'Sectional', width: '95-120"', depth: '60-80"', height: '35-40"', seatDepth: '20-24"', seatHeight: '18-20"' },
        { type: 'Chaise Lounge', width: '60-75"', depth: '35-40"', height: '35-40"', seatDepth: '20-24"', seatHeight: '18-20"' },
      ],
      tips: [
        'Allow 18" of walking space in front of sofas',
        'Leave 3-6" between sofa and wall',
        'Coffee table should be 16-18" from sofa front',
        'Measure doorways before ordering large sectionals',
      ]
    },
    beds: {
      title: 'Bed & Frame Dimensions',
      description: 'Standard bed sizes and recommended room dimensions.',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
      sizes: [
        { type: 'Twin', width: '39"', depth: '75"', height: '48-54"', mattressWidth: '39"', mattressLength: '75"' },
        { type: 'Full/Double', width: '54"', depth: '75"', height: '48-54"', mattressWidth: '54"', mattressLength: '75"' },
        { type: 'Queen', width: '60"', depth: '80"', height: '48-54"', mattressWidth: '60"', mattressLength: '80"' },
        { type: 'King', width: '76"', depth: '80"', height: '48-54"', mattressWidth: '76"', mattressLength: '80"' },
        { type: 'Cal King', width: '72"', depth: '84"', height: '48-54"', mattressWidth: '72"', mattressLength: '84"' },
      ],
      tips: [
        'Allow 24-30" of walking space around the bed',
        'Nightstands should be level with mattress top',
        'King beds need at least 12x12 ft room',
        'Consider ceiling height for canopy beds',
      ]
    },
    tables: {
      title: 'Dining Table Dimensions',
      description: 'Find the right table size for your dining space.',
      image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80',
      sizes: [
        { type: '2-Seater', width: '30-36"', depth: '30-36"', height: '28-30"', seatsPerson: '2', clearancePerSeat: '24"' },
        { type: '4-Seater', width: '36-48"', depth: '36-48"', height: '28-30"', seatsPerson: '4', clearancePerSeat: '24"' },
        { type: '6-Seater', width: '60-72"', depth: '36-42"', height: '28-30"', seatsPerson: '6', clearancePerSeat: '24"' },
        { type: '8-Seater', width: '72-96"', depth: '40-48"', height: '28-30"', seatsPerson: '8', clearancePerSeat: '24"' },
        { type: '10-Seater', width: '96-120"', depth: '42-48"', height: '28-30"', seatsPerson: '10', clearancePerSeat: '24"' },
      ],
      tips: [
        'Allow 36" from table edge to wall for chairs',
        'Each person needs 24" of table width',
        'Round tables save space in small rooms',
        'Extendable tables offer flexibility',
      ]
    },
    chairs: {
      title: 'Chair Dimensions',
      description: 'Standard chair measurements for dining and accent chairs.',
      image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80',
      sizes: [
        { type: 'Dining Chair', width: '18-22"', depth: '20-24"', height: '34-38"', seatHeight: '18-20"', seatDepth: '16-18"' },
        { type: 'Armchair', width: '28-35"', depth: '30-35"', height: '35-40"', seatHeight: '18-20"', seatDepth: '20-24"' },
        { type: 'Bar Stool', width: '16-20"', depth: '16-20"', height: '40-46"', seatHeight: '28-32"', seatDepth: '14-16"' },
        { type: 'Office Chair', width: '24-28"', depth: '24-28"', height: '40-48"', seatHeight: '16-20"', seatDepth: '16-20"' },
      ],
      tips: [
        'Dining chairs need 7" between seat and table bottom',
        'Bar stools need 10-12" between seat and counter',
        'Allow 6" between chairs at dining tables',
        'Office chairs should support your lower back',
      ]
    },
    storage: {
      title: 'Storage Dimensions',
      description: 'Standard sizes for cabinets, shelves, and storage units.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
      sizes: [
        { type: 'Bookshelf', width: '24-36"', depth: '10-14"', height: '60-84"', shelvesCount: '4-6', shelfSpacing: '12-14"' },
        { type: 'TV Stand', width: '48-72"', depth: '16-20"', height: '24-30"', shelvesCount: '2-3', shelfSpacing: '8-10"' },
        { type: 'Wardrobe', width: '36-48"', depth: '22-26"', height: '72-84"', shelvesCount: '4-6', shelfSpacing: '14-16"' },
        { type: 'Sideboard', width: '48-60"', depth: '16-20"', height: '30-36"', shelvesCount: '2-3', shelfSpacing: '10-12"' },
      ],
      tips: [
        'TV stands should be wider than your TV',
        'Allow 15" of depth for hanging clothes',
        'Bookshelves need 12" minimum depth',
        'Anchor tall furniture to walls for safety',
      ]
    },
    desks: {
      title: 'Desk Dimensions',
      description: 'Find the perfect desk size for your workspace.',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
      sizes: [
        { type: 'Writing Desk', width: '40-48"', depth: '24-28"', height: '28-30"', legSpace: '24-28"', idealChairHeight: '16-20"' },
        { type: 'Computer Desk', width: '48-60"', depth: '24-30"', height: '28-30"', legSpace: '24-28"', idealChairHeight: '16-20"' },
        { type: 'Executive Desk', width: '60-72"', depth: '30-36"', height: '28-30"', legSpace: '28-32"', idealChairHeight: '16-20"' },
        { type: 'Standing Desk', width: '48-60"', depth: '24-30"', height: '38-48"', legSpace: '24-30"', idealChairHeight: '24-30"' },
      ],
      tips: [
        'Monitor should be at arm\'s length distance',
        'Allow 36" behind desk for chair movement',
        'Standing desks should have anti-fatigue mats',
        'Cable management keeps your desk organized',
      ]
    },
  };

  const currentData = sizeData[activeCategory];
  const columns = Object.keys(currentData?.sizes[0] || {}).filter(k => !['seatsPerson', 'clearancePerSeat', 'shelvesCount', 'shelfSpacing', 'legSpace', 'idealChairHeight', 'mattressWidth', 'mattressLength'].includes(k));

  const measurementGuide = [
    { title: 'Width (W)', desc: 'Left to right measurement', icon: WidthIcon },
    { title: 'Depth (D)', desc: 'Front to back measurement', icon: DepthIcon },
    { title: 'Height (H)', desc: 'Bottom to top measurement', icon: HeightIcon },
    { title: 'Seat Height', desc: 'Floor to top of seat', icon: SeatIcon },
    { title: 'Seat Depth', desc: 'Front to back of seat', icon: DepthIcon },
    { title: 'Clearance', desc: 'Space needed around item', icon: ClearanceIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-[1%] py-[1%]">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 mb-3">
            <RulerIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </motion.div>
          <h1 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mb-1 tracking-tight">Size Guide</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
            Find the perfect dimensions for every piece of furniture
          </p>
        </motion.div>

        {/* Category Tabs - Full Width */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <IconComponent className="h-3.5 w-3.5" />
                  {cat.label.split(' &')[0]}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content - Full Width Grid */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          
          {/* Left - Size Table */}
          <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
            
            {/* Category Header with Image */}
            <div className="relative h-40 bg-gradient-to-br from-primary-500 to-purple-600 overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <img 
                src={currentData.image} 
                alt={currentData.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="text-lg font-bold text-white mb-1">{currentData.title}</h2>
                <p className="text-sm text-white/80">{currentData.description}</p>
              </div>
            </div>

            {/* Size Table */}
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-2 px-3 text-xs font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Type</th>
                    {columns.map(col => (
                      <th key={col} className="text-center py-2 px-3 text-xs font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                        {col.replace(/([A-Z])/g, ' $1').trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.sizes.map((size, i) => (
                    <tr key={i} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-white whitespace-nowrap text-xs">{size.type}</td>
                      {columns.map(col => (
                        <td key={col} className="py-2.5 px-3 text-center text-neutral-600 dark:text-neutral-400 whitespace-nowrap text-xs">
                          {size[col] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tips Section */}
            <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold dark:text-white mb-2 flex items-center gap-2">
                <FiHelpCircle className="h-4 w-4 text-amber-500" />
                Measuring Tips
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentData.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <div className="space-y-3">
            
            {/* Measurement Guide */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <FiMaximize className="h-3.5 w-3.5 text-primary-500" />
                  Measurement Guide
                </h3>
              </div>
              <div className="p-3 space-y-0">
                {measurementGuide.map((item, i) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-neutral-50 dark:border-neutral-800 last:border-0">
                      <IconComponent className="h-4 w-4 text-primary-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold dark:text-white">{item.title}</p>
                        <p className="text-[10px] text-neutral-500">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Download Guide CTA */}
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-4 text-white text-center">
              <FiDownload className="h-5 w-5 mx-auto mb-2 opacity-80" />
              <h3 className="text-sm font-bold mb-1">Printable Guide</h3>
              <p className="text-xs text-white/70 mb-3">Download our complete size guide PDF</p>
              <button 
                type="button" 
                onClick={() => setShowDownloadModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-semibold hover:bg-white/30 transition-all"
              >
                Download PDF <FiArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Pro Tip */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30">
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-2">
                <FiHelpCircle className="h-4 w-4" />
                Pro Tip
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                Always measure your doorways, stairwells, and elevators before ordering large furniture. Use painter's tape to mark dimensions on your floor.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />

      {/* Download Modal */}
      <DownloadGuideModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SizeGuide;