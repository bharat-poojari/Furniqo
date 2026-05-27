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

// Enhanced environment validation
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change_me_to_a_strong_secret') {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ JWT_SECRET is not set or using default. Aborting in production.');
    process.exit(1);
  } else {
    console.warn('⚠️ JWT_SECRET is not set or using default. This is OK for development but change it for production.');
  }
}

if (process.env.NODE_ENV === 'production' && !process.env.ALLOWED_ORIGINS) {
  console.error('❌ ALLOWED_ORIGINS must be set in production');
  process.exit(1);
}

// Import database
const { initDatabase, runMigrations, getDb } = require('./config/database');
const { seedDatabase } = require('./utils/seedData');

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

// Rate limiting - stricter in production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests from this IP, please try again later.',
  skipSuccessfulRequests: true
});

// Helmet security headers with permissive image policy for cross-origin frontends
const helmetOptions = {
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https:', 'wss:'],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
      baseUri: ["'self'"],
    }
  }
};

app.use(helmet(helmetOptions));

// Configure CORS properly for Vercel frontend
const defaultOrigins = ['https://the-furniqo.vercel.app', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'];
const allowedOrigins = process.env.ALLOWED_ORIGINS === '*'
  ? '*'
  : (process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
    : defaultOrigins
  );

if (process.env.ALLOWED_ORIGINS === '*') {
  console.warn('⚠️  CORS: Allowing all origins (ALLOWED_ORIGINS=*). This should only be used for testing.');
}

// Main CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow all origins if wildcard is set
    if (allowedOrigins === '*') {
      return callback(null, true);
    }
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      // Handle exact matches and subdomains
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(origin);
      }
      return allowedOrigin.toLowerCase() === origin.toLowerCase();
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      console.warn(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['Authorization', 'X-Request-Id'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 204,
  preflightContinue: false,
}));

// Logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  // Simple logging for production
  app.use(morgan('combined'));
}

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

// Health check endpoint with CORS info
app.get('/api/v1/health', (req, res) => {
  console.log('Health check requested from origin:', req.get('origin') || 'unknown');
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'Furniqo API is running', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV,
    cors_enabled: true
  });
});

// Seed endpoint (admin only - protected in production)
app.post('/api/v1/admin/seed', async (req, res) => {
  // Check for admin authorization in production
  if (process.env.NODE_ENV === 'production') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    // Add your admin token validation here
  }
  
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
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// Global error handler middleware
app.use(errorHandler);

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🚀 Starting Furniqo API Server...');
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Initialize database (creates tables)
    console.log('📊 Initializing database...');
    await initDatabase();
    
    // Run migrations
    console.log('🔄 Running migrations...');
    await runMigrations();
    
    // Seed all data (only in development or if force seeded)
    if (process.env.NODE_ENV !== 'production') {
      console.log('🌱 Seeding database...');
      const db = getDb();
      await seedDatabase(db);
      console.log('✅ Database seeded successfully');
    } else {
      console.log('⚠️ Skipping database seeding in production');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n✅ Server running successfully!`);
      console.log(`📍 Port: ${PORT}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api/v1`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 JWT Auth: Enabled`);
      console.log(`🌐 CORS Allowed Origins: ${allowedOrigins === '*' ? 'ALL' : allowedOrigins.join(', ')}`);
      console.log(`\n✨ Frontend should be configured to call: ${process.env.NODE_ENV === 'production' ? 'YOUR_BACKEND_URL' : `http://localhost:${PORT}`}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;