import React, { Fragment, useState } from "react";
import "./UserOptions.css";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Profile from "../../images/Profile.png";
import {
  Dashboard,
  Person,
  ExitToApp,
  ListAlt,
  ShoppingCartOutlined,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../slices/user/userSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import { Backdrop } from "@material-ui/core";
import { cartState, resetCartState } from "../../slices/shopping/cartSlice";
import { resetShippingState } from "../../slices/shopping/shippingSlice";
import { resetOrderState } from "../../slices/shopping/orderSlice";

const UserOptions = ({ user }) => {
  const dispatch = useDispatch();
  const { contents } = useSelector(cartState);

  const [open, setOpen] = useState(false);

  const history = useHistory();

  const totalCartItems = contents.reduce((accumulator, content) => {
    return accumulator + content.quantity;
  }, 0);

  const options = [
    { icon: <Person />, name: "Profile", func: account },
    {
      icon: (
        <ShoppingCartOutlined
          style={{ color: totalCartItems ? "tomato" : null }}
        />
      ),
      name: `Cart: ${totalCartItems}`,
      func: cart,
    },
    { icon: <ListAlt />, name: "Orders", func: orders },
    { icon: <ExitToApp />, name: "Log Out", func: logout },
  ];

  if (user.role === "admin") {
    options.splice(1, 0, {
      icon: <Dashboard />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function account() {
    history.push("/account");
  }
  function orders() {
    history.push("/orders");
  }
  function logout() {
    dispatch(logoutUser());
    dispatch(resetCartState());
    dispatch(resetShippingState());
    dispatch(resetOrderState());
    dispatch(setError("Logout Successful!"));
  }
  function dashboard() {
    history.push("/admin/dashboard");
  }
  function cart() {
    history.push("/cart");
  }

  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: 10 }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            src={user.avatar.url || Profile}
            className="speedDialIcon"
            alt="Profile"
          />
        }
      >
        {options.map((option) => (
          <SpeedDialAction
            key={option.name}
            icon={option.icon}
            tooltipTitle={option.name}
            onClick={option.func}
            tooltipOpen={window.matchMedia("(hover:none)").matches} //window.matchMedia is used to do media queries in js. It returns a obj
            //that contains a key called matches which is true if the current window matches the given query requirement.
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
