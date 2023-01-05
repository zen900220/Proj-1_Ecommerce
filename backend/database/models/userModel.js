const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//ANCHOR User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name!"],
    maxlength: [40, "Name can't exceed 40 characters!"],
    minLength: [4, "Name should have atleast 4 characters!"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid email!"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password!"],
    minLength: [8, "Password should have atleast 8 characters!"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: Array,
    default: [],
  },
  shippingInfo: {
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    pincode: {
      type: Number,
      default: null,
    },
    phoneNo: {
      type: Number,
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//ANCHOR Generate JWT for User when this func is called.
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//ANCHOR Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  //bcrypt.compare(unhashed string, hash)
  return await bcrypt.compare(enteredPassword, this.password);
};

//ANCHOR Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  //Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  //hashing and updating resetPasswordToken of user
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //Setting token expire time
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

//ANCHOR Hash password before saving doc if the password has been modified(newly created/modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);
