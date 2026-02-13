// ===============================================
// PHASE 2 — MODELS
// FILE: models/Expense.js
// -----------------------------------------------
// PURPOSE:
//   - Represents a single expense
//   - Linked to a budget + user
//   - Auto-categorized using categoryMap.js
//
// USED IN:
//   - Budget details page
//   - Insights engine
// ===============================================

const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
  // User who owns this expense
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Parent budget
  budget: { type: Schema.Types.ObjectId, ref: 'Budget', required: true },

  // Expense details
  title: { type: String, required: true },
  amount: { type: Number, required: true },

  // Auto-filled by categoryMap
  category: { type: String },
  group: { type: String, enum: ['Needs', 'Wants', 'Savings'] },

  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);