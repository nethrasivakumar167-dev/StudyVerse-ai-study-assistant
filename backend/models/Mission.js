import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    completed: { type: Boolean, default: false }
  },
  { _id: false }
);

const missionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD, one active mission per user/day
    title: { type: String, required: true },
    topic: { type: String, default: '' },
    rewardXp: { type: Number, default: 250 },
    difficulty: { type: String, default: 'HERO' },
    isCompleted: { type: Boolean, default: false },
    tasks: { type: [taskSchema], default: [] }
  },
  { timestamps: true }
);

missionSchema.index({ user: 1, date: 1 }, { unique: true });

export const Mission = mongoose.model('Mission', missionSchema);
