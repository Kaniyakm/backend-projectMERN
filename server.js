// =======================================================
// PHASE 2 — CORE BACKEND API
// SECTION 8 — SERVER SETUP
// PURPOSE:
// - Initialize Express
// - Connect to MongoDB
// - Mount all API routes
// =======================================================

import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// =========================
// ROUTES (IMPORTS)
// =========================
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// =========================
// INITIALIZE APP
// =========================
dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// =========================
// ROUTE MOUNTING
// =========================
app.use("/api/users", authRoutes);        // Authentication routes
app.use("/api/projects", projectRoutes);  // Project CRUD routes
app.use("/api/projects", taskRoutes);     // Nested task routes

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
