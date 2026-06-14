import Exam from '../models/Exam.js';

export const createExam = async (req, res) => {
  try {
    const { title, description, duration, questions, scheduledDate, startTime, endTime, examPassword } = req.body;

    if (!title || !duration || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const exam = await Exam.create({
      title,
      description,
      duration,
      examPassword: examPassword || null,
      scheduledDate: scheduledDate || null,
      startTime: startTime || null,
      endTime: endTime || null,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExams = async (req, res) => {
  try {
    // If teacher, return exams created by them
    // If student, return all exams (or active ones if we had that logic)
    let query = {};
    if (req.user.role === 'teacher') {
      query.createdBy = req.user._id;
    }

    const rawExams = await Exam.find(query).select('-questions.correctOption').sort({ createdAt: -1 });

    const exams = rawExams.map(e => {
      const examObj = e.toObject();
      if (examObj.examPassword) {
        examObj.hasPassword = true;
        if (req.user.role === 'student') {
          delete examObj.examPassword;
        }
      } else {
        examObj.hasPassword = false;
      }
      return examObj;
    });

    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // For students, don't send the correctOption or examPassword
    if (req.user.role === 'student') {
      const examForStudent = exam.toObject();
      if (examForStudent.examPassword) {
        examForStudent.hasPassword = true;
        delete examForStudent.examPassword;
      } else {
        examForStudent.hasPassword = false;
      }
      examForStudent.questions.forEach(q => delete q.correctOption);
      return res.status(200).json(examForStudent);
    }

    const examObj = exam.toObject();
    if (examObj.examPassword) {
      examObj.hasPassword = true;
    } else {
      examObj.hasPassword = false;
    }

    res.status(200).json(examObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, questions, scheduledDate, startTime, endTime, examPassword } = req.body;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this exam' });
    }

    if (!title || !duration || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      {
        title,
        description,
        duration,
        examPassword: examPassword || null,
        scheduledDate: scheduledDate || null,
        startTime: startTime || null,
        endTime: endTime || null,
        questions
      },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedExam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
