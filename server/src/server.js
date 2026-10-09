import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminReviewRoutes from "./routes/adminReviewRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/reviews", adminReviewRoutes); // must be before /api/admin
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "MealMate API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
});
