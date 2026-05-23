const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all blog posts - NO LIMIT, send all data at once
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { category, featured } = req.query;
    
    let query = 'SELECT * FROM blog_posts WHERE 1=1';
    const params = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (featured === 'true') {
      query += ' AND featured = 1';
    }
    
    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await db.get(countQuery, params);
    const total = countResult.total;
    
    // Order by date descending - NO LIMIT, get all posts
    query += ' ORDER BY date DESC';
    
    const posts = await db.all(query, params);
    
    const parsedPosts = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      featured: post.featured === 1
    }));
    
    res.json({
      success: true,
      posts: parsedPosts,
      pagination: {
        total,
        totalPosts: parsedPosts.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get featured blog posts - NO LIMIT
router.get('/featured', async (req, res) => {
  try {
    const db = getDb();
    // Get ALL featured posts, no limit
    const posts = await db.all('SELECT * FROM blog_posts WHERE featured = 1 ORDER BY date DESC');
    
    const parsedPosts = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : []
    }));
    
    res.json({ success: true, posts: parsedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single blog post by slug or ID
router.get('/:identifier', async (req, res) => {
  try {
    const db = getDb();
    const { identifier } = req.params;
    
    const post = await db.get(
      'SELECT * FROM blog_posts WHERE slug = ? OR _id = ?',
      [identifier, identifier]
    );
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    const parsedPost = {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      featured: post.featured === 1
    };
    
    res.json({ success: true, post: parsedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create blog post (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const {
      title, slug, excerpt, content, image, author, authorRole,
      authorImage, category, readTime, tags, featured
    } = req.body;
    
    const postId = uuidv4();
    
    await db.run(`
      INSERT INTO blog_posts (
        _id, title, slug, excerpt, content, image, author, authorRole,
        authorImage, category, date, readTime, tags, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      postId, title, slug, excerpt, content, image, author, authorRole,
      authorImage, category, new Date().toISOString().split('T')[0],
      readTime, JSON.stringify(tags || []), featured ? 1 : 0
    ]);
    
    const newPost = await db.get('SELECT * FROM blog_posts WHERE _id = ?', postId);
    
    res.status(201).json({
      success: true,
      post: { ...newPost, tags: JSON.parse(newPost.tags) }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update blog post (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const post = await db.get('SELECT * FROM blog_posts WHERE _id = ?', id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    const updates = req.body;
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== '_id') {
        let processedValue = value;
        if (key === 'tags') {
          processedValue = JSON.stringify(value);
        }
        if (key === 'featured') {
          processedValue = value ? 1 : 0;
        }
        fields.push(`${key} = ?`);
        values.push(processedValue);
      }
    }
    
    values.push(id);
    await db.run(`UPDATE blog_posts SET ${fields.join(', ')} WHERE _id = ?`, values);
    
    const updatedPost = await db.get('SELECT * FROM blog_posts WHERE _id = ?', id);
    
    res.json({
      success: true,
      post: { ...updatedPost, tags: JSON.parse(updatedPost.tags) }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete blog post (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const post = await db.get('SELECT * FROM blog_posts WHERE _id = ?', id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    await db.run('DELETE FROM blog_posts WHERE _id = ?', id);
    
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;