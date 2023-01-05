const mongoose = require("mongoose");

//ANCHOR Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name!"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Enter description!"],
  },
  price: {
    type: Number,
    required: [true, "Enter price!"],
    maxLength: [8, "Price can't exceed 8 characters."],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Enter category!"],
  },
  stock: {
    type: Number,
    required: [true, "Enter product stocks!"],
    min: [0, "Stock can't be negative"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User", //user references the User model, i.e this field is given the id of an user from User model.
        //When populate is used on this path, mongoose replaces this key's value with the document from user model
        //with same id.
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  // user: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
