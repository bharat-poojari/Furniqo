import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiThumbsUp, FiFlag, FiChevronDown, FiFilter, FiX, FiSearch, FiMessageSquare } from 'react-icons/fi';
import Rating from '../common/Rating';
import Button from '../common/Button';
import Pagination from '../common/Pagination';
import { formatDate } from '../../utils/helpers';
import { cn } from '../../utils/cn';

// Simplified animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
};

// Memoized Rating Distribution Bar component
const RatingDistributionBar = memo(({ star, percentage, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-800 group",
      isActive && "bg-amber-50 dark:bg-amber-900/20 ring-2 ring-amber-400 dark:ring-amber-500"
    )}
    aria-label={`Filter by ${star} star reviews`}
  >
    <div className="flex items-center gap-1 w-20">
      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
        {star}
      </span>
      <FiStar className={cn(
        "h-4 w-4 text-amber-400",
        isActive && "fill-amber-400"
      )} />
    </div>
    <div className="flex-grow h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.4 }}
        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
      />
    </div>
    <span className="text-sm text-neutral-500 w-12 text-right font-mono">
      {count}
    </span>
  </button>
));

RatingDistributionBar.displayName = 'RatingDistributionBar';

// Memoized Single Review component
const ReviewItem = memo(({ review, isExpanded, helpfulReviews, onToggleExpand, onHelpfulClick, onReportClick }) => {
  const handleExpand = useCallback(() => onToggleExpand(review._id), [onToggleExpand, review._id]);
  const handleHelpful = useCallback(() => onHelpfulClick(review._id), [onHelpfulClick, review._id]);
  const handleReport = useCallback(() => onReportClick(review._id), [onReportClick, review._id]);
  
  const userInitials = review.user.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const isReviewHelpful = helpfulReviews.has(review._id);
  const needsTruncation = review.comment?.length > 300;
  const isTruncated = !isExpanded && needsTruncation;

  return (
    <motion.div
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
      className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-150"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
              <span className="font-semibold text-white text-lg">
                {userInitials}
              </span>
            </div>
            {review.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white dark:border-neutral-900">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-neutral-900 dark:text-white">
                {review.user}
              </p>
              {review.verified && (
                <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Rating value={review.rating} size="sm" showCount={false} />
              <span className="text-sm text-neutral-500">
                {formatDate(review.date)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {review.title && (
        <h4 className="font-semibold text-neutral-900 dark:text-white mb-2 text-lg">
          {review.title}
        </h4>
      )}
      
      <div className="relative">
        <p className={cn(
          "text-neutral-600 dark:text-neutral-400 leading-relaxed",
          isTruncated && "line-clamp-4"
        )}>
          {review.comment}
        </p>
        {needsTruncation && (
          <button
            onClick={handleExpand}
            className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline mt-1"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-3">
          {review.images.slice(0, 4).map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt={`Review image ${idx + 1}`}
              className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              loading="lazy"
            />
          ))}
          {review.images.length > 4 && (
            <div className="w-16 h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm text-neutral-500">
              +{review.images.length - 4}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={handleHelpful}
          className={cn(
            "flex items-center gap-1.5 text-sm transition-all duration-150 px-3 py-1.5 rounded-lg",
            isReviewHelpful
              ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
              : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 dark:hover:text-neutral-300 dark:hover:bg-neutral-800"
          )}
          aria-pressed={isReviewHelpful}
        >
          <FiThumbsUp className="h-4 w-4" />
          Helpful ({review.helpful || 0})
        </button>
        
        <button
          onClick={handleReport}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          aria-label="Report this review"
        >
          <FiFlag className="h-4 w-4" />
          Report
        </button>
      </div>
    </motion.div>
  );
});

ReviewItem.displayName = 'ReviewItem';

// Memoized Filter Chip component
const FilterChip = memo(({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm">
    {label}
    <button
      onClick={onRemove}
      className="hover:text-amber-900 dark:hover:text-amber-200"
      aria-label="Remove filter"
    >
      <FiX className="h-3 w-3" />
    </button>
  </span>
));

FilterChip.displayName = 'FilterChip';

// Main ProductReviews Component
const ProductReviews = memo(({ reviews, rating, numReviews, onHelpfulClick, onReportClick, variant = 'full' }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState(new Set());
  const reviewsPerPage = 5;

  // Memoized filtered and sorted reviews
  const processedReviews = useMemo(() => {
    let filtered = [...reviews];
    
    if (filterRating) {
      filtered = filtered.filter(review => Math.round(review.rating) === filterRating);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(review => 
        review.title?.toLowerCase().includes(term) ||
        review.comment?.toLowerCase().includes(term) ||
        review.user?.toLowerCase().includes(term)
      );
    }
    
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
      case 'relevant':
        filtered.sort((a, b) => {
          const scoreA = (a.helpful || 0) * 0.7 + (new Date(a.date).getTime() / 100000000000) * 0.3;
          const scoreB = (b.helpful || 0) * 0.7 + (new Date(b.date).getTime() / 100000000000) * 0.3;
          return scoreB - scoreA;
        });
        break;
    }
    return filtered;
  }, [reviews, sortBy, filterRating, searchTerm]);

  const totalPages = Math.ceil(processedReviews.length / reviewsPerPage);
  const paginatedReviews = processedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = useCallback((star) => {
    setFilterRating(prev => prev === star ? null : star);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setFilterRating(null);
    setSortBy('newest');
    setCurrentPage(1);
  }, []);

  const toggleReviewExpansion = useCallback((reviewId) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  }, []);

  const handleHelpfulClick = useCallback((reviewId) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
    onHelpfulClick?.(reviewId);
  }, [onHelpfulClick]);

  const handleReportClick = useCallback((reviewId) => {
    onReportClick?.(reviewId);
  }, [onReportClick]);

  // Memoized distribution data
  const distribution = useMemo(() => [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => Math.round(r.rating) === star).length;
    return {
      star,
      percentage: numReviews > 0 ? (count / numReviews) * 100 : 0,
      count,
      isActive: filterRating === star
    };
  }), [reviews, numReviews, filterRating]);

  // Memoized recommendation percentage
  const recommendationPercentage = useMemo(() => {
    if (numReviews === 0) return 0;
    const positiveReviews = reviews.filter(r => r.rating >= 4).length;
    return (positiveReviews / numReviews) * 100;
  }, [reviews, numReviews]);

  const getRatingLabel = useCallback((rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.0) return 'Average';
    if (rating >= 2.0) return 'Below Average';
    return 'Poor';
  }, []);

  const ratingLabel = getRatingLabel(rating);
  const startIndex = (currentPage - 1) * reviewsPerPage + 1;
  const endIndex = Math.min(currentPage * reviewsPerPage, processedReviews.length);

  return (
    <div className="space-y-6" role="region" aria-label="Product reviews">
      {/* Reviews Summary Header */}
      <div className={cn(
        "grid gap-6",
        variant === 'compact' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'
      )}>
        {/* Average Rating Card */}
        <motion.div 
          variants={scaleIn}
          initial="initial"
          animate="animate"
          className="text-center p-6 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-850 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50"
        >
          <div className="text-6xl font-bold text-neutral-900 dark:text-white mb-2">
            {rating.toFixed(1)}
          </div>
          <Rating value={rating} size="lg" showCount={false} className="justify-center mb-2" />
          <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            {ratingLabel}
          </p>
          <p className="text-sm text-neutral-500">
            Based on {numReviews} {numReviews === 1 ? 'review' : 'reviews'}
          </p>
          {recommendationPercentage > 0 && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              {recommendationPercentage.toFixed(0)}% recommend this product
            </p>
          )}
        </motion.div>

        {/* Rating Distribution */}
        <div className={cn(
          "p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50",
          variant === 'full' ? 'md:col-span-2' : ''
        )}>
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Rating Distribution</h4>
          <div className="space-y-3">
            {distribution.map(({ star, percentage, count, isActive }) => (
              <RatingDistributionBar
                key={star}
                star={star}
                percentage={percentage}
                count={count}
                isActive={isActive}
                onClick={() => handleFilterChange(star)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search reviews..."
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              aria-label="Search reviews"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Clear search"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort and Filter Buttons */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              aria-label="Sort reviews"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
              <option value="relevant">Most Relevant</option>
            </select>
            <button
              onClick={toggleFilters}
              className={cn(
                "px-4 py-2.5 rounded-lg border transition-all duration-150 flex items-center gap-2",
                showFilters 
                  ? "bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/20 dark:border-primary-700 dark:text-primary-400"
                  : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
              )}
              aria-expanded={showFilters}
            >
              <FiFilter className="h-4 w-4" />
              Filters
              {filterRating && (
                <span className="ml-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {(showFilters || filterRating) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-wrap gap-2"
            >
              {filterRating && (
                <FilterChip 
                  label={`${filterRating} Stars`} 
                  onRemove={() => handleFilterChange(filterRating)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reviews Count */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Customer Reviews 
          <span className="text-neutral-500 text-base font-normal ml-2">
            ({processedReviews.length})
          </span>
        </h3>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {paginatedReviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              isExpanded={expandedReviews.has(review._id)}
              helpfulReviews={helpfulReviews}
              onToggleExpand={toggleReviewExpansion}
              onHelpfulClick={handleHelpfulClick}
              onReportClick={handleReportClick}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {processedReviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-center py-12 bg-neutral-50 dark:bg-neutral-800 rounded-2xl"
        >
          <FiMessageSquare className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            No reviews found
          </h3>
          <p className="text-neutral-500 max-w-md mx-auto">
            Try adjusting your filters or search terms
          </p>
          <Button
            onClick={clearAllFilters}
            className="mt-4"
            variant="outline"
          >
            Clear all filters
          </Button>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-sm text-neutral-500">
            Showing {startIndex}-{endIndex} of {processedReviews.length} reviews
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
});

ProductReviews.displayName = 'ProductReviews';

export default ProductReviews;