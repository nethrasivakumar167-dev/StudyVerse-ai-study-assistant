import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

export default router;
