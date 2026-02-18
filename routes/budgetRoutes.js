// ===============================================
// PHASE 2 — ROUTES
// FILE: routes/budgetRoutes.js
// -----------------------------------------------
// PURPOSE:
//   - Route definitions for budget CRUD
//   - All routes protected by auth middleware
// ===============================================
// routes/budgetRoutes.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget
} from "../controllers/budgetController.js";

const router = express.Router();

router.post("/", auth, createBudget);
router.get("/", auth, getBudgets);
router.get("/:id", auth, getBudget);
router.put("/:id", auth, updateBudget);
router.delete("/:id", auth, deleteBudget);

export default router;
