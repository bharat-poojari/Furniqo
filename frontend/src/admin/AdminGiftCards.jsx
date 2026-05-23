// AdminGiftCards.jsx - Gift card management
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlus, FiEye, FiTrash2, FiCopy, FiDollarSign, FiCalendar, 
  FiUser, FiCheckCircle, FiXCircle, FiRefreshCw, FiSearch,
  FiGift, FiMail, FiDownload, FiX
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminGiftCards = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0, recipientEmail: '', recipientName: '', message: '', 
    senderName: '', expiryDate: '', isActive: true
  });

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getAllGiftCards();
      setGiftCards(response?.data?.giftCards || []);
    } catch (error) {
      toast.error('Failed to load gift cards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGiftCard = async () => {
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    try {
      const response = await apiWrapper.createGiftCard(formData);
      toast.success('Gift card created successfully');
      setShowModal(false);
      fetchGiftCards();
      resetForm();
    } catch (error) {
      toast.error('Failed to create gift card');
    }
  };

  const handleDeleteGiftCard = async (card) => {
    if (window.confirm(`Delete gift card "${card.code}"?`)) {
      try {
        await apiWrapper.deleteGiftCard(card._id);
        toast.success('Gift card deleted');
        fetchGiftCards();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleToggleStatus = async (card) => {
    try {
      await apiWrapper.updateGiftCard(card._id, { isActive: !card.isActive });
      toast.success(`Gift card ${!card.isActive ? 'activated' : 'deactivated'}`);
      fetchGiftCards();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const resetForm = () => {
    setFormData({
      amount: 0, recipientEmail: '', recipientName: '', message: '', 
      senderName: '', expiryDate: '', isActive: true
    });
  };

  const filteredCards = useMemo(() => {
    return giftCards.filter(card => {
      const matchesSearch = searchTerm === '' || 
        card.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.recipientEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' ? card.isActive : !card.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [giftCards, searchTerm, statusFilter]);

  const totalValue = giftCards.reduce((sum, card) => sum + (card.remainingBalance || card.amount), 0);
  const activeCards = giftCards.filter(c => c.isActive).length;
  const redeemedCards = giftCards.filter(c => c.usedCount > 0).length;

  const CreateModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2"><FiGift /> Create Gift Card</h2>
          <button onClick={() => { setShowModal(false); resetForm(); }}><FiX /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount *</label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} className="w-full pl-10 p-2.5 border rounded-xl" placeholder="0.00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Name</label>
              <input type="text" value={formData.recipientName} onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })} className="w-full p-2.5 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Email</label>
              <input type="email" value={formData.recipientEmail} onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })} className="w-full p-2.5 border rounded-xl" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sender Name</label>
            <input type="text" value={formData.senderName} onChange={(e) => setFormData({ ...formData, senderName: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Personal Message</label>
            <textarea rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full p-2.5 border rounded-xl" placeholder="Happy birthday! 🎉" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date (Optional)</label>
            <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>
          <button onClick={handleCreateGiftCard} className="w-full py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700">Create Gift Card</button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <GiftCardsSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Gift Cards</h1><p className="text-sm text-neutral-500">Manage digital gift cards</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl"><FiPlus />Create Gift Card</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border"><p className="text-sm text-neutral-500">Total Value</p><p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p></div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border"><p className="text-sm text-neutral-500">Active Cards</p><p className="text-2xl font-bold">{activeCards}</p></div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border"><p className="text-sm text-neutral-500">Redeemed</p><p className="text-2xl font-bold">{redeemedCards}</p></div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border"><p className="text-sm text-neutral-500">Total Cards</p><p className="text-2xl font-bold">{giftCards.length}</p></div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" placeholder="Search by code or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-xl" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border rounded-xl">
          <option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
        <button onClick={fetchGiftCards} className="px-4 py-2.5 border rounded-xl"><FiRefreshCw /></button>
      </div>

      {/* Gift Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCards.map((card, idx) => (
          <motion.div key={card._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-10" />
            <div className="flex justify-between items-start mb-3">
              <div><div className="text-xs text-neutral-500 mb-1">Gift Card</div><h3 className="font-mono text-lg font-bold">{card.code}</h3></div>
              <div className="flex gap-1"><button onClick={() => handleCopyCode(card.code)} className="p-1.5 rounded-lg hover:bg-white/50"><FiCopy className="h-4 w-4" /></button><button onClick={() => handleDeleteGiftCard(card)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"><FiTrash2 /></button></div>
            </div>
            <div className="mb-3"><span className="text-3xl font-bold">${(card.remainingBalance || card.amount).toFixed(2)}</span><span className="text-sm text-neutral-500 ml-1">remaining</span></div>
            <div className="space-y-1 text-sm">
              {card.recipientName && <p className="flex items-center gap-1"><FiUser className="h-3 w-3" />To: {card.recipientName}</p>}
              {card.senderName && <p className="text-neutral-500">From: {card.senderName}</p>}
              {card.expiryDate && <p className="flex items-center gap-1 text-xs"><FiCalendar />Expires: {new Date(card.expiryDate).toLocaleDateString()}</p>}
              <p className="text-xs text-neutral-400">Created: {new Date(card.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t">
              <span className={`text-xs px-2 py-1 rounded-full ${card.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{card.isActive ? 'Active' : 'Inactive'}</span>
              {card.usedCount > 0 && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Used {card.usedCount} time(s)</span>}
              <button onClick={() => handleToggleStatus(card)} className="text-xs px-2 py-1 border rounded-full hover:bg-white/50">{card.isActive ? 'Deactivate' : 'Activate'}</button>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && <CreateModal />}
    </div>
  );
};

const GiftCardsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 w-48 bg-neutral-200 rounded" />
    <div className="grid grid-cols-4 gap-4"><div className="h-24 bg-neutral-200 rounded-xl" /></div>
    <div className="h-12 bg-neutral-200 rounded-xl" />
    <div className="grid grid-cols-3 gap-5"><div className="h-48 bg-neutral-200 rounded-xl" /></div>
  </div>
);

export default AdminGiftCards;