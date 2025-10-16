import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
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
  responseText: {
    type: String,
    required: true
  },
  submissionId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Response', responseSchema);


