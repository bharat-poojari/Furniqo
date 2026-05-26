import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiStar, FiUser, FiCalendar, FiThumbsUp, 
  FiMessageCircle, FiFlag, FiCheck, FiX,
  FiSearch, FiClock, FiCamera, FiSend,
  FiArrowRight, FiSettings, FiGlobe, FiShield, FiZap, 
  FiSmile, FiLoader, FiImage, FiTrash2, FiPlus,
  FiChevronLeft, FiChevronRight, FiTrendingUp, FiAward, FiHeart
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';

// Memoized Star Rating Component
const StarRating = memo(({ rating, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={`${sizeClasses[size]} ${
            i < rating 
              ? 'fill-amber-400 text-amber-400' 
              : 'text-neutral-300 dark:text-neutral-600'
          }`}
        />
      ))}
    </div>
  );
});

StarRating.displayName = 'StarRating';

// Memoized Review Card Component
const ReviewCard = memo(({ review, isLiked, onLike, onReport, onImageClick }) => {
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localHelpful, setLocalHelpful] = useState(review.helpful || 0);

  useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);

  const handleLikeClick = useCallback(() => {
    const newLiked = !localLiked;
    setLocalLiked(newLiked);
    setLocalHelpful(prev => newLiked ? prev + 1 : prev - 1);
    onLike(review.id);
  }, [localLiked, onLike, review.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-neutral-900 rounded-xl p-4 sm:p-5 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img 
              src={review.avatar} 
              alt={review.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-900"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=6366f1&color=fff`;
              }}
            />
            {review.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full w-3 h-3 border-2 border-white dark:border-neutral-900" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                {review.name}
              </h3>
              {review.verified && (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <FiCheck className="w-2.5 h-2.5" />
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
              <FiCalendar className="w-3 h-3" />
              <span>{new Date(review.date).toLocaleDateString()}</span>
              {review.location && (
                <>
                  <span>•</span>
                  <span>{review.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      
      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-base sm:text-lg mb-2 text-neutral-900 dark:text-white">
          {review.title}
        </h4>
      )}
      
      {/* Review Content */}
      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-3">
        {review.review}
      </p>
      
      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {review.images.map((image, imgIdx) => (
            <motion.button
              key={imgIdx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onImageClick(image)}
              className="relative group"
            >
              <img 
                src={image} 
                alt={`Review ${imgIdx + 1}`}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <FiImage className="w-5 h-5 text-white" />
              </div>
            </motion.button>
          ))}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={handleLikeClick}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            localLiked 
              ? 'text-primary-600' 
              : 'text-neutral-500 hover:text-primary-600'
          }`}
        >
          <FiThumbsUp className="w-3.5 h-3.5" />
          Helpful ({localHelpful})
        </button>
        <button
          onClick={() => onReport(review.id)}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-red-500 transition-colors"
        >
          <FiFlag className="w-3.5 h-3.5" />
          Report
        </button>
      </div>
    </motion.div>
  );
});

ReviewCard.displayName = 'ReviewCard';

// Image Lightbox Component
const ImageLightbox = ({ image, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-primary-400 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>
        <img 
          src={image} 
          alt="Full size"
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
      </motion.div>
    </motion.div>
  );
};

// Write Review Modal Component
const WriteReviewModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    title: '',
    review: '',
    images: []
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    setUploadingImages(true);
    
    const newImages = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        continue;
      }
      
      const previewUrl = URL.createObjectURL(file);
      newImages.push({
        file: file,
        preview: previewUrl,
        url: null
      });
    }
    
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages]
    });
    setUploadingImages(false);
    
    if (newImages.length > 0) {
      toast.success(`${newImages.length} image(s) added`);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const imageToRemove = formData.images[indexToRemove];
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!formData.review.trim()) {
      toast.error('Please write your review');
      return;
    }
    
    await onSubmit(formData);
    
    // Clean up preview URLs
    formData.images.forEach(image => {
      if (image.preview) URL.revokeObjectURL(image.preview);
    });
    
    setFormData({
      name: '',
      email: '',
      rating: 0,
      title: '',
      review: '',
      images: []
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-2xl w-full bg-white dark:bg-neutral-900 rounded-xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FiStar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Write a Review</h3>
              <p className="text-white/80 text-sm">Share your experience with photos</p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-12rem)] p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <FiStar 
                      className={`w-6 h-6 transition-all ${
                        rating <= (hoveredRating || formData.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Title (Optional)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                placeholder="Summarize your experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Your Review *
              </label>
              <textarea
                name="review"
                rows="4"
                required
                value={formData.review}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Tell us about your experience..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Add Photos (Optional, up to 5)
              </label>
              
              {formData.images.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {formData.images.map((image, idx) => (
                    <div key={idx} className="relative group">
                      <img 
                        src={image.preview} 
                        alt={`Preview ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {formData.images.length < 5 && (
                <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImages}
                  />
                  {uploadingImages ? (
                    <FiLoader className="w-5 h-5 animate-spin text-primary-500" />
                  ) : (
                    <FiPlus className="w-5 h-5 text-neutral-500" />
                  )}
                  <span className="text-sm text-neutral-500">
                    {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                  </span>
                </label>
              )}
              <p className="text-xs text-neutral-400 mt-1">
                Max 5 images, each up to 5MB. JPG, PNG, GIF supported.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
              <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <FiShield className="w-3 h-3" />
                Your review will be published after admin approval. Thank you for your feedback!
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <div className="flex items-center gap-2 justify-center">
                    <FiLoader className="w-3 h-3 animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    Submit Review
                    <FiSend className="ml-2 w-3 h-3" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Reviews Component
const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedReviews, setLikedReviews] = useState({});
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    recommendPercentage: 0
  });

  // Load likes from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('furniqo_liked_reviews');
    if (savedLikes) {
      try {
        setLikedReviews(JSON.parse(savedLikes));
      } catch (e) {
        console.error('Failed to parse saved likes:', e);
      }
    }
  }, []);

  // Save likes to localStorage
  const handleLike = useCallback((reviewId) => {
    setLikedReviews(prev => {
      const updated = {
        ...prev,
        [reviewId]: !prev[reviewId]
      };
      localStorage.setItem('furniqo_liked_reviews', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Fetch reviews from API
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      console.log('📡 Fetching reviews from API...');
      const response = await apiWrapper.getTestimonials();
      
      let reviewsArray = [];
      
      // Handle different response formats
      if (response?.success && Array.isArray(response.testimonials)) {
        reviewsArray = response.testimonials;
      } else if (response?.success && Array.isArray(response.data)) {
        reviewsArray = response.data;
      } else if (response?.data?.success && Array.isArray(response.data?.data)) {
        reviewsArray = response.data.data;
      } else if (Array.isArray(response)) {
        reviewsArray = response;
      }
      
      if (reviewsArray.length > 0) {
        // Filter only verified testimonials
        const verifiedReviews = reviewsArray.filter(r => r.verified === 1 || r.verified === true);
        
        const formattedReviews = verifiedReviews.map(review => ({
          id: review._id || review.id,
          name: review.name || 'Anonymous',
          email: review.email || '',
          rating: review.rating || 5,
          title: review.title || '',
          review: review.content || '',
          images: review.images || [],
          date: review.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          verified: true,
          helpful: review.helpful || review.likes || 0,
          location: review.location || '',
          avatar: review.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name || 'User')}&background=6366f1&color=fff`
        }));
        
        setReviews(formattedReviews);
        
        // Calculate stats
        const avgRating = formattedReviews.reduce((sum, r) => sum + r.rating, 0) / formattedReviews.length;
        const recommendCount = formattedReviews.filter(r => r.rating >= 4).length;
        const recommendPercent = Math.round((recommendCount / formattedReviews.length) * 100);
        
        setStats({
          averageRating: avgRating.toFixed(1),
          totalReviews: formattedReviews.length,
          recommendPercentage: recommendPercent
        });
        
        console.log(`✅ Loaded ${formattedReviews.length} verified reviews`);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Upload images to server
  const uploadImages = async (images) => {
    const uploadedUrls = [];
    
    for (const image of images) {
      if (image.url) {
        uploadedUrls.push(image.url);
      } else if (image.file) {
        try {
          const formData = new FormData();
          formData.append('image', image.file);
          
          const response = await apiWrapper.uploadImage?.(formData);
          if (response?.success && response?.url) {
            uploadedUrls.push(response.url);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    }
    
    return uploadedUrls;
  };

  // Submit review
  const handleSubmitReview = async (formData) => {
    setIsSubmitting(true);
    
    try {
      let uploadedImageUrls = [];
      if (formData.images.length > 0) {
        toast.loading('Uploading images...', { id: 'upload' });
        uploadedImageUrls = await uploadImages(formData.images);
        toast.success(`${uploadedImageUrls.length} image(s) uploaded`, { id: 'upload' });
      }
      
      const reviewData = {
        name: formData.name,
        email: formData.email,
        content: formData.review,
        rating: formData.rating,
        title: formData.title || 'Customer Review',
        images: uploadedImageUrls,
        verified: false
      };
      
      const response = await apiWrapper.createTestimonial(reviewData);
      
      if (response?.success) {
        toast.success('Thank you! Your review will be published after admin approval.');
        setShowWriteReview(false);
        await fetchReviews(); // Refresh the list
      } else {
        throw new Error(response?.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.title?.toLowerCase().includes(term) ||
        r.review?.toLowerCase().includes(term) ||
        r.name?.toLowerCase().includes(term)
      );
    }
    
    if (ratingFilter > 0) {
      filtered = filtered.filter(r => r.rating === ratingFilter);
    }
    
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [reviews, searchTerm, ratingFilter, sortBy]);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      dist[r.rating]++;
    });
    return dist;
  }, [reviews]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <div className="w-full px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                ))}
              </div>
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-40 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                  ))}
                </div>
                <div className="lg:col-span-3 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Modern Hero Section with Image Background */}
      <section className="relative w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80"
            alt="Customer Reviews"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-primary-900/80" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/5 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
              }}
              animate={{
                y: [null, -100, -200],
                opacity: [0, 0.3, 0],
                scale: [0, 1, 0],
                x: [null, Math.random() * 100 - 50],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative py-20 sm:py-28 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <div className="flex -space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white dark:border-neutral-900 flex items-center justify-center">
                    <FiUser className="w-3 h-3 text-white" />
                  </div>
                ))}
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5">
                <div className="flex items-center gap-2 text-sm text-white">
                  <FiStar className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span className="font-medium">{stats.averageRating || '4.9'} out of 5</span>
                  <span className="text-white/60">•</span>
                  <span className="text-white/80">{stats.totalReviews || '10,000+'}+ Reviews</span>
                </div>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight"
            >
              What Our Customers
              <span className="block bg-gradient-to-r from-primary-400 via-yellow-400 to-primary-400 bg-clip-text text-transparent">
                Really Think
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
            >
              Join thousands of happy customers who have transformed their homes with Furniqo's quality furniture and exceptional service.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-6 mb-8"
            >
              {[
                { value: stats.averageRating || '4.9', label: 'Average Rating', icon: FiStar },
                { value: stats.totalReviews || '10k+', label: 'Happy Customers', icon: FiSmile },
                { value: '98%', label: 'Would Recommend', icon: FiTrendingUp },
                { value: '24/7', label: 'Support', icon: FiClock }
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
                  <stat.icon className="w-4 h-4 text-primary-400" />
                  <div>
                    <div className="text-white font-bold">{stat.value}</div>
                    <div className="text-white/60 text-xs">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setShowWriteReview(true)}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <FiStar className="mr-2" />
                Write a Review
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
              >
                <FiHeart className="mr-2" />
                Read Customer Stories
              </Button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1 h-2 bg-white rounded-full mt-2"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="currentColor" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" className="text-white dark:text-neutral-950"/>
          </svg>
        </div>
      </section>

      {/* Stats Section - Floating Cards */}
      <div className="w-full px-4 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: stats.averageRating, label: 'Overall Rating', icon: FiStar, suffix: '/5', color: 'from-amber-500 to-orange-500' },
              { value: stats.totalReviews, label: 'Total Reviews', icon: FiMessageCircle, color: 'from-blue-500 to-cyan-500' },
              { value: `${stats.recommendPercentage}%`, label: 'Recommend', icon: FiThumbsUp, color: 'from-green-500 to-emerald-500' },
              { value: '24h', label: 'Avg Response', icon: FiClock, color: 'from-purple-500 to-pink-500' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}{stat.suffix || ''}
                </div>
                <div className="text-xs text-neutral-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="w-full px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                {/* Search */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-semibold text-sm mb-3 dark:text-white flex items-center gap-2">
                    <FiSearch className="w-4 h-4 text-primary-600" />
                    Search Reviews
                  </h3>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-neutral-800"
                  />
                </div>

                {/* Rating Filter */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-semibold text-sm mb-3 dark:text-white flex items-center gap-2">
                    <FiStar className="w-4 h-4 text-primary-600" />
                    Filter by Rating
                  </h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                          ratingFilter === rating 
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span>({ratingDistribution[rating]})</span>
                        </div>
                        {ratingFilter === rating && <FiCheck className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-semibold text-sm mb-3 dark:text-white flex items-center gap-2">
                    <FiSettings className="w-4 h-4 text-primary-600" />
                    Sort By
                  </h3>
                  <div className="space-y-1">
                    {[
                      { value: 'recent', label: 'Most Recent' },
                      { value: 'highest', label: 'Highest Rated' },
                      { value: 'lowest', label: 'Lowest Rated' },
                      { value: 'helpful', label: 'Most Helpful' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                          sortBy === option.value 
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          {sortBy === option.value && <FiCheck className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {(searchTerm || ratingFilter > 0) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setRatingFilter(0);
                      setSortBy('recent');
                    }}
                    className="w-full py-2 text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="lg:col-span-3">
              {filteredReviews.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-500">{filteredReviews.length} reviews found</p>
                  {filteredReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      isLiked={likedReviews[review.id] || false}
                      onLike={handleLike}
                      onReport={() => toast.success('Report submitted')}
                      onImageClick={setSelectedImage}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <FiSearch className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-1">No reviews found</h3>
                  <p className="text-sm text-neutral-500 mb-4">Try adjusting your filters</p>
                  <Button variant="outline" size="sm" onClick={() => {
                    setSearchTerm('');
                    setRatingFilter(0);
                    setSortBy('recent');
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmitting}
      />

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <ImageLightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reviews;