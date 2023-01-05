const Order = require("../database/models/orderModel");
const Product = require("../database/models/productModel");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const CustomError = require("../utils/CustomError.js");

//ANCHOR Create an order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.create({
    ...req.body,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//ANCHOR Get a particular order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new CustomError("Order with given id doesnt exist!", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//ANCHOR Get all orders of logged in user
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//ANCHOR Get all orders(admin)
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = orders.reduce((accumulator, order) => {
    return accumulator + order.totalPrice;
  }, 0);

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

//ANCHOR Update Order Status(admin)
exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new CustomError("Order with given id doesnt exist!", 404));
  }

  if (/^delivered$/i.test(order.orderStatus)) {
    return next(new CustomError("You have already delivered this order.", 400));
  }

  //! Why? wont this change stock for each update of status!!!
  if (/^processing$/i.test(order.orderStatus)) {
    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (/^delivered$/i.test(req.body.status)) {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
  });
});

//ANCHOR updateStock Function
async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);

  product.stock -= quantity;

  await product.save();
}

//ANCHOR Delete an Order
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id); //findByIdAndDelete(id) is same as findOneAndDelete({_id:id})

  if (!order) {
    return next(new CustomError("Order with given id doesnt exist!", 404));
  }

  res.status(200).json({
    success: true,
    deleted: order,
  });
});
