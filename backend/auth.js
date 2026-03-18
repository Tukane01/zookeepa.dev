const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'zookeepa_super_secret_key_2026';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  let role = 'user';
  if (email?.includes('admin')) role = 'admin';
  if (email?.includes('super')) role = 'super_admin';
  if (email?.includes('manager')) role = 'store_manager';

  const user = { id: Date.now(), email, full_name: email?.split('@')[0] || 'User', role };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

module.exports = router;