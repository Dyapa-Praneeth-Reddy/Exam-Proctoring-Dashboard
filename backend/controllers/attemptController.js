import Attempt from '../models/Attempt.js';
import Exam from '../models/Exam.js';

export const startAttempt = async (req, res) => {
  try {
    const { examId, password } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (exam.examPassword && exam.examPassword !== password) {
      return res.status(401).json({ message: 'Incorrect exam password' });
    }

    // Check if student already has an active or submitted attempt
    const existingAttempt = await Attempt.findOne({
      studentId: req.user._id,
      examId: examId,
    });

    if (existingAttempt) {
      if (existingAttempt.status !== 'in-progress') {
        return res.status(400).json({ message: 'You have already submitted this exam' });
      }
      return res.status(200).json(existingAttempt);
    }

    const attempt = await Attempt.create({
      studentId: req.user._id,
      examId,
      startTime: new Date(),
      status: 'in-progress'
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, isAutoSubmit } = req.body;

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (attempt.status !== 'in-progress') {
      return res.status(400).json({ message: 'Attempt already submitted' });
    }

    const exam = await Exam.findById(attempt.examId);
    
    // Calculate score
    let score = 0;
    const processedAnswers = [];
    
    if (answers && Array.isArray(answers)) {
      answers.forEach(ans => {
        const question = exam.questions.id(ans.questionId);
        if (question && question.correctOption === ans.selectedOption) {
          score++;
        }
        processedAnswers.push({
          questionId: ans.questionId,
          selectedOption: ans.selectedOption
        });
      });
    }

    attempt.answers = processedAnswers;
    attempt.score = score;
    attempt.status = isAutoSubmit ? 'auto-submitted' : 'submitted';
    attempt.endTime = new Date();

    await attempt.save();

    res.status(200).json({ attempt, totalScore: exam.questions.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ studentId: req.user._id })
      .populate('examId', 'title duration')
      .sort({ createdAt: -1 });
    res.status(200).json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
