import mongoose from 'mongoose';

const violationSchema = new mongoose.Schema({
  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attempt',
    required: true,
  },
  type: {
    type: String,
    enum: ['tab-switch', 'fullscreen-exit', 'copy-paste', 'multiple-faces', 'no-face'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.model('Violation', violationSchema);
