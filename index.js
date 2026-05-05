require("dotenv").config();

const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

const authRoute = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const chatRoute = require("./routes/chat");

if (!authRoute || !uploadRoute || !chatRoute) {
  throw new Error("One or more route imports failed. Check exports.");
}

app.use("/api/auth", authRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/chat", chatRoute);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

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

connectDB().catch((err) => {
  console.error("MongoDB connection error:", err);
});

module.exports = serverless(app);