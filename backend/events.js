const express = require('express');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const pool = require('./db');

const router = express.Router();

// GET /api/events - Publicly accessible
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, i.filename, i.content_type, i.alt_text
      FROM events e
      LEFT JOIN images i ON e.image_id = i.id
      ORDER BY e.date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Fetch events error:', error.message);
    // Gracefully return empty array on any database error to prevent frontend crashes
    res.json([]);
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Event not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch event error:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.status(404).json({ message: 'Event not found' });
    res.status(500).json({ message: 'Server error fetching event' });
  }
});

// POST /api/events - Admin & Super Admin only
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { title, description, date, location, image_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO events (title, description, date, location, image_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, date, location, image_id]
    );
    res.status(201).json({ message: 'Event created', id: result.insertId });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: error.message, message: 'Server error creating event' });
  }
});

// PUT /api/events/:id - Admin & Super Admin only
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { title, description, date, location, image_id } = req.body;
    await pool.query(
      'UPDATE events SET title = ?, description = ?, date = ?, location = ?, image_id = ? WHERE id = ?',
      [title, description, date, location, image_id, req.params.id]
    );
    res.json({ message: 'Event updated' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: error.message, message: 'Server error updating event' });
  }
});

// DELETE /api/events/:id - Admin & Super Admin only
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message, message: 'Server error deleting event' });
  }
});

module.exports = router;