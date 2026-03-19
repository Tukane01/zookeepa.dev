const express = require('express');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const pool = require('./db');

const router = express.Router();

// GET /api/promotions - Public endpoint to view all active promotions
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM promotions WHERE is_active = TRUE ORDER BY sort_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Fetch promotions error:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.json([]);
    res.status(500).json({ message: 'Server error fetching promotions' });
  }
});

// GET /api/promotions/:id - Public endpoint to view a single promotion
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM promotions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Promotion not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch promotion error:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.status(404).json({ message: 'Promotion not found' });
    res.status(500).json({ message: 'Server error fetching promotion' });
  }
});

// POST /api/promotions - Admin & Super Admin only
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { title, message, type, is_active, background_color, text_color, cta_text, sort_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO promotions (title, message, type, is_active, background_color, text_color, cta_text, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, message, type, is_active !== false, background_color || '#D4AF37', text_color || '#1a1a1a', cta_text, sort_order || 0]
    );
    res.status(201).json({ message: 'Promotion created', id: result.insertId });
  } catch (error) {
    console.error('Create promotion error:', error.message);
    res.status(500).json({ message: 'Server error creating promotion' });
  }
});

// PUT /api/promotions/:id - Admin & Super Admin only
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { title, message, type, is_active, background_color, text_color, cta_text, sort_order } = req.body;
    await pool.query(
      'UPDATE promotions SET title=?, message=?, type=?, is_active=?, background_color=?, text_color=?, cta_text=?, sort_order=? WHERE id=?',
      [title, message, type, is_active !== false, background_color, text_color, cta_text, sort_order || 0, req.params.id]
    );
    res.json({ message: `Promotion ${req.params.id} updated` });
  } catch (error) {
    console.error('Update promotion error:', error.message);
    res.status(500).json({ message: 'Server error updating promotion' });
  }
});

// DELETE /api/promotions/:id - Super Admin only
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM promotions WHERE id=?', [req.params.id]);
    res.json({ message: `Promotion ${req.params.id} deleted` });
  } catch (error) {
    console.error('Delete promotion error:', error.message);
    res.status(500).json({ message: 'Server error deleting promotion' });
  }
});

module.exports = router;
