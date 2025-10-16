// -------------------------------
// ClearChoice Insight - Server.js
// -------------------------------

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ------------------------------------
// Load Environment Variables Safely
// ------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load the .env file even when started from root (via start-dev.bat)
dotenv.config({ path: path.join(__dirname, '.env') });

// ------------------------------------
// Import Routes and Database
// ------------------------------------
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import questionRoutes from './routes/questions.js';
import reportRoutes from './routes/reports.js';
import { initDatabase } from './config/database.js';

// ------------------------------------
// Express App Setup
// ------------------------------------
const app = express();
const PORT = process.env.PORT || 3001;

// ------------------------------------
// Security & Rate Limiting
// ------------------------------------
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit per IP
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// ------------------------------------
// ✅ Updated CORS Configuration
// ------------------------------------

// Step 1: Load allowed origins from .env
// Example: CORS_ORIGIN=http://localhost:8080,https://clearchoice-insight.vercel.app
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Step 2: Apply dynamic CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman, curl)
      if (!origin) return callback(null, true);

      // Allow if origin matches any allowedOrigins
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed.includes('*')) {
          const pattern = new RegExp(`^${allowed.replace(/\*/g, '.*')}$`);
          return pattern.test(origin);
        }
        return origin === allowed;
      });

      if (isAllowed) {
        return callback(null, true);
      } else {
        console.warn(`❌ CORS blocked: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200, // Fix for legacy browsers
  })
);

// ------------------------------------
// Middleware
// ------------------------------------
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ------------------------------------
// Health Check Route
// ------------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'ClearChoice Insight API is running',
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------
// API Routes
// ------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/reports', reportRoutes);

// ------------------------------------
// 404 Handler
// ------------------------------------
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
  });
});

// ------------------------------------
// Global Error Handler
// ------------------------------------
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong',
  });
});

// ------------------------------------
// Initialize Database and Start Server
// ------------------------------------
const startServer = async () => {
  try {
    await initDatabase();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 ClearChoice Insight API running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Allowed CORS Origins: ${allowedOrigins.join(', ') || 'None set'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
