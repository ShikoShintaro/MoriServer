require("dotenv").config();

const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/chat", require("./routes/chat"));

const globalCache = global._mongooseCache || (global._mongooseCache = {
  conn: null,
  promise: null,
});

async function connectDB() {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (err) {
    globalCache.promise = null;
    console.error("MongoDB connection error:", err);
    throw err;
  }

  return globalCache.conn;
}

connectDB();

module.exports = serverless(app);