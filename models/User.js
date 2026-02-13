// ===============================
// Phase 1-Authenticationmodels/User.js
// USER MODEL WITH:
// - Schema definition
// - Password hashing (pre-save hook)
// - Password comparison method
// ===============================

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// -------------------------------
// 1. Define the User Schema
// -------------------------------
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },

    // Email must be unique so no two users can register with the same email
    email: { type: String, required: true, unique: true },

    // Password will be hashed before saving
    password: { type: String, required: true }
  },
  { timestamps: true }
);

// -------------------------------
// 2. Pre-Save Hook: Hash Password
// -------------------------------
// This runs BEFORE saving a user.
// If the password was modified, hash it.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if unchanged

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// -------------------------------
// 3. Instance Method: Compare Passwords
// -------------------------------
// Used during login to compare the incoming password
// with the hashed password stored in the database.
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// -------------------------------
// 4. Export the Model
// -------------------------------
export default mongoose.model("User", userSchema);