const express = require('express');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const pool = require('./db');

const router = express.Router();

// GET /api/gallery - Publicly accessible
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.*, i.filename, i.content_type, i.alt_text
      FROM gallery_items g
      LEFT JOIN images i ON g.image_id = i.id
      ORDER BY g.sort_order ASC, g.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Fetch gallery error:', error.message);
    // Gracefully return empty array on any database error to prevent frontend crashes
    res.json([]);
  }
});

// GET /api/gallery/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery_items WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Gallery item not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch gallery item error:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.status(404).json({ message: 'Gallery item not found' });
    res.status(500).json({ message: 'Server error fetching gallery item' });
  }
});

// POST /api/gallery - Admin & Super Admin only
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { image_id, caption, category, sort_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO gallery_items (image_id, caption, category, sort_order) VALUES (?, ?, ?, ?)',
      [image_id, caption || '', category || '', sort_order || 0]
    );
    res.status(201).json({ message: 'Gallery item created', id: result.insertId });
  } catch (error) {
    console.error('Create gallery item error:', error);
    res.status(500).json({ error: error.message, message: 'Server error creating gallery item' });
  }
});

// PUT /api/gallery/:id - Admin & Super Admin only
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { image_id, caption, category, sort_order } = req.body;
    await pool.query(
      'UPDATE gallery_items SET image_id = ?, caption = ?, category = ?, sort_order = ? WHERE id = ?',
      [image_id, caption || '', category || '', sort_order || 0, req.params.id]
    );
    res.json({ message: 'Gallery item updated' });
  } catch (error) {
    console.error('Update gallery item error:', error);
    res.status(500).json({ error: error.message, message: 'Server error updating gallery item' });
  }
});

// DELETE /api/gallery/:id - Admin & Super Admin only
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM gallery_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message, message: 'Server error deleting gallery item' });
  }
});

module.exports = router;