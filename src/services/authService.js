import api from './api';
import { setCurrentUser, clearCurrentUser, userGet, userSet } from '../utils/userStorage';

const PROFILE_KEY = 'studyverse_hero_profile';

/**
 * Server-default profile for a user we have no cached data for.
 * Mirrors the backend User model defaults — a brand-new hero starts here,
 * never at a demo persona's level/XP/streak/accuracy.
 */
const freshProfile = (overrides = {}) => ({
  name: '',
  superheroName: 'Recruit',
  heroClassId: 'tech-titan',
  avatarId: 'male-1',
  gender: 'male',
  level: 1,
  rank: 'ROOKIE',
  xp: 0,
  nextLevelXp: 500,
  streakDays: 0,
  missionsCompleted: 0,
  quizAccuracy: 0,
  energyCores: 0,
  joinedDate: new Date().toISOString().slice(0, 10),
  avatarConfig: {
    suitColor: '#ef4444',
    visorGlow: '#eab308',
    emblem: 'lightning'
  },
  ...overrides
});

/** Binds every namespaced local key to this user before any read/write. */
const rememberUser = (profile) => {
  const uid = profile?.id || profile?.superheroName || null;
  if (uid) setCurrentUser(uid);
};

export const authService = {
  // Get current active hero identity
  getHeroProfile: async () => {
    try {
      const response = await api.get('/profile');
      rememberUser(response.data);
      userSet(PROFILE_KEY, response.data);
      return response.data;
    } catch {
      // Backend unreachable → this user's own cached profile, else fresh defaults.
      const stored = userGet(PROFILE_KEY);
      return stored ? JSON.parse(stored) : freshProfile();
    }
  },

  // Save / update hero profile
  saveHeroProfile: async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      rememberUser(response.data);
      userSet(PROFILE_KEY, response.data);
      return response.data;
    } catch {
      userSet(PROFILE_KEY, profileData);
      return profileData;
    }
  },

  // Hero registration / onboarding
  registerHero: async (registrationData) => {
    try {
      const res = await api.post('/auth/register', registrationData);
      localStorage.setItem('studyverse_auth_token', res.data.token || 'mock_token');
      rememberUser(res.data.profile);
      userSet(PROFILE_KEY, res.data.profile);
      return res.data.profile;
    } catch (err) {
      // The backend answered with an error (e.g. duplicate name) — surface it.
      if (err.response) throw err;

      // Backend unreachable → build a local fallback persona (offline mode).
      const profile = freshProfile({
        name: registrationData.name || 'Hero Candidate',
        superheroName: registrationData.superheroName || 'Recruit',
        heroClassId: registrationData.heroClassId || 'tech-titan'
      });
      localStorage.setItem('studyverse_auth_token', 'mock_token_superhero');
      rememberUser(profile);
      userSet(PROFILE_KEY, profile);
      return profile;
    }
  },

  // Hero login — returns null when the backend rejects the credentials
  loginHero: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      localStorage.setItem('studyverse_auth_token', res.data.token || 'mock_token');
      rememberUser(res.data.profile);
      userSet(PROFILE_KEY, res.data.profile);
      return res.data.profile;
    } catch (err) {
      // Backend answered but rejected the credentials → login failed.
      if (err.response) return null;
      // Backend unreachable → offline fallback scoped to the typed-in name.
      setCurrentUser(credentials?.superheroName || 'anon');
      const stored = userGet(PROFILE_KEY);
      return stored
        ? JSON.parse(stored)
        : freshProfile({
            superheroName: credentials?.superheroName || 'Recruit',
            heroClassId: credentials?.heroClassId || 'tech-titan'
          });
    }
  },

  logoutHero: () => {
    localStorage.removeItem('studyverse_auth_token');
    clearCurrentUser();
  }
};
