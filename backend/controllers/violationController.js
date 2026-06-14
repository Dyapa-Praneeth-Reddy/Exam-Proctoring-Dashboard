import Violation from '../models/Violation.js';
import Attempt from '../models/Attempt.js';

export const logViolation = async (req, res) => {
  try {
    const { attemptId, type } = req.body;

    if (!attemptId || !type) {
      return res.status(400).json({ message: 'Attempt ID and violation type are required' });
    }

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (attempt.status !== 'in-progress') {
      return res.status(400).json({ message: 'Cannot log violation for an exam that is not in progress' });
    }

    const violation = await Violation.create({
      attemptId,
      type
    });

    attempt.violationCount += 1;
    await attempt.save();

    res.status(201).json({ violation, currentViolationCount: attempt.violationCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttemptViolations = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const violations = await Violation.find({ attemptId }).sort({ timestamp: -1 });
    res.status(200).json(violations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
