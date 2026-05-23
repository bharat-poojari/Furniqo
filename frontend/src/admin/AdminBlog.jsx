// AdminBlog.jsx - Complete blog management
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiImage, FiX, FiSave, FiCalendar, FiUser, FiTag, FiRefreshCw, FiSearch } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import apiWrapper from '../services/apiWrapper';
import { toast } from 'react-hot-toast';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', featuredImage: '', category: '',
    tags: [], author: '', readTime: 5, isPublished: false, isFeatured: false, seo: { title: '', description: '' }
  });
  const [uploading, setUploading] = useState(false);

  const categories = ['Design Tips', 'Trends', 'Home Office', 'Sustainability', 'Style Guide', 'Buying Guides', 'Kids Room', 'Outdoor Living', 'DIY', 'Bedroom', 'Color Theory', 'Small Spaces'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await apiWrapper.getBlogPosts();
      setPosts(response?.data?.posts || []);
    } catch (error) {
      toast.error('Failed to load blog posts');
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
      setFormData(prev => ({ ...prev, featuredImage: response.data.url }));
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
        await apiWrapper.createBlogPost(formData);
        toast.success('Blog post created');
      } else {
        await apiWrapper.updateBlogPost(selectedPost._id, formData);
        toast.success('Blog post updated');
      }
      fetchPosts();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save blog post');
    }
  };

  const handleDelete = async (post) => {
    if (window.confirm(`Delete "${post.title}"?`)) {
      try {
        await apiWrapper.deleteBlogPost(post._id);
        toast.success('Blog post deleted');
        fetchPosts();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleTogglePublish = async (post) => {
    try {
      await apiWrapper.updateBlogPost(post._id, { isPublished: !post.isPublished });
      toast.success(`Post ${!post.isPublished ? 'published' : 'unpublished'}`);
      fetchPosts();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', slug: '', excerpt: '', content: '', featuredImage: '', category: '',
      tags: [], author: 'Admin', readTime: 5, isPublished: false, isFeatured: false, seo: { title: '', description: '' }
    });
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => post.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [posts, searchTerm]);

  const BlogModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-neutral-900 p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{modalMode === 'create' ? 'Create Blog Post' : 'Edit Blog Post'}</h2>
          <button onClick={() => { setShowModal(false); resetForm(); }}><FiX className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full p-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full p-2.5 border rounded-xl bg-neutral-50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-2.5 border rounded-xl">
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Read Time (minutes)</label>
              <input type="number" value={formData.readTime} onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })} className="w-full p-2.5 border rounded-xl" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea rows={2} value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full p-2.5 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Featured Image</label>
            <div className="flex gap-3 items-center">
              {formData.featuredImage && <img src={formData.featuredImage} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />}
              <label className="flex-1 px-4 py-2 border rounded-xl text-center cursor-pointer">{uploading ? 'Uploading...' : 'Upload Image'}<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} /></label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content *</label>
            <ReactQuill theme="snow" value={formData.content} onChange={(val) => setFormData({ ...formData, content: val })} className="h-64 mb-12" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} /><span>Published</span></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} /><span>Featured</span></label>
          </div>
          <button onClick={handleSave} className="w-full py-2.5 bg-primary-600 text-white rounded-xl"><FiSave className="inline mr-2" />{modalMode === 'create' ? 'Create Post' : 'Save Changes'}</button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Blog Management</h1><p className="text-sm text-neutral-500">Create and manage blog content</p></div>
        <button onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl"><FiPlus />New Post</button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" placeholder="Search posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-xl" /></div>
        <button onClick={fetchPosts} className="px-4 py-2.5 border rounded-xl"><FiRefreshCw /></button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.map((post, idx) => (
          <motion.div key={post._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white dark:bg-neutral-900 rounded-xl border p-4">
            <div className="flex gap-4">
              {post.featuredImage && <img src={post.featuredImage} alt="" className="w-32 h-32 rounded-lg object-cover" />}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <div className="flex gap-4 text-sm text-neutral-500 mt-1">
                  <span className="flex items-center gap-1"><FiCalendar className="h-3 w-3" />{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><FiUser className="h-3 w-3" />{post.author}</span>
                  <span className="flex items-center gap-1"><FiTag className="h-3 w-3" />{post.category}</span>
                </div>
                <p className="text-sm text-neutral-500 mt-2 line-clamp-2">{post.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.open(`/blog/${post.slug}`, '_blank')} className="p-2 rounded-lg hover:bg-neutral-100"><FiEye /></button>
                <button onClick={() => { setSelectedPost(post); setFormData(post); setModalMode('edit'); setShowModal(true); }} className="p-2 rounded-lg hover:bg-neutral-100"><FiEdit2 /></button>
                <button onClick={() => handleTogglePublish(post)} className={`p-2 rounded-lg ${post.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>{post.isPublished ? 'Published' : 'Draft'}</button>
                <button onClick={() => handleDelete(post)} className="p-2 rounded-lg hover:bg-red-100 text-red-600"><FiTrash2 /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && <BlogModal />}
    </div>
  );
};

export default AdminBlog;