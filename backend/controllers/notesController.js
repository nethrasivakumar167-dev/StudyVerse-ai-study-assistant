import mongoose from 'mongoose';
import { Note } from '../models/Note.js';
import { timeAgo } from '../utils/time.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const formatNote = (note) => ({
  id: note._id.toString(),
  title: note.title || note.topic,
  topic: note.topic,
  difficulty: note.difficulty,
  tag: note.tag,
  summary: note.summary,
  bulletPoints: note.bulletPoints,
  examAlert: note.examAlert,
  createdDate: timeAgo(note.createdAt),
  createdAt: note.createdAt
});

// GET /api/notes (protected) — only the authenticated user's notes
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(notes.map(formatNote));
});

// POST /api/notes (protected)
export const createNote = asyncHandler(async (req, res) => {
  const { title, topic, difficulty, tag, summary, bulletPoints, examAlert } = req.body;

  if (!topic?.trim()) {
    return res.status(400).json({ message: 'topic is required' });
  }

  const cleanTopic = topic.trim();
  const note = await Note.create({
    user: req.userId,
    title: typeof title === 'string' && title.trim() ? title.trim() : cleanTopic,
    topic: cleanTopic,
    difficulty: difficulty || 'HERO',
    tag: tag || '',
    summary: summary || '',
    bulletPoints: Array.isArray(bulletPoints) ? bulletPoints : [],
    examAlert: examAlert || ''
  });

  res.status(201).json(formatNote(note));
});

// DELETE /api/notes/:id (protected) — users can only delete their own notes
export const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const note = await Note.findOne({ _id: id, user: req.userId });
  if (!note) return res.status(404).json({ message: 'Note not found' });

  await note.deleteOne();
  res.json({ success: true });
});
