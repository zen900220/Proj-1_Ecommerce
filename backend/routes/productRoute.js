const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  createOrUpdateReview,
  getAllReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController.js");

const {
  isAuthenticatedUser,
  authorizedRoles,
} = require("../middleware/auth.js");

const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAdminProducts);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizedRoles("admin"), createProduct);

router.route("/product/:id").get(getProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);

router.route("/review").put(isAuthenticatedUser, createOrUpdateReview);

router
  .route("/reviews")
  .get(getAllReviews)
  .delete(isAuthenticatedUser, deleteReview);
module.exports = router;
