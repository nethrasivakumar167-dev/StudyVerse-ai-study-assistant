import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load backend/.env regardless of the directory the server is started from.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { seedDemoUsers } from './seed.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import saturdayRoutes from './routes/saturday.js';
import explainRoutes from './routes/explain.js';
import quizRoutes from './routes/quiz.js';
import notesRoutes from './routes/notes.js';
import missionRoutes from './routes/missions.js';

import mongoose from 'mongoose';
import { getLLMStatus } from './services/llmService.js';
import { aiRateLimiter } from './middleware/rateLimiter.js';

const app = express();

// Parse comma-separated CLIENT_URL origins for deployed frontend support
const clientUrlEnv = process.env.CLIENT_URL || '';
const configuredOrigins = clientUrlEnv
  ? clientUrlEnv.split(',').map((u) => u.trim()).filter(Boolean)
  : [];

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

const allowedOrigins = [...new Set([...configuredOrigins, ...defaultOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  })
);

app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection?.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  const llmStatus = getLLMStatus();

  res.json({
    status: 'ok',
    service: 'studyverse-api',
    database: {
      status: dbStatus,
      type: process.env.MONGODB_URI ? 'mongodb-remote' : 'mongodb-memory'
    },
    llm: llmStatus,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/saturday', aiRateLimiter, saturdayRoutes);
app.use('/api/explain', aiRateLimiter, explainRoutes);
app.use('/api/quiz', aiRateLimiter, quizRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/missions', aiRateLimiter, missionRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));

// Central error handler
app.use((err, req, res, _next) => {
  console.error('[API Error]', err.message);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: true, message: err.message });
  }
  const status = err.status || 500;
  res.status(status).json({
    error: true,
    message: err.message || 'Gemini AI is currently unavailable. Please try again.',
    code: err.code
  });
});


const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const secret = process.env.JWT_SECRET;
      if (!secret || secret === 'change_me' || secret === 'your_jwt_secret_key_here') {
        console.error('[SECURITY ERROR] Strong JWT_SECRET must be provided in production environment.');
        process.exit(1);
      }
    }

    await connectDB();
    if (process.env.SEED_DEMO === 'true') {
      try {
        await seedDemoUsers();
      } catch (err) {
        console.warn('[SEED] Demo seed failed:', err.message);
      }
    }
    app.listen(PORT, () => console.log(`[API] StudyVerse backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('[API] Failed to start:', err.message);
    process.exit(1);
  }
};

start();
