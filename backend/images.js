const express = require('express');
const router = express.Router();
const pool = require('./db');
const multer = require('multer');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');

// Configure multer for memory storage (store files in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload image endpoint
router.post('/upload', authenticateToken, authorizeRoles('admin', 'super_admin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { buffer, originalname, mimetype } = req.file;
    const altText = req.body.altText || '';

    // Insert image into database
    const [result] = await pool.query(
      'INSERT INTO images (image_data, filename, content_type, alt_text) VALUES (?, ?, ?, ?)',
      [buffer, originalname, mimetype, altText]
    );

    res.json({
      id: result.insertId,
      filename: originalname,
      contentType: mimetype,
      altText: altText
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get image by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT image_data, filename, content_type, alt_text FROM images WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image = rows[0];

    // Set appropriate headers
    res.setHeader('Content-Type', image.content_type);
    res.setHeader('Content-Disposition', `inline; filename="${image.filename}"`);

    // Send the image data
    res.send(image.image_data);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

// Delete image endpoint
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if image exists
    const [rows] = await pool.query('SELECT id FROM images WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete the image
    await pool.query('DELETE FROM images WHERE id = ?', [id]);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Get all images (for admin management)
router.get('/', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, filename, content_type, alt_text, created_at FROM images ORDER BY created_at DESC'
    );

    res.json(rows);
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});

module.exports = router;