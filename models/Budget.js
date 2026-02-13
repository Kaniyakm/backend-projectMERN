// ===============================================
// PHASE 2 — MODELS
// FILE: models/Budget.js
// -----------------------------------------------
// PURPOSE:
//   - Represents a monthly budget
//   - Enforces 50/30/20 allocation
//   - Linked to a specific user
//
// USED IN:
//   - Expense creation
//   - Insights engine
//   - Dashboard summaries
// ===============================================

const mongoose = require('mongoose');
const { Schema } = mongoose;

const budgetSchema = new Schema({
  // User who owns this budget
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Budget name (e.g., "March 2026")
  name: { type: String, required: true },

  // Monthly income
  income: { type: Number, required: true },

  // Default 50/30/20 rule
  needsPercent: { type: Number, default: 50 },
  wantsPercent: { type: Number, default: 30 },
  savingsPercent: { type: Number, default: 20 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Budget', budgetSchema);