import mongoose from 'mongoose';
import { STARTING_NEXT_LEVEL_XP, getRankForLevel } from '../utils/gamification.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    superheroName: { type: String, required: true, unique: true, trim: true },
    heroClassId: { type: String, default: 'tech-titan' },
    password: { type: String, required: true, select: false },

    // Gamification progress (kept in sync with the frontend HeroContext)
    level: { type: Number, default: 1 },
    rank: { type: String, default: getRankForLevel(1) },
    xp: { type: Number, default: 0 },
    nextLevelXp: { type: Number, default: STARTING_NEXT_LEVEL_XP },
    streakDays: { type: Number, default: 0 },
    energyCores: { type: Number, default: 0 },
    joinedDate: { type: String, default: () => new Date().toISOString().slice(0, 10) },

    // Server-managed statistics (updated on quiz submits / mission completes)
    missionsCompleted: { type: Number, default: 0 },
    quizzesTaken: { type: Number, default: 0 },
    quizAccuracy: { type: Number, default: 0 },

    avatarId: { type: String, default: 'male-1' },
    gender: { type: String, default: 'male' },

    avatarConfig: {
      suitColor: { type: String, default: '#ef4444' },
      visorGlow: { type: String, default: '#eab308' },
      emblem: { type: String, default: 'lightning' }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
