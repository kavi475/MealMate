import express from "express";
import {
  getDashboardStats,
  getSalesReport,
  getCategoryBreakdown,
  getTopCustomers,
} from "../controllers/adminController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", auth, adminAuth, getDashboardStats);
router.get("/reports", auth, adminAuth, getSalesReport);
router.get("/reports/categories", auth, adminAuth, getCategoryBreakdown);
router.get("/reports/customers", auth, adminAuth, getTopCustomers);

export default router;
