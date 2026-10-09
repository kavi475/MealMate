import express from "express";
import {
  getItemReviews,
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
} from "../controllers/reviewController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC
router.get("/item/:menuItemId", getItemReviews);

// USER
router.post("/", auth, addReview);
router.put("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);

// ADMIN
router.get("/admin/all", auth, adminAuth, getAllReviews);

export default router;
