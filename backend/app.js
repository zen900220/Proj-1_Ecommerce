const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const app = express();

//ANCHOR Config
dotenv.config({
  path: "backend/config/config.env",
});

//Middleware to parse requests with application/json encoding
app.use(
  express.json({
    limit: "10mb", //default limit of express.json is less than 10mb
  })
);
//Middleware for cookie parsing
app.use(cookieParser());

//Router Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

//Middleware for error handling
app.use(errorHandler);

module.exports = app;
