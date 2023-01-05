const app = require("./app.js");
const dbFuncs = require("./database/dbFunctions.js");
const cloudinary = require("cloudinary");

//ANCHOR Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server shutting down due to uncaught exceptions!");
  process.exit(1);
});

//ANCHOR Config
//in local development the env variables are stored in config.env and they are used by dotenv to configure process.env
//On hosting these variables will be set using the tools provided by the hosting service and config file wont be uploaded neither will it be tracked by git.
//dotenv only works when developing.
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/config.env",
  });
}

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
