// ===============================
// Phase 1-Authentication: routes/authRoutes.js
// AUTH ROUTES WITH:
// - Register new users
// - Login user in
// - Return JWT token + user info
// - Provide /me endpoint to get current user info
// ===============================

import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------------
//  REGISTER USER
// POST /api/users/register
// -------------------------------
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // 2. Create user (password auto-hashed)
    const user = await User.create({ username, email, password });

    // 3. Remove password before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------------
// LOGIN USER
// POST /api/users/login
// -------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    // 2. Compare passwords
    const valid = await user.isCorrectPassword(password);
    if (!valid) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    // 3. Create JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Remove password before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------------
// GET CURRENT USER
// GET /api/users/me
// -------------------------------
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

export default router;