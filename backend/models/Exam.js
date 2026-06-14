import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctOption: {
    type: Number,
    required: true,
  }
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  examPassword: {
    type: String,
    trim: true,
  },
  scheduledDate: {
    type: Date,
  },
  startTime: {
    type: String, // HH:mm
  },
  endTime: {
    type: String, // HH:mm
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);
