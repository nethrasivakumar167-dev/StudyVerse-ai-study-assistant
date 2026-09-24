import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    goal: { type: String, default: '' },
    topic: { type: String, default: '' },
    protocolName: { type: String, default: '' },
    totalDays: { type: Number, default: 0 },
    estimatedXpPool: { type: Number, default: 0 },
    days: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  { timestamps: true }
);

export const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
