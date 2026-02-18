// controllers/insightController.js
import Expense from "../models/Expense.js";
import { verifyBudgetOwner } from "../utils/ownershipHelpers.js";

export const generateInsights = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const check = await verifyBudgetOwner(budgetId, req.user._id);
    if (!check.ok) return res.status(check.status).json({ message: check.message });

    const budget = check.budget;

    // Guard against division by zero
    if (!budget.income || budget.income <= 0) {
      return res.status(400).json({ message: "Budget income must be greater than zero" });
    }

    const totals = await Expense.aggregate([
      { $match: { budget: budget._id, user: req.user._id } },
      { $group: { _id: "$group", total: { $sum: "$amount" } } }
    ]);

    const map = Object.fromEntries(totals.map(t => [t._id, t.total]));

    const income = budget.income;
    const needsUsed  = ((map.Needs   || 0) / income) * 100;
    const wantsUsed  = ((map.Wants   || 0) / income) * 100;
    const savingsUsed = ((map.Savings || 0) / income) * 100;

    const messages = [];

    if (needsUsed > budget.needsPercent)
      messages.push("Your essential spending is trending high. Review subscriptions or utilities.");

    if (wantsUsed > budget.wantsPercent)
      messages.push("You're close to overspending on wants. Consider pausing discretionary purchases.");

    if (savingsUsed < budget.savingsPercent / 2)
      messages.push("Try transferring a small fixed amount to savings this week.");

    // Positive feedback if everything is on track
    if (messages.length === 0)
      messages.push("Great job! Your spending is well within your 50/30/20 targets.");

    res.json({
      usage: {
        needsUsed:   parseFloat(needsUsed.toFixed(1)),
        wantsUsed:   parseFloat(wantsUsed.toFixed(1)),
        savingsUsed: parseFloat(savingsUsed.toFixed(1))
      },
      messages
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
