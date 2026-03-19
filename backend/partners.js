const express = require('express');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const pool = require('./db');

const router = express.Router();

// GET /api/partners - Public endpoint to view all partners
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM partners ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Fetch partners error:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.json([]);
    res.status(500).json({ message: 'Server error fetching partners' });
  }
});

// GET /api/partners/:id - Public endpoint to view a single partner
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM partners WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Partner not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch partner error:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.status(404).json({ message: 'Partner not found' });
    res.status(500).json({ message: 'Server error fetching partner' });
  }
});

// POST /api/partners - Admin & Super Admin only
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { name, logo_url, website_url, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO partners (name, logo_url, website_url, description) VALUES (?, ?, ?, ?)',
      [name, logo_url, website_url, description]
    );
    res.status(201).json({ message: 'Partner created', id: result.insertId });
  } catch (error) {
    console.error('Create partner error:', error.message);
    res.status(500).json({ message: 'Server error creating partner' });
  }
});

// PUT /api/partners/:id - Admin & Super Admin only
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { name, logo_url, website_url, description } = req.body;
    await pool.query(
      'UPDATE partners SET name=?, logo_url=?, website_url=?, description=? WHERE id=?',
      [name, logo_url, website_url, description, req.params.id]
    );
    res.json({ message: `Partner ${req.params.id} updated` });
  } catch (error) {
    console.error('Update partner error:', error.message);
    res.status(500).json({ message: 'Server error updating partner' });
  }
});

// DELETE /api/partners/:id - Super Admin only
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM partners WHERE id=?', [req.params.id]);
    res.json({ message: `Partner ${req.params.id} deleted` });
  } catch (error) {
    console.error('Delete partner error:', error.message);
    res.status(500).json({ message: 'Server error deleting partner' });
  }
});

module.exports = router;
