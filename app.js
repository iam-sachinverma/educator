const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB)
  .then(() => console.log("Database connected ✅"))
  .catch((err) => console.log("Database connectivity problem occur", err));

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// app.use(express.static(`client/build`));
// app.get(`*`, (req, res) => {
// res.sendFile(path.join(__dirname + `/client/build/index.html`));
// });
app.use("/", express.static(path.join(__dirname, "/client/build")));

const authRoutes = require("./routes/auth");
const application = require("./routes/application");

app.use("/api", authRoutes);
app.use("/api", application);

//error handling for express-jwt authentication
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.log("We Are Here");
    res.status(401).send("invalid token...");
  }
});

app.listen(port, () => {
  console.log(`Backend is running at port number ${port} ✅`);
});
