const mongoose = require("mongoose");

// Connect to MongoDB using the connection string stored in .env (MONGO_URI).
// Works with a local MongoDB server or a MongoDB Atlas cluster.
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set. Copy .env.example to .env and fill it in.");
  }
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

module.exports = connectDB;
