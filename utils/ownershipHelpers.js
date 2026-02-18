// ===============================================
// PHASE 2 — UTILS
// FILE: utils/ownershipHelpers.js
// -----------------------------------------------
// PURPOSE:
//   - Centralized ownership verification
//   - Ensures user can only access their own data
//
// USED IN:
//   - Budget controller
//   - Expense controller
//   - Insights controller
// ===============================================
// utils/ownershipHelpers.js
import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import mongoose from "mongoose";

// -----------------------------------------------
// Verify user owns the budget
// -----------------------------------------------
export const verifyBudgetOwner = async (budgetId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(budgetId))
    return { ok: false, status: 400, message: "Invalid budget ID" };

  const budget = await Budget.findById(budgetId);
  if (!budget) return { ok: false, status: 404, message: "Budget not found" };

  if (budget.user.toString() !== userId.toString())
    return { ok: false, status: 403, message: "Forbidden" };

  return { ok: true, budget };
};

// -----------------------------------------------
// Verify user owns the expense (via parent budget)
// -----------------------------------------------
export const verifyExpenseOwner = async (expenseId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(expenseId))
    return { ok: false, status: 400, message: "Invalid expense ID" };

  const expense = await Expense.findById(expenseId).populate("budget");
  if (!expense) return { ok: false, status: 404, message: "Expense not found" };

  if (!expense.budget)
    return { ok: false, status: 404, message: "Parent budget not found" };

  if (expense.budget.user.toString() !== userId.toString())
    return { ok: false, status: 403, message: "Forbidden" };

  return { ok: true, expense };
};
