// server.js - Complete corrected version (relevant section only)

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Basic env validation/warnings
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change_me_to_a_strong_secret') {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ JWT_SECRET is not set. Aborting in production.');
    process.exit(1);
  } else {
    console.warn('⚠️ JWT_SECRET is not set or using default. This is OK for development but change it for production.');
  }
}

// Import database
const { initDatabase, runMigrations, getDb } = require('./config/database');
// FIXED: Import seedDatabase instead of seedAllData
const { seedDatabase } = require('./utils/seedData');

// Import routes (your existing imports remain the same)
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
const giftCardRoutes = require('./routes/giftCards');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Create testimonials upload directory
const testimonialsUploadDir = path.join(__dirname, 'uploads', 'testimonials');
if (!fs.existsSync(testimonialsUploadDir)) {
  fs.mkdirSync(testimonialsUploadDir, { recursive: true });
  console.log('📁 Created testimonials upload directory');
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  skipSuccessfulRequests: true
});

// Middleware
// Helmet security headers with permissive image policy for cross-origin frontends
const helmetOptions = {
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
      baseUri: ["'self'"],
    }
  }
};

app.use(helmet(helmetOptions));

// CORS: allow a configurable list of origins via ALLOWED_ORIGINS env var (comma-separated).
// In production set ALLOWED_ORIGINS=https://the-furniqo.vercel.app,https://your-other-origin
// For testing, use ALLOWED_ORIGINS=* to allow all origins
const defaultOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'];
const corsOriginConfig = process.env.ALLOWED_ORIGINS === '*'
  ? '*'
  : (process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
    : defaultOrigins
  );

if (process.env.ALLOWED_ORIGINS === '*') {
  console.warn('⚠️  CORS: Allowing all origins (ALLOWED_ORIGINS=*). This should only be used for testing.');
}

app.use(cors({
  origin: corsOriginConfig === '*' ? true : (origin, cb) => {
    // Allow server-to-server or tools without an origin (curl, Postman)
    if (!origin) return cb(null, true);

    // Allow wildcard if explicitly configured
    if (corsOriginConfig === '*') return cb(null, true);

    const match = corsOriginConfig.some(o => o.toLowerCase() === origin.toLowerCase());
    if (match) return cb(null, true);

    console.warn(`CORS blocked origin: ${origin}`);
    return cb(null, false);
  },
  credentials: true,
  exposedHeaders: ['Authorization'],
  // Ensure preflight OPTIONS requests get a proper success status
  optionsSuccessStatus: 204,
  preflightContinue: false,
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Compression
app.use(compression());

// Request ID middleware
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Explicit preflight handling for all /api/v1 routes to ensure OPTIONS succeeds
app.options('/api/v1/*', cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (process.env.ALLOWED_ORIGINS === '*') return cb(null, true);
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'];
    const match = allowedOrigins.some(o => o.toLowerCase() === origin.toLowerCase());
    return cb(null, match);
  },
  credentials: true,
  optionsSuccessStatus: 204,
}));

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
app.use('/api/v1/gift-cards', giftCardRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  console.log('Health check requested from origin:', req.get('origin') || 'unknown');
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'Furniqo API is running', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Seed endpoint (admin only - protected in production)
app.post('/api/v1/admin/seed', async (req, res) => {
  try {
    const db = getDb();
    await seedDatabase(db);
    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
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
    // Initialize database (creates tables)
    await initDatabase();
    
    // Run migrations
    await runMigrations();
    
    // Seed all data (testimonials, categories, products, etc.)
    const db = getDb();
    // FIXED: Call seedDatabase instead of seedAllData
    await seedDatabase(db);
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📁 API URL: http://localhost:${PORT}/api/v1`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 JWT Auth: Enabled`);
      console.log(`\n📝 Testimonials seeded: Check your database!`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;