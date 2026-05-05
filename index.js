require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const auth = require("./routes/auth");
const upload = require("./routes/upload");
const chat = require("./routes/chat");

console.log("AUTH TYPE:", typeof auth);
console.log("UPLOAD TYPE:", typeof upload);
console.log("CHAT TYPE:", typeof chat);

app.use("/api/auth", auth);
app.use("/api/upload", upload);
app.use("/api/chat", chat);

app.use(cors());
app.use(express.json());

const auth = require("./routes/auth");
const upload = require("./routes/upload");
const chat = require("./routes/chat");

console.log("AUTH TYPE:", typeof auth);
console.log("UPLOAD TYPE:", typeof upload);
console.log("CHAT TYPE:", typeof chat);

app.use("/api/auth", auth);
app.use("/api/upload", upload);
app.use("/api/chat", chat);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo Connected"))
    .catch(err => console.log(err));


module.exports = app;