import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: '' }, // display title (defaults to topic)
    topic: { type: String, required: true, trim: true },
    difficulty: { type: String, default: 'HERO' },
    subject: { type: String, default: '' },
    tag: { type: String, default: '' },
    summary: { type: String, default: '' },
    bulletPoints: { type: [String], default: [] },
    examAlert: { type: String, default: '' },
    sections: { type: [mongoose.Schema.Types.Mixed], default: [] },
    examples: { type: [mongoose.Schema.Types.Mixed], default: [] },
    commonMistakes: { type: [String], default: [] },
    examTips: { type: [String], default: [] },
    keyFacts: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Note = mongoose.model('Note', noteSchema);

