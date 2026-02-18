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
// controllers/budgetController.js
import Budget from "../models/Budget.js";
import { verifyBudgetOwner } from "../utils/ownershipHelpers.js";

// CREATE BUDGET
export const createBudget = async (req, res) => {
  try {
    const budget = await Budget.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL USER BUDGETS
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE BUDGET
export const getBudget = async (req, res) => {
  try {
    const check = await verifyBudgetOwner(req.params.id, req.user._id);
    if (!check.ok) return res.status(check.status).json({ message: check.message });
    res.json(check.budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE BUDGET
export const updateBudget = async (req, res) => {
  try {
    const check = await verifyBudgetOwner(req.params.id, req.user._id);
    if (!check.ok) return res.status(check.status).json({ message: check.message });

    Object.assign(check.budget, req.body);
    await check.budget.save();

    res.json(check.budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE BUDGET
export const deleteBudget = async (req, res) => {
  try {
    const check = await verifyBudgetOwner(req.params.id, req.user._id);
    if (!check.ok) return res.status(check.status).json({ message: check.message });

    await check.budget.deleteOne();
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
