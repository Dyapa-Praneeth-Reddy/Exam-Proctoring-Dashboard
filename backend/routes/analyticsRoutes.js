import express from 'express';
import { getExamAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/results/:examId', protect, roleCheck(['teacher']), getExamAnalytics);

export default router;
