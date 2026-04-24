import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiUser, FiTag, FiShare2 } from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import Breadcrumb from '../components/common/Breadcrumb';
import { Skeleton } from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await apiWrapper.getBlogPost(slug);
      setPost(response.data.data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="w-full px-[1%] sm:px-[1.5%] py-8 max-w-3xl">
        <Skeleton className="h-96 rounded-2xl mb-8" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-8" />
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full px-[1%] sm:px-[1.5%] py-16 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Post Not Found</h2>
        <Link to="/blog" className="text-primary-600 hover:text-primary-700">Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen py-8">
      <div className="w-full px-[1%] sm:px-[1.5%] max-w-3xl">
        <Breadcrumb items={[
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-3 py-1 rounded-full text-xs font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <FiUser className="h-3.5 w-3.5" /> {post.author}
              </span>
              <span className="flex items-center gap-1">
                <FiClock className="h-3.5 w-3.5" /> {post.readTime}
              </span>
              <span>{post.date}</span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 dark:text-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-sm text-neutral-900 dark:text-white">{post.author}</p>
                  <p className="text-xs text-neutral-500">{post.authorRole}</p>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <FiShare2 className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden mb-8">
            <img src={post.image} alt={post.title} className="w-full aspect-video object-cover" />
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert prose-lg max-w-none">
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {post.content || post.excerpt}
            </p>
            
            {/* Sample content sections */}
            <h2>Introduction</h2>
            <p>
              When it comes to creating a beautiful home, the details matter. Every piece of furniture 
              tells a story and contributes to the overall atmosphere of your space. In this guide, 
              we'll explore expert tips and insights to help you make informed decisions.
            </p>
            
            <h2>Key Considerations</h2>
            <p>
              Before making any purchase, it's essential to consider your space, lifestyle, and 
              aesthetic preferences. The right furniture should not only look good but also serve 
              your daily needs effectively.
            </p>
            <ul>
              <li>Measure your space carefully before shopping</li>
              <li>Consider the traffic flow in your room</li>
              <li>Think about maintenance and durability</li>
              <li>Choose colors that complement your existing decor</li>
            </ul>
            
            <h2>Conclusion</h2>
            <p>
              Investing in quality furniture is an investment in your comfort and lifestyle. 
              Take your time, do your research, and choose pieces that you'll love for years to come.
            </p>
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t dark:border-neutral-800">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/blog?tag=${tag}`}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm text-neutral-600 dark:text-neutral-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Back Link */}
        <div className="mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;