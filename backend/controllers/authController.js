import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { generateToken } from '../utils/token.js';
import { formatProfile } from '../utils/gamification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loadDevUsers, saveDevUser } from '../utils/devUserStore.js';

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const findByCodename = (name) =>
  User.findOne({ superheroName: new RegExp(`^${escapeRegex(name)}$`, 'i') });

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, superheroName, heroClassId, avatarId, gender, password } = req.body;

  if (!name?.trim() || !superheroName?.trim() || !password) {
    return res.status(400).json({ message: 'name, superheroName and password are required' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const existing = await findByCodename(superheroName.trim());
  if (existing) {
    return res.status(409).json({ message: 'That superhero name is already enrolled' });
  }

  const hashed = await bcrypt.hash(String(password), 10);
  const user = await User.create({
    name: name.trim(),
    superheroName: superheroName.trim(),
    heroClassId: heroClassId || 'tech-titan',
    avatarId: avatarId || 'male-1',
    gender: gender || 'male',
    password: hashed
  });

  if (!process.env.MONGODB_URI) {
    saveDevUser({
      name: user.name,
      superheroName: user.superheroName,
      heroClassId: user.heroClassId,
      avatarId: user.avatarId,
      gender: user.gender,
      password: hashed
    });
  }

  res.status(201).json({ token: generateToken(user._id), profile: formatProfile(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { superheroName, password } = req.body;

  if (!superheroName?.trim() || !password) {
    return res.status(400).json({ message: 'Superhero name and passcode are required' });
  }

  let user = await findByCodename(superheroName.trim()).select('+password');

  // Check persistent dev store if running on in-memory DB and user not in current RAM instance
  if (!user) {
    const devUsers = loadDevUsers();
    const matchDev = devUsers.find(
      (u) => u.superheroName?.toLowerCase() === superheroName.trim().toLowerCase()
    );

    if (matchDev) {
      user = await User.create({
        name: matchDev.name || matchDev.superheroName,
        superheroName: matchDev.superheroName,
        heroClassId: matchDev.heroClassId || 'tech-titan',
        avatarId: matchDev.avatarId || 'male-1',
        gender: matchDev.gender || 'male',
        password: matchDev.password
      });
    } else if (!process.env.MONGODB_URI || process.env.NODE_ENV !== 'production') {
      // Auto-onboard for seamless development experience on server restarts
      const hashed = await bcrypt.hash(String(password), 10);
      user = await User.create({
        name: superheroName.trim(),
        superheroName: superheroName.trim(),
        heroClassId: 'tech-titan',
        avatarId: 'male-1',
        gender: 'male',
        password: hashed
      });

      saveDevUser({
        name: user.name,
        superheroName: user.superheroName,
        heroClassId: user.heroClassId,
        avatarId: user.avatarId,
        gender: user.gender,
        password: hashed
      });
    }
  }

  if (!user) {
    return res.status(401).json({ message: 'Invalid superhero name or passcode. Please try again.' });
  }

  const match = await bcrypt.compare(String(password), user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid superhero name or passcode. Please try again.' });
  }

  res.json({ token: generateToken(user._id), profile: formatProfile(user) });
});
