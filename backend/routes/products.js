const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all products with filters (NO PAGINATION - return all)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { category, search, minPrice, maxPrice, sort, featured, trending, bestSeller, newArrival, onSale } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    // Apply filters
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    
    if (featured === 'true') {
      query += ' AND featured = 1';
    }
    
    if (trending === 'true') {
      query += ' AND trending = 1';
    }
    
    if (bestSeller === 'true') {
      query += ' AND bestSeller = 1';
    }
    
    if (newArrival === 'true') {
      query += ' AND newArrival = 1';
    }
    
    if (onSale === 'true') {
      query += ' AND onSale = 1';
    }
    
    // Apply sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price DESC';
        break;
      case 'rating':
        query += ' ORDER BY rating DESC';
        break;
      case 'newest':
        query += ' ORDER BY createdAt DESC';
        break;
      case 'oldest':
        query += ' ORDER BY createdAt ASC';
        break;
      case 'id_asc':
        query += ' ORDER BY _id ASC';
        break;
      default:
        query += ' ORDER BY createdAt DESC';
    }
    
    const products = await db.all(query, params);
    
    // Parse JSON fields
    const parsedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      features: product.features ? JSON.parse(product.features) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      inStock: product.inStock === 1,
      featured: product.featured === 1,
      trending: product.trending === 1,
      bestSeller: product.bestSeller === 1,
      newArrival: product.newArrival === 1,
      onSale: product.onSale === 1
    }));
    
    res.json({
      success: true,
      products: parsedProducts,
      total: parsedProducts.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get related products for a specific product
router.get('/:identifier/related', async (req, res) => {
  try {
    const db = getDb();
    const { identifier } = req.params;
    const limit = parseInt(req.query.limit, 10) || 10;

    const product = await db.get(
      'SELECT * FROM products WHERE slug = ? OR _id = ?',
      [identifier, identifier]
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let relatedProducts = await db.all(
      'SELECT * FROM products WHERE category = ? AND _id != ? ORDER BY createdAt DESC LIMIT ?',
      [product.category, product._id, limit]
    );

    if (!relatedProducts || relatedProducts.length === 0) {
      relatedProducts = await db.all(
        'SELECT * FROM products WHERE _id != ? ORDER BY createdAt DESC LIMIT ?',
        [product._id, limit]
      );
    }

    const parsedProducts = relatedProducts.map((item) => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : [],
      features: item.features ? JSON.parse(item.features) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
      inStock: item.inStock === 1,
      featured: item.featured === 1,
      trending: item.trending === 1,
      bestSeller: item.bestSeller === 1,
      newArrival: item.newArrival === 1,
      onSale: item.onSale === 1,
    }));

    return res.json({ success: true, data: parsedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single product by slug or ID
router.get('/:identifier', async (req, res) => {
  try {
    const db = getDb();
    const { identifier } = req.params;
    
    let product = await db.get(
      'SELECT * FROM products WHERE slug = ? OR _id = ?',
      [identifier, identifier]
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Get variants
    const variants = await db.all(
      'SELECT * FROM product_variants WHERE product_id = ?',
      product._id
    );
    
    // Get reviews
    const reviews = await db.all(
      'SELECT * FROM product_reviews WHERE product_id = ? ORDER BY date DESC',
      product._id
    );
    
    // Parse JSON fields
    const parsedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      features: product.features ? JSON.parse(product.features) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      variants: variants,
      reviews: reviews,
      inStock: product.inStock === 1,
      featured: product.featured === 1,
      trending: product.trending === 1,
      bestSeller: product.bestSeller === 1,
      newArrival: product.newArrival === 1,
      onSale: product.onSale === 1
    };
    
    res.json({ success: true, product: parsedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const productId = uuidv4();
    
    const {
      name, slug, description, shortDescription, price, originalPrice,
      category, subcategory, material, color, style, dimensions, weight,
      stock, images, features, tags, featured, trending, bestSeller, newArrival, onSale
    } = req.body;
    
    await db.run(`
      INSERT INTO products (
        _id, name, slug, description, shortDescription, price, originalPrice,
        category, subcategory, material, color, style, dimensions, weight,
        inStock, stock, images, features, tags, featured, trending, bestSeller,
        newArrival, onSale, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      productId, name, slug, description, shortDescription, price, originalPrice,
      category, subcategory, material, color, style, dimensions, weight,
      stock > 0 ? 1 : 0, stock, JSON.stringify(images || []),
      JSON.stringify(features || []), JSON.stringify(tags || []),
      featured ? 1 : 0, trending ? 1 : 0, bestSeller ? 1 : 0,
      newArrival ? 1 : 0, onSale ? 1 : 0,
      new Date().toISOString(), new Date().toISOString()
    ]);
    
    const newProduct = await db.get('SELECT * FROM products WHERE _id = ?', productId);
    
    res.status(201).json({
      success: true,
      product: { ...newProduct, images: JSON.parse(newProduct.images) }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const product = await db.get('SELECT * FROM products WHERE _id = ?', id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const updates = req.body;
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== '_id') {
        let processedValue = value;
        if (key === 'images' || key === 'features' || key === 'tags') {
          processedValue = JSON.stringify(value);
        }
        if (key === 'inStock') {
          processedValue = value ? 1 : 0;
        }
        if (['featured', 'trending', 'bestSeller', 'newArrival', 'onSale'].includes(key)) {
          processedValue = value ? 1 : 0;
        }
        fields.push(`${key} = ?`);
        values.push(processedValue);
      }
    }
    
    fields.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);
    
    await db.run(`UPDATE products SET ${fields.join(', ')} WHERE _id = ?`, values);
    
    const updatedProduct = await db.get('SELECT * FROM products WHERE _id = ?', id);
    
    res.json({
      success: true,
      product: { ...updatedProduct, images: JSON.parse(updatedProduct.images) }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const product = await db.get('SELECT * FROM products WHERE _id = ?', id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    await db.run('DELETE FROM products WHERE _id = ?', id);
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add product review
router.post('/:id/reviews', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { userName, rating, title, comment } = req.body;
    
    const product = await db.get('SELECT * FROM products WHERE _id = ?', id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const reviewId = uuidv4();
    await db.run(`
      INSERT INTO product_reviews (_id, product_id, user_name, rating, title, comment, date, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [reviewId, id, userName, rating, title, comment, new Date().toISOString().split('T')[0], 1]);
    
    // Update product rating
    const reviews = await db.all('SELECT rating FROM product_reviews WHERE product_id = ?', id);
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await db.run('UPDATE products SET rating = ?, numReviews = ? WHERE _id = ?', [avgRating, reviews.length, id]);
    
    const newReview = await db.get('SELECT * FROM product_reviews WHERE _id = ?', reviewId);
    
    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;