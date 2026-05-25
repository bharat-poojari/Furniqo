// AdminPolicies.jsx - Policies management
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiEdit2, FiEye, FiX, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({ type: '', content: '', title: '' });
  const [previewMode, setPreviewMode] = useState(false);

  const policyTypes = [
    { type: 'privacy', title: 'Privacy Policy', icon: FiFileText, description: 'How customer data is collected and protected' },
    { type: 'terms', title: 'Terms of Service', icon: FiFileText, description: 'Legal terms for using the website' },
    { type: 'shipping', title: 'Shipping Policy', icon: FiFileText, description: 'Shipping methods, costs, and delivery times' },
    { type: 'returns', title: 'Return & Refund Policy', icon: FiFileText, description: 'Return conditions and refund process' },
    { type: 'cancellation', title: 'Cancellation Policy', icon: FiFileText, description: 'Order cancellation terms' }
  ];

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getAllPolicies();
      const policiesData = response?.data || response?.policies || response?.data?.policies || [];
      setPolicies(Array.isArray(policiesData) ? policiesData : []);
    } catch (error) {
      toast.error('Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await apiWrapper.updatePolicy(formData.type, { content: formData.content, title: formData.title });
      toast.success(`${formData.title} updated successfully`);
      setEditingPolicy(null);
      fetchPolicies();
    } catch (error) {
      toast.error('Failed to save policy');
    }
  };

  const getPolicyContent = (type) => {
    const policy = policies.find(p => p.type === type);
    return policy?.content || '';
  };

  const getPolicyTitle = (type) => {
    const policy = policies.find(p => p.type === type);
    return policy?.title || policyTypes.find(pt => pt.type === type)?.title || '';
  };

  const PolicyEditor = () => {
    const policyInfo = policyTypes.find(pt => pt.type === editingPolicy);
    if (!policyInfo) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-neutral-900 p-5 border-b flex justify-between items-center">
            <div className="flex items-center gap-2"><div className="p-2 bg-primary-100 rounded-lg"><policyInfo.icon className="h-5 w-5 text-primary-600" /></div><h2 className="text-xl font-bold">Edit {policyInfo.title}</h2></div>
            <div className="flex gap-2"><button onClick={() => setPreviewMode(!previewMode)} className="px-3 py-1.5 border rounded-lg text-sm flex items-center gap-1"><FiEye />{previewMode ? 'Edit' : 'Preview'}</button><button onClick={() => setEditingPolicy(null)} className="p-1 rounded-lg hover:bg-neutral-100"><FiX /></button></div>
          </div>
          <div className="p-6">
            {previewMode ? (
              <div className="prose max-w-none">
                <h1 className="text-2xl font-bold mb-4">{formData.title || policyInfo.title}</h1>
                <div className="whitespace-pre-wrap">{formData.content || 'No content yet.'}</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Policy Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
                <div><label className="block text-sm font-medium mb-1">Policy Content</label><textarea rows={15} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full p-2.5 border rounded-xl font-mono text-sm" placeholder="Write your policy content here..." /></div>
                <div className="flex gap-3 pt-4"><button onClick={handleSave} className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center justify-center gap-2"><FiSave />Save Policy</button><button onClick={() => setEditingPolicy(null)} className="flex-1 py-2.5 border rounded-xl hover:bg-neutral-50">Cancel</button></div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-neutral-200 rounded" />
      <div className="grid gap-4"><div className="h-40 bg-neutral-200 rounded-xl" /></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Policies Management</h1><p className="text-sm text-neutral-500">Manage legal and store policies</p></div>

      <div className="grid gap-5">
        {policyTypes.map((policy, idx) => {
          const hasContent = getPolicyContent(policy.type);
          const Icon = policy.icon;
          return (
            <motion.div key={policy.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden">
              <div className="p-5 flex items-start justify-between">
                <div className="flex gap-4"><div className="p-3 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-950/30 dark:to-primary-900/30"><Icon className="h-6 w-6 text-primary-600" /></div><div><h3 className="text-lg font-semibold">{policy.title}</h3><p className="text-sm text-neutral-500 mt-1">{policy.description}</p><div className="flex items-center gap-2 mt-2">{hasContent ? <span className="text-xs text-green-600 flex items-center gap-1"><FiCheckCircle className="h-3 w-3" />Last updated: {new Date(hasContent.updatedAt).toLocaleDateString()}</span> : <span className="text-xs text-yellow-600 flex items-center gap-1"><FiAlertCircle className="h-3 w-3" />Not yet added</span>}</div></div></div>
                <button onClick={() => { setEditingPolicy(policy.type); setFormData({ type: policy.type, title: getPolicyTitle(policy.type) || policy.title, content: getPolicyContent(policy.type) || '' }); }} className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-neutral-50"><FiEdit2 />Edit</button>
              </div>
              {hasContent && (
                <div className="px-5 pb-4">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg">
                    {hasContent.content?.substring(0, 150)}...
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {editingPolicy && <PolicyEditor />}
    </div>
  );
};

export default AdminPolicies;