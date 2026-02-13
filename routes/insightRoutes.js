// ===============================================
// PHASE 2 — ROUTES
// FILE: routes/insightRoutes.js
// -----------------------------------------------
// PURPOSE:
//   - Insight generation endpoint
//   - Used by dashboard + budget details
// ===============================================

const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { generateInsights } = require('../controllers/insightController');

router.get('/:budgetId', auth, generateInsights);

module.exports = router;
