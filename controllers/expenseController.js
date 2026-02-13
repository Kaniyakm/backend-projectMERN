// ===============================================
// PHASE 2 — CONTROLLERS
// FILE: controllers/expenseController.js
// -----------------------------------------------
// PURPOSE:
//   - CRUD for expenses
//   - Auto-categorization
//   - Ownership checks via parent budget
//
// ROUTES USING THIS CONTROLLER:
//   POST   /api/budgets/:budgetId/expenses
//   GET    /api/budgets/:budgetId/expenses
//   PUT    /api/expenses/:expenseId
//   DELETE /api/expenses/:expenseId
// ===============================================

const Expense = require('../models/Expense');
const { verifyBudgetOwner, verifyExpenseOwner } = require('../utils/ownershipHelpers');
const categoryMap = require('../utils/categoryMap');

// -----------------------------------------------
// AUTO-CATEGORIZE EXPENSE
// -----------------------------------------------
function autoCategorize(title) {
  const lower = title.toLowerCase();
  for (const rule of categoryMap) {
    if (rule.keywords.some(k => lower.includes(k))) {
      return { category: rule.category, group: rule.group };
    }
  }
  return { category: 'Uncategorized', group: 'Needs' };
}

// -----------------------------------------------
// CREATE EXPENSE
// -----------------------------------------------
exports.createExpense = async (req, res) => {
  const { budgetId } = req.params;

  const check = await verifyBudgetOwner(budgetId, req.user._id);
  if (!check.ok) return res.status(check.status).json({ message: check.message });

  const { category, group } = autoCategorize(req.body.title);

  const expense = await Expense.create({
    ...req.body,
    user: req.user._id,
    budget: budgetId,
    category,
    group
  });

  res.json(expense);
};

// -----------------------------------------------
// GET EXPENSES FOR BUDGET
// -----------------------------------------------
exports.getExpenses = async (req, res) => {
  const { budgetId } = req.params;

  const check = await verifyBudgetOwner(budgetId, req.user._id);
  if (!check.ok) return res.status(check.status).json({ message: check.message });

  const expenses = await Expense.find({ budget: budgetId });
  res.json(expenses);
};

// -----------------------------------------------
// UPDATE EXPENSE
// -----------------------------------------------
exports.updateExpense = async (req, res) => {
  const check = await verifyExpenseOwner(req.params.expenseId, req.user._id);
  if (!check.ok) return res.status(check.status).json({ message: check.message });

  Object.assign(check.expense, req.body);
  await check.expense.save();

  res.json(check.expense);
};

// -----------------------------------------------
// DELETE EXPENSE
// -----------------------------------------------
exports.deleteExpense = async (req, res) => {
  const check = await verifyExpenseOwner(req.params.expenseId, req.user._id);
  if (!check.ok) return res.status(check.status).json({ message: check.message });

  await check.expense.deleteOne();
  res.json({ message: 'Expense deleted' });
};
