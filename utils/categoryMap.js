// ===============================================
// PHASE 2 — UTILS
// FILE: utils/categoryMap.js
// -----------------------------------------------
// PURPOSE:
//   - Keyword → Category → Group mapping
//   - Used to auto-categorize expenses
//
// NOTE:
//   - You can expand this list anytime
// ===============================================
// utils/categoryMap.js
const categoryMap = [
  { keywords: ["rent", "mortgage"],              category: "Housing",          group: "Needs"   },
  { keywords: ["grocery", "groceries", "food"],  category: "Groceries",        group: "Needs"   },
  { keywords: ["uber", "lyft", "gas"],           category: "Transportation",   group: "Needs"   },
  { keywords: ["netflix", "spotify", "hulu"],    category: "Entertainment",    group: "Wants"   },
  { keywords: ["starbucks", "coffee"],           category: "Dining",           group: "Wants"   },
  { keywords: ["transfer", "savings"],           category: "Savings Transfer", group: "Savings" }
];

export default categoryMap;
