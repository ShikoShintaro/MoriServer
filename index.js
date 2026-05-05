require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

const authRoute = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const chatRoute = require("./routes/chat");

app.use("/api/auth", authRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/chat", chatRoute);

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "MORI API is running"
  });
});

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

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});