// AdminFAQs.jsx - FAQ management
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiX, FiSave, FiFolder } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({
    question: '', answer: '', category: 'general', order: 0, isActive: true
  });

  const categories = ['general', 'shipping', 'returns', 'payment', 'account', 'product', 'gift cards', 'technical'];

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getFaqs();
      setFaqs(response?.data?.faqs || []);
    } catch (error) {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'create') {
        await apiWrapper.createFaq(formData);
        toast.success('FAQ added');
      } else {
        await apiWrapper.updateFaq(selectedFaq._id, formData);
        toast.success('FAQ updated');
      }
      fetchFaqs();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save FAQ');
    }
  };

  const handleDelete = async (faq) => {
    if (window.confirm(`Delete FAQ "${faq.question}"?`)) {
      try {
        await apiWrapper.deleteFaq(faq._id);
        toast.success('FAQ deleted');
        fetchFaqs();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '', category: 'general', order: 0, isActive: true });
  };

  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  const FaqModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full">
        <div className="p-5 border-b flex justify-between items-center"><h2 className="text-xl font-bold">{modalMode === 'create' ? 'Add FAQ' : 'Edit FAQ'}</h2><button onClick={() => { setShowModal(false); resetForm(); }}><FiX /></button></div>
        <div className="p-5 space-y-4">
          <div><label className="block text-sm font-medium mb-1">Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-2.5 border rounded-xl">{categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1">Question *</label><input type="text" value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
          <div><label className="block text-sm font-medium mb-1">Answer *</label><textarea rows={5} value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /><span>Active</span></label>
          <button onClick={handleSave} className="w-full py-2.5 bg-primary-600 text-white rounded-xl"><FiSave className="inline mr-2" />Save FAQ</button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-neutral-200 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold">FAQ Management</h1><p className="text-sm text-neutral-500">Manage frequently asked questions</p></div><button onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl"><FiPlus />Add FAQ</button></div>

      <div className="space-y-6">
        {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
          <div key={category} className="bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden">
            <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b flex items-center gap-2"><FiFolder className="h-4 w-4 text-primary-600" /><h3 className="font-semibold capitalize">{category}</h3><span className="text-xs text-neutral-500">({categoryFaqs.length})</span></div>
            <div className="divide-y">
              {categoryFaqs.map((faq, idx) => (
                <motion.div key={faq._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}>
                  <button onClick={() => setExpandedId(expandedId === faq._id ? null : faq._id)} className="w-full p-4 text-left flex justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition group">
                    <span className="font-medium">{faq.question}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedFaq(faq); setFormData(faq); setModalMode('edit'); setShowModal(true); }} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-neutral-200"><FiEdit2 className="h-4 w-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(faq); }} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 text-red-600"><FiTrash2 className="h-4 w-4" /></button>
                      {expandedId === faq._id ? <FiChevronUp className="h-5 w-5 text-neutral-400" /> : <FiChevronDown className="h-5 w-5 text-neutral-400" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedId === faq._id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-4 pt-0 text-neutral-600 dark:text-neutral-400 border-t bg-neutral-50/30 dark:bg-neutral-800/20">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && <FaqModal />}
    </div>
  );
};

export default AdminFAQs;