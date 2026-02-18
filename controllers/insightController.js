/*****************************************************************************************
 FILE: controllers/insightController.js
 PURPOSE:
 - generateInsights(): analytics for a specific budget (existing feature)
 - getAIAdvice(): backend OpenAI integration for dashboard AI Advice button
*****************************************************************************************/

import Expense from "../models/Expense.js";
import { verifyBudgetOwner } from "../utils/ownershipHelpers.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* -------------------------------------------------------------------------- */
/* EXISTING: Budget-Based Insight Generator                                   */
/* -------------------------------------------------------------------------- */
export const generateInsights = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const check = await verifyBudgetOwner(budgetId, req.user._id);
    if (!check.ok)
      return res.status(check.status).json({ message: check.message });

    const budget = check.budget;
    if (!budget.income || budget.income <= 0) {
      return res
        .status(400)
        .json({ message: "Budget income must be greater than zero" });
    }

    const totals = await Expense.aggregate([
      { $match: { budget: budget._id, user: req.user._id } },
      { $group: { _id: "$group", total: { $sum: "$amount" } } },
    ]);

    const map = Object.fromEntries(totals.map((t) => [t._id, t.total]));
    const income = budget.income;
    const needsUsed = ((map.Needs || 0) / income) * 100;
    const wantsUsed = ((map.Wants || 0) / income) * 100;
    const savingsUsed = ((map.Savings || 0) / income) * 100;

    const messages = [];
    if (needsUsed > budget.needsPercent)
      messages.push(
        "Your essential spending is trending high. Review subscriptions or utilities."
      );

    if (wantsUsed > budget.wantsPercent)
      messages.push(
        "You're close to overspending on wants. Consider pausing discretionary purchases."
      );

    if (savingsUsed < budget.savingsPercent / 2)
      messages.push("Try transferring a small fixed amount to savings this week.");

    if (messages.length === 0)
      messages.push("Great job! Your spending is well within your 50/30/20 targets.");

    res.json({
      usage: {
        needsUsed: parseFloat(needsUsed.toFixed(1)),
        wantsUsed: parseFloat(wantsUsed.toFixed(1)),
        savingsUsed: parseFloat(savingsUsed.toFixed(1)),
      },
      messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* NEW: Global AI Advice for Dashboard                                        */
/* -------------------------------------------------------------------------- */
export const getAIAdvice = async (req, res) => {
  try {
    const { income, projects } = req.body;

    if (!projects || projects.length === 0)
      return res.status(400).json({ message: "No project data provided" });

    const summary = projects
      .map((p) => `${p.name}: $${p.amount} (${p.category})`)
      .join(", ");

    const prompt = `
      You are a friendly financial advisor. 
      User's income: $${income}.
      Projects/spendings: ${summary}.
      Provide concise personalized financial advice following the 50/30/20 rule.
    `;

    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    const advice =
      result?.choices?.[0]?.message?.content?.trim() ||
      "Unable to generate advice at this moment.";

    res.json({ advice });
  } catch (err) {
    console.error("AI advice error:", err);
    res.status(500).json({ message: "AI advice failed" });
  }
};
