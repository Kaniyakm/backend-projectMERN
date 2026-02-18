// ===============================
// Phase 1-Authentication: routes/authRoutes.js
// AUTH ROUTES WITH:
// - Register new users
// - Login user in
// - Return JWT token + user info
// - Provide /me endpoint to get current user info
// - Input validation with express-validator
// ===============================

import express from "express";
import { body, validationResult } from "express-validator";
import { register, login, me } from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------------
// VALIDATION MIDDLEWARE
// -------------------------------
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// -------------------------------
// REGISTER USER
// POST /api/auth/register
// -------------------------------
router.post(
  "/register",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validate,
  register
);

// -------------------------------
// LOGIN USER
// POST /api/auth/login
// -------------------------------
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validate,
  login
);

// -------------------------------
// GET CURRENT USER
// GET /api/auth/me
// -------------------------------
router.get("/me", auth, me);

export default router;
