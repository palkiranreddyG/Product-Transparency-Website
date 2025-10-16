/**
 * ClearChoice Insight — MongoDB Database Configuration (Render Safe)
 * ------------------------------------------------------------------
 * Works both locally (with .env) and in production (Render dashboard vars)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------
// Resolve absolute .env path relative to this file
// ---------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');

// ---------------------------------------------
// Try loading .env file locally, but do NOT exit if missing
// ---------------------------------------------
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`🧭 Using local .env file: ${envPath}`);
} else {
  dotenv.config();
  console.log('✅ Using Render environment variables (no .env file found)');
}

// ---------------------------------------------
// Verify MongoDB URI presence
// ---------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI not found in environment variables.');
  console.warn('Render will fail if not configured in dashboard Environment tab.');
}

// ---------------------------------------------
// Database connection logic
// ---------------------------------------------
export const testConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connection successful');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

export const initDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    mongoose.connection.on('connected', () => {
      console.log('📊 Connected to MongoDB Atlas');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📊 MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📊 MongoDB connection closed via app termination');
      process.exit(0);
    });

    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

export default mongoose;
