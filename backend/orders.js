const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - Any authenticated user can place an order
router.post('/', authenticateToken, authorizeRoles('user', 'admin', 'super_admin', 'store_manager'), (req, res) => {
  const orderData = req.body;
  res.status(201).json({ message: 'Order created', orderId: `ZK-${Date.now()}` });
});

// GET /api/orders/my-orders - User views their own history
router.get('/my-orders', authenticateToken, (req, res) => {
  res.json([]); // MOCK: Return orders where userId === req.user.id
});

// GET /api/orders - Store Managers, Admins, Super Admins can view ALL orders
router.get('/', authenticateToken, authorizeRoles('store_manager', 'admin', 'super_admin'), (req, res) => {
  res.json([]); // MOCK: Return all system orders
});

// PUT /api/orders/:id/status - Store Managers and above can update order fulfillment states
router.put('/:id/status', authenticateToken, authorizeRoles('store_manager', 'admin', 'super_admin'), (req, res) => {
  const { status } = req.body;
  res.json({
    message: `Order ${req.params.id} updated to ${status}`,
    status
  });
});

module.exports = router;