const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const db = getDb();
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }
    
    const contactId = uuidv4();
    
    await db.run(`
      INSERT INTO contacts (_id, name, email, phone, subject, message, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [contactId, name, email, phone || null, subject || null, message, 'unread', new Date().toISOString(), new Date().toISOString()]);
    
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all contacts (admin only)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = 'SELECT * FROM contacts';
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await db.get(countQuery, params);
    const total = countResult.total;
    
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(parseInt(limit), offset);
    
    const contacts = await db.all(query, params);
    
    res.json({
      success: true,
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update contact status (admin only)
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { status } = req.body;
    
    const contact = await db.get('SELECT * FROM contacts WHERE _id = ?', id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    
    await db.run(`
      UPDATE contacts SET status = ?, updatedAt = ? WHERE _id = ?
    `, [status, new Date().toISOString(), id]);
    
    res.json({ success: true, message: 'Contact status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Subscribe to newsletter
router.post('/newsletter/subscribe', async (req, res) => {
  try {
    const db = getDb();
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    try {
      await db.run('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);
      res.json({ success: true, message: 'Subscribed successfully' });
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        res.status(400).json({ success: false, message: 'Email already subscribed' });
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Unsubscribe from newsletter
router.post('/newsletter/unsubscribe', async (req, res) => {
  try {
    const db = getDb();
    const { email } = req.body;
    
    await db.run('UPDATE newsletter_subscribers SET isActive = 0 WHERE email = ?', [email]);
    
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get newsletter subscribers (admin only)
router.get('/newsletter/subscribers', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const subscribers = await db.all('SELECT * FROM newsletter_subscribers WHERE isActive = 1 ORDER BY subscribedAt DESC');
    
    res.json({ success: true, subscribers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;