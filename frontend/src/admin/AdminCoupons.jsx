// AdminCoupons.jsx - Coupon management
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiCopy, FiCalendar, FiPercent, FiDollarSign, FiX, FiSave } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '', description: '', discountType: 'percentage', discountValue: 0, minimumOrder: 0,
    maxDiscount: null, usageLimit: null, usedCount: 0, startDate: '', endDate: '',
    isActive: true, applicableProducts: [], applicableCategories: [], excludeProducts: []
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getAllCoupons();
      setCoupons(response?.data?.coupons || []);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'create') {
        await apiWrapper.createCoupon(formData);
        toast.success('Coupon created');
      } else {
        await apiWrapper.updateCoupon(selectedCoupon.code, formData);
        toast.success('Coupon updated');
      }
      fetchCoupons();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save coupon');
    }
  };

  const handleDelete = async (coupon) => {
    if (window.confirm(`Delete coupon "${coupon.code}"?`)) {
      try {
        await apiWrapper.deleteCoupon(coupon.code);
        toast.success('Coupon deleted');
        fetchCoupons();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const resetForm = () => {
    setFormData({
      code: '', description: '', discountType: 'percentage', discountValue: 0, minimumOrder: 0,
      maxDiscount: null, usageLimit: null, usedCount: 0, startDate: '', endDate: '',
      isActive: true, applicableProducts: [], applicableCategories: [], excludeProducts: []
    });
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setFormData(prev => ({ ...prev, code }));
  };

  const CouponModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{modalMode === 'create' ? 'Create Coupon' : 'Edit Coupon'}</h2>
          <button onClick={() => { setShowModal(false); resetForm(); }}><FiX /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coupon Code *</label>
            <div className="flex gap-2">
              <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="flex-1 p-2.5 border rounded-xl uppercase" />
              <button onClick={generateRandomCode} className="px-3 py-2.5 border rounded-xl text-sm">Generate</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })} className="w-full p-2.5 border rounded-xl">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Value</label>
              <input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })} className="w-full p-2.5 border rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Order</label>
              <input type="number" value={formData.minimumOrder} onChange={(e) => setFormData({ ...formData, minimumOrder: parseFloat(e.target.value) })} className="w-full p-2.5 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Discount</label>
              <input type="number" value={formData.maxDiscount || ''} onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? parseFloat(e.target.value) : null })} className="w-full p-2.5 border rounded-xl" placeholder="Optional" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" value={formData.startDate?.split('T')[0] || ''} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full p-2.5 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" value={formData.endDate?.split('T')[0] || ''} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full p-2.5 border rounded-xl" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Usage Limit</label>
            <input type="number" value={formData.usageLimit || ''} onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : null })} className="w-full p-2.5 border rounded-xl" placeholder="Unlimited" />
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /><span>Active</span></label>
          <button onClick={handleSave} className="w-full py-2.5 bg-primary-600 text-white rounded-xl"><FiSave className="inline mr-2" />Save Coupon</button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Coupon Management</h1><p className="text-sm text-neutral-500">Create and manage discount coupons</p></div>
        <button onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl"><FiPlus />Create Coupon</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coupons.map((coupon, idx) => (
          <motion.div key={coupon.code} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="bg-white dark:bg-neutral-900 rounded-xl border p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full opacity-10" />
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-mono font-bold text-primary-600">{coupon.code}</h3>
                {coupon.description && <p className="text-xs text-neutral-500 mt-1">{coupon.description}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleCopyCode(coupon.code)} className="p-1.5 rounded-lg hover:bg-neutral-100"><FiCopy className="h-4 w-4" /></button>
                <button onClick={() => { setSelectedCoupon(coupon); setFormData(coupon); setModalMode('edit'); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-neutral-100"><FiEdit2 /></button>
                <button onClick={() => handleDelete(coupon)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"><FiTrash2 /></button>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              {coupon.discountType === 'percentage' ? <FiPercent className="h-4 w-4 text-neutral-400" /> : <FiDollarSign className="h-4 w-4 text-neutral-400" />}
              <span className="text-2xl font-bold">{coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ''}</span>
              <span className="text-sm text-neutral-500">off</span>
            </div>
            <div className="space-y-1 text-sm">
              {coupon.minimumOrder > 0 && <p className="text-neutral-500">Min. order: ${coupon.minimumOrder}</p>}
              {coupon.usageLimit && <p className="text-neutral-500">Used: {coupon.usedCount} / {coupon.usageLimit}</p>}
              {coupon.endDate && <p className="text-xs text-neutral-400 flex items-center gap-1"><FiCalendar />Expires: {new Date(coupon.endDate).toLocaleDateString()}</p>}
            </div>
            {!coupon.isActive && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Inactive</span></div>}
          </motion.div>
        ))}
      </div>

      {showModal && <CouponModal />}
    </div>
  );
};

export default AdminCoupons;