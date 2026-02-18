/*****************************************************************************************
 FILE: routes/insightRoutes.js
 PURPOSE:
 - Provides two insight routes:
   1. GET  /api/insights/:budgetId  (existing per-budget insight generator)
   2. POST /api/insights/advice     (new: real AI advice for dashboard)
*****************************************************************************************/
import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  generateInsights,
  getAIAdvice,
} from "../controllers/insightController.js";

const router = express.Router();

router.get("/:budgetId", auth, generateInsights);
router.post("/advice", auth, getAIAdvice);

export default router;
