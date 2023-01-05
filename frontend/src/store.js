import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/product/productsSlice";
import productReducer from "./slices/product/productSlice";
import errorAlertReducer from "./slices/utils/errorAlertSlice";
import userReducer from "./slices/user/userSlice";
import cartReducer from "./slices/shopping/cartSlice";
import shippingReducer from "./slices/shopping/shippingSlice";
import orderReducer from "./slices/shopping/orderSlice";
import adminProductsReducer from "./slices/admin/adminProductsSlice";
import adminOrderReducer from "./slices/admin/adminOrderSlice";
import adminUserReducer from "./slices/admin/adminUserSlice";

export default configureStore({
  reducer: {
    products: productsReducer, //the name of the key should be the same as the "name" property of the slice whose reducer is being passed.
    product: productReducer,
    errorAlert: errorAlertReducer,
    user: userReducer,
    cart: cartReducer,
    shipping: shippingReducer,
    order: orderReducer,
    adminProducts: adminProductsReducer,
    adminOrder: adminOrderReducer,
    adminUser: adminUserReducer,
  },
});
