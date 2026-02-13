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

const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// -----------------------------------------------
// Verify user owns the budget
// -----------------------------------------------
exports.verifyBudgetOwner = async (budgetId, userId) => {
  const budget = await Budget.findById(budgetId);
  if (!budget) return { ok: false, status: 404, message: 'Budget not found' };

  if (budget.user.toString() !== userId.toString())
    return { ok: false, status: 403, message: 'Forbidden' };

  return { ok: true, budget };
};

// -----------------------------------------------
// Verify user owns the expense (via parent budget)
// -----------------------------------------------
exports.verifyExpenseOwner = async (expenseId, userId) => {
  const expense = await Expense.findById(expenseId).populate('budget');
  if (!expense) return { ok: false, status: 404, message: 'Expense not found' };

  if (expense.budget.user.toString() !== userId.toString())
    return { ok: false, status: 403, message: 'Forbidden' };

  return { ok: true, expense };
};
