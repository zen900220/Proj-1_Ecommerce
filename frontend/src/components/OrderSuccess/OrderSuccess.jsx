import React, { Fragment } from "react";
import "./OrderSuccess.css";
import { CheckCircle } from "@material-ui/icons";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <Fragment>
      <div className="orderSuccess">
        <CheckCircle />
        <Typography>Your Order Has Been Placed Successfully</Typography>
        <Link to="/orders">View Orders</Link>
      </div>
    </Fragment>
  );
};

export default OrderSuccess;
