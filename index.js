require("dotenv").config();

const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// IMPORT ROUTES SAFELY
const authRoute = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const chatRoute = require("./routes/chat");

// DEBUG CHECK (THIS WILL SAVE YOU HOURS)
if (!authRoute || !uploadRoute || !chatRoute) {
  throw new Error("One or more routes are undefined. Check exports in routes.");
}

app.use("/api/auth", authRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/chat", chatRoute);

// Mongo cache
let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

connectDB().catch(console.error);

module.exports = serverless(app);