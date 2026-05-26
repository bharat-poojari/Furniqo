// routes/wishlist.js

const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { protect } = require('../middleware/auth');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const db = getDb();
    
    const wishlistItems = await db.all(`
      SELECT w.*, p.name, p.slug, p.price, p.originalPrice, p.images, p.stock, p.inStock, p.rating, p.numReviews
      FROM wishlist w
      JOIN products p ON w.product_id = p._id
      WHERE w.user_id = ?
      ORDER BY w.addedAt DESC
    `, [req.user._id]);
    
    res.json({
      success: true,
      data: wishlistItems.map(item => ({
        _id: item.product_id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        originalPrice: item.originalPrice,
        images: item.images ? JSON.parse(item.images) : [],
        stock: item.stock,
        inStock: item.inStock === 1,
        rating: item.rating,
        numReviews: item.numReviews,
        addedAt: item.addedAt
      }))
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
router.post('/add', protect, async (req, res, next) => {
  try {
    const { productId } = req.body;
    const db = getDb();
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    // Check if product exists
    const product = await db.get('SELECT _id FROM products WHERE _id = ?', [productId]);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if already in wishlist
    const existing = await db.get(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user._id, productId]
    );
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }
    
    await db.run(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [req.user._id, productId]
    );
    
    res.json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
router.delete('/remove/:productId', protect, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const db = getDb();
    
    const result = await db.run(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user._id, productId]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }
    
    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
router.get('/check/:productId', protect, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const db = getDb();
    
    const existing = await db.get(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user._id, productId]
    );
    
    res.json({
      success: true,
      data: { inWishlist: !!existing }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Move wishlist items to cart (bulk)
// @route   POST /api/wishlist/move-to-cart
// @access  Private
router.post('/move-to-cart', protect, async (req, res, next) => {
  try {
    const { productIds } = req.body;
    const db = getDb();
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const productId of productIds) {
      // Check product stock
      const product = await db.get(
        'SELECT _id, stock, inStock FROM products WHERE _id = ?',
        [productId]
      );
      
      if (!product || !product.inStock || product.stock < 1) {
        skippedCount++;
        continue;
      }
      
      // Check if already in cart
      const existingCart = await db.get(
        'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND variant_id IS NULL',
        [req.user._id, productId]
      );
      
      if (existingCart) {
        const newQty = Math.min(existingCart.quantity + 1, product.stock);
        await db.run(
          'UPDATE cart_items SET quantity = ? WHERE id = ?',
          [newQty, existingCart.id]
        );
      } else {
        await db.run(
          'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [req.user._id, productId, 1]
        );
      }
      
      // Remove from wishlist
      await db.run(
        'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
        [req.user._id, productId]
      );
      
      addedCount++;
    }
    
    res.json({
      success: true,
      message: `${addedCount} item(s) moved to cart${skippedCount > 0 ? `, ${skippedCount} skipped (out of stock)` : ''}`,
      data: { addedCount, skippedCount }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;