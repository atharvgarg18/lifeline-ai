import { Router } from 'express';
import {
  connectGoogleHealth,
  googleCallback,
  getTodaySteps,
  getDashboardMetrics,
} from './health.controller';

const router = Router();

router.get('/connect', connectGoogleHealth);

router.get('/callback', googleCallback);

router.get('/steps', getTodaySteps);

router.get('/dashboard', getDashboardMetrics);

export default router;