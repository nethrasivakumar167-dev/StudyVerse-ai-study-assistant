import api from './api';
import { userGet, userSet } from '../utils/userStorage';

const MISSION_STORAGE_KEY = 'studyverse_daily_mission';

export const missionService = {
  getDailyMission: async () => {
    try {
      const res = await api.get('/missions/daily');
      return res.data || null;
    } catch {
      const stored = userGet(MISSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    }
  },

  updateDailyMission: async (mission) => {
    try {
      const res = await api.put('/missions/daily', mission);
      userSet(MISSION_STORAGE_KEY, res.data);
      return res.data;
    } catch {
      userSet(MISSION_STORAGE_KEY, mission);
      return mission;
    }
  },

  deleteDailyMission: async () => {
    try {
      const res = await api.delete('/missions/daily');
      userSet(MISSION_STORAGE_KEY, null);
      return res.data;
    } catch {
      userSet(MISSION_STORAGE_KEY, null);
      return { success: true };
    }
  },

  // Mission to-do list (Mission Planner)
  getMissions: async () => {
    try {
      const res = await api.get('/missions');
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return null; // null = backend unreachable (vs [] = genuinely empty)
    }
  },

  addMission: async ({ title, note = '', deadline = null }) => {
    try {
      const res = await api.post('/missions', { title, note, deadline });
      return res.data;
    } catch (err) {
      if (err?.response) throw err; // backend rejected it (validation) — surface it
      // Offline: local-only item (won't survive a reload, same as other fallbacks)
      return {
        id: `local-${Date.now()}`,
        title,
        note,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        createdAt: new Date().toISOString()
      };
    }
  },

  removeMission: async (id) => {
    try {
      await api.delete(`/missions/${id}`);
      return true;
    } catch {
      return false; // UI removes optimistically; list re-syncs on next load
    }
  },

  // Latest saved study plan (null when none / backend unreachable)
  getSavedPlan: async () => {
    try {
      const res = await api.get('/missions/plans');
      return res.data || null;
    } catch {
      return null;
    }
  },

  // Generate personalized multi-day training protocol for any topic
  generateProtocol: async ({ goal, topic = 'Operating Systems', availableHours = 2, deadlineDays = 7, knowledgeLevel = 'HERO' }) => {
    const res = await api.post('/missions/generate', { goal, topic, availableHours, deadlineDays, knowledgeLevel });
    return res.data;
  }
};
