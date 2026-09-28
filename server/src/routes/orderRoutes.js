import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// ADMIN ROUTES (must come BEFORE :id routes)
// ==========================================
router.get('/admin/all', auth, adminAuth, getAllOrders);

// ==========================================
// USER ROUTES
// ==========================================
router.post('/', auth, createOrder);
router.get('/', auth, getUserOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/cancel', auth, cancelOrder);

// ==========================================
// ADMIN - Update status
// ==========================================
router.put('/:id/status', auth, adminAuth, updateOrderStatus);

export default router;