import { Router } from 'express';
import { chat, listConversations, listMessages } from '../controllers/saturdayController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/conversations', protect, listConversations);
router.get('/conversations/:id', protect, listMessages);
router.post('/chat', protect, chat);

export default router;
