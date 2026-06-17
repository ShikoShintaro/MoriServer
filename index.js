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
const notificationsRoute = require("./routes/notifications");
const userGetRoute = require("./routes/user-get");
const inboxRoute = require("./routes/inbox")

app.use("/api/users", userGetRoute);
app.use("/api/notifications", notificationsRoute);
app.use("/api/auth", authRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/chat", chatRoute);
app.use("/api/inbox", inboxRoute);

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "MORI API is running"
  });
});

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) return cached.conn;

  const uris = [
    process.env.MONGO_URI,
    process.env.MONGO_LAN
  ].filter(Boolean);

  if (!uris.length) {
    throw new Error("No MongoDB URI provided");
  }

  for (const uri of uris) {
    try {
      console.log(`Trying to connect ${uri}`);

      cached.conn = await mongoose.connect(uri, {
        bufferCommands : false,
        serverSelectionTimeoutMS : 3000
      });

      console.log(`Connected to MongoDB: ${uri}`);
      return cached.conn;

    } catch (error) {

      console.log(`Failed to onnect ${uri}`);

    }

  }

  throw new Error("All MongoDB connections failed");

}

connectDB().catch(console.error);

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});