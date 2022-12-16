require('dotenv').config()
const express = require("express");
const route = require("./routes/route.js");
const mongoose  = require("mongoose");
const app = express();
const cors = require("cors")

app.use(express.json());

app.use(cors())

mongoose
  .connect(
    process.env.DATABASE,
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("Connected with MongoDB"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT , function () {
  console.log("Express app running on port " + (process.env.PORT));
});