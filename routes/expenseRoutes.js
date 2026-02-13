// ===============================================
// PHASE 2 — ROUTES
// FILE: routes/expenseRoutes.js
// -----------------------------------------------
// PURPOSE:
//   - Nested expense routes under budgets
//   - Direct expense update/delete routes
// ===============================================

const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

// Nested routes
router.post('/budgets/:budgetId/expenses', auth, createExpense);
router.get('/budgets/:budgetId/expenses', auth, getExpenses);

// Direct expense routes
router.put('/expenses/:expenseId', auth, updateExpense);
router.delete('/expenses/:expenseId', auth, deleteExpense);

module.exports = router;
