// config/database.js - Database configuration (NO SEEDING LOGIC)

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

let db;

const initDatabase = async () => {
  try {
    const dbPath = process.env.DB_PATH || path.join(__dirname, '../furniqo.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('✅ Connected to SQLite database');
    await db.exec('PRAGMA foreign_keys = ON');
    await createTables();
    
    // Run migrations BEFORE creating indexes to ensure all columns exist
    await runMigrations();
    await createIndexes();
    
    // Create default admin user if not exists
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

  // Product variants table (with sku column included from the start)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      color TEXT,
      material TEXT,
      size TEXT,
      price REAL,
      stock INTEGER DEFAULT 0,
      sku TEXT,
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
      icon TEXT,
      parent_id TEXT,
      sort_order INTEGER DEFAULT 0
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
      verified INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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
      featured INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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
      tags TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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
      forNewUsers INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // FAQs table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT,
      sortOrder INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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

  // Uploads/media table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      path TEXT NOT NULL,
      url TEXT NOT NULL,
      mimetype TEXT,
      size INTEGER,
      uploadedBy TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (uploadedBy) REFERENCES users(_id) ON DELETE SET NULL
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
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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

const createIndexes = async () => {
  console.log('📊 Creating database indexes for performance...');
  
  try {
    // Users indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_users_verification ON users(verificationToken)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(resetPasswordToken)`);
    
    // Sessions indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(refreshToken)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expiresAt)`);
    
    // Products indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_products_trending ON products(trending)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_products_bestSeller ON products(bestSeller)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating)`);
    
    // Product variants indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku)`);
    
    // Reviews indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_reviews_user ON product_reviews(user_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_reviews_rating ON product_reviews(rating)`);
    
    // Categories indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_categories_featured ON categories(featured)`);
    
    // Testimonials indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_testimonials_verified ON testimonials(verified)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at)`);
    
    // Blog posts indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_blog_featured ON blog_posts(featured)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_blog_date ON blog_posts(date)`);
    
    // Orders indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_orderNumber ON orders(orderNumber)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(createdAt)`);
    
    // Cart indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_cart_product ON cart_items(product_id)`);
    
    // Wishlist indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlist(product_id)`);
    
    // Gift cards indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON gift_cards(status)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_gift_cards_recipient ON gift_cards(recipient_email)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_gift_cards_expires ON gift_cards(expiresAt)`);
    
    // Coupons indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(isActive)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_coupons_valid ON coupons(validUntil)`);
    
    // Contacts indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(createdAt)`);
    
    // Newsletter indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(isActive)`);
    
    // Hero slides indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(sort_order)`);
    
    // Price alerts indexes
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_alerts_user ON price_alerts(user_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_alerts_product ON price_alerts(product_id)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_alerts_status ON price_alerts(status)`);
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('Error creating some indexes:', error.message);
  }
};

const createDefaultAdmin = async () => {
  try {
    const adminExists = await db.get('SELECT * FROM users WHERE role = ?', ['admin']);
    
    if (!adminExists) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@furniqo.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123456';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminId = 'admin_' + Date.now();
      
      await db.run(`
        INSERT INTO users (_id, name, email, password, role, isVerified, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [adminId, 'Admin User', adminEmail.toLowerCase(), hashedPassword, 'admin', 1, new Date().toISOString(), new Date().toISOString()]);
      
      console.log(`✅ Default admin user created: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Simplified migration - only for critical missing columns
const runMigrations = async () => {
  console.log('🔄 Checking for any missing columns...');
  
  // Check if sku column exists in product_variants (for existing databases)
  try {
    const tableInfo = await db.all(`PRAGMA table_info(product_variants)`);
    const hasSku = tableInfo.some(col => col.name === 'sku');
    
    if (!hasSku) {
      await db.exec(`ALTER TABLE product_variants ADD COLUMN sku TEXT`);
      console.log('  ✓ Added missing sku column to product_variants');
    }
  } catch (error) {
    if (!error.message.includes('no such table')) {
      console.log('  ⚠ Could not check product_variants:', error.message);
    }
  }
  
  console.log('✅ Database migrations completed');
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

const closeDatabase = async () => {
  if (db) {
    await db.close();
    console.log('📴 Database connection closed');
  }
};

module.exports = { 
  initDatabase, 
  getDb, 
  closeDatabase,
  runMigrations 
};