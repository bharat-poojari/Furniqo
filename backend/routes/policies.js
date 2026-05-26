// routes/policies.js
const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET /api/v1/policies - Get all policies as an object
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const policies = await db.all('SELECT * FROM policies');
    
    const formattedPolicies = {};
    for (const policy of policies) {
      formattedPolicies[policy.type] = JSON.parse(policy.content);
    }
    
    res.json({ success: true, policies: formattedPolicies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/v1/policies/:type - Get one policy by type
router.get('/:type', async (req, res) => {
  try {
    const db = getDb();
    const { type } = req.params;
    
    const validTypes = ['privacy', 'terms', 'shipping', 'returns'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid policy type' });
    }
    
    const policy = await db.get('SELECT * FROM policies WHERE type = ?', type);
    
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }
    
    res.json({
      success: true,
      policy: JSON.parse(policy.content)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/v1/policies/:type - Update a policy (admin)
// Changed from /admin/policies/:type to /:type
router.put('/:type', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { type } = req.params;
    const { title, lastUpdated, sections } = req.body;
    
    const validTypes = ['privacy', 'terms', 'shipping', 'returns'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid policy type' });
    }
    
    if (!title || !lastUpdated || !sections) {
      return res.status(400).json({ success: false, message: 'Title, lastUpdated, and sections are required' });
    }
    
    if (!Array.isArray(sections)) {
      return res.status(400).json({ success: false, message: 'Sections must be an array' });
    }
    
    const content = JSON.stringify({ title, lastUpdated, sections });
    
    const existingPolicy = await db.get('SELECT * FROM policies WHERE type = ?', type);
    
    if (existingPolicy) {
      await db.run(`
        UPDATE policies 
        SET title = ?, last_updated = ?, content = ?, updated_at = ?
        WHERE type = ?
      `, [title, lastUpdated, content, new Date().toISOString(), type]);
      
      const updatedPolicy = await db.get('SELECT * FROM policies WHERE type = ?', type);
      
      res.json({
        success: true,
        message: 'Policy updated successfully',
        policy: JSON.parse(updatedPolicy.content)
      });
    } else {
      await db.run(`
        INSERT INTO policies (type, title, last_updated, content, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `, [type, title, lastUpdated, content, new Date().toISOString()]);
      
      const newPolicy = await db.get('SELECT * FROM policies WHERE type = ?', type);
      
      res.status(201).json({
        success: true,
        message: 'Policy created successfully',
        policy: JSON.parse(newPolicy.content)
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/v1/policies/:type - Delete a policy (admin)
router.delete('/:type', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { type } = req.params;
    
    const validTypes = ['privacy', 'terms', 'shipping', 'returns'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid policy type' });
    }
    
    const policy = await db.get('SELECT * FROM policies WHERE type = ?', type);
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }
    
    await db.run('DELETE FROM policies WHERE type = ?', type);
    
    res.json({ success: true, message: 'Policy deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;