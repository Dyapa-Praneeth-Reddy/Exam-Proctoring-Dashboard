import express from 'express';
import { createExam, getExams, getExamById, updateExam } from '../controllers/examController.js';
import { protect } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.route('/')
  .post(protect, roleCheck(['teacher']), createExam)
  .get(protect, getExams);

router.route('/:id')
  .get(protect, getExamById)
  .put(protect, roleCheck(['teacher']), updateExam);

export default router;
