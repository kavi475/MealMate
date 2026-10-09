import express from "express";
import Review from "../models/Review.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// GET all reviews (admin)
router.get("/", auth, adminAuth, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("menuItemId", "name category")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a review (admin)
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
