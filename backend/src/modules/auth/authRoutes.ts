import { Router } from 'express';
import { authController } from './authController';
import { authenticate } from '../../middleware/auth';

const router = Router();

/** POST /api/v1/auth/register */
router.post('/register', authController.register.bind(authController));

/** POST /api/v1/auth/login */
router.post('/login', authController.login.bind(authController));

/** GET /api/v1/auth/me  — requires token */
router.get('/me', authenticate, authController.me.bind(authController));

export const authRoutes = router;
