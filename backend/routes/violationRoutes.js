import express from 'express';
import { logViolation, getAttemptViolations } from '../controllers/violationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/log', protect, roleCheck(['student']), logViolation);
router.get('/:attemptId', protect, roleCheck(['teacher']), getAttemptViolations);

export default router;
