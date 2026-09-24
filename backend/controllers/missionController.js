import { Types } from 'mongoose';
import { Mission } from '../models/Mission.js';
import { StudyPlan } from '../models/StudyPlan.js';
import { UserMission } from '../models/UserMission.js';
import { User } from '../models/User.js';
import { Quiz } from '../models/Quiz.js';
import { generateStudyPlan } from '../services/aiService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const today = () => new Date().toISOString().slice(0, 10);

const MAX_MISSIONS = 30;

const formatMission = (mission) => ({
  id: mission._id.toString(),
  title: mission.title,
  topic: mission.topic,
  rewardXp: mission.rewardXp,
  difficulty: mission.difficulty,
  isCompleted: mission.isCompleted,
  tasks: mission.tasks.map((t) => ({ id: t.id, label: t.label, completed: t.completed }))
});

const formatTodo = (m) => ({
  id: m._id.toString(),
  title: m.title,
  note: m.note || '',
  deadline: m.deadline ? m.deadline.toISOString() : null,
  createdAt: m.createdAt
});

const defaultMission = () => ({
  title: 'MASTER PROCESS SCHEDULING',
  topic: 'Process Scheduling & Synchronization',
  rewardXp: 250,
  difficulty: 'HERO',
  isCompleted: false,
  tasks: [
    { id: 't1', label: 'Review Process Scheduling & Context Switching', completed: false },
    { id: 't2', label: 'Ask S.A.T.U.R.D.A.Y. for a Round-Robin deep dive', completed: false },
    { id: 't3', label: 'Complete Battle Quiz on CPU Scheduling', completed: false }
  ]
});

// GET /api/missions/daily (protected)
export const getDailyMission = asyncHandler(async (req, res) => {
  const mission = await Mission.findOne({ user: req.userId, date: today() });
  if (!mission) {
    return res.json(null);
  }
  res.json(formatMission(mission));
});

// PUT /api/missions/daily (protected)
export const updateDailyMission = asyncHandler(async (req, res) => {
  const body = req.body || {};
  let mission = await Mission.findOne({ user: req.userId, date: today() });
  const wasCompleted = mission ? mission.isCompleted : false;

  if (!mission) {
    mission = await Mission.create({
      user: req.userId,
      date: today(),
      title: body.title || 'Today\'s Training Mission',
      topic: body.topic || '',
      rewardXp: body.rewardXp || 250,
      difficulty: body.difficulty || 'HERO',
      isCompleted: false,
      tasks: Array.isArray(body.tasks) ? body.tasks : []
    });
  }

  if (Array.isArray(body.tasks)) {
    mission.tasks = body.tasks.map((t, i) => ({
      id: t.id || `t${i + 1}`,
      label: t.label || `Task ${i + 1}`,
      completed: !!t.completed
    }));
  }
  if (typeof body.isCompleted === 'boolean') mission.isCompleted = body.isCompleted;
  // Derive completion from tasks when possible (keeps state consistent).
  if (mission.tasks.length && mission.tasks.every((t) => t.completed)) {
    mission.isCompleted = true;
  }

  await mission.save();

  // Server-side progress stat: award once per fresh completion (idempotent —
  // the frontend separately awards the XP through PUT /api/profile).
  if (!wasCompleted && mission.isCompleted) {
    await User.updateOne({ _id: req.userId }, { $inc: { missionsCompleted: 1 } });
  }

  res.json(formatMission(mission));
});

// DELETE /api/missions/daily (protected) — clears today's active mission for the user
export const deleteDailyMission = asyncHandler(async (req, res) => {
  await Mission.deleteMany({ user: req.userId, date: today() });
  res.json({ success: true, message: 'Daily mission cleared' });
});

// POST /api/missions/generate (protected) — study plan generator
export const generateMissionPlan = asyncHandler(async (req, res) => {
  const { goal, topic, availableHours = 2, deadlineDays = 7, knowledgeLevel = 'HERO' } = req.body;

  // Retrieve user's recent quiz attempts to personalize protocol
  const recentQuizzes = await Quiz.find({ user: req.userId, submitted: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const quizHistory = recentQuizzes.map((q) => {
    const total = q.questions?.length || 0;
    const accuracy = total ? Math.round((q.score / total) * 100) : 0;
    return `${q.topic} (Score: ${q.score}/${total}, Accuracy: ${accuracy}%)`;
  });

  const plan = await generateStudyPlan({
    goal,
    topic,
    availableHours,
    deadlineDays,
    knowledgeLevel,
    quizHistory
  });

  // 1. Persist the plan for the authenticated user.
  await StudyPlan.create({
    user: req.userId,
    goal: plan.goal,
    topic: plan.topic,
    protocolName: plan.protocolName,
    totalDays: plan.totalDays,
    estimatedXpPool: plan.estimatedXpPool,
    days: plan.days
  });

  // 2. Automatically sync Day 1 of the personalized protocol to Mission Control for today
  const day1 = plan.days?.[0];
  if (day1) {
    const day1Tasks = (day1.objectives || []).map((obj, i) => ({
      id: `t${i + 1}`,
      label: typeof obj === 'string' ? obj : `Task ${i + 1}`,
      completed: false
    }));

    await Mission.findOneAndUpdate(
      { user: req.userId, date: today() },
      {
        user: req.userId,
        date: today(),
        title: day1.title || `DAY 01: ${plan.topic}`,
        topic: plan.topic,
        rewardXp: day1.xpReward || 250,
        difficulty: knowledgeLevel || 'HERO',
        isCompleted: false,
        tasks: day1Tasks.length
          ? day1Tasks
          : [
              { id: 't1', label: `Complete Day 1 study on ${plan.topic}`, completed: false },
              { id: 't2', label: `Practice problem set and review with S.A.T.U.R.D.A.Y.`, completed: false }
            ]
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  res.json(plan);
});

// GET /api/missions/plans (protected) — latest saved study plan (or null)
export const getLatestPlan = asyncHandler(async (req, res) => {
  const plan = await StudyPlan.findOne({ user: req.userId }).sort({ createdAt: -1 }).lean();
  if (!plan) return res.json(null);

  res.json({
    id: plan._id.toString(),
    goal: plan.goal,
    topic: plan.topic,
    protocolName: plan.protocolName,
    totalDays: plan.totalDays,
    estimatedXpPool: plan.estimatedXpPool,
    days: plan.days,
    createdAt: plan.createdAt
  });
});

/* ------------------------------------------------------------------ */
/* Mission to-do list (add -> list -> mark done -> confirm -> delete)  */
/* ------------------------------------------------------------------ */

// GET /api/missions (protected) — to-do list, soonest deadline first,
// missions without a deadline last.
export const listMissions = asyncHandler(async (req, res) => {
  const missions = await UserMission.find({ user: req.userId }).sort({ createdAt: -1 }).lean();

  missions.sort((a, b) => {
    if (a.deadline && b.deadline) return a.deadline - b.deadline;
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return 0;
  });

  res.json(missions.map(formatTodo));
});

// POST /api/missions (protected) — { title, note?, deadline? }
export const addMission = asyncHandler(async (req, res) => {
  const { title, note = '', deadline } = req.body || {};

  if (!title?.trim()) {
    return res.status(400).json({ message: 'title is required' });
  }

  const count = await UserMission.countDocuments({ user: req.userId });
  if (count >= MAX_MISSIONS) {
    return res.status(400).json({ message: `Mission list is full (${MAX_MISSIONS}). Clear some first.` });
  }

  let deadlineDate = null;
  if (deadline) {
    // 'YYYY-MM-DD' -> end of that day, so "due today" lasts until midnight.
    const iso =
      /^\d{4}-\d{2}-\d{2}$/.test(String(deadline)) ? `${deadline}T23:59:59` : String(deadline);
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ message: 'deadline must be a valid date' });
    }
    deadlineDate = parsed;
  }

  const mission = await UserMission.create({
    user: req.userId,
    title: title.trim().slice(0, 120),
    note: String(note).trim().slice(0, 280),
    deadline: deadlineDate
  });

  res.status(201).json(formatTodo(mission));
});

// DELETE /api/missions/:id (protected) — used by "mark done -> confirm" and
// plain removal. Only the owner's mission is deleted; 404 otherwise.
export const deleteMission = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Mission not found' });
  }

  const deleted = await UserMission.findOneAndDelete({ _id: id, user: req.userId });
  if (!deleted) {
    return res.status(404).json({ message: 'Mission not found' });
  }

  res.json({ success: true, id });
});
