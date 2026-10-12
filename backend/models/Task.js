const mongoose = require("mongoose");

// Schema for a single to-do item
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose stores this in the "tasks" collection
module.exports = mongoose.model("Task", taskSchema);
