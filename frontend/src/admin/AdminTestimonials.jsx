// AdminTestimonials.jsx - Complete working version
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit2, FiTrash2, FiStar, FiUser, FiCheck, 
  FiX, FiRefreshCw, FiMessageSquare, FiUpload,
  FiEye, FiEyeOff, FiSave, FiSearch, FiFilter
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { getUploadUrls } from '../utils/uploadResponseUtils';
import { toast } from 'react-hot-toast';

// ============================================
// ISOLATED FORM MODAL COMPONENT
// ============================================

const TestimonialFormModal = memo(({ 
  isOpen, 
  mode, 
  initialData, 
  onSave, 
  onCancel, 
  isSaving,
  isUploading 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    content: '',
    rating: 5,
    verified: false,
    image: ''
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [localUploading, setLocalUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          name: initialData.name || '',
          role: initialData.role || '',
          location: initialData.location || '',
          content: initialData.content || '',
          rating: initialData.rating || 5,
          verified: initialData.verified === 1 || initialData.verified === true,
          image: initialData.image || ''
        });
        setPreviewImage(initialData.image || null);
      } else {
        setFormData({
          name: '',
          role: '',
          location: '',
          content: '',
          rating: 5,
          verified: false,
          image: ''
        });
        setPreviewImage(null);
      }
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLocalUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('images', file);
      const response = await apiWrapper.uploadImages(formDataObj);
      const urls = getUploadUrls(response);
      if (!urls.length) throw new Error('No image URL returned');
      
      setFormData(prev => ({ ...prev, image: urls[0] }));
      setPreviewImage(urls[0]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setLocalUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setPreviewImage(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Testimonial content is required');
      return;
    }
    
    onSave({
      name: formData.name.trim(),
      role: formData.role.trim(),
      location: formData.location.trim(),
      content: formData.content.trim(),
      rating: formData.rating,
      verified: formData.verified ? 1 : 0,
      image: formData.image || ''
    });
  };

  const ratingOptions = [
    { value: 1, label: '1 Star' },
    { value: 2, label: '2 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 5, label: '5 Stars' }
  ];

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar 
        key={i} 
        className={`h-4 w-4 cursor-pointer transition-all ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}
        onClick={() => handleChange('rating', i + 1)}
      />
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={onCancel}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {mode === 'create' ? 'Add Testimonial' : 'Edit Testimonial'}
          </h2>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-neutral-100 transition">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Customer name"
              className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="e.g., CEO, Designer"
                className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., New York, USA"
                className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Rating</label>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-0.5">
                {renderStars(formData.rating)}
              </div>
              <select
                value={formData.rating}
                onChange={(e) => handleChange('rating', parseInt(e.target.value))}
                className="p-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
              >
                {ratingOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Testimonial Content <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="What did they say?"
              className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 resize-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Customer Image</label>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="relative">
                {previewImage ? (
                  <div className="relative group">
                    <img 
                      src={previewImage} 
                      alt="Customer" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center bg-neutral-50 dark:bg-neutral-800">
                    <FiUser className="h-6 w-6 text-neutral-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
                  <FiUpload className="h-4 w-4" />
                  {(isUploading || localUploading) ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading || localUploading}
                  />
                </label>
                <p className="text-xs text-neutral-500 mt-1">Square image, max 2MB</p>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.verified}
              onChange={(e) => handleChange('verified', e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Verified Customer (shows verified badge)</span>
          </label>

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex-1 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 transition disabled:opacity-50"
            >
              {isSaving ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  <FiSave className="inline mr-2 h-4 w-4" />
                  {mode === 'create' ? 'Add Testimonial' : 'Save Changes'}
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});
TestimonialFormModal.displayName = 'TestimonialFormModal';

// ============================================
// TESTIMONIAL CARD COMPONENT
// ============================================

const TestimonialCard = memo(({ testimonial, onEdit, onToggleVerify, onDelete }) => {
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar 
        key={i} 
        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} 
      />
    ));
  };

  const isVerified = testimonial.verified === 1 || testimonial.verified === true;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all group"
    >
      <div className="p-5 relative">
        {isVerified && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
              <FiCheck className="h-3 w-3" />
              Verified
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-3 mb-4">
          {testimonial.image ? (
            <img 
              src={testimonial.image} 
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary-500"
              onError={(e) => { e.target.src = ''; }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
              {testimonial.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">{testimonial.name}</h3>
            <div className="flex flex-wrap items-center gap-1 text-xs text-neutral-500">
              {testimonial.role && <span>{testimonial.role}</span>}
              {testimonial.role && testimonial.location && <span>•</span>}
              {testimonial.location && <span>{testimonial.location}</span>}
            </div>
          </div>
        </div>
        
        <div className="flex mb-3">
          {renderStars(testimonial.rating || 5)}
        </div>
        
        <p className="text-sm text-neutral-600 dark:text-neutral-400 italic leading-relaxed line-clamp-4">
          "{testimonial.content}"
        </p>
        
        <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={() => onEdit(testimonial)}
            className="flex-1 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
            title="Edit"
          >
            <FiEdit2 className="h-4 w-4 mx-auto text-neutral-600 dark:text-neutral-400 hover:text-primary-600" />
          </button>
          <button
            onClick={() => onToggleVerify(testimonial)}
            className="flex-1 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
            title={isVerified ? 'Unverify' : 'Verify'}
          >
            {isVerified ? 
              <FiEyeOff className="h-4 w-4 mx-auto text-neutral-600" /> : 
              <FiEye className="h-4 w-4 mx-auto text-green-600" />
            }
          </button>
          <button
            onClick={() => onDelete(testimonial)}
            className="flex-1 py-2 border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            title="Delete"
          >
            <FiTrash2 className="h-4 w-4 mx-auto text-red-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});
TestimonialCard.displayName = 'TestimonialCard';

// ============================================
// MAIN COMPONENT
// ============================================

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('all');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      // Call with adminMode=true to get all testimonials including unverified
      const response = await apiWrapper.getTestimonials(true);
      
      let testimonialsData = [];
      
      if (response?.success && Array.isArray(response?.testimonials)) {
        testimonialsData = response.testimonials;
      } else if (response?.data?.testimonials && Array.isArray(response.data.testimonials)) {
        testimonialsData = response.data.testimonials;
      } else if (response?.data && Array.isArray(response.data)) {
        testimonialsData = response.data;
      } else if (Array.isArray(response)) {
        testimonialsData = response;
      }
      
      const processedTestimonials = testimonialsData.map(t => ({
        ...t,
        rating: t.rating || 5,
        verified: t.verified !== undefined ? t.verified : 0
      }));
      
      setTestimonials(processedTestimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      let response;
      
      if (modalMode === 'create') {
        response = await apiWrapper.createTestimonial(formData);
        if (response?.success) {
          toast.success('Testimonial added successfully');
          await fetchTestimonials();
          setShowModal(false);
          setSelectedTestimonial(null);
        } else {
          throw new Error(response?.message || 'Failed to create testimonial');
        }
      } else {
        response = await apiWrapper.updateTestimonial(selectedTestimonial._id, formData);
        if (response?.success) {
          toast.success('Testimonial updated successfully');
          await fetchTestimonials();
          setShowModal(false);
          setSelectedTestimonial(null);
        } else {
          throw new Error(response?.message || 'Failed to update testimonial');
        }
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error(error?.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testimonial) => {
    if (window.confirm(`Delete testimonial from "${testimonial.name}"? This cannot be undone.`)) {
      try {
        const response = await apiWrapper.deleteTestimonial(testimonial._id);
        if (response?.success) {
          toast.success('Testimonial deleted successfully');
          await fetchTestimonials();
        } else {
          throw new Error(response?.message || 'Failed to delete testimonial');
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error(error?.message || 'Failed to delete testimonial');
      }
    }
  };

  const handleToggleVerify = async (testimonial) => {
    const newVerifiedValue = testimonial.verified === 1 ? 0 : 1;
    
    try {
      const response = await apiWrapper.updateTestimonial(testimonial._id, { verified: newVerifiedValue });
      if (response?.success) {
        toast.success(`Testimonial ${newVerifiedValue === 1 ? 'verified' : 'unverified'}`);
        await fetchTestimonials();
      } else {
        throw new Error(response?.message || 'Failed to update verification');
      }
    } catch (error) {
      console.error('Error updating verification:', error);
      toast.error(error?.message || 'Failed to update verification');
    }
  };

  const openEditModal = useCallback((testimonial) => {
    setSelectedTestimonial(testimonial);
    setModalMode('edit');
    setShowModal(true);
  }, []);

  const openCreateModal = useCallback(() => {
    setSelectedTestimonial(null);
    setModalMode('create');
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedTestimonial(null);
  }, []);

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(t => {
      const matchesSearch = searchTerm === '' ||
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.role?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const isVerified = t.verified === 1;
      const matchesVerified = verifiedFilter === 'all' ||
        (verifiedFilter === 'verified' && isVerified) ||
        (verifiedFilter === 'unverified' && !isVerified);
      
      return matchesSearch && matchesVerified;
    });
  }, [testimonials, searchTerm, verifiedFilter]);

  const stats = useMemo(() => {
    const verifiedCount = testimonials.filter(t => t.verified === 1).length;
    const unverifiedCount = testimonials.filter(t => t.verified === 0 || t.verified === false).length;
    const avgRating = testimonials.length ? 
      (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1) : 0;
    
    return {
      total: testimonials.length,
      verified: verifiedCount,
      unverified: unverifiedCount,
      avgRating: avgRating
    };
  }, [testimonials]);

  if (loading) return <TestimonialsSkeleton />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Testimonials Management
            </h1>
            <p className="text-sm text-neutral-500 mt-1">Manage customer reviews and testimonials</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all active:scale-95"
          >
            <FiPlus className="h-4 w-4" />
            Add Testimonial
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'text-primary-600' },
            { label: 'Verified', value: stats.verified, color: 'text-green-600' },
            { label: 'Pending Review', value: stats.unverified, color: 'text-yellow-600' },
            { label: 'Avg Rating', value: `${stats.avgRating}★`, color: 'text-amber-600' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
              <p className="text-[10px] sm:text-xs text-neutral-500">{stat.label}</p>
              <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, role, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="pl-10 pr-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
            <button onClick={fetchTestimonials} className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 transition-all">
              <FiRefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {filteredTestimonials.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-xl border p-8 text-center">
            <FiMessageSquare className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
            <h3 className="text-lg font-semibold mb-1">No Testimonials Found</h3>
            <p className="text-sm text-neutral-500">
              {searchTerm || verifiedFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Click "Add Testimonial" to create your first testimonial'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filteredTestimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                  onEdit={openEditModal}
                  onToggleVerify={handleToggleVerify}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <TestimonialFormModal
        isOpen={showModal}
        mode={modalMode}
        initialData={selectedTestimonial}
        onSave={handleSave}
        onCancel={closeModal}
        isSaving={saving}
        isUploading={uploading}
      />
    </>
  );
};

const TestimonialsSkeleton = () => (
  <div className="space-y-4 sm:space-y-6 animate-pulse">
    <div className="flex justify-between">
      <div className="h-8 w-40 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      ))}
    </div>
    <div className="h-14 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      ))}
    </div>
  </div>
);

export default AdminTestimonials;