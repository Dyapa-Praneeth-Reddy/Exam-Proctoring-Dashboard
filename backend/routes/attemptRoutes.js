import express from 'express';
import { startAttempt, submitAttempt, getMyAttempts } from '../controllers/attemptController.js';
import { protect } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/start', protect, roleCheck(['student']), startAttempt);
router.put('/:attemptId/submit', protect, roleCheck(['student']), submitAttempt);
router.get('/my-attempts', protect, roleCheck(['student']), getMyAttempts);

export default router;
