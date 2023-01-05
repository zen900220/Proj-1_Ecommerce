const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  addToCart,
  updateCart,
  deleteFromCart,
  getCart,
  resetCart,
  getShippingInfo,
  setShippingInfo,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/logout").get(logoutUser);

router.route("/password/reset/:resetToken").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router
  .route("/me/cart")
  .get(isAuthenticatedUser, getCart)
  .post(isAuthenticatedUser, addToCart)
  .put(isAuthenticatedUser, updateCart)
  .delete(isAuthenticatedUser, deleteFromCart);

router.route("/me/cart/reset").get(isAuthenticatedUser, resetCart);

router
  .route("/me/shippingInfo")
  .get(isAuthenticatedUser, getShippingInfo)
  .put(isAuthenticatedUser, setShippingInfo);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);

module.exports = router;
