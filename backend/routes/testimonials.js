const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const testimonials = await db.all('SELECT * FROM testimonials WHERE verified = 1 ORDER BY name');
    
    res.json({ success: true, testimonials });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single testimonial
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const testimonial = await db.get('SELECT * FROM testimonials WHERE _id = ?', id);
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    
    res.json({ success: true, testimonial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create testimonial
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { name, role, location, image, content, rating } = req.body;
    const testimonialId = uuidv4();
    
    await db.run(`
      INSERT INTO testimonials (_id, name, role, location, image, content, rating, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [testimonialId, name, role, location, image, content, rating || 5, 0]);
    
    const newTestimonial = await db.get('SELECT * FROM testimonials WHERE _id = ?', testimonialId);
    
    res.status(201).json({ success: true, testimonial: newTestimonial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update testimonial (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const testimonial = await db.get('SELECT * FROM testimonials WHERE _id = ?', id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
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
    await db.run(`UPDATE testimonials SET ${fields.join(', ')} WHERE _id = ?`, values);
    
    const updatedTestimonial = await db.get('SELECT * FROM testimonials WHERE _id = ?', id);
    
    res.json({ success: true, testimonial: updatedTestimonial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete testimonial (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const testimonial = await db.get('SELECT * FROM testimonials WHERE _id = ?', id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    
    await db.run('DELETE FROM testimonials WHERE _id = ?', id);
    
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;