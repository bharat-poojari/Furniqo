// AdminCategories.jsx - Category management with drag & drop
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiImage, FiX, FiSave, FiDragHandle } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', image: '', order: 0, isActive: true, isFeatured: false
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getCategories();
      setCategories(response?.data?.categories || []);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiWrapper.uploadImage(formData);
      setFormData(prev => ({ ...prev, image: response.data.url }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'create') {
        await apiWrapper.createCategory(formData);
        toast.success('Category created');
      } else {
        await apiWrapper.updateCategory(selectedCategory._id, formData);
        toast.success('Category updated');
      }
      fetchCategories();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Delete "${category.name}"? Products in this category will be uncategorized.`)) {
      try {
        await apiWrapper.deleteCategory(category._id);
        toast.success('Category deleted');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const handleReorder = async (newOrder) => {
    setCategories(newOrder);
    // Optional: API call to save order
    // await apiWrapper.reorderCategories(newOrder.map((cat, idx) => ({ id: cat._id, order: idx })));
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', image: '', order: 0, isActive: true, isFeatured: false });
  };

  const CategoryModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{modalMode === 'create' ? 'Add Category' : 'Edit Category'}</h2>
          <button onClick={() => { setShowModal(false); resetForm(); }}><FiX className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full p-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full p-2.5 border rounded-xl bg-neutral-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category Image</label>
            <div className="flex gap-3 items-center">
              {formData.image && <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />}
              <label className="flex-1 px-4 py-2 border rounded-xl text-center cursor-pointer hover:bg-neutral-50">
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /><span>Active</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} /><span>Featured</span></label>
          </div>
          <button onClick={handleSave} className="w-full py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700"><FiSave className="inline mr-2" />Save Category</button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-neutral-200 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Category Management</h1><p className="text-sm text-neutral-500">Organize your product categories</p></div>
        <button onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl"><FiPlus />Add Category</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Reorder.Group axis="y" values={categories} onReorder={handleReorder} className="space-y-3">
          {categories.map((cat, idx) => (
            <Reorder.Item key={cat._id} value={cat} className="bg-white dark:bg-neutral-900 rounded-xl border p-4 cursor-move">
              <div className="flex items-center gap-4">
                <FiDragHandle className="text-neutral-400 cursor-grab" />
                {cat.image ? <img src={cat.image} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center"><FiFolder className="h-6 w-6 text-primary-600" /></div>}
                <div className="flex-1">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-xs text-neutral-500">{cat.slug}</p>
                  {cat.isFeatured && <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">Featured</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedCategory(cat); setFormData(cat); setModalMode('edit'); setShowModal(true); }} className="p-2 rounded-lg hover:bg-neutral-100"><FiEdit2 className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(cat)} className="p-2 rounded-lg hover:bg-red-100 text-red-600"><FiTrash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      {showModal && <CategoryModal />}
    </div>
  );
};

export default AdminCategories;