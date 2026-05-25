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
    
    query += ' ORDER BY sortOrder ASC, id ASC';
    
    const faqs = await db.all(query, params);
    
    res.json({ success: true, faqs });
  } catch (error) {
    console.error('GET /faqs error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// Get FAQ categories
router.get('/categories', async (req, res) => {
  try {
    const db = getDb();
    const categories = await db.all('SELECT DISTINCT category FROM faqs WHERE category IS NOT NULL AND category != ""');
    
    res.json({ success: true, categories: categories.map(c => c.category) });
  } catch (error) {
    console.error('GET /faqs/categories error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// Get single FAQ
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const faq = await db.get('SELECT * FROM faqs WHERE id = ?', id);
    
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    res.json({ success: true, faq });
  } catch (error) {
    console.error('GET /faqs/:id error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
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
    `, [question, answer, category || 'general', sortOrder || 0]);
    
    const newFaq = await db.get('SELECT * FROM faqs WHERE id = ?', result.lastID);
    
    res.status(201).json({ success: true, faq: newFaq });
  } catch (error) {
    console.error('POST /faqs error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// Update FAQ (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    // First check if FAQ exists
    const existingFaq = await db.get('SELECT * FROM faqs WHERE id = ?', id);
    if (!existingFaq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    const { question, answer, category, sortOrder } = req.body;
    
    // Use existing values if not provided
    const updatedQuestion = question !== undefined ? question : existingFaq.question;
    const updatedAnswer = answer !== undefined ? answer : existingFaq.answer;
    const updatedCategory = category !== undefined ? category : existingFaq.category;
    const updatedSortOrder = sortOrder !== undefined ? sortOrder : existingFaq.sortOrder;
    
    await db.run(`
      UPDATE faqs 
      SET question = ?, answer = ?, category = ?, sortOrder = ?
      WHERE id = ?
    `, [updatedQuestion, updatedAnswer, updatedCategory, updatedSortOrder, id]);
    
    const updatedFaq = await db.get('SELECT * FROM faqs WHERE id = ?', id);
    
    res.json({ success: true, faq: updatedFaq });
  } catch (error) {
    console.error('PUT /faqs/:id error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// Delete FAQ (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    // First check if FAQ exists
    const existingFaq = await db.get('SELECT * FROM faqs WHERE id = ?', id);
    if (!existingFaq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    
    await db.run('DELETE FROM faqs WHERE id = ?', id);
    
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('DELETE /faqs/:id error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

module.exports = router;