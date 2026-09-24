import { Router } from 'express';
import { explain } from '../controllers/saturdayController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, explain);

export default router;
