// AdminHeroSlides.jsx - Hero slides management with drag & drop
import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiEye, FiEyeOff, FiDragHandle, FiX, FiSave, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminHeroSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '', subtitle: '', buttonText: '', buttonLink: '', image: '', order: 0, isActive: true
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getAllHeroSlides();
      setSlides(response?.data?.slides || []);
    } catch (error) {
      toast.error('Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append('image', file);
      const response = await apiWrapper.uploadImage(formDataImg);
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
        await apiWrapper.createHeroSlide(formData);
        toast.success('Slide created');
      } else {
        await apiWrapper.updateHeroSlide(selectedSlide._id, formData);
        toast.success('Slide updated');
      }
      fetchSlides();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save slide');
    }
  };

  const handleDelete = async (slide) => {
    if (window.confirm(`Delete slide "${slide.title}"?`)) {
      try {
        await apiWrapper.deleteHeroSlide(slide._id);
        toast.success('Slide deleted');
        fetchSlides();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      await apiWrapper.toggleHeroSlide(slide._id);
      toast.success(`Slide ${!slide.isActive ? 'activated' : 'deactivated'}`);
      fetchSlides();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleReorder = async (newOrder) => {
    setSlides(newOrder);
    // Optional: API call to save order
    // await apiWrapper.reorderHeroSlides(newOrder.map((slide, idx) => ({ id: slide._id, order: idx })));
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', buttonText: '', buttonLink: '', image: '', order: 0, isActive: true });
  };

  const SlideModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{modalMode === 'create' ? 'Add Hero Slide' : 'Edit Slide'}</h2>
          <button onClick={() => { setShowModal(false); resetForm(); }}><FiX /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Button Text</label>
              <input type="text" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} className="w-full p-2.5 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Button Link</label>
              <input type="text" value={formData.buttonLink} onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })} className="w-full p-2.5 border rounded-xl" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slide Image</label>
            <div className="flex gap-3 items-center">
              {formData.image && <img src={formData.image} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />}
              <label className="flex-1 px-4 py-2 border rounded-xl text-center cursor-pointer">{uploading ? 'Uploading...' : 'Upload Image'}<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} /></label>
            </div>
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /><span>Active</span></label>
          <button onClick={handleSave} className="w-full py-2.5 bg-primary-600 text-white rounded-xl"><FiSave className="inline mr-2" />Save Slide</button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-neutral-200 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Hero Slides</h1><p className="text-sm text-neutral-500">Manage homepage hero carousel slides</p></div>
        <button onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl"><FiPlus />Add Slide</button>
      </div>

      <Reorder.Group axis="y" values={slides} onReorder={handleReorder} className="space-y-3">
        {slides.map((slide, idx) => (
          <Reorder.Item key={slide._id} value={slide} className="bg-white dark:bg-neutral-900 rounded-xl border p-4 cursor-move">
            <div className="flex items-center gap-4">
              <FiDragHandle className="text-neutral-400 cursor-grab" />
              {slide.image ? <img src={slide.image} alt="" className="w-20 h-20 rounded-lg object-cover" /> : <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center"><FiImage className="h-8 w-8 text-primary-600" /></div>}
              <div className="flex-1">
                <h3 className="font-semibold">{slide.title || 'Untitled Slide'}</h3>
                {slide.subtitle && <p className="text-sm text-neutral-500">{slide.subtitle}</p>}
                <div className="flex gap-2 mt-1">
                  {slide.buttonText && <span className="text-xs text-primary-600">Btn: {slide.buttonText}</span>}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${slide.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{slide.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleToggleActive(slide)} className="p-2 rounded-lg hover:bg-neutral-100">{slide.isActive ? <FiEye className="h-4 w-4" /> : <FiEyeOff className="h-4 w-4" />}</button>
                <button onClick={() => { setSelectedSlide(slide); setFormData(slide); setModalMode('edit'); setShowModal(true); }} className="p-2 rounded-lg hover:bg-neutral-100"><FiEdit2 /></button>
                <button onClick={() => handleDelete(slide)} className="p-2 rounded-lg hover:bg-red-100 text-red-600"><FiTrash2 /></button>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {showModal && <SlideModal />}
    </div>
  );
};

export default AdminHeroSlides;