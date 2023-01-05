const catchAsyncError = require("../middleware/catchAsyncError.js");
const CustomError = require("../utils/CustomError.js");
const User = require("../database/models/userModel");
const Product = require("../database/models/productModel");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//ANCHOR Register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  let myCloud = {};
  if (req.body.avatar) {
    myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      height: 150,
      crop: "scale",
    });
  }

  const { name, email, password, role = "user" } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar: {
      public_id: myCloud.public_id ? myCloud.public_id : "",
      url: myCloud.secure_url ? myCloud.secure_url : "",
    },
  });

  sendToken(user, 201, res);
});

//ANCHOR Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //Checking if email and password are provided
  if (!email || !password) {
    return next(new CustomError("Please Enter Email and Password!", 401));
  }
  //Since password has select:false in the schema so its value wont be present in the returned doc.
  //To explicity force mongoose to send passwrd, we need select("password")
  //but that will only return password and remove the rest.
  //to make it ADD password along with other details instead of selecting only password,
  //we need to do select("+password")
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("Invalid Email or Password!", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new CustomError("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

//ANCHOR Logout User
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    success: true,
    message: "Successfully Logged Out",
  });
});

//ANCHOR Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new CustomError("Invalid Email", 404));
  }

  //Get reset password token
  const resetToken = user.getResetPasswordToken();
  //since we are manually(without using mongoose update) updating fields of the user doc in the above called func,
  //we gotta manually call .save to save the changes.
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Click here to reset your password:- \n\n ${resetPasswordUrl} \n\n\n 
  If you have not requested this email, then please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Change Password Email.",
      message,
    });
    res.status(200).json({
      success: true,
      message: `reset password url successfully sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new CustomError(error.message, 500));
  }
});

//ANCHOR Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //hashing the token recieved from params to find its match in the users collection.
  //this is done as the resetPasswordToken field of the required user has the token stored in hashed form.
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new CustomError("Reset password token is invalid or has expired.", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new CustomError("Passwords don't match!", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//ANCHOR Get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  //?Point to be noted, Mongodb stores ID as _id but user.id and user._id works as mongoose internally converts id to _id
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//ANCHOR Update User password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  //need passowrd also for user to use comparePassword
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new CustomError("Incorrect Old Password", 401));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new CustomError("New password and confirm password dont match!", 401)
    );
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//ANCHOR Update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newDetails = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar) {
    if (req.user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(req.user.avatar.public_id);
    }

    let myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      height: 150,
      crop: "scale",
    });

    newDetails.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  //If user doesnt provide name as he doesnt want to update it, then req.body.name data is undefined
  //as such the name key is undefined and so the mongoose update command doesnt try to update name
  //and ignores it.

  const user = await User.findByIdAndUpdate(req.user.id, newDetails, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//ANCHOR Get All Users(admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//ANCHOR Get details of a particular user(admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new CustomError(`User with id:${req.params.id} doesnt exist`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//ANCHOR Update User Role(admin)
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newDetails = {
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newDetails, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new CustomError("User does not exist!", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//ANCHOR Delete User(admin)
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError("User doesn not exist!", 404));
  }

  if (user.avatar.public_id) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  }

  await user.deleteOne({});

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

//ANCHOR Add To Cart
exports.addToCart = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const item = { prod_id: req.body.prod_id, quantity: req.body.quantity };

  const product = await Product.findById(item.prod_id);

  if (!product) {
    return next(new CustomError("Product with given ID does not exist !", 404));
  }

  let index = -1; //If index -1 then prod not present in cart else it is.

  index = user.cart.findIndex((content) => {
    return content.prod_id === item.prod_id;
  });

  if (index === -1) {
    user.cart.push({
      ...item,
      name: product.name,
      image: product.images[0].url,
      price: product.price,
      stock: product.stock,
    });
  } else {
    user.cart[index].quantity += item.quantity;
  }

  user.markModified("cart");

  user.save({ runValidators: true });

  res.status(200).json({
    success: true,
    cart: user.cart,
  });
});

//ANCHOR Update Cart
exports.updateCart = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const item = { prod_id: req.body.prod_id, quantity: req.body.quantity };

  let index = -1;
  index = user.cart.findIndex((content) => {
    return content.prod_id === item.prod_id;
  });

  if (index < 0) {
    return next(new CustomError("Error in updating item. Try Again!", 400));
  }

  user.cart[index].quantity = item.quantity;

  //For some reason mongoose cant realise tht i updated cart in the above statement and so save isnt working.
  //So manually marked cart as modified so tht save method saves the changes.
  user.markModified("cart");

  user.save({ runValidators: true });

  res.status(200).json({
    success: true,
    cart: user.cart,
  });
});

//ANCHOR Delete item from cart
exports.deleteFromCart = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const { id } = req.query;

  let index = user.cart.findIndex((content) => {
    return content.prod_id === id;
  });

  if (index < 0) {
    return next(new CustomError("Error in deleting item. Try Again!", 400));
  }

  user.cart.splice(index, 1);

  user.save({ runValidators: true });

  res.status(200).json({
    success: true,
    cart: user.cart,
  });
});

//ANCHOR Get Cart
exports.getCart = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    cart: user.cart,
  });
});

//Reset Cart
exports.resetCart = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  user.cart = [];

  user.markModified("cart");
  await user.save({ runValidators: true });

  res.status(200).json({
    success: true,
  });
});

//ANCHOR Get Shipping details
exports.getShippingInfo = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    shippingInfo: user.shippingInfo,
  });
});

//ANCHOR Set Shipping details
exports.setShippingInfo = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  try {
    user.shippingInfo = {
      ...user.shippingInfo,
      ...req.body,
    };

    user.save({ runValidators: true });
  } catch (error) {
    return next(new CustomError("Error in updating Info!", 404));
  }

  res.status(200).json({
    success: true,
    shippingInfo: user.shippingInfo,
  });
});
