const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET /api/hero-slides - Get all active slides (sorted)
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
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/hero-slides/:id - Get one slide by ID
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
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/hero-slides/admin/all - Get all slides including inactive (admin only)
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const slides = await db.all('SELECT * FROM hero_slides ORDER BY sort_order ASC, id ASC');
    
    res.json({ success: true, slides });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/hero-slides - Create new slide (admin)
router.post('/admin/hero-slides', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { title, subtitle, image, cta_text, cta_link, text_color, sort_order, is_active } = req.body;
    
    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image are required' });
    }
    
    const result = await db.run(`
      INSERT INTO hero_slides (
        title, subtitle, image, cta_text, cta_link, 
        text_color, sort_order, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, subtitle || null, image, cta_text || null, cta_link || null,
      text_color || 'light', sort_order || 0, is_active !== undefined ? is_active : 1,
      new Date().toISOString(), new Date().toISOString()
    ]);
    
    const newSlide = await db.get('SELECT * FROM hero_slides WHERE id = ?', result.lastID);
    
    res.status(201).json({ success: true, slide: newSlide });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/hero-slides/:id - Update slide (admin)
router.put('/admin/hero-slides/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
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
    
    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    
    await db.run(`UPDATE hero_slides SET ${updates.join(', ')} WHERE id = ?`, values);
    
    const updatedSlide = await db.get('SELECT * FROM hero_slides WHERE id = ?', id);
    
    res.json({ success: true, slide: updatedSlide });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/hero-slides/:id - Delete slide (admin)
router.delete('/admin/hero-slides/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const slide = await db.get('SELECT * FROM hero_slides WHERE id = ?', id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }
    
    await db.run('DELETE FROM hero_slides WHERE id = ?', id);
    
    res.json({ success: true, message: 'Hero slide deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/admin/hero-slides/:id/toggle - Toggle slide active status (admin)
router.patch('/admin/hero-slides/:id/toggle', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const slide = await db.get('SELECT * FROM hero_slides WHERE id = ?', id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Hero slide not found' });
    }
    
    const newStatus = slide.is_active === 1 ? 0 : 1;
    
    await db.run(`
      UPDATE hero_slides SET is_active = ?, updated_at = ? WHERE id = ?
    `, [newStatus, new Date().toISOString(), id]);
    
    res.json({
      success: true,
      message: `Slide ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/hero-slides/reorder - Reorder slides (admin)
router.post('/admin/hero-slides/reorder', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { orders } = req.body; // Array of { id, sort_order }
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'Orders array is required' });
    }
    
    for (const item of orders) {
      await db.run(`
        UPDATE hero_slides SET sort_order = ?, updated_at = ? WHERE id = ?
      `, [item.sort_order, new Date().toISOString(), item.id]);
    }
    
    res.json({ success: true, message: 'Slides reordered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;