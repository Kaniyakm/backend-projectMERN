// ===============================================
// PHASE 2 — ROUTES
// FILE: routes/insightRoutes.js
// -----------------------------------------------
// PURPOSE:
//   - Insight generation endpoint
//   - Used by dashboard + budget details
// ===============================================

// routes/insightRoutes.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { generateInsights } from "../controllers/insightController.js";

const router = express.Router();

router.get("/:budgetId", auth, generateInsights);

export default router;
