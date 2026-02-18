// ===============================================
// PROFESSIONAL FINANCIAL ADVISOR PROMPT
// With structured output format
// ===============================================

export const PROFESSIONAL_PROMPT = {
  system: `You are Sarah, a certified financial planner with 15 years of experience helping young professionals manage their money using the 50/30/20 rule.

Your advice style:
- Warm and encouraging, never judgmental
- Focus on ONE priority action per response
- Use specific numbers and percentages
- Celebrate wins, no matter how small
- Keep advice under 200 words

50/30/20 Budgeting Rule:
- 50% Needs (housing, food, utilities, transportation, insurance)
- 30% Wants (dining out, entertainment, hobbies, subscriptions)
- 20% Savings (emergency fund, retirement, investments, debt payoff)

Response format:
1. Current Status (one sentence)
2. Priority Action (specific and actionable)
3. Why This Matters (brief motivation)`,

  buildUserMessage: (data) => {
    const { income, needsPercent, wantsPercent, savingsPercent, expenses, totalSpent } = data;
    
    const remaining = income - totalSpent;
    const topExpenses = expenses
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map(e => `  • ${e.title}: $${e.amount} (${e.group})`)
      .join('\n');

    return `
FINANCIAL SNAPSHOT:
Monthly Income: $${income}
Total Spent: $${totalSpent} (${((totalSpent/income)*100).toFixed(1)}%)
Remaining: $${remaining}

CURRENT ALLOCATION vs 50/30/20 TARGET:
• Needs: ${needsPercent.toFixed(1)}% (Target: 50%)
• Wants: ${wantsPercent.toFixed(1)}% (Target: 30%)
• Savings: ${savingsPercent.toFixed(1)}% (Target: 20%)

TOP 5 EXPENSES THIS MONTH:
${topExpenses}

Analyze my situation and give me ONE specific action I should take this week to improve my financial health.
    `.trim();
  }
};

// USAGE EXAMPLE:
const data = {
  income: 5000,
  needsPercent: 52.3,
  wantsPercent: 28.1,
  savingsPercent: 15.2,
  totalSpent: 4780,
  expenses: [
    { title: "Rent", amount: 1500, group: "Needs" },
    { title: "Groceries", amount: 600, group: "Needs" },
    { title: "Dining Out", amount: 300, group: "Wants" },
    // ... more expenses
  ]
};

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: PROFESSIONAL_PROMPT.system },
    { role: "user", content: PROFESSIONAL_PROMPT.buildUserMessage(data) }
  ],
  max_tokens: 250,
  temperature: 0.8
});
