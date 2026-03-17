const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - Publicly accessible
router.get('/', (req, res) => {
  res.json([]); // MOCK: Return products
});

// POST /api/products - Admin & Super Admin only
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  res.status(201).json({ message: 'Product created', product: req.body });
});

// PUT /api/products/:id - Admin & Super Admin only
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  res.json({ message: `Product ${req.params.id} updated` });
});

// DELETE /api/products/:id - Super Admin only (example of tighter restriction)
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), (req, res) => {
  res.json({ message: `Product ${req.params.id} deleted` });
});

module.exports = router;