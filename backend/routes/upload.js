const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../config/upload');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { getDb } = require('../config/database');

const buildImageUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/${filename}`;

const saveUploadRecord = async (req, file) => {
  const db = getDb();
  const imageUrl = buildImageUrl(req, file.filename);
  await db.run(
    `INSERT INTO uploads (filename, path, url, mimetype, size, uploadedBy, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [file.filename, `/uploads/${file.filename}`, imageUrl, file.mimetype, file.size, req.user?.id || null, new Date().toISOString()]
  );
  return imageUrl;
};

// Upload single image
router.post('/image', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const imageUrl = await saveUploadRecord(req, req.file);

    res.json({
      success: true,
      url: imageUrl,
      imageUrl,
      filename: req.file.filename,
      data: {
        url: imageUrl,
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Upload multiple images
router.post('/images', verifyToken, isAdmin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploads = await Promise.all(
      req.files.map(async (file) => {
        const url = await saveUploadRecord(req, file);
        return {
          url,
          filename: file.filename,
          path: `/uploads/${file.filename}`
        };
      })
    );

    const urls = uploads.map(item => item.url);

    res.json({
      success: true,
      urls,
      images: uploads,
      data: {
        urls,
        images: uploads
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

router.get('/images', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = getDb();
    const search = req.query.search ? `%${req.query.search}%` : '%';
    const rows = await db.all(
      `SELECT id, filename, path, url, mimetype, size, uploadedBy, createdAt
       FROM uploads
       WHERE filename LIKE ? OR url LIKE ?
       ORDER BY createdAt DESC`,
      [search, search]
    );

    const images = rows.map((row) => row.url);
    return res.json({ success: true, images, uploads: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch uploaded images' });
  }
});

// Delete image (admin only)
router.delete('/image/:filename', verifyToken, isAdmin, async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../uploads', filename);
    const db = getDb();

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      await db.run('DELETE FROM uploads WHERE filename = ?', [filename]);
      return res.json({ success: true, message: 'Image deleted successfully' });
    }

    const deleted = await db.run('DELETE FROM uploads WHERE filename = ?', [filename]);
    if (deleted.changes > 0) {
      return res.json({ success: true, message: 'Image record deleted successfully' });
    }

    return res.status(404).json({ success: false, message: 'Image not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

module.exports = router;