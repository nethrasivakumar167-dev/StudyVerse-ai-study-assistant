import api from './api';
import { userGet, userSet } from '../utils/userStorage';

const NOTES_KEY = 'studyverse_vault_notes';

export const notesService = {
  getNotes: async () => {
    try {
      const response = await api.get('/notes');
      userSet(NOTES_KEY, response.data); // per-user offline cache
      return response.data;
    } catch {
      // Offline: this user's own cached notes — an empty array for a
      // brand-new user (never another user's or mock data).
      const stored = userGet(NOTES_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  },

  saveNote: async (note) => {
    const localNote = {
      ...note,
      id: `note-${Date.now()}`,
      createdDate: 'Just now',
      createdAt: new Date().toISOString()
    };
    try {
      const res = await api.post('/notes', note);
      return res.data;
    } catch {
      const existing = await notesService.getNotes();
      const updated = [localNote, ...existing];
      userSet(NOTES_KEY, updated);
      return localNote;
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
    } catch {
      const existing = await notesService.getNotes();
      userSet(
        NOTES_KEY,
        existing.filter((n) => n.id !== id)
      );
    }
  }
};
