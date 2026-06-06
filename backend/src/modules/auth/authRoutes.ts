import { Router } from 'express';
import { authController } from './authController';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Debug logging
console.log('🔧 Setting up auth routes...');

/** POST /api/v1/auth/register */
router.post('/register', authController.register.bind(authController));
console.log('  - POST /register');

/** POST /api/v1/auth/login */
router.post('/login', authController.login.bind(authController));
console.log('  - POST /login');

/** GET /api/v1/auth/me  — requires token */
router.get('/me', authenticate, authController.me.bind(authController));
console.log('  - GET /me');

console.log('✅ Auth routes configured');

export const authRoutes = router;
