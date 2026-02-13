// =======================================================
// PHASE 2 — CORE BACKEND API
// — TASK MODEL
// PURPOSE:
// - Define the structure of a Task document
// - Link each task to its parent project
// =======================================================

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    // Task title (required)
    title: { type: String, required: true },

    // Optional description
    description: { type: String },

    // Task status (default: "To Do")
    status: { type: String, default: "To Do" },

    // Reference to the parent Project
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);