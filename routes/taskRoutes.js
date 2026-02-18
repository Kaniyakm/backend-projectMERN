// =======================================================
// PHASE 2 — CORE BACKEND API
// SECTION 7 — TASK ROUTES
// PURPOSE:
// - Nested CRUD for Tasks
// - Must verify ownership of parent project
// - All routes protected by JWT
// =======================================================

import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------------------------------------
// CREATE TASK — POST /api/projects/:projectId/tasks
// Must verify user owns the parent project
// -------------------------------------------------------
router.post("/:projectId/tasks", auth, async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project || project.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    project: req.params.projectId
  });

  res.status(201).json(task);
});

// -------------------------------------------------------
// GET TASKS FOR PROJECT — GET /api/projects/:projectId/tasks
// Ownership check required
// -------------------------------------------------------
router.get("/:projectId/tasks", auth, async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project || project.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const tasks = await Task.find({ project: req.params.projectId });
  res.json(tasks);
});

// -------------------------------------------------------
// UPDATE TASK — PUT /api/tasks/:taskId
// Must verify ownership of parent project
// -------------------------------------------------------
router.put("/tasks/:taskId", auth, async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  // ✅ FIX: Check if task exists before accessing task.project
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const project = await Project.findById(task.project);

  if (!project || project.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  task.title = req.body.title ?? task.title;
  task.description = req.body.description ?? task.description;
  task.status = req.body.status ?? task.status;

  await task.save();
  res.json(task);
});

// -------------------------------------------------------
// DELETE TASK — DELETE /api/tasks/:taskId
// Must verify ownership of parent project
// -------------------------------------------------------
router.delete("/tasks/:taskId", auth, async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  // ✅ FIX: Check if task exists before accessing task.project
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const project = await Project.findById(task.project);

  if (!project || project.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await task.deleteOne();
  res.json({ message: "Task deleted" });
});

export default router;