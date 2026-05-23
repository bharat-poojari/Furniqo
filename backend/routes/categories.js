const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const categories = await db.all('SELECT * FROM categories ORDER BY name');
    
    res.json({ success: true, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get featured categories
router.get('/featured', async (req, res) => {
  try {
    const db = getDb();
    const categories = await db.all('SELECT * FROM categories WHERE featured = 1 ORDER BY name');
    
    res.json({ success: true, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single category
router.get('/:identifier', async (req, res) => {
  try {
    const db = getDb();
    const { identifier } = req.params;
    
    const category = await db.get(
      'SELECT * FROM categories WHERE slug = ? OR _id = ?',
      [identifier, identifier]
    );
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    // Get products in this category
    const products = await db.all(
      'SELECT * FROM products WHERE category = ? ORDER BY createdAt DESC LIMIT 20',
      category.name
    );
    
    const parsedProducts = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
      inStock: p.inStock === 1
    }));
    
    res.json({
      success: true,
      category,
      products: parsedProducts,
      productCount: products.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create category (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { name, slug, image, description, itemCount, icon } = req.body;
    const categoryId = uuidv4();
    
    await db.run(`
      INSERT INTO categories (_id, name, slug, image, description, itemCount, icon)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [categoryId, name, slug, image, description, itemCount || 0, icon]);
    
    const newCategory = await db.get('SELECT * FROM categories WHERE _id = ?', categoryId);
    
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update category (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const category = await db.get('SELECT * FROM categories WHERE _id = ?', id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    const updates = req.body;
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== '_id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    values.push(id);
    await db.run(`UPDATE categories SET ${fields.join(', ')} WHERE _id = ?`, values);
    
    const updatedCategory = await db.get('SELECT * FROM categories WHERE _id = ?', id);
    
    res.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete category (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const category = await db.get('SELECT * FROM categories WHERE _id = ?', id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    await db.run('DELETE FROM categories WHERE _id = ?', id);
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;