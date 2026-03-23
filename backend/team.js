const express = require('express');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const pool = require('./db');

const router = express.Router();

// GET /api/team - Publicly accessible
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, i.filename, i.content_type, i.alt_text
      FROM team_members t
      LEFT JOIN images i ON t.image_id = i.id
      ORDER BY t.sort_order ASC, t.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Fetch team error:', error.message);
    // Gracefully return empty array on any database error to prevent frontend crashes
    res.json([]);
  }
});

// GET /api/team/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM team_members WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Team member not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch team member error:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.status(404).json({ message: 'Team member not found' });
    res.status(500).json({ message: 'Server error fetching team member' });
  }
});

// POST /api/team - Admin & Super Admin only
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { name, role, bio, image_id, sort_order } = req.body;
    const [result] = await pool.query(
      'INSERT INTO team_members (name, role, bio, image_id, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, role, bio || '', image_id, sort_order || 0]
    );
    res.status(201).json({ message: 'Team member created', id: result.insertId });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ error: error.message, message: 'Server error creating team member' });
  }
});

// PUT /api/team/:id - Admin & Super Admin only
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { name, role, bio, image_id, sort_order } = req.body;
    await pool.query(
      'UPDATE team_members SET name = ?, role = ?, bio = ?, image_id = ?, sort_order = ? WHERE id = ?',
      [name, role, bio || '', image_id, sort_order || 0, req.params.id]
    );
    res.json({ message: 'Team member updated' });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: error.message, message: 'Server error updating team member' });
  }
});

// DELETE /api/team/:id - Admin & Super Admin only
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM team_members WHERE id = ?', [req.params.id]);
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message, message: 'Server error deleting team member' });
  }
});

module.exports = router;