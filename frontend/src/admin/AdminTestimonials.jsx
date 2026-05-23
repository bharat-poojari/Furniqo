// AdminTestimonials.jsx - Testimonial management
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiUser, FiCheck, FiX, FiRefreshCw, FiMessageSquare } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '', position: '', company: '', content: '', rating: 5, image: '', isVerified: false
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getTestimonials();
      setTestimonials(response?.data?.testimonials || []);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'create') {
        await apiWrapper.createTestimonial(formData);
        toast.success('Testimonial added');
      } else {
        await apiWrapper.updateTestimonial(selectedTestimonial._id, formData);
        toast.success('Testimonial updated');
      }
      fetchTestimonials();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save testimonial');
    }
  };

  const handleDelete = async (testimonial) => {
    if (window.confirm(`Delete testimonial from "${testimonial.name}"?`)) {
      try {
        await apiWrapper.deleteTestimonial(testimonial._id);
        toast.success('Testimonial deleted');
        fetchTestimonials();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleToggleVerified = async (testimonial) => {
    try {
      await apiWrapper.updateTestimonial(testimonial._id, { isVerified: !testimonial.isVerified });
      toast.success(`Testimonial ${!testimonial.isVerified ? 'verified' : 'unverified'}`);
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', position: '', company: '', content: '', rating: 5, image: '', isVerified: false });
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar key={i} className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} />
    ));
  };

  const TestimonialModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full">
        <div className="p-5 border-b flex justify-between items-center"><h2 className="text-xl font-bold">{modalMode === 'create' ? 'Add Testimonial' : 'Edit Testimonial'}</h2><button onClick={() => { setShowModal(false); resetForm(); }}><FiX /></button></div>
        <div className="p-5 space-y-4">
          <div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1">Position</label><input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
          <div><label className="block text-sm font-medium mb-1">Company</label><input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div></div>
          <div><label className="block text-sm font-medium mb-1">Rating</label><div className="flex gap-1">{renderStars(formData.rating)}<select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })} className="ml-2 p-1 border rounded"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div></div>
          <div><label className="block text-sm font-medium mb-1">Testimonial Content *</label><textarea rows={4} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isVerified} onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })} /><span>Verified (show on website)</span></label>
          <button onClick={handleSave} className="w-full py-2.5 bg-primary-600 text-white rounded-xl">Save Testimonial</button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-neutral-200 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Testimonials</h1><p className="text-sm text-neutral-500">Manage customer reviews and testimonials</p></div>
        <button onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl"><FiPlus />Add Testimonial</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((testimonial, idx) => (
          <motion.div key={testimonial._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="bg-white dark:bg-neutral-900 rounded-xl border p-5 relative">
            {testimonial.isVerified && <div className="absolute top-3 right-3"><FiCheck className="h-5 w-5 text-green-500" /></div>}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">{testimonial.name?.charAt(0)}</div>
              <div><h3 className="font-semibold">{testimonial.name}</h3><p className="text-sm text-neutral-500">{testimonial.position}{testimonial.company && ` at ${testimonial.company}`}</p></div>
            </div>
            <div className="flex mb-2">{renderStars(testimonial.rating)}</div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">"{testimonial.content}"</p>
            <div className="flex gap-2 mt-4 pt-3 border-t">
              <button onClick={() => { setSelectedTestimonial(testimonial); setFormData(testimonial); setModalMode('edit'); setShowModal(true); }} className="flex-1 p-2 border rounded-lg hover:bg-neutral-50"><FiEdit2 className="h-4 w-4 mx-auto" /></button>
              <button onClick={() => handleToggleVerified(testimonial)} className="flex-1 p-2 border rounded-lg hover:bg-neutral-50">{testimonial.isVerified ? 'Unverify' : 'Verify'}</button>
              <button onClick={() => handleDelete(testimonial)} className="flex-1 p-2 border border-red-200 rounded-lg hover:bg-red-50 text-red-600"><FiTrash2 className="h-4 w-4 mx-auto" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && <TestimonialModal />}
    </div>
  );
};

export default AdminTestimonials;