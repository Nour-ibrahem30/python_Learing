import { Router } from 'express';
import { 
  getDashboardStats,
  getUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
  getAnalytics,
} from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

// User management
router.get('/users', getUsers);
router.get('/users/:userId', getUserDetails);
router.patch('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

export default router;
