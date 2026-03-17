const express = require('express');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'zookeepa_super_secret_key_2026';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // MOCK: Replace with real database lookup and password hashing verification
  let role = 'user'; 
  let fullName = 'Standard User';

  if (email.includes('admin')) { role = 'admin'; fullName = 'Admin User'; }
  else if (email.includes('super')) { role = 'super_admin'; fullName = 'Super Admin'; }
  else if (email.includes('manager')) { role = 'store_manager'; fullName = 'Store Manager'; }

  // Mock validation failure
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  // Generate Token
  const payload = {
    id: Date.now().toString(),
    email,
    role,
    full_name: fullName
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

  res.json({
    message: 'Login successful',
    token,
    user: payload
  });
});

// GET /api/auth/me (Returns the currently authenticated user)
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: req.user
  });
});

module.exports = router;