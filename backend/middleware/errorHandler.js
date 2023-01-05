const CustomError = require("../utils/CustomError");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //ANCHOR Wrong MongoDB id
  if (err.name === "CastError") {
    err = new CustomError(`Invalid: ${err.path}`, 400);
  }

  //ANCHOR MongoDB key duplication error(trying to enter a doc with the same value for a unique key as another doc)
  if (err.code === 11000) {
    err = new CustomError(`Duplicate ${Object.keys(err.keyValue)} error!`, 400);
  }

  //ANCHOR Wrong JsonWebToken
  if (err.name === "JsonWebTokenError") {
    err = new CustomError("Json Web Token is invalid, Try again.", 400);
  }

  //ANCHOR JWT Expire error
  if (err.name === "TokenExpiredError") {
    err = new CustomError("Json Web Token has expired", 400);
  }

  res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    error: err.message,
    errorDetails: err.stack,
  });
};
