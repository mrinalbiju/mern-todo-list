require("dotenv").config(); // loads variables from .env into process.env
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 5050;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Allow requests only from the React frontend, not from every origin
app.use(cors({ origin: CLIENT_URL }));

// Parse JSON request bodies so req.body is available in the routes
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.json({ message: "To-Do API is running" });
});

// All task routes live under /api/tasks
app.use("/api/tasks", taskRoutes);

// Anything else is an unknown route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Malformed JSON bodies end up here; reply with 400 instead of an HTML error page
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

// Connect to the database first, then start accepting requests
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
      console.log(`CORS allowed origin: ${CLIENT_URL}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
