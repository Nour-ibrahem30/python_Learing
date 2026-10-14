import { Router } from 'express';
import { body } from 'express-validator';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  updateProfile,
  changePassword 
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Validation rules
const registerValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('لازم تكتب كود')
    .isLength({ min: 3 })
    .withMessage('الكود لازم يكون 3 حروف على الأقل'),
  body('pin')
    .notEmpty()
    .withMessage('لازم تكتب الرمز')
    .isLength({ min: 4 })
    .withMessage('الرمز لازم يكون 4 أرقام على الأقل'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('لازم تكتب اسمك')
    .isLength({ min: 2 })
    .withMessage('الاسم لازم يكون حرفين على الأقل'),
];

const loginValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('لازم تكتب الكود'),
  body('pin')
    .notEmpty()
    .withMessage('لازم تكتب الرمز'),
];

const changePinValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('لازم تكتب الرمز الحالي'),
  body('newPassword')
    .isLength({ min: 4 })
    .withMessage('الرمز الجديد لازم يكون 4 أرقام على الأقل'),
];

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.patch('/password', protect, changePinValidation, validate, changePassword);

export default router;
