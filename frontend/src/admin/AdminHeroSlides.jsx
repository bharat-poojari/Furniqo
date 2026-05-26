// AdminHeroSlides.jsx - Complete working version
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  FiPlus, FiEdit2, FiTrash2, FiImage, FiEye, FiEyeOff, FiMenu, FiX, FiSave, FiLoader
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { API_BASE_URL } from '../utils/constants';
import { getUploadUrl } from '../utils/uploadResponseUtils';
import toast from 'react-hot-toast';

// Slide Modal Component
const SlideModal = ({ isOpen, onClose, slide, onSave, mode }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    cta_text: '',
    cta_link: '',
    text_color: 'light',
    sort_order: 0,
    is_active: true
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && slide) {
      setFormData({
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        image: slide.image || '',
        cta_text: slide.cta_text || '',
        cta_link: slide.cta_link || '',
        text_color: slide.text_color || 'light',
        sort_order: slide.sort_order || 0,
        is_active: slide.is_active === 1
      });
    } else if (isOpen && !slide) {
      setFormData({
        title: '',
        subtitle: '',
        image: '',
        cta_text: '',
        cta_link: '',
        text_color: 'light',
        sort_order: 0,
        is_active: true
      });
    }
  }, [isOpen, slide]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
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
    
    setUploading(true);
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
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.image) newErrors.image = 'Image is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setSaving(true);
    const submitData = {
      title: formData.title.trim(),
      subtitle: formData.subtitle || null,
      image: formData.image,
      cta_text: formData.cta_text || null,
      cta_link: formData.cta_link || null,
      text_color: formData.text_color,
      sort_order: formData.sort_order,
      is_active: formData.is_active ? 1 : 0
    };
    
    try {
      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const baseWithoutApi = API_BASE_URL.replace('/api/v1', '');
    return `${baseWithoutApi}${imagePath}`;
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full max-h-[95vh] overflow-y-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-3 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{mode === 'create' ? 'Add Hero Slide' : 'Edit Slide'}</h2>
            <p className="text-xs text-neutral-500 hidden sm:block">
              {mode === 'create' ? 'Create a new hero slide for the homepage' : 'Modify existing slide details'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 sm:p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => handleChange('title', e.target.value)} 
              className={`w-full p-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800 ${
                errors.title ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'
              }`}
              placeholder="Main headline"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Subtitle</label>
            <input 
              type="text" 
              value={formData.subtitle} 
              onChange={(e) => handleChange('subtitle', e.target.value)} 
              className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
              placeholder="Supporting text"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Button Text</label>
              <input 
                type="text" 
                value={formData.cta_text} 
                onChange={(e) => handleChange('cta_text', e.target.value)} 
                className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                placeholder="Shop Now"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Button Link</label>
              <input 
                type="text" 
                value={formData.cta_link} 
                onChange={(e) => handleChange('cta_link', e.target.value)} 
                className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
                placeholder="/products or https://..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Text Color</label>
            <select 
              value={formData.text_color} 
              onChange={(e) => handleChange('text_color', e.target.value)} 
              className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
            >
              <option value="light">Light (white text)</option>
              <option value="dark">Dark (black text)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Slide Image <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-3 items-start">
              {formData.image && (
                <div className="relative group">
                  <img 
                    src={getImageUrl(formData.image)} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x400/eee/999?text=Invalid+Image';
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => handleChange('image', '')} 
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                </div>
              )}
              <label className={`flex-1 px-4 py-2 border-2 border-dashed rounded-xl text-center cursor-pointer hover:border-primary-500 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <FiLoader className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                ) : (
                  <span className="text-sm">{formData.image ? 'Change Image' : 'Upload Image'}</span>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  disabled={uploading} 
                />
              </label>
            </div>
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
            <p className="text-xs text-neutral-500 mt-2">Recommended size: 1920x1080px (16:9 ratio). Max 5MB.</p>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input 
              type="checkbox" 
              checked={formData.is_active} 
              onChange={(e) => handleChange('is_active', e.target.checked)} 
              className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">Active (visible on homepage)</span>
          </label>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Display Order</label>
            <input 
              type="number" 
              min="0"
              value={formData.sort_order} 
              onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)} 
              className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800"
            />
            <p className="text-xs text-neutral-500 mt-1">Lower numbers appear first</p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 px-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <FiLoader className="h-4 w-4 animate-spin" />}
              <FiSave className="h-4 w-4" />
              {mode === 'create' ? 'Create Slide' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

// Slide Card Component
const SlideCard = ({ slide, index, onToggle, onEdit, onDelete }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const baseWithoutApi = API_BASE_URL.replace('/api/v1', '');
    return `${baseWithoutApi}${imagePath}`;
  };

  return (
    <Reorder.Item 
      value={slide} 
      className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 sm:p-4 cursor-move hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="cursor-grab active:cursor-grabbing">
          <FiMenu className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition" />
        </div>
        
        {slide.image ? (
          <img 
            src={getImageUrl(slide.image)} 
            alt={slide.title} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x400/eee/999?text=No+Image';
            }}
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center">
            <FiImage className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 dark:text-primary-400" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base truncate">
            {slide.title || 'Untitled Slide'}
          </h3>
          {slide.subtitle && (
            <p className="text-xs sm:text-sm text-neutral-500 truncate">{slide.subtitle}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {slide.cta_text && (
              <span className="text-[10px] sm:text-xs px-1.5 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                Btn: {slide.cta_text}
              </span>
            )}
            <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${
              slide.is_active === 1 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
            }`}>
              {slide.is_active === 1 ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onToggle(slide)} 
            className="p-1.5 sm:p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={slide.is_active === 1 ? 'Deactivate' : 'Activate'}
          >
            {slide.is_active === 1 ? 
              <FiEye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" /> : 
              <FiEyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-500" />
            }
          </button>
          <button 
            onClick={() => onEdit(slide)} 
            className="p-1.5 sm:p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Edit Slide"
          >
            <FiEdit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button 
            onClick={() => onDelete(slide)} 
            className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            title="Delete Slide"
          >
            <FiTrash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
};

// Main Component
const AdminHeroSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getAllHeroSlides();
      
      console.log('Fetch slides response:', response);
      
      let slidesData = [];
      if (response?.slides && Array.isArray(response.slides)) {
        slidesData = response.slides;
      } else if (response?.data && Array.isArray(response.data)) {
        slidesData = response.data;
      } else if (Array.isArray(response)) {
        slidesData = response;
      }
      
      setSlides(slidesData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (submitData) => {
    try {
      if (modalMode === 'create') {
        await apiWrapper.createHeroSlide(submitData);
        toast.success('Slide created successfully');
      } else {
        await apiWrapper.updateHeroSlide(selectedSlide.id, submitData);
        toast.success('Slide updated successfully');
      }
      await fetchSlides();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save slide');
      throw error;
    }
  };

  const handleDelete = async (slide) => {
    if (window.confirm(`Delete slide "${slide.title || 'Untitled'}"? This action cannot be undone.`)) {
      try {
        await apiWrapper.deleteHeroSlide(slide.id);
        toast.success('Slide deleted successfully');
        await fetchSlides();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error?.response?.data?.message || error?.message || 'Failed to delete slide');
      }
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      await apiWrapper.toggleHeroSlideStatus(slide.id);
      toast.success(`Slide ${slide.is_active ? 'deactivated' : 'activated'} successfully`);
      await fetchSlides();
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update slide status');
    }
  };

  const handleReorder = async (newOrder) => {
    setSlides(newOrder);
    setReordering(true);
    try {
      const orders = newOrder.map((slide, index) => ({
        id: slide.id,
        sort_order: index
      }));
      // Call reorder API if available
      if (apiWrapper.reorderHeroSlides) {
        await apiWrapper.reorderHeroSlides(orders);
      }
      toast.success('Order updated');
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Failed to save order');
      await fetchSlides();
    } finally {
      setReordering(false);
    }
  };

  const handleEdit = (slide) => {
    setSelectedSlide(slide);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSlide(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const stats = useMemo(() => ({
    total: slides.length,
    active: slides.filter(s => s.is_active === 1).length,
    inactive: slides.filter(s => s.is_active === 0).length
  }), [slides]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Hero Slides Management</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Manage homepage hero carousel slides (drag to reorder)</p>
        </div>
        <button 
          onClick={handleCreate} 
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm"
        >
          <FiPlus className="h-4 w-4" />
          Add Slide
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <p className="text-[10px] sm:text-sm text-neutral-500">Total Slides</p>
          <p className="text-lg sm:text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <p className="text-[10px] sm:text-sm text-neutral-500">Active</p>
          <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-2.5 sm:p-4 border border-neutral-200 dark:border-neutral-800">
          <p className="text-[10px] sm:text-sm text-neutral-500">Inactive</p>
          <p className="text-lg sm:text-2xl font-bold text-neutral-400">{stats.inactive}</p>
        </div>
      </div>

      {/* Slides List */}
      {slides.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <FiImage className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-neutral-400 mb-2" />
          <h3 className="text-base font-semibold mb-1">No Slides Yet</h3>
          <p className="text-xs sm:text-sm text-neutral-500 mb-3">Create your first hero slide for the homepage</p>
          <button 
            onClick={handleCreate} 
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
          >
            Create Slide
          </button>
        </div>
      ) : (
        <>
          {reordering && (
            <div className="text-center text-xs sm:text-sm text-primary-600 py-2">
              <FiLoader className="h-3 w-3 sm:h-4 sm:w-4 inline animate-spin mr-1" />
              Saving order...
            </div>
          )}
          <Reorder.Group axis="y" values={slides} onReorder={handleReorder} className="space-y-2 sm:space-y-3">
            {slides.map((slide, index) => (
              <SlideCard
                key={slide.id}
                slide={slide}
                index={index}
                onToggle={handleToggleActive}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Reorder.Group>
        </>
      )}

      {/* Modal */}
      <SlideModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        slide={selectedSlide}
        onSave={handleSave}
        mode={modalMode}
      />
    </div>
  );
};

export default AdminHeroSlides;