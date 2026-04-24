import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiThumbsUp, FiFlag } from 'react-icons/fi';
import Rating from '../common/Rating';
import Button from '../common/Button';
import Pagination from '../common/Pagination';
import { formatDate } from '../../utils/helpers';
import { cn } from '../../utils/cn';

const ProductReviews = ({ reviews, rating, numReviews }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const sortReviews = (reviews) => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'helpful':
        return sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
      default:
        return sorted;
    }
  };

  const sortedReviews = sortReviews(reviews);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    percentage: numReviews > 0 
      ? (reviews.filter(r => r.rating === star).length / numReviews) * 100 
      : 0,
    count: reviews.filter(r => r.rating === star).length,
  }));

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Average Rating */}
        <div className="text-center p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl">
          <div className="text-5xl font-bold text-neutral-900 dark:text-white mb-2">
            {rating.toFixed(1)}
          </div>
          <Rating value={rating} size="lg" showCount={false} className="justify-center mb-2" />
          <p className="text-sm text-neutral-500">
            Based on {numReviews} {numReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl">
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">Rating Distribution</h4>
          <div className="space-y-2">
            {distribution.map(({ star, percentage, count }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{star}</span>
                  <FiStar className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-grow h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
                <span className="text-sm text-neutral-500 w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Reviews */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Customer Reviews ({reviews.length})
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {paginatedReviews.map((review) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {review.user.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {review.user}
                  </p>
                  <div className="flex items-center gap-2">
                    <Rating value={review.rating} size="sm" showCount={false} />
                    <span className="text-sm text-neutral-500">
                      {formatDate(review.date)}
                    </span>
                  </div>
                </div>
              </div>
              {review.verified && (
                <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                  Verified Purchase
                </span>
              )}
            </div>

            {review.title && (
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                {review.title}
              </h4>
            )}
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {review.comment}
            </p>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                <FiThumbsUp className="h-4 w-4" />
                Helpful ({review.helpful || 0})
              </button>
              <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                <FiFlag className="h-4 w-4" />
                Report
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ProductReviews;