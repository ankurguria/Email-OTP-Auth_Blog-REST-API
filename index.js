const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

//connect to database
require("./config/database");

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// app.get('/', (req, res) => res.send("Hello World"));

app.listen(8800, () => {
  console.log("BACKEND SERVER is running!");
});
