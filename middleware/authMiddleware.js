// ===============================
// Phase 1-middleware/authMiddleware.js
// AUTH MIDDLEWARE WITH:
// - Token extraction
// - Token verification
// - Attaching decoded user to req.user
// ===============================

import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  // -------------------------------
  // 1. Check for Authorization header
  // -------------------------------
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // -------------------------------
  // 2. Extract the token
  // -------------------------------
  const token = header.split(" ")[1];

  try {
    // -------------------------------
    // 3. Verify the token
    // -------------------------------
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request
    req.user = decoded; // { id, username }

    next(); // Continue to protected route
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}