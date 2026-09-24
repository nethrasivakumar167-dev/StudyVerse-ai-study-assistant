import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/notesController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getNotes);
router.post('/', protect, createNote);
router.delete('/:id', protect, deleteNote);

export default router;
