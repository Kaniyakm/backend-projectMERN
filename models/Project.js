// =======================================================
// PHASE 2 — CORE BACKEND API
//  — PROJECT MODEL
// PURPOSE:
// - Define the structure of a Project document
// - Link each project to the user who owns it
// =======================================================

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // Project title (required)
    name: { type: String, required: true },

    // Optional description
    description: { type: String },

    // Reference to the User who owns this project
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);