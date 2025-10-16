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

// Security headers
app.use(helmet());

// Rate limiting (avoid abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit per IP
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// ------------------------------------
// CORS Configuration
// ------------------------------------
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:8082',
      'http://localhost:8084',
      'https://clearchoice-insight.vercel.app',
      'https://*.vercel.app'
    ];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests
    const isAllowed = corsOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowedOrigin === origin;
    });
    if (isAllowed) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

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
    timestamp: new Date().toISOString()
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
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// ------------------------------------
// Global Error Handler
// ------------------------------------
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
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
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
