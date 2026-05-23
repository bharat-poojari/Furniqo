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

// @desc    Create gift card (purchase)
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
      design,
      deliveryDate
    } = req.body;
    
    const db = getDb();
    
    if (!amount || amount < 10) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least $10'
      });
    }
    
    const code = generateGiftCardCode();
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year expiry
    
    await db.run(`
      INSERT INTO gift_cards (
        code, amount, balance, sender_name, sender_email,
        recipient_name, recipient_email, message, design,
        purchasedBy, expiresAt, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      code, amount, amount,
      senderName || req.user.name, req.user.email,
      recipientName || null, recipientEmail || null,
      message || null, design || 'classic',
      req.user._id, expiresAt.toISOString(), 'active'
    ]);
    
    res.status(201).json({
      success: true,
      data: {
        code,
        amount,
        expiresAt: expiresAt.toISOString(),
        recipientEmail
      },
      message: 'Gift card created successfully'
    });
  } catch (error) {
    next(error);
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
    next(error);
  }
});

// @desc    Get gift card by code (check balance)
// @route   GET /api/gift-cards/:code
// @access  Public
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const db = getDb();
    
    const giftCard = await db.get(
      `SELECT code, amount, balance, status, expiresAt 
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
        expiresAt: giftCard.expiresAt
      }
    });
  } catch (error) {
    next(error);
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
    next(error);
  }
});

// @desc    Get all gift cards (admin only)
// @route   GET /api/gift-cards/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res, next) => {
  try {
    const db = getDb();
    const { page = 1, limit = 20, status } = req.query;
    
    let query = 'SELECT * FROM gift_cards WHERE 1=1';
    const params = [];
    
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    const countResult = await db.get(`SELECT COUNT(*) as total FROM (${query})`, params);
    const total = countResult?.total || 0;
    
    const offset = (page - 1) * limit;
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const giftCards = await db.all(query, params);
    
    res.json({
      success: true,
      data: giftCards,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;