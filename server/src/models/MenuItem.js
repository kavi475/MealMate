import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'snacks', 'beverages', 'desserts']
  },
  veg: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5
  },
  image: {
    type: String,
    required: true
  },
  prepTime: {
    type: String,
    default: '10-15 min'
  },
  calories: {
    type: String,
    default: '300 kcal'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('MenuItem', menuItemSchema);