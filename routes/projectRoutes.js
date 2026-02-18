import express from "express";
import Project from "../models/Project.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const project = await Project.create({
    name: req.body.title || req.body.name,
    amount: req.body.amount,
    category: req.body.category,
    user: req.user.id
  });
  res.status(201).json(project);
});

router.get("/", auth, async (req, res) => {
  const projects = await Project.find({ user: req.user.id });
  res.json(projects);
});

router.get("/:id", auth, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project || project.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  res.json(project);
});

router.put("/:id", auth, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project || project.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  project.name = req.body.title ?? project.name;
  project.amount = req.body.amount ?? project.amount;
  project.category = req.body.category ?? project.category;
  await project.save();
  res.json(project);
});

router.delete("/:id", auth, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project || project.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  await project.deleteOne();
  res.json({ message: "Project deleted" });
});

export default router;
