require("dotenv").config();

const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/chat", require("./routes/chat"));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo Connected"))
    .catch(err => console.log(err));

module.exports = serverless(app);