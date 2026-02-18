# Phase 1 Planning Notes
- API Entities:
  - User
  - Budget
  - Expense
  - Insights (rule-based)
- Authentication:
  - JWT-based login/register
  - Protected routes
- Ownership Rules:
  - User can only access their own budgets
  - User can only access expenses inside their budgets
- Endpoints to build in Phase 2:
  - /api/budgets
  - /api/expenses
  - /api/insights


  # Balance Blueprint — Backend

#### A RESTful Express API backend for the Balance Blueprint personal finance application.

## Description

Balance Blueprint backend is a Node.js/Express REST API that handles user authentication, budget management, expense tracking, and AI-powered financial insights. It connects to a MongoDB Atlas database and is deployed as a Web Service on Render.

## Table of Contents

* [Technologies Used](#technologiesused)
* [Features](#features)
* [API Endpoints](#apiendpoints)
* [Environment Variables](#environment)
* [Project Next Steps](#nextsteps)
* [Deployed App](#deployment)
* [About the Author](#author)

## <a name="technologiesused"></a>Technologies Used

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* JSON Web Tokens (JWT)
* bcryptjs
* Helmet
* CORS
* Express Rate Limit
* Express Validator
* OpenAI API
* Dotenv
* Nodemon

## <a name="features"></a>Features

* User registration and login with bcrypt password hashing
* JWT-based authentication and protected routes
* Full CRUD for budgets with 50/30/20 rule enforcement
* Nested expense routes under parent budgets
* Auto-categorization of expenses using keyword mapping
* Ownership verification on all protected resources
* AI-powered financial insights using OpenAI integration
* Project and task management with nested routes
* Security hardening with Helmet and rate limiting
* Global error handling and input validation

## API Endpoints

**Auth**
* `POST /api/auth/register` — Register new user
* `POST /api/auth/login` — Login user
* `GET /api/auth/me` — Get current user

**Budgets**
* `POST /api/budgets` — Create budget
* `GET /api/budgets` — Get all user budgets
* `GET /api/budgets/:id` — Get single budget
* `PUT /api/budgets/:id` — Update budget
* `DELETE /api/budgets/:id` — Delete budget

**Expenses**
* `POST /api/budgets/:budgetId/expenses` — Create expense
* `GET /api/budgets/:budgetId/expenses` — Get expenses for budget
* `PUT /api/expenses/:expenseId` — Update expense
* `DELETE /api/expenses/:expenseId` — Delete expense

**Insights**
* `GET /api/insights/:budgetId` — Generate AI spending insights

**Projects**
* `POST /api/projects` — Create project
* `GET /api/projects` — Get all user projects
* `PUT /api/projects/:id` — Update project
* `DELETE /api/projects/:id` — Delete project

**Tasks**
* `POST /api/projects/:projectId/tasks` — Create task
* `GET /api/projects/:projectId/tasks` — Get tasks for project
* `PUT /api/tasks/:taskId` — Update task
* `DELETE /api/tasks/:taskId` — Delete task

## Environment Variables

Create a `.env` file in the root of the backend directory:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-frontend-url.onrender.com
NODE_ENV=production
PORT=5000
```

## Project Next Steps

* Add budget history and monthly rollover logic
* Implement recurring expense scheduling
* Add admin dashboard and user management
* Expand AI insights with full OpenAI GPT integration
* Add unit and integration tests with Jest

## "deployment"><

[Render Web Service](https://backend-projectmern.onrender.com)

* Backend Repository: [GitHub](https://github.com/Kaniyakm/backend-projectMERN)

## Author
Kaniya Martin 

A full-stack developer focused on building practical applications that solve real-world problems. Passionate about clean architecture, secure APIs, and using technology to make personal finance more accessible.