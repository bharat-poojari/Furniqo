const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all testimonials (public - only verified)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const testimonials = await db.all('SELECT * FROM testimonials WHERE verified = 1 ORDER BY created_at DESC, name');
    
    res.json({ success: true, testimonials });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all testimonials for admin (includes unverified) - NEW ENDPOINT
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    // Show ALL testimonials including unverified ones
    const testimonials = await db.all('SELECT * FROM testimonials ORDER BY created_at DESC, name');
    
    res.json({ success: true, testimonials });
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
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

// Create testimonial (no auth required for public submission)
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { name, role, location, image, content, rating, verified } = req.body;
    const testimonialId = uuidv4();
    const createdAt = new Date().toISOString();
    
    // Default verified to 0 if not provided (pending approval)
    const verifiedStatus = verified !== undefined ? verified : 0;
    
    await db.run(`
      INSERT INTO testimonials (_id, name, role, location, image, content, rating, verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [testimonialId, name, role || '', location || '', image || '', content, rating || 5, verifiedStatus, createdAt, createdAt]);
    
    const newTestimonial = await db.get('SELECT * FROM testimonials WHERE _id = ?', testimonialId);
    
    res.status(201).json({ success: true, testimonial: newTestimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
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
      if (key !== '_id' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    // Add updated_at timestamp
    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    
    await db.run(`UPDATE testimonials SET ${fields.join(', ')} WHERE _id = ?`, values);
    
    const updatedTestimonial = await db.get('SELECT * FROM testimonials WHERE _id = ?', id);
    
    res.json({ success: true, testimonial: updatedTestimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
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
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

module.exports = router;