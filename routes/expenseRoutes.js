// ===============================================
// PHASE 2 — ROUTES
// FILE: routes/expenseRoutes.js
// -----------------------------------------------
// PURPOSE:
//   - Nested expense routes under budgets
//   - Direct expense update/delete routes
// ===============================================
// routes/expenseRoutes.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} from "../controllers/expenseController.js";

const router = express.Router();

// Nested routes
router.post("/budgets/:budgetId/expenses", auth, createExpense);
router.get("/budgets/:budgetId/expenses", auth, getExpenses);

// Direct expense routes
router.put("/expenses/:expenseId",    auth, updateExpense);
router.delete("/expenses/:expenseId", auth, deleteExpense);

export default router;
