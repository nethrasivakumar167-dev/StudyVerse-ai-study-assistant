/**
 * Development/demo seed: creates 2-3 demo users with realistic, user-specific
 * study history built from the project's OWN content (content bank notes,
 * curated quiz banks) — no fabricated filler.
 *
 * Runs on server boot when SEED_DEMO=true. Idempotent: users that already
 * exist are left untouched, so existing demo data is preserved.
 *
 * Demo credentials: password "demo1234" for all three users.
 * A brand-new user registered through the app is NOT touched by this seed —
 * they start with a completely empty journey.
 */

import bcrypt from 'bcrypt';
import { User } from './models/User.js';
import { Note } from './models/Note.js';
import { Quiz } from './models/Quiz.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';
import { UserMission } from './models/UserMission.js';
import { Mission } from './models/Mission.js';
import { matchContentBank } from './utils/contentBank.js';
import { buildQuizQuestions } from './utils/quizBank.js';
import { STARTING_NEXT_LEVEL_XP, nextThreshold, getRankForLevel } from './utils/gamification.js';

const DEMO_PASSWORD = 'demo1234';

const thresholdForLevel = (level) => {
  let t = STARTING_NEXT_LEVEL_XP;
  for (let i = 1; i < level; i++) t = nextThreshold(t);
  return t;
};

const daysAgoIso = (days) => new Date(Date.now() - days * 86400000).toISOString();

/** Backdates a document's timestamps so demo history looks lived-in. */
const backdate = async (Model, doc, days) => {
  const when = new Date(Date.now() - days * 86400000);
  await Model.collection.updateOne({ _id: doc._id }, { $set: { createdAt: when, updatedAt: when } });
};

const DEMO_USERS = [
  {
    name: 'Aarav Menon',
    superheroName: 'NovaByte',
    heroClassId: 'tech-titan',
    avatarId: 'male-1',
    gender: 'male',
    progress: {
      level: 9,
      xp: 1240,
      streakDays: 12,
      energyCores: 6,
      missionsCompleted: 7,
      quizAccuracy: 82,
      quizzesTaken: 3,
      joinedDate: '2026-08-18'
    },
    notes: [
      { topic: 'Process Scheduling', difficulty: 'HERO', days: 6 },
      { topic: 'TCP/IP 3-Way Handshake', difficulty: 'SUPERHERO', days: 3 },
      { topic: 'Operating System Deadlocks', difficulty: 'HERO', days: 1 }
    ],
    quizzes: [
      { topic: 'Process Scheduling', score: 4, days: 5 },
      { topic: 'Deadlocks', score: 3, days: 2 }
    ],
    conversations: [
      {
        title: 'Round Robin quantum doubt',
        days: 2,
        userText: 'Why does a very large time quantum turn Round Robin into FCFS?',
        saturdayText:
          'Because with an infinite quantum no process is ever preempted before finishing — the scheduler simply runs each job to completion in arrival order, which is exactly FCFS. Watch for that as an exam trap.'
      }
    ],
    missions: [
      { title: 'Finish DB normalization worksheet', note: 'Focus on 3NF decompositions', deadlineDays: 3 },
      { title: 'Revise Gantt chart numericals', note: 'Waiting time vs turnaround time', deadlineDays: 1 }
    ]
  },
  {
    name: 'Ishita Rao',
    superheroName: 'QuantumQuill',
    heroClassId: 'knowledge-warrior',
    avatarId: 'female-1',
    gender: 'female',
    progress: {
      level: 6,
      xp: 820,
      streakDays: 5,
      energyCores: 4,
      missionsCompleted: 4,
      quizAccuracy: 74,
      quizzesTaken: 2,
      joinedDate: '2026-09-01'
    },
    notes: [
      { topic: 'Dynamic Programming & Memoization', difficulty: 'HERO', days: 4 },
      { topic: 'Graph Traversal: BFS vs DFS', difficulty: 'RECRUIT', days: 2 }
    ],
    quizzes: [{ topic: 'Binary Trees', score: 3, days: 3 }],
    conversations: [
      {
        title: 'Memoization vs tabulation',
        days: 3,
        userText: 'When should I use memoization instead of tabulation?',
        saturdayText:
          'Use memoization when you only need a few states of a recursive solution — it computes top-down on demand. Prefer tabulation when every state gets filled anyway: it is iterative, avoids call-stack overhead, and usually runs faster.'
      }
    ],
    missions: [{ title: 'Solve 2 knapsack problems', note: '0/1 recurrence from memory', deadlineDays: 2 }]
  },
  {
    name: 'Kabir Shah',
    superheroName: 'CipherSage',
    heroClassId: 'strategist',
    avatarId: 'male-5',
    gender: 'male',
    progress: {
      level: 3,
      xp: 460,
      streakDays: 2,
      energyCores: 2,
      missionsCompleted: 1,
      quizAccuracy: 65,
      quizzesTaken: 1,
      joinedDate: '2026-09-14'
    },
    notes: [{ topic: 'Database ACID Properties & Transactions', difficulty: 'RECRUIT', days: 1 }],
    quizzes: [{ topic: 'OOP', score: 2, days: 1 }],
    conversations: [],
    missions: []
  }
];

/** Creates demo users with their own notes, quiz history, chats, and to-dos. */
export const seedDemoUsers = async () => {
  let created = 0;

  for (const demo of DEMO_USERS) {
    const existing = await User.findOne({ superheroName: demo.superheroName });
    if (existing) {
      // Sync demo avatar configuration if changed
      if (demo.avatarId && (!existing.avatarId || existing.avatarId !== demo.avatarId)) {
        await User.updateOne(
          { _id: existing._id },
          { $set: { avatarId: demo.avatarId, gender: demo.gender } }
        );
      }
      continue; // preserve existing demo history on restart
    }

    const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);
    const user = await User.create({
      name: demo.name,
      superheroName: demo.superheroName,
      heroClassId: demo.heroClassId,
      avatarId: demo.avatarId || 'male-1',
      gender: demo.gender || 'male',
      password: hashed,
      ...demo.progress,
      nextLevelXp: thresholdForLevel(demo.progress.level),
      rank: getRankForLevel(demo.progress.level)
    });
    created += 1;

    // Knowledge Vault notes built from the curated content bank.
    for (const n of demo.notes) {
      const entry = matchContentBank(n.topic);
      if (!entry) continue;
      const note = await Note.create({
        user: user._id,
        title: n.topic,
        topic: n.topic.toUpperCase(),
        difficulty: n.difficulty,
        summary: entry.summary,
        bulletPoints: entry.notes.bulletPoints.slice(0, 5),
        examAlert: entry.notes.examAlert
      });
      await backdate(Note, note, n.days);
    }

    // Submitted quizzes with genuine curated questions.
    for (const q of demo.quizzes) {
      const questions = buildQuizQuestions(q.topic, 4);
      const quiz = await Quiz.create({
        user: user._id,
        topic: q.topic,
        difficulty: 'HERO',
        questions,
        submitted: true,
        score: q.score
      });
      await backdate(Quiz, quiz, q.days);
    }

    // S.A.T.U.R.D.A.Y. conversation threads.
    for (const c of demo.conversations) {
      const convo = await Conversation.create({ user: user._id, title: c.title });
      await backdate(Conversation, convo, c.days);
      const m1 = await Message.create({ conversation: convo._id, sender: 'user', text: c.userText });
      const m2 = await Message.create({ conversation: convo._id, sender: 'saturday', text: c.saturdayText });
      await backdate(Message, m1, c.days);
      await backdate(Message, m2, c.days);
    }

    // Mission Planner to-do list items.
    for (const m of demo.missions) {
      await UserMission.create({
        user: user._id,
        title: m.title,
        note: m.note,
        deadline: new Date(Date.now() + m.deadlineDays * 86400000)
      });
    }

    // Daily Mission for demo user
    const todayStr = new Date().toISOString().slice(0, 10);
    await Mission.create({
      user: user._id,
      date: todayStr,
      title: 'MASTER PROCESS SCHEDULING',
      topic: 'Process Scheduling & Synchronization',
      rewardXp: 250,
      difficulty: 'HERO',
      isCompleted: false,
      tasks: [
        { id: 't1', label: 'Review Process Scheduling & Context Switching', completed: true },
        { id: 't2', label: 'Ask S.A.T.U.R.D.A.Y. for a Round-Robin deep dive', completed: false },
        { id: 't3', label: 'Complete Battle Quiz on CPU Scheduling', completed: false }
      ]
    });
  }

  // Restore any persistent custom registered dev users
  try {
    const { loadDevUsers } = await import('./utils/devUserStore.js');
    const devUsers = loadDevUsers();
    for (const du of devUsers) {
      const exists = await User.findOne({ superheroName: du.superheroName });
      if (!exists && du.superheroName && du.password) {
        await User.create({
          name: du.name || du.superheroName,
          superheroName: du.superheroName,
          heroClassId: du.heroClassId || 'tech-titan',
          avatarId: du.avatarId || 'male-1',
          gender: du.gender || 'male',
          password: du.password
        });
      }
    }
  } catch (err) {
    console.warn('[SEED] Could not restore dev users:', err.message);
  }

  console.log(
    created
      ? `[SEED] ${created} demo user(s) ready — NovaByte, QuantumQuill, CipherSage (password: ${DEMO_PASSWORD})`
      : '[SEED] Demo users already exist — data preserved'
  );
  return created;
};
