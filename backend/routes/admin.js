const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// Dev-only admin registration endpoint (guarded)
router.post('/register', async (req, res) => {
  try {
    // Only allow when explicitly enabled or in non-production
    const allow = process.env.ALLOW_ADMIN_REGISTER === 'true' || process.env.NODE_ENV !== 'production';
    if (!allow) {
      return res.status(403).json({ success: false, message: 'Admin registration is disabled' });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const db = getDb();
    const existing = await db.get('SELECT _id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = 'admin_' + uuidv4();
    const now = new Date().toISOString();

    await db.run(`
      INSERT INTO users (_id, name, email, password, role, isVerified, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, name, email.toLowerCase(), hashed, 'admin', 1, now, now]);

    res.status(201).json({ success: true, message: 'Admin user created', data: { _id: id, email } });
  } catch (error) {
    console.error('Admin register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    
    // Total users
    const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');
    
    // Total products
    const totalProducts = await db.get('SELECT COUNT(*) as count FROM products');
    
    // Total orders
    const totalOrders = await db.get('SELECT COUNT(*) as count FROM orders');
    
    // Total revenue
    const revenue = await db.get('SELECT SUM(total) as total FROM orders WHERE paymentStatus = "paid" OR status != "cancelled"');
    
    // Pending orders
    const pendingOrders = await db.get('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
    
    // Out of stock products
    const outOfStock = await db.get('SELECT COUNT(*) as count FROM products WHERE stock = 0 OR inStock = 0');
    
    // Recent orders
    const recentOrders = await db.all(`
      SELECT o.*, u.name as userName 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u._id 
      ORDER BY o.createdAt DESC 
      LIMIT 10
    `);
    
    // Parse orders
    const parsedOrders = recentOrders.map(order => ({
      ...order,
      items: order.items ? JSON.parse(order.items) : []
    }));
    
    // Top selling products - simplified query
    const topProducts = await db.all(`
      SELECT p._id, p.name, p.images, p.price, p.slug
      FROM products p
      ORDER BY p.numReviews DESC
      LIMIT 5
    `);
    
    // Monthly sales - simplified
    const monthlySales = await db.all(`
      SELECT 
        strftime('%Y-%m', createdAt) as month, 
        COUNT(*) as orders, 
        COALESCE(SUM(total), 0) as revenue
      FROM orders
      WHERE createdAt >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month DESC
    `);
    
    res.json({
      success: true,
      stats: {
        totalUsers: totalUsers.count || 0,
        totalProducts: totalProducts.count || 0,
        totalOrders: totalOrders.count || 0,
        totalRevenue: revenue.total || 0,
        pendingOrders: pendingOrders.count || 0,
        outOfStock: outOfStock.count || 0,
        recentOrders: parsedOrders,
        topProducts: topProducts.map(p => ({
          ...p,
          images: p.images ? JSON.parse(p.images) : []
        })),
        monthlySales
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get system health
router.get('/health', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    
    // Check database
    await db.get('SELECT 1');
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
});

module.exports = router;