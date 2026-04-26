import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiSave, 
  FiCamera, 
  FiPackage, 
  FiHeart, 
  FiLogOut,
  FiEdit2,
  FiCheck,
  FiX,
  FiUpload,
  FiAlertCircle,
  FiChevronRight,
  FiShoppingBag,
  FiStar,
  FiShield,
} from 'react-icons/fi';
import { useAuth } from '../store/AuthContext';
import { useWishlist } from '../store/WishlistContext';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

// Edit Field Modal
const EditFieldModal = ({ isOpen, onClose, field, value, onSave }) => {
  const [newValue, setNewValue] = useState(value || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNewValue(value || '');
  }, [value]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newValue.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onSave(field, newValue);
    setLoading(false);
    onClose();
    toast.success(`${field} updated successfully!`);
  };

  const getFieldLabel = (f) => {
    const labels = { name: 'Full Name', email: 'Email Address', phone: 'Phone Number', address: 'Address', city: 'City', state: 'State', zipCode: 'ZIP Code' };
    return labels[f] || f;
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
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold dark:text-white">Edit {getFieldLabel(field)}</h3>
                <p className="text-xs text-neutral-500">Update your information</p>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"><FiX className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <input
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white"
                  placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1.5">
                  {loading ? (
                    <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </motion.svg>
                  ) : <FiCheck className="h-3.5 w-3.5" />}
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Avatar Upload Modal
const AvatarModal = ({ isOpen, onClose, onSave }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else if (file) {
      toast.error('Image must be under 5MB');
    }
  };

  const handleSave = () => {
    if (!preview) return;
    setLoading(true);
    setTimeout(() => {
      onSave(preview);
      setLoading(false);
      onClose();
      toast.success('Profile photo updated!');
    }, 800);
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
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div><h3 className="text-base font-bold dark:text-white">Update Photo</h3><p className="text-xs text-neutral-500">Upload a profile picture</p></div>
              <button type="button" onClick={onClose} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"><FiX className="h-4 w-4" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border-4 border-neutral-200 dark:border-neutral-700">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="h-8 w-8 text-neutral-400" />
                  )}
                </div>
              </div>
              <div className="text-center">
                <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors inline-flex items-center gap-1.5">
                  <FiUpload className="h-3.5 w-3.5" /> Choose Image
                </button>
                <p className="text-[10px] text-neutral-400 mt-1.5">JPG, PNG up to 5MB</p>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
                <button type="button" onClick={handleSave} disabled={!preview || loading} className="flex-1 px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-1.5">
                  {loading ? 'Saving...' : 'Save Photo'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Logout Confirm Modal
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FiLogOut className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold dark:text-white mb-1">Sign Out?</h3>
              <p className="text-sm text-neutral-500 mb-5">Are you sure you want to sign out?</p>
              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
                <button type="button" onClick={onConfirm} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Sign Out</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Profile = () => {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  
  // Local state for form data - updates directly from user context
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '' });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [avatar, setAvatar] = useState(null);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState({ field: '', value: '' });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load user data from localStorage or user context
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
      });
    } else {
      // Fallback: try loading from localStorage
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          setFormData(JSON.parse(savedProfile));
        } catch (e) {}
      }
    }
    // Load saved avatar
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setAvatar(savedAvatar);
  }, [user]);

  // Loading state
  if (authLoading) {
    return (
      <div className="w-full px-[1%] py-[1%]">
        <div className="animate-pulse space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="space-y-1.5">
              <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />)}
          </div>
          <div className="h-8 w-full bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />)}
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="w-full px-[1%] py-[1%]">
        <div className="max-w-sm mx-auto text-center py-12">
          <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUser className="h-7 w-7 text-neutral-400" />
          </div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Sign In Required</h1>
          <p className="text-sm text-neutral-500 mb-5">You need to be logged in to view your profile.</p>
          <Link to="/login" className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-1.5">
            Sign In <FiChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Handle field save (local state + localStorage)
  const handleFieldSave = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(updatedData));
  };

  // Handle avatar save
  const handleAvatarSave = (avatarUrl) => {
    setAvatar(avatarUrl);
    localStorage.setItem('userAvatar', avatarUrl);
  };

  // Handle save all changes
  const handleSaveAll = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('userProfile', JSON.stringify(formData));
      setSaving(false);
      toast.success('Profile updated successfully!');
    }, 800);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Signed out successfully');
  };

  // Handle change for direct input editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart, count: wishlistItems.length },
    { id: 'orders', label: 'Orders', icon: FiPackage },
  ];

  const quickStats = [
    { icon: FiShoppingBag, label: 'Orders', value: '12', href: '/orders' },
    { icon: FiHeart, label: 'Wishlist', value: (wishlistItems.length || 0).toString(), href: '/wishlist' },
    { icon: FiStar, label: 'Reviews', value: '3', href: '/reviews' },
  ];

  const inputClass = `w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white placeholder-neutral-400 transition-all`;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full px-[1%] py-[1%]">
        
        {/* Header Row */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden border-2 border-primary-200 dark:border-primary-800">
                {avatar ? (
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base font-bold text-primary-600">{formData.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <button type="button" onClick={() => setShowAvatarModal(true)} className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-neutral-800 rounded-full shadow-md flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-700">
                <FiCamera className="h-2.5 w-2.5" />
              </button>
            </div>
            <div>
              <h1 className="text-sm lg:text-base font-bold text-neutral-900 dark:text-white">{formData.name || 'User'}</h1>
              <p className="text-[11px] text-neutral-500">{formData.email || user?.email}</p>
            </div>
          </div>
          <button type="button" onClick={() => setShowLogoutModal(true)} className="px-3 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1.5">
            <FiLogOut className="h-3 w-3" /> Sign Out
          </button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-2 mb-4">
          {quickStats.map((stat, i) => (
            <Link key={i} to={stat.href} className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-100 dark:border-neutral-800 hover:shadow-sm transition-all group">
              <stat.icon className="h-3.5 w-3.5 text-primary-500 mb-1.5" />
              <p className="text-base font-bold dark:text-white">{stat.value}</p>
              <p className="text-[10px] text-neutral-500">{stat.label}</p>
            </Link>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-1 mb-4 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all ${
                activeTab === tab.id ? 'bg-white dark:bg-neutral-700 text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
              {tab.count > 0 && <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-[9px] px-1.5 py-0.5 rounded-full">{tab.count}</span>}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold dark:text-white">Personal Information</h2>
                  <p className="text-[10px] text-neutral-500">Manage your account details</p>
                </div>
                <span className="text-[10px] text-neutral-400 flex items-center gap-1"><FiShield className="h-3 w-3 text-emerald-500" /> Verified</span>
              </div>

              <div className="p-3 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { field: 'name', label: 'Full Name', icon: FiUser, value: formData.name },
                    { field: 'email', label: 'Email', icon: FiMail, value: formData.email, disabled: true },
                    { field: 'phone', label: 'Phone', icon: FiPhone, value: formData.phone },
                    { field: 'address', label: 'Address', icon: FiMapPin, value: formData.address },
                    { field: 'city', label: 'City', value: formData.city },
                    { field: 'state', label: 'State', value: formData.state },
                    { field: 'zipCode', label: 'ZIP Code', value: formData.zipCode },
                  ].map((item) => (
                    <div key={item.field} className={item.field === 'address' ? 'sm:col-span-2' : ''}>
                      <label className="block text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">{item.label}</label>
                      <div className="relative">
                        {item.icon && <item.icon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" />}
                        <input
                          type="text"
                          name={item.field}
                          value={item.value}
                          onChange={handleChange}
                          disabled={item.disabled}
                          className={`${inputClass} ${item.disabled ? 'bg-neutral-50 dark:bg-neutral-800/50 text-neutral-400 cursor-not-allowed' : ''}`}
                        />
                        {!item.disabled && (
                          <button
                            type="button"
                            onClick={() => { setEditField({ field: item.field, value: item.value }); setShowEditModal(true); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
                          >
                            <FiEdit2 className="h-3 w-3 text-neutral-400 hover:text-primary-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="w-full px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {saving ? (
                    <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </motion.svg>
                  ) : <FiSave className="h-3.5 w-3.5" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {wishlistItems.length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <FiHeart className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500 mb-3">Your wishlist is empty</p>
                  <Link to="/products" className="px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-1.5">
                    Browse Products <FiChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {wishlistItems.map((item) => (
                    <Link key={item._id} to={`/products/${item.slug}`} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-all group">
                      <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-medium dark:text-white truncate">{item.name}</p>
                        <p className="text-sm font-bold text-primary-600 mt-0.5">{formatPrice(item.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-10 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
              <FiPackage className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500 mb-3">View your complete order history</p>
              <Link to="/orders" className="px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-1.5">
                View All Orders <FiChevronRight className="h-3 w-3" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <EditFieldModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} field={editField.field} value={editField.value} onSave={handleFieldSave} />
      <AvatarModal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)} onSave={handleAvatarSave} />
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </div>
  );
};

export default Profile;