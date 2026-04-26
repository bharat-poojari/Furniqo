import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiStar, FiUser, FiCalendar, FiThumbsUp, 
  FiMessageCircle, FiFlag, FiCheck, FiX,
  FiSearch, FiClock, FiCamera, FiSend,
  FiArrowRight, FiSettings, FiGlobe, FiShield, FiZap, 
  FiMapPin, FiSmile, FiTrendingUp, FiAward
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Newsletter from '../components/layout/Newsletter';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 0,
    title: '',
    review: '',
    pros: '',
    cons: '',
    images: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [likedReviews, setLikedReviews] = useState({});
  const [helpfulCount, setHelpfulCount] = useState({});

  const sampleReviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      rating: 5,
      title: 'Absolutely love my new sofa!',
      review: 'The quality is outstanding and the delivery was super fast. The sofa is exactly as pictured and incredibly comfortable.',
      pros: 'Comfortable, stylish, great quality',
      cons: 'None so far',
      images: [],
      date: '2024-03-15',
      verified: true,
      helpful: 24,
      comments: 5,
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      location: 'New York, USA'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@example.com',
      rating: 4,
      title: 'Great quality but assembly took time',
      review: 'The dining table is beautiful and sturdy. Assembly instructions were clear but it took about 2 hours.',
      pros: 'Beautiful design, sturdy construction',
      cons: 'Assembly time consuming',
      images: [],
      date: '2024-03-10',
      verified: true,
      helpful: 12,
      comments: 3,
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      location: 'Toronto, Canada'
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma@example.com',
      rating: 5,
      title: 'Best investment for my home office',
      review: 'The ergonomic chair has transformed my work from home experience. No more back pain.',
      pros: 'Ergonomic, stylish, comfortable',
      cons: 'Pricey but worth it',
      images: [],
      date: '2024-03-05',
      verified: true,
      helpful: 32,
      comments: 7,
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      location: 'London, UK'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setReviews(sampleReviews);
      setLoading(false);
    }, 1000);

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % sampleReviews.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setReviewForm({
      ...reviewForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingClick = (rating) => {
    setReviewForm({ ...reviewForm, rating });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setReviewForm({
      ...reviewForm,
      images: [...reviewForm.images, ...imageUrls]
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newReview = {
      id: reviews.length + 1,
      ...reviewForm,
      date: new Date().toISOString().split('T')[0],
      verified: false,
      helpful: 0,
      comments: 0,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 50) + 1}.jpg`,
      location: 'Guest'
    };
    
    setReviews([newReview, ...reviews]);
    setShowWriteReview(false);
    setReviewForm({
      name: '',
      email: '',
      rating: 0,
      title: '',
      review: '',
      pros: '',
      cons: '',
      images: []
    });
    
    toast.success('Thank you for your review!');
    setIsSubmitting(false);
  };

  const handleHelpful = (reviewId) => {
    if (likedReviews[reviewId]) {
      setHelpfulCount(prev => ({ ...prev, [reviewId]: Math.max(0, (prev[reviewId] || 0) - 1) }));
      setLikedReviews(prev => ({ ...prev, [reviewId]: false }));
      toast.success('Removed helpful vote');
    } else {
      setHelpfulCount(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));
      setLikedReviews(prev => ({ ...prev, [reviewId]: true }));
      toast.success('Thanks for your feedback!');
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const averageRating = getAverageRating();
  const ratingDistribution = getRatingDistribution();

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === '' || 
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 0 || review.rating === ratingFilter;
    return matchesSearch && matchesRating;
  }).sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    if (sortBy === 'helpful') return (b.helpful + (helpfulCount[b.id] || 0)) - (a.helpful + (helpfulCount[a.id] || 0));
    return 0;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative w-full my-[1%] overflow-hidden">
        <motion.div 
          className="relative w-full h-[85vh] lg:h-[90vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0">
            <motion.div 
              className="absolute inset-0"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80"
                alt="Customer Reviews Background"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/70" />
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/10"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                }}
                animate={{
                  y: [null, -100, -200],
                  opacity: [0, 0.5, 0],
                  scale: [0, 1, 0],
                  x: [null, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              >
                <FiStar className="h-6 w-6" />
              </motion.div>
            ))}
          </div>

          <div className="relative h-full flex items-center justify-center px-[2%]">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.span 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-6 text-white border border-white/20"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <FiStar className="h-4 w-4 text-yellow-400" />
                  4.9 Average Rating
                </motion.span>
                
                <motion.h1 
                  className="text-5xl lg:text-7xl xl:text-8xl font-bold mb-6 text-white leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  Customer Reviews
                </motion.h1>
                
                <motion.h2 
                  className="text-3xl lg:text-4xl font-semibold mb-4 text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                >
                  What Our Customers Say
                </motion.h2>
                
                <motion.p 
                  className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  Real reviews from real customers. Join thousands of satisfied furniture lovers who trust Furniqo.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex gap-4 justify-center flex-wrap"
                >
                  <Button 
                    variant="primary" 
                    size="lg" 
                    icon={FiStar}
                    onClick={() => setShowWriteReview(true)}
                    className="shadow-2xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-300"
                  >
                    Write a Review
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                  >
                    Read Reviews
                    <FiArrowRight className="ml-2" />
                  </Button>
                </motion.div>

                <motion.div 
                  className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <FiShield className="h-4 w-4" />
                    <span>Verified Reviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <FiGlobe className="h-4 w-4" />
                    <span>Global Community</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <FiZap className="h-4 w-4" />
                    <span>Real-Time Updates</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <FiSmile className="h-4 w-4" />
                    <span>98% Satisfaction</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div 
                className="w-1 h-2 bg-white rounded-full mt-2"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <div className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: averageRating, label: 'Overall Rating', icon: FiStar, suffix: '/5' },
              { value: reviews.length, label: 'Total Reviews', icon: FiMessageCircle },
              { value: '98%', label: 'Recommend', icon: FiThumbsUp },
              { value: '24h', label: 'Response Time', icon: FiClock }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-4 text-center border border-neutral-200 dark:border-neutral-700"
              >
                <stat.icon className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}{stat.suffix || ''}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Testimonial */}
      <div className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '30px 30px',
              }} />
            </div>
            
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img 
                      src={sampleReviews[activeTestimonial]?.avatar} 
                      alt={sampleReviews[activeTestimonial]?.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-white/30"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                      <FiCheck className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="text-4xl text-white/20 mb-2">"</div>
                  <p className="text-white/90 text-base leading-relaxed">
                    {sampleReviews[activeTestimonial]?.review}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`h-4 w-4 ${i < (sampleReviews[activeTestimonial]?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-white/30'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-white/80">• {sampleReviews[activeTestimonial]?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Reviews Section */}
      <section className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-8 space-y-4">
                <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-semibold text-base mb-3 dark:text-white flex items-center gap-2">
                    <FiSearch className="h-4 w-4 text-primary-600" />
                    Search Reviews
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-semibold text-base mb-3 dark:text-white flex items-center gap-2">
                    <FiStar className="h-4 w-4 text-primary-600" />
                    Filter by Rating
                  </h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-all text-sm ${
                          ratingFilter === rating 
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} className={`h-3.5 w-3.5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span>({ratingDistribution[rating]})</span>
                        </div>
                        {ratingFilter === rating && <FiCheck className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-semibold text-base mb-3 dark:text-white flex items-center gap-2">
                    <FiSettings className="h-4 w-4 text-primary-600" />
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
                        className={`w-full text-left p-2 rounded-lg transition-all text-sm ${
                          sortBy === option.value 
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          {sortBy === option.value && <FiCheck className="h-3.5 w-3.5" />}
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
            </motion.div>

            {/* Reviews Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-700">
                      <div className="animate-pulse">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                          <div className="flex-1">
                            <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-2" />
                            <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-3" />
                            <div className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredReviews.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">{filteredReviews.length} reviews found</p>
                  
                  {filteredReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={review.avatar} 
                            alt={review.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-base dark:text-white">{review.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                              <FiCalendar className="h-3 w-3" />
                              <span>{new Date(review.date).toLocaleDateString()}</span>
                              {review.verified && (
                                <span className="flex items-center gap-1 text-green-600">
                                  <FiCheck className="h-3 w-3" />
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-lg mb-2 dark:text-white">{review.title}</h4>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                        {review.review}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                        <button
                          onClick={() => handleHelpful(review.id)}
                          className={`flex items-center gap-1.5 text-xs transition-colors ${
                            likedReviews[review.id] 
                              ? 'text-primary-600' 
                              : 'text-neutral-500 hover:text-primary-600'
                          }`}
                        >
                          <FiThumbsUp className="h-3.5 w-3.5" />
                          Helpful ({review.helpful + (helpfulCount[review.id] || 0)})
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-600 transition-colors">
                          <FiFlag className="h-3.5 w-3.5" />
                          Report
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <FiSearch className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">No reviews found</h3>
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

      {/* CTA Section */}
      <div className="w-full px-[1%] my-[1%]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '30px 30px',
              }} />
            </div>
            
            <div className="relative p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Share Your Experience</h2>
              <p className="text-white/80 mb-5 max-w-md mx-auto">Help others make better decisions</p>
              <Button 
                variant="white" 
                size="md" 
                icon={FiStar}
                onClick={() => setShowWriteReview(true)}
              >
                Write a Review
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Newsletter />

      {/* Write Review Modal */}
      <AnimatePresence>
        {showWriteReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowWriteReview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-lg w-full bg-white dark:bg-neutral-900 rounded-xl shadow-2xl overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-5 text-white">
                <button
                  onClick={() => setShowWriteReview(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiStar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Write a Review</h3>
                    <p className="text-white/80 text-sm">Share your experience</p>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
                <form onSubmit={handleSubmitReview} className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={reviewForm.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                        value={reviewForm.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                            className={`h-6 w-6 transition-all ${
                              rating <= (hoveredRating || reviewForm.rating) 
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
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={reviewForm.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Summarize your experience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Your Review *
                    </label>
                    <textarea
                      name="review"
                      rows="3"
                      required
                      value={reviewForm.review}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Tell us about your experience..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowWriteReview(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting || reviewForm.rating === 0}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        <>
                          Submit
                          <FiSend className="ml-2 h-3 w-3" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reviews;