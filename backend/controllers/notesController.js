import mongoose from 'mongoose';
import { Note } from '../models/Note.js';
import { timeAgo } from '../utils/time.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeFilename, generateNoteTxt, streamNotePdf } from '../services/exportService.js';

const formatNote = (note) => ({
  id: note._id.toString(),
  title: note.title || note.topic,
  topic: note.topic,
  difficulty: note.difficulty,
  subject: note.subject || '',
  tag: note.tag || '',
  summary: note.summary || '',
  bulletPoints: note.bulletPoints || [],
  examAlert: note.examAlert || '',
  sections: note.sections || [],
  examples: note.examples || [],
  commonMistakes: note.commonMistakes || [],
  examTips: note.examTips || [],
  keyFacts: note.keyFacts || [],
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
  const {
    title,
    topic,
    difficulty,
    subject,
    tag,
    summary,
    bulletPoints,
    examAlert,
    sections,
    examples,
    commonMistakes,
    examTips,
    keyFacts
  } = req.body;

  if (!topic?.trim()) {
    return res.status(400).json({ message: 'topic is required' });
  }

  const cleanTopic = topic.trim();
  const note = await Note.create({
    user: req.userId,
    title: typeof title === 'string' && title.trim() ? title.trim() : cleanTopic,
    topic: cleanTopic,
    difficulty: difficulty || 'HERO',
    subject: subject || '',
    tag: tag || '',
    summary: summary || '',
    bulletPoints: Array.isArray(bulletPoints) ? bulletPoints : [],
    examAlert: examAlert || '',
    sections: Array.isArray(sections) ? sections : [],
    examples: Array.isArray(examples) ? examples : [],
    commonMistakes: Array.isArray(commonMistakes) ? commonMistakes : [],
    examTips: Array.isArray(examTips) ? examTips : [],
    keyFacts: Array.isArray(keyFacts) ? keyFacts : []
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

// GET /api/notes/:id/export?format=pdf|txt (protected)
export const exportNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const format = (req.query.format || 'pdf').toLowerCase();

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const note = await Note.findOne({ _id: id, user: req.userId });
  if (!note) return res.status(404).json({ message: 'Note not found' });

  const baseTitle = note.title || note.topic || 'study_note';
  const cleanFilename = sanitizeFilename(baseTitle, 'study_note');

  if (format === 'txt' || format === 'text') {
    const textContent = generateNoteTxt(note);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}.txt"`);
    return res.send(textContent);
  }

  // Default to PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}.pdf"`);
  return streamNotePdf(note, res);
});

