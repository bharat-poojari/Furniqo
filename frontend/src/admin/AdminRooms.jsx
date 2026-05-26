// AdminRooms.jsx - Room management for admin panel
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit2, FiTrash2, FiImage, FiUsers, FiMaximize, 
  FiWifi, FiCoffee, FiTv, FiWind, FiX, FiSave, FiEye, 
  FiDollarSign, FiHome, FiStar, FiChevronLeft, FiChevronRight,
  FiMapPin, FiClock, FiCheckCircle, FiAlertCircle, FiSearch,
  FiRefreshCw, FiUpload, FiInfo, FiPackage
  // Removed FiTip - it doesn't exist
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { getUploadUrls } from '../utils/uploadResponseUtils';
import { toast } from 'react-hot-toast';

// Helper function to safely parse JSON
const safeJSONParse = (data, defaultValue = []) => {
  if (!data) return defaultValue;
  if (Array.isArray(data)) return data;
  if (typeof data === 'object') return data;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch (e) {
    if (typeof data === 'string' && data.includes(',')) {
      return data.split(',').map(item => item.trim());
    }
    return defaultValue;
  }
};

// Helper function to safely get image URL
const getImageUrl = (room) => {
  if (room.image && typeof room.image === 'string' && room.image.startsWith('http')) {
    return room.image;
  }
  return 'https://placehold.co/600x400/eee/999?text=No+Image';
};

// cn helper function
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Memoized Room Card Component
const RoomCard = memo(({ room, onEdit, onDelete }) => {
  const imageUrl = getImageUrl(room);
  const products = safeJSONParse(room.products, []);
  const tags = safeJSONParse(room.tags, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 md:h-64 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <img
          src={imageUrl}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/600x400/eee/999?text=No+Image'; }}
        />
      </div>
      
      {/* Content Section */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white truncate">
              {room.name}
            </h3>
            <p className="text-xs text-neutral-500 capitalize mt-0.5">
              {room.style || 'No style'} • {room.roomType || 'No type'}
            </p>
          </div>
        </div>
        
        {/* Tags Preview */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-400">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 text-primary-600">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(room)}
            className="flex-1 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group/edit"
          >
            <FiEdit2 className="h-4 w-4 mx-auto text-neutral-600 dark:text-neutral-400 group-hover/edit:text-primary-600" />
          </button>
          <button
            onClick={() => onDelete(room)}
            className="flex-1 py-2 border border-red-200 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <FiTrash2 className="h-4 w-4 mx-auto text-red-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});
RoomCard.displayName = 'RoomCard';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    style: '',
    roomType: '',
    image: '',
    description: '',
    features: '',
    tips: '',
    products: [],
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const itemsPerPage = 9;

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getRooms();
      
      let roomsData = [];
      if (response?.success && response?.rooms) roomsData = response.rooms;
      else if (response?.data?.success && response?.data?.rooms) roomsData = response.data.rooms;
      else if (Array.isArray(response)) roomsData = response;
      else if (response?.data && Array.isArray(response.data)) roomsData = response.data;
      
      const parsedRooms = roomsData.map(room => ({
        ...room,
        products: safeJSONParse(room.products, []),
        tags: safeJSONParse(room.tags, [])
      }));
      
      setRooms(parsedRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append('images', file);
      const response = await apiWrapper.uploadImages(formDataImg);
      const urls = getUploadUrls(response);
      if (!urls.length) throw new Error('No image URL returned');
      
      const imageUrl = urls[0];
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setPreviewImage(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setPreviewImage(null);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addProduct = () => {
    if (newProduct.trim() && !formData.products.includes(newProduct.trim())) {
      setFormData(prev => ({ ...prev, products: [...prev.products, newProduct.trim()] }));
      setNewProduct('');
    }
  };

  const removeProduct = (product) => {
    setFormData(prev => ({ ...prev, products: prev.products.filter(p => p !== product) }));
  };

  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Room name is required');
      return;
    }

    setSaving(true);
    try {
      const roomData = {
        name: formData.name.trim(),
        style: formData.style || '',
        roomType: formData.roomType || '',
        image: formData.image || '',
        description: formData.description || '',
        features: formData.features || '',
        tips: formData.tips || '',
        products: JSON.stringify(formData.products || []),
        tags: JSON.stringify(formData.tags || [])
      };

      if (modalMode === 'create') {
        await apiWrapper.createRoom(roomData);
        toast.success('Room created successfully');
      } else {
        await apiWrapper.updateRoom(selectedRoom._id, roomData);
        toast.success('Room updated successfully');
      }
      
      await fetchRooms();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error(error?.response?.data?.message || 'Failed to save room');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (room) => {
    if (window.confirm(`Delete room "${room.name}"? This cannot be undone.`)) {
      try {
        await apiWrapper.deleteRoom(room._id);
        toast.success('Room deleted');
        await fetchRooms();
      } catch (error) {
        toast.error('Failed to delete room');
      }
    }
  };

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      style: '',
      roomType: '',
      image: '',
      description: '',
      features: '',
      tips: '',
      products: [],
      tags: []
    });
    setPreviewImage(null);
    setNewTag('');
    setNewProduct('');
  }, []);

  const openEditModal = useCallback((room) => {
    setSelectedRoom(room);
    setFormData({
      name: room.name || '',
      style: room.style || '',
      roomType: room.roomType || '',
      image: room.image || '',
      description: room.description || '',
      features: room.features || '',
      tips: room.tips || '',
      products: safeJSONParse(room.products, []),
      tags: safeJSONParse(room.tags, [])
    });
    setPreviewImage(room.image || null);
    setModalMode('edit');
    setShowModal(true);
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = searchTerm === '' ||
        room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.style?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.roomType?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [rooms, searchTerm]);

  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRooms.slice(start, start + itemsPerPage);
  }, [filteredRooms, currentPage]);

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  if (loading) return <RoomsSkeleton />;

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Room Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">Manage room inspiration content</p>
        </div>
        <button
          onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all active:scale-95"
        >
          <FiPlus className="h-4 w-4" />
          Add Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Rooms', value: rooms.length, color: 'text-primary-600' },
          { label: 'Styles', value: [...new Set(rooms.map(r => r.style).filter(Boolean))].length, color: 'text-green-600' },
          { label: 'Room Types', value: [...new Set(rooms.map(r => r.roomType).filter(Boolean))].length, color: 'text-blue-600' },
          { label: 'Products Linked', value: rooms.reduce((sum, r) => sum + safeJSONParse(r.products, []).length, 0), color: 'text-amber-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
            <p className="text-[10px] sm:text-xs text-neutral-500">{stat.label}</p>
            <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, style, or room type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
          <button onClick={fetchRooms} className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 transition-all">
            <FiRefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border p-8 text-center">
          <FiHome className="h-12 w-12 mx-auto text-neutral-400 mb-3" />
          <h3 className="text-lg font-semibold mb-1">No Rooms Found</h3>
          <p className="text-sm text-neutral-500">
            {searchTerm ? 'Try adjusting your search' : 'Click "Add Room" to create your first room'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <AnimatePresence>
            {paginatedRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-50 hover:bg-neutral-50 transition-all"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-50 hover:bg-neutral-50 transition-all"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Room Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-neutral-900 p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold">
                  {modalMode === 'create' ? 'Add New Room' : 'Edit Room'}
                </h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-neutral-100 transition">
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-5">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Room Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Modern Living Room"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Style</label>
                      <input
                        type="text"
                        value={formData.style}
                        onChange={handleInputChange('style')}
                        className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                        placeholder="e.g., Modern, Minimalist"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Room Type</label>
                      <input
                        type="text"
                        value={formData.roomType}
                        onChange={handleInputChange('roomType')}
                        className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                        placeholder="e.g., Living Room, Bedroom"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange('description')}
                      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 resize-none"
                      placeholder="Describe the room inspiration..."
                    />
                  </div>
                </div>

                {/* Features & Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                      <FiInfo className="h-3 w-3" /> Features
                    </label>
                    <textarea
                      rows={3}
                      value={formData.features}
                      onChange={handleInputChange('features')}
                      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 resize-none"
                      placeholder="Key features of this room design..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                      <FiInfo className="h-3 w-3" /> Design Tips
                    </label>
                    <textarea
                      rows={3}
                      value={formData.tips}
                      onChange={handleInputChange('tips')}
                      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 resize-none"
                      placeholder="Design tips and inspiration..."
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1 p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                      placeholder="Add tag..."
                    />
                    <button onClick={addTag} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-neutral-400 hover:text-red-500">
                          <FiX className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Products */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                    <FiPackage className="h-3 w-3" /> Related Products (Product IDs)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newProduct}
                      onChange={(e) => setNewProduct(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addProduct()}
                      className="flex-1 p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                      placeholder="Enter product ID..."
                    />
                    <button onClick={addProduct} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.products.map((product, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs">
                        <FiPackage className="h-3 w-3" />
                        {product}
                        <button onClick={() => removeProduct(product)} className="text-blue-500 hover:text-red-500">
                          <FiX className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Room Image</label>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {previewImage || formData.image ? (
                        <div className="relative group">
                          <img 
                            src={previewImage || formData.image} 
                            alt="Room preview" 
                            className="w-32 h-32 rounded-xl object-cover border-2 border-neutral-200 dark:border-neutral-700"
                          />
                          <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-800">
                          <FiImage className="h-8 w-8 text-neutral-400" />
                          <span className="text-xs text-neutral-500 mt-1">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition w-full sm:w-auto">
                        <FiUpload className="h-4 w-4" />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      <p className="text-xs text-neutral-500 mt-2">Recommended: 1200x800px, JPG or PNG</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 transition disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <FiSave className="inline mr-2 h-4 w-4" />
                        {modalMode === 'create' ? 'Create Room' : 'Save Changes'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 transition"
                  >
                    Cancel
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

const RoomsSkeleton = () => (
  <div className="space-y-4 sm:space-y-6 animate-pulse">
    <div className="flex justify-between">
      <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="h-10 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      ))}
    </div>
    <div className="h-14 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      ))}
    </div>
  </div>
);

export default AdminRooms;