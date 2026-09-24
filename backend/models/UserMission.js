import mongoose from 'mongoose';

/**
 * A user's to-do mission in the Mission Planner list.
 * Completed missions are DELETED (mark done -> confirm -> delete flow).
 */
const userMissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    note: {
      type: String,
      default: '',
      trim: true,
      maxlength: 280
    },
    // End of the deadline day (local); null = no deadline.
    deadline: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

userMissionSchema.index({ user: 1, deadline: 1 });

export const UserMission = mongoose.model('UserMission', userMissionSchema);
