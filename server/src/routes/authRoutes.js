import express from "express";
import {
  register,
  login,
  getMe,
  resetPassword,
} from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/me", auth, getMe);

export default router;
