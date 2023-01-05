import React from "react";
import { useSelector, useDispatch } from "react-redux";
import WebFont from "webfontloader";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import ErrorPopup from "./components/ErrorPopup/ErrorPopup";
import { errorAlertState } from "./slices/utils/errorAlertSlice";
import Product from "./components/Product/Product";
import Products from "./components/Products/Products";
import Search from "./components/Search/Search";
import LoginOrSignUp from "./components/LoginOrSignUp/LoginOrSignUp";
import { loadUser, userState } from "./slices/user/userSlice";
import UserOptions from "./components/UserOptions/UserOptions";
import Account from "./components/Account/Account";
import EditProfile from "./components/EditProfile/EditProfile";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import EditPassword from "./components/EditPassword/EditPassword";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Shipping/Shipping";
import ConfirmOrder from "./components/ConfirmOrder/ConfirmOrder";
import {
  getShippingInfo,
  shippingState,
} from "./slices/shopping/shippingSlice";
import { getCart } from "./slices/shopping/cartSlice";
import axios from "axios";
import Payment from "./components/Payment/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/OrderSuccess/OrderSuccess";
import MyOrders from "./components/MyOrders/MyOrders";
import { getMyOrders, orderState } from "./slices/shopping/orderSlice";
import Order from "./components/Order/Order";
import Dashboard from "./components/Dashboard/Dashboard";
import ProductList from "./components/ProductList/ProductList";
import CreateProduct from "./components/CreateProduct/CreateProduct";
import EditProduct from "./components/EditProduct/EditProduct";
import OrderList from "./components/OrderList/OrderList";
import EditOrder from "./components/EditOrder/EditOrder";
import UserList from "./components/UserList/UserList";
import ReviewList from "./components/ReviewList/ReviewList";
import NotFound from "./components/NotFound/NotFound";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";

function App() {
  const dispatch = useDispatch();

  const { error } = useSelector(errorAlertState);
  const { isAuthenticated, user } = useSelector(userState);
  const { status } = useSelector(shippingState);
  const { status: orderStatus } = useSelector(orderState);

  const [stripeApiKey, setStripeApiKey] = React.useState("");

  async function getStripeApiKey() {
    const response = await axios.get("/api/v1/stripeApiKey");

    setStripeApiKey(response.data.stripeApiKey);
  }

  //Loading things like fonts, user data, cart, shipping details etc. everytime the app mounts.
  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    dispatch(loadUser());
  }, [dispatch]);

  //Every time a new authentication happens re-fetch cart nd shipping details.
  React.useEffect(() => {
    if (isAuthenticated) {
      getStripeApiKey();
      dispatch(getCart());
      dispatch(getShippingInfo());
      dispatch(getMyOrders());
    }
  }, [isAuthenticated, dispatch]);

  //Below line of code can be used to prevent rightCLick on website to do inspect
  //and stuff but thats bad practice so i am commenting it.
  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/payment" component={Payment} />
        </Elements>
      )}

      <Switch>
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/" component={Home} />
        <Route exact path="/product/:id" component={Product} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/products/:keyword" component={Products} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/login" component={LoginOrSignUp} />
        <Route exact path="/password/forgot" component={ForgotPassword} />
        <Route exact path="/password/reset/:token" component={ResetPassword} />
        <ProtectedRoute exact path="/cart" component={Cart} />
        <ProtectedRoute exact path="/account" component={Account} />
        <ProtectedRoute exact path="/me/update" component={EditProfile} />
        <ProtectedRoute
          exact
          path="/password/update"
          component={EditPassword}
        />
        {(["succeeded", "failed"].includes(status) || !isAuthenticated) && (
          <ProtectedRoute exact path="/shipping" component={Shipping} />
        )}
        <ProtectedRoute exact path="/success" component={OrderSuccess} />
        {(["succeeded", "failed"].includes(orderStatus) ||
          !isAuthenticated) && (
          <ProtectedRoute exact path="/orders" component={MyOrders} />
        )}
        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
        <ProtectedRoute exact path="/order/:orderId" component={Order} />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/dashboard"
          component={Dashboard}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/products"
          component={ProductList}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/product"
          component={CreateProduct}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/product/:id"
          component={EditProduct}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/orders"
          component={OrderList}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/order/:id"
          component={EditOrder}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/users"
          component={UserList}
        />
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/reviews"
          component={ReviewList}
        />
        {/* As payment component is outside switch, when we go to payment path it will try to render
        but switch will also try to find a match within itself which will lead to rendering NotFound
        So we made so tht NotFound only used when path isnt "/payment" */}
        <Route
          exact
          component={window.location.pathname === "/payment" ? null : NotFound}
        />
      </Switch>
      <Footer />
      {error && <ErrorPopup text={error} />}
    </Router>
  );
}

export default App;
