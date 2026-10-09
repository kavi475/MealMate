import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name must be less than 50 characters"],
    match: [/^[A-Za-z\s]+$/, "Name must contain only letters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true,
    minlength: [3, "Subject must be at least 3 characters"],
    maxlength: [100, "Subject must be less than 100 characters"],
    validate: {
      validator: function (v) {
        return /[A-Za-z]/.test(v);
      },
      message: "Subject must contain at least one letter",
    },
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    minlength: [10, "Message must be at least 10 characters"],
    maxlength: [1000, "Message must be less than 1000 characters"],
    validate: {
      validator: function (v) {
        return /[A-Za-z]/.test(v);
      },
      message: "Message must contain at least one letter",
    },
  },
  status: {
    type: String,
    enum: ["new", "read", "replied", "archived"],
    default: "new",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ContactMessage", contactMessageSchema);
