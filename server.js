// =======================================================
// PHASE 2 — CORE BACKEND API
// =======================================================
import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

// ROUTES
import authRoutes    from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes    from "./routes/taskRoutes.js";
import budgetRoutes  from "./routes/budgetRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import insightRoutes from "./routes/insightRoutes.js";

// SAFETY CHECK
if (process.env.NODE_ENV === "production" && !process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL must be set in production environment");
}

// CONNECT TO DATABASE
connectDB();

// INIT APP
const app = express();

// 💡 Render requires trust proxy,
// but to avoid rate-limit warnings use 1 instead of true
app.set("trust proxy", 1);

// SECURITY
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// RATE LIMITERS
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later"
});
const insightLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "Insight request limit reached, please try again later"
});

// ROUTES
app.use("/api/auth",     authLimiter,    authRoutes);
app.use("/api/projects",                 projectRoutes);
app.use("/api/projects",                 taskRoutes);
app.use("/api/budgets",                  budgetRoutes);
app.use("/api",                          expenseRoutes);
app.use("/api/insights", insightLimiter, insightRoutes);

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
