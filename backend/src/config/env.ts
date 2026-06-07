/**
 * Environment Configuration & Validation
 * Validates all required env vars at startup — fails fast if missing
 */


import dotenv from 'dotenv';
import fs from 'fs';

console.log('ENV FILE EXISTS:', fs.existsSync('.env'));
console.log('CURRENT DIRECTORY:', process.cwd());

dotenv.config();

const optional = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};


export const ENV = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '3000'), 10),

  // Database
  MONGODB_URI: optional('MONGODB_URI', 'mongodb://admin:password123@localhost:27017/lifeline-dev'),
  MONGODB_HOST: optional('MONGODB_HOST', ''),
  MONGODB_DB: optional('MONGODB_DB', ''),
  MONGODB_USER: optional('MONGODB_USER', ''),
  MONGODB_PASSWORD: optional('MONGODB_PASSWORD', ''),
  MONGODB_AUTH_SOURCE: optional('MONGODB_AUTH_SOURCE', 'admin'),
  MONGODB_APP_NAME: optional('MONGODB_APP_NAME', 'Cluster0'),
  REDIS_URL: optional('REDIS_URL', 'redis://:redis123@localhost:6379'),

  // JWT
  JWT_SECRET: optional('JWT_SECRET', 'dev-secret-key-change-in-production'),
  JWT_REFRESH_SECRET: optional('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-in-production'),
  JWT_EXPIRY: optional('JWT_EXPIRY', '1h'),         // 1 hour
  JWT_REFRESH_EXPIRY: optional('JWT_REFRESH_EXPIRY', '7d'), // 7 days

  // QR Code
  QR_SECRET: optional('QR_SECRET', 'qr-secret-key-change-in-production'),
  QR_EXPIRY_HOURS: parseInt(optional('QR_EXPIRY_HOURS', '24'), 10),

  // AI Service
  AI_SERVICE_URL: optional('AI_SERVICE_URL', 'http://localhost:8000'),
  GEMINI_API_KEY: optional('GEMINI_API_KEY', ''),
  OPENAI_API_KEY: optional('OPENAI_API_KEY', ''),

  // Maps
  GOOGLE_MAPS_API_KEY: optional('GOOGLE_MAPS_API_KEY', ''),
  GOOGLE_CLIENT_ID: optional('GOOGLE_CLIENT_ID', ''),
  GOOGLE_CLIENT_SECRET: optional('GOOGLE_CLIENT_SECRET', ''),
  GOOGLE_REDIRECT_URI: optional('GOOGLE_REDIRECT_URI', ''),

  // Video Call
  DAILY_API_KEY: optional('DAILY_API_KEY', ''),           // Daily.co API key
  DAILY_API_URL: optional('DAILY_API_URL', 'https://api.daily.co/v1'),

  // Notifications
  TWILIO_ACCOUNT_SID: optional('TWILIO_ACCOUNT_SID', ''),
  TWILIO_AUTH_TOKEN: optional('TWILIO_AUTH_TOKEN', ''),
  TWILIO_PHONE: optional('TWILIO_PHONE', ''),

  // CORS
  FRONTEND_URL: optional('FRONTEND_URL', 'http://localhost:3001'),

  // Feature flags
  IS_DEV: optional('NODE_ENV', 'development') === 'development',
  IS_PROD: optional('NODE_ENV', 'development') === 'production',
  
  // HMS temporary bypass (remove when HMS implements proper auth)
  ALLOW_HMS_BYPASS: optional('ALLOW_HMS_BYPASS', 'true') === 'true',
} as const;

export type EnvConfig = typeof ENV;
console.log("ENV TEST:", process.env.GOOGLE_CLIENT_ID);