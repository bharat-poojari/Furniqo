// routes/cart.js

const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { protect } = require('../middleware/auth');

// Helper to calculate cart totals
const calculateCartTotals = async (userId) => {
  const db = getDb();
  
  const cartItems = await db.all(`
    SELECT c.*, p.name, p.price as basePrice, p.originalPrice, p.images, p.stock as productStock,
           p.slug, p.rating, p.numReviews
    FROM cart_items c
    JOIN products p ON c.product_id = p._id
    WHERE c.user_id = ?
  `, [userId]);
  
  let subtotal = 0;
  const items = cartItems.map(item => {
    const price = item.basePrice;
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;
    return {
      ...item,
      price,
      itemTotal
    };
  });
  
  return {
    items,
    subtotal,
    itemCount: cartItems.length,
    totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };
};

// Helper to get variant details if variant_id exists
const getVariantDetails = async (variantId) => {
  if (!variantId) return null;
  const db = getDb();
  const variant = await db.get(
    'SELECT * FROM product_variants WHERE id = ?',
    [variantId]
  );
  return variant;
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const db = getDb();
    
    const cartData = await calculateCartTotals(req.user._id);
    
    // Get full product details for each item
    const itemsWithDetails = await Promise.all(
      cartData.items.map(async (item) => {
        const product = await db.get(
          `SELECT _id, name, slug, price, originalPrice, images, stock, inStock, rating, numReviews
           FROM products WHERE _id = ?`,
          [item.product_id]
        );

        const parsedImages = product?.images
          ? typeof product.images === 'string'
            ? JSON.parse(product.images)
            : product.images
          : [];

        // Get variant details if variant_id exists
        let variant = null;
        if (item.variant_id) {
          variant = await getVariantDetails(item.variant_id);
        }

        return {
          _id: item.id,
          product: product
            ? { ...product, images: Array.isArray(parsedImages) ? parsedImages : [] }
            : { _id: item.product_id, images: [] },
          quantity: item.quantity,
          variant: variant,
          addedAt: item.addedAt
        };
      })
    );
    
    res.json({
      success: true,
      data: {
        items: itemsWithDetails,
        subtotal: cartData.subtotal,
        itemCount: cartData.itemCount,
        totalQuantity: cartData.totalQuantity
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart',
      error: error.message
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
router.post('/add', protect, async (req, res, next) => {
  try {
    const { productId, quantity = 1, variantId = null } = req.body;
    const db = getDb();
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    // Check if product exists and has stock
    let stockToCheck = 0;
    let priceToUse = 0;
    
    const product = await db.get(
      'SELECT _id, name, price, stock, inStock FROM products WHERE _id = ?',
      [productId]
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // If variantId is provided, check variant stock
    let variant = null;
    if (variantId) {
      variant = await db.get(
        'SELECT * FROM product_variants WHERE id = ? AND product_id = ?',
        [variantId, productId]
      );
      if (variant) {
        stockToCheck = variant.stock;
        priceToUse = variant.price || product.price;
      } else {
        return res.status(404).json({
          success: false,
          message: 'Variant not found'
        });
      }
    } else {
      stockToCheck = product.stock;
      priceToUse = product.price;
    }
    
    if (!product.inStock || stockToCheck < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }
    
    // Check if item already exists in cart
    let existingItem = null;
    
    if (variantId) {
      existingItem = await db.get(
        `SELECT id, quantity FROM cart_items 
         WHERE user_id = ? AND product_id = ? AND variant_id = ?`,
        [req.user._id, productId, variantId]
      );
    } else {
      existingItem = await db.get(
        `SELECT id, quantity FROM cart_items 
         WHERE user_id = ? AND product_id = ? AND variant_id IS NULL`,
        [req.user._id, productId]
      );
    }
    
    if (existingItem) {
      // Update existing item
      const newQuantity = existingItem.quantity + quantity;
      
      if (stockToCheck < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${stockToCheck} items available in stock`
        });
      }
      
      await db.run(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItem.id]
      );
    } else {
      // Add new item
      await db.run(
        `INSERT INTO cart_items (user_id, product_id, variant_id, quantity)
         VALUES (?, ?, ?, ?)`,
        [req.user._id, productId, variantId, quantity]
      );
    }
    
    const cartData = await calculateCartTotals(req.user._id);
    
    res.json({
      success: true,
      message: 'Item added to cart',
      data: {
        itemCount: cartData.itemCount,
        subtotal: cartData.subtotal
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
router.put('/update/:itemId', protect, async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const db = getDb();
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }
    
    const cartItem = await db.get(
      `SELECT c.*, p.stock as productStock, p.name 
       FROM cart_items c
       JOIN products p ON c.product_id = p._id
       WHERE c.id = ? AND c.user_id = ?`,
      [itemId, req.user._id]
    );
    
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    
    // Check stock based on whether it's a variant or not
    let availableStock = cartItem.productStock;
    if (cartItem.variant_id) {
      const variant = await db.get(
        'SELECT stock FROM product_variants WHERE id = ?',
        [cartItem.variant_id]
      );
      if (variant) {
        availableStock = variant.stock;
      }
    }
    
    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items available in stock`
      });
    }
    
    await db.run(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, itemId]
    );
    
    const cartData = await calculateCartTotals(req.user._id);
    
    res.json({
      success: true,
      message: 'Cart updated',
      data: {
        itemCount: cartData.itemCount,
        subtotal: cartData.subtotal
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
router.delete('/remove/:itemId', protect, async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const db = getDb();
    
    const result = await db.run(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [itemId, req.user._id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    
    const cartData = await calculateCartTotals(req.user._id);
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        itemCount: cartData.itemCount,
        subtotal: cartData.subtotal
      }
    });
  } catch (error) {
    console.error('Remove cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: error.message
    });
  }
});

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete('/clear', protect, async (req, res, next) => {
  try {
    const db = getDb();
    
    await db.run('DELETE FROM cart_items WHERE user_id = ?', [req.user._id]);
    
    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
});

// @desc    Sync cart (for guest to logged-in user)
// @route   POST /api/cart/sync
// @access  Private
router.post('/sync', protect, async (req, res, next) => {
  try {
    const { items } = req.body;
    const db = getDb();
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }
    
    for (const item of items) {
      const { productId, quantity, variantId = null } = item;
      
      if (!productId || quantity < 1) continue;
      
      // Check product exists and stock
      const product = await db.get(
        'SELECT _id, stock, inStock FROM products WHERE _id = ?',
        [productId]
      );
      
      if (!product || !product.inStock) continue;
      
      let availableStock = product.stock;
      if (variantId) {
        const variant = await db.get(
          'SELECT stock FROM product_variants WHERE id = ? AND product_id = ?',
          [variantId, productId]
        );
        if (variant) {
          availableStock = variant.stock;
        }
      }
      
      const availableQty = Math.min(quantity, availableStock);
      if (availableQty <= 0) continue;
      
      // Check existing
      let existingItem = null;
      if (variantId) {
        existingItem = await db.get(
          `SELECT id, quantity FROM cart_items 
           WHERE user_id = ? AND product_id = ? AND variant_id = ?`,
          [req.user._id, productId, variantId]
        );
      } else {
        existingItem = await db.get(
          `SELECT id, quantity FROM cart_items 
           WHERE user_id = ? AND product_id = ? AND variant_id IS NULL`,
          [req.user._id, productId]
        );
      }
      
      if (existingItem) {
        const newQty = Math.min(existingItem.quantity + availableQty, availableStock);
        await db.run(
          'UPDATE cart_items SET quantity = ? WHERE id = ?',
          [newQty, existingItem.id]
        );
      } else {
        await db.run(
          `INSERT INTO cart_items (user_id, product_id, variant_id, quantity)
           VALUES (?, ?, ?, ?)`,
          [req.user._id, productId, variantId, availableQty]
        );
      }
    }
    
    const cartData = await calculateCartTotals(req.user._id);
    
    res.json({
      success: true,
      message: 'Cart synced successfully',
      data: {
        itemCount: cartData.itemCount,
        subtotal: cartData.subtotal
      }
    });
  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync cart',
      error: error.message
    });
  }
});

module.exports = router;