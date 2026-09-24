import { User } from '../models/User.js';
import { formatProfile, getRankForLevel } from '../utils/gamification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/profile (protected)
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'Profile not found' });
  res.json(formatProfile(user));
});

// PUT /api/profile (protected)
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'Profile not found' });

  // Identity + progress fields the frontend HeroContext owns and syncs.
  // quizAccuracy / missionsCompleted are intentionally excluded: the server
  // manages those from actual quiz and mission activity.
  const allowed = [
    'name',
    'superheroName',
    'heroClassId',
    'xp',
    'level',
    'nextLevelXp',
    'streakDays',
    'energyCores',
    'joinedDate',
    'avatarId',
    'gender',
    'avatarConfig'
  ];
  for (const field of allowed) {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  }

  // Rank is always derived from level so client and server never disagree.
  user.rank = getRankForLevel(user.level);

  try {
    await user.save();
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Superhero name already in use' });
    throw err;
  }

  res.json(formatProfile(user));
});
