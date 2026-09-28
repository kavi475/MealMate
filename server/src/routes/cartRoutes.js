import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// All cart routes require auth
router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.put("/update", auth, updateCartItem);
router.delete("/remove/:menuItemId", auth, removeFromCart);
router.delete("/clear", auth, clearCart);

export default router;
