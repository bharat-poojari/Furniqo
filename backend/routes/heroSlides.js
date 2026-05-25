const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET /api/v1/hero-slides - Get all active slides (sorted) - PUBLIC
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const slides = await db.all(`
      SELECT * FROM hero_slides 
      WHERE is_active = 1 
      ORDER BY sort_order ASC, id ASC
    `);
    
    res.json({ success: true, slides });
  } catch (error) {
    console.error('GET /hero-slides error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// GET /api/v1/hero-slides/all - Get all slides including inactive (admin only)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const slides = await db.all('SELECT * FROM hero_slides ORDER BY sort_order ASC, id ASC');
    
    console.log('Admin fetching all slides, count:', slides.length);
    res.json({ success: true, slides });
  } catch (error) {
    console.error('GET /hero-slides/all error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// GET /api/v1/hero-slides/:id - Get one slide by ID - PUBLIC
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const slide = await db.get('SELECT * FROM hero_slides WHERE id = ?', id);
    
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }
    
    res.json({ success: true, slide });
  } catch (error) {
    console.error('GET /hero-slides/:id error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// POST /api/v1/hero-slides - Create new slide (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { title, subtitle, image, cta_text, cta_link, text_color, sort_order, is_active } = req.body;
    
    console.log('Creating slide with data:', { title, subtitle, image, cta_text, cta_link, text_color, sort_order, is_active });
    
    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image are required' });
    }
    
    const result = await db.run(`
      INSERT INTO hero_slides (
        title, subtitle, image, cta_text, cta_link, 
        text_color, sort_order, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [
      title, subtitle || null, image, cta_text || null, cta_link || null,
      text_color || 'light', sort_order || 0, is_active !== undefined ? is_active : 1
    ]);
    
    const newSlide = await db.get('SELECT * FROM hero_slides WHERE id = ?', result.lastID);
    
    console.log('Slide created with ID:', result.lastID);
    res.status(201).json({ success: true, slide: newSlide });
  } catch (error) {
    console.error('POST /hero-slides error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// PUT /api/v1/hero-slides/:id - Update slide (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    console.log('Updating slide ID:', id);
    console.log('Update data:', req.body);
    
    const slide = await db.get('SELECT * FROM hero_slides WHERE id = ?', id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }
    
    const { title, subtitle, image, cta_text, cta_link, text_color, sort_order, is_active } = req.body;
    
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (subtitle !== undefined) {
      updates.push('subtitle = ?');
      values.push(subtitle);
    }
    if (image !== undefined) {
      updates.push('image = ?');
      values.push(image);
    }
    if (cta_text !== undefined) {
      updates.push('cta_text = ?');
      values.push(cta_text);
    }
    if (cta_link !== undefined) {
      updates.push('cta_link = ?');
      values.push(cta_link);
    }
    if (text_color !== undefined) {
      updates.push('text_color = ?');
      values.push(text_color);
    }
    if (sort_order !== undefined) {
      updates.push('sort_order = ?');
      values.push(sort_order);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }
    
    updates.push('updated_at = datetime("now")');
    values.push(id);
    
    await db.run(`UPDATE hero_slides SET ${updates.join(', ')} WHERE id = ?`, values);
    
    const updatedSlide = await db.get('SELECT * FROM hero_slides WHERE id = ?', id);
    
    res.json({ success: true, slide: updatedSlide });
  } catch (error) {
    console.error('PUT /hero-slides/:id error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// DELETE /api/v1/hero-slides/:id - Delete slide (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    console.log('Deleting slide ID:', id);
    
    const slide = await db.get('SELECT * FROM hero_slides WHERE id = ?', id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }
    
    await db.run('DELETE FROM hero_slides WHERE id = ?', id);
    
    res.json({ success: true, message: 'Hero slide deleted successfully' });
  } catch (error) {
    console.error('DELETE /hero-slides/:id error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// PATCH /api/v1/hero-slides/:id/toggle - Toggle slide active status (admin only)
router.patch('/:id/toggle', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    console.log('Toggling slide ID:', id);
    
    const slide = await db.get('SELECT * FROM hero_slides WHERE id = ?', id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }
    
    const newStatus = slide.is_active === 1 ? 0 : 1;
    
    await db.run(`
      UPDATE hero_slides SET is_active = ?, updated_at = datetime('now') WHERE id = ?
    `, [newStatus, id]);
    
    res.json({
      success: true,
      message: `Slide ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('PATCH /hero-slides/:id/toggle error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// POST /api/v1/hero-slides/reorder - Reorder slides (admin only)
router.post('/reorder', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { orders } = req.body;
    
    console.log('Reordering slides, orders:', orders);
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'Orders array is required' });
    }
    
    for (const item of orders) {
      await db.run(`
        UPDATE hero_slides SET sort_order = ?, updated_at = datetime('now') WHERE id = ?
      `, [item.sort_order, item.id]);
    }
    
    res.json({ success: true, message: 'Slides reordered successfully' });
  } catch (error) {
    console.error('POST /hero-slides/reorder error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

module.exports = router;