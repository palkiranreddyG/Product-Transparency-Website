import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['ai_generated', 'fallback', 'custom'],
    default: 'ai_generated'
  },
  stepNumber: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Question', questionSchema);


