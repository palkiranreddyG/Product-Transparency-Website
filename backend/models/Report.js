import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissionId: {
    type: String,
    required: true,
    unique: true
  },
  reportData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  pdfUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Report', reportSchema);

