require("dotenv").config();

const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    status: "OK",
    message: "MORI API is running"
  });
});

const authRoute = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const chatRoute = require("./routes/chat");

if (!authRoute || !uploadRoute || !chatRoute) {
  throw new Error("Route import failed. Check exports in /routes.");
}

app.use("/api/auth", authRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/chat", chatRoute);

app.use((req, res) => {
  return res.status(404).json({
    error: "Route not found"
  });
});

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

connectDB().catch((err) => {
  console.error("MongoDB connection error:", err);
});

module.exports = serverless(app);