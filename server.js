// =======================================================
// PHASE 2 — CORE BACKEND API
// SECTION 8 — SERVER SETUP
// PURPOSE:
// - Initialize Express
// - Connect to MongoDB
// - Mount all API routes
// - Add security middleware (helmet, rate limiting)
// =======================================================

import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// =========================
// ROUTES (IMPORTS)
// =========================
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import insightRoutes from "./routes/insightRoutes.js";

// =========================
// INITIALIZE APP
// =========================
dotenv.config();
connectDB();

const app = express();

// =========================
// SECURITY MIDDLEWARE
// =========================
// Helmet adds security headers
app.use(helmet());

// Rate limiting for auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later"
});

// =========================
// MIDDLEWARE
// =========================
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL  // Set this in production .env
    : "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json());

// =========================
// ROUTE MOUNTING
// =========================
app.use("/api/auth", authLimiter, authRoutes);  // Rate-limited auth routes
app.use("/api/projects", projectRoutes);
app.use("/api/projects", taskRoutes);  // Nested task routes
app.use("/api/budgets", budgetRoutes);
app.use("/api", expenseRoutes);  // Handles /api/budgets/:id/expenses
app.use("/api/insights", insightRoutes);

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
