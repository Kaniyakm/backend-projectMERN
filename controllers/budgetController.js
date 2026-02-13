// ===============================================
// PHASE 2 — CONTROLLERS
// FILE: controllers/budgetController.js
// -----------------------------------------------
// PURPOSE:
//   - Full CRUD for budgets
//   - Every route requires ownership checks
//
// ROUTES USING THIS CONTROLLER:
//   POST   /api/budgets
//   GET    /api/budgets
//   GET    /api/budgets/:id
//   PUT    /api/budgets/:id
//   DELETE /api/budgets/:id
// ===============================================

const Budget = require('../models/Budget');
const { verifyBudgetOwner } = require('../utils/ownershipHelpers');

// -----------------------------------------------
// CREATE BUDGET
// -----------------------------------------------
exports.createBudget = async (req, res) => {
  try {
    const budget = await Budget.create({
      ...req.body,
      user: req.user._id
    });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// GET ALL USER BUDGETS
// -----------------------------------------------
exports.getBudgets = async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id });
  res.json(budgets);
};

// -----------------------------------------------
// GET SINGLE BUDGET (OWNERSHIP REQUIRED)
// -----------------------------------------------
exports.getBudget = async (req, res) => {
  const check = await verifyBudgetOwner(req.params.id, req.user._id);
  if (!check.ok) return res.status(check.status).json({ message: check.message });
  res.json(check.budget);
};

// -----------------------------------------------
// UPDATE BUDGET
// -----------------------------------------------
exports.updateBudget = async (req, res) => {
  const check = await verifyBudgetOwner(req.params.id, req.user._id);
  if (!check.ok) return res.status(check.status).json({ message: check.message });

  Object.assign(check.budget, req.body);
  await check.budget.save();

  res.json(check.budget);
};

// -----------------------------------------------
// DELETE BUDGET
// -----------------------------------------------
exports.deleteBudget = async (req, res) => {
  const check = await verifyBudgetOwner(req.params.id, req.user._id);
  if (!check.ok) return res.status(check.status).json({ message: check.message });

  await check.budget.deleteOne();
  res.json({ message: 'Budget deleted' });
};
