const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all active coupons
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const currentDate = new Date().toISOString().split('T')[0];
    
    const coupons = await db.all(`
      SELECT * FROM coupons 
      WHERE isActive = 1 
      AND validFrom <= ? 
      AND validUntil >= ?
      ORDER BY discount DESC
    `, [currentDate, currentDate]);
    
    res.json({ success: true, coupons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Validate coupon
router.post('/validate', async (req, res) => {
  try {
    const db = getDb();
    const { code, subtotal, isNewUser = false } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }
    
    const coupon = await db.get('SELECT * FROM coupons WHERE code = ?', code.toUpperCase());
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Coupon is not active' });
    }
    
    if (coupon.validFrom > currentDate || coupon.validUntil < currentDate) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }
    
    if (coupon.forNewUsers && !isNewUser) {
      return res.status(400).json({ success: false, message: 'This coupon is for new users only' });
    }
    
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit has been reached' });
    }
    
    if (subtotal < coupon.minPurchase) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum purchase of $${coupon.minPurchase} required` 
      });
    }
    
    let discountAmount = 0;
    
    if (coupon.type === 'percentage') {
      discountAmount = (subtotal * coupon.discount) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.discount;
    }
    
    res.json({
      success: true,
      coupon: {
        ...coupon,
        discountAmount: Math.min(discountAmount, subtotal),
        isFreeShipping: coupon.type === 'freeShipping'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all coupons (admin only)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const coupons = await db.all('SELECT * FROM coupons ORDER BY validUntil DESC');
    
    res.json({ success: true, coupons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create coupon (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const {
      code, discount, type, minPurchase, maxDiscount, validFrom,
      validUntil, description, usageLimit, forNewUsers
    } = req.body;
    
    const existingCoupon = await db.get('SELECT * FROM coupons WHERE code = ?', code.toUpperCase());
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }
    
    await db.run(`
      INSERT INTO coupons (
        code, discount, type, minPurchase, maxDiscount, validFrom,
        validUntil, description, usageLimit, usedCount, isActive, forNewUsers
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      code.toUpperCase(), discount, type, minPurchase || 0, maxDiscount || null,
      validFrom, validUntil, description, usageLimit || null, 0, 1, forNewUsers ? 1 : 0
    ]);
    
    const newCoupon = await db.get('SELECT * FROM coupons WHERE code = ?', code.toUpperCase());
    
    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update coupon (admin only)
router.put('/:code', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { code } = req.params;
    
    const coupon = await db.get('SELECT * FROM coupons WHERE code = ?', code);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    
    const updates = req.body;
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'code' && key !== 'usedCount') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    values.push(code);
    await db.run(`UPDATE coupons SET ${fields.join(', ')} WHERE code = ?`, values);
    
    const updatedCoupon = await db.get('SELECT * FROM coupons WHERE code = ?', code);
    
    res.json({ success: true, coupon: updatedCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete coupon (admin only)
router.delete('/:code', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { code } = req.params;
    
    const coupon = await db.get('SELECT * FROM coupons WHERE code = ?', code);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    
    await db.run('DELETE FROM coupons WHERE code = ?', code);
    
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;