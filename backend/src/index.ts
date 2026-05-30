/**
 * LifeLine AI — Backend Entry Point
 * Express app setup, middleware wiring, route mounting, server start
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

// Config
import { ENV } from './config/env';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';

// Middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Module Routes
import { emergencySosRoutes } from './modules/emergency-sos/emergencySosRoutes';
import { patientProfileRoutes } from './modules/patient-profile/patientProfileRoutes';
import { appointmentRoutes } from './modules/appointments/appointmentRoutes';
import { authRoutes } from './modules/auth/authRoutes';

// ─────────────────────────────────────────────────────────────────────────────
// App Setup
// ─────────────────────────────────────────────────────────────────────────────

const app = express();
const httpServer = createServer(app);

// ── Security ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: [ENV.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Global Rate Limiting ──────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please try again later.',
      statusCode: 429,
    },
  },
});

const criticalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests on this critical endpoint.',
      statusCode: 429,
    },
  },
});

app.use('/api', globalLimiter);

// ── Health Check ──────────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: ENV.NODE_ENV,
    },
  });
});

// ── Module Routes ─────────────────────────────────────────────────
const API_BASE = '/api/v1';

// Auth (public — no authenticate middleware)
app.use(`${API_BASE}/auth`, authRoutes);

// Critical endpoint: extra rate limiting
app.use(`${API_BASE}/emergency/sos/trigger`, criticalLimiter);

app.use(`${API_BASE}/emergency`, emergencySosRoutes);
app.use(`${API_BASE}/patient`, patientProfileRoutes);
app.use(`${API_BASE}/appointments`, appointmentRoutes);

// ── Dashboard Stats (public for dev) ──────────────────────────────
import mongoose from 'mongoose';
app.get(`${API_BASE}/dashboard/stats`, async (_req, res) => {
  try {
    const db = mongoose.connection.db;
    if (!db) return res.json({ success: true, data: { emergencies: 0, patients: 0, ambulances: 0, hospitals: 98, livesSaved: 12540 } });
    const [emergencies, patients] = await Promise.all([
      db.collection('emergencysoses').countDocuments(),
      db.collection('users').countDocuments({ role: 'PATIENT' }),
    ]);
    res.json({ success: true, data: { emergencies, patients, ambulances: 32, hospitals: 98, livesSaved: 12540 + patients } });
  } catch { res.json({ success: true, data: { emergencies: 0, patients: 0, ambulances: 32, hospitals: 98, livesSaved: 12540 } }); }
});

app.get(`${API_BASE}/dashboard/alerts`, async (_req, res) => {
  try {
    const db = mongoose.connection.db;
    if (!db) return res.json({ success: true, data: [] });
    const alerts = await db.collection('emergencysoses').find({}).sort({ createdAt: -1 }).limit(5).toArray();
    res.json({ success: true, data: alerts });
  } catch { res.json({ success: true, data: [] }); }
});

// TODO: Add as modules are built:
// app.use(`${API_BASE}/auth`, authRoutes);
// app.use(`${API_BASE}/ambulance`, ambulanceRoutes);
// app.use(`${API_BASE}/hospital`, hospitalRoutes);
// app.use(`${API_BASE}/doctor`, doctorRoutes);
// app.use(`${API_BASE}/ai`, aiRoutes);
// app.use(`${API_BASE}/route`, routeRoutes);
// app.use(`${API_BASE}/notification`, notificationRoutes);
// app.use(`${API_BASE}/complaint`, complaintRoutes);
// app.use(`${API_BASE}/admin`, adminRoutes);
// app.use(`${API_BASE}/government`, governmentRoutes);

// ── Error Handling ────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// Server Bootstrap
// ─────────────────────────────────────────────────────────────────────────────

const bootstrap = async () => {
  try {
    // Connect to databases (skip if SKIP_DB=true in .env)
    if (process.env.SKIP_DB === 'true') {
      console.log('⚠️  SKIP_DB=true — skipping MongoDB & Redis connections');
    } else {
      await connectDatabase();
      await connectRedis();
    }

    // Start HTTP server
    httpServer.listen(ENV.PORT, () => {
      console.log(`\n🚀 LifeLine AI Backend`);
      console.log(`   Environment : ${ENV.NODE_ENV}`);
      console.log(`   HTTP        : http://localhost:${ENV.PORT}`);
      console.log(`   API Base    : http://localhost:${ENV.PORT}${API_BASE}`);
      console.log(`   Health      : http://localhost:${ENV.PORT}${API_BASE}/health\n`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
      httpServer.close(async () => {
        const { disconnectDatabase } = await import('./config/database');
        const { disconnectRedis } = await import('./config/redis');
        await disconnectDatabase();
        await disconnectRedis();
        console.log('✅ Server shut down cleanly');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();

export { app, httpServer };
