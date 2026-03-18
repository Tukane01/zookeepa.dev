const express = require('express');
const { authenticateToken } = require('./middleware/auth');
const pool = require('./db');

const router = express.Router();

// GET /api/orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.json([]);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// GET /api/orders/my
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC', [req.user.email]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching my orders:', error.message);
    if (error?.code === 'ER_NO_SUCH_TABLE') return res.json([]);
    res.status(500).json({ message: 'Server error fetching your orders' });
  }
});

// POST /api/orders
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { order_number, customer_email, customer_name, items, total_amount, shipping_address, phone } = req.body;
    await pool.query(
      'INSERT INTO orders (order_number, customer_email, customer_name, items, total_amount, shipping_address, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [order_number, customer_email, customer_name, JSON.stringify(items), total_amount, JSON.stringify(shipping_address), phone]
    );
    res.status(201).json({ message: 'Order created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating order', error: error.message });
  }
});

// PUT /api/orders/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order' });
  }
});

module.exports = router;