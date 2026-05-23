const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { category } = req.query;
    
    let query = 'SELECT * FROM faqs';
    const params = [];
    
    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY sortOrder ASC';
    
    const faqs = await db.all(query, params);
    
    res.json({ success: true, faqs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get FAQ categories
router.get('/categories', async (req, res) => {
  try {
    const db = getDb();
    const categories = await db.all('SELECT DISTINCT category FROM faqs WHERE category IS NOT NULL');
    
    res.json({ success: true, categories: categories.map(c => c.category) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single FAQ
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const faq = await db.get('SELECT * FROM faqs WHERE _id = ?', id);
    
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    res.json({ success: true, faq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create FAQ (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { question, answer, category, sortOrder } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }
    
    const result = await db.run(`
      INSERT INTO faqs (question, answer, category, sortOrder)
      VALUES (?, ?, ?, ?)
    `, [question, answer, category || null, sortOrder || 0]);
    
    const newFaq = await db.get('SELECT * FROM faqs WHERE _id = ?', result.lastID);
    
    res.status(201).json({ success: true, faq: newFaq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update FAQ (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const faq = await db.get('SELECT * FROM faqs WHERE _id = ?', id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    const { question, answer, category, sortOrder } = req.body;
    
    await db.run(`
      UPDATE faqs SET question = ?, answer = ?, category = ?, sortOrder = ?
      WHERE _id = ?
    `, [question || faq.question, answer || faq.answer, category || faq.category, sortOrder || faq.sortOrder, id]);
    
    const updatedFaq = await db.get('SELECT * FROM faqs WHERE _id = ?', id);
    
    res.json({ success: true, faq: updatedFaq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete FAQ (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const faq = await db.get('SELECT * FROM faqs WHERE _id = ?', id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    await db.run('DELETE FROM faqs WHERE _id = ?', id);
    
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;