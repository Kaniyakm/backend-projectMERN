# Budget Blueprint Backend - AI Coding Guide

## Architecture Overview

This is a Node.js/Express REST API for a personal budget management app following the **50/30/20 budgeting rule** (50% Needs, 30% Wants, 20% Savings). Built in phases for Per Scholas MERN curriculum.

**Core Entities:**
- **User** → **Budget** (1:many) → **Expense** (1:many)
- Budget represents a monthly budget with income and category percentages
- Expenses auto-categorize into Needs/Wants/Savings groups via keyword matching

**Data Flow:**
1. User authenticates → receives JWT token
2. Creates budget with income amount
3. Adds expenses → auto-categorized by title keywords
4. Views insights comparing actual spending vs 50/30/20 targets

## Critical Patterns

### Ownership Security Model
Every protected route enforces user-level ownership. Use centralized helpers from [utils/ownershipHelpers.js](utils/ownershipHelpers.js):

```javascript
// In controllers - always verify ownership before operations
const check = await verifyBudgetOwner(budgetId, req.user._id);
if (!check.ok) return res.status(check.status).json({ message: check.message });
// Proceed with check.budget
```

**Never** query budgets/expenses without including `user` field or calling ownership helpers. Security depends on this pattern.

### Auto-Categorization System
Expenses automatically assign `category` and `group` fields based on title keywords. The mapping lives in [utils/categoryMap.js](utils/categoryMap.js):

```javascript
// Example: "Starbucks coffee" → Category: "Dining", Group: "Wants"
const { category, group } = autoCategorize(req.body.title);
```

To add new categories, expand the categoryMap array with keyword rules. Common additions: utilities, healthcare, shopping.

### Authentication Flow
- JWT tokens issued on login/register with 7-day expiry
- [middleware/authMiddleware.js](middleware/authMiddleware.js) expects `Authorization: Bearer <token>` header
- Middleware attaches `req.user` object (excludes password field)
- All routes except `/api/auth/*` require auth middleware

## Project Structure

```
routes/        → Express route definitions (minimal logic)
controllers/   → Business logic, data validation, response formatting
models/        → Mongoose schemas with pre-save hooks
utils/         → Shared helpers (ownership, tokens, categorization)
middleware/    → Auth JWT verification
```

**Pattern:** Routes → Controller → Utils/Models. Keep route files thin, controllers handle orchestration.

## Development Commands

```bash
npm run dev    # Start with nodemon (auto-reload on file changes)
npm start      # Production start
```

**Environment Variables Required:**
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default 5000)

## Common Tasks

### Adding New Expense Categories
Edit [utils/categoryMap.js](utils/categoryMap.js), add entry with keywords array:
```javascript
{ keywords: ['doctor', 'pharmacy'], category: 'Healthcare', group: 'Needs' }
```

### Creating New Protected Endpoints
1. Add route in appropriate routes file with `auth` middleware
2. Create controller function
3. Use ownership helpers if accessing user-specific resources
4. Register route in [server.js](server.js)

### Modifying Budget Rules
Budget percentages stored per-budget in [models/Budget.js](models/Budget.js). Default is 50/30/20 but users can customize. Insights logic in [controllers/insightController.js](controllers/insightController.js) compares actual spending to these percentages.

## Code Conventions

- **File Headers:** Every file has block comments explaining phase, purpose, and usage
- **Controller Pattern:** Each CRUD operation is a separate exported function
- **Error Handling:** Controllers catch errors and return appropriate status codes (400/401/403/404/500)
- **Mongoose Queries:** Use async/await, not callbacks
- **JWT Secret:** Never hardcode - always use `process.env.JWT_SECRET`

## Phase-Based Development

This project was built incrementally:
- **Phase 1:** Auth system (User model, JWT, login/register)
- **Phase 2:** Budget/Expense CRUD, insights engine

When extending, maintain phase comments in file headers for educational clarity. This is a teaching project.
