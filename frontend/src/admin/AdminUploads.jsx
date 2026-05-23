// AdminUploads.jsx - Media manager
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiTrash2, FiCopy, FiImage, FiFolder, FiX, FiCheck, FiGrid, FiList } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminUploads = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getUploadedImages();
      setImages(response?.data?.images || []);
    } catch (error) {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      const response = await apiWrapper.uploadImages(formData);
      setImages(prev => [...response.data.urls, ...prev]);
      toast.success(`${files.length} image(s) uploaded`);
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (imageUrl) => {
    if (window.confirm('Delete this image? This action cannot be undone.')) {
      try {
        const filename = imageUrl.split('/').pop();
        await apiWrapper.deleteImage(filename);
        setImages(prev => prev.filter(img => img !== imageUrl));
        toast.success('Image deleted');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const filteredImages = images.filter(img => img.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Media Manager</h1><p className="text-sm text-neutral-500">Upload and manage images</p></div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-neutral-100 rounded-xl p-1">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-md' : ''}`}><FiGrid /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-md' : ''}`}><FiList /></button>
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl"><FiUpload />Upload Images</button>
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
        </div>
      </div>

      {uploading && <div className="bg-primary-50 dark:bg-primary-950/30 p-4 rounded-xl text-center"><div className="animate-spin inline-block w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full mr-2" />Uploading {uploading} images...</div>}

      <div className="relative"><input type="text" placeholder="Search images..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 border rounded-xl pl-10" /><FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /></div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredImages.map((img, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.02 }} className="group relative bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden">
              <img src={img} alt="" className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button onClick={() => handleCopyUrl(img)} className="p-2 bg-white rounded-full hover:bg-primary-600 hover:text-white transition"><FiCopy className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(img)} className="p-2 bg-white rounded-full hover:bg-red-600 hover:text-white transition"><FiTrash2 className="h-4 w-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden">
          <div className="divide-y">
            {filteredImages.map((img, idx) => (
              <div key={idx} className="p-3 flex items-center gap-3 hover:bg-neutral-50">
                <img src={img} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono truncate">{img.split('/').pop()}</p>
                  <p className="text-xs text-neutral-500 truncate">{img}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleCopyUrl(img)} className="p-1.5 rounded-lg hover:bg-neutral-100"><FiCopy className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(img)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"><FiTrash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredImages.length === 0 && !loading && <div className="text-center py-12"><FiImage className="h-12 w-12 mx-auto text-neutral-400 mb-3" /><p className="text-neutral-500">No images found</p><button onClick={() => fileInputRef.current?.click()} className="mt-3 text-primary-600">Upload your first image</button></div>}
    </div>
  );
};

export default AdminUploads;