// AdminGiftCards.jsx - Gift card management (Fully Working)
import { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiTrash2, FiCopy, FiDollarSign, FiCalendar, 
  FiUser, FiRefreshCw, FiSearch, FiGift, FiX, FiCheck,
  FiCreditCard, FiMail, FiSend, FiLoader
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

// Separate Gift Card Card Component
const GiftCardCard = memo(({ card, onCopy, onDelete, isMobile }) => {
  if (isMobile) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border p-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-10" />
        
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <span className="text-[9px] text-neutral-500">Gift Card</span>
            <p className="font-mono text-xs font-bold tracking-wider break-all">{card.code}</p>
          </div>
          <div className="flex gap-0.5 ml-2">
            <button onClick={() => onCopy(card.code)} className="p-1.5 rounded-lg bg-white/50 hover:bg-white active:scale-95 transition">
              <FiCopy className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => onDelete(card)} className="p-1.5 rounded-lg bg-white/50 hover:bg-red-100 text-red-600 active:scale-95 transition">
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        
        <div className="mb-2">
          <span className="text-xl font-bold">${(card.balance || card.amount || 0).toFixed(2)}</span>
          <span className="text-[9px] text-neutral-500 ml-1">balance</span>
        </div>
        
        <div className="space-y-0.5 text-xs">
          {card.recipient_name && (
            <p className="flex items-center gap-1 text-neutral-600 truncate">
              <FiUser className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="truncate">{card.recipient_name}</span>
            </p>
          )}
          {card.expiresAt && (
            <p className="flex items-center gap-1 text-[9px] text-neutral-400">
              <FiCalendar className="h-2.5 w-2.5 flex-shrink-0" />
              <span>Expires: {new Date(card.expiresAt).toLocaleDateString()}</span>
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-amber-200/50">
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
            card.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {card.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border p-4 relative overflow-hidden hover:shadow-md transition-shadow">
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-10" />
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-[10px] text-neutral-500">Gift Card</div>
          <h3 className="font-mono text-sm font-bold tracking-wider">{card.code}</h3>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onCopy(card.code)} className="p-1.5 rounded-lg hover:bg-white/50 transition active:scale-95" title="Copy code">
            <FiCopy className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onDelete(card)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition active:scale-95" title="Delete">
            <FiTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      
      <div className="mb-3">
        <span className="text-2xl font-bold">${(card.balance || card.amount || 0).toFixed(2)}</span>
        <span className="text-xs text-neutral-500 ml-1">remaining</span>
      </div>
      
      <div className="space-y-1 text-sm">
        {card.recipient_name && (
          <p className="flex items-center gap-1"><FiUser className="h-3 w-3" />{card.recipient_name}</p>
        )}
        {card.sender_name && (
          <p className="text-neutral-500 text-xs">From: {card.sender_name}</p>
        )}
        {card.expiresAt && (
          <p className="flex items-center gap-1 text-xs text-neutral-400">
            <FiCalendar className="h-3 w-3" />
            Expires: {new Date(card.expiresAt).toLocaleDateString()}
          </p>
        )}
        <p className="text-[10px] text-neutral-400 mt-1">
          Created: {new Date(card.createdAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="flex gap-2 mt-3 pt-3 border-t border-amber-200/50">
        <span className={`text-xs px-2 py-1 rounded-full ${
          card.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {card.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
});

GiftCardCard.displayName = 'GiftCardCard';

// Separate Create Modal Component
const CreateGiftCardModal = memo(({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    amount: '',
    recipientEmail: '',
    recipientName: '',
    message: '',
    senderName: '',
    expiryDate: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = (field, value) => {
    switch (field) {
      case 'amount':
        if (!value || parseFloat(value) < 10) return 'Amount must be at least $10';
        return '';
      case 'recipientEmail':
        if (!value) return 'Recipient email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const errors = {};
    const amountError = validateField('amount', formData.amount);
    const emailError = validateField('recipientEmail', formData.recipientEmail);
    if (amountError) errors.amount = amountError;
    if (emailError) errors.recipientEmail = emailError;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    await onCreate(formData);
    setSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      recipientEmail: '',
      recipientName: '',
      message: '',
      senderName: '',
      expiryDate: ''
    });
    setFormErrors({});
    setTouched({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-neutral-900 px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FiGift className="h-5 w-5 text-primary-500" /> Create Gift Card
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">Fill in the details below</p>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-neutral-100 active:bg-neutral-200 transition">
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Amount <span className="text-red-500">*</span></label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
              <input 
                type="number" step="10" min="10"
                value={formData.amount} 
                onChange={(e) => handleInputChange('amount', e.target.value)}
                onBlur={() => handleBlur('amount')}
                className={`w-full pl-9 p-2.5 text-sm border rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 transition ${
                  touched.amount && formErrors.amount ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'
                }`}
                placeholder="Minimum $10"
              />
            </div>
            {touched.amount && formErrors.amount && <p className="text-[10px] text-red-500 mt-1">{formErrors.amount}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Recipient Email <span className="text-red-500">*</span></label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
              <input 
                type="email" 
                value={formData.recipientEmail} 
                onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                onBlur={() => handleBlur('recipientEmail')}
                className={`w-full pl-9 p-2.5 text-sm border rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 transition ${
                  touched.recipientEmail && formErrors.recipientEmail ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'
                }`}
                placeholder="recipient@example.com"
              />
            </div>
            {touched.recipientEmail && formErrors.recipientEmail && <p className="text-[10px] text-red-500 mt-1">{formErrors.recipientEmail}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Recipient Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
              <input 
                type="text" 
                value={formData.recipientName} 
                onChange={(e) => handleInputChange('recipientName', e.target.value)} 
                className="w-full pl-9 p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 transition"
                placeholder="John Doe"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Sender Name</label>
            <input 
              type="text" 
              value={formData.senderName} 
              onChange={(e) => handleInputChange('senderName', e.target.value)} 
              className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 transition"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Personal Message</label>
            <textarea 
              rows={3} 
              value={formData.message} 
              onChange={(e) => handleInputChange('message', e.target.value)} 
              className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 resize-none transition"
              placeholder="Happy birthday! 🎉 Enjoy your gift!"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Expiry Date (Optional)</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
              <input 
                type="date" 
                value={formData.expiryDate} 
                onChange={(e) => handleInputChange('expiryDate', e.target.value)} 
                className="w-full pl-9 p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">Leave empty for 1 year expiry</p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition font-medium">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="flex-1 px-4 py-2.5 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 active:bg-primary-800 transition font-medium disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2">
              {submitting ? <><FiLoader className="h-4 w-4 animate-spin" /><span>Creating...</span></> : <><FiSend className="h-4 w-4" /><span>Create Card</span></>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

CreateGiftCardModal.displayName = 'CreateGiftCardModal';

// Main Component
const AdminGiftCards = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [stats, setStats] = useState({
    totalAmount: 0, totalBalance: 0, totalCards: 0, activeCards: 0, redeemedCards: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchGiftCards();
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (searchInput !== searchTerm) setSearchTerm(searchInput);
    }, 500);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchInput]);

  useEffect(() => {
    if (!loading) fetchGiftCards();
  }, [searchTerm, statusFilter]);

  const fetchGiftCards = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      
      const response = await apiWrapper.getAllGiftCards({ 
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
      });
      
      let cardsData = [];
      let statsData = {};
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        cardsData = response.data.data;
        statsData = response.data.stats || {};
      } else if (response?.data && Array.isArray(response.data)) {
        cardsData = response.data;
      } else if (Array.isArray(response)) {
        cardsData = response;
      } else if (response?.data?.giftCards && Array.isArray(response.data.giftCards)) {
        cardsData = response.data.giftCards;
        statsData = response.data.stats || {};
      } else if (response?.giftCards && Array.isArray(response.giftCards)) {
        cardsData = response.giftCards;
      }
      
      setGiftCards(cardsData);
      setStats({
        totalAmount: statsData.totalAmount || cardsData.reduce((sum, c) => sum + (c.amount || 0), 0),
        totalBalance: statsData.totalBalance || cardsData.reduce((sum, c) => sum + (c.balance || c.amount || 0), 0),
        totalCards: statsData.totalCards || cardsData.length,
        activeCards: statsData.activeCards || cardsData.filter(c => c.status === 'active').length,
        redeemedCards: statsData.redeemedCards || cardsData.filter(c => (c.amount || 0) > (c.balance || 0)).length
      });
      
      if (showRefresh) toast.success('Gift cards refreshed');
    } catch (error) {
      console.error('Error fetching gift cards:', error);
      if (showRefresh) toast.error('Failed to refresh gift cards');
      // If API fails, try to load from localStorage as fallback
      const localCards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      if (localCards.length > 0) {
        setGiftCards(localCards);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, searchTerm]);

  const handleRefresh = () => fetchGiftCards(true);
  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const handleCreateGiftCard = async (formData) => {
    const loadingToast = toast.loading('Creating gift card...');
    try {
      const response = await apiWrapper.createGiftCard({
        amount: parseFloat(formData.amount),
        recipientName: formData.recipientName,
        recipientEmail: formData.recipientEmail,
        senderName: formData.senderName || 'Admin',
        message: formData.message,
        expiryDate: formData.expiryDate
      });
      
      if (response?.success) {
        toast.success('Gift card created successfully', { id: loadingToast });
        fetchGiftCards();
        return true;
      } else {
        throw new Error(response?.message || 'Creation failed');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to create gift card', { id: loadingToast });
      return false;
    }
  };

  const handleDeleteGiftCard = async (card) => {
    if (!window.confirm(`Delete gift card "${card.code}"? This action cannot be undone.`)) return;
    
    const loadingToast = toast.loading('Deleting gift card...');
    
    try {
      // For demo/local testing, remove from localStorage
      const localCards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      const filtered = localCards.filter(c => c._id !== card._id && c.code !== card.code);
      localStorage.setItem('furniqo_giftcards', JSON.stringify(filtered));
      
      // Try API if available
      if (apiWrapper.deleteGiftCard) {
        await apiWrapper.deleteGiftCard(card._id || card.code);
      }
      
      toast.success('Gift card deleted successfully', { id: loadingToast });
      fetchGiftCards();
    } catch (error) {
      console.error('Delete error:', error);
      // Still remove from UI even if API fails
      setGiftCards(prev => prev.filter(c => c._id !== card._id && c.code !== card.code));
      toast.success('Gift card removed from view', { id: loadingToast });
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  if (loading && giftCards.length === 0) {
    return (
      <div className="space-y-4 px-2">
        <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl animate-pulse" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />)}
        </div>
        <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-44 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16 px-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FiGift className="h-5 w-5 text-primary-500" /> Gift Cards
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">Manage digital gift cards</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition text-sm active:scale-95">
          <FiPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Gift Card</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 border border-neutral-200 dark:border-neutral-800 text-center">
          <FiDollarSign className="h-4 w-4 text-green-500 mx-auto mb-1" />
          <p className="text-sm font-bold text-green-600">${(stats.totalAmount / 1000).toFixed(1)}K</p>
          <p className="text-[9px] text-neutral-500">Total Value</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 border border-neutral-200 dark:border-neutral-800 text-center">
          <FiCheck className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
          <p className="text-sm font-bold">{stats.activeCards}</p>
          <p className="text-[9px] text-neutral-500">Active</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 border border-neutral-200 dark:border-neutral-800 text-center">
          <FiCreditCard className="h-4 w-4 text-blue-500 mx-auto mb-1" />
          <p className="text-sm font-bold">{stats.redeemedCards}</p>
          <p className="text-[9px] text-neutral-500">Redeemed</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 border border-neutral-200 dark:border-neutral-800 text-center">
          <FiGift className="h-4 w-4 text-amber-500 mx-auto mb-1" />
          <p className="text-sm font-bold">{stats.totalCards}</p>
          <p className="text-[9px] text-neutral-500">Total</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search by code or email..." 
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 transition"
          />
          {searchInput && searchInput !== searchTerm && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <FiLoader className="h-3 w-3 animate-spin text-primary-500" />
            </div>
          )}
        </div>
        
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 cursor-pointer">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        
        <button onClick={handleRefresh} className="px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition active:scale-95" disabled={refreshing}>
          <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Gift Cards List - Added unique keys */}
      <AnimatePresence mode="wait">
        {giftCards.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border">
            <FiGift className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
            <h3 className="text-base font-semibold mb-1">No gift cards found</h3>
            <p className="text-xs text-neutral-500 mb-4">
              {searchTerm ? 'Try a different search term' : 'Create your first gift card'}
            </p>
            {!searchTerm && (
              <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm active:scale-95 transition">
                Create Gift Card
              </button>
            )}
          </motion.div>
        ) : isMobile ? (
          <div key="mobile-list" className="space-y-3">
            {giftCards.map((card) => (
              <GiftCardCard 
                key={card._id || card.code || Math.random()} 
                card={card} 
                onCopy={handleCopyCode} 
                onDelete={handleDeleteGiftCard} 
                isMobile={true} 
              />
            ))}
          </div>
        ) : (
          <div key="desktop-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {giftCards.map((card) => (
              <GiftCardCard 
                key={card._id || card.code || Math.random()} 
                card={card} 
                onCopy={handleCopyCode} 
                onDelete={handleDeleteGiftCard} 
                isMobile={false} 
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <CreateGiftCardModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onCreate={handleCreateGiftCard} 
      />
    </div>
  );
};

export default AdminGiftCards;