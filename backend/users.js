const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Only accessible by Admins & Super Admins
router.get('/', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  // MOCK: Database fetch
  res.json([
    { id: '1', email: 'user@example.com', role: 'user' },
    { id: '2', email: 'manager@example.com', role: 'store_manager' }
  ]);
});

// PUT /api/users/profile - Accessible by any logged-in user to update their own profile
router.put('/profile', authenticateToken, (req, res) => {
  const updatedData = req.body;
  res.json({
    message: 'Profile updated successfully',
    user: { ...req.user, ...updatedData }
  });
});

module.exports = router;