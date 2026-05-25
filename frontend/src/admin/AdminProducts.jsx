// AdminProducts.jsx - Complete product management
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiGrid, FiList,
  FiDollarSign, FiPackage, FiTag, FiStar, FiRefreshCw, FiX,
  FiImage, FiUpload, FiSave, FiEyeOff, FiCheckCircle, FiAlertCircle,
  FiTrendingUp, FiShoppingBag, FiClock, FiFilter, FiChevronDown
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import MediaLibraryPicker from '../components/common/MediaLibraryPicker';
import { getUploadUrls } from '../utils/uploadResponseUtils';
import { toast } from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', compareAtPrice: '', costPerItem: '',
    sku: '', barcode: '', quantity: 0, category: '', images: [],
    tags: [], weight: '', dimensions: { length: '', width: '', height: '' },
    isActive: true, isFeatured: false, seo: { title: '', description: '', slug: '' }
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        apiWrapper.getProducts(),
        apiWrapper.getCategories()
      ]);
      const productsData = productsRes?.data ?? productsRes;
      const categoriesData = categoriesRes?.data ?? categoriesRes;
      setProducts(Array.isArray(productsData) ? productsData : (productsData?.products || []));
      setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData?.categories || []));
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchTerm === '' ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' ? product.isActive : !product.isActive);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const paginatedProducts = useMemo(() => {
    const itemsPerPage = viewMode === 'grid' ? 12 : 10;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, viewMode]);

  const totalPages = Math.ceil(filteredProducts.length / (viewMode === 'grid' ? 12 : 10));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      const response = await apiWrapper.uploadImages(formData);
      const urls = getUploadUrls(response);
      if (!urls.length) throw new Error('No image URLs returned from upload');
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images: ' + (error?.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'create') {
        await apiWrapper.createProduct(formData);
        toast.success('Product created successfully');
      } else {
        await apiWrapper.updateProduct(selectedProduct._id, formData);
        toast.success('Product updated successfully');
      }
      fetchData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Delete "${product.name}"? This action cannot be undone.`)) {
      try {
        await apiWrapper.deleteProduct(product._id);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      await apiWrapper.updateProduct(product._id, { isActive: !product.isActive });
      toast.success(`Product ${!product.isActive ? 'activated' : 'deactivated'}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: '', compareAtPrice: '', costPerItem: '',
      sku: '', barcode: '', quantity: 0, category: '', images: [],
      tags: [], weight: '', dimensions: { length: '', width: '', height: '' },
      isActive: true, isFeatured: false, seo: { title: '', description: '', slug: '' }
    });
  };

  const ProductModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {modalMode === 'create' ? 'Add New Product' : modalMode === 'edit' ? 'Edit Product' : 'Product Details'}
          </h2>
          <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 rounded-lg hover:bg-neutral-100">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiTag className="h-4 w-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                  disabled={modalMode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                  disabled={modalMode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                  disabled={modalMode === 'view'}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                  disabled={modalMode === 'view'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                disabled={modalMode === 'view'}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiDollarSign className="h-4 w-4" />
              Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                  disabled={modalMode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Compare at Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) })}
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                  disabled={modalMode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cost per Item</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costPerItem}
                  onChange={(e) => setFormData({ ...formData, costPerItem: parseFloat(e.target.value) })}
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
                  disabled={modalMode === 'view'}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          {modalMode !== 'view' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiImage className="h-4 w-4" />
                Product Images
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <MediaLibraryPicker
                  selected={formData.images}
                  onSelect={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
                  multiple
                  buttonText="Choose from media library"
                  label="product images"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt={`Product ${idx}`} className="w-24 h-24 object-cover rounded-lg border" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition">
                  <FiUpload className="h-6 w-6 text-neutral-400" />
                  <span className="text-xs text-neutral-500">Upload</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
              {uploading && <p className="text-sm text-primary-600">Uploading...</p>}
            </div>
          )}

          {/* Status Toggles */}
          {modalMode !== 'view' && (
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Featured</span>
              </label>
            </div>
          )}

          {/* Actions */}
          {modalMode !== 'view' && (
            <div className="flex gap-3 pt-4 border-t">
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700">
                <FiSave className="inline mr-2 h-4 w-4" />
                {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
              </button>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2.5 border rounded-xl hover:bg-neutral-50">
                Cancel
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  if (loading) return <ProductsSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Product Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
        >
          <FiPlus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border">
          <p className="text-sm text-neutral-500">Total</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border">
          <p className="text-sm text-neutral-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.isActive).length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border">
          <p className="text-sm text-neutral-500">Inactive</p>
          <p className="text-2xl font-bold text-red-600">{products.filter(p => !p.isActive).length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border">
          <p className="text-sm text-neutral-500">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">{products.filter(p => p.quantity < 10).length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border">
          <p className="text-sm text-neutral-500">Categories</p>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white dark:bg-neutral-800"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border rounded-xl bg-white dark:bg-neutral-800"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border rounded-xl bg-white dark:bg-neutral-800"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-md text-primary-600' : ''}`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-md text-primary-600' : ''}`}
            >
              <FiList className="h-4 w-4" />
            </button>
          </div>
          <button onClick={fetchData} className="px-4 py-2.5 border rounded-xl hover:bg-neutral-50">
            <FiRefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedProducts.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={product.images?.[0] || 'https://placehold.co/400x400/eee/999?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {!product.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Inactive</span>
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full">Featured</span>
                  </div>
                )}
                {product.compareAtPrice > product.price && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Sale</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white truncate">{product.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">SKU: {product.sku || 'N/A'}</p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-lg font-bold text-primary-600">${product.price}</span>
                    {product.compareAtPrice > product.price && (
                      <span className="text-sm text-neutral-400 line-through ml-2">${product.compareAtPrice}</span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${product.quantity > 10 ? 'bg-green-100 text-green-700' : product.quantity > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    Stock: {product.quantity}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => { setSelectedProduct(product); setFormData(product); setModalMode('view'); setShowModal(true); }}
                    className="flex-1 p-2 border rounded-lg hover:bg-neutral-50"
                  >
                    <FiEye className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => { setSelectedProduct(product); setFormData(product); setModalMode('edit'); setShowModal(true); }}
                    className="flex-1 p-2 border rounded-lg hover:bg-neutral-50"
                  >
                    <FiEdit2 className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(product)}
                    className="flex-1 p-2 border rounded-lg hover:bg-neutral-50"
                  >
                    {product.isActive ? <FiEyeOff className="h-4 w-4 mx-auto" /> : <FiCheckCircle className="h-4 w-4 mx-auto" />}
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="flex-1 p-2 border border-red-200 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <FiTrash2 className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold">Product</th>
                  <th className="text-left p-4 text-sm font-semibold">SKU</th>
                  <th className="text-left p-4 text-sm font-semibold">Price</th>
                  <th className="text-left p-4 text-sm font-semibold">Stock</th>
                  <th className="text-left p-4 text-sm font-semibold">Status</th>
                  <th className="text-left p-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedProducts.map((product, idx) => (
                  <tr key={product._id} className="hover:bg-neutral-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0] || 'https://placehold.co/40x40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{product.sku || '-'}</td>
                    <td className="p-4 font-semibold">${product.price}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${product.quantity > 10 ? 'bg-green-100 text-green-700' : product.quantity > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedProduct(product); setFormData(product); setModalMode('view'); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-neutral-100"><FiEye className="h-4 w-4" /></button>
                        <button onClick={() => { setSelectedProduct(product); setFormData(product); setModalMode('edit'); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-neutral-100"><FiEdit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(product)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"><FiTrash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50">Previous</button>
          <span className="px-3 py-1 bg-primary-600 text-white rounded-lg">{currentPage}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-lg disabled:opacity-50">Next</button>
        </div>
      )}

      {showModal && <ProductModal />}
    </div>
  );
};

const ProductsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 w-48 bg-neutral-200 rounded" />
    <div className="grid grid-cols-5 gap-4"><div className="h-24 bg-neutral-200 rounded-xl" /></div>
    <div className="h-16 bg-neutral-200 rounded-xl" />
    <div className="grid grid-cols-4 gap-5"><div className="h-80 bg-neutral-200 rounded-xl" /></div>
  </div>
);

export default AdminProducts;