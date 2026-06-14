import Attempt from '../models/Attempt.js';
import Exam from '../models/Exam.js';
import Violation from '../models/Violation.js';

export const getExamAnalytics = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Verify teacher owns the exam
    if (exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view analytics for this exam' });
    }

    const attempts = await Attempt.find({ examId })
      .populate('studentId', 'name email')
      .sort({ score: -1 });

    const totalAttempts = attempts.length;
    const scores = attempts.map(a => a.score);
    const averageScore = totalAttempts > 0 ? (scores.reduce((a, b) => a + b, 0) / totalAttempts).toFixed(2) : 0;
    
    // Fetch all violations for these attempts
    const attemptIds = attempts.map(a => a._id);
    const violations = await Violation.find({ attemptId: { $in: attemptIds } });

    res.status(200).json({
      exam,
      totalAttempts,
      averageScore,
      attempts,
      violations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
