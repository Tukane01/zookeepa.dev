const express = require('express');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const router = express.Router();

// GET /api/users - Admins / Super Admins
router.get('/', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, full_name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Users list error', error);
    res.status(500).json({ message: 'Server error retrieving users' });
  }
});

// GET /api/users/profile - Public for logged-in user
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { id, email, role, full_name, is_active } = req.user;
    res.json({ user: { id, email, role, full_name, is_active } });
  } catch (error) {
    console.error('Profile fetch error', error);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

// PUT /api/users/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone, shipping_address } = req.body;
    const fields = [];
    const values = [];

    if (full_name) { fields.push('full_name = ?'); values.push(full_name); }
    if (phone) { fields.push('phone = ?'); values.push(phone); }
    if (shipping_address) { fields.push('shipping_address = ?'); values.push(JSON.stringify(shipping_address)); }

    if (!fields.length) {
      return res.status(400).json({ message: 'No profile fields provided' });
    }

    values.push(userId);
    await pool.query(`UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);

    const [updatedRows] = await pool.query('SELECT id, email, full_name, role, is_active FROM users WHERE id = ?', [userId]);
    res.json({ message: 'Profile updated successfully', user: updatedRows[0] });
  } catch (error) {
    console.error('Profile update error', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// DELETE /api/users/profile (self delete)
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error('Delete account error', error);
    res.status(500).json({ message: 'Server error deleting account' });
  }
});

// POST /api/users - Create account (Admin / Super Admin only)
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const { email, password, full_name, role = 'user' } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ message: 'email, password and full_name are required' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email already exists' });

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?)', [email, password_hash, full_name, role, true]);

    res.status(201).json({ id: result.insertId, email, full_name, role });
  } catch (error) {
    console.error('Create user error', error);
    res.status(500).json({ message: 'Server error creating user' });
  }
});

// PUT /api/users/:id - update role + activation (Admin/Super Admin)
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const targetId = req.params.id;
    const { role, is_active } = req.body;

    const fields = [];
    const values = [];
    if (role) { fields.push('role = ?'); values.push(role); }
    if (typeof is_active === 'boolean') { fields.push('is_active = ?'); values.push(is_active); }

    if (!fields.length) return res.status(400).json({ message: 'No update fields specified' });

    values.push(targetId);
    await pool.query(`UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// DELETE /api/users/:id - remove another user (Admin/Super Admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), async (req, res) => {
  try {
    const targetId = req.params.id;
    await pool.query('DELETE FROM users WHERE id = ?', [targetId]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router;