// routes/orders.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { protect, admin } = require('../middleware/auth');

// Helper to generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Helper to generate custom order number
const generateCustomOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CUST-${timestamp}-${random}`;
};

// @desc    Create new order (supports both regular and custom orders)
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      shippingMethod,
      shippingCost: requestShippingCost,
      subtotal: requestSubtotal,
      discount: requestDiscount,
      tax: requestTax,
      total: requestTotal,
      couponCode,
      paymentMethod,
      paymentId,
      giftWrap,
      giftMessage,
      notes,
      isCustomOrder // Flag to indicate custom order
    } = req.body;
    
    const db = getDb();
    
    // Validate required fields
    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }
    
    if (!shippingAddress || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }
    
    // Calculate totals and verify stock
    let subtotal = 0;
    let discount = 0;
    let verifiedItems = [];
    let isCustom = isCustomOrder || items.some(item => item.isCustomOrder === true);
    
    for (const item of items) {
      let product = null;
      let itemPrice = item.price || 0;
      let itemName = item.name || 'Custom Furniture';
      let itemOriginalPrice = item.originalPrice || null;
      
      // Only check product in database if it's NOT a custom order
      if (!item.isCustomOrder && !isCustom) {
        product = await db.get(
          'SELECT _id, name, price, originalPrice, stock, inStock FROM products WHERE _id = ?',
          [item.productId]
        );
        
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product not found: ${item.productId}`
          });
        }
        
        if (!product.inStock || product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `${product.name} is out of stock or insufficient quantity`
          });
        }
        
        itemPrice = item.variant?.price || product.price;
        itemName = product.name;
        itemOriginalPrice = product.originalPrice;
        
        // Update product stock for regular products
        await db.run(
          'UPDATE products SET stock = stock - ? WHERE _id = ?',
          [item.quantity, product._id]
        );
        
        // Update variant stock if applicable
        if (item.variant && item.variant.color && item.variant.size) {
          await db.run(
            `UPDATE product_variants 
             SET stock = stock - ? 
             WHERE product_id = ? AND color = ? AND size = ?`,
            [item.quantity, product._id, item.variant.color, item.variant.size]
          );
        }
      }
      
      subtotal += itemPrice * item.quantity;
      
      verifiedItems.push({
        productId: item.productId || (product?._id || 'custom'),
        name: itemName,
        quantity: item.quantity,
        price: itemPrice,
        originalPrice: itemOriginalPrice,
        variant: item.variant || null,
        image: item.image || null,
        isCustomOrder: item.isCustomOrder || false,
        customConfig: item.customConfig || null
      });
    }
    
    // Apply coupon if provided (skip for custom orders)
    let appliedCouponCode = null;
    if (couponCode && !isCustom) {
      const coupon = await db.get(
        `SELECT * FROM coupons 
         WHERE code = ? AND isActive = 1 
         AND (validUntil IS NULL OR validUntil >= date('now'))
         AND (validFrom IS NULL OR validFrom <= date('now'))`,
        [couponCode.toUpperCase()]
      );
      
      if (coupon) {
        const minPurchaseCondition = !coupon.minPurchase || subtotal >= coupon.minPurchase;
        if (minPurchaseCondition) {
          if (coupon.type === 'percentage') {
            discount = (subtotal * coupon.discount) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else if (coupon.type === 'fixed') {
            discount = coupon.discount;
          }
          appliedCouponCode = coupon.code;
          
          // Update coupon usage count
          await db.run(
            'UPDATE coupons SET usedCount = usedCount + 1 WHERE code = ?',
            [couponCode.toUpperCase()]
          );
        }
      }
    }
    
    // Calculate shipping cost
    const shippingMethods = {
      standard: 0,
      express: 9.99,
      overnight: 19.99,
    };
    
    const shippingCost = typeof requestShippingCost === 'number'
      ? requestShippingCost
      : (shippingMethods[shippingMethod] || 0);
    
    // Calculate tax (assuming 5% tax rate)
    const taxRate = 0.05;
    const tax = typeof requestTax === 'number'
      ? requestTax
      : (subtotal - discount) * taxRate;
    
    const giftWrapCost = giftWrap ? 5.99 : 0;
    
    // Calculate total
    const calculatedTotal = Math.max(0, subtotal - discount + shippingCost + tax + giftWrapCost);
    const total = typeof requestTotal === 'number' ? requestTotal : calculatedTotal;
    
    // Create order
    const orderId = uuidv4();
    const orderNumber = isCustom ? generateCustomOrderNumber() : generateOrderNumber();
    const now = new Date().toISOString();
    
    // Prepare notes with custom order details
    let finalNotes = notes;
    if (isCustom && notes) {
      finalNotes = notes;
    } else if (isCustom) {
      finalNotes = JSON.stringify({
        type: 'custom_furniture',
        customItems: verifiedItems.filter(item => item.isCustomOrder).map(item => item.customConfig),
        message: 'Custom furniture order'
      });
    }
    
    await db.run(`
      INSERT INTO orders (
        _id, user_id, orderNumber, items, subtotal, shipping, tax, discount, total,
        couponCode, paymentMethod, paymentId, paymentStatus, shippingAddress, billingAddress,
        notes, giftWrap, giftMessage, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderId, 
      req.user._id, 
      orderNumber, 
      JSON.stringify(verifiedItems),
      subtotal, 
      shippingCost, 
      tax, 
      discount, 
      total,
      appliedCouponCode, 
      paymentMethod || (isCustom ? 'custom_order' : 'credit_card'), 
      paymentId || (isCustom ? `CUSTOM_${Date.now()}` : null), 
      isCustom ? 'pending_approval' : 'paid',
      JSON.stringify(shippingAddress), 
      JSON.stringify(shippingAddress),
      finalNotes || null, 
      giftWrap ? 1 : 0, 
      giftMessage || null,
      isCustom ? 'pending' : 'confirmed', 
      now, 
      now
    ]);
    
    // Only clear cart for non-custom orders
    if (!isCustom) {
      await db.run('DELETE FROM cart_items WHERE user_id = ?', [req.user._id]);
    }
    
    // Get created order
    const newOrder = await db.get('SELECT * FROM orders WHERE _id = ?', [orderId]);
    if (newOrder) {
      newOrder.items = JSON.parse(newOrder.items);
      newOrder.shippingAddress = JSON.parse(newOrder.shippingAddress);
      if (newOrder.billingAddress) newOrder.billingAddress = JSON.parse(newOrder.billingAddress);
      newOrder.shippingCost = newOrder.shipping;
    }
    
    res.status(201).json({
      success: true,
      data: newOrder,
      message: isCustom ? 'Custom order placed successfully! Our team will contact you soon.' : 'Order placed successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
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
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const orders = await db.all(query, params);
    
    // Parse JSON fields
    const parsedOrders = orders.map(order => ({
      ...order,
      items: order.items ? JSON.parse(order.items) : [],
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
      billingAddress: order.billingAddress ? JSON.parse(order.billingAddress) : null,
      shippingCost: order.shipping
    }));
    
    res.json({
      success: true,
      data: parsedOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
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
    
    const order = await db.get('SELECT * FROM orders WHERE _id = ?', [id]);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization: owners or admins
    if (req.user.role !== 'admin' && order.user_id !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    order.items = order.items ? JSON.parse(order.items) : [];
    order.shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;
    order.billingAddress = order.billingAddress ? JSON.parse(order.billingAddress) : null;
    order.shippingCost = order.shipping;

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
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
    
    // Parse items
    const items = JSON.parse(order.items);
    
    // Restore product stock (only for non-custom items)
    for (const item of items) {
      if (!item.isCustomOrder && item.productId !== 'custom') {
        await db.run(
          'UPDATE products SET stock = stock + ? WHERE _id = ?',
          [item.quantity, item.productId]
        );
        
        if (item.variant && item.variant.color && item.variant.size) {
          await db.run(
            `UPDATE product_variants 
             SET stock = stock + ? 
             WHERE product_id = ? AND color = ? AND size = ?`,
            [item.quantity, item.productId, item.variant.color, item.variant.size]
          );
        }
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
    console.error('Cancel order error:', error);
    next(error);
  }
});

// @desc    Track order by order number (public)
// @route   POST /api/orders/track
// @access  Public
router.post('/track', async (req, res, next) => {
  try {
    const { orderNumber, email } = req.body;
    const db = getDb();
    
    if (!orderNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Order number and email are required'
      });
    }
    
    const order = await db.get(
      `SELECT o.*, u.email as userEmail 
       FROM orders o
       LEFT JOIN users u ON o.user_id = u._id
       WHERE o.orderNumber = ?`,
      [orderNumber]
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Verify email matches
    if (order.userEmail !== email && order.shippingAddress) {
      const shippingAddr = JSON.parse(order.shippingAddress);
      if (shippingAddr.email !== email) {
        return res.status(403).json({
          success: false,
          message: 'Email does not match order'
        });
      }
    }
    
    order.items = order.items ? JSON.parse(order.items) : [];
    order.shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : null;
    order.shippingCost = order.shipping;
    
    // Generate tracking timeline
    const timeline = [];
    const createdAt = new Date(order.createdAt);
    const now = new Date();
    
    // Order placed
    timeline.push({
      status: 'Order Placed',
      date: createdAt.toLocaleDateString(),
      time: createdAt.toLocaleTimeString(),
      completed: true
    });
    
    // Order confirmed
    if (order.status !== 'pending') {
      const confirmedDate = new Date(createdAt.getTime() + 3600000);
      timeline.push({
        status: 'Order Confirmed',
        date: confirmedDate.toLocaleDateString(),
        time: confirmedDate.toLocaleTimeString(),
        completed: true
      });
    }
    
    // Processing
    if (['processing', 'shipped', 'delivered'].includes(order.status)) {
      const processingDate = new Date(createdAt.getTime() + 86400000);
      timeline.push({
        status: 'Processing',
        date: processingDate.toLocaleDateString(),
        time: processingDate.toLocaleTimeString(),
        completed: true
      });
    }
    
    // Shipped
    if (['shipped', 'delivered'].includes(order.status)) {
      const shippedDate = new Date(createdAt.getTime() + 172800000);
      timeline.push({
        status: 'Shipped',
        date: shippedDate.toLocaleDateString(),
        time: shippedDate.toLocaleTimeString(),
        completed: true,
        current: order.status === 'shipped'
      });
    }
    
    // Delivered
    if (order.status === 'delivered') {
      const deliveredDate = new Date(createdAt.getTime() + 345600000);
      timeline.push({
        status: 'Delivered',
        date: deliveredDate.toLocaleDateString(),
        time: deliveredDate.toLocaleTimeString(),
        completed: true
      });
    }
    
    res.json({
      success: true,
      data: {
        ...order,
        timeline
      }
    });
  } catch (error) {
    console.error('Track order error:', error);
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
    console.error('Update order status error:', error);
    next(error);
  }
});

// @desc    Get all orders (admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res, next) => {
  try {
    const db = getDb();
    const { page = 1, limit = 20, status, search, type } = req.query;
    
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
    
    // Filter by order type (custom vs regular)
    if (type === 'custom') {
      query += " AND o.orderNumber LIKE 'CUST-%'";
    } else if (type === 'regular') {
      query += " AND o.orderNumber NOT LIKE 'CUST-%'";
    }
    
    if (search) {
      query += ' AND (o.orderNumber LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    const countResult = await db.get(`SELECT COUNT(*) as total FROM (${query})`, params);
    const total = countResult?.total || 0;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' ORDER BY o.createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const orders = await db.all(query, params);
    
    // Parse JSON fields
    const parsedOrders = orders.map(order => ({
      ...order,
      items: order.items ? JSON.parse(order.items) : [],
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
      billingAddress: order.billingAddress ? JSON.parse(order.billingAddress) : null,
      shippingCost: order.shipping,
      isCustomOrder: order.orderNumber?.startsWith('CUST-') || false
    }));
    
    res.json({
      success: true,
      data: parsedOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    next(error);
  }
});

// @desc    Get custom orders summary (admin only)
// @route   GET /api/orders/admin/custom/summary
// @access  Private/Admin
router.get('/admin/custom/summary', protect, admin, async (req, res, next) => {
  try {
    const db = getDb();
    
    const customOrders = await db.all(`
      SELECT * FROM orders 
      WHERE orderNumber LIKE 'CUST-%' 
      ORDER BY createdAt DESC
    `);
    
    const totalCustomOrders = customOrders.length;
    const pendingCustomOrders = customOrders.filter(o => o.status === 'pending').length;
    const totalValue = customOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    // Parse custom order details
    const parsedOrders = customOrders.map(order => ({
      ...order,
      items: order.items ? JSON.parse(order.items) : [],
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
      customDetails: order.notes ? JSON.parse(order.notes) : null
    }));
    
    res.json({
      success: true,
      data: {
        summary: {
          totalCustomOrders,
          pendingCustomOrders,
          completedCustomOrders: totalCustomOrders - pendingCustomOrders,
          totalValue
        },
        orders: parsedOrders
      }
    });
  } catch (error) {
    console.error('Get custom orders summary error:', error);
    next(error);
  }
});

// @desc    Delete order (admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const order = await db.get('SELECT * FROM orders WHERE _id = ?', [id]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await db.run('DELETE FROM orders WHERE _id = ?', [id]);

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    next(error);
  }
});

module.exports = router;