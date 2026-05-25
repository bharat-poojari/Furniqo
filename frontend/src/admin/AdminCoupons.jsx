// AdminCoupons.jsx - Coupon management (FIXED - Correct API field names)
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit2, FiTrash2, FiCopy, FiCalendar, FiPercent, 
  FiDollarSign, FiX, FiSave, FiSearch, FiRefreshCw, FiTag,
  FiClock, FiCheckCircle, FiAlertCircle, FiToggleLeft, FiToggleRight
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  // Separate form state
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState('percentage');
  const [formDiscount, setFormDiscount] = useState('');
  const [formMinPurchase, setFormMinPurchase] = useState('');
  const [formMaxDiscount, setFormMaxDiscount] = useState('');
  const [formUsageLimit, setFormUsageLimit] = useState('');
  const [formValidFrom, setFormValidFrom] = useState('');
  const [formValidUntil, setFormValidUntil] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formForNewUsers, setFormForNewUsers] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getAllCoupons();
      
      // Handle response format
      let couponsData = [];
      if (response?.coupons && Array.isArray(response.coupons)) {
        couponsData = response.coupons;
      } else if (response?.data?.coupons && Array.isArray(response.data.coupons)) {
        couponsData = response.data.coupons;
      }
      
      setCoupons(couponsData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formCode.trim()) {
      toast.error('Coupon code is required');
      return;
    }
    
    const discountNum = parseFloat(formDiscount);
    if (isNaN(discountNum) || discountNum <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }
    
    if (formType === 'percentage' && discountNum > 100) {
      toast.error('Percentage discount cannot exceed 100%');
      return;
    }

    if (!formValidFrom) {
      toast.error('Start date is required');
      return;
    }
    
    if (!formValidUntil) {
      toast.error('End date is required');
      return;
    }

    // Build form data with correct API field names
    const submitData = {
      code: formCode.toUpperCase(),
      discount: discountNum,
      type: formType,
      minPurchase: parseFloat(formMinPurchase) || 0,
      maxDiscount: formMaxDiscount ? parseFloat(formMaxDiscount) : null,
      validFrom: formValidFrom,
      validUntil: formValidUntil,
      description: formDescription,
      usageLimit: formUsageLimit ? parseInt(formUsageLimit) : null,
      forNewUsers: formForNewUsers
    };

    console.log('Submitting coupon data:', submitData);

    try {
      setSaving(true);
      
      if (modalMode === 'create') {
        await apiWrapper.createCoupon(submitData);
        toast.success('Coupon created successfully');
      } else {
        await apiWrapper.updateCoupon(selectedCoupon.code, submitData);
        toast.success('Coupon updated successfully');
      }
      
      await fetchCoupons();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error?.response?.data?.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (coupon) => {
    if (window.confirm(`Delete coupon "${coupon.code}"? This action cannot be undone.`)) {
      try {
        setLoading(true);
        await apiWrapper.deleteCoupon(coupon.code);
        toast.success('Coupon deleted successfully');
        await fetchCoupons();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete coupon');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      setLoading(true);
      const updatedCoupon = { ...coupon, isActive: coupon.isActive ? 0 : 1 };
      await apiWrapper.updateCoupon(coupon.code, updatedCoupon);
      toast.success(`Coupon ${coupon.isActive ? 'deactivated' : 'activated'}`);
      await fetchCoupons();
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update coupon status');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const resetForm = () => {
    setFormCode('');
    setFormDescription('');
    setFormType('percentage');
    setFormDiscount('');
    setFormMinPurchase('');
    setFormMaxDiscount('');
    setFormUsageLimit('');
    setFormValidFrom('');
    setFormValidUntil('');
    setFormIsActive(true);
    setFormForNewUsers(false);
    setSelectedCoupon(null);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setFormCode(code);
  };

  const editCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setFormCode(coupon.code || '');
    setFormDescription(coupon.description || '');
    setFormType(coupon.type || 'percentage');
    setFormDiscount(coupon.discount?.toString() || '');
    setFormMinPurchase(coupon.minPurchase?.toString() || '');
    setFormMaxDiscount(coupon.maxDiscount?.toString() || '');
    setFormUsageLimit(coupon.usageLimit?.toString() || '');
    setFormValidFrom(coupon.validFrom || '');
    setFormValidUntil(coupon.validUntil || '');
    setFormIsActive(coupon.isActive === 1);
    setFormForNewUsers(coupon.forNewUsers === 1);
    setModalMode('edit');
    setShowModal(true);
  };

  const createNewCoupon = () => {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = nextMonth.toISOString().split('T')[0];
    
    resetForm();
    setFormValidFrom(today);
    setFormValidUntil(nextMonthStr);
    setModalMode('create');
    setShowModal(true);
  };

  const isCouponExpired = (validUntil) => {
    if (!validUntil) return false;
    const today = new Date().toISOString().split('T')[0];
    return validUntil < today;
  };

  const getCouponStatus = (coupon) => {
    if (coupon.isActive !== 1) return { label: 'Inactive', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400' };
    if (isCouponExpired(coupon.validUntil)) return { label: 'Expired', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
    return { label: 'Active', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
  };

  const filteredCoupons = useMemo(() => {
    let filtered = [...coupons];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(coupon => 
        coupon.code?.toLowerCase().includes(term) ||
        coupon.description?.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [coupons, searchTerm]);

  const stats = useMemo(() => ({
    total: coupons.length,
    active: coupons.filter(c => c.isActive === 1 && !isCouponExpired(c.validUntil)).length,
    expired: coupons.filter(c => isCouponExpired(c.validUntil)).length,
    inactive: coupons.filter(c => c.isActive !== 1).length,
  }), [coupons]);

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setFormCode(value);
  };

  if (loading && coupons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">Coupon Management</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">Create and manage discount coupons for your store</p>
        </div>
        <button 
          onClick={createNewCoupon} 
          className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm sm:text-base"
          type="button"
        >
          <FiPlus className="h-4 w-4 sm:h-5 sm:w-5" />
          Create Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-neutral-500">Total</p>
            <FiTag className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-neutral-500">Active</p>
            <FiCheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-neutral-500">Expired</p>
            <FiAlertCircle className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">{stats.expired}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-neutral-500">Inactive</p>
            <FiToggleLeft className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold mt-1">{stats.inactive}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by code or description..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
          />
        </div>
        <button 
          onClick={fetchCoupons} 
          className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          disabled={loading}
          type="button"
        >
          <FiRefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <FiTag className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
          <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            {searchTerm ? 'No matching coupons' : 'No Coupons Yet'}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mb-4">
            {searchTerm ? 'Try a different search term' : 'Create your first coupon to start offering discounts'}
          </p>
          {!searchTerm && (
            <button 
              onClick={createNewCoupon} 
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
              type="button"
            >
              Create Coupon
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredCoupons.map((coupon, idx) => {
            const status = getCouponStatus(coupon);
            return (
              <motion.div
                key={coupon.code}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all duration-200 relative group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-5" />
                
                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg sm:text-xl font-mono font-bold text-primary-600 dark:text-primary-400 truncate">
                          {coupon.code}
                        </h3>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${status.color}`}>
                          {status.label === 'Active' && <FiCheckCircle className="h-3 w-3" />}
                          {status.label === 'Expired' && <FiAlertCircle className="h-3 w-3" />}
                          <span>{status.label}</span>
                        </span>
                      </div>
                      {coupon.description && (
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{coupon.description}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleCopyCode(coupon.code)} 
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Copy code"
                        type="button"
                      >
                        <FiCopy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button 
                        onClick={() => editCoupon(coupon)} 
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Edit coupon"
                        type="button"
                      >
                        <FiEdit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(coupon)} 
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete coupon"
                        type="button"
                      >
                        <FiTrash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-3">
                    {coupon.type === 'percentage' ? (
                      <FiPercent className="h-4 w-4 text-neutral-400" />
                    ) : (
                      <FiDollarSign className="h-4 w-4 text-neutral-400" />
                    )}
                    <span className="text-2xl sm:text-3xl font-bold">
                      {coupon.discount}{coupon.type === 'percentage' ? '%' : ''}
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-500">off</span>
                  </div>
                  
                  <div className="space-y-1.5 text-xs sm:text-sm">
                    {coupon.minPurchase > 0 && (
                      <p className="text-neutral-500">
                        Min. order: <span className="font-medium">${coupon.minPurchase.toLocaleString()}</span>
                      </p>
                    )}
                    {coupon.maxDiscount > 0 && (
                      <p className="text-neutral-500">
                        Max discount: <span className="font-medium">${coupon.maxDiscount.toLocaleString()}</span>
                      </p>
                    )}
                    {coupon.usageLimit && (
                      <p className="text-neutral-500">
                        Uses: {coupon.usedCount || 0} / {coupon.usageLimit}
                      </p>
                    )}
                    {coupon.validUntil && (
                      <p className="flex items-center gap-1 text-neutral-400 text-xs">
                        <FiCalendar className="h-3 w-3" />
                        {isCouponExpired(coupon.validUntil) ? 'Expired:' : 'Expires:'} {new Date(coupon.validUntil).toLocaleDateString()}
                      </p>
                    )}
                    {coupon.forNewUsers === 1 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">New users only</p>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <button 
                      onClick={() => handleToggleStatus(coupon)}
                      className="flex items-center justify-between w-full text-sm"
                      type="button"
                    >
                      <span className="text-neutral-500">Status</span>
                      <div className="flex items-center gap-2">
                        <span className={coupon.isActive === 1 ? 'text-green-600' : 'text-neutral-400'}>
                          {coupon.isActive === 1 ? 'Active' : 'Inactive'}
                        </span>
                        {coupon.isActive === 1 ? (
                          <FiToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <FiToggleLeft className="h-5 w-5 text-neutral-400" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white dark:bg-neutral-900 p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">{modalMode === 'create' ? 'Create Coupon' : 'Edit Coupon'}</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {modalMode === 'create' ? 'Add a new discount coupon' : 'Modify coupon details'}
                  </p>
                </div>
                <button 
                  onClick={() => { setShowModal(false); resetForm(); }} 
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  type="button"
                >
                  <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              
              <div className="p-4 sm:p-5 space-y-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Coupon Code *</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formCode} 
                      onChange={handleCodeChange}
                      className="flex-1 p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800 uppercase"
                      placeholder="SUMMER20"
                      maxLength={20}
                      required
                    />
                    <button 
                      type="button"
                      onClick={generateRandomCode} 
                      className="px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Only letters and numbers, no spaces</p>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <input 
                    type="text" 
                    value={formDescription} 
                    onChange={(e) => setFormDescription(e.target.value)} 
                    className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                    placeholder="e.g., Summer Sale Discount"
                  />
                </div>
                
                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Discount Type *</label>
                    <select 
                      value={formType} 
                      onChange={(e) => setFormType(e.target.value)} 
                      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Discount Value *</label>
                    <input 
                      type="number" 
                      min="0"
                      step={formType === 'percentage' ? 1 : 0.01}
                      value={formDiscount} 
                      onChange={(e) => setFormDiscount(e.target.value)} 
                      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                      placeholder="Enter discount amount"
                      required
                    />
                  </div>
                </div>
                
                {/* Min Purchase & Max Discount */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Minimum Purchase ($)</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={formMinPurchase} 
                      onChange={(e) => setFormMinPurchase(e.target.value)} 
                      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Max Discount ($)</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={formMaxDiscount} 
                      onChange={(e) => setFormMaxDiscount(e.target.value)} 
                      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                
                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Start Date *</label>
                    <input 
                      type="date" 
                      value={formValidFrom} 
                      onChange={(e) => setFormValidFrom(e.target.value)} 
                      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">End Date *</label>
                    <input 
                      type="date" 
                      value={formValidUntil} 
                      onChange={(e) => setFormValidUntil(e.target.value)} 
                      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                      required
                    />
                  </div>
                </div>
                
                {/* Usage Limit */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Usage Limit</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formUsageLimit} 
                    onChange={(e) => setFormUsageLimit(e.target.value)} 
                    className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                    placeholder="Unlimited"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Leave empty for unlimited usage</p>
                </div>
                
                {/* Options */}
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-sm font-medium">Active</span>
                    <button
                      type="button"
                      onClick={() => setFormIsActive(!formIsActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formIsActive ? 'bg-green-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formIsActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </label>
                  
                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-sm font-medium">New Users Only</span>
                    <button
                      type="button"
                      onClick={() => setFormForNewUsers(!formForNewUsers)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formForNewUsers ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formForNewUsers ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </label>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }} 
                    className="flex-1 px-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex-1 px-4 py-2.5 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                    <FiSave className="h-4 w-4" />
                    Save Coupon
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCoupons;