const express = require('express');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const pool = require('./db');

const router = express.Router();

// GET /api/careers - Publicly accessible
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM careers ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Fetch careers error:', error.message);
    // Gracefully return empty array on any database error to prevent frontend crashes
    res.json([]);
  }
});

// GET /api/careers/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM careers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Career not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch career error:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.status(404).json({ message: 'Career not found' });
    res.status(500).json({ message: 'Server error fetching career' });
  }
});

// POST /api/careers - Admin & Super Admin only
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { title, department, description, location, type, is_open } = req.body;
    const [result] = await pool.query(
      'INSERT INTO careers (title, department, description, location, type, is_open) VALUES (?, ?, ?, ?, ?, ?)',
      [title, department, description, location, type, is_open !== false]
    );
    res.status(201).json({ message: 'Career created', id: result.insertId });
  } catch (error) {
    console.error('Create career error:', error.message);
    res.status(500).json({ message: 'Server error creating career' });
  }
});

// PUT /api/careers/:id - Admin & Super Admin only
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { title, department, description, location, type, is_open } = req.body;
    await pool.query(
      'UPDATE careers SET title = ?, department = ?, description = ?, location = ?, type = ?, is_open = ? WHERE id = ?',
      [title, department, description, location, type, is_open !== false, req.params.id]
    );
    res.json({ message: 'Career updated' });
  } catch (error) {
    console.error('Update career error:', error.message);
    res.status(500).json({ message: 'Server error updating career' });
  }
});

// DELETE /api/careers/:id - Admin & Super Admin only
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM careers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Career deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting career' });
  }
});

module.exports = router;