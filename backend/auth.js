const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'zookeepa_super_secret_key_2026';
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'admin.zookeepa@gmail.com';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'Zookeepa@2009';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Super admin via environment credentials
  if (email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
    const superAdminUser = {
      id: 'superadmin',
      email: SUPERADMIN_EMAIL,
      full_name: 'Super Admin',
      role: 'super_admin',
    };
    const token = jwt.sign(superAdminUser, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: superAdminUser });
  }

  try {
    const [rows] = await pool.query('SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    if (!user.is_active) return res.status(403).json({ message: 'Account is suspended or inactive' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name || user.email.split('@')[0],
      role: user.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: payload });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, full_name } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ message: 'Full name, email and password are required' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?)',
      [email, passwordHash, full_name, 'user', true]
    );

    const newUser = { id: result.insertId, email, full_name, role: 'user' };
    const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Register error', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;