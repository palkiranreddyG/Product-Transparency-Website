import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  brandName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['food-beverage', 'fashion-apparel', 'home-living', 'health-wellness', 'electronics', 'other']
  },
  description: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'processing', 'completed'],
    default: 'draft'
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);

