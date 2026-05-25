// routes/giftCards.js

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { getDb } = require('../config/database');
const { protect, admin } = require('../middleware/auth');

// Generate unique gift card code
const generateGiftCardCode = () => {
  return 'GC-' + crypto.randomBytes(8).toString('hex').toUpperCase();
};

// Helper to generate UUID
const generateUUID = () => {
  return crypto.randomBytes(16).toString('hex');
};

// ============ USER ENDPOINTS ============

// @desc    Create gift card
// @route   POST /api/gift-cards
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      amount,
      recipientName,
      recipientEmail,
      senderName,
      message,
      expiryDate
    } = req.body;
    
    const db = getDb();
    
    if (!amount || amount < 10) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least $10'
      });
    }
    
    if (!recipientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email is required'
      });
    }
    
    const code = generateGiftCardCode();
    const now = new Date().toISOString();
    
    // Set expiry date
    let expiresAt;
    if (expiryDate) {
      expiresAt = new Date(expiryDate);
    } else {
      expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }
    
    await db.run(`
      INSERT INTO gift_cards (
        code, amount, balance, sender_name, sender_email,
        recipient_name, recipient_email, message,
        purchasedBy, expiresAt, createdAt, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      code, amount, amount,
      senderName || req.user.name, req.user.email,
      recipientName || null, recipientEmail,
      message || null,
      req.user._id, expiresAt.toISOString(), now, 'active'
    ]);
    
    const newGiftCard = await db.get('SELECT * FROM gift_cards WHERE code = ?', [code]);
    
    res.status(201).json({
      success: true,
      data: newGiftCard,
      message: 'Gift card created successfully'
    });
  } catch (error) {
    console.error('Create gift card error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create gift card'
    });
  }
});

// @desc    Get user's gift cards
// @route   GET /api/gift-cards
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const db = getDb();
    
    const giftCards = await db.all(`
      SELECT * FROM gift_cards 
      WHERE purchasedBy = ? OR recipient_email = ?
      ORDER BY createdAt DESC
    `, [req.user._id, req.user.email]);
    
    res.json({
      success: true,
      data: giftCards
    });
  } catch (error) {
    console.error('Get user gift cards error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get gift cards'
    });
  }
});

// @desc    Get gift card by code
// @route   GET /api/gift-cards/code/:code
// @access  Public
router.get('/code/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const db = getDb();
    
    const giftCard = await db.get(
      `SELECT code, amount, balance, status, expiresAt, recipient_name, sender_name
       FROM gift_cards WHERE code = ?`,
      [code.toUpperCase()]
    );
    
    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Gift card not found'
      });
    }
    
    if (giftCard.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Gift card is not active'
      });
    }
    
    if (new Date(giftCard.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Gift card has expired'
      });
    }
    
    res.json({
      success: true,
      data: {
        code: giftCard.code,
        balance: giftCard.balance,
        amount: giftCard.amount,
        expiresAt: giftCard.expiresAt,
        recipientName: giftCard.recipient_name,
        senderName: giftCard.sender_name
      }
    });
  } catch (error) {
    console.error('Get gift card by code error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get gift card'
    });
  }
});

// @desc    Apply gift card to order
// @route   POST /api/gift-cards/apply
// @access  Private
router.post('/apply', protect, async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;
    const db = getDb();
    
    const giftCard = await db.get(
      `SELECT * FROM gift_cards WHERE code = ? AND status = 'active'`,
      [code.toUpperCase()]
    );
    
    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Gift card not found'
      });
    }
    
    if (new Date(giftCard.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Gift card has expired'
      });
    }
    
    if (giftCard.balance <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Gift card has no balance'
      });
    }
    
    const amountToApply = Math.min(giftCard.balance, orderTotal);
    
    res.json({
      success: true,
      data: {
        code: giftCard.code,
        balance: giftCard.balance,
        amountToApply,
        remainingBalance: giftCard.balance - amountToApply
      }
    });
  } catch (error) {
    console.error('Apply gift card error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to apply gift card'
    });
  }
});

// ============ ADMIN ENDPOINTS ============

// @desc    Get all gift cards (admin only)
// @route   GET /api/gift-cards/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res, next) => {
  try {
    const db = getDb();
    const { page = 1, limit = 20, status, search } = req.query;
    
    let query = 'SELECT * FROM gift_cards WHERE 1=1';
    const params = [];
    
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (search) {
      query += ' AND (code LIKE ? OR recipient_email LIKE ? OR recipient_name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    const countResult = await db.get(`SELECT COUNT(*) as total FROM (${query})`, params);
    const total = countResult?.total || 0;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const giftCards = await db.all(query, params);
    
    // Calculate summary stats
    const stats = await db.get(`
      SELECT 
        COALESCE(SUM(amount), 0) as totalAmount,
        COALESCE(SUM(balance), 0) as totalBalance,
        COUNT(*) as totalCards,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeCards,
        SUM(CASE WHEN amount > balance THEN 1 ELSE 0 END) as redeemedCards
      FROM gift_cards
    `);
    
    res.json({
      success: true,
      data: giftCards,
      stats: {
        totalAmount: stats?.totalAmount || 0,
        totalBalance: stats?.totalBalance || 0,
        totalCards: stats?.totalCards || 0,
        activeCards: stats?.activeCards || 0,
        redeemedCards: stats?.redeemedCards || 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all gift cards error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get gift cards'
    });
  }
});

// @desc    Get single gift card by code (admin only)
// @route   GET /api/gift-cards/admin/:code
// @access  Private/Admin
router.get('/admin/:code', protect, admin, async (req, res, next) => {
  try {
    const { code } = req.params;
    const db = getDb();
    
    const giftCard = await db.get('SELECT * FROM gift_cards WHERE code = ?', [code]);
    
    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Gift card not found'
      });
    }
    
    res.json({
      success: true,
      data: giftCard
    });
  } catch (error) {
    console.error('Get gift card by code error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get gift card'
    });
  }
});

// @desc    Update gift card (admin only)
// @route   PUT /api/gift-cards/admin/:code
// @access  Private/Admin
router.put('/admin/:code', protect, admin, async (req, res, next) => {
  try {
    const { code } = req.params;
    const { amount, balance, recipientName, recipientEmail, senderName, message, expiresAt, status } = req.body;
    const db = getDb();
    
    const giftCard = await db.get('SELECT * FROM gift_cards WHERE code = ?', [code]);
    
    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Gift card not found'
      });
    }
    
    const updates = [];
    const params = [];
    
    if (amount !== undefined) {
      updates.push('amount = ?');
      params.push(amount);
      if (giftCard.balance === giftCard.amount) {
        updates.push('balance = ?');
        params.push(amount);
      }
    }
    
    if (balance !== undefined) {
      updates.push('balance = ?');
      params.push(balance);
    }
    
    if (recipientName !== undefined) {
      updates.push('recipient_name = ?');
      params.push(recipientName);
    }
    
    if (recipientEmail !== undefined) {
      updates.push('recipient_email = ?');
      params.push(recipientEmail);
    }
    
    if (senderName !== undefined) {
      updates.push('sender_name = ?');
      params.push(senderName);
    }
    
    if (message !== undefined) {
      updates.push('message = ?');
      params.push(message);
    }
    
    if (expiresAt !== undefined) {
      updates.push('expiresAt = ?');
      params.push(expiresAt);
    }
    
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    updates.push('updatedAt = ?');
    params.push(new Date().toISOString());
    params.push(code);
    
    await db.run(`UPDATE gift_cards SET ${updates.join(', ')} WHERE code = ?`, params);
    
    const updated = await db.get('SELECT * FROM gift_cards WHERE code = ?', [code]);
    
    res.json({
      success: true,
      data: updated,
      message: 'Gift card updated successfully'
    });
  } catch (error) {
    console.error('Update gift card error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update gift card'
    });
  }
});

// @desc    Update gift card status (admin only)
// @route   PUT /api/gift-cards/admin/:code/status
// @access  Private/Admin
router.put('/admin/:code/status', protect, admin, async (req, res, next) => {
  try {
    const { code } = req.params;
    const { status } = req.body;
    const db = getDb();
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active" or "inactive"'
      });
    }
    
    const giftCard = await db.get('SELECT * FROM gift_cards WHERE code = ?', [code]);
    
    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Gift card not found'
      });
    }
    
    await db.run('UPDATE gift_cards SET status = ?, updatedAt = ? WHERE code = ?', 
      [status, new Date().toISOString(), code]);
    
    const updated = await db.get('SELECT * FROM gift_cards WHERE code = ?', [code]);
    
    res.json({
      success: true,
      data: updated,
      message: `Gift card ${status === 'active' ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Update gift card status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update gift card status'
    });
  }
});

// @desc    Delete gift card (admin only)
// @route   DELETE /api/gift-cards/admin/:code
// @access  Private/Admin
router.delete('/admin/:code', protect, admin, async (req, res, next) => {
  try {
    const { code } = req.params;
    const db = getDb();
    
    console.log('Deleting gift card with code:', code);
    
    // Check if gift card exists
    const giftCard = await db.get('SELECT * FROM gift_cards WHERE code = ?', [code]);
    
    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Gift card not found'
      });
    }
    
    // Delete the gift card
    const result = await db.run('DELETE FROM gift_cards WHERE code = ?', [code]);
    
    console.log('Delete result - changes:', result.changes);
    
    res.json({
      success: true,
      message: 'Gift card deleted successfully'
    });
  } catch (error) {
    console.error('Delete gift card error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete gift card'
    });
  }
});

// @desc    Get gift card statistics (admin only)
// @route   GET /api/gift-cards/admin/stats/summary
// @access  Private/Admin
router.get('/admin/stats/summary', protect, admin, async (req, res, next) => {
  try {
    const db = getDb();
    
    const stats = await db.get(`
      SELECT 
        COUNT(*) as totalCards,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeCards,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactiveCards,
        COALESCE(SUM(amount), 0) as totalAmount,
        COALESCE(SUM(balance), 0) as totalBalance,
        SUM(CASE WHEN amount > balance THEN 1 ELSE 0 END) as redeemedCards,
        SUM(CASE WHEN amount = balance AND status = 'active' THEN 1 ELSE 0 END) as unusedCards,
        COALESCE(AVG(amount), 0) as averageAmount
      FROM gift_cards
    `);
    
    // Get monthly summary
    const monthlyStats = await db.all(`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total
      FROM gift_cards
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month DESC
      LIMIT 6
    `);
    
    res.json({
      success: true,
      data: {
        summary: stats,
        monthly: monthlyStats
      }
    });
  } catch (error) {
    console.error('Get gift card stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get gift card statistics'
    });
  }
});

// @desc    Bulk delete gift cards (admin only)
// @route   DELETE /api/gift-cards/admin/bulk
// @access  Private/Admin
router.delete('/admin/bulk', protect, admin, async (req, res, next) => {
  try {
    const { codes } = req.body;
    const db = getDb();
    
    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of gift card codes to delete'
      });
    }
    
    const placeholders = codes.map(() => '?').join(',');
    await db.run(`DELETE FROM gift_cards WHERE code IN (${placeholders})`, codes);
    
    res.json({
      success: true,
      message: `${codes.length} gift cards deleted successfully`
    });
  } catch (error) {
    console.error('Bulk delete gift cards error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete gift cards'
    });
  }
});

module.exports = router;