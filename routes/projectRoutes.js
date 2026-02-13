// =======================================================
// PHASE 2 — CORE BACKEND API
// — PROJECT ROUTES
// PURPOSE:
// - Full CRUD for Projects
// - All routes protected by JWT
// - Every action requires ownership verification
// =======================================================

import express from "express";
import Project from "../models/Project.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------------------------------------
// CREATE PROJECT — POST /api/projects
// Requires: Logged-in user
// -------------------------------------------------------
router.post("/", auth, async (req, res) => {
  const project = await Project.create({
    name: req.body.name,
    description: req.body.description,
    user: req.user.id // owner from JWT
  });

  res.status(201).json(project);
});

// -------------------------------------------------------
// GET ALL PROJECTS — GET /api/projects
// Returns only projects owned by logged-in user
// -------------------------------------------------------
router.get("/", auth, async (req, res) => {
  const projects = await Project.find({ user: req.user.id });
  res.json(projects);
});

// -------------------------------------------------------
// GET SINGLE PROJECT — GET /api/projects/:id
// Ownership check required
// -------------------------------------------------------
router.get("/:id", auth, async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project || project.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(project);
});

// -------------------------------------------------------
// UPDATE PROJECT — PUT /api/projects/:id
// Ownership check required
// -------------------------------------------------------
router.put("/:id", auth, async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project || project.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  project.name = req.body.name ?? project.name;
  project.description = req.body.description ?? project.description;

  await project.save();
  res.json(project);
});

// -------------------------------------------------------
// DELETE PROJECT — DELETE /api/projects/:id
// Ownership check required
// -------------------------------------------------------
router.delete("/:id", auth, async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project || project.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await project.deleteOne();
  res.json({ message: "Project deleted" });
});

export default router;