/**
 * MongoDB Database Connection
 * Connects to MongoDB using Mongoose with retry logic
 */

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/lifeline-dev';
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;

export const connectDatabase = async (): Promise<void> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log('✅ MongoDB connected successfully');

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
      });

      return;
    } catch (error: any) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${error.message}`);

      if (retries >= MAX_RETRIES) {
        console.warn('⚠️  MongoDB unavailable — running without database (dev mode).');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log('🔌 MongoDB disconnected gracefully');
};
