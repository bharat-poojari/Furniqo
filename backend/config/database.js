// config/database.js (updated with additional tables and seeding)

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');
const { seedDatabase } = require('../utils/seedData');

let db;

const initDatabase = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, '../furniqo.db'),
      driver: sqlite3.Database
    });

    console.log('✅ Connected to SQLite database');
    await db.exec('PRAGMA foreign_keys = ON');
    await createTables();
    
    // Seed the database with initial data
    await seedDatabase(db);
    
    // Create default admin user if not exists (fallback)
    await createDefaultAdmin();

    return db;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

const createTables = async () => {
  console.log('📋 Creating database tables...');
  
  // Users table (enhanced)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      avatar TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zipCode TEXT,
      phone TEXT,
      isVerified INTEGER DEFAULT 0,
      verificationToken TEXT,
      resetPasswordToken TEXT,
      resetPasswordExpires INTEGER,
      lastLogin TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sessions table for JWT refresh tokens
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      refreshToken TEXT NOT NULL,
      userAgent TEXT,
      ipAddress TEXT,
      expiresAt INTEGER NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
    )
  `);

  // Products table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      shortDescription TEXT,
      price REAL NOT NULL,
      originalPrice REAL,
      category TEXT,
      subcategory TEXT,
      material TEXT,
      color TEXT,
      style TEXT,
      dimensions TEXT,
      weight TEXT,
      inStock INTEGER DEFAULT 1,
      stock INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      numReviews INTEGER DEFAULT 0,
      images TEXT,
      features TEXT,
      tags TEXT,
      featured INTEGER DEFAULT 0,
      trending INTEGER DEFAULT 0,
      bestSeller INTEGER DEFAULT 0,
      newArrival INTEGER DEFAULT 0,
      onSale INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Product variants table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      color TEXT,
      material TEXT,
      size TEXT,
      price REAL,
      stock INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(_id) ON DELETE CASCADE
    )
  `);

  // Product reviews table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS product_reviews (
      _id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_id TEXT,
      user_name TEXT NOT NULL,
      user_email TEXT,
      rating INTEGER NOT NULL,
      title TEXT,
      comment TEXT NOT NULL,
      date TEXT DEFAULT CURRENT_DATE,
      verified INTEGER DEFAULT 0,
      helpful INTEGER DEFAULT 0,
      images TEXT,
      FOREIGN KEY (product_id) REFERENCES products(_id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE SET NULL
    )
  `);

  // Categories table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image TEXT,
      description TEXT,
      itemCount INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      icon TEXT
    )
  `);

  // Testimonials table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      location TEXT,
      image TEXT,
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      verified INTEGER DEFAULT 0
    )
  `);

  // Blog posts table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      _id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT,
      image TEXT,
      author TEXT,
      authorRole TEXT,
      authorImage TEXT,
      category TEXT,
      date TEXT DEFAULT CURRENT_DATE,
      readTime TEXT,
      tags TEXT,
      featured INTEGER DEFAULT 0
    )
  `);

  // Rooms table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      style TEXT,
      roomType TEXT,
      image TEXT,
      description TEXT,
      features TEXT,
      tips TEXT,
      products TEXT,
      tags TEXT
    )
  `);

  // Coupons table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      discount REAL NOT NULL,
      type TEXT DEFAULT 'percentage',
      minPurchase REAL DEFAULT 0,
      maxDiscount REAL,
      validFrom TEXT,
      validUntil TEXT,
      description TEXT,
      usageLimit INTEGER,
      usedCount INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      forNewUsers INTEGER DEFAULT 0
    )
  `);

  // FAQs table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT,
      sortOrder INTEGER DEFAULT 0
    )
  `);

  // Orders table (enhanced)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      _id TEXT PRIMARY KEY,
      user_id TEXT,
      orderNumber TEXT UNIQUE NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      shipping REAL NOT NULL,
      tax REAL NOT NULL,
      discount REAL DEFAULT 0,
      total REAL NOT NULL,
      couponCode TEXT,
      status TEXT DEFAULT 'pending',
      paymentMethod TEXT,
      paymentStatus TEXT DEFAULT 'pending',
      paymentId TEXT,
      shippingAddress TEXT,
      billingAddress TEXT,
      trackingNumber TEXT,
      trackingUrl TEXT,
      estimatedDelivery TEXT,
      notes TEXT,
      giftWrap INTEGER DEFAULT 0,
      giftMessage TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE SET NULL
    )
  `);

  // Cart items table (enhanced)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id INTEGER,
      quantity INTEGER DEFAULT 1,
      addedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(_id) ON DELETE CASCADE
    )
  `);

  // Wishlist table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      addedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(_id) ON DELETE CASCADE,
      UNIQUE(user_id, product_id)
    )
  `);

  // Gift cards table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS gift_cards (
      code TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      balance REAL NOT NULL,
      sender_name TEXT,
      sender_email TEXT,
      recipient_name TEXT,
      recipient_email TEXT,
      message TEXT,
      design TEXT,
      status TEXT DEFAULT 'active',
      purchasedBy TEXT,
      orderId TEXT,
      expiresAt TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      usedAt TEXT,
      FOREIGN KEY (purchasedBy) REFERENCES users(_id) ON DELETE SET NULL
    )
  `);

  // Gift card transactions table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS gift_card_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gift_card_code TEXT NOT NULL,
      order_id TEXT,
      amount_used REAL NOT NULL,
      remaining_balance REAL NOT NULL,
      usedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (gift_card_code) REFERENCES gift_cards(code) ON DELETE CASCADE
    )
  `);

  // Contacts table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Newsletter subscribers table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      subscribedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      isActive INTEGER DEFAULT 1
    )
  `);
  
  // Policies table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS policies (
      type TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      last_updated TEXT NOT NULL,
      content TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Hero Slides table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS hero_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      image TEXT NOT NULL,
      cta_text TEXT,
      cta_link TEXT,
      text_color TEXT DEFAULT 'light',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Price alerts table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS price_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      target_price REAL NOT NULL,
      status TEXT DEFAULT 'active',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      notifiedAt TEXT,
      FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(_id) ON DELETE CASCADE
    )
  `);

  console.log('✅ All database tables created successfully');
};

const createDefaultAdmin = async () => {
  const adminExists = await db.get('SELECT * FROM users WHERE role = ?', ['admin']);
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin123456', 10);
    const adminId = 'admin_' + Date.now();
    
    await db.run(`
      INSERT INTO users (_id, name, email, password, role, isVerified, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [adminId, 'Admin User', 'admin@furniqo.com', hashedPassword, 'admin', 1, new Date().toISOString(), new Date().toISOString()]);
    
    console.log('✅ Default admin user created: admin@furniqo.com / Admin123456');
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

module.exports = { initDatabase, getDb };