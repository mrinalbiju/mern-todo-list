const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

// Convert any incoming title to a string and trim surrounding spaces.
// Returns "" for missing values so the caller can reject it with a 400.
function cleanTitle(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

// Invalid ObjectIds can never match a task, so treat them as "not found"
// instead of letting Mongoose throw a CastError (which would become a 500).
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/tasks — fetch all tasks, newest first
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch tasks" });
  }
});

// POST /api/tasks — add a new task
// Body: { "title": "Buy milk" }
router.post("/", async (req, res) => {
  const title = cleanTitle(req.body.title);
  if (!title) {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  try {
    const task = await Task.create({ title });
    res.status(201).json(task); // 201 Created
  } catch (err) {
    res.status(500).json({ message: "Could not create task" });
  }
});

// PUT /api/tasks/:id — update a task
// Body can contain { "completed": true } and/or { "title": "New title" }
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updates = {};

  // Only validate the title if the client is trying to change it
  if (req.body.title !== undefined) {
    const title = cleanTitle(req.body.title);
    if (!title) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }
    updates.title = title;
  }

  if (req.body.completed !== undefined) {
    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({ message: "completed must be true or false" });
    }
    updates.completed = req.body.completed;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  try {
    // { new: true } returns the updated document instead of the old one
    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Could not update task" });
  }
});

// DELETE /api/tasks/:id — delete a task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(404).json({ message: "Task not found" });
  }

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted", id: task._id });
  } catch (err) {
    res.status(500).json({ message: "Could not delete task" });
  }
});

module.exports = router;
