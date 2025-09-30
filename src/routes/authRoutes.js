import { Router } from 'express';
import authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import {
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
} from '../middlewares/validation.js';

const router = Router();

// Public routes
router.post(
    '/register',
    authLimiter,
    validateUserRegistration,
    authController.register,
);
router.post('/login', authLimiter, validateUserLogin, authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put(
    '/profile',
    authenticate,
    validateUserUpdate,
    authController.updateProfile,
);
router.post('/logout', authenticate, authController.logout);

export default router;
