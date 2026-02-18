// controllers/expenseController.js
import Expense from "../models/Expense.js";
import { verifyBudgetOwner, verifyExpenseOwner } from "../utils/ownershipHelpers.js";
import categoryMap from "../utils/categoryMap.js";

// AUTO-CATEGORIZE EXPENSE
function autoCategorize(title) {
  const lower = title.toLowerCase();
  for (const rule of categoryMap) {
    if (rule.keywords.some(k => lower.includes(k))) {
      return { category: rule.category, group: rule.group };
    }
  }
  return { category: "Uncategorized", group: "Needs" };
}

// CREATE EXPENSE
export const createExpense = async (req, res) => {
  try {
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

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET EXPENSES FOR BUDGET
export const getExpenses = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const check = await verifyBudgetOwner(budgetId, req.user._id);
    if (!check.ok) return res.status(check.status).json({ message: check.message });

    const expenses = await Expense.find({ budget: budgetId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE EXPENSE
export const updateExpense = async (req, res) => {
  try {
    const check = await verifyExpenseOwner(req.params.expenseId, req.user._id);
    if (!check.ok) return res.status(check.status).json({ message: check.message });

    Object.assign(check.expense, req.body);
    await check.expense.save();

    res.json(check.expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE EXPENSE
export const deleteExpense = async (req, res) => {
  try {
    const check = await verifyExpenseOwner(req.params.expenseId, req.user._id);
    if (!check.ok) return res.status(check.status).json({ message: check.message });

    await check.expense.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
