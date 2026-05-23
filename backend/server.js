// server.js (updated with all routes)

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import database
const { initDatabase } = require('./config/database');

// Import routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const testimonialRoutes = require('./routes/testimonials');
const blogRoutes = require('./routes/blog');
const roomRoutes = require('./routes/rooms');
const couponRoutes = require('./routes/coupons');
const faqRoutes = require('./routes/faqs');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const heroSlideRoutes = require('./routes/heroSlides');
const policyRoutes = require('./routes/policies');
const giftCardRoutes = require('./routes/giftCards'); // New

// Import error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  skipSuccessfulRequests: true
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  exposedHeaders: ['Authorization']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply rate limiting to API routes
app.use('/api/', limiter);

// API Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/faqs', faqRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/hero-slides', heroSlideRoutes);
app.use('/api/v1/policies', policyRoutes);
app.use('/api/v1/gift-cards', giftCardRoutes); // New

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Furniqo API is running', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler middleware
app.use(errorHandler);

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📁 API URL: http://localhost:${PORT}/api/v1`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 JWT Auth: Enabled`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;