const Product = require("../database/models/productModel.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const ApiFeatures = require("../utils/apiFeatures.js");
const CustomError = require("../utils/CustomError.js");
const cloudinary = require("cloudinary");

//ANCHOR Show all products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultsPerPage = 8;
  //parameters are considered part of the url path but queries are not.
  //req.query is a json containing all the key value pairs.
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  //A mongoose query is only executed when used with await or a callback is passed and mongoose doesnt allow executing same query twice.
  //Here the query contains Product.find().find({...keyword}).find({...queryObjCopy}) and we execute it using await but then later on after doin
  //pagination we again execute query which contains the prev part along with .limit(resultsPerPage).skip(skip_val). Due to this mongoose throws
  //query already executed error. To avoid it we need to use .clone() from the second executing onwards.
  let products = await apiFeatures.query;

  let productCount = products.length;

  apiFeatures.pagination(resultsPerPage);

  products = await apiFeatures.query.clone();

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultsPerPage,
  });
});

//ANCHOR Get All Products -- Admin only
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

//ANCHOR Create Product -- Admin only
exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (req.body.images.length) {
    for (let i = 0; i < req.body.images.length; i++) {
      const myCloud = await cloudinary.v2.uploader.upload(req.body.images[i], {
        folder: "product_images",
      });
      images.push({
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      });
    }
  }

  req.body.user = req.user.id;

  const product = await Product.create({
    ...req.body,
    images,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//ANCHOR Update Product -- Admin only
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("Product not found", 404)); //next(err) --> call default or custom error handler to deal with it.
  }

  if (req.body.images.length) {
    console.log(2);
    //Deleteing existing images
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    console.log(3);
    //Adding New Images
    let images = [];
    for (let i = 0; i < req.body.images.length; i++) {
      const myCloud = await cloudinary.v2.uploader.upload(req.body.images[i], {
        folder: "product_images",
      });

      images.push({
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      });
    }
    console.log(1);
    req.body.images = images;
  } else {
    delete req.body.images;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//ANCHOR Delete Product -- Admin only
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  product = await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    deleted: product,
  });
});

//ANCHOR Get single product
exports.getProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//ANCHOR Create New Review or Update Existing
exports.createOrUpdateReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.body.productId);

  if (!product) {
    return next(new CustomError("Product with given id doesn't exist!", 404));
  }

  const { rating, comment } = req.body;

  const review = {
    user: req.user.id,
    name: req.user.name,
    rating,
    comment,
  };

  //Go through each review and if a review exists whose user matches id of logged in user
  //then isReviewed is true and also store the index of that review
  //If no match found then default value of isReviewed and index is used.

  //forEach cant be used as it cant iterate over an array with undefined value.

  let isReviewed = false,
    index = -1;

  for (let i = 0; i < product.reviews.length; i++) {
    if (product.reviews[i].user.toString() === req.user.id.toString()) {
      isReviewed = true;
      index = i;
      break;
    }
  }

  if (isReviewed) {
    product.reviews[index].rating = rating;
    product.reviews[index].comment = comment;
  } else {
    product.reviews.push(review);
    product.numOfReviews += 1;
  }

  //Add the ratings of all the reviews in the accumulator and then divide it by number of reviews
  //the second parameter of reduce is initialValue of accumulator as in its absence accu will use the value of index 0.
  //in this case accumulator's initial value would have the frst review obj and not its rating, which is not desired.
  //so explictly its ini val is set to 0
  product.rating =
    product.reviews.reduce((accumulator, rev) => {
      return accumulator + rev.rating;
    }, 0) / product.numOfReviews;

  await product.save();

  res.status(200).json({
    success: true,
    product,
  });
});

//ANCHOR Get all reviews of a product
exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new CustomError("Product with given id doesn't exist", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//ANCHOR Delete review of a product
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(
      new CustomError("The product with given id doesn't exist", 404)
    );
  }

  let reviewPresent = 0, //To check if a review with given id was indeed present in the review array or not.
    deletedRating = 0; //Rating of deleted review

  for (let i = 0; i < product.reviews.length; i++) {
    if (product.reviews[i]._id.toString() === req.query.id.toString()) {
      reviewPresent = 1;
      deletedRating = product.reviews[i].rating;
      //splice modifies the original array and returns the deleted elements.
      //slice creates a new array with the selected range of elements and returns that.
      product.reviews.splice(i, 1);
      break;
    }
  }

  if (!reviewPresent) {
    return next(new CustomError("Review with given id not present!", 404));
  }

  product.numOfReviews -= 1;

  if (product.numOfReviews === 0) {
    product.rating = 0;
  } else {
    product.rating =
      (product.rating * (product.numOfReviews + 1) - deletedRating) /
      product.numOfReviews;
  }

  await product.save();

  res.status(200).json({
    success: true,
  });
});
