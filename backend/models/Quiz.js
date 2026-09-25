import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true },
    difficulty: { type: String, default: 'HERO' },
    // Full question data (including correct answers) stays on the server so
    // submissions can be validated. The generate route strips what it sends.
    questions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    submitted: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    sourceUpload: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', default: null }
  },
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
