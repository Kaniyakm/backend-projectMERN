// ===============================================
// PHASE 2 — CONTROLLERS
// FILE: controllers/insightController.js
// -----------------------------------------------
// PURPOSE:
//   - Generate smart spending insights
//   - Compare actual spending vs 50/30/20 rule
//   - Return advice messages for dashboard
//
// ROUTES USING THIS CONTROLLER:
//   GET /api/insights/:budgetId
// ===============================================

const Expense = require('../models/Expense');
const { verifyBudgetOwner } = require('../utils/ownershipHelpers');

// -----------------------------------------------
// GENERATE INSIGHTS
// -----------------------------------------------
exports.generateInsights = async (req, res) => {
  const { budgetId } = req.params;

  const check = await verifyBudgetOwner(budgetId, req.user._id);
  if (!check.ok) return res.status(check.status).json({ message: check.message });

  const budget = check.budget;

  // Aggregate totals by group
  const totals = await Expense.aggregate([
    { $match: { budget: budget._id, user: req.user._id } },
    { $group: { _id: '$group', total: { $sum: '$amount' } } }
  ]);

  const map = Object.fromEntries(totals.map(t => [t._id, t.total]));

  const income = budget.income;
  const needsUsed = ((map.Needs || 0) / income) * 100;
  const wantsUsed = ((map.Wants || 0) / income) * 100;
  const savingsUsed = ((map.Savings || 0) / income) * 100;

  const messages = [];

  if (needsUsed > budget.needsPercent)
    messages.push('Your essential spending is trending high. Review subscriptions or utilities.');

  if (wantsUsed > budget.wantsPercent)
    messages.push("You're close to overspending on wants. Consider pausing discretionary purchases.");

  if (savingsUsed < budget.savingsPercent / 2)
    messages.push('Try transferring a small fixed amount to savings this week.');

  res.json({
    usage: { needsUsed, wantsUsed, savingsUsed },
    messages
  });
};
