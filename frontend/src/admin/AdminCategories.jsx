// AdminCategories.jsx - Category management with drag & drop (FIXED)
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiImage, FiX, FiSave, FiMenu } from 'react-icons/fi';
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
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ 
                ...formData, 
                name: e.target.value, 
                slug: e.target.value.toLowerCase().replace(/\s+/g, '-') 
              })} 
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input 
              type="text" 
              value={formData.slug} 
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800/50"
            />
            <p className="text-xs text-neutral-500 mt-1">URL-friendly version of the name</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              rows={3} 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category Image</label>
            <div className="flex gap-3 items-center">
              {formData.image && (
                <div className="relative group">
                  <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover border" />
                  <button 
                    onClick={() => setFormData({ ...formData, image: '' })} 
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                </div>
              )}
              <label className={`flex-1 px-4 py-2 border border-dashed rounded-xl text-center cursor-pointer hover:border-primary-500 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? 'Uploading...' : formData.image ? 'Change Image' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
              <span className="text-sm">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4" />
              <span className="text-sm">Featured</span>
            </label>
          </div>
          <button onClick={handleSave} className="w-full py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition flex items-center justify-center gap-2">
            <FiSave className="h-4 w-4" />
            Save Category
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Category Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Organize your product categories</p>
        </div>
        <button 
          onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }} 
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition shadow-sm"
        >
          <FiPlus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500">Total Categories</p>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{categories.filter(c => c.isActive).length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500">Featured</p>
          <p className="text-2xl font-bold text-amber-600">{categories.filter(c => c.isFeatured).length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500">With Images</p>
          <p className="text-2xl font-bold">{categories.filter(c => c.image).length}</p>
        </div>
      </div>

      {/* Categories Grid with Drag & Drop */}
      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <FiFolder className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">No Categories Yet</h3>
          <p className="text-sm text-neutral-500 mb-4">Create your first category to organize products</p>
          <button 
            onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }} 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Create Category
          </button>
        </div>
      ) : (
        <Reorder.Group axis="y" values={categories} onReorder={handleReorder} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <Reorder.Item 
              key={cat._id} 
              value={cat} 
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 cursor-move hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="cursor-grab active:cursor-grabbing">
                  <FiMenu className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition" />
                </div>
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center">
                    <FiFolder className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 dark:text-white truncate">{cat.name}</h3>
                  <p className="text-xs text-neutral-500 truncate">{cat.slug}</p>
                  <div className="flex gap-2 mt-1">
                    {cat.isFeatured && (
                      <span className="inline-block text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                        Featured
                      </span>
                    )}
                    {!cat.isActive && (
                      <span className="inline-block text-[10px] px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setSelectedCategory(cat); setFormData(cat); setModalMode('edit'); setShowModal(true); }} 
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    title="Edit Category"
                  >
                    <FiEdit2 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat)} 
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                    title="Delete Category"
                  >
                    <FiTrash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {showModal && <CategoryModal />}
    </div>
  );
};

export default AdminCategories;