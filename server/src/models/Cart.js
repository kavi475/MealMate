import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: String,
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    price: Number,
    image: String
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Cart', cartSchema);