const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const rooms = await db.all('SELECT * FROM rooms');
    
    const parsedRooms = rooms.map(room => ({
      ...room,
      products: room.products ? JSON.parse(room.products) : [],
      tags: room.tags ? JSON.parse(room.tags) : []
    }));
    
    res.json({ success: true, rooms: parsedRooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get rooms by type
router.get('/type/:roomType', async (req, res) => {
  try {
    const db = getDb();
    const { roomType } = req.params;
    
    const rooms = await db.all('SELECT * FROM rooms WHERE roomType = ?', roomType);
    
    const parsedRooms = rooms.map(room => ({
      ...room,
      products: room.products ? JSON.parse(room.products) : [],
      tags: room.tags ? JSON.parse(room.tags) : []
    }));
    
    res.json({ success: true, rooms: parsedRooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const room = await db.get('SELECT * FROM rooms WHERE _id = ?', id);
    
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    
    const parsedRoom = {
      ...room,
      products: room.products ? JSON.parse(room.products) : [],
      tags: room.tags ? JSON.parse(room.tags) : []
    };
    
    // Get full product details for featured products
    if (parsedRoom.products.length > 0) {
      const productIds = parsedRoom.products.map(p => `'${p}'`).join(',');
      const products = await db.all(`SELECT * FROM products WHERE _id IN (${productIds})`);
      parsedRoom.featuredProducts = products.map(p => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : []
      }));
    }
    
    res.json({ success: true, room: parsedRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create room (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const {
      name, style, roomType, image, description, features, tips, products, tags
    } = req.body;
    
    const roomId = uuidv4();
    
    await db.run(`
      INSERT INTO rooms (_id, name, style, roomType, image, description, features, tips, products, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      roomId, name, style, roomType, image, description,
      features, tips, JSON.stringify(products || []), JSON.stringify(tags || [])
    ]);
    
    const newRoom = await db.get('SELECT * FROM rooms WHERE _id = ?', roomId);
    
    res.status(201).json({
      success: true,
      room: {
        ...newRoom,
        products: JSON.parse(newRoom.products),
        tags: JSON.parse(newRoom.tags)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update room (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const room = await db.get('SELECT * FROM rooms WHERE _id = ?', id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    
    const updates = req.body;
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== '_id') {
        let processedValue = value;
        if (key === 'products' || key === 'tags') {
          processedValue = JSON.stringify(value);
        }
        fields.push(`${key} = ?`);
        values.push(processedValue);
      }
    }
    
    values.push(id);
    await db.run(`UPDATE rooms SET ${fields.join(', ')} WHERE _id = ?`, values);
    
    const updatedRoom = await db.get('SELECT * FROM rooms WHERE _id = ?', id);
    
    res.json({
      success: true,
      room: {
        ...updatedRoom,
        products: JSON.parse(updatedRoom.products),
        tags: JSON.parse(updatedRoom.tags)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete room (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    const room = await db.get('SELECT * FROM rooms WHERE _id = ?', id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    
    await db.run('DELETE FROM rooms WHERE _id = ?', id);
    
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;