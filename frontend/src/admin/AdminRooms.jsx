// AdminRooms.jsx - Room management (for hotel/room booking)
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiUsers, FiMaximize, FiWifi, FiCoffee, FiTv, FiWind, FiX, FiSave, FiEye } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '', roomType: 'standard', name: '', description: '', price: 0, capacity: 2,
    size: 0, beds: 1, amenities: [], images: [], isAvailable: true, isFeatured: false
  });
  const [uploading, setUploading] = useState(false);

  const roomTypes = ['standard', 'deluxe', 'suite', 'presidential', 'family', 'single'];
  const amenitiesList = ['WiFi', 'AC', 'TV', 'Mini Bar', 'Room Service', 'Sea View', 'Balcony', 'Jacuzzi', 'Kitchen', 'Parking'];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getRooms();
      setRooms(response?.data?.rooms || []);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      const formDataImg = new FormData();
      files.forEach(file => formDataImg.append('images', file));
      const response = await apiWrapper.uploadImages(formDataImg);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...response.data.urls] }));
      toast.success('Images uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
    }));
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'create') {
        await apiWrapper.createRoom(formData);
        toast.success('Room created');
      } else {
        await apiWrapper.updateRoom(selectedRoom._id, formData);
        toast.success('Room updated');
      }
      fetchRooms();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save room');
    }
  };

  const handleDelete = async (room) => {
    if (window.confirm(`Delete room "${room.roomNumber}"?`)) {
      try {
        await apiWrapper.deleteRoom(room._id);
        toast.success('Room deleted');
        fetchRooms();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      roomNumber: '', roomType: 'standard', name: '', description: '', price: 0, capacity: 2,
      size: 0, beds: 1, amenities: [], images: [], isAvailable: true, isFeatured: false
    });
  };

  const getAmenityIcon = (amenity) => {
    const icons = { WiFi: FiWifi, AC: FiWind, TV: FiTv, 'Mini Bar': FiCoffee };
    const Icon = icons[amenity] || FiCoffee;
    return <Icon className="h-3 w-3" />;
  };

  const RoomModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{modalMode === 'create' ? 'Add Room' : 'Edit Room'}</h2>
          <button onClick={() => { setShowModal(false); resetForm(); }}><FiX /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Room Number *</label><input type="text" value={formData.roomNumber} onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-1">Room Type</label><select value={formData.roomType} onChange={(e) => setFormData({ ...formData, roomType: e.target.value })} className="w-full p-2.5 border rounded-xl">{roomTypes.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}</select></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Room Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2.5 border rounded-xl" placeholder="e.g., Ocean View Suite" /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2.5 border rounded-xl" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-sm font-medium mb-1">Price/Night</label><input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full p-2.5 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-1">Capacity</label><input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="w-full p-2.5 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-1">Beds</label><input type="number" value={formData.beds} onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) })} className="w-full p-2.5 border rounded-xl" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Amenities</label><div className="flex flex-wrap gap-2">{amenitiesList.map(amenity => (<button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} className={`px-3 py-1.5 text-sm rounded-lg border transition ${formData.amenities.includes(amenity) ? 'bg-primary-600 text-white border-primary-600' : 'border-neutral-200 hover:border-primary-300'}`}>{amenity}</button>))}</div></div>
          <div><label className="block text-sm font-medium mb-1">Room Images</label><div className="flex flex-wrap gap-3">{formData.images.map((img, idx) => (<div key={idx} className="relative group"><img src={img} className="w-20 h-20 rounded-lg object-cover" /><button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><FiX className="h-3 w-3" /></button></div>))}<label className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer"><FiImage className="h-6 w-6" /><span className="text-xs">Upload</span><input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} /></label></div></div>
          <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} /><span>Available</span></label><label className="flex items-center gap-2"><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} /><span>Featured</span></label></div>
          <button onClick={handleSave} className="w-full py-2.5 bg-primary-600 text-white rounded-xl"><FiSave className="inline mr-2" />Save Room</button>
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-neutral-200 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold">Room Management</h1><p className="text-sm text-neutral-500">Manage hotel/accommodation rooms</p></div><button onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl"><FiPlus />Add Room</button></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((room, idx) => (
          <motion.div key={room._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden group">
            <div className="relative h-48 bg-neutral-100"><img src={room.images?.[0] || 'https://placehold.co/400x300'} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /><div className="absolute top-2 right-2"><span className={`px-2 py-1 text-xs rounded-full ${room.isAvailable ? 'bg-green-500' : 'bg-red-500'} text-white`}>{room.isAvailable ? 'Available' : 'Booked'}</span></div></div>
            <div className="p-4"><div className="flex justify-between items-start mb-2"><div><h3 className="font-semibold text-lg">{room.name || `Room ${room.roomNumber}`}</h3><p className="text-sm text-neutral-500 capitalize">{room.roomType}</p></div><div className="text-right"><span className="text-xl font-bold text-primary-600">${room.price}</span><span className="text-sm text-neutral-500">/night</span></div></div>
            <div className="flex gap-3 text-sm text-neutral-500 mb-3"><span className="flex items-center gap-1"><FiUsers className="h-3 w-3" />Up to {room.capacity}</span><span className="flex items-center gap-1"><FiMaximize className="h-3 w-3" />{room.size} sqft</span></div>
            <div className="flex flex-wrap gap-1 mb-3">{room.amenities?.slice(0, 4).map(amenity => (<span key={amenity} className="text-xs px-2 py-0.5 bg-neutral-100 rounded-full flex items-center gap-1">{getAmenityIcon(amenity)}{amenity}</span>))}</div>
            <div className="flex gap-2"><button onClick={() => { setSelectedRoom(room); setFormData(room); setModalMode('edit'); setShowModal(true); }} className="flex-1 p-2 border rounded-lg hover:bg-neutral-50"><FiEdit2 className="h-4 w-4 mx-auto" /></button><button onClick={() => handleDelete(room)} className="flex-1 p-2 border border-red-200 rounded-lg hover:bg-red-50 text-red-600"><FiTrash2 className="h-4 w-4 mx-auto" /></button></div></div>
          </motion.div>
        ))}
      </div>

      {showModal && <RoomModal />}
    </div>
  );
};

export default AdminRooms;