import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUser,
} from "../controllers/userController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// USER ROUTES
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);

// ==========================================
// ADMIN ROUTES
// ==========================================
router.get("/admin/all", auth, adminAuth, getAllUsers);
router.delete("/admin/:id", auth, adminAuth, deleteUser);

export default router;
