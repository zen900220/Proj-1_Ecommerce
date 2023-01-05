const app = require("./app.js");
const dotenv = require("dotenv");
const dbFuncs = require("./database/dbFunctions.js");
const cloudinary = require("cloudinary");

//ANCHOR Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server shutting down due to uncaught exceptions!");
  process.exit(1);
});

//ANCHOR Config
dotenv.config({
  path: "backend/config/config.env",
});

//ANCHOR Connecting to DB
dbFuncs.connect();

//ANCHOR Connecting to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//ANCHOR Starting the server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server working on Port: ${process.env.PORT}`); // use backticks(``) not quotes('')!
});

//ANCHOR Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection!");
  server.close(() => {
    process.exit(1);
  });
});
