// AdminProducts.jsx - Optimized Product Management
import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiGrid, FiList,
  FiDollarSign, FiPackage, FiTag, FiStar, FiRefreshCw, FiX,
  FiImage, FiUpload, FiSave, FiEyeOff, FiCheckCircle, FiAlertCircle,
  FiTrendingUp, FiShoppingBag, FiClock, FiFilter, FiChevronDown,
  FiSliders, FiHash, FiBox, FiCpu, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { getUploadUrls } from '../utils/uploadResponseUtils';
import { toast } from 'react-hot-toast';

// Memoized Form Input Component to prevent re-renders
const FormInput = memo(({ label, name, value, onChange, type = 'text', placeholder, required, icon: Icon }) => (
  <div className="space-y-1.5">
    <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl",
          "bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "transition-all duration-200",
          Icon && "pl-9"
        )}
      />
    </div>
  </div>
));
FormInput.displayName = 'FormInput';

// Memoized TextArea Component
const FormTextArea = memo(({ label, value, onChange, rows = 4, placeholder }) => (
  <div className="space-y-1.5">
    <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
    />
  </div>
));
FormTextArea.displayName = 'FormTextArea';

// Memoized Select Component
const FormSelect = memo(({ label, value, onChange, options, placeholder }) => (
  <div className="space-y-1.5">
    <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
    >
      <option value="">{placeholder || 'Select...'}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
));
FormSelect.displayName = 'FormSelect';

// Memoized Product Card Component
const ProductCard = memo(({ product, onEdit, onToggleStatus, onDelete }) => {
  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400/eee/999?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.inStock === false && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">Inactive</span>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-lg">Featured</span>
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full shadow-lg">-{discount}%</span>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-neutral-500 font-mono">ID: {product._id?.slice(-8)}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-primary-600">${product.price?.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>
          <span className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-full",
            product.stock > 10 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
            product.stock > 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          )}>
            Stock: {product.stock}
          </span>
        </div>
        
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group/edit"
            title="Edit"
          >
            <FiEdit2 className="h-4 w-4 mx-auto text-neutral-600 dark:text-neutral-400 group-hover/edit:text-primary-600" />
          </button>
          <button
            onClick={() => onToggleStatus(product)}
            className="flex-1 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
            title={product.inStock ? 'Deactivate' : 'Activate'}
          >
            {product.inStock ? 
              <FiEyeOff className="h-4 w-4 mx-auto text-neutral-600" /> : 
              <FiCheckCircle className="h-4 w-4 mx-auto text-green-600" />
            }
          </button>
          <button
            onClick={() => onDelete(product)}
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
ProductCard.displayName = 'ProductCard';

// Memoized List Row Component
const ProductListRow = memo(({ product, onEdit, onDelete }) => (
  <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200">
    <td className="p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <img 
          src={product.images?.[0] || 'https://placehold.co/40x40/eee/999?text=No+Image'} 
          alt="" 
          className="w-10 h-10 rounded-lg object-cover" 
          loading="lazy"
        />
        <span className="font-medium text-xs sm:text-sm line-clamp-2 max-w-[150px] sm:max-w-[200px]">
          {product.name}
        </span>
      </div>
    </td>
    <td className="p-3 sm:p-4 text-[10px] sm:text-xs font-mono">{product._id?.slice(-8)}</td>
    <td className="p-3 sm:p-4 font-semibold text-primary-600 text-sm">${product.price?.toFixed(2)}</td>
    <td className="p-3 sm:p-4">
      <span className={cn(
        "inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full",
        product.stock > 10 ? "bg-green-100 text-green-700" :
        product.stock > 0 ? "bg-yellow-100 text-yellow-700" :
        "bg-red-100 text-red-700"
      )}>
        {product.stock}
      </span>
    </td>
    <td className="p-3 sm:p-4">
      <span className={cn(
        "inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full",
        product.inStock !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      )}>
        {product.inStock !== false ? 'Active' : 'Inactive'}
      </span>
    </td>
    <td className="p-3 sm:p-4">
      <div className="flex gap-1.5">
        <button onClick={() => onEdit(product)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
          <FiEdit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
        <button onClick={() => onDelete(product)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition">
          <FiTrash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </td>
  </tr>
));
ProductListRow.displayName = 'ProductListRow';

// cn helper function
const cn = (...classes) => classes.filter(Boolean).join(' ');

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
  const [modalMode, setModalMode] = useState('create');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [itemsPerPage] = useState(12);
  
  // Form state - isolated to prevent re-renders of entire component
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', shortDescription: '',
    price: '', originalPrice: '', category: '', subcategory: '',
    material: '', color: '', style: '', dimensions: '', weight: '',
    stock: 0, images: [], features: [], tags: [],
    featured: false, trending: false, bestSeller: false, newArrival: false, onSale: false
  });

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
      
      let productsData = [];
      if (productsRes?.success && productsRes?.products) productsData = productsRes.products;
      else if (productsRes?.data?.success && productsRes?.data?.products) productsData = productsRes.data.products;
      else if (Array.isArray(productsRes)) productsData = productsRes;
      else if (productsRes?.data && Array.isArray(productsRes.data)) productsData = productsRes.data;
      
      let categoriesData = [];
      if (categoriesRes?.success && categoriesRes?.categories) categoriesData = categoriesRes.categories;
      else if (categoriesRes?.data?.success && categoriesRes?.data?.categories) categoriesData = categoriesRes.data.categories;
      else if (Array.isArray(categoriesRes)) categoriesData = categoriesRes;
      else if (categoriesRes?.data && Array.isArray(categoriesRes.data)) categoriesData = categoriesRes.data;
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  // Isolated handlers to prevent re-renders
  const handleNameChange = useCallback((e) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name, slug: generateSlug(name) }));
  }, []);

  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleNumberChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }));
  }, []);

  const handleCheckboxChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.checked }));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchTerm === '' ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product._id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' ? product.inStock !== false : product.inStock === false);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const formDataObj = new FormData();
      files.forEach(file => formDataObj.append('images', file));
      const response = await apiWrapper.uploadImages(formDataObj);
      const urls = getUploadUrls(response);
      if (!urls.length) throw new Error('No image URLs returned');
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = useCallback((index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }, []);

  const addTag = useCallback(() => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  }, [newTag, formData.tags]);

  const removeTag = useCallback((tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  }, []);

  const addFeature = useCallback(() => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  }, [newFeature, formData.features]);

  const removeFeature = useCallback((feature) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== feature) }));
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || '',
        shortDescription: formData.shortDescription || '',
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category || null,
        subcategory: formData.subcategory || null,
        material: formData.material || null,
        color: formData.color || null,
        style: formData.style || null,
        dimensions: formData.dimensions || null,
        weight: formData.weight || null,
        stock: parseInt(formData.stock) || 0,
        images: formData.images || [],
        features: formData.features || [],
        tags: formData.tags || [],
        featured: formData.featured,
        trending: formData.trending,
        bestSeller: formData.bestSeller,
        newArrival: formData.newArrival,
        onSale: formData.onSale
      };

      if (modalMode === 'create') {
        await apiWrapper.createProduct(productData);
        toast.success('Product created successfully');
      } else {
        await apiWrapper.updateProduct(selectedProduct._id, productData);
        toast.success('Product updated successfully');
      }
      
      await fetchData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = useCallback(async (product) => {
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      try {
        await apiWrapper.deleteProduct(product._id);
        toast.success('Product deleted');
        await fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  }, []);

  const handleToggleStatus = useCallback(async (product) => {
    try {
      await apiWrapper.updateProduct(product._id, { inStock: !product.inStock });
      toast.success(`Product ${!product.inStock ? 'activated' : 'deactivated'}`);
      await fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: '', slug: '', description: '', shortDescription: '',
      price: '', originalPrice: '', category: '', subcategory: '',
      material: '', color: '', style: '', dimensions: '', weight: '',
      stock: 0, images: [], features: [], tags: [],
      featured: false, trending: false, bestSeller: false, newArrival: false, onSale: false
    });
    setNewTag('');
    setNewFeature('');
  }, []);

  const openEditModal = useCallback((product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      material: product.material || '',
      color: product.color || '',
      style: product.style || '',
      dimensions: product.dimensions || '',
      weight: product.weight || '',
      stock: product.stock || 0,
      images: product.images || [],
      features: product.features || [],
      tags: product.tags || [],
      featured: product.featured === 1 || product.featured === true,
      trending: product.trending === 1 || product.trending === true,
      bestSeller: product.bestSeller === 1 || product.bestSeller === true,
      newArrival: product.newArrival === 1 || product.newArrival === true,
      onSale: product.onSale === 1 || product.onSale === true
    });
    setModalMode('edit');
    setShowModal(true);
  }, []);

  const categoryOptions = useMemo(() => 
    categories.map(cat => ({ value: cat.name || cat._id, label: cat.name }))
  , [categories]);

  if (loading) return <ProductsSkeleton />;

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all active:scale-95"
        >
          <FiPlus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Stats Cards - Mobile responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Total', value: products.length, color: 'text-primary-600' },
          { label: 'Active', value: products.filter(p => p.inStock !== false).length, color: 'text-green-600' },
          { label: 'Inactive', value: products.filter(p => p.inStock === false).length, color: 'text-red-600' },
          { label: 'Low Stock', value: products.filter(p => p.stock < 10 && p.stock > 0).length, color: 'text-yellow-600' },
          { label: 'Categories', value: categories.length, color: 'text-blue-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800">
            <p className="text-[10px] sm:text-xs text-neutral-500">{stat.label}</p>
            <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters - Mobile responsive */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name || cat._id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-primary-600' : 'text-neutral-500'}`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-primary-600' : 'text-neutral-500'}`}
            >
              <FiList className="h-4 w-4" />
            </button>
          </div>
          <button onClick={fetchData} className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 transition-all">
            <FiRefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          <AnimatePresence>
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={openEditModal}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Product</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">ID</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Price</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Stock</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Status</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <AnimatePresence>
                  {paginatedProducts.map((product) => (
                    <ProductListRow
                      key={product._id}
                      product={product}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
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

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-neutral-900 p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
                <h2 className="text-lg sm:text-xl font-bold">
                  {modalMode === 'create' ? 'Add New Product' : 'Edit Product'}
                </h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-neutral-100 transition">
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                {/* Basic Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <FiTag className="h-4 w-4 text-primary-500" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <FormInput
                      label="Product Name"
                      value={formData.name}
                      onChange={handleNameChange}
                      placeholder="Enter product name"
                      required
                    />
                    <FormInput
                      label="Slug"
                      value={formData.slug}
                      onChange={handleInputChange('slug')}
                      placeholder="auto-generated"
                    />
                    <FormInput
                      label="Short Description"
                      value={formData.shortDescription}
                      onChange={handleInputChange('shortDescription')}
                      placeholder="Brief description for product cards"
                    />
                    <FormTextArea
                      label="Full Description"
                      value={formData.description}
                      onChange={handleInputChange('description')}
                      rows={4}
                      placeholder="Detailed product description"
                    />
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <FiDollarSign className="h-4 w-4 text-primary-500" />
                    Pricing & Stock
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <FormInput
                      label="Price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleNumberChange('price')}
                      placeholder="0.00"
                      required
                      icon={FiDollarSign}
                    />
                    <FormInput
                      label="Original Price"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={handleNumberChange('originalPrice')}
                      placeholder="0.00"
                      icon={FiDollarSign}
                    />
                    <FormInput
                      label="Stock Quantity"
                      type="number"
                      value={formData.stock}
                      onChange={handleNumberChange('stock')}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Categories & Attributes */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <FiBox className="h-4 w-4 text-primary-500" />
                    Categories & Attributes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <FormSelect
                      label="Category"
                      value={formData.category}
                      onChange={handleInputChange('category')}
                      options={categoryOptions}
                      placeholder="Select Category"
                    />
                    <FormInput
                      label="Subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange('subcategory')}
                      placeholder="e.g., Sofas, Chairs"
                    />
                    <FormInput
                      label="Material"
                      value={formData.material}
                      onChange={handleInputChange('material')}
                      placeholder="e.g., Wood, Metal"
                    />
                    <FormInput
                      label="Color"
                      value={formData.color}
                      onChange={handleInputChange('color')}
                      placeholder="e.g., Black, White"
                    />
                    <FormInput
                      label="Style"
                      value={formData.style}
                      onChange={handleInputChange('style')}
                      placeholder="e.g., Modern, Classic"
                    />
                    <FormInput
                      label="Weight"
                      value={formData.weight}
                      onChange={handleInputChange('weight')}
                      placeholder="e.g., 10kg"
                    />
                    <div className="sm:col-span-2">
                      <FormInput
                        label="Dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange('dimensions')}
                        placeholder='e.g., 80"W x 36"D x 34"H'
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <FiHash className="h-4 w-4 text-primary-500" />
                    Tags
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1 p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
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

                {/* Features */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <FiCheckCircle className="h-4 w-4 text-primary-500" />
                    Key Features
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                      className="flex-1 p-2.5 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                      placeholder="Add feature..."
                    />
                    <button onClick={addFeature} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs">
                        <FiCheckCircle className="h-3 w-3" />
                        {feature}
                        <button onClick={() => removeFeature(feature)} className="text-green-500 hover:text-red-500">
                          <FiX className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <FiImage className="h-4 w-4 text-primary-500" />
                    Product Images
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Product ${idx}`} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <FiX className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition">
                      <FiUpload className="h-5 w-5 text-neutral-400" />
                      <span className="text-[10px] text-neutral-500">Upload</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                  {uploading && <p className="text-xs text-primary-600">Uploading...</p>}
                </div>

                {/* Product Flags */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <FiSliders className="h-4 w-4 text-primary-500" />
                    Product Flags
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {[
                      { label: 'Featured', field: 'featured' },
                      { label: 'Trending', field: 'trending' },
                      { label: 'Best Seller', field: 'bestSeller' },
                      { label: 'New Arrival', field: 'newArrival' },
                      { label: 'On Sale', field: 'onSale' },
                    ].map(({ label, field }) => (
                      <label key={field} className="flex items-center gap-2 p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:bg-neutral-50 transition">
                        <input
                          type="checkbox"
                          checked={formData[field]}
                          onChange={handleCheckboxChange(field)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-xs sm:text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <FiSave className="inline mr-2 h-4 w-4" />
                        {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
                      </>
                    )}
                  </button>
                  <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 transition">
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

const ProductsSkeleton = () => (
  <div className="space-y-4 sm:space-y-6 animate-pulse">
    <div className="flex justify-between">
      <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="h-10 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      ))}
    </div>
    <div className="h-14 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-80 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      ))}
    </div>
  </div>
);

export default AdminProducts;