const express = require('express');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const pool = require('./db');

const router = express.Router();

// GET /api/site-settings - Public endpoint to view site settings
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_settings LIMIT 1');
    if (rows.length === 0) return res.json({});
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch site settings error:', error.message);
    // Gracefully return empty object on any database error to prevent frontend crashes
    res.json({});
  }
});

// GET /api/site-settings/:id - Public endpoint to view a specific setting
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_settings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Site setting not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Fetch site setting error:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.status(404).json({ message: 'Site setting not found' });
    res.status(500).json({ message: 'Server error fetching site setting' });
  }
});

// POST /api/site-settings - Admin & Super Admin only
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const {
      hero_image_id, hero_images, hero_title, hero_subtitle, hero_cta_text,
      contact_address, contact_city, contact_province, contact_zip, contact_country,
      contact_phone, contact_email, contact_hours, map_lat, map_lng
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO site_settings (hero_image_id, hero_images, hero_title, hero_subtitle, hero_cta_text,
       contact_address, contact_city, contact_province, contact_zip, contact_country,
       contact_phone, contact_email, contact_hours, map_lat, map_lng)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [hero_image_id, JSON.stringify(hero_images || []), hero_title, hero_subtitle, hero_cta_text,
       contact_address, contact_city, contact_province, contact_zip, contact_country || 'South Africa',
       contact_phone, contact_email, contact_hours, map_lat || -26.2041, map_lng || 28.0473]
    );
    res.status(201).json({ message: 'Site settings created', id: result.insertId });
  } catch (error) {
    console.error('Create site settings error:', error.message);
    res.status(500).json({ message: 'Server error creating site settings' });
  }
});

// PUT /api/site-settings/:id - Admin & Super Admin only
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const {
      hero_image_id, hero_images, hero_title, hero_subtitle, hero_cta_text,
      contact_address, contact_city, contact_province, contact_zip, contact_country,
      contact_phone, contact_email, contact_hours, map_lat, map_lng
    } = req.body;

    await pool.query(
      `UPDATE site_settings SET hero_image_id=?, hero_images=?, hero_title=?, hero_subtitle=?, hero_cta_text=?,
       contact_address=?, contact_city=?, contact_province=?, contact_zip=?, contact_country=?,
       contact_phone=?, contact_email=?, contact_hours=?, map_lat=?, map_lng=? WHERE id=?`,
      [hero_image_id, JSON.stringify(hero_images || []), hero_title, hero_subtitle, hero_cta_text,
       contact_address, contact_city, contact_province, contact_zip, contact_country,
       contact_phone, contact_email, contact_hours, map_lat, map_lng, req.params.id]
    );
    res.json({ message: `Site settings ${req.params.id} updated` });
  } catch (error) {
    console.error('Update site settings error:', error.message);
    res.status(500).json({ message: 'Server error updating site settings' });
  }
});

module.exports = router;
