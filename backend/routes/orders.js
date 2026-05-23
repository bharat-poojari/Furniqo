// routes/orders.js

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { protect, admin } = require('../middleware/auth');

// Helper to generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      shipping,
      billingAddress,
      billing,
      paymentMethod,
      payment,
      paymentId,
      paymentStatus,
      couponCode,
      coupon,
      giftWrap,
      giftMessage,
      notes
    } = req.body;
    
    const resolvedShippingAddress = shippingAddress || shipping || null;
    const resolvedBillingAddress = billingAddress || billing || null;
    const resolvedPaymentMethod = paymentMethod || payment?.method || payment?.brand || 'credit_card';
    const resolvedCouponCode = couponCode || coupon || null;
    const resolvedPaymentId = paymentId || null;
    const resolvedPaymentStatus = paymentStatus || payment?.status || 'pending';
    
    const db = getDb();
    
    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }
    
    if (!resolvedShippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }
    
    // Calculate totals and verify stock
    let subtotal = 0;
    let discount = 0;
    let verifiedItems = [];
    
    for (const item of items) {
      const product = await db.get(
        'SELECT _id, name, price, originalPrice, stock, inStock FROM products WHERE _id = ?',
        [item.productId]
      );
      
      if (!product || !product.inStock || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product?.name || 'Product'} is out of stock or insufficient quantity`
        });
      }
      
      const itemPrice = item.variant?.price || product.price;
      subtotal += itemPrice * item.quantity;
      
      verifiedItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: itemPrice,
        originalPrice: product.originalPrice,
        variant: item.variant || null,
        image: item.image
      });
    }
    
    // Apply coupon if provided
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await db.get(
        `SELECT * FROM coupons 
         WHERE code = ? AND isActive = 1 
         AND (validUntil IS NULL OR validUntil >= date('now'))
         AND (validFrom IS NULL OR validFrom <= date('now'))`,
        [couponCode.toUpperCase()]
      );
      
      if (coupon) {
        const minPurchaseCondition = !coupon.minPurchase || subtotal >= coupon.minPurchase;
        const newUserCondition = !coupon.forNewUsers;
        
        if (minPurchaseCondition) {
          if (coupon.type === 'percentage') {
            discount = (subtotal * coupon.discount) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else if (coupon.type === 'fixed') {
            discount = coupon.discount;
          }
          appliedCoupon = coupon;
          
          // Update coupon usage count
          await db.run(
            'UPDATE coupons SET usedCount = usedCount + 1 WHERE code = ?',
            [couponCode.toUpperCase()]
          );
        }
      }
    }
    
    const shippingCost = 0; // Calculate based on items/shipping method
    const tax = subtotal * 0.05; // 5% tax
    const giftWrapCost = giftWrap ? 5.99 : 0;
    const total = subtotal - discount + shippingCost + tax + giftWrapCost;
    
    // Create order
    const orderId = 'order_' + uuidv4();
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();
    
    await db.run(`
      INSERT INTO orders (
        _id, user_id, orderNumber, items, subtotal, shipping, tax, discount, total,
        couponCode, paymentMethod, paymentId, paymentStatus, shippingAddress, billingAddress,
        notes, giftWrap, giftMessage, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderId, req.user._id, orderNumber, JSON.stringify(verifiedItems),
      subtotal, shippingCost, tax, discount, total,
      resolvedCouponCode, resolvedPaymentMethod, resolvedPaymentId, resolvedPaymentStatus,
      JSON.stringify(resolvedShippingAddress), resolvedBillingAddress ? JSON.stringify(resolvedBillingAddress) : null,
      notes || null, giftWrap ? 1 : 0, giftMessage || null,
      'pending', now, now
    ]);
    
    // Update product stock
    for (const item of verifiedItems) {
      await db.run(
        'UPDATE products SET stock = stock - ? WHERE _id = ?',
        [item.quantity, item.productId]
      );
      
      // Update variant stock if applicable
      if (item.variant) {
        await db.run(
          `UPDATE product_variants 
           SET stock = stock - ? 
           WHERE product_id = ? AND color = ? AND size = ?`,
          [item.quantity, item.productId, item.variant.color, item.variant.size]
        );
      }
    }
    
    // Clear cart
    await db.run('DELETE FROM cart_items WHERE user_id = ?', [req.user._id]);
    
    // Get created order
    const newOrder = await db.get('SELECT * FROM orders WHERE _id = ?', [orderId]);
    newOrder.items = JSON.parse(newOrder.items);
    newOrder.shippingAddress = JSON.parse(newOrder.shippingAddress);
    if (newOrder.billingAddress) newOrder.billingAddress = JSON.parse(newOrder.billingAddress);
    
    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order placed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const db = getDb();
    const { page = 1, limit = 10, status } = req.query;
    
    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [req.user._id];
    
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    
    // Get total count
    const countResult = await db.get(`SELECT COUNT(*) as total FROM (${query})`, params);
    const total = countResult?.total || 0;
    
    const offset = (page - 1) * limit;
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const orders = await db.all(query, params);
    
    // Parse JSON fields
    const parsedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items),
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
      billingAddress: order.billingAddress ? JSON.parse(order.billingAddress) : null
    }));
    
    res.json({
      success: true,
      data: parsedOrders,
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

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const order = await db.get(
      'SELECT * FROM orders WHERE _id = ? AND (user_id = ? OR ? = ?)',
      [id, req.user._id, req.user.role, 'admin']
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    order.items = JSON.parse(order.items);
    order.shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;
    order.billingAddress = order.billingAddress ? JSON.parse(order.billingAddress) : null;
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const order = await db.get(
      'SELECT * FROM orders WHERE _id = ? AND user_id = ? AND status IN ("pending", "confirmed")',
      [id, req.user._id]
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or cannot be cancelled'
      });
    }
    
    // Restore product stock
    const items = JSON.parse(order.items);
    for (const item of items) {
      await db.run(
        'UPDATE products SET stock = stock + ? WHERE _id = ?',
        [item.quantity, item.productId]
      );
      
      if (item.variant) {
        await db.run(
          `UPDATE product_variants 
           SET stock = stock + ? 
           WHERE product_id = ? AND color = ? AND size = ?`,
          [item.quantity, item.productId, item.variant.color, item.variant.size]
        );
      }
    }
    
    await db.run(
      'UPDATE orders SET status = ?, updatedAt = ? WHERE _id = ?',
      ['cancelled', new Date().toISOString(), id]
    );
    
    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, trackingUrl, estimatedDelivery } = req.body;
    const db = getDb();
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }
    
    const updates = ['status = ?', 'updatedAt = ?'];
    const values = [status, new Date().toISOString()];
    
    if (trackingNumber !== undefined) {
      updates.push('trackingNumber = ?');
      values.push(trackingNumber);
    }
    
    if (trackingUrl !== undefined) {
      updates.push('trackingUrl = ?');
      values.push(trackingUrl);
    }
    
    if (estimatedDelivery !== undefined) {
      updates.push('estimatedDelivery = ?');
      values.push(estimatedDelivery);
    }
    
    values.push(id);
    
    await db.run(
      `UPDATE orders SET ${updates.join(', ')} WHERE _id = ?`,
      values
    );
    
    res.json({
      success: true,
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all orders (admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res, next) => {
  try {
    const db = getDb();
    const { page = 1, limit = 20, status, search } = req.query;
    
    let query = `
      SELECT o.*, u.name as userName, u.email as userEmail
      FROM orders o
      LEFT JOIN users u ON o.user_id = u._id
      WHERE 1=1
    `;
    const params = [];
    
    if (status && status !== 'all') {
      query += ' AND o.status = ?';
      params.push(status);
    }
    
    if (search) {
      query += ' AND (o.orderNumber LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    const countResult = await db.get(`SELECT COUNT(*) as total FROM (${query})`, params);
    const total = countResult?.total || 0;
    
    const offset = (page - 1) * limit;
    query += ' ORDER BY o.createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const orders = await db.all(query, params);
    
    // Parse JSON fields
    const parsedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items),
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
      billingAddress: order.billingAddress ? JSON.parse(order.billingAddress) : null
    }));
    
    res.json({
      success: true,
      data: parsedOrders,
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