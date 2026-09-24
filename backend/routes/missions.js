import { Router } from 'express';
import {
  getDailyMission,
  updateDailyMission,
  deleteDailyMission,
  generateMissionPlan,
  listMissions,
  addMission,
  deleteMission,
  getLatestPlan
} from '../controllers/missionController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/daily', protect, getDailyMission);
router.put('/daily', protect, updateDailyMission);
router.delete('/daily', protect, deleteDailyMission);
router.post('/generate', protect, generateMissionPlan);
router.get('/plans', protect, getLatestPlan);
router.get('/', protect, listMissions);
router.post('/', protect, addMission);
router.delete('/:id', protect, deleteMission);

export default router;
