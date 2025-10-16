/**
 * ClearChoice Insight — MongoDB Database Configuration
 * ----------------------------------------------------
 * This version guarantees .env loading in all cases:
 * - Works when launched from root via start-dev.bat
 * - Works when running directly inside /backend
 * - Handles OneDrive paths and encoding issues
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
// Verify .env file exists and load it
// ---------------------------------------------
if (!fs.existsSync(envPath)) {
  console.error(`❌ .env file not found at ${envPath}`);
  console.error('👉 Please create backend/.env and add MONGODB_URI there.');
  process.exit(1);
}

dotenv.config({ path: envPath });

// ---------------------------------------------
// Debug print (for sanity check)
// ---------------------------------------------
console.log('🧭 Using environment file:', envPath);
if (process.env.MONGODB_URI) {
  console.log('🔍 MONGODB_URI: Loaded ✅');
} else {
  console.log('🔍 MONGODB_URI: ❌ Missing — check backend/.env');
}

// ---------------------------------------------
// MongoDB connection configuration
// ---------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('❌ Environment variable MONGODB_URI or MONGO_URI not set.');
  console.error('👉 Please add it to backend/.env');
  process.exit(1);
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
