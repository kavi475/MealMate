import express from "express";
import {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  getPopularItems,
  getCategoryCounts,
} from "../controllers/menuController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get("/", getMenuItems);
router.get("/popular", getPopularItems); 
router.get("/categories/counts", getCategoryCounts);
router.get("/:id", getMenuItem);

// ==========================================
// ADMIN ROUTES
// ==========================================
router.post("/", auth, adminAuth, createMenuItem);
router.put("/:id", auth, adminAuth, updateMenuItem);
router.put("/:id/toggle", auth, adminAuth, toggleAvailability);
router.delete("/:id", auth, adminAuth, deleteMenuItem);

export default router;
