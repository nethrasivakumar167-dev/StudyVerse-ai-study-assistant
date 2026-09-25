import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  filename: {
    type: String,
    required: true,
    trim: true
  },
  extractedText: {
    type: String,
    required: true
  },
  charCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Upload = mongoose.model('Upload', uploadSchema);
export default Upload;
