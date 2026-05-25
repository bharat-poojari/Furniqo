// AdminCategories.jsx - Category management (Premium Mobile Design)
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiX, FiSave, FiSearch, FiRefreshCw, FiGrid, FiList, FiUpload, FiChevronRight, FiPackage, FiImage as FiImageIcon } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import MediaLibraryPicker from '../components/common/MediaLibraryPicker';
import { getUploadUrl } from '../utils/uploadResponseUtils';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', image: '', icon: '', itemCount: 0
  });

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getCategories();
      
      let categoriesData = [];
      
      if (response?.success && response?.categories && Array.isArray(response.categories)) {
        categoriesData = response.categories;
      } else if (response?.data?.categories && Array.isArray(response.data.categories)) {
        categoriesData = response.data.categories;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      }
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(error?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const baseWithoutApi = apiUrl.replace('/api/v1', '');
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseWithoutApi}${cleanPath}`;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    
    setUploadingImage(true);
    const loadingToast = toast.loading('Uploading image...');
    
    try {
      const formDataImg = new FormData();
      formDataImg.append('image', file);
      const response = await apiWrapper.uploadImage(formDataImg);
      const imageUrl = getUploadUrl(response);
      
      if (!imageUrl) throw new Error('Image upload returned no URL');
      
      setFormData(prev => ({ ...prev, image: imageUrl }));
      toast.success('Image uploaded successfully', { id: loadingToast });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed: ' + (error?.message || 'Unknown error'), { id: loadingToast });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    const saveData = {
      name: formData.name.trim(),
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description || '',
      image: formData.image || '',
      icon: formData.icon || '',
      itemCount: formData.itemCount || 0
    };
    
    try {
      setSaving(true);
      const loadingToast = toast.loading(modalMode === 'create' ? 'Creating category...' : 'Updating category...');
      
      let response;
      if (modalMode === 'create') {
        response = await apiWrapper.createCategory(saveData);
      } else {
        response = await apiWrapper.updateCategory(selectedCategory._id, saveData);
      }
      
      if (response && response.success === true) {
        toast.success(modalMode === 'create' ? 'Category created successfully' : 'Category updated successfully', { id: loadingToast });
        await fetchCategories();
        setShowModal(false);
        resetForm();
      } else {
        throw new Error(response?.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save category';
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Delete "${category.name}"? Products in this category will be uncategorized.`)) {
      try {
        setLoading(true);
        const response = await apiWrapper.deleteCategory(category._id);
        
        if (response && response.success === true) {
          toast.success('Category deleted successfully');
          await fetchCategories();
        } else {
          throw new Error(response?.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error?.message || 'Failed to delete category');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      slug: '', 
      description: '', 
      image: '', 
      icon: '', 
      itemCount: 0 
    });
    setSelectedCategory(null);
  };

  const editCategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
      icon: category.icon || '',
      itemCount: category.itemCount || 0
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const createNewCategory = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const filteredCategories = categories.filter(cat => 
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mobile Grid Card - Premium Grid Layout
  const MobileGridCard = ({ cat, onEdit, onDelete }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        {/* Image Area */}
        <div className="relative aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-900/50">
          {cat.image ? (
            <img 
              src={getImageUrl(cat.image)} 
              alt={cat.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/400x400/eee/999?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <FiFolder className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
              <span className="text-xs text-neutral-400 mt-2">No image</span>
            </div>
          )}
          
          {/* Product Count Badge */}
          {cat.itemCount > 0 && (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
              <span className="text-[10px] font-medium text-white flex items-center gap-1">
                <FiPackage className="h-2.5 w-2.5" />
                {cat.itemCount}
              </span>
            </div>
          )}
        </div>
        
        {/* Content Area */}
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1 text-center">{cat.name}</h3>
          <p className="text-[10px] text-neutral-400 text-center mt-0.5 truncate">/{cat.slug}</p>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button 
              onClick={() => onEdit(cat)} 
              className="flex-1 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 transition-all text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <FiEdit2 className="h-3.5 w-3.5" />
              Edit
            </button>
            <button 
              onClick={() => onDelete(cat)} 
              className="flex-1 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all text-xs font-medium text-red-600 dark:text-red-400 flex items-center justify-center gap-1.5"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Mobile List Card - Premium List Layout
  const MobileListCard = ({ cat, onEdit, onDelete }) => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="flex items-center p-3 gap-3">
          {/* Image */}
          <div className="flex-shrink-0">
            {cat.image ? (
              <img 
                src={getImageUrl(cat.image)} 
                alt={cat.name} 
                className="w-14 h-14 rounded-xl object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/100x100/eee/999?text=No+Image';
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center">
                <FiFolder className="h-7 w-7 text-neutral-400" />
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-sm line-clamp-1">{cat.name}</h3>
                <p className="text-[10px] text-neutral-400 truncate mt-0.5">/{cat.slug}</p>
                {cat.itemCount > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <FiPackage className="h-3 w-3 text-neutral-400" />
                    <span className="text-[10px] text-neutral-500">{cat.itemCount} products</span>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-1">
                <button 
                  onClick={() => onEdit(cat)} 
                  className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all"
                  title="Edit"
                >
                  <FiEdit2 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                </button>
                <button 
                  onClick={() => onDelete(cat)} 
                  className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all"
                  title="Delete"
                >
                  <FiTrash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Description (if exists) */}
        {cat.description && (
          <div className="px-3 pb-3 pt-0 border-t border-neutral-100 dark:border-neutral-800 mt-1">
            <p className="text-[11px] text-neutral-500 line-clamp-2">{cat.description}</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  // Desktop Grid Card
  const DesktopGridCard = ({ cat, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {cat.image ? (
            <img 
              src={getImageUrl(cat.image)} 
              alt={cat.name} 
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/100x100/eee/999?text=No+Image';
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center flex-shrink-0">
              <FiFolder className="h-7 w-7 text-primary-600 dark:text-primary-400" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-base truncate">{cat.name}</h3>
                <p className="text-xs text-neutral-500 truncate mt-0.5">/{cat.slug}</p>
              </div>
              <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(cat)} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" title="Edit">
                  <FiEdit2 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                </button>
                <button onClick={() => onDelete(cat)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" title="Delete">
                  <FiTrash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
            {cat.itemCount > 0 && (
              <span className="inline-block text-[10px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-2">
                {cat.itemCount} {cat.itemCount === 1 ? 'product' : 'products'}
              </span>
            )}
          </div>
        </div>
        
        {cat.description && (
          <p className="text-xs text-neutral-500 mt-3 line-clamp-2 ml-[68px]">
            {cat.description}
          </p>
        )}
      </div>
    </div>
  );

  // Desktop List Item
  const DesktopListItem = ({ cat, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center gap-3">
        {cat.image ? (
          <img 
            src={getImageUrl(cat.image)} 
            alt={cat.name} 
            className="w-10 h-10 rounded-lg object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/100x100/eee/999?text=No+Image';
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center">
            <FiFolder className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-sm">{cat.name}</h3>
            {cat.itemCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                {cat.itemCount} products
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500">/{cat.slug}</p>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(cat)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" title="Edit">
            <FiEdit2 className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
          </button>
          <button onClick={() => onDelete(cat)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" title="Delete">
            <FiTrash2 className="h-3.5 w-3.5 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Categories</h1>
            <p className="text-xs text-neutral-500 mt-0.5">{categories.length} total categories</p>
          </div>
          <button 
            onClick={createNewCategory} 
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm active:scale-95"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Search and View Controls */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 bg-white"
            />
          </div>
          
          <div className="flex gap-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600' : 'text-neutral-500'}`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600' : 'text-neutral-500'}`}
            >
              <FiList className="h-4 w-4" />
            </button>
            <button 
              onClick={fetchCategories} 
              className="p-2 rounded-lg transition-all text-neutral-500 active:scale-95"
              disabled={loading}
            >
              <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Cards - Horizontal Scroll on Mobile */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 sm:grid sm:grid-cols-3 sm:overflow-visible">
          <div className="flex-1 min-w-[100px] bg-white dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{categories.length}</span>
              <FiFolder className="h-5 w-5 text-primary-500" />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Total Categories</p>
          </div>
          <div className="flex-1 min-w-[100px] bg-white dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{categories.filter(c => c.image).length}</span>
              <FiImageIcon className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-xs text-neutral-500 mt-1">With Images</p>
          </div>
          <div className="flex-1 min-w-[100px] bg-white dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{categories.reduce((sum, c) => sum + (c.itemCount || 0), 0)}</span>
              <FiPackage className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Total Products</p>
          </div>
        </div>

        {/* Categories List */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="w-20 h-20 mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <FiFolder className="h-10 w-10 text-neutral-400" />
            </div>
            <h3 className="text-base font-semibold mb-1">
              {searchTerm ? 'No matching categories' : 'No Categories Yet'}
            </h3>
            <p className="text-xs text-neutral-500 mb-4 px-4">
              {searchTerm ? 'Try a different search term' : 'Create your first category to organize products'}
            </p>
            {!searchTerm && (
              <button 
                onClick={createNewCategory} 
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium active:scale-95 transition-transform shadow-sm"
              >
                Create Category
              </button>
            )}
          </div>
        ) : isMobile ? (
          // Mobile view - Different layouts for grid and list
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredCategories.map((cat) => (
                <MobileGridCard 
                  key={cat._id} 
                  cat={cat} 
                  onEdit={editCategory}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCategories.map((cat) => (
                <MobileListCard 
                  key={cat._id} 
                  cat={cat} 
                  onEdit={editCategory}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )
        ) : viewMode === 'grid' ? (
          // Desktop grid view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => (
              <DesktopGridCard 
                key={cat._id} 
                cat={cat} 
                onEdit={editCategory}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          // Desktop list view
          <div className="space-y-2">
            {filteredCategories.map((cat) => (
              <DesktopListItem 
                key={cat._id} 
                cat={cat} 
                onEdit={editCategory}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Category Modal - Mobile Optimized Bottom Sheet Style */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white dark:bg-neutral-900 px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">{modalMode === 'create' ? 'Add Category' : 'Edit Category'}</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Fill in the details below</p>
                  </div>
                  <button 
                    onClick={() => { setShowModal(false); resetForm(); }} 
                    className="p-2 -mr-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData({ 
                        ...formData, 
                        name: newName, 
                        slug: generateSlug(newName) 
                      });
                    }} 
                    className="w-full p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Living Room"
                    autoFocus
                  />
                </div>
                
                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Slug</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.slug} 
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                      className="flex-1 p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 focus:ring-2 focus:ring-primary-500"
                      placeholder="url-friendly-slug"
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, slug: generateSlug(formData.name) })}
                      className="px-4 py-2 border rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
                    >
                      <FiRefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">URL-friendly version of the name</p>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea 
                    rows={3} 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    className="w-full p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                    placeholder="Category description"
                  />
                </div>
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category Image</label>
                  <div className="flex flex-wrap gap-3 items-start">
                    {formData.image && (
                      <div className="relative group">
                        <img 
                          src={getImageUrl(formData.image)} 
                          alt="Preview" 
                          className="w-20 h-20 rounded-xl object-cover border"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/100x100/eee/999?text=Invalid';
                          }}
                        />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })} 
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600 active:opacity-100"
                        >
                          <FiX className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <label className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm border-2 border-dashed rounded-xl cursor-pointer hover:border-primary-500 transition ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent" />
                          <span className="text-xs">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FiUpload className="h-4 w-4" />
                          <span>{formData.image ? 'Change Image' : 'Upload Image'}</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                    </label>
                  </div>
                  
                  <MediaLibraryPicker
                    selected={formData.image}
                    onSelect={(url) => setFormData(prev => ({ ...prev, image: url }))}
                    multiple={false}
                    buttonText="Choose from media library"
                    label="category image"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1.5">Recommended: 400x400px, Max 5MB</p>
                </div>
                
                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Icon (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.icon} 
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })} 
                    className="w-full p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                    placeholder="Icon name or emoji"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 pb-2">
                  <button 
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }} 
                    className="flex-1 px-4 py-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex-1 px-4 py-3 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 active:bg-primary-800 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 font-medium"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="h-4 w-4" />
                        <span>Save Category</span>
                      </>
                    )}
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

export default AdminCategories;