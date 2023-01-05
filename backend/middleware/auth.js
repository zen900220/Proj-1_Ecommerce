const CustomError = require("../utils/CustomError");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../database/models/userModel");

//ANCHOR check if user is logged in or not and allow further access only if logged in.
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new CustomError("Please login to access this resource!", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);
  next();
});

//ANCHOR check if the "role" of the logged in user is present in the list of allowed roles
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError(
          `${req.user.role} not allowed to access this feature`,
          401
        )
      );
    }
    next();
  };
};
