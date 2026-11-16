import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Security middleware ---------------
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
});
app.use(limiter);

// Parse JSON bodies with a size limit to prevent DoS
app.use(express.json({ limit: '1mb' }));

// --------------- Routes ---------------
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Global error handler – never expose stack traces
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// --------------- Database & Server startup ---------------
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌  Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
