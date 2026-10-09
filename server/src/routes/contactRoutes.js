import express from "express";
import {
  submitContactForm,
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
} from "../controllers/contactController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC — Submit form
router.post("/", submitContactForm);

// ADMIN — Manage messages
router.get("/admin/all", auth, adminAuth, getAllMessages);
router.put("/admin/:id/status", auth, adminAuth, updateMessageStatus);
router.delete("/admin/:id", auth, adminAuth, deleteMessage);

export default router;
