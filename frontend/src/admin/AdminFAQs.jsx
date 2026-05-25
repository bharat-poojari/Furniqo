// AdminFAQs.jsx - FAQ management (FULLY FIXED)
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, 
  FiX, FiSave, FiFolder, FiSearch, FiRefreshCw, FiFilter,
  FiLoader
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';

const AdminFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Form state
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('general');
  const [formSortOrder, setFormSortOrder] = useState(0);

  const categories = ['general', 'shipping', 'returns', 'payment', 'account', 'product', 'gift cards', 'technical'];

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getFAQs();
      
      console.log('FAQs response:', response);
      
      // Handle different response formats
      let faqsData = [];
      
      // Backend returns: { success: true, faqs: [...] }
      if (response?.faqs && Array.isArray(response.faqs)) {
        faqsData = response.faqs;
      } 
      // Handle wrapper response: { success: true, data: [...] }
      else if (response?.data && Array.isArray(response.data)) {
        faqsData = response.data;
      }
      // Handle direct array
      else if (Array.isArray(response)) {
        faqsData = response;
      }
      // Handle response with data.faqs
      else if (response?.data?.faqs && Array.isArray(response.data.faqs)) {
        faqsData = response.data.faqs;
      }
      
      // Ensure each FAQ has an id field
      faqsData = faqsData.map(faq => ({
        ...faq,
        id: faq.id || faq._id
      }));
      
      // Sort by sortOrder
      faqsData.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setFaqs(faqsData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formQuestion.trim()) {
      toast.error('Question is required');
      return;
    }
    
    if (!formAnswer.trim()) {
      toast.error('Answer is required');
      return;
    }

    // Use correct field names for backend
    const submitData = {
      question: formQuestion.trim(),
      answer: formAnswer.trim(),
      category: formCategory,
      sortOrder: formSortOrder
    };

    console.log('Submitting FAQ data:', submitData);

    try {
      setSaving(true);
      
      let response;
      if (modalMode === 'create') {
        response = await apiWrapper.createFaq(submitData);
        console.log('Create response:', response);
        
        if (response?.success === true) {
          toast.success('FAQ added successfully');
          await fetchFaqs();
          resetForm();
          setShowModal(false);
        } else {
          throw new Error(response?.message || 'Failed to create FAQ');
        }
      } else {
        // Make sure we have a valid ID
        const faqId = selectedFaq?.id;
        if (!faqId) {
          toast.error('Invalid FAQ ID');
          return;
        }
        response = await apiWrapper.updateFaq(faqId, submitData);
        console.log('Update response:', response);
        
        if (response?.success === true) {
          toast.success('FAQ updated successfully');
          await fetchFaqs();
          resetForm();
          setShowModal(false);
        } else {
          throw new Error(response?.message || 'Failed to update FAQ');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (faq) => {
    const faqId = faq?.id;
    if (!faqId) {
      toast.error('Invalid FAQ ID');
      return;
    }
    
    if (window.confirm(`Delete FAQ "${faq.question?.substring(0, 50)}..."? This action cannot be undone.`)) {
      try {
        const response = await apiWrapper.deleteFaq(faqId);
        console.log('Delete response:', response);
        
        if (response?.success === true) {
          toast.success('FAQ deleted successfully');
          await fetchFaqs();
          if (expandedId === faqId) setExpandedId(null);
        } else {
          throw new Error(response?.message || 'Failed to delete FAQ');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error?.response?.data?.message || error?.message || 'Failed to delete FAQ');
      }
    }
  };

  const resetForm = () => {
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('general');
    setFormSortOrder(0);
    setSelectedFaq(null);
  };

  const editFaq = (faq) => {
    const faqId = faq?.id;
    if (!faqId) {
      toast.error('Invalid FAQ data');
      return;
    }
    
    setSelectedFaq(faq);
    setFormQuestion(faq.question || '');
    setFormAnswer(faq.answer || '');
    setFormCategory(faq.category || 'general');
    setFormSortOrder(faq.sortOrder || 0);
    setModalMode('edit');
    setShowModal(true);
  };

  const createNewFaq = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const toggleExpand = (faqId) => {
    setExpandedId(expandedId === faqId ? null : faqId);
  };

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    let filtered = [...faqs];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question?.toLowerCase().includes(term) ||
        faq.answer?.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }
    
    return filtered;
  }, [faqs, searchTerm, selectedCategory]);

  // Group FAQs by category
  const groupedFaqs = useMemo(() => {
    const grouped = {};
    filteredFaqs.forEach(faq => {
      const category = faq.category || 'general';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(faq);
    });
    return grouped;
  }, [filteredFaqs]);

  const stats = useMemo(() => ({
    total: faqs.length,
    categories: new Set(faqs.map(f => f.category).filter(Boolean)).size,
  }), [faqs]);

  if (loading && faqs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">FAQ Management</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Manage frequently asked questions</p>
        </div>
        <button 
          onClick={createNewFaq} 
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors text-sm shadow-sm"
        >
          <FiPlus className="h-4 w-4" />
          Add FAQ
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">Total FAQs</p>
            <FiFolder className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <p className="text-xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-3 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">Categories</p>
            <FiFilter className="h-3.5 w-3.5 text-primary-500" />
          </div>
          <p className="text-xl font-bold mt-1">{stats.categories}</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
          <input 
            type="text" 
            placeholder="Search FAQs..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)} 
            className="flex-1 px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          
          <button 
            onClick={fetchFaqs} 
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            disabled={loading}
          >
            <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* FAQs List */}
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <FiFolder className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-neutral-400 mb-3" />
          <h3 className="text-base font-semibold mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No matching FAQs' : 'No FAQs Yet'}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter' 
              : 'Add your first FAQ to help customers'}
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <button 
              onClick={createNewFaq} 
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
            >
              Add FAQ
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <div key={category} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              {/* Category Header */}
              <div className="px-3 sm:px-4 py-2 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiFolder className="h-3.5 w-3.5 text-primary-600" />
                  <h3 className="font-semibold capitalize text-sm">{category}</h3>
                  <span className="text-xs text-neutral-500 bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded-full">
                    {categoryFaqs.length}
                  </span>
                </div>
              </div>
              
              {/* FAQ Items */}
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {categoryFaqs.map((faq, idx) => {
                  const faqId = faq.id;
                  const isExpanded = expandedId === faqId;
                  
                  return (
                    <motion.div
                      key={faqId || idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <div className="p-3 sm:p-4">
                        {/* Question row */}
                        <div className="flex items-start justify-between gap-2">
                          <div 
                            onClick={() => toggleExpand(faqId)}
                            className="flex-1 cursor-pointer hover:text-primary-600 transition-colors"
                          >
                            <span className="font-medium text-sm break-words">
                              {faq.question}
                            </span>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <button
                              onClick={() => editFaq(faq)} 
                              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                              title="Edit"
                            >
                              <FiEdit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(faq)} 
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                              title="Delete"
                            >
                              <FiTrash2 className="h-3.5 w-3.5 text-red-500" />
                            </button>
                            <button
                              onClick={() => toggleExpand(faqId)}
                              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                            >
                              {isExpanded ? (
                                <FiChevronUp className="h-4 w-4 text-neutral-400" />
                              ) : (
                                <FiChevronDown className="h-4 w-4 text-neutral-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Answer - Expandable */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-3 mt-2 text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                  {faq.answer}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white dark:bg-neutral-900 p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-lg font-bold">{modalMode === 'create' ? 'Add FAQ' : 'Edit FAQ'}</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {modalMode === 'create' ? 'Add a new frequently asked question' : 'Modify FAQ details'}
                  </p>
                </div>
                <button 
                  onClick={() => { setShowModal(false); resetForm(); }} 
                  className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category</label>
                  <select 
                    value={formCategory} 
                    onChange={(e) => setFormCategory(e.target.value)} 
                    className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Question */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Question *</label>
                  <input 
                    type="text" 
                    value={formQuestion} 
                    onChange={(e) => setFormQuestion(e.target.value)} 
                    className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                    placeholder="e.g., How long does shipping take?"
                  />
                </div>
                
                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Answer *</label>
                  <textarea 
                    rows={4} 
                    value={formAnswer} 
                    onChange={(e) => setFormAnswer(e.target.value)} 
                    className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                    placeholder="Write a detailed answer..."
                  />
                </div>
                
                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Sort Order</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formSortOrder} 
                    onChange={(e) => setFormSortOrder(parseInt(e.target.value) || 0)} 
                    className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Lower numbers appear first</p>
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
                    {saving && <FiLoader className="h-4 w-4 animate-spin" />}
                    <FiSave className="h-4 w-4" />
                    Save
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

export default AdminFAQs;