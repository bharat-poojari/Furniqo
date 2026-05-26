// AdminUploads.jsx - Media manager with full gallery management
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, FiTrash2, FiCopy, FiImage, FiFolder, FiX, FiCheck, 
  FiGrid, FiList, FiSearch, FiRefreshCw, FiCheckSquare, 
  FiSquare, FiTrash, FiCopy as FiCopyAll, FiDownload,
  FiEye, FiInfo, FiCalendar, FiUser, FiFileText
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminUploads = () => {
  const [images, setImages] = useState([]);
  const [uploadsData, setUploadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getUploadedImages();
      
      let imagesList = [];
      let uploadsList = [];
      
      if (response?.success && response?.images) {
        imagesList = response.images;
        uploadsList = response.uploads || [];
      } else if (response?.data?.success && response?.data?.images) {
        imagesList = response.data.images;
        uploadsList = response.data.uploads || [];
      } else if (Array.isArray(response)) {
        imagesList = response;
      } else if (response?.images && Array.isArray(response.images)) {
        imagesList = response.images;
        uploadsList = response.uploads || [];
      }
      
      setImages(imagesList);
      setUploadsData(uploadsList);
      setSelectedImages(new Set());
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processUpload(files);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await processUpload(files);
    }
  };

  const processUpload = async (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Please upload image files only');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      imageFiles.forEach(file => formData.append('images', file));
      
      const response = await apiWrapper.uploadImages(formData);
      
      let newUrls = [];
      if (response?.urls && Array.isArray(response.urls)) {
        newUrls = response.urls;
      } else if (response?.data?.urls && Array.isArray(response.data.urls)) {
        newUrls = response.data.urls;
      } else if (response?.images && Array.isArray(response.images)) {
        newUrls = response.images.map(img => img.url);
      }
      
      if (newUrls.length > 0) {
        setImages(prev => [...newUrls, ...prev]);
        toast.success(`${newUrls.length} image(s) uploaded successfully`);
        await fetchImages(); // Refresh to get metadata
      } else {
        throw new Error('No image URLs returned from upload');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed: ' + (error?.message || 'Unknown error'));
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteSingle = async (imageUrl) => {
    if (window.confirm('Delete this image? This action cannot be undone.')) {
      try {
        const filename = imageUrl.split('/').pop();
        await apiWrapper.deleteImage(filename);
        setImages(prev => prev.filter(img => img !== imageUrl));
        setUploadsData(prev => prev.filter(u => u.url !== imageUrl));
        setSelectedImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageUrl);
          return newSet;
        });
        toast.success('Image deleted');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete image');
      }
    }
  };

  const handleBulkDelete = async () => {
    const imagesToDelete = Array.from(selectedImages);
    if (imagesToDelete.length === 0) return;
    
    setShowDeleteConfirm(false);
    let successCount = 0;
    let failCount = 0;
    
    for (const imageUrl of imagesToDelete) {
      try {
        const filename = imageUrl.split('/').pop();
        await apiWrapper.deleteImage(filename);
        successCount++;
      } catch (error) {
        console.error('Delete error:', error);
        failCount++;
      }
    }
    
    if (successCount > 0) {
      setImages(prev => prev.filter(img => !selectedImages.has(img)));
      setUploadsData(prev => prev.filter(u => !selectedImages.has(u.url)));
      setSelectedImages(new Set());
      toast.success(`${successCount} image(s) deleted successfully`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} image(s) failed to delete`);
    }
  };

  const handleCopySingle = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const handleBulkCopy = () => {
    const urls = Array.from(selectedImages);
    if (urls.length === 0) return;
    
    const text = urls.join('\n');
    navigator.clipboard.writeText(text);
    toast.success(`${urls.length} URL(s) copied to clipboard`);
  };

  const handleSelectAll = () => {
    if (selectedImages.size === filteredImages.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(filteredImages));
    }
  };

  const handleSelectImage = (imageUrl) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageUrl)) {
        newSet.delete(imageUrl);
      } else {
        newSet.add(imageUrl);
      }
      return newSet;
    });
  };

  const filteredImages = useMemo(() => {
    if (!searchTerm) return images;
    return images.filter(img => 
      img.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.split('/').pop().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [images, searchTerm]);

  const getImageInfo = (imageUrl) => {
    const uploadInfo = uploadsData.find(u => u.url === imageUrl);
    if (uploadInfo) {
      return {
        filename: uploadInfo.filename,
        size: uploadInfo.size,
        mimetype: uploadInfo.mimetype,
        createdAt: uploadInfo.createdAt,
        uploadedBy: uploadInfo.uploadedBy
      };
    }
    return {
      filename: imageUrl.split('/').pop(),
      size: null,
      mimetype: null,
      createdAt: null,
      uploadedBy: null
    };
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const ImagePreviewModal = ({ imageUrl, onClose }) => {
    const info = getImageInfo(imageUrl);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold">Image Preview</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100">
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 bg-black">
              <img src={imageUrl} alt="Preview" className="w-full h-auto max-h-[60vh] object-contain" />
            </div>
            
            <div className="md:w-1/3 p-4 space-y-3">
              <div>
                <p className="text-xs text-neutral-500">Filename</p>
                <p className="text-sm font-mono break-all">{info.filename}</p>
              </div>
              {info.size && (
                <div>
                  <p className="text-xs text-neutral-500">Size</p>
                  <p className="text-sm">{formatFileSize(info.size)}</p>
                </div>
              )}
              {info.mimetype && (
                <div>
                  <p className="text-xs text-neutral-500">Type</p>
                  <p className="text-sm">{info.mimetype}</p>
                </div>
              )}
              {info.createdAt && (
                <div>
                  <p className="text-xs text-neutral-500">Uploaded</p>
                  <p className="text-sm">{formatDate(info.createdAt)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-neutral-500">Full URL</p>
                <p className="text-xs font-mono break-all text-primary-600">{imageUrl}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => handleCopySingle(imageUrl)} className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm">Copy URL</button>
                <button onClick={() => handleDeleteSingle(imageUrl)} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm">Delete</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded mb-4" />
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Media Manager
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Upload and manage your images</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-900 shadow-md text-primary-600' : 'text-neutral-500'}`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-neutral-900 shadow-md text-primary-600' : 'text-neutral-500'}`}
            >
              <FiList className="h-4 w-4" />
            </button>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <FiUpload className="h-4 w-4" />
            Upload Images
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedImages.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <FiCheckSquare className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium">{selectedImages.size} image(s) selected</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleBulkCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg text-sm hover:bg-primary-50 transition">
              <FiCopyAll className="h-4 w-4" /> Copy URLs
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition">
              <FiTrash className="h-4 w-4" /> Delete Selected
            </button>
            <button onClick={() => setSelectedImages(new Set())} className="px-3 py-1.5 border rounded-lg text-sm hover:bg-neutral-50 transition">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <FiTrash2 className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Delete Images</h3>
                <p className="text-neutral-500 mb-6">
                  Are you sure you want to delete {selectedImages.size} image(s)? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={handleBulkDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
                    Delete
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 border rounded-xl hover:bg-neutral-50 transition">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-primary-50 dark:bg-primary-950/30 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent" />
            <span>Uploading images...</span>
          </div>
          <div className="mt-2 h-1 bg-primary-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-600 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all ${
          isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' 
            : 'border-neutral-300 dark:border-neutral-700'
        }`}
      >
        <div className="p-8 text-center">
          <FiUpload className="h-10 w-10 mx-auto text-neutral-400 mb-3" />
          <p className="text-sm text-neutral-500">
            Drag and drop images here, or <button onClick={() => fileInputRef.current?.click()} className="text-primary-600 hover:underline">browse</button>
          </p>
          <p className="text-xs text-neutral-400 mt-1">Supports JPG, PNG, GIF up to 10MB</p>
        </div>
      </div>

      {/* Search and Select All */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search images by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
          />
        </div>
        {filteredImages.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 transition"
          >
            {selectedImages.size === filteredImages.length ? 
              <FiCheckSquare className="h-4 w-4 text-primary-600" /> : 
              <FiSquare className="h-4 w-4" />
            }
            {selectedImages.size === filteredImages.length ? 'Deselect All' : 'Select All'}
          </button>
        )}
        <button onClick={fetchImages} className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 transition">
          <FiRefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Image Count */}
      <div className="text-sm text-neutral-500">
        Showing {filteredImages.length} of {images.length} images
      </div>

      {/* Images Display */}
      {filteredImages.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border p-12 text-center">
          <FiImage className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Images Found</h3>
          <p className="text-neutral-500 mb-4">
            {searchTerm ? 'Try a different search term' : 'Upload your first image to get started'}
          </p>
          {!searchTerm && (
            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
              Upload Images
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredImages.map((img, idx) => {
            const isSelected = selectedImages.has(img);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                className={`group relative bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-primary-500 border-primary-500' : 'border-neutral-200 dark:border-neutral-800 hover:shadow-lg'
                }`}
                onClick={() => handleSelectImage(img)}
              >
                <div className="relative aspect-square">
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  {isSelected && (
                    <div className="absolute top-2 left-2">
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <FiCheck className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowPreviewModal(img); }}
                    className="p-2 bg-white rounded-full hover:bg-primary-600 hover:text-white transition"
                    title="Preview"
                  >
                    <FiEye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopySingle(img); }}
                    className="p-2 bg-white rounded-full hover:bg-primary-600 hover:text-white transition"
                    title="Copy URL"
                  >
                    <FiCopy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteSingle(img); }}
                    className="p-2 bg-white rounded-full hover:bg-red-600 hover:text-white transition"
                    title="Delete"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {filteredImages.map((img, idx) => {
              const isSelected = selectedImages.has(img);
              const info = getImageInfo(img);
              return (
                <div 
                  key={idx} 
                  className={`p-3 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition cursor-pointer ${isSelected ? 'bg-primary-50 dark:bg-primary-950/20' : ''}`}
                  onClick={() => handleSelectImage(img)}
                >
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <div className="w-5 h-5 bg-primary-500 rounded flex items-center justify-center">
                        <FiCheck className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <FiSquare className="h-5 w-5 text-neutral-400" />
                    )}
                  </div>
                  <img src={img} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono truncate">{info.filename}</p>
                    <div className="flex gap-3 text-xs text-neutral-500">
                      {info.size && <span>{formatFileSize(info.size)}</span>}
                      {info.createdAt && <span>{formatDate(info.createdAt)}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); setShowPreviewModal(img); }} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Preview">
                      <FiEye className="h-4 w-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleCopySingle(img); }} className="p-1.5 rounded-lg hover:bg-neutral-100" title="Copy URL">
                      <FiCopy className="h-4 w-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteSingle(img); }} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600" title="Delete">
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <ImagePreviewModal imageUrl={showPreviewModal} onClose={() => setShowPreviewModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUploads;