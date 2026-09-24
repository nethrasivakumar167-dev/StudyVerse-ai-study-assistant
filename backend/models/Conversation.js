import mongoose from 'mongoose';

/**
 * A single S.A.T.U.R.D.A.Y. chat thread owned by one user.
 * Title is auto-set from the first user message (like ChatGPT).
 */
const conversationSchema = new mongoose.Schema(
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
      maxlength: 80
    }
  },
  { timestamps: true }
);

conversationSchema.index({ user: -1, updatedAt: -1 });

export default mongoose.model('Conversation', conversationSchema);
