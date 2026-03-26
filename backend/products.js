const express = require('express');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const pool = require('./db');

const router = express.Router();

// Helper to build API image URL
const formatImageUrl = (imageId) => imageId ? `/api/images/${imageId}` : null;

// GET /api/products - Publicly accessible
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    const payload = rows.map(p => ({
      ...p,
      image_url: p.image_id ? formatImageUrl(p.image_id) : (p.image_url || null)
    }));
    res.json(payload);
  } catch (error) {
    console.error('Fetch products error:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.json([]);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    const p = rows[0];
    res.json({
      ...p,
      image_url: p.image_id ? formatImageUrl(p.image_id) : (p.image_url || null)
    });
  } catch (error) {
    console.error('Fetch product error:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.status(404).json({ message: 'Product not found' });
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// POST /api/products - Admin & Super Admin only
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { name, description, price, sale_price, category, sizes, colors, image_id, additional_images, stock, is_featured, is_active } = req.body;
    const imageId = image_id || null;

    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, sale_price, category, sizes, colors, image_id, additional_images, stock, is_featured, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, sale_price || null, category, JSON.stringify(sizes || []), JSON.stringify(colors || []), imageId, JSON.stringify(additional_images || []), stock || 0, is_featured || false, is_active !== false]
    );
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// PUT /api/products/:id - Super Admin only
router.put('/:id', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    const { name, description, price, sale_price, category, sizes, colors, image_id, additional_images, stock, is_featured, is_active } = req.body;
    const imageId = image_id || null;

    await pool.query(
      'UPDATE products SET name=?, description=?, price=?, sale_price=?, category=?, sizes=?, colors=?, image_id=?, additional_images=?, stock=?, is_featured=?, is_active=? WHERE id=?',
      [name, description, price, sale_price || null, category, JSON.stringify(sizes || []), JSON.stringify(colors || []), imageId, JSON.stringify(additional_images || []), stock || 0, is_featured || false, is_active !== false, req.params.id]
    );
    res.json({ message: `Product ${req.params.id} updated` });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product', error: error.message });
  }
});

// DELETE /api/products/:id - Super Admin only
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ message: `Product ${req.params.id} deleted` });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product', error: error.message });
  }
});

module.exports = router;