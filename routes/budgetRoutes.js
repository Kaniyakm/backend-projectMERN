// ===============================================
// PHASE 2 — ROUTES
// FILE: routes/budgetRoutes.js
// -----------------------------------------------
// PURPOSE:
//   - Route definitions for budget CRUD
//   - All routes protected by auth middleware
// ===============================================

const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget
} = require('../controllers/budgetController');

router.post('/', auth, createBudget);
router.get('/', auth, getBudgets);
router.get('/:id', auth, getBudget);
router.put('/:id', auth, updateBudget);
router.delete('/:id', auth, deleteBudget);

module.exports = router;
