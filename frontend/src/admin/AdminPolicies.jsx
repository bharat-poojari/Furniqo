// AdminPolicies.jsx - Policies management (COMPACT MOBILE OPTIMIZED)
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSave, FiEdit2, FiEye, FiX, FiFileText, FiCheckCircle, 
  FiAlertCircle, FiPlus, FiTrash2, FiBookOpen, FiShield,
  FiTruck, FiRefreshCw, FiChevronRight, FiChevronDown,
  FiInfo, FiClock, FiArrowLeft
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

// Memoized Compact Policy Card Component
const PolicyCard = memo(({ policy, policyContent, onEdit }) => {
  const Icon = policy.icon;
  const hasContent = !!policyContent && policyContent.sections?.length > 0;
  const sectionCount = policyContent?.sections?.length || 0;
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Main Card Content */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          {/* Icon and Title Section */}
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${policy.color} shadow-md flex-shrink-0`}>
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-1.5">
                <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white truncate">
                  {policy.title}
                </h3>
                {hasContent ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-[9px] sm:text-[10px] font-medium flex-shrink-0">
                    <FiCheckCircle className="h-2 w-2" />
                    {sectionCount}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md text-[9px] sm:text-[10px] font-medium flex-shrink-0">
                    <FiAlertCircle className="h-2 w-2" />
                    Draft
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 line-clamp-1">
                {policy.description}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(policy, policyContent)} 
              className="flex items-center gap-1 px-2.5 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm text-xs font-medium"
            >
              <FiEdit2 className="h-3 w-3" />
              <span className="hidden xs:inline">Edit</span>
            </motion.button>
            {hasContent && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <FiChevronDown className={`h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Expandable Preview Section */}
        <AnimatePresence>
          {isExpanded && hasContent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="space-y-2">
                  {/* First Section Preview */}
                  {policyContent.sections[0] && (
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-2.5">
                      <h4 className="text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-1 truncate">
                        {policyContent.sections[0]?.title || policyContent.sections[0]?.heading}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                        {(policyContent.sections[0]?.content || '').substring(0, 80)}...
                      </p>
                    </div>
                  )}
                  
                  {/* Additional Sections Count */}
                  {policyContent.sections.length > 1 && (
                    <div className="flex items-center gap-1 text-[10px] text-primary-600 dark:text-primary-400">
                      <FiChevronRight className="h-2.5 w-2.5" />
                      <span>{policyContent.sections.length - 1} more section{policyContent.sections.length - 1 !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  
                  {/* Last Updated Info */}
                  {policyContent.lastUpdated && (
                    <div className="flex items-center gap-1 text-[9px] text-neutral-400 mt-1">
                      <FiClock className="h-2.5 w-2.5" />
                      <span>Updated: {new Date(policyContent.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

PolicyCard.displayName = 'PolicyCard';

// Compact Section Item Component
const SectionItem = memo(({ section, index, onDelete }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="bg-white dark:bg-neutral-900 rounded-lg p-3 border border-neutral-200 dark:border-neutral-700"
  >
    <div className="flex justify-between items-start gap-2">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-neutral-900 dark:text-white truncate pr-2">
          {section.title}
        </h4>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2 whitespace-pre-wrap">
          {section.content}
        </p>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(index)}
        className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex-shrink-0"
        aria-label="Delete section"
      >
        <FiTrash2 className="h-3.5 w-3.5" />
      </motion.button>
    </div>
  </motion.div>
));

SectionItem.displayName = 'SectionItem';

const AdminPolicies = () => {
  const [policies, setPolicies] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({ 
    type: '', 
    title: '', 
    sections: [] 
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [newSection, setNewSection] = useState({ title: '', content: '' });

  const policyTypes = useMemo(() => [
    { type: 'privacy', title: 'Privacy Policy', icon: FiShield, color: 'from-blue-500 to-cyan-500', description: 'Data collection & protection' },
    { type: 'terms', title: 'Terms of Service', icon: FiBookOpen, color: 'from-purple-500 to-pink-500', description: 'Legal terms for website use' },
    { type: 'shipping', title: 'Shipping Policy', icon: FiTruck, color: 'from-green-500 to-emerald-500', description: 'Delivery & shipping info' },
    { type: 'returns', title: 'Return Policy', icon: FiRefreshCw, color: 'from-orange-500 to-red-500', description: 'Returns & refunds' }
  ], []);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getPolicies();
      
      let policiesData = {};
      
      if (response?.success && response?.policies) {
        policiesData = response.policies;
      } else if (response?.policies) {
        policiesData = response.policies;
      } else if (typeof response === 'object') {
        policiesData = response;
      }
      
      const transformedPolicies = {};
      for (const [type, policy] of Object.entries(policiesData)) {
        if (policy) {
          let sections = [];
          if (Array.isArray(policy.sections)) {
            sections = policy.sections.map(section => ({
              title: section.title || section.heading || '',
              content: section.content || ''
            }));
          }
          
          transformedPolicies[type] = {
            title: policy.title || '',
            sections: sections,
            lastUpdated: policy.lastUpdated || policy.updatedAt
          };
        }
      }
      
      setPolicies(transformedPolicies);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast.error('Failed to load policies');
    } finally {
      setLoading(false);
    }
  }, []);

  const validateSections = useCallback((sections) => {
    if (!sections || sections.length === 0) {
      return { valid: false, message: 'Please add at least one section' };
    }
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (!section.title || !section.title.trim()) {
        return { valid: false, message: `Section ${i + 1} needs a title` };
      }
      if (!section.content || !section.content.trim()) {
        return { valid: false, message: `"${section.title}" needs content` };
      }
    }
    
    return { valid: true, message: '' };
  }, []);

  const handleSave = useCallback(async () => {
    if (!formData.title || !formData.title.trim()) {
      toast.error('Please enter a policy title');
      return;
    }
    
    const sectionsValidation = validateSections(formData.sections);
    if (!sectionsValidation.valid) {
      toast.error(sectionsValidation.message);
      return;
    }

    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const policyData = {
        title: formData.title.trim(),
        lastUpdated: today,
        sections: formData.sections.map(s => ({ 
          title: s.title.trim(), 
          content: s.content.trim() 
        }))
      };
      
      const response = await apiWrapper.updatePolicy(formData.type, policyData);
      
      if (response?.success) {
        toast.success(`${formData.title} saved!`);
        setEditingPolicy(null);
        setPreviewMode(false);
        await fetchPolicies();
      } else {
        throw new Error(response?.message || 'Failed to save policy');
      }
    } catch (error) {
      console.error('Error saving policy:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save policy');
    } finally {
      setSaving(false);
    }
  }, [formData, fetchPolicies, validateSections]);

  const handleDeleteSection = useCallback((index) => {
    setFormData(prev => ({ 
      ...prev, 
      sections: prev.sections.filter((_, i) => i !== index) 
    }));
  }, []);

  const handleAddSection = useCallback(() => {
    if (!newSection.title || !newSection.title.trim()) {
      toast.error('Please enter a section title');
      return;
    }
    if (!newSection.content || !newSection.content.trim()) {
      toast.error('Please enter section content');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { 
        title: newSection.title.trim(), 
        content: newSection.content.trim() 
      }]
    }));
    setNewSection({ title: '', content: '' });
    toast.success('Section added');
  }, [newSection]);

  const handleEditClick = useCallback((policy, existingContent) => {
    setEditingPolicy(policy.type);
    
    let sections = [];
    if (existingContent?.sections && Array.isArray(existingContent.sections)) {
      sections = existingContent.sections.map(s => ({
        title: s.title || s.heading || '',
        content: s.content || ''
      }));
    }
    
    setFormData({ 
      type: policy.type, 
      title: existingContent?.title || policy.title, 
      sections: sections 
    });
    setPreviewMode(false);
    setNewSection({ title: '', content: '' });
  }, []);

  const getPolicyContent = useCallback((type) => policies[type] || null, [policies]);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-1" />
          <div className="h-3 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent truncate">
            Policies
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 truncate">
            Manage legal & store policies
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={fetchPolicies}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-xs font-medium"
        >
          <FiRefreshCw className="h-3 w-3" />
          <span className="hidden xs:inline">Refresh</span>
        </motion.button>
      </div>

      {/* Policy Cards Grid */}
      <div className="space-y-2.5">
        {policyTypes.map((policy) => {
          const policyContent = getPolicyContent(policy.type);
          return (
            <PolicyCard 
              key={policy.type}
              policy={policy}
              policyContent={policyContent}
              onEdit={handleEditClick}
            />
          );
        })}
      </div>

      {/* Editor Modal - Compact Mobile First */}
      <AnimatePresence>
        {editingPolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm" onClick={() => setEditingPolicy(null)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white dark:bg-neutral-900 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPreviewMode(false)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
                  >
                    <FiArrowLeft className="h-4 w-4" />
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {previewMode ? 'Preview' : 'Edit'} Policy
                    </h2>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {policyTypes.find(p => p.type === editingPolicy)?.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPreviewMode(!previewMode)} 
                    className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <FiEye className="h-3.5 w-3.5" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingPolicy(null)} 
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <FiX className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {previewMode ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950/30 dark:to-purple-950/30 rounded-lg p-4">
                      <h1 className="text-base font-bold text-neutral-900 dark:text-white">{formData.title}</h1>
                    </div>
                    {formData.sections && formData.sections.map((section, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 pb-1 border-b border-neutral-200 dark:border-neutral-700">
                          {section.title}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Title Input */}
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Policy Title <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.title} 
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                        className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="e.g., Privacy Policy"
                      />
                    </div>

                    {/* Sections */}
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Policy Sections <span className="text-red-500">*</span>
                      </label>
                      
                      <div className="space-y-2 mb-3">
                        {(!formData.sections || formData.sections.length === 0) ? (
                          <div className="text-center py-6 text-neutral-400 bg-neutral-50 dark:bg-neutral-800/30 rounded-lg">
                            <FiFileText className="h-8 w-8 mx-auto mb-1 opacity-50" />
                            <p className="text-xs">No sections yet</p>
                          </div>
                        ) : (
                          <AnimatePresence>
                            {formData.sections.map((section, idx) => (
                              <SectionItem 
                                key={idx} 
                                section={section} 
                                index={idx} 
                                onDelete={handleDeleteSection} 
                              />
                            ))}
                          </AnimatePresence>
                        )}
                      </div>

                      {/* Add Section Form */}
                      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
                        <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">Add Section</p>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Section title"
                            value={newSection.title}
                            onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          />
                          <textarea
                            rows={2}
                            placeholder="Section content"
                            value={newSection.content}
                            onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
                          />
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddSection}
                            className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-1.5 text-sm font-medium"
                          >
                            <FiPlus className="h-3.5 w-3.5" />
                            Add Section
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Modal Footer */}
              {!previewMode && (
                <div className="sticky bottom-0 bg-white dark:bg-neutral-900 px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditingPolicy(null)} 
                    className="flex-1 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-sm font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex-1 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all flex items-center justify-center gap-1.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <FiSave className="h-3.5 w-3.5" />
                        Save
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPolicies;