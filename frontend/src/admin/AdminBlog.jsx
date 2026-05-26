// AdminBlog.jsx - Complete blog management with mobile responsive compact design (No Refresh on Input)
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit2, FiTrash2, FiEye, FiImage, FiX, FiSave, 
  FiCalendar, FiUser, FiTag, FiRefreshCw, FiSearch, FiLoader,
  FiClock, FiExternalLink, FiGrid, FiList, FiFileText,
  FiChevronLeft, FiChevronRight, FiUpload
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import MediaLibraryPicker from '../components/common/MediaLibraryPicker';
import { getUploadUrl } from '../utils/uploadResponseUtils';
import { API_BASE_URL } from '../utils/constants';
import toast from 'react-hot-toast';

// Rich text editor component
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, isMounted]);
  
  const handleInput = useCallback((e) => {
    onChange(e.currentTarget.innerHTML);
  }, [onChange]);
  
  const execCommand = useCallback((command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  }, [onChange]);
  
  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 font-bold text-sm min-w-[32px]" title="Bold">B</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 italic text-sm min-w-[32px]" title="Italic">I</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 underline text-sm min-w-[32px]" title="Underline">U</button>
        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1 hidden sm:block"></div>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm min-w-[32px]" title="Bullet List">•</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCommand('insertOrderedList'); }} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm min-w-[32px]" title="Numbered List">1.</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); const url = prompt('Enter URL:', 'https://'); if (url) execCommand('createLink', url); }} className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm min-w-[32px]" title="Insert Link">🔗</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="editor-content p-3 min-h-[250px] focus:outline-none prose prose-sm max-w-none dark:prose-invert text-sm"
        data-placeholder={placeholder}
        style={{ whiteSpace: 'pre-wrap' }}
      />
      <style>{`
        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
        @media (max-width: 640px) {
          .editor-content {
            min-height: 200px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

// Mobile card component
const MobileBlogCard = ({ post, onView, onEdit, onDelete }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
    <div className="relative h-40 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      {post.image ? (
        <img 
          src={post.imageUrl || post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400/eee/999?text=${encodeURIComponent(post.title || 'No Image')}`;
          }}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
          <FiImage className="h-8 w-8 mb-1" />
          <span className="text-xs">No image</span>
        </div>
      )}
      <div className="absolute top-2 right-2">
        {post.featured ? (
          <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-white font-medium">Featured</span>
        ) : (
          <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">Published</span>
        )}
      </div>
    </div>
    
    <div className="p-3">
      <div className="flex items-center gap-1 text-[11px] text-neutral-500 mb-1.5 flex-wrap">
        <span className="flex items-center gap-0.5"><FiCalendar className="h-2.5 w-2.5" />{post.date || new Date(post.createdAt).toLocaleDateString()}</span>
        <span>•</span>
        <span className="flex items-center gap-0.5"><FiClock className="h-2.5 w-2.5" />{post.readTime || '5 min'}</span>
      </div>
      
      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{post.title}</h3>
      
      {post.category && (
        <span className="inline-block px-1.5 py-0.5 text-[10px] rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 mb-1.5">
          {post.category}
        </span>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-1 text-xs text-neutral-500">
          <FiUser className="h-3 w-3" />
          <span className="text-[11px]">{post.author || 'Admin'}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={onView} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800" title="View">
            <FiEye className="h-3.5 w-3.5" />
          </button>
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Edit">
            <FiEdit2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500" title="Delete">
            <FiTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Desktop grid card
const DesktopBlogCard = ({ post, onView, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all duration-300"
  >
    <div className="relative h-48 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      {post.image ? (
        <img 
          src={post.imageUrl || post.image} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400/eee/999?text=${encodeURIComponent(post.title || 'No Image')}`;
          }}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
          <FiImage className="h-12 w-12 mb-2" />
          <span className="text-xs">No image</span>
        </div>
      )}
      <div className="absolute top-2 right-2">
        {post.featured ? (
          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500 text-white font-medium">Featured</span>
        ) : (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">Published</span>
        )}
      </div>
    </div>
    
    <div className="p-4">
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2 flex-wrap">
        <span className="flex items-center gap-1"><FiCalendar className="h-3 w-3" />{post.date || new Date(post.createdAt).toLocaleDateString()}</span>
        <span>•</span>
        <span className="flex items-center gap-1"><FiClock className="h-3 w-3" />{post.readTime || '5 min read'}</span>
      </div>
      
      <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {post.title}
      </h3>
      
      {post.category && (
        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 mb-2">
          {post.category}
        </span>
      )}
      
      <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-3">
        {post.excerpt || (post.content?.replace(/<[^>]*>/g, '').substring(0, 120))}
      </p>
      
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-1 text-sm text-neutral-500">
          <FiUser className="h-3 w-3" />
          <span>{post.author || 'Admin'}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={onView} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" title="View">
            <FiEye className="h-4 w-4" />
          </button>
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" title="Edit">
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500" title="Delete">
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAuthorImage, setUploadingAuthorImage] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const searchTimeoutRef = useRef(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formTags, setFormTags] = useState([]);
  const [formAuthor, setFormAuthor] = useState('');
  const [formAuthorRole, setFormAuthorRole] = useState('Contributor');
  const [formAuthorImage, setFormAuthorImage] = useState('');
  const [formReadTime, setFormReadTime] = useState('5 min read');
  const [formFeatured, setFormFeatured] = useState(false);

  const categories = [
    'Design Tips', 'Trends', 'Home Office', 'Sustainability', 
    'Style Guide', 'Buying Guides', 'Kids Room', 'Outdoor Living', 
    'DIY', 'Bedroom', 'Color Theory', 'Small Spaces', 'Lighting',
    'Furniture Care', 'Space Planning', 'Seasonal Decor'
  ];

  const apiUrl = API_BASE_URL;

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setItemsPerPage(window.innerWidth < 640 ? 6 : 9);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Debounced search - no refresh on each keystroke
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (searchInput !== searchTerm) {
        setSearchTerm(searchInput);
      }
    }, 500);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput]);

  // Fetch when search term or category changes
  useEffect(() => {
    if (!loading) {
      fetchPosts();
    }
  }, [searchTerm, selectedCategory]);

  const fetchPosts = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      
      const response = await apiWrapper.getBlogPosts({
        search: searchTerm || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      });
      
      let postsData = [];
      
      if (response?.posts && Array.isArray(response.posts)) {
        postsData = response.posts;
      } else if (response?.data?.posts && Array.isArray(response.data.posts)) {
        postsData = response.data.posts;
      } else if (response?.data && Array.isArray(response.data)) {
        postsData = response.data;
      } else if (Array.isArray(response)) {
        postsData = response;
      }
      
      // Process image URLs
      const baseWithoutApi = apiUrl.replace('/api/v1', '');
      const processedPosts = postsData.map(post => ({
        ...post,
        imageUrl: post.image ? (post.image.startsWith('http') ? post.image : `${baseWithoutApi}${post.image}`) : null,
        authorImageUrl: post.authorImage ? (post.authorImage.startsWith('http') ? post.authorImage : `${baseWithoutApi}${post.authorImage}`) : null
      }));
      
      setPosts(processedPosts);
      setCurrentPage(1);
      
      if (showRefresh) toast.success('Blog posts refreshed');
    } catch (error) {
      console.error('Fetch error:', error);
      if (!showRefresh) toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchPosts(true);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const baseWithoutApi = apiUrl.replace('/api/v1', '');
    return `${baseWithoutApi}${imagePath}`;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    
    setUploadingImage(true);
    const loadingToast = toast.loading('Uploading image...');
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiWrapper.uploadImage(formData);
      const imageUrl = getUploadUrl(response);
      if (!imageUrl) throw new Error('No image URL returned from server');
      setFormImage(imageUrl);
      toast.success('Image uploaded successfully', { id: loadingToast });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image: ' + (error?.message || 'Unknown error'), { id: loadingToast });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAuthorImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    setUploadingAuthorImage(true);
    const loadingToast = toast.loading('Uploading author image...');
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiWrapper.uploadImage(formData);
      const imageUrl = getUploadUrl(response);
      if (!imageUrl) throw new Error('No image URL returned from server');
      setFormAuthorImage(imageUrl);
      toast.success('Author image uploaded successfully', { id: loadingToast });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload author image: ' + (error?.message || 'Unknown error'), { id: loadingToast });
    } finally {
      setUploadingAuthorImage(false);
      e.target.value = '';
    }
  };

  const removeImage = () => setFormImage('');
  const removeAuthorImage = () => setFormAuthorImage('');

  const handleAddTag = () => {
    if (tagInput.trim() && !formTags.includes(tagInput.trim())) {
      setFormTags([...formTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormTags(formTags.filter(tag => tag !== tagToRemove));
  };

  const resetForm = () => {
    setFormTitle('');
    setFormSlug('');
    setFormExcerpt('');
    setFormContent('');
    setFormImage('');
    setFormCategory('');
    setFormTags([]);
    setFormAuthor('');
    setFormAuthorRole('Contributor');
    setFormAuthorImage('');
    setFormReadTime('5 min read');
    setFormFeatured(false);
    setTagInput('');
    setSelectedPost(null);
  };

  const handleSave = async () => {
    if (!formTitle.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formContent.trim()) {
      toast.error('Content is required');
      return;
    }

    const plainText = formContent.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(/\s+/).length;
    const calculatedReadTime = Math.ceil(wordCount / 200);
    
    const saveData = {
      title: formTitle.trim(),
      slug: formSlug || generateSlug(formTitle),
      excerpt: formExcerpt || plainText.substring(0, 200),
      content: formContent,
      image: formImage,
      category: formCategory,
      tags: formTags,
      author: formAuthor || 'Admin',
      authorRole: formAuthorRole,
      authorImage: formAuthorImage,
      readTime: formReadTime || `${calculatedReadTime} min read`,
      featured: formFeatured,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      setSaving(true);
      const loadingToast = toast.loading(modalMode === 'create' ? 'Creating blog post...' : 'Updating blog post...');
      
      let response;
      if (modalMode === 'create') {
        response = await apiWrapper.createBlogPost(saveData);
      } else {
        response = await apiWrapper.updateBlogPost(selectedPost._id, saveData);
      }
      
      if (response?.success !== false) {
        toast.success(modalMode === 'create' ? 'Blog post created successfully' : 'Blog post updated successfully', { id: loadingToast });
        await fetchPosts();
        setShowModal(false);
        resetForm();
      } else {
        throw new Error(response?.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      try {
        setLoading(true);
        const response = await apiWrapper.deleteBlogPost(post._id);
        if (response?.success !== false) {
          toast.success('Blog post deleted successfully');
          await fetchPosts();
        } else {
          throw new Error(response?.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.message || 'Failed to delete blog post');
      } finally {
        setLoading(false);
      }
    }
  };

  const editPost = (post) => {
    setSelectedPost(post);
    setFormTitle(post.title || '');
    setFormSlug(post.slug || '');
    setFormExcerpt(post.excerpt || '');
    setFormContent(post.content || '');
    setFormImage(post.image || '');
    setFormCategory(post.category || '');
    setFormTags(post.tags || []);
    setFormAuthor(post.author || '');
    setFormAuthorRole(post.authorRole || 'Contributor');
    setFormAuthorImage(post.authorImage || '');
    setFormReadTime(post.readTime || '5 min read');
    setFormFeatured(post.featured === true || post.featured === 1);
    setModalMode('edit');
    setShowModal(true);
  };

  const createNewPost = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(term) ||
        post.excerpt?.toLowerCase().includes(term) ||
        post.category?.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    return filtered;
  }, [posts, searchTerm, selectedCategory]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(start, start + itemsPerPage);
  }, [filteredPosts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Blog Management</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">Create, edit, and manage your blog content</p>
        </div>
        <button 
          onClick={createNewPost} 
          className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm sm:text-base active:scale-95"
        >
          <FiPlus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">New Post</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
      
      {/* Filters - No refresh on input */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search posts..." 
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-neutral-800 transition"
          />
          {searchInput && searchInput !== searchTerm && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <FiLoader className="h-3 w-3 animate-spin text-primary-500" />
            </div>
          )}
        </div>
        
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
          className="px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-2 rounded-xl border transition-colors ${viewMode === 'grid' ? 'bg-primary-50 border-primary-300 text-primary-600 dark:bg-primary-900/30' : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
          >
            <FiGrid className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-2 rounded-xl border transition-colors ${viewMode === 'list' ? 'bg-primary-50 border-primary-300 text-primary-600 dark:bg-primary-900/30' : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
          >
            <FiList className="h-4 w-4" />
          </button>
          <button 
            onClick={handleRefresh} 
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors active:scale-95"
            disabled={refreshing}
          >
            <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border p-2.5 sm:p-4 text-center">
          <p className="text-lg sm:text-2xl font-bold">{posts.length}</p>
          <p className="text-[10px] sm:text-sm text-neutral-500">Total Posts</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl border p-2.5 sm:p-4 text-center">
          <p className="text-lg sm:text-2xl font-bold">{posts.filter(p => p.featured === true || p.featured === 1).length}</p>
          <p className="text-[10px] sm:text-sm text-neutral-500">Featured</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl border p-2.5 sm:p-4 text-center">
          <p className="text-lg sm:text-2xl font-bold">{filteredPosts.length}</p>
          <p className="text-[10px] sm:text-sm text-neutral-500">Filtered</p>
        </div>
      </div>
      
      {/* Posts Grid/List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white dark:bg-neutral-900 rounded-xl border">
          <FiFileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-neutral-400 mb-2" />
          <p className="text-sm text-neutral-500">No blog posts found</p>
          <button onClick={createNewPost} className="mt-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
            Create your first post →
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {paginatedPosts.map((post) => (
            isMobile ? (
              <MobileBlogCard 
                key={post._id}
                post={post}
                onView={() => window.open(`/blog/${post.slug}`, '_blank')}
                onEdit={() => editPost(post)}
                onDelete={() => handleDelete(post)}
              />
            ) : (
              <DesktopBlogCard 
                key={post._id}
                post={post}
                onView={() => window.open(`/blog/${post.slug}`, '_blank')}
                onEdit={() => editPost(post)}
                onDelete={() => handleDelete(post)}
              />
            )
          ))}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {paginatedPosts.map((post) => (
            <div key={post._id} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 sm:p-4">
              <div className="flex gap-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                  {post.image ? (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><FiImage className="h-5 w-5 text-neutral-400" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{post.title}</h3>
                    {post.featured && <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-white">Featured</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs text-neutral-500 mb-1">
                    <span className="flex items-center gap-0.5"><FiCalendar className="h-2.5 w-2.5" />{post.date || new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-0.5"><FiClock className="h-2.5 w-2.5" />{post.readTime || '5 min'}</span>
                    {post.category && <span className="flex items-center gap-0.5"><FiTag className="h-2.5 w-2.5" />{post.category}</span>}
                  </div>
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => window.open(`/blog/${post.slug}`, '_blank')} className="p-1 rounded hover:bg-neutral-100"><FiExternalLink className="h-3.5 w-3.5" /></button>
                    <button onClick={() => editPost(post)} className="p-1 rounded hover:bg-neutral-100"><FiEdit2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(post)} className="p-1 rounded hover:bg-red-100 text-red-500"><FiTrash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 sm:gap-2 pt-4">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1} 
            className="p-1.5 sm:p-2 rounded-lg border disabled:opacity-50 active:scale-95 transition"
          >
            <FiChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(isMobile ? 3 : 5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= (isMobile ? 3 : 5)) pageNum = i + 1;
              else if (currentPage <= (isMobile ? 2 : 3)) pageNum = i + 1;
              else if (currentPage >= totalPages - (isMobile ? 1 : 2)) pageNum = totalPages - (isMobile ? 2 : 4) + i;
              else pageNum = currentPage - (isMobile ? 1 : 2) + i;
              return (
                <button 
                  key={pageNum} 
                  onClick={() => setCurrentPage(pageNum)} 
                  className={`min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 rounded-lg border transition-colors text-sm active:scale-95 ${
                    currentPage === pageNum 
                      ? 'bg-primary-600 text-white border-primary-600' 
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages} 
            className="p-1.5 sm:p-2 rounded-lg border disabled:opacity-50 active:scale-95 transition"
          >
            <FiChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      )}
      
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white dark:bg-neutral-900 p-3 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">{modalMode === 'create' ? 'Create New Post' : 'Edit Post'}</h2>
                  <p className="text-xs sm:text-sm text-neutral-500 hidden sm:block">{modalMode === 'create' ? 'Fill in the details below to publish a new article' : 'Update your article'}</p>
                </div>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1.5 sm:p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              
              <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Title *</label>
                      <input 
                        type="text" 
                        value={formTitle} 
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setFormTitle(newTitle);
                          if (!formSlug) setFormSlug(generateSlug(newTitle));
                        }} 
                        placeholder="Enter post title..."
                        className="w-full p-2.5 sm:p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 transition"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Slug</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={formSlug} 
                          onChange={(e) => setFormSlug(e.target.value)} 
                          placeholder="url-friendly-slug"
                          className="flex-1 p-2.5 sm:p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 transition"
                        />
                        <button 
                          onClick={() => setFormSlug(generateSlug(formTitle))}
                          className="px-3 py-2 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors active:scale-95"
                        >
                          <FiRefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Excerpt</label>
                      <textarea 
                        rows={2} 
                        value={formExcerpt} 
                        onChange={(e) => setFormExcerpt(e.target.value)} 
                        placeholder="Brief summary of the post..."
                        className="w-full p-2.5 sm:p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 transition"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Category</label>
                      <select 
                        value={formCategory} 
                        onChange={(e) => setFormCategory(e.target.value)} 
                        className="w-full p-2.5 sm:p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Read Time</label>
                      <input 
                        type="text" 
                        value={formReadTime} 
                        onChange={(e) => setFormReadTime(e.target.value)} 
                        placeholder="e.g., 5 min read"
                        className="w-full p-2.5 sm:p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 transition"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formFeatured} 
                          onChange={(e) => setFormFeatured(e.target.checked)} 
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm font-medium">Feature this post</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Featured Image</label>
                  <div className="flex flex-wrap gap-3 items-start">
                    {formImage && (
                      <div className="relative">
                        <img 
                          src={getImageUrl(formImage)} 
                          alt="Preview" 
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/600x400/eee/999?text=Invalid';
                          }}
                        />
                        <button 
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors active:scale-95"
                        >
                          <FiX className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <label className={`flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary-500 transition-colors ${uploadingImage ? 'opacity-50' : ''}`}>
                      {uploadingImage ? (
                        <FiLoader className="h-6 w-6 animate-spin text-primary-500" />
                      ) : (
                        <>
                          <FiUpload className="h-6 w-6 text-neutral-400" />
                          <span className="text-[10px] text-neutral-500 mt-1">Upload</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                    </label>
                  </div>
                  <MediaLibraryPicker
                    selected={formImage}
                    onSelect={(url) => setFormImage(url)}
                    multiple={false}
                    buttonText="Choose from library"
                    label="featured image"
                  />
                  <p className="text-[10px] sm:text-xs text-neutral-400 mt-1">Recommended: 1200x800px, max 5MB</p>
                </div>
                
                {/* Author Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Author Name</label>
                    <input 
                      type="text" 
                      value={formAuthor} 
                      onChange={(e) => setFormAuthor(e.target.value)} 
                      placeholder="Author name"
                      className="w-full p-2.5 sm:p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Author Role</label>
                    <input 
                      type="text" 
                      value={formAuthorRole} 
                      onChange={(e) => setFormAuthorRole(e.target.value)} 
                      placeholder="e.g., Design Expert"
                      className="w-full p-2.5 sm:p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 transition"
                    />
                  </div>
                </div>
                
                {/* Author Image */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Author Image</label>
                  <div className="flex flex-wrap gap-3 items-start">
                    {formAuthorImage && (
                      <div className="relative">
                        <img 
                          src={getImageUrl(formAuthorImage)} 
                          alt="Author" 
                          className="w-12 h-12 rounded-full object-cover border"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/100x100/eee/999?text=Author';
                          }}
                        />
                        <button 
                          onClick={removeAuthorImage}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors active:scale-95"
                        >
                          <FiX className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    )}
                    <label className={`flex flex-col items-center justify-center w-12 h-12 border-2 border-dashed rounded-full cursor-pointer hover:border-primary-500 transition-colors ${uploadingAuthorImage ? 'opacity-50' : ''}`}>
                      {uploadingAuthorImage ? (
                        <FiLoader className="h-4 w-4 animate-spin text-primary-500" />
                      ) : (
                        <FiUpload className="h-4 w-4 text-neutral-400" />
                      )}
                      <input type="file" accept="image/*" onChange={handleAuthorImageUpload} className="hidden" disabled={uploadingAuthorImage} />
                    </label>
                  </div>
                  <MediaLibraryPicker
                    selected={formAuthorImage}
                    onSelect={(url) => setFormAuthorImage(url)}
                    multiple={false}
                    buttonText="Choose from library"
                    label="author image"
                  />
                </div>
                
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tags</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formTags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 active:scale-95">
                          <FiX className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={tagInput} 
                      onChange={(e) => setTagInput(e.target.value)} 
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add a tag..."
                      className="flex-1 p-2.5 sm:p-3 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 transition"
                    />
                    <button onClick={handleAddTag} className="px-3 py-2 text-sm border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors active:scale-95">
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Content *</label>
                  <RichTextEditor 
                    value={formContent} 
                    onChange={setFormContent} 
                    placeholder="Write your blog post content here..."
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                  <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex-1 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95"
                  >
                    {saving ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiSave className="h-4 w-4" />}
                    {modalMode === 'create' ? 'Create & Publish' : 'Save Changes'}
                  </button>
                  <button 
                    onClick={() => { setShowModal(false); resetForm(); }} 
                    className="px-5 py-2.5 sm:py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm sm:text-base active:scale-95"
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

export default AdminBlog;