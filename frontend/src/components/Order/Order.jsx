import { Typography } from "@material-ui/core";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  clearError,
  getOrderById,
  orderState,
} from "../../slices/shopping/orderSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import Loader from "../Loader/Loader";
import MetaData from "../miscellaneous/MetaData";
import "./Order.css";

const Order = ({ match }) => {
  const dispatch = useDispatch();

  const { status, orderById, error } = useSelector(orderState);

  const address = `${orderById?.shippingInfo?.address},${orderById?.shippingInfo?.city}-${orderById?.shippingInfo?.pincode},${orderById?.shippingInfo?.state},${orderById?.shippingInfo?.country}`;

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(getOrderById(match.params.orderId));
  }, [match.params.orderId, dispatch]);

  return (
    <Fragment>
      <MetaData title={`Order | ${match.params.orderId}`} />
      {status === "loading" || status === "idle" ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="orderDetailsPage">
            <div className="orderDetailsContainer">
              <Typography component="h1">Order #{orderById._id}</Typography>
              <Typography>Shipping Info</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p>Name:</p>
                  <span>{orderById?.user?.name}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>{orderById?.shippingInfo?.phoneNo}</span>
                </div>
                <div>
                  <p>Address:</p>
                  <span>{address}</span>
                </div>
              </div>
              <Typography>Payment</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p className="greenColor">PAID</p>
                </div>
                <div>
                  <p>Amount:</p>
                  <span>{orderById.totalPrice}</span>
                </div>
              </div>
              <Typography>Order Status</Typography>
              <div className="orderDetailsContainerBox">
                <p
                  className={
                    orderById.orderStatus === "Delivered"
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  {orderById.orderStatus}
                </p>
              </div>
            </div>
            <div className="orderDetailsCartItems">
              <Typography>Order Items</Typography>
              <div className="orderDetailsCartItemsContainer">
                {orderById.orderItems &&
                  orderById.orderItems.map((item) => (
                    <div key={item.product}>
                      <img src={item.image} alt={`${item.name}`} />
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                      <span>
                        {item.quantity} X {item.price} ={" "}
                        <b>₹{item.price * item.quantity}</b>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Order;
