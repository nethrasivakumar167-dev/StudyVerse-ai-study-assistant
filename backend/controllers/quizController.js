import { Quiz } from '../models/Quiz.js';
import { User } from '../models/User.js';
import { generateQuizQuestions } from '../services/aiService.js';
import { rankForAccuracy } from '../utils/gamification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/quiz/history (protected) — the authenticated user's quiz attempts
export const getQuizHistory = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ user: req.userId, submitted: true })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  res.json(
    quizzes.map((q) => {
      const total = q.questions?.length || 0;
      const accuracy = total ? Math.round((q.score / total) * 100) : 0;
      return {
        id: q._id.toString(),
        topic: q.topic,
        difficulty: q.difficulty,
        score: q.score,
        totalQuestions: total,
        accuracy,
        createdAt: q.createdAt
      };
    })
  );
});

// POST /api/quiz/generate (protected)
export const generateQuiz = asyncHandler(async (req, res) => {
  const { topic, difficulty = 'HERO', count = 4 } = req.body;
  const cleanTopic = (topic || '').trim() || 'General Concept';
  const safeCount = Math.min(Math.max(parseInt(count) || 4, 1), 10);

  const questions = await generateQuizQuestions(cleanTopic, difficulty, safeCount);

  // Persist the full question data (with answers) server-side so submissions
  // can be validated. The stored document is the source of truth.
  const quiz = await Quiz.create({
    user: req.userId,
    topic: cleanTopic,
    difficulty,
    questions
  });

  res.json({
    quizId: quiz._id.toString(),
    topic: cleanTopic,
    difficulty,
    totalQuestions: questions.length,
    totalPossibleXp: questions.reduce((acc, q) => acc + q.xp, 0) + 100, // +100 mission bonus
    questions // includes correctAnswer: the current UI grades each answer locally for instant feedback
  });
});

// POST /api/quiz/submit (protected)
export const submitQuiz = asyncHandler(async (req, res) => {
  let { correctCount = 0, totalQuestions = 1, totalXpEarned = 0, topic } = req.body;

  const total = Math.min(Math.max(parseInt(totalQuestions) || 1, 1), 10);
  const correct = Math.min(Math.max(parseInt(correctCount) || 0, 0), total);
  const accuracy = Math.round((correct / total) * 100);

  const rankAchieved = rankForAccuracy(accuracy);
  const bonusMessage =
    accuracy === 100 ? '⚡ FLAWLESS COMBAT VICTORY! +100 BONUS XP' : 'Mission Complete!';

  // Update server-side quiz statistics (running average accuracy).
  const user = await User.findById(req.userId);
  if (user) {
    const taken = user.quizzesTaken || 0;
    user.quizAccuracy = Math.round(((user.quizAccuracy || 0) * taken + accuracy) / (taken + 1));
    user.quizzesTaken = taken + 1;
    await user.save();
  }

  // Mark the most recent matching quiz as submitted and record the score.
  const quiz = await Quiz.findOne({ user: req.userId, ...(topic ? { topic } : {}) }).sort({
    createdAt: -1
  });
  if (quiz) {
    quiz.submitted = true;
    quiz.score = correct;
    await quiz.save();
  }

  // XP is awarded live by the frontend (with combo multipliers) and synced to
  // the server through PUT /api/profile, so we echo the earned amount back.
  res.json({
    success: true,
    accuracy,
    correctCount: correct,
    totalQuestions: total,
    totalXpEarned: Number(totalXpEarned) || 0,
    rankAchieved,
    bonusMessage
  });
});
