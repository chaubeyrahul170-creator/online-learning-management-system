import express from 'express';
import {
  getAllUsers,
  getPendingUsers,
  approveUser,
  suspendUser,
  reinstateUser,
  deleteUser,
  getPlatformStats,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Saare routes Admin Protected hain (Sirf Admin access kar sakta hai)
router.use(protect);
router.use(adminOnly);

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.get('/pending-users', getPendingUsers);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/reinstate', reinstateUser);
router.delete('/users/:id', deleteUser);

export default router;
