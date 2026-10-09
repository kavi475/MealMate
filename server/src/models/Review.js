import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      minlength: [3, "Comment must be at least 3 characters"],
      maxlength: [500, "Comment must be less than 500 characters"],
    },
  },
  { timestamps: true },
);

// One user can only review a menu item once
reviewSchema.index({ menuItemId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
