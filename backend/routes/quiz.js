import { Router } from 'express';
import { generateQuiz, submitQuiz, getQuizHistory } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/history', protect, getQuizHistory);
router.post('/generate', protect, generateQuiz);
router.post('/submit', protect, submitQuiz);

export default router;
